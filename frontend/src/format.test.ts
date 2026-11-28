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
  it("short names keep a number at the end", () => {
    expect(shortName("Speicher 3", 9)).toBe("Speich… 3");
    expect(shortName("Speicher 3", 11)).toBe("Speicher 3");
    expect(shortName("Notstrom – Speicher 4", 15)).toBe("Notstrom – S… 4");
    expect(shortName("Klimaanlage12", 9)).toBe("Klimaa…12");
    expect(shortName("123456789012", 9)).toBe("12345678…");
  });
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
  it("never breaks inside a word", () => {
    // one word: a single small line, cut only if even that is too long
    expect(fitLabel("Wasserkocher", 8, 12)).toEqual({ lines: ["Wasserkocher"], small: true });
    expect(fitLabel("Waschmaschinensteckdosenleistung")).toEqual({ lines: ["Waschmaschinenstec…"], small: true });
    // first word too long for a line: it is cut, the rest goes below
    expect(fitLabel("Waschmaschinensteckdose Keller", 12, 15)).toEqual({
      lines: ["Waschmaschinen…", "Keller"],
      small: true,
    });
  });
});

import { dotRadius, pathLength, trainBalls } from "./format";

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
    expect(pathLength("M 0 0 L 3 4")).toBe(5);
    // a straight curve is as long as the line
    expect(pathLength("M 0 0 Q 50 0 100 0")).toBeCloseTo(100, 5);
    expect(pathLength("M 0 0 C 10 0 20 0 30 0")).toBeCloseTo(30, 5);
    // a sagging cable is a bit longer than its span
    const sag = pathLength("M 0 0 Q 50 20 100 0");
    expect(sag).toBeGreaterThan(100);
    expect(sag).toBeLessThan(112);
  });
});

import { ICONS, iconFor } from "./icons";

describe("load icons", () => {
  it("picks icons by name", () => {
    expect(iconFor("Kühlschrank Küche Keller")).toBe("fridge");
    expect(iconFor("Waschmaschine Shelly Plug S")).toBe("washMachine");
    expect(iconFor("Klima3")).toBe("airConditioning");
    expect(iconFor("Wasserkocher")).toBe("coffee");
    expect(iconFor("Büro (kW)")).toBe("desktop");
    expect(iconFor("Neubau")).toBe("plug");
  });
  it("loads the svg paths", () => {
    expect(ICONS.fridge.length).toBeGreaterThan(1);
    expect(ICONS.tower[0]).toMatch(/^M/);
  });
});

describe("trainBalls", () => {
  const count = (w: number) => {
    const b = trainBalls(w);
    return (["big", "medium", "small"] as const).map((k) => b.filter((x) => x === k).length);
  };
  it("counts only full values: 1000 W big, 100 W medium, 10 W small", () => {
    expect(count(9)).toEqual([0, 0, 0]);
    expect(count(10)).toEqual([0, 0, 1]);
    expect(count(99)).toEqual([0, 0, 9]);
    expect(count(100)).toEqual([0, 1, 0]);
    expect(count(1234)).toEqual([1, 2, 3]);
    expect(count(6500)).toEqual([6, 5, 0]);
    expect(count(-4070)).toEqual([4, 0, 7]);
  });
  it("puts bigger balls first and caps the big ones", () => {
    expect(trainBalls(2150)).toEqual(["big", "big", "medium", "small", "small", "small", "small", "small"]);
    expect(count(25000)).toEqual([10, 0, 0]);
  });
});

import { colourBalls, sourceShares } from "./format";

describe("source colours", () => {
  it("splits what the house gets by source", () => {
    expect(sourceShares(3000, 1000, 0)).toEqual([0.75, 0.25, 0]);
    expect(sourceShares(null, null, null)).toEqual([1, 0, 0]);
    expect(sourceShares(-5, 0, 500)).toEqual([0, 0, 1]);
  });
  it("gives each ball a source, big and small ones split separately", () => {
    // 10 small balls, 50 % PV, 30 % battery, 20 % grid
    expect(colourBalls(Array(10).fill("small"), [0.5, 0.3, 0.2])).toEqual([0, 0, 0, 0, 0, 1, 1, 1, 2, 2]);
    // 2 big + 3 small, 60 / 40
    expect(colourBalls(["big", "big", "small", "small", "small"], [0.6, 0, 0.4])).toEqual([0, 2, 0, 0, 2]);
    // a single ball takes the biggest source
    expect(colourBalls(["small"], [0.2, 0.5, 0.3])).toEqual([1]);
    // several balls go to the largest remainders; every ball gets a source
    const nine = colourBalls(Array(9).fill("small"), [0.44, 0.1, 0.46]);
    expect(nine).toHaveLength(9);
    expect(nine).toEqual([0, 0, 0, 0, 1, 2, 2, 2, 2]);
  });
});
