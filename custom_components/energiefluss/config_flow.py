"""Config flow: name, automatic sensor detection, and the card for a new dashboard.

Made for people who never read the README: afterwards the card already works and
a notification says where everything is.
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
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
)

from .const import (
    CARD_CHOICES,
    CARD_GLASS,
    CONF_ENERGY_PERIOD,
    CONF_SETUP_CARD,
    DOMAIN,
    PANEL_URL_PATH,
    PERIOD_MIDNIGHT,
)
from .detect import options_from_suggestions, summary
from .discovery import friendly_name, suggestions
from .schema import normalize_options

CONF_NAME = "name"
CONF_USE_DETECTED = "use_detected"


class EnergieflussConfigFlow(ConfigFlow, domain=DOMAIN):
    """Name -> detected sensors -> card."""

    VERSION = 1

    def __init__(self) -> None:
        self._title = "Wattrio"
        self._detected: dict[str, Any] = {}
        self._options: dict[str, Any] = {CONF_ENERGY_PERIOD: PERIOD_MIDNIGHT}
        self._loads = 0

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
        if user_input is not None:
            if user_input.get(CONF_USE_DETECTED) and self._detected:
                self._options = self._detected
            return await self.async_step_card()

        sg = suggestions(self.hass)
        self._loads = len(sg.get("loads") or [])
        try:
            self._detected = normalize_options(
                options_from_suggestions(sg) | {CONF_ENERGY_PERIOD: PERIOD_MIDNIGHT}
            )
        except vol.Invalid:
            self._detected = {}
        found = summary(sg, lambda e: friendly_name(self.hass, e), self._german())
        if not self._detected or not found:
            # nothing to confirm: say so and go on with the card
            return self.async_show_form(step_id="nothing", data_schema=vol.Schema({}))
        return self.async_show_form(
            step_id="detect",
            data_schema=vol.Schema({vol.Required(CONF_USE_DETECTED, default=True): BooleanSelector()}),
            description_placeholders={"found": found, "loads": str(self._loads)},
        )

    async def async_step_nothing(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        return await self.async_step_card()

    async def async_step_card(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(
                title=self._title,
                data={CONF_SETUP_CARD: user_input[CONF_SETUP_CARD], "detected_loads": self._loads},
                options=self._options,
            )
        return self.async_show_form(
            step_id="card",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_SETUP_CARD, default=CARD_GLASS): SelectSelector(
                        SelectSelectorConfig(
                            options=list(CARD_CHOICES),
                            mode=SelectSelectorMode.LIST,
                            translation_key=CONF_SETUP_CARD,
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
