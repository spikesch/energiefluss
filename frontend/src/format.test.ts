import { describe, expect, it } from "vitest";
import { autarky, flowDuration, fmtPower, kwh, lineWidth, shortName, watts } from "./format";

const st = (state: string, unit?: string) => ({ state, attributes: unit ? { unit_of_measurement: unit } : {} });

describe("units", () => {
  it("converts kW to W", () => expect(watts(st("1.5", "kW"))).toBe(1500));
  it("assumes W", () => expect(watts(st("42"))).toBe(42));
  it("unknown is null", () => expect(watts(st("unavailable", "W"))).toBeNull());
  it("Wh to kWh", () => expect(kwh(st("2500", "Wh"))).toBe(2.5));
});

describe("formatting", () => {
  it("small power in W", () => expect(fmtPower(850.4)).toBe("850 W"));
  it("large power in kW", () => expect(fmtPower(1250)).toBe("1,25 kW"));
  it("negative keeps sign", () => expect(fmtPower(-300)).toBe("-300 W"));
  it("unknown dash", () => expect(fmtPower(null)).toBe("–"));
  it("short names", () => expect(shortName("Waschmaschine", 8)).toBe("Waschma…"));
});

describe("flow", () => {
  it("faster with more power", () => expect(flowDuration(5000, 5000)).toBeLessThan(flowDuration(100, 5000)));
  it("clamps duration", () => expect(flowDuration(99999, 5000)).toBe(1));
  it("line width range", () => {
    expect(lineWidth(0, 5000)).toBe(1);
    expect(lineWidth(10000, 5000)).toBe(4);
  });
  it("autarky", () => {
    expect(autarky(1000, 250)).toBe(75);
    expect(autarky(0, 0)).toBeNull();
  });
});

import { centsPerKwh, fmtCents } from "./format";

describe("prices", () => {
  it("EUR/kWh to ct", () => expect(centsPerKwh(st("0.3188", "EUR/kWh"))).toBeCloseTo(31.88));
  it("€/kWh to ct", () => expect(centsPerKwh(st("0.1", "€"))).toBeCloseTo(10));
  it("ct stays ct", () => expect(centsPerKwh(st("8.2", "ct/kWh"))).toBe(8.2));
  it("formats", () => expect(fmtCents(31.88)).toBe("31,9 ct/kWh"));
  it("unknown is empty", () => expect(fmtCents(null)).toBe(""));
});

import { batteryMeaning, gridMeaning, powerUnitWarning } from "./format";

describe("editor hints", () => {
  it("battery sign", () => {
    expect(batteryMeaning(-600, false)).toBe("entlädt");
    expect(batteryMeaning(-600, true)).toBe("lädt");
    expect(batteryMeaning(2, false)).toBe("ruht");
    expect(batteryMeaning(null, false)).toBe("kein Wert");
  });
  it("grid sign", () => {
    expect(gridMeaning(470, false)).toBe("Bezug");
    expect(gridMeaning(470, true)).toBe("Einspeisung");
  });
  it("unit warning", () => {
    expect(powerUnitWarning(st("5", "kWh"))).toContain("keine Leistung");
    expect(powerUnitWarning(st("5", "kW"))).toBeNull();
    expect(powerUnitWarning(undefined)).toBe("Sensor nicht gefunden");
  });
});
