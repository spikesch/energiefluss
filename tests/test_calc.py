"""Tests for the pure calculation module (no Home Assistant needed)."""

from __future__ import annotations

import importlib.util
from pathlib import Path

import pytest

_path = Path(__file__).parents[1] / "custom_components" / "energiefluss" / "calc.py"
_spec = importlib.util.spec_from_file_location("ef_calc", _path)
calc = importlib.util.module_from_spec(_spec)
assert _spec.loader
import sys

sys.modules["ef_calc"] = calc
_spec.loader.exec_module(calc)

BatteryInput, Inputs, compute = calc.BatteryInput, calc.Inputs, calc.compute


@pytest.mark.parametrize(
    ("state", "unit", "expected"),
    [("1.5", "kW", 1500.0), ("230", "W", 230.0), ("230", None, 230.0), ("unavailable", "W", None), (None, "W", None)],
)
def test_to_watts(state, unit, expected):
    assert calc.to_watts(state, unit) == expected


def test_empty_inputs_give_unknowns():
    r = compute(Inputs())
    assert r.solar_power is None
    assert r.home_power is None
    assert r.battery_soc is None


def test_home_is_computed_from_balance():
    # 3 kW PV, battery charges 1 kW, exports 500 W -> house uses 1.5 kW
    r = compute(Inputs(solar_strings=[2000, 1000], batteries=[BatteryInput(1000, 50)], grid_power=-500))
    assert r.solar_power == 3000
    assert r.grid_import == 0
    assert r.grid_export == 500
    assert r.home_power == 1500
    assert r.surplus == 1500


def test_unavailable_home_sensor_falls_back_to_balance():
    # a house sensor is configured but has no value right now
    r = compute(Inputs(solar_strings=[1000], grid_power=200, home_measured=None, home_configured=True))
    assert r.home_power == 1200
    assert "home" in r.computed


def test_measured_home_wins():
    r = compute(Inputs(solar_strings=[1000], grid_power=200, home_measured=900))
    assert r.home_power == 900


def test_inversions():
    r = compute(
        Inputs(batteries=[BatteryInput(-800, 40, invert=True)], grid_power=-300, grid_invert=True)
    )
    assert r.battery_powers == [800]  # charging
    assert r.grid_power == 300  # import


def test_three_batteries_weighted_soc_and_energy():
    bats = [BatteryInput(0, 50, 10), BatteryInput(0, 100, 5), BatteryInput(None, 20, 5)]
    r = compute(Inputs(batteries=bats))
    assert r.battery_soc == pytest.approx((500 + 500 + 100) / 20)
    assert r.battery_energy_kwh == pytest.approx(5 + 5 + 1)


def test_soc_average_without_capacity():
    r = compute(Inputs(batteries=[BatteryInput(0, 40), BatteryInput(0, 60, 7.5)]))
    assert r.battery_soc == 50


def test_missing_string_is_ignored():
    r = compute(Inputs(solar_strings=[None, 400]))
    assert r.solar_power == 400


def test_home_never_negative():
    r = compute(Inputs(solar_strings=[0], batteries=[BatteryInput(2000, 50)], grid_power=100))
    assert r.home_power == 0


def test_loads_are_part_of_home_and_rest_is_unmeasured():
    # 3 kW PV + 2 kW import, battery idle -> house uses 5 kW in total
    r = compute(
        Inputs(
            solar_strings=[3000],
            batteries=[BatteryInput(0, 50)],
            grid_power=2000,
            fixed_loads=[80, None, 120],
            flexible_loads=[1800, 2000],
        )
    )
    assert r.home_power == 5000
    assert r.fixed_power == 200
    assert r.flexible_power == 3800
    assert r.unmeasured_power == 1000


def test_no_loads_means_no_unmeasured_value():
    r = compute(Inputs(solar_strings=[1000]))
    assert r.unmeasured_power is None
    assert r.flexible_power is None


EnergyCounter = calc.EnergyCounter


def _run(c, start, end, watts, step=30):
    for t in range(start, end + 1, step):
        c.update(t, watts)


def test_energy_counter_integrates_constant_power():
    c = EnergyCounter()
    _run(c, 0, 3600, 1000)
    assert c.since(0) == pytest.approx(1.0)


def test_since_midnight_vs_rolling_24h():
    c = EnergyCounter()
    day = 86400
    _run(c, day - 3600, day, 1000)  # 23:00-24:00 yesterday: 1 kWh
    _run(c, day, day + 1800, 2000)  # 00:00-00:30 today: 1 kWh
    now = day + 1800
    assert c.since(calc.window_start("midnight", now, day)) == pytest.approx(1.0)
    assert c.since(calc.window_start("rolling24", now, day)) == pytest.approx(2.0)


def test_rolling_window_cuts_partial_bucket():
    c = EnergyCounter()
    _run(c, 0, 600, 3600)  # 3.6 kW for 10 min = 0.6 kWh in two buckets
    assert c.since(150) == pytest.approx(0.45)


def test_energy_counter_skips_long_gaps_and_unknown():
    c = EnergyCounter()
    c.update(0, 1000)
    c.update(3600, 1000)  # 1 h gap -> ignored
    assert c.since(0) == 0
    c.update(3660, None)  # 60 s at 1000 W counted, then unknown
    c.update(3720, 500)  # unknown interval -> nothing
    assert c.since(0) == pytest.approx(1000 * 60 / 3_600_000)


def test_old_buckets_are_dropped_and_roundtrip():
    c = EnergyCounter()
    _run(c, 0, 600, 1000)
    _run(c, 26 * 3600, 26 * 3600 + 60, 1000)
    assert min(c.buckets) >= 26 * 3600 - calc.KEEP_SECONDS
    again = EnergyCounter.from_dict(c.to_dict())
    assert again.since(0) == pytest.approx(c.since(0), abs=1e-5)
