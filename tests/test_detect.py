"""Sensor suggestions for common setups."""

from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

_path = Path(__file__).parents[1] / "custom_components" / "energiefluss" / "detect.py"
_spec = importlib.util.spec_from_file_location("ef_detect", _path)
detect = importlib.util.module_from_spec(_spec)
sys.modules["ef_detect"] = detect
_spec.loader.exec_module(detect)  # type: ignore[union-attr]
S = detect.SensorInfo


def test_tibber_pulse_with_price_and_daily_values():
    sensors = [
        S("sensor.power_home", "Power", "tibber", "d1", "Tibber Pulse Home", "W", "power"),
        S("sensor.power_production_home", "Power production", "tibber", "d1", "Tibber Pulse Home", "W", "power"),
        S("sensor.electricity_price_home", "Electricity price", "tibber", "d2", "Home", "EUR/kWh"),
        S("sensor.accumulated_consumption_home", "Accumulated consumption", "tibber", "d1", "Tibber Pulse Home", "kWh", "energy"),
        S("sensor.accumulated_production_home", "Accumulated production", "tibber", "d1", "Tibber Pulse Home", "kWh", "energy"),
        S("sensor.phone_battery_level", "Battery level", "mobile_app", "p", "Phone", "%", "battery"),
    ]
    out = detect.suggest(sensors)
    assert out["grid"]["value"] == {
        "grid_mode": "split",
        "grid_import_power": "sensor.power_home",
        "grid_export_power": "sensor.power_production_home",
    }
    assert out["grid"]["source"] == "Tibber"
    assert out["grid_price"]["value"] == "sensor.electricity_price_home"
    assert out["grid_import_today"]["value"] == "sensor.accumulated_consumption_home"
    assert out["grid_export_today"]["value"] == "sensor.accumulated_production_home"
    assert "batteries" not in out  # the phone battery is ignored


def _sim() -> list:
    def p(eid, name, unit="W"):
        return S(eid, name, "template", None, None, unit, "power")

    return [
        p("sensor.pv_westnord", "PV Westnord"),
        p("sensor.pv_ost", "PV Ost"),
        p("sensor.senec_leistung", "Senec Leistung"),
        S("sensor.senec_soc", "Senec SoC", "template", None, None, "%", "battery"),
        p("sensor.speicher_3_leistung_kw_laden_negativ", "Speicher 3 Leistung (kW, Laden negativ)", "kW"),
        S("sensor.speicher_3_soc", "Speicher 3 SoC", "template", None, None, "%", "battery"),
        p("sensor.speicher_4_laden", "Speicher 4 Laden"),
        p("sensor.speicher_4_entladen", "Speicher 4 Entladen"),
        S("sensor.speicher_4_soc", "Speicher 4 SoC", "template", None, None, "%", "battery"),
        p("sensor.netz_leistung", "Netz Leistung"),
        p("sensor.tibber_bezug", "Tibber Bezug"),
        p("sensor.tibber_einspeisung", "Tibber Einspeisung"),
        S("sensor.strompreis", "Strompreis", "template", None, None, "EUR/kWh", "monetary"),
        S("sensor.einspeisung_heute", "Einspeisung heute", "template", None, None, "kWh", "energy"),
        S("sensor.netzbezug_heute", "Netzbezug heute", "template", None, None, "kWh", "energy"),
        S("sensor.pv_prognose_rest", "PV Prognose Rest", "template", None, None, "kWh", "energy"),
        S("sensor.pv_heute", "PV heute", "template", None, None, "kWh", "energy"),
        p("sensor.haus_leistung_gemessen", "Haus Leistung gemessen"),
        p("sensor.kuhlschrank", "Kühlschrank"),
        p("sensor.waschmaschine", "Waschmaschine"),
        p("sensor.hyper_2000_bat_in_out", "Hyper 2000 Batterieleistung"),
        S("sensor.energiefluss_pv_leistung", "PV-Leistung", "energiefluss", "x", "Energiefluss", "W", "power"),
    ]


def test_generic_names():
    out = detect.suggest(_sim())
    assert out["solar_strings"]["value"] == ["sensor.pv_westnord", "sensor.pv_ost"]
    assert out["solar_today"]["value"] == "sensor.pv_heute"
    assert out["solar_forecast_remaining"]["value"] == "sensor.pv_prognose_rest"
    assert out["grid"]["value"]["grid_mode"] == "split"
    assert out["grid"]["value"]["grid_import_power"] == "sensor.tibber_bezug"
    assert out["grid"]["value"]["grid_export_power"] == "sensor.tibber_einspeisung"
    assert out["grid_price"]["value"] == "sensor.strompreis"
    assert out["grid_import_today"]["value"] == "sensor.netzbezug_heute"
    assert out["grid_export_today"]["value"] == "sensor.einspeisung_heute"
    assert out["home_power"]["value"] == "sensor.haus_leistung_gemessen"

    bats = {b["value"]["name"]: b["value"] for b in out["batteries"]}
    assert bats["Senec"] == {"name": "Senec", "mode": "combined", "power": "sensor.senec_leistung", "soc": "sensor.senec_soc"}
    assert bats["Speicher 3"]["mode"] == "combined"
    assert bats["Speicher 3"]["soc"] == "sensor.speicher_3_soc"
    assert bats["Speicher 4"] == {
        "name": "Speicher 4",
        "mode": "split",
        "charge_power": "sensor.speicher_4_laden",
        "discharge_power": "sensor.speicher_4_entladen",
        "soc": "sensor.speicher_4_soc",
    }
    # "in_out" is one signed sensor, not a split pair
    assert bats["Hyper 2000 Batterie"] == {
        "name": "Hyper 2000 Batterie",
        "mode": "combined",
        "power": "sensor.hyper_2000_bat_in_out",
    }

    loads = [l["entity"] for l in out["loads"]]
    assert loads == ["sensor.kuhlschrank", "sensor.waschmaschine"]
    assert all("energiefluss" not in e for e in loads)


def test_wallbox_and_car():
    sensors = [
        S("sensor.go_echarger_123_nrg", "go-eCharger Leistung", "goecharger", "w1", "go-eCharger", "W", "power"),
        S("sensor.tesla_battery_level", "Model Y Battery level", "tesla_fleet", "c1", "Model Y", "%", "battery"),
        S("sensor.senec_leistung", "Senec Leistung", "template", None, None, "W", "power"),
        S("sensor.senec_soc", "Senec SoC", "template", None, None, "%", "battery"),
    ]
    out = detect.suggest(sensors)
    assert out["wallbox_power"]["value"] == "sensor.go_echarger_123_nrg"
    assert out["wallbox_soc"]["value"] == "sensor.tesla_battery_level"
    assert [b["value"]["name"] for b in out["batteries"]] == ["Senec"]  # the car is no house battery
    assert out["loads"] == []


def test_options_from_suggestions_and_summary():
    sensors = [
        S("sensor.pv1", "PV String 1", "template", None, None, "W", "power"),
        S("sensor.grid", "Netz Leistung", "template", None, None, "W", "power"),
        S("sensor.akku", "Batterie Leistung", "template", None, None, "W", "power"),
        S("sensor.akku_soc", "Batterie Ladestand", "template", None, None, "%", "battery"),
        S("sensor.fridge", "Kühlschrank", "shelly", "d2", "Plug", "W", "power"),
    ]
    sg = detect.suggest(sensors)
    opts = detect.options_from_suggestions(sg)
    assert "sensor.pv1" in opts["solar_strings"]
    assert opts["batteries"] and "loads" not in opts
    text = detect.summary(sg, lambda e: e.upper())
    assert "SENSOR.PV1" in text and text.startswith("- ")
    assert detect.summary({}, str) == ""
