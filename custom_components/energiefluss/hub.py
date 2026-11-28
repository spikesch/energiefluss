"""Hub: watches the configured source entities and keeps a computed snapshot."""

from __future__ import annotations

from collections.abc import Callable
from datetime import timedelta
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import ATTR_UNIT_OF_MEASUREMENT
from homeassistant.core import Event, EventStateChangedData, HomeAssistant, callback
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_interval,
)
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .calc import (
    BatteryInput,
    EnergyCounter,
    Inputs,
    Result,
    compute,
    parse_float,
    to_watts,
    valid_parents,
    window_start,
)
from .const import (
    CONF_BACKUP_LOADS,
    CONF_BATTERY_BACKUP_ONLY,
    CONF_BATTERIES,
    CONF_BATTERY_CAPACITY,
    CONF_BATTERY_CHARGE,
    CONF_BATTERY_DISCHARGE,
    CONF_BATTERY_INVERT,
    CONF_BATTERY_MODE,
    CONF_BATTERY_POWER,
    CONF_BATTERY_SOC,
    CONF_ENERGY_PERIOD,
    CONF_FIXED_LOADS,
    CONF_FLEXIBLE_LOADS,
    CONF_GRID_EXPORT_POWER,
    CONF_GRID_IMPORT_POWER,
    CONF_GRID_INVERT,
    CONF_GRID_MODE,
    CONF_GRID_POWER,
    CONF_HOME_POWER,
    CONF_LOAD_PARENTS,
    CONF_SOLAR_STRINGS,
    CONF_SOLAR_TOTAL,
    CONF_WALLBOX_FLEXIBLE,
    CONF_WALLBOX_POWER,
    CONF_WALLBOX_SOC,
    DOMAIN,
    ENERGY_TOTALS,
    MODE_SPLIT,
    PERIOD_MIDNIGHT,
)

# Energy counters are integrated on every change and on this tick; energy
# sensors are written on the tick only to keep the state machine calm.
ENERGY_TICK = timedelta(seconds=30)
SAVE_DELAY = 120  # seconds; counters survive restarts via HA storage


class EnergieflussHub:
    """Collects source states and recomputes on every change."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self.hass = hass
        self.entry = entry
        self.config: dict[str, Any] = dict(entry.options)
        self.result: Result = compute(Inputs())
        self._listeners: list[Callable[[], None]] = []
        self._energy_listeners: list[Callable[[], None]] = []
        self._unsubs: list[Callable[[], None]] = []
        keys = [*self.loads(), *ENERGY_TOTALS]
        self.energy: dict[str, EnergyCounter] = {k: EnergyCounter() for k in keys}
        self._store: Store[dict[str, Any]] = Store(hass, 1, f"{DOMAIN}.energy.{entry.entry_id}")

    # -- config helpers -------------------------------------------------
    @property
    def batteries(self) -> list[dict[str, Any]]:
        return list(self.config.get(CONF_BATTERIES) or [])

    def backup_loads(self) -> list[str]:
        """Backup loads: on each battery's own output."""
        ids: list[str] = []
        for bat in self.batteries:
            ids.extend(bat.get(CONF_BACKUP_LOADS) or [])
        return list(dict.fromkeys(ids))

    def load_parents(self) -> dict[str, str]:
        """Valid 'contained in' links: both sides configured, no chains."""
        return valid_parents(self.config.get(CONF_LOAD_PARENTS), set(self.loads()))

    def loads(self) -> list[str]:
        """All configured load entities (fixed first), without duplicates."""
        ids = [
            *(self.config.get(CONF_FIXED_LOADS) or []),
            *(self.config.get(CONF_FLEXIBLE_LOADS) or []),
            *self.backup_loads(),
            *([self.config[CONF_WALLBOX_POWER]] if self.config.get(CONF_WALLBOX_POWER) else []),
        ]
        return list(dict.fromkeys(ids))

    def source_entities(self) -> set[str]:
        """All entity ids the calculation depends on."""
        ids: set[str] = set(self.config.get(CONF_SOLAR_STRINGS) or [])
        if self.config.get(CONF_SOLAR_TOTAL):
            ids.add(self.config[CONF_SOLAR_TOTAL])
        ids.update(self.config.get(CONF_FIXED_LOADS) or [])
        ids.update(self.config.get(CONF_FLEXIBLE_LOADS) or [])
        ids.update(self.backup_loads())
        ids.update(self.config[k] for k in (CONF_WALLBOX_POWER, CONF_WALLBOX_SOC) if self.config.get(k))
        for bat in self.batteries:
            keys = (CONF_BATTERY_POWER, CONF_BATTERY_SOC, CONF_BATTERY_CHARGE, CONF_BATTERY_DISCHARGE)
            ids.update(bat[k] for k in keys if bat.get(k))
        for key in (CONF_GRID_POWER, CONF_GRID_IMPORT_POWER, CONF_GRID_EXPORT_POWER, CONF_HOME_POWER):
            if self.config.get(key):
                ids.add(self.config[key])
        return ids

    @property
    def energy_period(self) -> str:
        return str(self.config.get(CONF_ENERGY_PERIOD) or PERIOD_MIDNIGHT)

    def energy_kwh(self, key: str) -> float:
        """Energy of one counter for the configured window (midnight / 24 h)."""
        now = dt_util.now().timestamp()
        midnight = dt_util.start_of_local_day().timestamp()
        return self.energy[key].since(window_start(self.energy_period, now, midnight))

    # -- persistence ----------------------------------------------------
    async def async_load(self) -> None:
        data = await self._store.async_load() or {}
        for key in self.energy:
            if key in data:
                self.energy[key] = EnergyCounter.from_dict(data[key])

    def _data_to_save(self) -> dict[str, Any]:
        return {key: counter.to_dict() for key, counter in self.energy.items()}

    # -- lifecycle ------------------------------------------------------
    @callback
    def async_start(self) -> None:
        self._recompute()
        self._unsubs.append(
            async_track_state_change_event(self.hass, sorted(self.source_entities()), self._on_change)
        )
        self._unsubs.append(async_track_time_interval(self.hass, self._on_tick, ENERGY_TICK))

    @callback
    def async_stop(self) -> None:
        while self._unsubs:
            self._unsubs.pop()()
        self.hass.async_create_task(self._store.async_save(self._data_to_save()))

    @callback
    def async_add_listener(self, cb: Callable[[], None]) -> Callable[[], None]:
        """Called on every recompute (power values)."""
        return self._add(self._listeners, cb)

    @callback
    def async_add_energy_listener(self, cb: Callable[[], None]) -> Callable[[], None]:
        """Called on the periodic tick (energy counters)."""
        return self._add(self._energy_listeners, cb)

    @staticmethod
    def _add(target: list[Callable[[], None]], cb: Callable[[], None]) -> Callable[[], None]:
        target.append(cb)

        def remove() -> None:
            target.remove(cb)

        return remove

    # -- calculation ----------------------------------------------------
    def _watts(self, entity_id: str | None) -> float | None:
        if not entity_id:
            return None
        state = self.hass.states.get(entity_id)
        if state is None:
            return None
        return to_watts(state.state, state.attributes.get(ATTR_UNIT_OF_MEASUREMENT))

    def _number(self, entity_id: str | None) -> float | None:
        if not entity_id:
            return None
        state = self.hass.states.get(entity_id)
        return parse_float(state.state) if state else None

    def _battery(self, b: dict[str, Any]) -> BatteryInput:
        split = b.get(CONF_BATTERY_MODE) == MODE_SPLIT
        if split:
            measured = bool(b.get(CONF_BATTERY_CHARGE) or b.get(CONF_BATTERY_DISCHARGE))
        else:
            measured = bool(b.get(CONF_BATTERY_POWER))
        return BatteryInput(
            power=self._watts(b.get(CONF_BATTERY_POWER)),
            soc=self._number(b.get(CONF_BATTERY_SOC)),
            capacity_kwh=b.get(CONF_BATTERY_CAPACITY) or None,
            invert=bool(b.get(CONF_BATTERY_INVERT)),
            split=split,
            charge=self._watts(b.get(CONF_BATTERY_CHARGE)),
            discharge=self._watts(b.get(CONF_BATTERY_DISCHARGE)),
            measured=measured,
            backup=self._sum_watts(b.get(CONF_BACKUP_LOADS)),
            backup_only=bool(b.get(CONF_BATTERY_BACKUP_ONLY)),
        )

    def _sum_watts(self, entity_ids: list[str] | None) -> float | None:
        values = [w for w in (self._watts(e) for e in entity_ids or []) if w is not None]
        return sum(max(w, 0.0) for w in values) if values else None

    def _inputs(self) -> Inputs:
        cfg = self.config
        children = self.load_parents()
        grid_split = cfg.get(CONF_GRID_MODE) == MODE_SPLIT
        if grid_split:
            grid_configured = bool(cfg.get(CONF_GRID_IMPORT_POWER) or cfg.get(CONF_GRID_EXPORT_POWER))
        else:
            grid_configured = bool(cfg.get(CONF_GRID_POWER))
        return Inputs(
            solar_strings=[self._watts(e) for e in cfg.get(CONF_SOLAR_STRINGS) or []],
            solar_total=self._watts(cfg.get(CONF_SOLAR_TOTAL)),
            solar_total_configured=bool(cfg.get(CONF_SOLAR_TOTAL)),
            batteries=[self._battery(b) for b in self.batteries],
            grid_power=self._watts(cfg.get(CONF_GRID_POWER)),
            grid_invert=bool(cfg.get(CONF_GRID_INVERT)),
            grid_split=grid_split,
            grid_import_power=self._watts(cfg.get(CONF_GRID_IMPORT_POWER)),
            grid_export_power=self._watts(cfg.get(CONF_GRID_EXPORT_POWER)),
            grid_configured=grid_configured,
            home_measured=self._watts(cfg.get(CONF_HOME_POWER)),
            home_configured=bool(cfg.get(CONF_HOME_POWER)),
            # loads contained in another load are already part of its value
            fixed_loads=[self._watts(e) for e in cfg.get(CONF_FIXED_LOADS) or [] if e not in children],
            flexible_loads=[self._watts(e) for e in cfg.get(CONF_FLEXIBLE_LOADS) or [] if e not in children],
            backup_loads=[self._watts(e) for e in self.backup_loads() if e not in children],
            wallbox=self._watts(cfg.get(CONF_WALLBOX_POWER)),
            wallbox_flexible=bool(cfg.get(CONF_WALLBOX_FLEXIBLE, True)),
        )

    @callback
    def _integrate(self) -> None:
        """Feed current values to the counters (they integrate the previous ones)."""
        ts = dt_util.now().timestamp()
        for key, counter in self.energy.items():
            if key in ENERGY_TOTALS:
                watts = getattr(self.result, ENERGY_TOTALS[key][0])
            else:
                watts = self._watts(key)
            counter.update(ts, watts)

    @callback
    def _recompute(self) -> None:
        self.result = compute(self._inputs())
        self._integrate()
        for cb in list(self._listeners):
            cb()

    @callback
    def _on_change(self, _event: Event[EventStateChangedData]) -> None:
        self._recompute()

    @callback
    def _on_tick(self, _now: Any) -> None:
        self._integrate()
        self._store.async_delay_save(self._data_to_save, SAVE_DELAY)
        for cb in list(self._energy_listeners):
            cb()
