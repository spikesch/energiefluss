import { describe, expect, it } from "vitest";
import { editTarget, type EditLayout } from "./edit-target";

const L: EditLayout = {
  entities: { solar_power: "sensor.ef_pv", home_power: "sensor.ef_home", grid_power: "sensor.ef_grid", battery_soc: "sensor.ef_soc" },
  home_today: "sensor.ef_home_today",
  solar: { strings: [{ entity: "sensor.pv_ost" }], today: "sensor.ef_pv_today", forecast_remaining: null },
  batteries: [
    { power: "sensor.ef_b1", soc: "sensor.ef_b1_soc" },
    { power: "sensor.ef_b2", soc: null, backup: [{ entity: "sensor.fridge", today: "sensor.fridge_today" }] },
  ],
  grid: { price: "sensor.price", export_price: null, import_today: "sensor.ef_imp", export_today: null },
  wallbox: { power: "sensor.wb", soc: null, today: "sensor.wb_today" },
  loads: {
    fixed: [{ entity: "sensor.router", today: "sensor.router_today" }],
    flexible: [{ entity: "sensor.kitchen", children: [{ entity: "sensor.kettle", today: "sensor.kettle_today" }] }],
  },
};

describe("editTarget", () => {
  it("maps PV fields to the solar section", () => {
    expect(editTarget(L, "sensor.pv_ost")?.topic).toBe("solar");
    expect(editTarget(L, "sensor.ef_pv")?.topic).toBe("solar");
    expect(editTarget(L, "sensor.ef_pv_today")?.topic).toBe("solar");
  });

  it("finds the battery and its backup loads", () => {
    expect(editTarget(L, "sensor.ef_b2")).toMatchObject({ topic: "battery", battery: 1 });
    expect(editTarget(L, "sensor.fridge_today")).toMatchObject({ topic: "battery", battery: 1 });
    expect(editTarget(L, "sensor.ef_soc")).toEqual({ topic: "battery", entity: "sensor.ef_soc" });
  });

  it("finds loads, contained loads and their energy", () => {
    expect(editTarget(L, "sensor.router_today")).toMatchObject({ topic: "loads", load: "sensor.router" });
    expect(editTarget(L, "sensor.kettle")).toMatchObject({ topic: "loads", load: "sensor.kettle" });
    expect(editTarget(L, "sensor.ef_home")).toEqual({ topic: "loads", entity: "sensor.ef_home" });
  });

  it("maps grid, tariff and wallbox", () => {
    expect(editTarget(L, "sensor.ef_grid")?.topic).toBe("grid");
    expect(editTarget(L, "sensor.ef_imp")?.topic).toBe("grid");
    expect(editTarget(L, "sensor.price")?.topic).toBe("tariff");
    expect(editTarget(L, "sensor.wb_today")?.topic).toBe("wallbox");
    expect(editTarget(L, "sensor.unknown")).toBeUndefined();
  });
});
