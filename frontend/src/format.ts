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

/** Cut a name to `max` characters with an ellipsis. A number at its end stays
 *  ("Speicher 3" → "Speich… 3"): it is what tells similar names apart. */
export function shortName(name: string, max = 9): string {
  if (name.length <= max) return name;
  const tail = /\s*\d+$/.exec(name)?.[0] ?? "";
  if (tail && tail.length <= max - 3) return name.slice(0, max - tail.length - 1).trimEnd() + "…" + tail;
  return name.slice(0, max - 1) + "…";
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

export interface BatterySlot {
  cx: number; // centre x of the widget
  top: number; // y of the power box
  w: number; // width of the power box
}

/** Vertical offset of the lowered batteries in the staggered row. */
export const BATTERY_STAGGER = 44;
/** Top of the raised batteries (below the storage summary box). */
export const BATTERY_TOP = 290;

/**
 * Positions of up to 5 battery widgets in one row below the inverter, left to
 * right. Counted from the right they alternate high / low / high ..., so the
 * two rightmost ones can lead their backup output straight to the right.
 */
export function batterySlots(n: number): BatterySlot[] {
  if (n <= 0) return [];
  const centres = [[230], [195, 275], [160, 228, 296], [140, 192, 244, 296], [136, 184, 232, 280, 328]][
    Math.min(n, 5) - 1
  ];
  const w = n <= 3 ? 54 : n === 4 ? 46 : 44;
  return centres.map((cx, i) => {
    const fromRight = centres.length - 1 - i;
    return { cx, top: BATTERY_TOP + (fromRight % 2 === 1 ? BATTERY_STAGGER : 0), w };
  });
}

/**
 * Fit a label into a small box: one line if short, otherwise two lines
 * (split at the space closest to the middle) in a smaller font, and only
 * if even that does not fit, cut with an ellipsis.
 */
export function fitLabel(name: string, maxOne = 15, maxTwo = 19): { lines: string[]; small: boolean } {
  const text = name.trim();
  if (text.length <= maxOne) return { lines: [text], small: false };
  const cut = (s: string) => (s.length > maxTwo ? s.slice(0, maxTwo - 1) + "…" : s);
  const spaces = [...text.matchAll(/ /g)].map((m) => m.index!);
  const fitting = spaces.filter((i) => i <= maxTwo && text.length - i - 1 <= maxTwo);
  const pool = fitting.length ? fitting : spaces.filter((i) => i <= maxTwo);
  if (pool.length) {
    const mid = text.length / 2;
    const at = pool.reduce((a, b) => (Math.abs(b - mid) < Math.abs(a - mid) ? b : a));
    return { lines: [text.slice(0, at), cut(text.slice(at + 1))], small: true };
  }
  // the first word alone is too long: never break inside a word. One word
  // stays one small line (cut if needed), otherwise the rest goes below it.
  const space = text.indexOf(" ");
  if (space < 0) return { lines: [cut(text)], small: true };
  return { lines: [cut(text.slice(0, space)), cut(text.slice(space + 1).trim())], small: true };
}

/** Dot radius between about 2.1 and 6.7 px depending on power (for the "size" style). */
/** Overall size of the dots in the "size" style (1 = original, 4/3 = a third bigger). */
export const DOT_SCALE = 4 / 3;

export function dotRadius(w: number, maxW: number): number {
  const ratio = Math.min(Math.abs(w) / Math.max(maxW, 1), 1);
  return +((1.6 + 3.4 * Math.sqrt(ratio)) * DOT_SCALE).toFixed(2);
}

/** Length of a path made of M / H / V commands (all our flow lines are). */
export function pathLength(d: string): number {
  // absolute M, H, V, L, Q and C; curves are measured along 24 short chords
  const tokens = d.trim().split(/[\s,]+/);
  let x = 0;
  let y = 0;
  let len = 0;
  const curve = (pts: number[][]) => {
    const at = (t: number) => {
      // de Casteljau on the control points
      let p = pts.map((q) => [...q]);
      while (p.length > 1) p = p.slice(1).map((q, i) => [p[i][0] + (q[0] - p[i][0]) * t, p[i][1] + (q[1] - p[i][1]) * t]);
      return p[0];
    };
    let [px, py] = pts[0];
    for (let k = 1; k <= 24; k++) {
      const [nx, ny] = at(k / 24);
      len += Math.hypot(nx - px, ny - py);
      [px, py] = [nx, ny];
    }
  };
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === "M") {
      x = +tokens[++i];
      y = +tokens[++i];
    } else if (t === "H") {
      const nx = +tokens[++i];
      len += Math.abs(nx - x);
      x = nx;
    } else if (t === "V") {
      const ny = +tokens[++i];
      len += Math.abs(ny - y);
      y = ny;
    } else if (t === "L") {
      const nx = +tokens[++i];
      const ny = +tokens[++i];
      len += Math.hypot(nx - x, ny - y);
      [x, y] = [nx, ny];
    } else if (t === "Q" || t === "C") {
      const n = t === "Q" ? 2 : 3;
      const pts = [[x, y]];
      for (let k = 0; k < n; k++) pts.push([+tokens[++i], +tokens[++i]]);
      curve(pts);
      [x, y] = pts[n];
    }
  }
  return len;
}

export type BallKind = "big" | "medium" | "small";

/**
 * Balls of a train for a power, counting only full values: one big ball per
 * full 1000 W, one medium ball per full 100 W of the rest, one small ball per
 * full 10 W of the rest – below 10 W no ball. Bigger balls come first; the big
 * ones are capped at `max`.
 */
export function trainBalls(watts: number, max = 10): BallKind[] {
  // tiny epsilon against floating point (e.g. 0.3 * 1000)
  const w = Math.floor(Math.abs(watts) + 1e-9);
  const big = Math.floor(w / 1000);
  const medium = Math.floor((w % 1000) / 100);
  const small = Math.floor((w % 100) / 10);
  return [
    ...(Array(Math.min(big, max)).fill("big") as BallKind[]),
    ...(Array(medium).fill("medium") as BallKind[]),
    ...(Array(small).fill("small") as BallKind[]),
  ];
}

/** Shares of the sources (PV, battery, grid) in what the house gets right now. */
export function sourceShares(solar: number | null, discharge: number | null, gridImport: number | null): number[] {
  const parts = [solar, discharge, gridImport].map((w) => Math.max(0, w ?? 0));
  const sum = parts.reduce((a, b) => a + b, 0);
  return sum > 0 ? parts.map((w) => w / sum) : [1, 0, 0];
}

/**
 * Which source each ball of a train shows: each ball size is split separately
 * by the shares (largest remainder), in source order, so a train reads
 * "PV, then battery, then grid" within each size.
 */
export function colourBalls(kinds: BallKind[], shares: number[]): number[] {
  const split = (n: number) => {
    const raw = shares.map((s) => s * n);
    const counts = raw.map(Math.floor);
    const order = raw.map((r, i) => [r - Math.floor(r), i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
    const missing = n - counts.reduce((a, b) => a + b, 0);
    for (let k = 0; k < missing; k++) counts[order[k][1]]++;
    return counts.flatMap((c, i) => Array(c).fill(i) as number[]);
  };
  const bySize = new Map((["big", "medium", "small"] as BallKind[]).map((k) => [k, split(kinds.filter((x) => x === k).length)]));
  return kinds.map((k) => bySize.get(k)!.shift()!);
}
