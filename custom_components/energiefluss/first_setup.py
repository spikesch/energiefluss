"""Once after the setup dialog: put Wattrio on top of the sidebar and say where things are."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.components import persistent_notification
from homeassistant.components.frontend.storage import async_system_store, async_user_store
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import PANEL_URL_PATH

_LOGGER = logging.getLogger(__name__)
SIDEBAR = "sidebar"


def on_top(sidebar: dict[str, Any] | None) -> dict[str, Any]:
    """Sidebar settings with the Wattrio page first and not hidden."""
    sidebar = dict(sidebar or {})
    order = [p for p in sidebar.get("panelOrder") or [] if p != PANEL_URL_PATH]
    sidebar["panelOrder"] = [PANEL_URL_PATH, *order]
    sidebar["hiddenPanels"] = [p for p in sidebar.get("hiddenPanels") or [] if p != PANEL_URL_PATH]
    return sidebar


async def async_sidebar_on_top(hass: HomeAssistant) -> None:
    """For every person (and the admin default, if set): Wattrio at the top of the sidebar."""
    try:
        system = await async_system_store(hass)
        if system.data.get(SIDEBAR):
            await system.async_set_item(SIDEBAR, on_top(system.data[SIDEBAR]))
        for user in await hass.auth.async_get_users():
            if user.system_generated or not user.is_active:
                continue
            store = await async_user_store(hass, user.id)
            await store.async_set_item(SIDEBAR, on_top(store.data.get(SIDEBAR)))
    except Exception:  # noqa: BLE001 - a convenience, never break the setup
        _LOGGER.exception("Could not move Wattrio to the top of the sidebar")


def notify(hass: HomeAssistant, entry: ConfigEntry, configured: bool) -> None:
    """Tell the user where everything is."""
    german = (hass.config.language or "").lower().startswith("de")
    page = f"/{PANEL_URL_PATH}?entry={entry.entry_id}"
    if german:
        lines = [
            f"**{entry.title}** ist eingerichtet.",
            f"👉 **[Wattrio öffnen]({page})** – ganz oben in der Seitenleiste. Dort läuft der Energiefluss.",
            "⚙️ Oben rechts auf **Einstellungen**: Sensoren prüfen und deine Verbraucher in **Grundlast** "
            "(läuft sowieso: Kühlschrank, Router …) und **Zusatzverbraucher** (zeitlich verschiebbar: "
            "Waschmaschine, Wallbox …) einsortieren.",
            "🧩 Die Karte auf einem eigenen Dashboard: Dashboard bearbeiten → **Karte hinzufügen** → nach "
            "**Wattrio** suchen. (Falls sie nicht auftaucht: die Seite einmal neu laden.)",
        ]
        if not configured:
            lines.insert(1, "Es sind noch keine Sensoren zugeordnet – das geht unter **Einstellungen** auf der Wattrio-Seite.")
        title = "Wattrio ist eingerichtet"
    else:
        lines = [
            f"**{entry.title}** is set up.",
            f"👉 **[Open Wattrio]({page})** – at the top of the sidebar. The energy flow runs there.",
            "⚙️ Top right, **Einstellungen** (settings): check the sensors and sort your loads into **Grundlast** "
            "(base load: fridge, router …) and **Zusatzverbraucher** (additional, can be shifted: washing "
            "machine, wallbox …).",
            "🧩 The card on your own dashboard: edit the dashboard → **Add card** → search for **Wattrio**. "
            "(If it does not show up: reload the page once.)",
        ]
        if not configured:
            lines.insert(1, "No sensors assigned yet – do that under **Einstellungen** on the Wattrio page.")
        title = "Wattrio is set up"
    persistent_notification.async_create(
        hass, "\n\n".join(lines), title=title, notification_id=f"energiefluss_setup_{entry.entry_id}"
    )
