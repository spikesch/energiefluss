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

import { batterySlots } from "./format";

describe("battery layout", () => {
  it("keeps the classic positions up to three", () => {
    expect(batterySlots(3).map((s) => s.cx)).toEqual([160, 228, 296]);
  });
  it("staggers from the right: high, low, high, low, high", () => {
    const tops = batterySlots(5).map((s) => s.top);
    expect(tops).toEqual([290, 334, 290, 334, 290]);
    expect(batterySlots(2).map((s) => s.top)).toEqual([334, 290]);
  });
  it("stays left of the feed lanes (x >= 358)", () => {
    for (let n = 1; n <= 5; n++) {
      expect(Math.max(...batterySlots(n).map((x) => x.cx + x.w / 2))).toBeLessThan(354);
    }
  });
});

import { fitLabel } from "./format";

describe("fitLabel", () => {
  it("short names stay on one line", () => {
    expect(fitLabel("Kühlschrank")).toEqual({ lines: ["Kühlschrank"], small: false });
  });
  it("long names wrap at the space nearest the middle", () => {
    expect(fitLabel("Shelly Plug Waschmaschine")).toEqual({ lines: ["Shelly Plug", "Waschmaschine"], small: true });
  });
  it("very long names are cut with an ellipsis", () => {
    const r = fitLabel("Tripple Klima Leistung Obergeschoss Schlafzimmer");
    expect(r.lines.length).toBe(2);
    expect(r.lines[1].endsWith("…")).toBe(true);
    expect(r.lines.every((l) => l.length <= 19)).toBe(true);
  });
  it("one long word is split hard", () => {
    const r = fitLabel("Waschmaschinensteckdosenleistung");
    expect(r.lines[0]).toBe("Waschmaschinensteck");
    expect(r.lines[1].length).toBeLessThanOrEqual(19);
  });
});

import { dotRadius, pathLength } from "./format";

describe("size style", () => {
  it("bigger dots for more power, within limits", () => {
    expect(dotRadius(0, 5000)).toBe(2.13);
    expect(dotRadius(5000, 5000)).toBe(6.67);
    expect(dotRadius(99999, 5000)).toBe(6.67);
    expect(dotRadius(500, 5000)).toBeLessThan(dotRadius(2000, 5000));
  });
  it("measures M/H/V paths", () => {
    expect(pathLength("M 80 134 V 185 H 148")).toBe(51 + 68);
    expect(pathLength("M 10 10 H 10")).toBe(0);
  });
});
