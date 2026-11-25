"""Constants for the Energiefluss integration."""

from __future__ import annotations

DOMAIN = "energiefluss"

MAX_BATTERIES = 3

# Config keys (stored in entry.options)
CONF_SOLAR_STRINGS = "solar_strings"
CONF_SOLAR_TODAY = "solar_today"
CONF_SOLAR_FORECAST = "solar_forecast_remaining"

CONF_BATTERIES = "batteries"  # stored as a list of dicts
CONF_BATTERY_POWER = "power"
CONF_BATTERY_SOC = "soc"
CONF_BATTERY_CAPACITY = "capacity_kwh"
CONF_BATTERY_NAME = "name"
CONF_BATTERY_INVERT = "invert"  # True: sensor reports charging as negative

CONF_GRID_POWER = "grid_power"
CONF_GRID_INVERT = "grid_invert"  # True: sensor reports import as negative
CONF_GRID_PRICE = "grid_price"  # import price sensor (e.g. Tibber)
CONF_GRID_EXPORT_PRICE = "grid_export_price"  # feed-in tariff sensor
CONF_GRID_EXPORT_PRICE_FIXED = "grid_export_price_fixed"  # feed-in tariff in ct/kWh
CONF_GRID_IMPORT_TODAY = "grid_import_today"
CONF_GRID_EXPORT_TODAY = "grid_export_today"

CONF_HOME_POWER = "home_power"  # optional measured house consumption
# Loads are grouped by whether their timing can be shifted (e.g. washing
# machine, wallbox) or not (fridge, TV). All of them are part of the house.
CONF_FIXED_LOADS = "fixed_loads"
CONF_FLEXIBLE_LOADS = "flexible_loads"

# Daily energy values: since local midnight or over the last 24 hours.
CONF_ENERGY_PERIOD = "energy_period"
PERIOD_MIDNIGHT = "midnight"
PERIOD_ROLLING = "rolling24"
HOME_ENERGY_KEY = "__home__"


def battery_key(index: int) -> str:
    """Section / storage key for battery number ``index`` (1-based)."""
    return f"battery_{index}"


def load_today_unique_id(entry_id: str, source_entity: str) -> str:
    """Unique id of the 'today' energy sensor for one load."""
    return f"{entry_id}_today_{source_entity}"


def home_today_unique_id(entry_id: str) -> str:
    """Unique id of the house energy sensor."""
    return f"{entry_id}_home_today"


# Card asset
CARD_FILENAME = "energiefluss-card.js"
PANEL_FILENAME = "energiefluss-panel.js"
PANEL_URL_PATH = "energiefluss"
CARD_URL_BASE = "/energiefluss_static"
