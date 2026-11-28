import { describe, expect, it } from "vitest";
import { statesChanged, watchedEntities } from "./watched";

const layout = {
  entry_id: "abc123",
  title: "Energie",
  energy_period: "midnight",
  home_today: "sensor.energiefluss_home_today",
  entities: { solar_power: "sensor.energiefluss_solar_power", surplus: null },
  solar: { strings: [{ entity: "sensor.pv_ost" }], today: null, forecast_remaining: "sensor.forecast_rest" },
  batteries: [
    {
      name: "Speicher 3",
      capacity_kwh: 5,
      power: "sensor.bat3_power",
      soc: "sensor.bat3_soc",
      backup: [{ entity: "sensor.fridge", today: "sensor.fridge_today", children: [] }],
    },
  ],
  grid: { price: "sensor.tibber_price", export_price: null, export_price_fixed: 8.2 },
  wallbox: { name: "Wallbox", power: "sensor.wallbox", soc: "sensor.car_soc", today: null, flexible: true },
  loads: {
    fixed: [{ entity: "sensor.tv", today: "sensor.tv_today", children: [{ entity: "sensor.kettle", today: null }] }],
    flexible: [],
  },
  names: { "sensor.tv": "Fernseher" },
};

describe("watched entities", () => {
  it("finds every entity id of the layout, and nothing else", () => {
    expect([...watchedEntities(layout)].sort()).toEqual(
      [
        "sensor.bat3_power",
        "sensor.bat3_soc",
        "sensor.car_soc",
        "sensor.energiefluss_home_today",
        "sensor.energiefluss_solar_power",
        "sensor.forecast_rest",
        "sensor.fridge",
        "sensor.fridge_today",
        "sensor.kettle",
        "sensor.pv_ost",
        "sensor.tibber_price",
        "sensor.tv",
        "sensor.tv_today",
        "sensor.wallbox",
      ].sort(),
    );
  });

  it("reports a change only for watched entities", () => {
    const a = { state: "1" };
    const before = { "sensor.tv": a, "light.kitchen": { state: "on" } };
    const ids = ["sensor.tv", "sensor.wallbox"];
    expect(statesChanged(ids, before, { ...before, "light.kitchen": { state: "off" } })).toBe(false);
    expect(statesChanged(ids, before, { ...before, "sensor.tv": { state: "2" } })).toBe(true);
    // a sensor that appears (or disappears) counts as a change
    expect(statesChanged(ids, before, { ...before, "sensor.wallbox": { state: "0" } })).toBe(true);
  });
});
