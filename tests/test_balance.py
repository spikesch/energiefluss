"""Split sensors and filling gaps of the energy balance."""

from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

import pytest

_path = Path(__file__).parents[1] / "custom_components" / "energiefluss" / "calc.py"
if "ef_calc" not in sys.modules:
    _spec = importlib.util.spec_from_file_location("ef_calc", _path)
    _mod = importlib.util.module_from_spec(_spec)
    sys.modules["ef_calc"] = _mod
    _spec.loader.exec_module(_mod)  # type: ignore[union-attr]
calc = sys.modules["ef_calc"]
BatteryInput, Inputs, compute = calc.BatteryInput, calc.Inputs, calc.compute


def test_split_battery_charge_and_discharge():
    b = BatteryInput(split=True, charge=800, discharge=0)
    assert b.normalized_power == 800
    b = BatteryInput(split=True, charge=0, discharge=600)
    assert b.normalized_power == -600
    assert BatteryInput(split=True).normalized_power is None


def test_split_grid_like_tibber():
    # Tibber Pulse: power (import) and power_production (export), both positive
    r = compute(Inputs(solar_strings=[3000], grid_split=True, grid_import_power=0, grid_export_power=1200))
    assert r.grid_power == -1200
    assert r.grid_import == 0
    assert r.grid_export == 1200
    assert r.home_power == 1800
    assert r.computed == {"home"}


def test_grid_computed_from_measured_house():
    r = compute(Inputs(solar_strings=[2000], batteries=[BatteryInput(500, 50)], home_measured=1800))
    assert r.grid_power == pytest.approx(300)  # 1800 + 500 - 2000
    assert r.grid_import == pytest.approx(300)
    assert r.computed == {"grid"}


def test_solar_computed_when_no_strings():
    r = compute(Inputs(grid_power=-500, batteries=[BatteryInput(1000, 50)], home_measured=1500))
    assert r.solar_power == pytest.approx(3000)  # 1500 + 1000 - (-500)
    assert r.computed == {"solar"}


def test_single_unmeasured_battery_from_balance():
    bats = [BatteryInput(400, 50), BatteryInput(soc=80, measured=False)]
    r = compute(Inputs(solar_strings=[3000], grid_power=0, home_measured=2000, batteries=bats))
    assert r.battery_powers == [400, pytest.approx(600)]
    assert r.battery_power == pytest.approx(1000)
    assert r.computed == {"battery_2"}


def test_unavailable_sensor_is_not_replaced_by_a_computed_value():
    r = compute(Inputs(solar_strings=[2000], grid_power=None, grid_configured=True, home_measured=1500))
    assert r.grid_power is None
    assert "grid" not in r.computed


def test_charge_and_discharge_totals():
    bats = [BatteryInput(800, 50), BatteryInput(-300, 40), BatteryInput(split=True, charge=0, discharge=200)]
    r = compute(Inputs(batteries=bats))
    assert r.battery_charge == 800
    assert r.battery_discharge == 500
    assert r.battery_power == 300


def test_backup_loads_are_not_part_of_the_house():
    r = compute(
        Inputs(solar_strings=[3000], grid_power=0, fixed_loads=[500], flexible_loads=[1000], backup_loads=[300, None])
    )
    assert r.home_power == 3000
    assert r.backup_power == 300
    assert r.unmeasured_power == 1500


def test_battery_inputs_never_count_to_the_house():
    # a meter counts the socket battery's 1200 W as house consumption: the balance does not
    bats = [BatteryInput(power=900), BatteryInput(power=1200)]
    r = compute(Inputs(solar_strings=[800], grid_power=2800, home_measured=2700, batteries=bats, fixed_loads=[1000]))
    assert r.home_power == 1500  # 800 + 2800 - 900 - 1200, not the meter's 2700
    assert r.unmeasured_power == 500
    r = compute(Inputs(solar_strings=[800], grid_power=2800, home_measured=2700, batteries=bats[:1], fixed_loads=[1000]))
    assert r.home_power == 2700
    assert r.unmeasured_power == 1700


def test_battery_output_counts_only_as_far_as_it_feeds_the_house():
    # 1000 W out, 300 W of it on its own backup sockets: 700 W reach the house
    bats = [BatteryInput(power=-1000, backup=300)]
    r = compute(Inputs(solar_strings=[0], grid_power=100, batteries=bats, backup_loads=[300]))
    assert r.home_power == 800
    # a battery that only feeds its backup sockets gives the house nothing
    bats = [BatteryInput(power=-1000, backup=300, backup_only=True)]
    r = compute(Inputs(solar_strings=[0], grid_power=100, batteries=bats, backup_loads=[300]))
    assert r.home_power == 100


def test_wallbox_controllable_by_default():
    r = compute(Inputs(solar_strings=[5000], grid_power=2000, flexible_loads=[500], wallbox=4000))
    assert r.wallbox_power == 4000
    assert r.flexible_power == 4500  # wallbox counts as controllable
    assert r.unmeasured_power == 2500  # 7000 - 4500


def test_wallbox_not_controllable():
    r = compute(Inputs(solar_strings=[5000], grid_power=2000, flexible_loads=[500], wallbox=4000, wallbox_flexible=False))
    assert r.flexible_power == 500
    assert r.unmeasured_power == 2500  # still subtracted once


def test_contained_loads_are_not_counted_twice():
    configured = {"sensor.neubau", "sensor.kettle", "sensor.tv", "sensor.ghost_parent"}
    links = calc.valid_parents(
        {
            "sensor.kettle": "sensor.neubau",  # valid
            "sensor.tv": "sensor.tv",  # itself -> dropped
            "sensor.missing": "sensor.neubau",  # not configured -> dropped
        },
        configured,
    )
    assert links == {"sensor.kettle": "sensor.neubau"}
    # chains are cut: a child can't be a parent at the same time
    assert calc.valid_parents({"a": "b", "b": "c"}, {"a", "b", "c"}) == {"b": "c"}


def test_pass_through_battery_with_separate_input_and_output():
    # 816 W in from a house socket, 743 W out to its own backup sockets only
    bats = [BatteryInput(split=True, charge=816, discharge=743, backup_only=True), BatteryInput(power=936)]
    r = compute(Inputs(solar_strings=[743], grid_power=2434, batteries=bats, home_measured=1752))
    assert r.home_power == 743 + 2434 - 936 - 816
    assert r.battery_powers[0] == 73
