"""Collect the sensors of this Home Assistant for the automatic detection."""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er

from .detect import SensorInfo, suggest


def sensor_infos(hass: HomeAssistant) -> list[SensorInfo]:
    ent_reg = er.async_get(hass)
    dev_reg = dr.async_get(hass)
    sensors: list[SensorInfo] = []
    for state in hass.states.async_all("sensor"):
        entry = ent_reg.async_get(state.entity_id)
        device = dev_reg.async_get(entry.device_id) if entry and entry.device_id else None
        sensors.append(
            SensorInfo(
                entity_id=state.entity_id,
                name=state.name,
                platform=entry.platform if entry else None,
                device_id=entry.device_id if entry else None,
                device_name=(device.name_by_user or device.name) if device else None,
                unit=state.attributes.get("unit_of_measurement"),
                device_class=state.attributes.get("device_class"),
            )
        )
    return sensors


def suggestions(hass: HomeAssistant) -> dict[str, Any]:
    return suggest(sensor_infos(hass))


def friendly_name(hass: HomeAssistant, entity_id: str) -> str:
    state = hass.states.get(entity_id)
    return state.name if state and state.name else entity_id
