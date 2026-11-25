"""Pure calculation logic for Energiefluss.

No Home Assistant imports here, so this module can be unit-tested on its own.

Sign conventions of all *normalized* values produced here:
- solar_power   >= 0
- battery power  > 0  charging,  < 0 discharging
- grid_power     > 0  import,    < 0 export
- home_power    >= 0
"""

from __future__ import annotations

from dataclasses import dataclass, field

_POWER_FACTORS = {
    "W": 1.0,
    "kW": 1000.0,
    "MW": 1_000_000.0,
    "mW": 0.001,
}


def parse_float(state: str | None) -> float | None:
    """Parse a HA state string, returning None for unknown/unavailable."""
    if state is None:
        return None
    try:
        return float(state)
    except (TypeError, ValueError):
        return None


def to_watts(state: str | None, unit: str | None) -> float | None:
    """Convert a power state to watts based on its unit (W assumed if unknown)."""
    value = parse_float(state)
    if value is None:
        return None
    return value * _POWER_FACTORS.get(unit or "W", 1.0)


@dataclass
class BatteryInput:
    """One battery's raw readings (power already in W, sign as configured)."""

    power: float | None
    soc: float | None
    capacity_kwh: float | None = None
    invert: bool = False

    @property
    def normalized_power(self) -> float | None:
        """Power with charging positive."""
        if self.power is None:
            return None
        return -self.power if self.invert else self.power


@dataclass
class Inputs:
    """Everything the calculation needs, already converted to W."""

    solar_strings: list[float | None] = field(default_factory=list)
    batteries: list[BatteryInput] = field(default_factory=list)
    grid_power: float | None = None
    grid_invert: bool = False
    home_measured: float | None = None
    fixed_loads: list[float | None] = field(default_factory=list)
    flexible_loads: list[float | None] = field(default_factory=list)


@dataclass
class Result:
    """Normalized and derived values."""

    solar_power: float | None
    battery_powers: list[float | None]
    battery_socs: list[float | None]
    battery_power: float | None
    battery_soc: float | None
    battery_energy_kwh: float | None
    grid_power: float | None
    grid_import: float | None
    grid_export: float | None
    home_power: float | None
    fixed_power: float | None
    flexible_power: float | None
    unmeasured_power: float | None
    surplus: float | None


def _sum(values: list[float | None]) -> float | None:
    known = [v for v in values if v is not None]
    return sum(known) if known else None


def combined_soc(batteries: list[BatteryInput]) -> float | None:
    """Capacity-weighted SoC; plain average if any capacity is missing."""
    with_soc = [b for b in batteries if b.soc is not None]
    if not with_soc:
        return None
    if all(b.capacity_kwh for b in with_soc):
        total = sum(b.capacity_kwh for b in with_soc)  # type: ignore[misc]
        return sum(b.soc * b.capacity_kwh for b in with_soc) / total  # type: ignore[operator]
    return sum(b.soc for b in with_soc) / len(with_soc)  # type: ignore[misc]


def remaining_energy_kwh(batteries: list[BatteryInput]) -> float | None:
    """Stored energy over all batteries that have both SoC and capacity."""
    parts = [
        b.soc / 100 * b.capacity_kwh
        for b in batteries
        if b.soc is not None and b.capacity_kwh
    ]
    return sum(parts) if parts else None


def compute(inp: Inputs) -> Result:
    """Derive all normalized values from the inputs."""
    solar = _sum(inp.solar_strings)
    if solar is not None:
        solar = max(solar, 0.0)

    bat_powers = [b.normalized_power for b in inp.batteries]
    bat_total = _sum(bat_powers)

    grid = inp.grid_power
    if grid is not None and inp.grid_invert:
        grid = -grid

    grid_import = max(grid, 0.0) if grid is not None else None
    grid_export = max(-grid, 0.0) if grid is not None else None

    fixed = _sum(inp.fixed_loads)
    flexible = _sum(inp.flexible_loads)

    if inp.home_measured is not None:
        home: float | None = max(inp.home_measured, 0.0)
    elif solar is None and grid is None and bat_total is None:
        home = None
    else:
        # Energy balance: what comes in (PV + grid) minus what goes into the
        # battery is the house's total consumption (all loads included).
        home = max((solar or 0.0) + (grid or 0.0) - (bat_total or 0.0), 0.0)

    # Part of the house consumption no load sensor accounts for (base load).
    unmeasured = None
    if home is not None and (fixed is not None or flexible is not None):
        unmeasured = max(home - (fixed or 0.0) - (flexible or 0.0), 0.0)

    surplus = None
    if solar is not None and home is not None:
        surplus = solar - home

    return Result(
        solar_power=solar,
        battery_powers=bat_powers,
        battery_socs=[b.soc for b in inp.batteries],
        battery_power=bat_total,
        battery_soc=combined_soc(inp.batteries),
        battery_energy_kwh=remaining_energy_kwh(inp.batteries),
        grid_power=grid,
        grid_import=grid_import,
        grid_export=grid_export,
        home_power=home,
        fixed_power=fixed,
        flexible_power=flexible,
        unmeasured_power=unmeasured,
        surplus=surplus,
    )


# Gaps longer than this (e.g. HA was down) are not integrated: we don't know
# what the device did in between.
MAX_GAP_SECONDS = 15 * 60
BUCKET_SECONDS = 5 * 60
KEEP_SECONDS = 25 * 3600  # enough for "since midnight" and "last 24 h"
DAY_SECONDS = 24 * 3600


@dataclass
class EnergyCounter:
    """Integrates a power reading (W) into energy (kWh) kept in 5-minute buckets.

    Left Riemann sum: the last known power is assumed until the next reading.
    Call ``update`` on every new reading and periodically (e.g. every 30 s) so
    constant loads are counted too. Buckets older than 25 h are dropped, which
    is enough to answer both "since midnight" and "rolling 24 hours".
    """

    buckets: dict[int, float] = field(default_factory=dict)
    _last_w: float | None = None
    _last_ts: float | None = None

    def update(self, ts: float, watts: float | None) -> None:
        if self._last_w is not None and self._last_ts is not None:
            gap = ts - self._last_ts
            if 0 < gap <= MAX_GAP_SECONDS and self._last_w > 0:
                self._add(self._last_ts, ts, self._last_w)
        self._last_w = watts
        self._last_ts = ts
        cutoff = ts - KEEP_SECONDS
        for start in [b for b in self.buckets if b + BUCKET_SECONDS <= cutoff]:
            del self.buckets[start]

    def _add(self, t0: float, t1: float, watts: float) -> None:
        """Spread energy over the buckets the interval [t0, t1) touches."""
        t = t0
        while t < t1:
            start = int(t // BUCKET_SECONDS * BUCKET_SECONDS)
            end = min(t1, start + BUCKET_SECONDS)
            self.buckets[start] = self.buckets.get(start, 0.0) + watts * (end - t) / 3_600_000
            t = end

    def since(self, start_ts: float) -> float:
        """Energy in kWh from ``start_ts`` until now (partial bucket pro rata)."""
        total = 0.0
        for start, kwh in self.buckets.items():
            end = start + BUCKET_SECONDS
            if end <= start_ts:
                continue
            if start >= start_ts:
                total += kwh
            else:
                total += kwh * (end - start_ts) / BUCKET_SECONDS
        return total

    def to_dict(self) -> dict[str, float]:
        return {str(k): round(v, 6) for k, v in self.buckets.items()}

    @classmethod
    def from_dict(cls, data: dict[str, float] | None) -> EnergyCounter:
        return cls(buckets={int(k): float(v) for k, v in (data or {}).items()})


def window_start(mode: str, now_ts: float, midnight_ts: float) -> float:
    """Start of the energy window: local midnight or 24 hours back."""
    return now_ts - DAY_SECONDS if mode == "rolling24" else midnight_ts
