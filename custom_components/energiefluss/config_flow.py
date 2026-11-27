"""Config flow, topic by topic: grid, then PV, batteries, backup, wallbox and tariff.

Each topic first asks "do you have it?" and only then shows the sensors found for
it (with their current values), so nobody has to understand a long list at once.
Afterwards the Wattrio page (top of the sidebar) shows the card right away.
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.core import callback
from homeassistant.helpers.selector import (
    BooleanSelector,
    EntitySelector,
    EntitySelectorConfig,
    SelectOptionDict,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
)

from .const import (
    CONF_BACKUP_LOADS,
    CONF_BATTERY_BACKUP_ONLY,
    CONF_BATTERY_NAME,
    CONF_ENERGY_PERIOD,
    CONF_GRID_PRICE,
    CONF_LOOK,
    CONF_SOLAR_STRINGS,
    CONF_WALLBOX_POWER,
    DOMAIN,
    FIRST_SETUP,
    LOOK_GLASS,
    LOOKS,
    MAX_BATTERIES,
    PANEL_URL_PATH,
    PERIOD_MIDNIGHT,
)
from .detect import choices, options_from_choices
from .discovery import describe, suggestions
from .schema import normalize_options

CONF_NAME = "name"
CONF_USE = "use"
CONF_MORE = "more"
CONF_BATTERY = "battery"

# which detected items belong to which topic
TOPIC_KEYS: dict[str, tuple[str, ...]] = {
    "grid": ("grid", "home_power", "grid_import_today", "grid_export_today"),
    "solar": ("solar_", "solar_today", "solar_forecast_remaining"),
    "battery": ("battery_",),
    "wallbox": ("wallbox_power", "wallbox_soc"),
    "tariff": ("grid_price",),
}
POWER_SENSORS = EntitySelectorConfig(domain="sensor", device_class="power", multiple=True)


def _in_topic(key: str, topic: str) -> bool:
    return any(key == k or (k.endswith("_") and key.startswith(k)) for k in TOPIC_KEYS[topic])


class EnergieflussConfigFlow(ConfigFlow, domain=DOMAIN):
    """Name -> grid -> PV? -> batteries? -> backup? -> wallbox? -> tariff? -> look."""

    VERSION = 1

    def __init__(self) -> None:
        self._title = "Wattrio"
        self._found: list[dict[str, Any]] = []
        self._raw: dict[str, Any] = {}

    def _german(self) -> bool:
        return (self.hass.config.language or "").lower().startswith("de")

    def _topic(self, topic: str) -> list[dict[str, Any]]:
        return [c for c in self._found if _in_topic(c["key"], topic)]

    def _merge(self, add: dict[str, Any]) -> dict[str, str]:
        """Add a topic's options; returns form errors (nothing is kept on error)."""
        raw = dict(self._raw)
        for k, v in add.items():
            raw[k] = [*raw.get(k, []), *v] if isinstance(v, list) else v
        if len(raw.get("batteries") or []) > MAX_BATTERIES:
            return {"base": "too_many_batteries"}
        try:
            normalize_options(raw)
        except vol.Invalid:
            return {"base": "invalid_selection"}
        self._raw = raw
        return {}

    def _pick_form(self, step_id: str, topic: str, extra: dict[Any, Any], errors: dict[str, str]) -> ConfigFlowResult:
        """Checklist of what was found for a topic, plus optional manual fields."""
        found = self._topic(topic)
        fields: dict[Any, Any] = {}
        if found:
            fields[vol.Optional(CONF_USE, default=[c["key"] for c in found if c["default"]])] = SelectSelector(
                SelectSelectorConfig(
                    options=[SelectOptionDict(value=c["key"], label=c["label"]) for c in found],
                    multiple=True,
                    mode=SelectSelectorMode.LIST,
                )
            )
        fields.update(extra)
        return self.async_show_form(
            step_id=step_id,
            data_schema=vol.Schema(fields),
            errors=errors,
            description_placeholders={
                "found": "" if found else ("Nichts gefunden." if self._german() else "Nothing found."),
                "max": str(MAX_BATTERIES),
            },
        )

    def _picked(self, topic: str, user_input: dict[str, Any]) -> dict[str, Any]:
        return options_from_choices(self._topic(topic), list(user_input.get(CONF_USE) or []))

    # -- name and grid ------------------------------------------------------
    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            self._title = user_input[CONF_NAME].strip() or "Wattrio"
            self._found = choices(suggestions(self.hass), lambda e: describe(self.hass, e), self._german())
            return await self.async_step_grid()
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({vol.Required(CONF_NAME, default="Wattrio"): TextSelector()}),
        )

    async def async_step_grid(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            add = self._picked("grid", user_input)
            if user_input.get("grid_power"):
                add["grid_power"] = user_input["grid_power"]
                add["grid_mode"] = "combined"
            if not (errors := self._merge(add)):
                return await self.async_step_solar()
        extra = {}
        if not any(c["key"] == "grid" for c in self._topic("grid")):
            extra[vol.Optional("grid_power")] = EntitySelector(EntitySelectorConfig(domain="sensor", device_class="power"))
        return self._pick_form("grid", "grid", extra, errors)

    # -- PV -----------------------------------------------------------------
    async def async_step_solar(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        return self.async_show_menu(step_id="solar", menu_options=["solar_pick", "battery"])

    async def async_step_solar_pick(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            add = self._picked("solar", user_input)
            if more := user_input.get(CONF_MORE):
                add[CONF_SOLAR_STRINGS] = [*add.get(CONF_SOLAR_STRINGS, []), *more]
            if not (errors := self._merge(add)):
                return await self.async_step_battery()
        return self._pick_form("solar_pick", "solar", {vol.Optional(CONF_MORE): EntitySelector(POWER_SENSORS)}, errors)

    # -- batteries and backup -------------------------------------------------
    async def async_step_battery(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        return self.async_show_menu(step_id="battery", menu_options=["battery_pick", "wallbox"])

    async def async_step_battery_pick(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            if not (errors := self._merge(self._picked("battery", user_input))):
                if self._raw.get("batteries"):
                    return await self.async_step_backup()
                return await self.async_step_wallbox()
        return self._pick_form("battery_pick", "battery", {}, errors)

    async def async_step_backup(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        return self.async_show_menu(step_id="backup", menu_options=["backup_pick", "wallbox"])

    async def async_step_backup_pick(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        batteries = self._raw.get("batteries") or []
        if user_input is not None:
            index = int(user_input.get(CONF_BATTERY) or 0)
            raw = dict(self._raw)
            bats = [dict(b) for b in batteries]
            bats[index][CONF_BACKUP_LOADS] = list(user_input.get(CONF_BACKUP_LOADS) or [])
            bats[index][CONF_BATTERY_BACKUP_ONLY] = bool(user_input.get(CONF_BATTERY_BACKUP_ONLY))
            raw["batteries"] = bats
            try:
                normalize_options(raw)
            except vol.Invalid:
                errors["base"] = "backup_only_needs_split"
            else:
                self._raw = raw
                return await self.async_step_wallbox()
        return self.async_show_form(
            step_id="backup_pick",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_BATTERY, default="0"): SelectSelector(
                        SelectSelectorConfig(
                            options=[
                                SelectOptionDict(value=str(i), label=b.get(CONF_BATTERY_NAME) or f"Batterie {i + 1}")
                                for i, b in enumerate(batteries)
                            ],
                            mode=SelectSelectorMode.DROPDOWN,
                        )
                    ),
                    vol.Optional(CONF_BACKUP_LOADS): EntitySelector(POWER_SENSORS),
                    vol.Optional(CONF_BATTERY_BACKUP_ONLY, default=False): BooleanSelector(),
                }
            ),
            errors=errors,
        )

    # -- wallbox and tariff -------------------------------------------------
    async def async_step_wallbox(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        return self.async_show_menu(step_id="wallbox", menu_options=["wallbox_pick", "tariff"])

    async def async_step_wallbox_pick(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            add = self._picked("wallbox", user_input)
            if user_input.get(CONF_WALLBOX_POWER):
                add[CONF_WALLBOX_POWER] = user_input[CONF_WALLBOX_POWER]
            if not (errors := self._merge(add)):
                return await self.async_step_tariff()
        extra = {}
        if not any(c["key"] == "wallbox_power" for c in self._topic("wallbox")):
            extra[vol.Optional(CONF_WALLBOX_POWER)] = EntitySelector(
                EntitySelectorConfig(domain="sensor", device_class="power")
            )
        return self._pick_form("wallbox_pick", "wallbox", extra, errors)

    async def async_step_tariff(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        return self.async_show_menu(step_id="tariff", menu_options=["tariff_pick", "look"])

    async def async_step_tariff_pick(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            add = self._picked("tariff", user_input)
            if user_input.get(CONF_GRID_PRICE):
                add[CONF_GRID_PRICE] = user_input[CONF_GRID_PRICE]
            if not (errors := self._merge(add)):
                return await self.async_step_look()
        extra = {}
        if not self._topic("tariff"):
            extra[vol.Optional(CONF_GRID_PRICE)] = EntitySelector(EntitySelectorConfig(domain="sensor"))
        return self._pick_form("tariff_pick", "tariff", extra, errors)

    # -- look -----------------------------------------------------------------
    async def async_step_look(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            options = normalize_options(
                {**self._raw, CONF_LOOK: user_input[CONF_LOOK], CONF_ENERGY_PERIOD: PERIOD_MIDNIGHT}
            )
            return self.async_create_entry(title=self._title, data={FIRST_SETUP: True}, options=options)
        return self.async_show_form(
            step_id="look",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_LOOK, default=LOOK_GLASS): SelectSelector(
                        SelectSelectorConfig(
                            options=list(LOOKS), mode=SelectSelectorMode.LIST, translation_key=CONF_LOOK
                        )
                    )
                }
            ),
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        return EnergieflussOptionsFlow()


class EnergieflussOptionsFlow(OptionsFlow):
    """'Konfigurieren' only points to the visual editor."""

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(data=dict(self.config_entry.options))
        return self.async_show_form(
            step_id="init",
            description_placeholders={"url": f"/{PANEL_URL_PATH}?entry={self.config_entry.entry_id}"},
        )
