"""Validation of the instance configuration written by the visual editor."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.helpers import config_validation as cv

from .const import (
    CONF_BACKUP_LOADS,
    CONF_BATTERIES,
    CONF_BATTERY_CAPACITY,
    CONF_BATTERY_CHARGE,
    CONF_BATTERY_DISCHARGE,
    CONF_BATTERY_INVERT,
    CONF_BATTERY_MODE,
    CONF_BATTERY_NAME,
    CONF_BATTERY_POWER,
    CONF_BATTERY_SOC,
    CONF_ENERGY_PERIOD,
    CONF_FIXED_LOADS,
    CONF_FLEXIBLE_LOADS,
    CONF_GRID_EXPORT_PRICE,
    CONF_GRID_EXPORT_PRICE_FIXED,
    CONF_GRID_EXPORT_POWER,
    CONF_GRID_EXPORT_TODAY,
    CONF_GRID_IMPORT_POWER,
    CONF_GRID_IMPORT_TODAY,
    CONF_GRID_INVERT,
    CONF_GRID_MODE,
    CONF_GRID_POWER,
    CONF_GRID_PRICE,
    CONF_HOME_POWER,
    CONF_LOAD_PARENTS,
    CONF_SOLAR_FORECAST,
    CONF_SOLAR_STRINGS,
    CONF_SOLAR_TODAY,
    CONF_WALLBOX_FLEXIBLE,
    CONF_WALLBOX_NAME,
    CONF_WALLBOX_POWER,
    CONF_WALLBOX_SOC,
    MAX_BACKUP_BATTERIES,
    MAX_BATTERIES,
    MODE_COMBINED,
    MODE_SPLIT,
    PERIOD_MIDNIGHT,
    PERIOD_ROLLING,
)

_ENTITY = vol.Any(None, "", cv.entity_id)
_ENTITIES = vol.All(vol.Any(None, [cv.entity_id]), lambda v: v or [])
_NUMBER = vol.Any(None, "", vol.All(vol.Coerce(float), vol.Range(min=0)))

BATTERY_SCHEMA = vol.Schema(
    {
        vol.Optional(CONF_BATTERY_NAME): vol.Any(None, str),
        vol.Optional(CONF_BATTERY_POWER): _ENTITY,
        vol.Optional(CONF_BATTERY_SOC): _ENTITY,
        vol.Optional(CONF_BATTERY_CAPACITY): _NUMBER,
        vol.Optional(CONF_BATTERY_INVERT, default=False): cv.boolean,
        vol.Optional(CONF_BATTERY_MODE, default=MODE_COMBINED): vol.In([MODE_COMBINED, MODE_SPLIT]),
        vol.Optional(CONF_BATTERY_CHARGE): _ENTITY,
        vol.Optional(CONF_BATTERY_DISCHARGE): _ENTITY,
        # loads on the battery's own (backup) output
        vol.Optional(CONF_BACKUP_LOADS): _ENTITIES,
    },
    extra=vol.REMOVE_EXTRA,
)

OPTIONS_SCHEMA = vol.Schema(
    {
        vol.Optional(CONF_SOLAR_STRINGS): _ENTITIES,
        vol.Optional(CONF_SOLAR_TODAY): _ENTITY,
        vol.Optional(CONF_SOLAR_FORECAST): _ENTITY,
        vol.Optional(CONF_BATTERIES): vol.All(
            vol.Any(None, [BATTERY_SCHEMA]), lambda v: v or [], vol.Length(max=MAX_BATTERIES)
        ),
        vol.Optional(CONF_GRID_POWER): _ENTITY,
        vol.Optional(CONF_GRID_INVERT, default=False): cv.boolean,
        vol.Optional(CONF_GRID_MODE, default=MODE_COMBINED): vol.In([MODE_COMBINED, MODE_SPLIT]),
        vol.Optional(CONF_GRID_IMPORT_POWER): _ENTITY,
        vol.Optional(CONF_GRID_EXPORT_POWER): _ENTITY,
        vol.Optional(CONF_GRID_PRICE): _ENTITY,
        vol.Optional(CONF_GRID_EXPORT_PRICE): _ENTITY,
        vol.Optional(CONF_GRID_EXPORT_PRICE_FIXED): _NUMBER,
        vol.Optional(CONF_GRID_IMPORT_TODAY): _ENTITY,
        vol.Optional(CONF_GRID_EXPORT_TODAY): _ENTITY,
        vol.Optional(CONF_HOME_POWER): _ENTITY,
        vol.Optional(CONF_FIXED_LOADS): _ENTITIES,
        vol.Optional(CONF_FLEXIBLE_LOADS): _ENTITIES,
        vol.Optional(CONF_LOAD_PARENTS): vol.Any(None, {cv.entity_id: cv.entity_id}),
        vol.Optional(CONF_WALLBOX_NAME): vol.Any(None, str),
        vol.Optional(CONF_WALLBOX_POWER): _ENTITY,
        vol.Optional(CONF_WALLBOX_SOC): _ENTITY,
        vol.Optional(CONF_WALLBOX_FLEXIBLE, default=True): cv.boolean,
        vol.Optional(CONF_ENERGY_PERIOD, default=PERIOD_MIDNIGHT): vol.In([PERIOD_MIDNIGHT, PERIOD_ROLLING]),
    },
    extra=vol.REMOVE_EXTRA,
)


def _clean(data: dict[str, Any]) -> dict[str, Any]:
    """Drop empty values so a missing key really means 'not configured'."""
    return {k: v for k, v in data.items() if v not in (None, "", [])}


def normalize_options(raw: dict[str, Any]) -> dict[str, Any]:
    """Validate editor input and return what gets stored in entry.options.

    Raises vol.Invalid on bad input. Batteries without power and SoC sensor are
    dropped (an empty slot in the editor).
    """
    data = OPTIONS_SCHEMA(raw)
    batteries = []
    for bat in data.get(CONF_BATTERIES, []):
        bat = _clean(bat)
        keys = (CONF_BATTERY_POWER, CONF_BATTERY_SOC, CONF_BATTERY_CHARGE, CONF_BATTERY_DISCHARGE)
        if any(bat.get(k) for k in keys):
            bat.setdefault(CONF_BATTERY_INVERT, False)
            bat.setdefault(CONF_BATTERY_MODE, MODE_COMBINED)
            batteries.append(bat)
    with_backup = [b for b in batteries if b.get(CONF_BACKUP_LOADS)]
    if len(with_backup) > MAX_BACKUP_BATTERIES:
        raise vol.Invalid(f"Höchstens {MAX_BACKUP_BATTERIES} Batterien können einen Notstrom-Abgang haben.")
    data[CONF_BATTERIES] = batteries
    parents = data.get(CONF_LOAD_PARENTS) or {}
    for child, parent in parents.items():
        if child == parent:
            raise vol.Invalid("Ein Verbraucher kann nicht in sich selbst enthalten sein.")
        if parent in parents:
            raise vol.Invalid("Enthaltene Verbraucher können nicht selbst weitere enthalten.")
    return _clean(data) | {
        CONF_GRID_INVERT: data[CONF_GRID_INVERT],
        CONF_GRID_MODE: data[CONF_GRID_MODE],
        CONF_WALLBOX_FLEXIBLE: data[CONF_WALLBOX_FLEXIBLE],
        CONF_ENERGY_PERIOD: data[CONF_ENERGY_PERIOD],
    }
