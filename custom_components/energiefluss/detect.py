"""Suggest sensors for an Energiefluss instance.

Pure logic (no Home Assistant imports) so it can be unit-tested. The caller
passes a flat description of every sensor; we recognise well-known
integrations by platform (Tibber, Solcast, Forecast.Solar, ...) and fall back
to units, device classes and typical German/English names.
"""

from __future__ import annotations

import re
from collections import defaultdict
from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

POWER_UNITS = {"W", "kW", "MW"}
ENERGY_UNITS = {"Wh", "kWh", "MWh"}

# Platforms whose sensors are never energy sources/loads of the house.
IGNORED_PLATFORMS = {"energiefluss", "mobile_app", "sun", "backup", "hassio", "speedtestdotnet"}

KW_SOLAR = r"\b(pv|solar|photovolt\w*|wechselrichter|inverter|mppt|string\d*|dach)\b|^pv|pv\b"
KW_BATTERY = (
    r"batter\w*|akku\w*|speicher\w*|storage|bms|senec|zendure|hyper\s?2000|sonnen|byd|pylontech|e3dc|varta|"
    r"solix|marstek|powerwall"
)
KW_GRID = r"\b(netz\w*|grid|zähler\w*|zaehler\w*|smart\s?meter|meter|stromzähler|tibber|hausanschluss)\b"
KW_IMPORT = r"bezug|import|consumption|verbrauch|purchase|gekauft|\bkauf"
KW_EXPORT = r"einspeis\w*|export|production|produktion|feed.?in|verkauf|sold"
KW_CHARGE = r"(?<!ent)lade\w*|(?<!dis)charg\w*|\bin\b|input"
KW_DISCHARGE = r"entlade\w*|discharg\w*|\bout\b|output"
KW_SOC = r"\bsoc\b|state.of.charge|ladezustand|ladestand|füllstand|fuellstand|level|electric.level|charge.percent"
KW_WALLBOX = r"wallbox|wall.box|ladestation|ladepunkt|charger|charging.station|evcc|go.?e|easee|keba|openwb|wallbe|zappi|pulsar"
KW_CAR = r"\b(auto|car|fahrzeug|vehicle|tesla|ev|e-?auto|elektroauto|id\.?\d|zoe|model\s?[3sxy])\b"
KW_HOME = r"\b(haus|house|home|hausverbrauch|gesamtverbrauch|load|consumption)\b"
KW_PRICE = r"preis|price|tarif"
KW_FORECAST = r"remaining|verbleib\w*|rest\b|forecast|prognose"
KW_TODAY = r"heute|today|daily|tages\w*|accumulated"


@dataclass
class SensorInfo:
    """What the detector needs to know about one sensor entity."""

    entity_id: str
    name: str
    platform: str | None = None
    device_id: str | None = None
    device_name: str | None = None
    unit: str | None = None
    device_class: str | None = None

    @property
    def text(self) -> str:
        return f"{self.entity_id} {self.name} {self.device_name or ''}".lower().replace("_", " ")

    def has(self, pattern: str) -> bool:
        return re.search(pattern, self.text) is not None

    def name_has(self, pattern: str) -> bool:
        """Match the display name only, ignoring remarks in parentheses."""
        name = re.sub(r"\(.*?\)", " ", self.name.lower())
        return re.search(pattern, name) is not None

    @property
    def is_power(self) -> bool:
        return self.unit in POWER_UNITS or self.device_class == "power"

    @property
    def is_energy(self) -> bool:
        return self.unit in ENERGY_UNITS or self.device_class == "energy"

    @property
    def is_percent(self) -> bool:
        return self.unit == "%"


def _base(s: SensorInfo) -> str:
    """Name without words describing the measured quantity; groups a device's sensors."""
    if s.device_id:
        return f"dev:{s.device_id}"
    words = re.sub(
        rf"{KW_CHARGE}|{KW_DISCHARGE}|{KW_SOC}|leistung|power|soc|w\b|kw\b|\(.*?\)",
        " ",
        s.name.lower(),
    )
    return "name:" + " ".join(words.split())


def _suggestion(value: Any, source: str) -> dict[str, Any]:
    return {"value": value, "source": source}


def suggest(sensors: list[SensorInfo]) -> dict[str, Any]:
    """Return suggestions per editor field (only what was found)."""
    sensors = [s for s in sensors if s.platform not in IGNORED_PLATFORMS]
    used: set[str] = set()
    out: dict[str, Any] = {}

    power = [s for s in sensors if s.is_power]
    energy = [s for s in sensors if s.is_energy]

    # -- grid ---------------------------------------------------------------
    grid_power = [s for s in power if s.platform == "tibber" or s.has(KW_GRID)]
    imp = [s for s in grid_power if s.has(KW_IMPORT) or (s.platform == "tibber" and not s.has(KW_EXPORT))]
    exp = [s for s in grid_power if s.has(KW_EXPORT)]
    if imp and exp:
        src = "Tibber" if imp[0].platform == "tibber" else "Name"
        out["grid"] = _suggestion(
            {"grid_mode": "split", "grid_import_power": imp[0].entity_id, "grid_export_power": exp[0].entity_id},
            src,
        )
        used.update({imp[0].entity_id, exp[0].entity_id})
    else:
        combined = [s for s in grid_power if not s.has(KW_EXPORT) and not s.has(KW_IMPORT)] or imp
        if combined:
            out["grid"] = _suggestion({"grid_mode": "combined", "grid_power": combined[0].entity_id}, "Name")
            used.add(combined[0].entity_id)

    price = [s for s in sensors if "/kwh" in (s.unit or "").lower() and (s.platform == "tibber" or s.has(KW_PRICE))]
    price.sort(key=lambda s: (s.platform != "tibber", s.has(KW_EXPORT)))
    if price and not price[0].has(KW_EXPORT):
        out["grid_price"] = _suggestion(price[0].entity_id, "Tibber" if price[0].platform == "tibber" else "Name")

    grid_energy = [
        s
        for s in energy
        if (s.platform == "tibber" or s.has(KW_GRID) or s.has(r"einspeis\w*|bezug")) and s.has(KW_TODAY)
    ]
    for key, kw in (("grid_import_today", KW_IMPORT), ("grid_export_today", KW_EXPORT)):
        found = [s for s in grid_energy if s.has(kw)]
        if key == "grid_import_today":
            found = [s for s in found if not s.has(KW_EXPORT)]
        if found:
            out[key] = _suggestion(found[0].entity_id, "Tibber" if found[0].platform == "tibber" else "Name")

    # -- solar --------------------------------------------------------------
    solar = [
        s
        for s in power
        if s.entity_id not in used and s.has(KW_SOLAR) and not s.has(KW_BATTERY) and not s.has(KW_FORECAST)
    ]
    if solar:
        out["solar_strings"] = _suggestion([s.entity_id for s in solar], "Name")
        used.update(s.entity_id for s in solar)
    forecast = [
        s
        for s in energy
        if s.has(KW_FORECAST)
        and (s.platform in ("solcast_solar", "forecast_solar") or s.has(KW_SOLAR))
        and s.has(r"remaining|verbleib\w*|rest\b")
    ]
    if forecast:
        src = "Solcast" if forecast[0].platform == "solcast_solar" else "Name"
        out["solar_forecast_remaining"] = _suggestion(forecast[0].entity_id, src)
    solar_today = [s for s in energy if s.has(KW_SOLAR) and s.has(KW_TODAY) and not s.has(KW_FORECAST)]
    if solar_today:
        out["solar_today"] = _suggestion(solar_today[0].entity_id, "Name")

    # -- batteries (grouped per device or per name without the quantity) ------------
    groups: dict[str, dict[str, SensorInfo]] = defaultdict(dict)
    for s in power:
        if s.entity_id in used or not s.has(KW_BATTERY) or s.has(KW_CAR) or s.has(KW_WALLBOX):
            continue
        c, d = s.name_has(KW_CHARGE), s.name_has(KW_DISCHARGE)
        kind = "power" if c == d else "charge" if c else "discharge"
        groups[_base(s)].setdefault(kind, s)
    socs = [
        s
        for s in sensors
        if s.is_percent
        and not s.has(KW_CAR)
        and (s.device_class == "battery" or s.has(KW_SOC))
        and (s.has(KW_BATTERY) or s.has(KW_SOC))
    ]
    batteries = []
    for base, parts in groups.items():
        soc = next((s for s in socs if _base(s) == base), None)
        first = next(iter(parts.values()))
        cleaned = re.sub(
            rf"\(.*?\)|{KW_DISCHARGE}|{KW_CHARGE}|leistung|power", " ", first.name, flags=re.IGNORECASE
        )
        name = first.device_name or " ".join(cleaned.split()) or first.name
        bat: dict[str, Any] = {"name": name}
        if "charge" in parts or "discharge" in parts:
            bat["mode"] = "split"
            if "charge" in parts:
                bat["charge_power"] = parts["charge"].entity_id
            if "discharge" in parts:
                bat["discharge_power"] = parts["discharge"].entity_id
        else:
            bat["mode"] = "combined"
            bat["power"] = parts["power"].entity_id
        if soc:
            bat["soc"] = soc.entity_id
        used.update(s.entity_id for s in parts.values())
        batteries.append(_suggestion(bat, "Gerät" if base.startswith("dev:") else "Name"))
    if batteries:
        out["batteries"] = batteries

    # -- wallbox / EV charger and the car's state of charge --------------------------------
    wallbox = [s for s in power if s.entity_id not in used and s.has(KW_WALLBOX)]
    if wallbox:
        out["wallbox_power"] = _suggestion(wallbox[0].entity_id, wallbox[0].platform or "Name")
        used.add(wallbox[0].entity_id)
    car_soc = [s for s in sensors if s.is_percent and s.has(KW_CAR) and (s.device_class == "battery" or s.has(KW_SOC))]
    if car_soc:
        out["wallbox_soc"] = _suggestion(car_soc[0].entity_id, car_soc[0].platform or "Name")

    # -- measured house consumption ----------------------------------------------------
    home = [s for s in power if s.entity_id not in used and s.has(KW_HOME) and not s.has(KW_GRID)]
    if home:
        out["home_power"] = _suggestion(home[0].entity_id, "Name")
        used.add(home[0].entity_id)

    # -- remaining power sensors: candidates for loads ------------------------------------
    out["loads"] = [
        {"entity": s.entity_id, "name": s.name, "source": s.platform or ""}
        for s in power
        if s.entity_id not in used
        and not s.has(KW_SOLAR)
        and not s.has(KW_BATTERY)
        and not s.has(KW_GRID)
        and not s.has(KW_WALLBOX)
    ]
    return out


# Suggestions that hold one entity id and map 1:1 to an option of the same name
# (same list as the editor's "apply all").
SCALAR_KEYS = (
    "solar_today",
    "solar_forecast_remaining",
    "grid_price",
    "grid_import_today",
    "grid_export_today",
    "home_power",
    "wallbox_power",
    "wallbox_soc",
)


def options_from_suggestions(sg: dict[str, Any]) -> dict[str, Any]:
    """Turn suggest() output into raw options (loads stay unsorted: the user decides)."""
    opts: dict[str, Any] = {}
    if sg.get("solar_strings"):
        opts["solar_strings"] = list(sg["solar_strings"]["value"])
    if sg.get("grid"):
        opts.update(sg["grid"]["value"])
    for key in SCALAR_KEYS:
        if sg.get(key):
            opts[key] = sg[key]["value"]
    batteries = [dict(b["value"]) for b in sg.get("batteries") or []]
    if batteries:
        opts["batteries"] = batteries
    return opts


def summary(sg: dict[str, Any], name: Callable[[str], str], german: bool = True) -> str:
    """Markdown list of what was found, for the setup dialog."""

    def names(ids: list[str]) -> str:
        return ", ".join(name(e) for e in ids if e)

    t = (lambda de, en: de) if german else (lambda de, en: en)
    lines: list[str] = []
    if strings := (sg.get("solar_strings") or {}).get("value"):
        label = t("PV", "PV") if len(strings) == 1 else t(f"PV ({len(strings)} Stränge)", f"PV ({len(strings)} strings)")
        lines.append(f"☀️ **{label}:** {names(strings)}")
    if grid := (sg.get("grid") or {}).get("value"):
        ids = [grid.get("grid_power"), grid.get("grid_import_power"), grid.get("grid_export_power")]
        lines.append(f"🔌 **{t('Netz', 'Grid')}:** {names([i for i in ids if i])}")
    for bat in sg.get("batteries") or []:
        b = bat["value"]
        ids = [b.get("power"), b.get("charge_power"), b.get("discharge_power"), b.get("soc")]
        lines.append(f"🔋 **{t('Batterie', 'Battery')} {b.get('name', '')}:** {names([i for i in ids if i])}")
    for key, icon, de, en in (
        ("home_power", "🏠", "Hausverbrauch", "House consumption"),
        ("wallbox_power", "🚗", "Wallbox", "Wallbox"),
        ("wallbox_soc", "🚗", "Ladestand Auto", "Car state of charge"),
        ("grid_price", "💶", "Strompreis", "Electricity price"),
        ("solar_today", "☀️", "PV-Ertrag heute", "PV yield today"),
        ("solar_forecast_remaining", "☀️", "PV-Prognose", "PV forecast"),
    ):
        if item := sg.get(key):
            lines.append(f"{icon} **{t(de, en)}:** {name(item['value'])}")
    return "\n".join(f"- {line}" for line in lines)
