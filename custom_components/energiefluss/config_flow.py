"""Config flow: name, the detected sensors as a checklist, and the look of the card.

Made for people who never read the README: afterwards the Wattrio page (top of the
sidebar) already shows the card, and a notification says where everything is.
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
    SelectOptionDict,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
)

from .const import (
    CONF_ENERGY_PERIOD,
    CONF_LOOK,
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


class EnergieflussConfigFlow(ConfigFlow, domain=DOMAIN):
    """Name -> detected sensors (checklist) -> look."""

    VERSION = 1

    def __init__(self) -> None:
        self._title = "Wattrio"
        self._found: list[dict[str, Any]] = []
        self._options: dict[str, Any] = {}

    def _german(self) -> bool:
        return (self.hass.config.language or "").lower().startswith("de")

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            self._title = user_input[CONF_NAME].strip() or "Wattrio"
            return await self.async_step_detect()
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({vol.Required(CONF_NAME, default="Wattrio"): TextSelector()}),
        )

    async def async_step_detect(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is None:
            self._found = choices(suggestions(self.hass), lambda e: describe(self.hass, e), self._german())
            if not self._found:
                return self.async_show_form(step_id="nothing", data_schema=vol.Schema({}))
            selected = [c["key"] for c in self._found if c["default"]]
        else:
            selected = list(user_input.get(CONF_USE) or [])
            raw = options_from_choices(self._found, selected)
            if len(raw.get("batteries") or []) > MAX_BATTERIES:
                errors["base"] = "too_many_batteries"
            else:
                try:
                    self._options = normalize_options(raw)
                except vol.Invalid:
                    errors["base"] = "invalid_selection"
                else:
                    return await self.async_step_look()

        return self.async_show_form(
            step_id="detect",
            data_schema=vol.Schema(
                {
                    vol.Optional(CONF_USE, default=selected): SelectSelector(
                        SelectSelectorConfig(
                            options=[SelectOptionDict(value=c["key"], label=c["label"]) for c in self._found],
                            multiple=True,
                            mode=SelectSelectorMode.LIST,
                        )
                    )
                }
            ),
            errors=errors,
            description_placeholders={"max": str(MAX_BATTERIES)},
        )

    async def async_step_nothing(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        self._options = normalize_options({})
        return await self.async_step_look()

    async def async_step_look(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            options = {**self._options, CONF_LOOK: user_input[CONF_LOOK], CONF_ENERGY_PERIOD: PERIOD_MIDNIGHT}
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
