// Pure helpers (unit-tested in format.test.ts).

export interface StateLike {
  state: string;
  attributes: Record<string, unknown>;
}

const POWER_FACTORS: Record<string, number> = { W: 1, kW: 1000, MW: 1_000_000, mW: 0.001 };
const ENERGY_FACTORS: Record<string, number> = { Wh: 0.001, kWh: 1, MWh: 1000 };

export function num(s: StateLike | undefined): number | null {
  if (!s) return null;
  const v = parseFloat(s.state);
  return Number.isFinite(v) ? v : null;
}

/** Power state in W, honouring W/kW/MW units. */
export function watts(s: StateLike | undefined): number | null {
  const v = num(s);
  if (v === null) return null;
  const unit = (s!.attributes.unit_of_measurement as string | undefined) ?? "W";
  return v * (POWER_FACTORS[unit] ?? 1);
}

/** Energy state in kWh, honouring Wh/kWh/MWh units. */
export function kwh(s: StateLike | undefined): number | null {
  const v = num(s);
  if (v === null) return null;
  const unit = (s!.attributes.unit_of_measurement as string | undefined) ?? "kWh";
  return v * (ENERGY_FACTORS[unit] ?? 1);
}

/** "–" for unknown, "850 W" below 1 kW, "1,25 kW" above (locale aware). */
export function fmtPower(w: number | null, locale = "de"): string {
  if (w === null) return "–";
  const abs = Math.abs(w);
  if (abs < 1000) return `${Math.round(w).toLocaleString(locale)} W`;
  return `${(w / 1000).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kW`;
}

export function fmtEnergy(k: number | null, locale = "de"): string {
  if (k === null) return "–";
  return `${k.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kWh`;
}

export function fmtPercent(p: number | null, locale = "de"): string {
  if (p === null) return "–";
  return `${Math.round(p).toLocaleString(locale)} %`;
}

/** Seconds a dot needs for one pass: fast for high power, slow for low. */
export function flowDuration(w: number, maxW: number): number {
  const ratio = Math.min(Math.abs(w) / Math.max(maxW, 1), 1);
  return +(6 - 5 * ratio).toFixed(2); // 6 s .. 1 s
}

/** Stroke width between 1 and 4 px depending on power. */
export function lineWidth(w: number | null, maxW: number): number {
  if (w === null) return 1;
  const ratio = Math.min(Math.abs(w) / Math.max(maxW, 1), 1);
  return +(1 + 3 * ratio).toFixed(2);
}

/** Share of house consumption not drawn from the grid, in %. */
export function autarky(home: number | null, gridImport: number | null): number | null {
  if (home === null || gridImport === null || home <= 0) return null;
  return Math.max(0, Math.min(100, (1 - gridImport / home) * 100));
}

export function shortName(name: string, max = 9): string {
  return name.length > max ? name.slice(0, max - 1) + "…" : name;
}

/** Price state in ct/kWh: accepts €/kWh, EUR/kWh or ct/kWh units. */
export function centsPerKwh(s: StateLike | undefined): number | null {
  const v = num(s);
  if (v === null) return null;
  const unit = String(s!.attributes.unit_of_measurement ?? "").toLowerCase();
  return unit.includes("ct") || unit.includes("cent") ? v : v * 100;
}

export function fmtCents(c: number | null, locale = "de"): string {
  if (c === null) return "";
  return `${c.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ct/kWh`;
}

const POWER_UNITS = ["W", "kW", "MW", "mW"];

/** Warning text if an entity chosen as power sensor has no power unit. */
export function powerUnitWarning(s: StateLike | undefined): string | null {
  if (!s) return "Sensor nicht gefunden";
  const unit = s.attributes.unit_of_measurement as string | undefined;
  if (unit && !POWER_UNITS.includes(unit)) return `Einheit „${unit}“ ist keine Leistung (W/kW)`;
  return null;
}

/** How a battery reading is understood: charging positive after optional inversion. */
export function batteryMeaning(w: number | null, invert: boolean): string {
  if (w === null) return "kein Wert";
  const p = invert ? -w : w;
  if (Math.abs(p) < 5) return "ruht";
  return p > 0 ? "lädt" : "entlädt";
}

/** How a grid reading is understood: import positive after optional inversion. */
export function gridMeaning(w: number | null, invert: boolean): string {
  if (w === null) return "kein Wert";
  const p = invert ? -w : w;
  if (Math.abs(p) < 5) return "ausgeglichen";
  return p > 0 ? "Bezug" : "Einspeisung";
}
