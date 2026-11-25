"""Energiefluss: normalizes energy sensors and ships a power flow card."""

from __future__ import annotations

from pathlib import Path
from typing import Any

import voluptuous as vol

from homeassistant.components import panel_custom, websocket_api
from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry, ConfigEntryState
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import (
    config_validation as cv,
    device_registry as dr,
    entity_registry as er,
)
from homeassistant.helpers.typing import ConfigType

from .const import (
    CARD_FILENAME,
    CARD_URL_BASE,
    PANEL_FILENAME,
    PANEL_URL_PATH,
    CONF_BACKUP_LOADS,
    CONF_BATTERY_CAPACITY,
    CONF_BATTERY_NAME,
    CONF_FIXED_LOADS,
    CONF_FLEXIBLE_LOADS,
    CONF_GRID_EXPORT_PRICE,
    CONF_GRID_EXPORT_PRICE_FIXED,
    CONF_GRID_EXPORT_TODAY,
    CONF_GRID_IMPORT_TODAY,
    CONF_GRID_PRICE,
    CONF_SOLAR_FORECAST,
    CONF_SOLAR_STRINGS,
    CONF_SOLAR_TODAY,
    CONF_WALLBOX_FLEXIBLE,
    CONF_WALLBOX_NAME,
    CONF_WALLBOX_POWER,
    CONF_WALLBOX_SOC,
    DOMAIN,
    home_today_unique_id,
    total_today_unique_id,
    load_today_unique_id,
)
from .detect import SensorInfo, suggest
from .hub import EnergieflussHub
from .schema import normalize_options

PLATFORMS = [Platform.SENSOR]
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

type EnergieflussConfigEntry = ConfigEntry[EnergieflussHub]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the bundled card, the editor panel and the websocket API once."""
    folder = Path(__file__).parent / "frontend"
    card = folder / CARD_FILENAME
    if card.exists():
        await hass.http.async_register_static_paths(
            [StaticPathConfig(CARD_URL_BASE, str(folder), cache_headers=False)]
        )
        version = int(card.stat().st_mtime)
        add_extra_js_url(hass, f"{CARD_URL_BASE}/{CARD_FILENAME}?v={version}")
        await panel_custom.async_register_panel(
            hass,
            frontend_url_path=PANEL_URL_PATH,
            webcomponent_name="energiefluss-panel",
            module_url=f"{CARD_URL_BASE}/{PANEL_FILENAME}?v={version}",
            sidebar_title="Energiefluss",
            sidebar_icon="mdi:transit-connection-variant",
            require_admin=False,
            embed_iframe=False,
        )

    for command in (ws_get_config, ws_list_instances, ws_get_options, ws_save_options, ws_suggest):
        websocket_api.async_register_command(hass, command)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: EnergieflussConfigEntry) -> bool:
    """Set up one Energiefluss instance."""
    hub = EnergieflussHub(hass, entry)
    await hub.async_load()
    entry.runtime_data = hub
    hub.async_start()
    entry.async_on_unload(hub.async_stop)
    entry.async_on_unload(entry.add_update_listener(_async_reload))
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: EnergieflussConfigEntry) -> bool:
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)


async def _async_reload(hass: HomeAssistant, entry: EnergieflussConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)


# --------------------------------------------------------------------------
# Websocket: lets the card discover everything without any YAML.
# --------------------------------------------------------------------------


def _describe(hass: HomeAssistant, entry: EnergieflussConfigEntry) -> dict[str, Any]:
    hub = entry.runtime_data
    reg = er.async_get(hass)

    def own(key: str) -> str | None:
        return reg.async_get_entity_id("sensor", DOMAIN, f"{entry.entry_id}_{key}")

    def named(entity_ids: list[str] | None) -> list[dict[str, str]]:
        return [{"entity": e} for e in entity_ids or []]

    parents = hub.load_parents()

    def today(e: str) -> str | None:
        return reg.async_get_entity_id("sensor", DOMAIN, load_today_unique_id(entry.entry_id, e))

    def with_today(entity_ids: list[str] | None) -> list[dict[str, Any]]:
        """Loads of a group; contained loads are listed under their parent."""
        return [
            {
                "entity": e,
                "today": today(e),
                "children": [{"entity": c, "today": today(c)} for c, p in parents.items() if p == e],
            }
            for e in entity_ids or []
            if e not in parents
        ]

    def total(name: str) -> str | None:
        return reg.async_get_entity_id("sensor", DOMAIN, total_today_unique_id(entry.entry_id, name))

    cfg = hub.config
    return {
        "computed": sorted(hub.result.computed),
        "entry_id": entry.entry_id,
        "title": entry.title,
        "energy_period": hub.energy_period,
        "home_today": reg.async_get_entity_id("sensor", DOMAIN, home_today_unique_id(entry.entry_id)),
        "entities": {
            key: own(key)
            for key in (
                "solar_power",
                "grid_power",
                "grid_import",
                "grid_export",
                "home_power",
                "fixed_power",
                "flexible_power",
                "backup_power",
                "wallbox_power",
                "unmeasured_power",
                "surplus",
                "battery_power",
                "battery_soc",
                "battery_energy",
            )
        },
        "solar": {
            "strings": named(cfg.get(CONF_SOLAR_STRINGS)),
            "today": cfg.get(CONF_SOLAR_TODAY) or total("solar"),
            "forecast_remaining": cfg.get(CONF_SOLAR_FORECAST),
        },
        "batteries": [
            {
                "name": bat.get(CONF_BATTERY_NAME) or f"Batterie {i}",
                "capacity_kwh": bat.get(CONF_BATTERY_CAPACITY),
                "power": own(f"battery_{i}_power"),
                "soc": own(f"battery_{i}_soc"),
                "backup": with_today(bat.get(CONF_BACKUP_LOADS)),
            }
            for i, bat in enumerate(hub.batteries, start=1)
        ],
        "grid": {
            "price": cfg.get(CONF_GRID_PRICE),
            "export_price": cfg.get(CONF_GRID_EXPORT_PRICE),
            "export_price_fixed": cfg.get(CONF_GRID_EXPORT_PRICE_FIXED),
            "import_today": cfg.get(CONF_GRID_IMPORT_TODAY) or total("grid_import"),
            "export_today": cfg.get(CONF_GRID_EXPORT_TODAY) or total("grid_export"),
        },
        "wallbox": (
            {
                "name": cfg.get(CONF_WALLBOX_NAME) or "Wallbox",
                "power": cfg[CONF_WALLBOX_POWER],
                "soc": cfg.get(CONF_WALLBOX_SOC),
                "flexible": bool(cfg.get(CONF_WALLBOX_FLEXIBLE, True)),
                "today": reg.async_get_entity_id(
                    "sensor", DOMAIN, load_today_unique_id(entry.entry_id, cfg[CONF_WALLBOX_POWER])
                ),
            }
            if cfg.get(CONF_WALLBOX_POWER)
            else None
        ),
        "loads": {
            "fixed": with_today(cfg.get(CONF_FIXED_LOADS)),
            "flexible": with_today(cfg.get(CONF_FLEXIBLE_LOADS)),
        },
    }


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/config", vol.Optional("entry_id"): str}
)
@callback
def ws_get_config(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Return the layout description of one (or the first) loaded instance."""
    entries = [
        e
        for e in hass.config_entries.async_entries(DOMAIN)
        if e.state is ConfigEntryState.LOADED
    ]
    instances = [{"entry_id": e.entry_id, "title": e.title} for e in entries]
    if wanted := msg.get("entry_id"):
        entries = [e for e in entries if e.entry_id == wanted]
    if not entries:
        connection.send_error(msg["id"], "not_found", "Keine Energiefluss-Instanz gefunden")
        return
    connection.send_result(
        msg["id"], {"instance": _describe(hass, entries[0]), "instances": instances}
    )


# --------------------------------------------------------------------------
# Websocket: visual editor (load / save the configuration of an instance).
# --------------------------------------------------------------------------


def _entry(hass: HomeAssistant, entry_id: str) -> ConfigEntry | None:
    entry = hass.config_entries.async_get_entry(entry_id)
    return entry if entry is not None and entry.domain == DOMAIN else None


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/instances"})
@callback
def ws_list_instances(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """All instances, loaded or not (the editor can fix a broken one)."""
    connection.send_result(
        msg["id"],
        [
            {"entry_id": e.entry_id, "title": e.title, "state": e.state.value}
            for e in hass.config_entries.async_entries(DOMAIN)
        ],
    )


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/get_options", vol.Required("entry_id"): str}
)
@callback
def ws_get_options(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    if (entry := _entry(hass, msg["entry_id"])) is None:
        connection.send_error(msg["id"], "not_found", "Instanz nicht gefunden")
        return
    hub = getattr(entry, "runtime_data", None)
    computed = sorted(hub.result.computed) if isinstance(hub, EnergieflussHub) else []
    connection.send_result(
        msg["id"], {"title": entry.title, "options": dict(entry.options), "computed": computed}
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/save_options",
        vol.Required("entry_id"): str,
        vol.Required("title"): str,
        vol.Required("options"): dict,
    }
)
@callback
def ws_save_options(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Validate and store; the update listener then reloads the instance."""
    if (entry := _entry(hass, msg["entry_id"])) is None:
        connection.send_error(msg["id"], "not_found", "Instanz nicht gefunden")
        return
    try:
        options = normalize_options(msg["options"])
    except vol.Invalid as err:
        connection.send_error(msg["id"], "invalid", f"Ungültige Eingabe: {err}")
        return
    title = msg["title"].strip() or entry.title
    hass.config_entries.async_update_entry(entry, title=title, options=options)
    connection.send_result(msg["id"], {"title": title, "options": options})


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/suggest"})
@callback
def ws_suggest(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Suggest sensors for the editor from all sensor entities."""
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
    connection.send_result(msg["id"], suggest(sensors))
