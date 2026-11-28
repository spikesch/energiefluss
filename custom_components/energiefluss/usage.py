"""Where else is a sensor used, and what is it called there?

Pure logic (no Home Assistant imports) so it can be unit-tested; usage_ha.py
collects the input from Home Assistant.
"""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass, field
from typing import Any

MAX_NAME = 60
# how far helpers are followed back (power -> Riemann sum -> utility meter)
MAX_CHAIN = 3


@dataclass
class Helper:
    """A helper (utility meter, Riemann sum, group, ...) built on other sensors."""

    title: str
    kind: str
    sources: list[str]
    outputs: list[str] = field(default_factory=list)


@dataclass
class Context:
    """Everything the search looks at."""

    # (title, card configuration) of every dashboard
    dashboards: list[tuple[str, Any]] = field(default_factory=list)
    # preferences of the energy dashboard
    energy: dict[str, Any] | None = None
    helpers: list[Helper] = field(default_factory=list)
    # names for the voice assistants
    aliases: dict[str, list[str]] = field(default_factory=dict)
    # automations, scripts, ... already as readable text
    consumers: dict[str, list[str]] = field(default_factory=dict)
    # entity id -> device id, and which sensors measure power
    device_of: dict[str, str] = field(default_factory=dict)
    power_sensors: set[str] = field(default_factory=set)


def _label(value: Any) -> str | None:
    """A name somebody typed (no templates, no name objects of newer cards)."""
    if not isinstance(value, str):
        return None
    value = value.strip()
    if not value or len(value) > MAX_NAME or any(t in value for t in ("{{", "{%", "[[[")):
        return None
    return value


def _walk(node: Any, wanted: set[str], found: dict[str, dict[str, None]]) -> None:
    """Collect the wanted entities of a card configuration and their card names."""
    if isinstance(node, dict):
        entity = node.get("entity")
        if isinstance(entity, str) and entity in wanted:
            names = found.setdefault(entity, {})
            if name := _label(node.get("name")):
                names[name] = None
        for value in node.values():
            _walk(value, wanted, found)
    elif isinstance(node, list):
        for value in node:
            _walk(value, wanted, found)
    elif isinstance(node, str) and node in wanted:
        found.setdefault(node, {})


def _energy_targets(item: dict[str, Any], wanted: set[str], ctx: Context) -> dict[str, bool]:
    """Sensors an entry of the energy dashboard stands for -> matched via the device only.

    The energy dashboard lists energy counters, Wattrio uses power sensors, so
    follow the entry's power sensor, helper chains and finally the device.
    """
    source_of = {out: h.sources[0] for h in ctx.helpers if len(h.sources) == 1 for out in h.outputs}
    chain: list[str] = [item[k] for k in ("stat_rate", "stat_consumption") if isinstance(item.get(k), str)]
    current = item.get("stat_consumption")
    for _ in range(MAX_CHAIN):
        current = source_of.get(current)
        if current is None:
            break
        chain.append(current)
    if direct := {e: False for e in chain if e in wanted}:
        return direct
    for entity in chain:
        if device := ctx.device_of.get(entity):
            power = [e for e, d in ctx.device_of.items() if d == device and e in ctx.power_sensors]
            # a device with several power sensors (channels, phases) is ambiguous
            if len(power) == 1 and power[0] in wanted:
                return {power[0]: True}
    return {}


def find_usage(wanted: Iterable[str], current: dict[str, str], ctx: Context) -> dict[str, dict[str, Any]]:
    """Per entity: other names ({name, where}) and the places that use it.

    ``current`` holds the names the sensors have now; those are not repeated.
    Only entities with something to report are returned.
    """
    wanted = set(wanted)
    names: dict[str, dict[str, dict[str, str]]] = {e: {} for e in wanted}
    used: dict[str, dict[str, None]] = {e: {} for e in wanted}

    def add_name(entity: str, value: Any, where: str) -> None:
        name = _label(value)
        if name and name.casefold() != current.get(entity, "").strip().casefold():
            names[entity].setdefault(name.casefold(), {"name": name, "where": where})

    # order = how good the name usually is
    energy = ctx.energy or {}
    for item in energy.get("device_consumption") or []:
        for entity, via_device in _energy_targets(item, wanted, ctx).items():
            where = "Energie-Dashboard (gleiches Gerät)" if via_device else "Energie-Dashboard"
            used[entity][where] = None
            add_name(entity, item.get("name"), where)
    sources: dict[str, dict[str, None]] = {}
    _walk(energy.get("energy_sources"), wanted, sources)
    for entity in sources:
        used[entity]["Energie-Dashboard"] = None

    for title, config in ctx.dashboards:
        found: dict[str, dict[str, None]] = {}
        _walk(config, wanted, found)
        where = f"Dashboard „{title}“"
        for entity, card_names in found.items():
            used[entity][where] = None
            for name in card_names:
                add_name(entity, name, where)

    for entity in wanted:
        for alias in ctx.aliases.get(entity) or []:
            add_name(entity, alias, "Sprachassistent")

    for helper in ctx.helpers:
        where = f"{helper.kind} „{helper.title}“"
        for entity in wanted.intersection(helper.sources):
            used[entity][where] = None
            # the name of a group describes the group, not one of its members
            if len(helper.sources) == 1:
                add_name(entity, helper.title, helper.kind)

    for entity in wanted:
        for text in ctx.consumers.get(entity) or []:
            used[entity][text] = None

    return {
        e: {"names": list(names[e].values()), "used": list(used[e])}
        for e in wanted
        if names[e] or used[e]
    }
