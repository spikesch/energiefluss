"""Where a sensor is used elsewhere and what it is called there."""

from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

_path = Path(__file__).parents[1] / "custom_components" / "energiefluss" / "usage.py"
_spec = importlib.util.spec_from_file_location("ef_usage", _path)
usage = importlib.util.module_from_spec(_spec)
sys.modules["ef_usage"] = usage
_spec.loader.exec_module(usage)  # type: ignore[union-attr]
Context, Helper = usage.Context, usage.Helper

PLUG = "sensor.plug_a4cf12_power"


def find(ctx, wanted=(PLUG,), current=None):
    return usage.find_usage(wanted, current or {PLUG: "plug_a4cf12 Power"}, ctx)


def names(result, entity=PLUG):
    return [n["name"] for n in result[entity]["names"]]


def test_nothing_found_nothing_reported():
    assert find(Context()) == {}


def test_card_names_from_nested_dashboard_cards():
    config = {
        "views": [
            {
                "cards": [
                    {"type": "tile", "entity": PLUG, "name": "Drucker"},
                    {"type": "vertical-stack", "cards": [{"type": "entities", "entities": [{"entity": PLUG, "name": "Drucker"}]}]},
                ]
            }
        ]
    }
    result = find(Context(dashboards=[("Strom", config)]))
    assert result[PLUG]["names"] == [{"name": "Drucker", "where": "Dashboard „Strom“"}]
    assert result[PLUG]["used"] == ["Dashboard „Strom“"]


def test_use_without_a_name_and_names_that_are_no_names():
    config = {
        "cards": [
            {"type": "entities", "entities": [PLUG]},
            {"entity": PLUG, "name": "{{ states('x') }}"},
            {"entity": PLUG, "name": {"type": "device"}},  # name object of newer tile cards
            {"entity": PLUG, "name": "PLUG_A4CF12 POWER"},  # what it is called anyway
        ]
    }
    result = find(Context(dashboards=[("Home", config)]))
    assert result[PLUG] == {"names": [], "used": ["Dashboard „Home“"]}


def test_energy_dashboard_power_sensor_of_the_entry():
    energy = {"device_consumption": [{"stat_consumption": "sensor.kwh", "stat_rate": PLUG, "name": "Drucker"}]}
    assert find(Context(energy=energy))[PLUG]["names"] == [{"name": "Drucker", "where": "Energie-Dashboard"}]


def test_energy_dashboard_follows_helper_chain_back_to_the_power_sensor():
    ctx = Context(
        energy={"device_consumption": [{"stat_consumption": "sensor.trockner_monat", "name": "Trockner"}]},
        helpers=[
            Helper("Trockner Energie", "Integral", [PLUG], ["sensor.trockner_energie"]),
            Helper("Trockner Monat", "Verbrauchszähler", ["sensor.trockner_energie"], ["sensor.trockner_monat"]),
        ],
    )
    result = find(ctx)
    assert names(result) == ["Trockner", "Trockner Energie"]
    assert result[PLUG]["used"] == ["Energie-Dashboard", "Integral „Trockner Energie“"]


def test_energy_dashboard_via_device_only_if_unambiguous():
    energy = {"device_consumption": [{"stat_consumption": "sensor.plug_energy", "name": "Drucker"}]}
    device_of = {"sensor.plug_energy": "d1", PLUG: "d1"}
    result = find(Context(energy=energy, device_of=device_of, power_sensors={PLUG}))
    assert result[PLUG]["names"] == [{"name": "Drucker", "where": "Energie-Dashboard (gleiches Gerät)"}]
    # a second channel on the same device: which one is meant is unknown
    device_of["sensor.channel_2_power"] = "d1"
    assert find(Context(energy=energy, device_of=device_of, power_sensors={PLUG, "sensor.channel_2_power"})) == {}


def test_energy_sources_count_as_use():
    energy = {"energy_sources": [{"type": "solar", "stat_rate": PLUG}]}
    assert find(Context(energy=energy))[PLUG] == {"names": [], "used": ["Energie-Dashboard"]}


def test_group_name_is_not_offered_for_a_member():
    ctx = Context(helpers=[Helper("Büro gesamt", "Gruppe", [PLUG, "sensor.other"])])
    assert find(ctx)[PLUG] == {"names": [], "used": ["Gruppe „Büro gesamt“"]}


def test_voice_aliases_and_automations():
    ctx = Context(aliases={PLUG: ["Drucker Strom"]}, consumers={PLUG: ["Automation „Drucker aus“"]})
    assert find(ctx)[PLUG] == {
        "names": [{"name": "Drucker Strom", "where": "Sprachassistent"}],
        "used": ["Automation „Drucker aus“"],
    }


def test_unwanted_entities_are_ignored():
    config = {"cards": [{"entity": "sensor.other", "name": "Fremd"}]}
    assert find(Context(dashboards=[("Home", config)])) == {}
