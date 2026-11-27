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
    # a lone power value without state of charge is no battery suggestion (helpers, managers)
    assert "Hyper 2000 Batterie" not in bats

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
    found = detect.choices(sg, lambda e: e.upper())
    assert any("SENSOR.PV1" in c["label"] for c in found)
    picked = detect.options_from_choices(found, [c["key"] for c in found if c["default"]])
    assert picked["solar_strings"] == opts["solar_strings"] and picked["batteries"] == opts["batteries"]
    assert detect.options_from_choices(found, []) == {}
    assert detect.choices({}, str) == []


def _crowded():
    """A big real-world install: several integrations see the same devices, many helpers."""

    def d(eid, name, dev, devname, unit="W", dc="power", state="1"):
        return S(eid, name, "x", dev, devname, unit, dc, state)

    def h(eid, name, unit="W", dc="power", state="1"):
        return S(eid, name, "template", None, None, unit, dc, state)

    return [
        d("sensor.power_1", "Inverter 7.1 Leistung", "inv", "Inverter 7.1", state="214"),
        d("sensor.max_active_power_1", "Inverter 7.1 Max. Wirkleistung", "inv", "Inverter 7.1", state="9"),
        d("sensor.power_1_0", "String 7.1.0 Leistung", "str", "String 7.1.0", state="214"),
        d("sensor.dpu_solar_1_in_power", "DELTA Pro Ultra Solar (1) In Power", "eco", "DELTA Pro Ultra", state="0"),
        d("sensor.dpu_solar_2_in_power", "DELTA Pro Ultra Solar (2) In Power", "eco", "DELTA Pro Ultra", state="0"),
        d("sensor.dpu_solar_in_power", "DELTA Pro Ultra Solar In Power", "eco", "DELTA Pro Ultra", state="unavailable"),
        d("sensor.dach_netzleistung", "solaredge Netzleistung", "se", "Dach", state="unavailable"),
        d("sensor.dach_verbraucher", "solaredge Verbraucherleistung", "se", "Dach", state="12"),
        d("sensor.dpu_battery_power", "DELTA Pro Ultra Battery Power", "eco", "DELTA Pro Ultra", state="185"),
        d("sensor.dpu_soc", "DELTA Pro Ultra Battery level SOC", "eco", "DELTA Pro Ultra", "%", "battery", "42"),
        d("sensor.hyper_charge", "Hyper 2000 Batterieladeleistung", "hy", "Hyper 2000", state="0"),
        d("sensor.hyper_discharge", "Hyper 2000 Batterieentladeleistung", "hy", "Hyper 2000", state="490"),
        d("sensor.hyper_soc", "Hyper 2000 Batterieladezustand (SoC)", "hy", "Hyper 2000", "%", "battery", "20"),
        d("sensor.senec_web_power", "SENEC WebAPI Battery Power", "sw", "SENEC WebAPI", state="11"),
        d("sensor.senec_web_soc", "Akku-Füllstand in Prozent", "sw", "SENEC WebAPI", "%", "battery", "70"),
        d("sensor.senec_pv", "Aktuell erzeugter PV-Strom", "sm", "SENEC Main-Unit", state="96"),
        d("sensor.senec_charge", "Akku Ladeleistung", "sm", "SENEC Main-Unit", state="0"),
        d("sensor.senec_discharge", "Akku Entladeleistung", "sm", "SENEC Main-Unit", state="0"),
        d("sensor.senec_soc", "Akku-Füllstand in Prozent", "sm", "SENEC Main-Unit", "%", "battery", "70"),
        d("sensor.zm_power", "Zendure Manager Leistung", "zm", "Zendure Manager", state="489"),
        d("sensor.sbm_surplus", "Smart Battery Manager Solar-Überschuss", "sbm", "Smart Battery Manager", state="0"),
        d("sensor.sbm_soc", "Smart Battery Manager Gesamt-SOC", "sbm", "Smart Battery Manager", "%", "battery", "43"),
        h("sensor.senec_standby_w", "Senec Standby-Verbrauch", state="5"),
        h("sensor.batterie_eingang_gesamt", "Batterie Eingang Gesamt", state="0"),
        h("sensor.pv_zu_akku_heute", "Energie heute – PV zu Akku", "kWh", "energy", "0.2"),
    ]


def test_crowded_install_stays_sensible():
    out = detect.suggest(_crowded())
    # strings instead of their inverter total; no grid, consumption, limits or dead sensors
    assert out["solar_strings"]["value"] == [
        "sensor.power_1_0",
        "sensor.dpu_solar_1_in_power",
        "sensor.dpu_solar_2_in_power",
    ]
    assert "solar_today" not in out  # "PV zu Akku" is no PV yield
    bats = out["batteries"]
    names = [b["value"]["name"] for b in bats]
    assert names == ["DELTA Pro Ultra", "Hyper 2000", "SENEC WebAPI", "SENEC Main-Unit"]
    assert bats[1]["value"]["mode"] == "split"
    assert "sensor.senec_pv" not in str(bats)  # PV power of a battery device
    # second view of the same Senec (same state of charge) is marked, not applied
    assert bats[3].get("duplicate") and not bats[2].get("duplicate")
    opts = detect.options_from_suggestions(out)
    assert [b["name"] for b in opts["batteries"]] == ["DELTA Pro Ultra", "Hyper 2000", "SENEC WebAPI"]


def test_crowded_choices_tick_no_duplicates():
    found = detect.choices(detect.suggest(_crowded()), str)
    bats = [c for c in found if c["key"].startswith("battery_")]
    assert [c["default"] for c in bats] == [True, True, True, False]
    assert "vermutlich" in bats[3]["label"]
