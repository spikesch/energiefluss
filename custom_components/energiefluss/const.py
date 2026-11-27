"""Constants for the Energiefluss integration."""

from __future__ import annotations

DOMAIN = "energiefluss"

MAX_BATTERIES = 5  # editor adds them with '+'
MAX_BACKUP_BATTERIES = 2  # batteries with their own backup output

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
# Power either from one signed sensor (combined) or from two positive ones (split).
CONF_BATTERY_MODE = "mode"
CONF_BATTERY_CHARGE = "charge_power"
CONF_BATTERY_DISCHARGE = "discharge_power"
# True: the battery cannot feed the house; it only takes power in (charge input,
# incl. pass-through) and gives it out to its own backup loads (e.g. EcoFlow).
CONF_BATTERY_BACKUP_ONLY = "backup_only"
MODE_COMBINED = "combined"
MODE_SPLIT = "split"

CONF_GRID_POWER = "grid_power"
CONF_GRID_INVERT = "grid_invert"  # True: sensor reports import as negative
CONF_GRID_MODE = "grid_mode"  # combined | split (e.g. Tibber: power + power_production)
CONF_GRID_IMPORT_POWER = "grid_import_power"
CONF_GRID_EXPORT_POWER = "grid_export_power"
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
# Loads on a battery's own backup (emergency power) output (per battery).
CONF_BACKUP_LOADS = "backup_loads"
# Wallbox / EV charger on the inverter side: power, optional car SoC.
# Loads already contained in another load (e.g. a kettle measured inside a
# sub-distribution): child entity -> parent entity. Not counted twice.
CONF_LOAD_PARENTS = "load_parents"
CONF_WALLBOX_NAME = "wallbox_name"
CONF_WALLBOX_POWER = "wallbox_power"
CONF_WALLBOX_SOC = "wallbox_soc"
CONF_WALLBOX_FLEXIBLE = "wallbox_flexible"  # counts as controllable load (default on)

# Daily energy values: since local midnight or over the last 24 hours.
CONF_ENERGY_PERIOD = "energy_period"
PERIOD_MIDNIGHT = "midnight"
PERIOD_ROLLING = "rolling24"
HOME_ENERGY_KEY = "__home__"

# Energy counters kept by the integration itself: counter key ->
# (Result attribute providing the power, sensor name base).
ENERGY_TOTALS: dict[str, tuple[str, str]] = {
    HOME_ENERGY_KEY: ("home_power", "home"),
    "__solar__": ("solar_power", "solar"),
    "__grid_import__": ("grid_import", "grid_import"),
    "__grid_export__": ("grid_export", "grid_export"),
    "__battery_charge__": ("battery_charge", "battery_charge"),
    "__battery_discharge__": ("battery_discharge", "battery_discharge"),
    "__unmeasured__": ("unmeasured_power", "unmeasured"),
}


def battery_key(index: int) -> str:
    """Section / storage key for battery number ``index`` (1-based)."""
    return f"battery_{index}"


def load_today_unique_id(entry_id: str, source_entity: str) -> str:
    """Unique id of the 'today' energy sensor for one load."""
    return f"{entry_id}_today_{source_entity}"


def total_today_unique_id(entry_id: str, name: str) -> str:
    """Unique id of an own energy counter sensor (home, solar, grid_import, ...)."""
    return f"{entry_id}_{name}_today"


def home_today_unique_id(entry_id: str) -> str:
    """Unique id of the house energy sensor."""
    return total_today_unique_id(entry_id, "home")


# Card asset
CARD_FILENAME = "energiefluss-card.js"
PANEL_FILENAME = "energiefluss-panel.js"
PANEL_URL_PATH = "energiefluss"

# Setup: card for the dashboard created after the config flow (entry.data, once)
CONF_SETUP_CARD = "setup_card"
CARD_GLASS = "glass"
CARD_CLASSIC = "classic"
CARD_NONE = "none"
CARD_CHOICES = (CARD_GLASS, CARD_CLASSIC, CARD_NONE)
CARD_TYPES = {CARD_GLASS: "custom:energiefluss-glass-card", CARD_CLASSIC: "custom:energiefluss-card"}
DASHBOARD_URL = "wattrio-energiefluss"
CARD_URL_BASE = "/energiefluss_static"
