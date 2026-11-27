"""After the first setup: a dashboard with the chosen card and a 'where is what' note."""

from __future__ import annotations

import inspect
import logging
from typing import Any

from homeassistant.components import persistent_notification
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import CARD_NONE, CARD_TYPES, DASHBOARD_URL, PANEL_URL_PATH

_LOGGER = logging.getLogger(__name__)


def _dashboards_collection(hass: HomeAssistant) -> Any | None:
    """The lovelace dashboards collection (HA keeps it only behind its websocket command)."""
    handlers = hass.data.get("websocket_api") or {}
    handler = (handlers.get("lovelace/dashboards/create") or (None,))[0]
    if handler is None:
        return None
    owner = getattr(inspect.unwrap(handler), "__self__", None)
    return getattr(owner, "storage_collection", None)


async def async_create_dashboard(hass: HomeAssistant, entry: ConfigEntry, card: str) -> str | None:
    """Create a storage dashboard showing the card; returns its url path or None."""
    collection = _dashboards_collection(hass)
    if collection is None or card not in CARD_TYPES:
        return None
    from homeassistant.components.lovelace import LOVELACE_DATA  # loaded with the frontend

    dashboards = hass.data[LOVELACE_DATA].dashboards
    url = next(
        u for u in (DASHBOARD_URL, *(f"{DASHBOARD_URL}-{n}" for n in range(2, 50))) if u not in dashboards
    )
    title = "Energiefluss" if url == DASHBOARD_URL else f"Energiefluss {entry.title}"
    try:
        await collection.async_create_item(
            {
                "url_path": url,
                "title": title,
                "icon": "mdi:transmission-tower",
                "show_in_sidebar": True,
                "require_admin": False,
            }
        )
        await dashboards[url].async_save(
            {
                "views": [
                    {
                        "title": title,
                        "path": "energiefluss",
                        "type": "panel",
                        "cards": [{"type": CARD_TYPES[card], "entry_id": entry.entry_id}],
                    }
                ]
            }
        )
    except Exception:  # noqa: BLE001 - never break the setup for a convenience
        _LOGGER.exception("Could not create the Wattrio dashboard")
        return None
    return url


def notify(hass: HomeAssistant, entry: ConfigEntry, card: str, url: str | None, loads: int) -> None:
    """Tell the user what was set up and where to go next."""
    german = (hass.config.language or "").lower().startswith("de")
    settings = f"/{PANEL_URL_PATH}?entry={entry.entry_id}"
    if german:
        lines = [f"**{entry.title}** ist eingerichtet."]
        if url:
            lines.append(f"👉 **[Energiefluss öffnen](/{url})** – das neue Dashboard steht auch in der Seitenleiste.")
        elif card != CARD_NONE:
            lines.append("Das Dashboard konnte nicht automatisch angelegt werden – füge die Karte wie unten beschrieben hinzu.")
        lines.append(
            f"⚙️ **[Sensoren prüfen und ändern]({settings})** – Seitenleiste → **Wattrio**. "
            "Dort siehst du eine Vorschau und kannst alles zuordnen."
        )
        if loads:
            lines.append(
                f"🔌 Es gibt {loads} weitere Leistungs-Sensoren, die Verbraucher sein könnten. "
                "Sortiere sie dort unter **Grundlast** (läuft sowieso: Kühlschrank, Router …) "
                "oder **Zusatzverbraucher** (zeitlich verschiebbar: Waschmaschine, Wallbox …) ein."
            )
        lines.append(
            "🧩 Karte auf einem anderen Dashboard: Dashboard bearbeiten → **Karte hinzufügen** → "
            "nach **Wattrio** suchen → **Wattrio Energiefluss Glas** oder **Klassik**."
        )
        title = "Wattrio ist eingerichtet"
    else:
        lines = [f"**{entry.title}** is set up."]
        if url:
            lines.append(f"👉 **[Open Energiefluss](/{url})** – the new dashboard is also in the sidebar.")
        elif card != CARD_NONE:
            lines.append("The dashboard could not be created automatically – add the card as described below.")
        lines.append(
            f"⚙️ **[Check and change sensors]({settings})** – sidebar → **Wattrio**. "
            "It shows a preview and lets you assign everything."
        )
        if loads:
            lines.append(
                f"🔌 There are {loads} more power sensors that could be loads. Sort them there into "
                "**Base load** (runs anyway: fridge, router …) or **Additional loads** "
                "(can be shifted: washing machine, wallbox …)."
            )
        lines.append(
            "🧩 Card on another dashboard: edit the dashboard → **Add card** → search for "
            "**Wattrio** → **Wattrio Energiefluss Glas** or **Klassik**."
        )
        title = "Wattrio is set up"
    persistent_notification.async_create(
        hass, "\n\n".join(lines), title=title, notification_id=f"energiefluss_setup_{entry.entry_id}"
    )
