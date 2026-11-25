"""Config flow: only the name. Everything else happens in the visual editor."""

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
from homeassistant.helpers.selector import TextSelector

from .const import CONF_ENERGY_PERIOD, DOMAIN, PANEL_URL_PATH, PERIOD_MIDNIGHT

CONF_NAME = "name"


class EnergieflussConfigFlow(ConfigFlow, domain=DOMAIN):
    """Create an (empty) instance; sensors are assigned in the editor."""

    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(
                title=user_input[CONF_NAME].strip() or "Energiefluss",
                data={},
                options={CONF_ENERGY_PERIOD: PERIOD_MIDNIGHT},
            )
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({vol.Required(CONF_NAME, default="Energiefluss"): TextSelector()}),
            description_placeholders={"url": f"/{PANEL_URL_PATH}"},
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
