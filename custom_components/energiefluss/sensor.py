"""Sensors provided by Energiefluss."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import PERCENTAGE, UnitOfEnergy, UnitOfPower
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .calc import Result
from .const import (
    CONF_BATTERY_NAME,
    DOMAIN,
    ENERGY_TOTALS,
    PERIOD_ROLLING,
    total_today_unique_id,
    load_today_unique_id,
)
from .hub import EnergieflussHub


@dataclass(frozen=True, kw_only=True)
class EfSensorDescription(SensorEntityDescription):
    """Sensor description with a function that picks the value from a Result."""

    value_fn: Callable[[Result], float | None]


def _power(key: str, fn: Callable[[Result], float | None]) -> EfSensorDescription:
    return EfSensorDescription(
        key=key,
        translation_key=key,
        device_class=SensorDeviceClass.POWER,
        state_class=SensorStateClass.MEASUREMENT,
        native_unit_of_measurement=UnitOfPower.WATT,
        suggested_display_precision=0,
        value_fn=fn,
    )


GLOBAL_SENSORS: tuple[EfSensorDescription, ...] = (
    _power("solar_power", lambda r: r.solar_power),
    _power("grid_power", lambda r: r.grid_power),
    _power("grid_import", lambda r: r.grid_import),
    _power("grid_export", lambda r: r.grid_export),
    _power("home_power", lambda r: r.home_power),
    _power("fixed_power", lambda r: r.fixed_power),
    _power("flexible_power", lambda r: r.flexible_power),
    _power("backup_power", lambda r: r.backup_power),
    _power("wallbox_power", lambda r: r.wallbox_power),
    _power("unmeasured_power", lambda r: r.unmeasured_power),
    _power("surplus", lambda r: r.surplus),
)

BATTERY_TOTAL_SENSORS: tuple[EfSensorDescription, ...] = (
    _power("battery_power", lambda r: r.battery_power),
    EfSensorDescription(
        key="battery_soc",
        translation_key="battery_soc",
        device_class=SensorDeviceClass.BATTERY,
        state_class=SensorStateClass.MEASUREMENT,
        native_unit_of_measurement=PERCENTAGE,
        suggested_display_precision=0,
        value_fn=lambda r: r.battery_soc,
    ),
    EfSensorDescription(
        key="battery_energy",
        translation_key="battery_energy",
        device_class=SensorDeviceClass.ENERGY_STORAGE,
        state_class=SensorStateClass.MEASUREMENT,
        native_unit_of_measurement=UnitOfEnergy.KILO_WATT_HOUR,
        suggested_display_precision=2,
        value_fn=lambda r: r.battery_energy_kwh,
    ),
)


def _battery_sensors(index: int) -> tuple[EfSensorDescription, ...]:
    i = index - 1

    def pick(values: list[float | None]) -> float | None:
        return values[i] if i < len(values) else None

    return (
        EfSensorDescription(
            key=f"battery_{index}_power",
            translation_key="battery_n_power",
            device_class=SensorDeviceClass.POWER,
            state_class=SensorStateClass.MEASUREMENT,
            native_unit_of_measurement=UnitOfPower.WATT,
            suggested_display_precision=0,
            value_fn=lambda r: pick(r.battery_powers),
        ),
        EfSensorDescription(
            key=f"battery_{index}_soc",
            translation_key="battery_n_soc",
            device_class=SensorDeviceClass.BATTERY,
            state_class=SensorStateClass.MEASUREMENT,
            native_unit_of_measurement=PERCENTAGE,
            suggested_display_precision=0,
            value_fn=lambda r: pick(r.battery_socs),
        ),
    )


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Create sensors for a config entry."""
    hub: EnergieflussHub = entry.runtime_data
    entities: list[EfSensor] = [EfSensor(hub, d) for d in GLOBAL_SENSORS]

    batteries = hub.batteries
    if batteries:
        entities += [EfSensor(hub, d) for d in BATTERY_TOTAL_SENSORS]
    for index, bat in enumerate(batteries, start=1):
        name = bat.get(CONF_BATTERY_NAME) or f"Batterie {index}"
        entities += [EfSensor(hub, d, {"name": name}) for d in _battery_sensors(index)]

    reg = er.async_get(hass)
    async_add_entities(
        [
            *entities,
            *(
                EfEnergySensor(hub, key, total_today_unique_id(hub.entry.entry_id, name), name)
                for key, (_attr, name) in ENERGY_TOTALS.items()
            ),
            *(
                EfEnergySensor(
                    hub,
                    e,
                    load_today_unique_id(hub.entry.entry_id, e),
                    "load",
                    {"name": _friendly(hass, reg, e)},
                )
                for e in hub.loads()
            ),
        ]
    )


def _friendly(hass: HomeAssistant, reg: er.EntityRegistry, entity_id: str) -> str:
    """Display name of a source entity (state may not exist yet at startup)."""
    if (state := hass.states.get(entity_id)) and state.name:
        return state.name
    if (entry := reg.async_get(entity_id)) and (entry.name or entry.original_name):
        return entry.name or entry.original_name  # type: ignore[return-value]
    return entity_id.split(".", 1)[1]


def _device(hub: EnergieflussHub) -> DeviceInfo:
    return DeviceInfo(
        identifiers={(DOMAIN, hub.entry.entry_id)},
        name=hub.entry.title,
        manufacturer="Energiefluss",
        model="Energiefluss",
    )


class EfSensor(SensorEntity):
    """A sensor whose value comes from the hub's current Result."""

    _attr_has_entity_name = True
    _attr_should_poll = False
    entity_description: EfSensorDescription

    def __init__(
        self,
        hub: EnergieflussHub,
        description: EfSensorDescription,
        placeholders: dict[str, str] | None = None,
    ) -> None:
        self._hub = hub
        self.entity_description = description
        self._attr_unique_id = f"{hub.entry.entry_id}_{description.key}"
        if placeholders:
            self._attr_translation_placeholders = placeholders
        self._attr_device_info = _device(hub)

    @property
    def native_value(self) -> float | None:
        return self.entity_description.value_fn(self._hub.result)

    @property
    def available(self) -> bool:
        return self.native_value is not None

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(self._hub.async_add_listener(self._handle_update))

    @callback
    def _handle_update(self) -> None:
        self.async_write_ha_state()


class EfEnergySensor(SensorEntity):
    """Energy of one load (or the whole house) for today / the last 24 hours."""

    _attr_has_entity_name = True
    _attr_should_poll = False
    _attr_device_class = SensorDeviceClass.ENERGY
    _attr_native_unit_of_measurement = UnitOfEnergy.KILO_WATT_HOUR
    _attr_suggested_display_precision = 2

    def __init__(
        self,
        hub: EnergieflussHub,
        key: str,
        unique_id: str,
        translation_key: str,
        placeholders: dict[str, str] | None = None,
    ) -> None:
        self._hub = hub
        self._key = key
        rolling = hub.energy_period == PERIOD_ROLLING
        self._attr_unique_id = unique_id
        self._attr_translation_key = f"{translation_key}_{'24h' if rolling else 'today'}"
        if placeholders:
            self._attr_translation_placeholders = placeholders
        # A rolling 24 h value goes up and down, so no long-term statistics then.
        self._attr_state_class = None if rolling else SensorStateClass.TOTAL_INCREASING
        self._attr_device_info = _device(hub)

    @property
    def native_value(self) -> float:
        return round(self._hub.energy_kwh(self._key), 4)

    @property
    def extra_state_attributes(self) -> dict[str, str]:
        attrs = {"period": self._hub.energy_period}
        if self._key not in ENERGY_TOTALS:
            attrs["source"] = self._key
        return attrs

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(self._hub.async_add_energy_listener(self.async_write_ha_state))
