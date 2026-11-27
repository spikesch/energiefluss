"""Which of the integration's own sensors make sense for a configuration.

Only parts that are set up get entities, so a fresh install does not show a long
list of "unavailable" sensors.
"""

from __future__ import annotations

from typing import Any

from .const import (
    CONF_BACKUP_LOADS,
    CONF_BATTERIES,
    CONF_FIXED_LOADS,
    CONF_FLEXIBLE_LOADS,
    CONF_GRID_EXPORT_POWER,
    CONF_GRID_IMPORT_POWER,
    CONF_GRID_POWER,
    CONF_HOME_POWER,
    CONF_SOLAR_STRINGS,
    CONF_WALLBOX_POWER,
)


def _parts(cfg: dict[str, Any]) -> dict[str, bool]:
    batteries = cfg.get(CONF_BATTERIES) or []
    backup = any(b.get(CONF_BACKUP_LOADS) for b in batteries)
    fixed = bool(cfg.get(CONF_FIXED_LOADS))
    flexible = bool(cfg.get(CONF_FLEXIBLE_LOADS))
    wallbox = bool(cfg.get(CONF_WALLBOX_POWER))
    return {
        "solar": bool(cfg.get(CONF_SOLAR_STRINGS)),
        "grid": bool(cfg.get(CONF_GRID_POWER) or cfg.get(CONF_GRID_IMPORT_POWER) or cfg.get(CONF_GRID_EXPORT_POWER)),
        "battery": bool(batteries),
        "backup": backup,
        "fixed": fixed,
        "flexible": flexible or wallbox,
        "wallbox": wallbox,
        "loads": fixed or flexible or wallbox or backup,
    }


def _nothing(cfg: dict[str, Any]) -> bool:
    """Nothing set up yet: no sensors at all (they would only be 'unavailable')."""
    parts = _parts(cfg)
    return not (parts["solar"] or parts["grid"] or parts["battery"] or parts["loads"] or cfg.get(CONF_HOME_POWER))


# sensor key -> part that must be configured (None: always)
POWER_SENSOR_PART: dict[str, str | None] = {
    "solar_power": "solar",
    "grid_power": "grid",
    "grid_import": "grid",
    "grid_export": "grid",
    "home_power": None,
    "fixed_power": "fixed",
    "flexible_power": "flexible",
    "backup_power": "backup",
    "wallbox_power": "wallbox",
    "unmeasured_power": "loads",
    "surplus": "solar",
}

# ENERGY_TOTALS name -> part
TOTAL_PART: dict[str, str | None] = {
    "home": None,
    "solar": "solar",
    "grid_import": "grid",
    "grid_export": "grid",
    "battery_charge": "battery",
    "battery_discharge": "battery",
    "unmeasured": "loads",
}


def wanted_power_sensors(cfg: dict[str, Any]) -> set[str]:
    if _nothing(cfg):
        return set()
    parts = _parts(cfg)
    return {k for k, p in POWER_SENSOR_PART.items() if p is None or parts[p]}


def wanted_totals(cfg: dict[str, Any]) -> set[str]:
    if _nothing(cfg):
        return set()
    parts = _parts(cfg)
    return {k for k, p in TOTAL_PART.items() if p is None or parts[p]}
