"""Config flow: a name and four yes/no questions, nothing more.

For every "yes" the best detected sensors are applied straight away, so the card
already shows the system roughly. The Wattrio page then opens its settings and
goes through them section by section (each one saved and ticked off on its own).
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
from homeassistant.helpers.selector import BooleanSelector, TextSelector

from .const import (
    CONF_BATTERIES,
    CONF_ENERGY_PERIOD,
    CONF_LOOK,
    CONF_SOLAR_STRINGS,
    CONF_TOPICS,
    DOMAIN,
    FIRST_SETUP,
    LOOK_GLASS,
    MAX_BATTERIES,
    MAX_STRINGS,
    PANEL_URL_PATH,
    PERIOD_MIDNIGHT,
    TOPICS,
)
from .detect import choices, options_from_choices
from .discovery import describe, suggestions
from .schema import normalize_options

CONF_NAME = "name"

# which detected items belong to which topic ("grid" is always applied)
TOPIC_KEYS: dict[str, tuple[str, ...]] = {
    "grid": ("grid", "home_power", "grid_import_today", "grid_export_today"),
    "battery": ("battery_",),
    "solar": ("solar_", "solar_today", "solar_forecast_remaining"),
    "tariff": ("grid_price",),
    "wallbox": ("wallbox_power", "wallbox_soc"),
}


def _in_topic(key: str, topic: str) -> bool:
    return any(key == k or (k.endswith("_") and key.startswith(k)) for k in TOPIC_KEYS[topic])


def starting_options(found: list[dict[str, Any]], topics: list[str]) -> dict[str, Any]:
    """Best guesses for the chosen topics; the user checks them section by section."""
    wanted = ["grid", *topics]
    selected = [c["key"] for c in found if c["default"] and any(_in_topic(c["key"], t) for t in wanted)]
    raw = options_from_choices(found, selected)
    if raw.get(CONF_SOLAR_STRINGS):
        raw[CONF_SOLAR_STRINGS] = raw[CONF_SOLAR_STRINGS][:MAX_STRINGS]
    if raw.get(CONF_BATTERIES):
        raw[CONF_BATTERIES] = raw[CONF_BATTERIES][:MAX_BATTERIES]
    base = {CONF_TOPICS: topics, CONF_LOOK: LOOK_GLASS, CONF_ENERGY_PERIOD: PERIOD_MIDNIGHT}
    # never fail the setup for a guess: drop what does not fit
    for attempt in (raw, {k: v for k, v in raw.items() if k != CONF_BATTERIES}, {}):
        try:
            return normalize_options({**attempt, **base})
        except vol.Invalid:
            continue
    return normalize_options(base)


class EnergieflussConfigFlow(ConfigFlow, domain=DOMAIN):
    """Name and what the system has."""

    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            topics = [t for t in TOPICS if user_input.get(t)]
            german = (self.hass.config.language or "").lower().startswith("de")
            found = choices(suggestions(self.hass), lambda e: describe(self.hass, e), german)
            return self.async_create_entry(
                title=user_input[CONF_NAME].strip() or "Wattrio",
                data={FIRST_SETUP: True},
                options=starting_options(found, topics),
            )
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_NAME, default="Wattrio"): TextSelector(),
                    **{vol.Optional(t, default=False): BooleanSelector() for t in TOPICS},
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
