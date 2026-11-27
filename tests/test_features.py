"""Only configured parts get their own sensors."""

from __future__ import annotations

import importlib.util
import sys
import types
from pathlib import Path

_dir = Path(__file__).parents[1] / "custom_components" / "energiefluss"
pkg = types.ModuleType("ef_pkg")
pkg.__path__ = [str(_dir)]
sys.modules.setdefault("ef_pkg", pkg)
for name in ("const", "features"):
    spec = importlib.util.spec_from_file_location(f"ef_pkg.{name}", _dir / f"{name}.py")
    mod = importlib.util.module_from_spec(spec)
    sys.modules[f"ef_pkg.{name}"] = mod
    spec.loader.exec_module(mod)  # type: ignore[union-attr]
features = sys.modules["ef_pkg.features"]


def test_empty_config_only_house():
    assert features.wanted_power_sensors({}) == {"home_power"}
    assert features.wanted_totals({}) == {"home"}


def test_solar_grid_battery_without_loads():
    cfg = {"solar_strings": ["sensor.pv"], "grid_power": "sensor.g", "batteries": [{"power": "sensor.b"}]}
    power = features.wanted_power_sensors(cfg)
    assert {"solar_power", "grid_import", "surplus", "home_power"} <= power
    assert "unmeasured_power" not in power and "backup_power" not in power
    assert features.wanted_totals(cfg) == {"home", "solar", "grid_import", "grid_export", "battery_charge", "battery_discharge"}


def test_wallbox_counts_as_flexible_and_load():
    power = features.wanted_power_sensors({"wallbox_power": "sensor.wb"})
    assert {"wallbox_power", "flexible_power", "unmeasured_power"} <= power
