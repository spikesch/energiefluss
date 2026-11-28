"""Collect from Home Assistant where sensors are used (input of usage.py).

Dashboards and the energy preferences are only reachable through internal
interfaces that may change with an update. Every source is therefore read on
its own: if one fails, its hints are missing and nothing else breaks.
"""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar, device_registry as dr, entity_registry as er

from .detect import POWER_UNITS
from .usage import Context, Helper, find_usage

_LOGGER = logging.getLogger(__name__)

# helper integrations: domain -> German name
HELPER_KINDS = {
    "derivative": "Ableitung",
    "group": "Gruppe",
    "integration": "Integral",
    "min_max": "Min/Max",
    "statistics": "Statistik",
    "threshold": "Schwellwert",
    "utility_meter": "Verbrauchszähler",
}
# option keys under which those helpers keep their source sensors
SOURCE_KEYS = ("source", "entity_id", "entity_ids", "entities")


async def _dashboards(hass: HomeAssistant, admin: bool) -> list[tuple[str, Any]]:
    from homeassistant.components.lovelace.const import LOVELACE_DATA

    if (data := hass.data.get(LOVELACE_DATA)) is None:
        return []
    found = []
    for url_path, dashboard in data.dashboards.items():
        meta = dashboard.config or {}
        if meta.get("require_admin") and not admin:
            continue
        try:
            config = await dashboard.async_load(False)
        except Exception:  # noqa: BLE001 - auto generated dashboards have no configuration
            _LOGGER.debug("Dashboard %s not readable", url_path, exc_info=True)
            continue
        title = meta.get("title") or config.get("title") or ("Übersicht" if url_path in (None, "lovelace") else url_path)
        found.append((title, config))
    return found


async def _energy(hass: HomeAssistant) -> dict[str, Any] | None:
    if "energy" not in hass.config.components:
        return None
    from homeassistant.components.energy.data import async_get_manager

    return (await async_get_manager(hass)).data


def _helpers(hass: HomeAssistant) -> list[Helper]:
    reg = er.async_get(hass)
    helpers = []
    for domain, kind in HELPER_KINDS.items():
        for entry in hass.config_entries.async_entries(domain):
            sources: list[str] = []
            for key in SOURCE_KEYS:
                value = {**entry.data, **entry.options}.get(key)
                sources += [value] if isinstance(value, str) else list(value or [])
            if sources:
                outputs = [e.entity_id for e in er.async_entries_for_config_entry(reg, entry.entry_id)]
                helpers.append(Helper(entry.title, kind, sources, outputs))
    return helpers


def _consumers(hass: HomeAssistant, entity_ids: list[str]) -> dict[str, list[str]]:
    """Automations, scripts, scenes and YAML groups that refer to the sensors."""
    from importlib import import_module

    found: dict[str, list[str]] = {}
    for domain, function, kind in (
        ("automation", "automations_with_entity", "Automation"),
        ("script", "scripts_with_entity", "Skript"),
        ("scene", "scenes_with_entity", "Szene"),
        ("group", "groups_with_entity", "Gruppe"),
    ):
        if domain not in hass.config.components:
            continue
        try:
            module = import_module(f"homeassistant.components.{domain}")
            if domain == "scene":  # lives in the platform of Home Assistant's own scenes
                module = import_module("homeassistant.components.homeassistant.scene")
            lookup = getattr(module, function)
            for entity_id in entity_ids:
                for user in lookup(hass, entity_id):
                    state = hass.states.get(user)
                    found.setdefault(entity_id, []).append(f"{kind} „{state.name if state else user}“")
        except Exception:  # noqa: BLE001 - optional hint
            _LOGGER.debug("Cannot search %s", domain, exc_info=True)
    return found


async def async_usage(hass: HomeAssistant, entity_ids: list[str], admin: bool) -> dict[str, dict[str, Any]]:
    """Other names, places of use, area and device of the sensors."""
    ent_reg = er.async_get(hass)
    dev_reg = dr.async_get(hass)
    area_reg = ar.async_get(hass)

    ctx = Context(consumers=_consumers(hass, entity_ids))
    current: dict[str, str] = {}
    for entity_id in entity_ids:
        if state := hass.states.get(entity_id):
            current[entity_id] = state.name
        if (entry := ent_reg.async_get(entity_id)) and entry.aliases:
            # newer versions put a marker for "the entity's own name" into the list
            ctx.aliases[entity_id] = sorted(a for a in entry.aliases if type(a) is str)
    for entry in ent_reg.entities.values():
        if entry.device_id:
            ctx.device_of[entry.entity_id] = entry.device_id
            state = hass.states.get(entry.entity_id)
            if entry.domain == "sensor" and state and (
                state.attributes.get("device_class") == "power"
                or state.attributes.get("unit_of_measurement") in POWER_UNITS
            ):
                ctx.power_sensors.add(entry.entity_id)

    try:
        ctx.dashboards = await _dashboards(hass, admin)
    except Exception:  # noqa: BLE001 - optional hint
        _LOGGER.warning("Cannot search the dashboards", exc_info=True)
    try:
        ctx.energy = await _energy(hass)
    except Exception:  # noqa: BLE001 - optional hint
        _LOGGER.warning("Cannot read the energy dashboard", exc_info=True)
    try:
        ctx.helpers = _helpers(hass)
    except Exception:  # noqa: BLE001 - optional hint
        _LOGGER.warning("Cannot search the helpers", exc_info=True)

    result = find_usage(entity_ids, current, ctx)
    for entity_id in entity_ids:
        entry = ent_reg.async_get(entity_id)
        device = dev_reg.async_get(entry.device_id) if entry and entry.device_id else None
        area_id = (entry.area_id if entry else None) or (device.area_id if device else None)
        area = area_reg.async_get_area(area_id) if area_id else None
        facts = {
            "area": area.name if area else None,
            "device": (device.name_by_user or device.name) if device else None,
        }
        if facts := {k: v for k, v in facts.items() if v}:
            result.setdefault(entity_id, {"names": [], "used": []}).update(facts)
    return result
