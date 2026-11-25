"""Validation of the instance configuration written by the visual editor."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.helpers import config_validation as cv

from .const import (
    CONF_BATTERIES,
    CONF_BATTERY_CAPACITY,
    CONF_BATTERY_INVERT,
    CONF_BATTERY_NAME,
    CONF_BATTERY_POWER,
    CONF_BATTERY_SOC,
    CONF_ENERGY_PERIOD,
    CONF_FIXED_LOADS,
    CONF_FLEXIBLE_LOADS,
    CONF_GRID_EXPORT_PRICE,
    CONF_GRID_EXPORT_PRICE_FIXED,
    CONF_GRID_EXPORT_TODAY,
    CONF_GRID_IMPORT_TODAY,
    CONF_GRID_INVERT,
    CONF_GRID_POWER,
    CONF_GRID_PRICE,
    CONF_HOME_POWER,
    CONF_SOLAR_FORECAST,
    CONF_SOLAR_STRINGS,
    CONF_SOLAR_TODAY,
    MAX_BATTERIES,
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
        vol.Optional(CONF_GRID_PRICE): _ENTITY,
        vol.Optional(CONF_GRID_EXPORT_PRICE): _ENTITY,
        vol.Optional(CONF_GRID_EXPORT_PRICE_FIXED): _NUMBER,
        vol.Optional(CONF_GRID_IMPORT_TODAY): _ENTITY,
        vol.Optional(CONF_GRID_EXPORT_TODAY): _ENTITY,
        vol.Optional(CONF_HOME_POWER): _ENTITY,
        vol.Optional(CONF_FIXED_LOADS): _ENTITIES,
        vol.Optional(CONF_FLEXIBLE_LOADS): _ENTITIES,
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
        if bat.get(CONF_BATTERY_POWER) or bat.get(CONF_BATTERY_SOC):
            bat.setdefault(CONF_BATTERY_INVERT, False)
            batteries.append(bat)
    data[CONF_BATTERIES] = batteries
    return _clean(data) | {
        CONF_GRID_INVERT: data[CONF_GRID_INVERT],
        CONF_ENERGY_PERIOD: data[CONF_ENERGY_PERIOD],
    }
