// "Energiefluss Glas": same data, layout and editor as the classic card, drawn
// as 2.5D glass: glass slabs, glass tubes with glowing balls running through
// them, a glass house and pylon and batteries filled with moving liquid.
// Everything animated stays filter-free so the card stays light on the CPU.

import { css, svg, nothing, type SVGTemplateResult } from "lit";
import {
  EnergieflussCard,
  LOAD_PW,
  LOAD_X0,
  LOAD_X1,
  LOAD_XP,
  MIN_FLOW_W,
  STORE_H,
  rowCount,
  type LoadGroup,
} from "./energiefluss-card";
import {
  colourBalls,
  fitLabel,
  fmtCents,
  fmtEnergy,
  fmtPercent,
  fmtPower,
  num,
  pathLength,
  shortName,
  sourceShares,
  trainBalls,
  type BallKind,
} from "./format";
import { ICONS, iconFor, type IconName } from "./icons";
import { CAR_IMAGE } from "./car-asset";
import { INVERTER_IMAGE } from "./inverter-asset";
import { SOLAR_IMAGE } from "./solar-asset";

// blue, green and orange; red-orange only for backup
const GLASS = {
  solar: "#ffd43b", // yellow, clearly apart from the other sources
  battery: "#3ee08f",
  grid: "#4db2ff",
  home: "#2fd4b4",
  flexible: "#6f9dff",
  backup: "#ff6a3d",
  inverter: "#a8d4ff",
};

const RIM = "#cfeaff"; // bright glass edge

type Seg = [number, number, number, number];

/** A ball running into a blob: when (s, repeating every period) and how big. */
interface Hit {
  at: number;
  period: number;
  big: boolean;
}

/** One ball of a train: its route, size and timing. */
interface Ball {
  route: string;
  forward: boolean;
  r: number;
  begin: number; // s: when it starts at its route's start (forward) or end (backward)
  travel: number; // s on its route
  period: number; // s until the train comes again
}

// surface offsets of the sloshing liquid (left end, two control points, right end)
const LIQUID_SHAPES = [
  [0, -2.2, 2.2, 0],
  [1.6, 2.4, -1.8, -1.2],
  [-1.2, -1, 2, 1.4],
  [0.8, 2.2, -2.4, 0.4],
];
// Every line carries a calm train of balls at constant speed. Its balls count
// the power (see trainBalls): a big ball per 1000 W, a medium one per 100 W,
// a small one per 10 W.
const TRAIN_SPEED = 26; // px per second
const TRAIN_GAP = 2.5; // px of air between two balls
const TRAIN_PAUSE = 0.7; // s between two trains
const BAT_H = 72; // glass battery: cap at top, cylinder down to top + BAT_H
const BAT_STAGGER = 0.6; // share of the classic up/down offset between batteries
const FONT_SCALE = 0.7; // all text smaller than in the classic look
const BALL_BIG = 5.2;
const BALL_MEDIUM = 2.7;
const BALL_SMALL = 1.6;
const BALL_R: Record<BallKind, number> = { big: BALL_BIG, medium: BALL_MEDIUM, small: BALL_SMALL };

// where trains end and new ones start: a mercury blob on the edge of each
// glass box, where its line to the inverter attaches (clear of the numbers)
// PV: flat string tiles in two rows, the PV total box right below them
// PV: a glass solar panel picture; the four string values sit on its quarters
const SOLAR_X = 6;
const SOLAR_Y = 0;
const SOLAR_W = 130;
const SOLAR_K = SOLAR_W / SOLAR_IMAGE.width; // card units per picture pixel
const SOLAR_URL = import.meta.url.replace(/[^/]*$/, "") + SOLAR_IMAGE.file;
const PANEL_FRAME = 0; // FACE is already the inner edge of the panel's glass frame
const LABEL_GAP = 3.5; // air around each label: to the frame and between labels
const LABEL_W = 44; // nominal label box, only used to pass its middle around
const LABEL_H = 18;
type Pt2 = [number, number];
// the panel's face in card units: top left, top right, bottom right, bottom left
const FACE = SOLAR_IMAGE.face.map(([x, y]) => [SOLAR_X + x * SOLAR_K, SOLAR_Y + y * SOLAR_K] as Pt2);
/** Point on the face at (u, v) in 0..1 (bilinear, follows the slight perspective). */
const onFace = (u: number, v: number): Pt2 => {
  const [tl, tr, br, bl] = FACE;
  const top = [tl[0] + (tr[0] - tl[0]) * u, tl[1] + (tr[1] - tl[1]) * u];
  const bottom = [bl[0] + (br[0] - bl[0]) * u, bl[1] + (br[1] - bl[1]) * u];
  return [top[0] + (bottom[0] - top[0]) * v, top[1] + (bottom[1] - top[1]) * v];
};
/** The four string labels as quadrilaterals filling the face's quarters with an even
 *  gap to the frame and to each other; order: top left, top right, bottom left, bottom right. */
const LABELS = (() => {
  const [tl, tr, , bl] = FACE;
  const w = Math.hypot(tr[0] - tl[0], tr[1] - tl[1]);
  const h = Math.hypot(bl[0] - tl[0], bl[1] - tl[1]);
  const eu = (PANEL_FRAME + LABEL_GAP) / w; // edge margin
  const ev = (PANEL_FRAME + LABEL_GAP) / h;
  const gu = LABEL_GAP / w; // half of it on each side of the middle
  const gv = LABEL_GAP / h;
  const us = [
    [eu, 0.5 - gu / 2],
    [0.5 + gu / 2, 1 - eu],
  ];
  const vs = [
    [ev, 0.5 - gv / 2],
    [0.5 + gv / 2, 1 - ev],
  ];
  return [0, 1, 2, 3].map((i) => {
    const [u0, u1] = us[i % 2];
    const [v0, v1] = vs[Math.floor(i / 2)];
    return {
      corners: [onFace(u0, v0), onFace(u1, v0), onFace(u1, v1), onFace(u0, v1)],
      middle: onFace((u0 + u1) / 2, (v0 + v1) / 2),
      size: [(u1 - u0) * w, (v1 - v0) * h] as Pt2,
    };
  });
})();
const PV_BOX_Y = 82;
const PV_MID: [number, number] = [104, PV_BOX_Y + 26]; // "PV gesamt", bottom edge
const HOUSE_MID: [number, number] = [250, 96]; // house value box, bottom edge
// the storage box sits higher than in the classic look (smaller inverter)
const GLASS_STORE_Y = 196;
const STORE_MID = GLASS_STORE_Y; // storage box, top edge

const LIQUID_SPLINES = "0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1";

const segs = (list: Seg[], dx = 0, dy = 0): string =>
  list.map(([a, b, c, d]) => `M ${a + dx} ${b + dy} L ${c + dx} ${d + dy}`).join(" ");

// Glass pylon in a 0..66 x -4..100 box: front frame, back frame shifted by (7, -4).
const PYLON_LEGS: Seg[] = [
  [22, 40, 8, 86],
  [34, 40, 48, 86],
  [24, 10, 22, 40],
  [32, 10, 34, 40],
  [24, 10, 28, 2],
  [32, 10, 28, 2],
];
const PYLON_ARMS: Seg[] = [
  [12, 12, 44, 12],
  [12, 12, 23.5, 17],
  [44, 12, 32.5, 17],
  [6, 24, 50, 24],
  [6, 24, 22.7, 30],
  [50, 24, 33.3, 30],
  [2, 36, 54, 36],
  [2, 36, 22, 40],
  [54, 36, 34, 40],
];
const PYLON_BRACES: Seg[] = [
  [23.9, 12, 32.9, 24],
  [32.1, 12, 23.1, 24],
  [23.1, 24, 33.7, 36],
  [32.9, 24, 22.3, 36],
  [22, 40, 34, 40],
  [15.9, 60, 40.1, 60],
  [22, 40, 40.1, 60],
  [34, 40, 15.9, 60],
  [15.9, 60, 48, 86],
  [40.1, 60, 8, 86],
];
const PYLON_DEPTH: Seg[] = [
  [8, 86, 15, 82],
  [48, 86, 55, 82],
  [22, 40, 29, 36],
  [34, 40, 41, 36],
  [28, 2, 35, -2],
];
const PYLON_INSULATORS: [number, number][] = [
  [12, 12],
  [44, 12],
  [6, 24],
  [50, 24],
  [2, 36],
  [54, 36],
];
// where the pylon sits in the card (its 0,0) and its scale
const PYLON_X = 10;
const PYLON_Y = 122;
const PYLON_S = 0.7;
// left column below the pylon: grid tile, then wallbox
const TILE_X = 8;
const TILE_W = 54;
const PANEL_GAP = 1.25; // air between two load group panels
const GRID_TILE_Y = 196;
// Glass inverter picture: its top connector sits right below the house box,
// all lines start or end at the tips of its connectors.
const INV_SCALE = 0.24; // card units per picture pixel
const INV_TOP: [number, number] = [250, 116]; // where the top connector's tip goes
const INV_URL = import.meta.url.replace(/[^/]*$/, "") + INVERTER_IMAGE.file;
const invAt = ([x, y]: [number, number]): [number, number] => [
  INV_TOP[0] + (x - INVERTER_IMAGE.top[0]) * INV_SCALE,
  INV_TOP[1] + (y - INVERTER_IMAGE.top[1]) * INV_SCALE,
];
// connector tips in card units: PV, grid, wallbox on the left side
const INV_LEFT = INVERTER_IMAGE.left.map(invAt);
// glass car picture below the grid tile (served next to this script)
const CAR_X = 2;
const CAR_W = 120;
const CAR_URL = import.meta.url.replace(/[^/]*$/, "") + CAR_IMAGE.file;
// height offsets (picture px) of the liquid surface's corners far-front,
// near-front, near-rear, far-rear: the surface tilts gently back and forth
const SLOSH = [
  [0, 0, 0, 0],
  [4, -1.5, -4, 1.5],
  [-1.5, 3, 1.5, -3],
  [-4, 1.5, 4, -1.5],
]; // vertical lane between the tiles and the batteries
const PYLON_NODES: [number, number][] = [
  [28, 2],
  [22, 40],
  [34, 40],
  [15.9, 60],
  [40.1, 60],
  [8, 86],
  [48, 86],
];

export class EnergieflussGlassCard extends EnergieflussCard {
  protected get _c() {
    return { ...GLASS, ...(this._config?.colours ?? {}) };
  }

  // inverter centred under the house; wallbox sits on the left below the pylon
  protected get _invX(): number {
    return INV_LEFT[0][0];
  }
  protected get _solarX(): number {
    return 104;
  }
  protected get _invY(): number {
    return INV_TOP[1];
  }
  protected get _invTop(): [number, number] {
    return INV_TOP;
  }
  protected get _invBottom(): [number, number] {
    return invAt(INVERTER_IMAGE.bottom);
  }
  protected get _solarY(): number {
    return INV_LEFT[0][1];
  }
  protected get _unmeasuredInList(): boolean {
    return true;
  }
  protected get _wallboxInList(): boolean {
    return false;
  }
  // backup pipes end at the glass shell of the battery cylinder (see _batteryWidget)
  protected _batteryOutX(cx: number, w: number): number {
    return cx + w / 2 - 2;
  }
  // storage area a bit to the right; with five batteries the backup lanes leave less room
  protected _batteryShift(n: number): number {
    return n >= 5 ? 6 : 14;
  }

  // as low as the content allows (aiming at about 16:9)
  protected get _minViewH(): number {
    return 300;
  }

  // the glass battery ends at top + BAT_H (shadow below), little room below it
  protected get _batteryTail(): number {
    return BAT_H + 12;
  }

  // batteries closer together in height than in the classic look
  protected _displayBatteries() {
    const first = GLASS_STORE_Y + 50; // top of a raised battery
    return super._displayBatteries().map((b) => ({ ...b, top: first + (b.top - first) * BAT_STAGGER }));
  }

  // denser lists: rows of 15 instead of 22
  // the string labels sit on the middles of the panel's quarters
  protected get _stringPos(): number[][] {
    return LABELS.map(({ middle: [x, y] }) => [x - LABEL_W / 2, y - LABEL_H / 2]);
  }


  protected get _pvBoxY(): number {
    return PV_BOX_Y;
  }

  // wide enough to catch the trains of both tile columns (tile middles at 40 and 110)
  protected get _pvBox(): [number, number] {
    return [22, 96];
  }

  protected get _storeY(): number {
    return GLASS_STORE_Y;
  }

  protected get _rowH(): number {
    return 15;
  }

  protected _fs(size: number): number {
    return +(size * FONT_SCALE).toFixed(2);
  }

  // each group's feed is one pipe with its list's bracket and branches
  protected get _pipeTrunk(): boolean {
    return true;
  }

  // no "heute" / "24 h" above the load lists
  protected get _periodLabel(): boolean {
    return false;
  }

  // glass pipes run right up to each load's symbol
  protected get _rowEntryX(): number {
    return LOAD_X0 - 1;
  }

  protected _branch(d: string, colour: string, kind: "row" | "child"): SVGTemplateResult {
    return svg`<g class=${`pipe ${kind}`}>
      <path d=${d} class="rim" />
      <path d=${d} class="bore" />
      <path d=${d} class="tint" stroke=${colour} />
      <path d=${d} class="shine" />
    </g>`;
  }

  // long lists: only the biggest daily consumers, the rest folds away
  protected _listLimit(title: string): number | null {
    return title === "Grundlast" ? 8 : title === "Zusätzlich" ? 3 : null;
  }

  protected get _idleByEnergy(): boolean {
    return true;
  }

  // a group's glass panel reaches 19 above its first row and 3 below its last;
  // the gap keeps PANEL_GAP of air between two panels
  protected get _groupGap(): number {
    return 16 + PANEL_GAP;
  }

  /** Gradients for glass, shadows, liquid and the halos of the balls. */
  protected _defs(): SVGTemplateResult {
    const c = this._c;
    return svg`<defs>
      <linearGradient id="ef-slab" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.16" />
        <stop offset="0.5" stop-color="#ffffff" stop-opacity="0.05" />
        <stop offset="1" stop-color="#ffffff" stop-opacity="0.03" />
      </linearGradient>
      <linearGradient id="ef-sheen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.26" />
        <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="ef-tube" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.04" />
        <stop offset="0.14" stop-color="#ffffff" stop-opacity="0.32" />
        <stop offset="0.26" stop-color="#ffffff" stop-opacity="0.05" />
        <stop offset="0.82" stop-color="#ffffff" stop-opacity="0" />
        <stop offset="0.93" stop-color="#ffffff" stop-opacity="0.14" />
        <stop offset="1" stop-color="#ffffff" stop-opacity="0.02" />
      </linearGradient>
      <linearGradient id="ef-liquid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#b8ffd8" stop-opacity="0.95" />
        <stop offset="0.12" stop-color=${c.battery} stop-opacity="0.85" />
        <stop offset="1" stop-color="#0f7a45" stop-opacity="0.9" />
      </linearGradient>
      <radialGradient id="ef-ball" cx="0.35" cy="0.3" r="0.75">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.55" />
        <stop offset="0.55" stop-color="#ffffff" stop-opacity="0" />
        <stop offset="1" stop-color="#000000" stop-opacity="0.25" />
      </radialGradient>
      <radialGradient id="ef-shadow">
        <stop offset="0" stop-color="#00060f" stop-opacity="0.55" />
        <stop offset="1" stop-color="#00060f" stop-opacity="0" />
      </radialGradient>
      ${Object.entries(c).map(
        ([k, v]) => svg`<radialGradient id=${`ef-halo-${k}`}>
          <stop offset="0" stop-color=${v} stop-opacity="0.55" />
          <stop offset="0.45" stop-color=${v} stop-opacity="0.18" />
          <stop offset="1" stop-color=${v} stop-opacity="0" />
        </radialGradient>`,
      )}
    </defs>`;
  }

  // -- lines and balls ---------------------------------------------------------
  /** Glass tube: bright rim, dark bore tinted with the flow colour, a sheen line. */
  protected _flow(d: string, colour: string, power: number | null, forward: boolean, dot = true): SVGTemplateResult {
    const active = power !== null && Math.abs(power) >= MIN_FLOW_W;
    return svg`<g class="tube">
        <path d=${d} class="rim" />
        <path d=${d} class="bore" />
        <path d=${d} class="tint" stroke=${colour} stroke-opacity=${active ? 0.24 : 0.08} />
        <path d=${d} class="shine" />
      </g>
      ${dot ? this._dot(d, colour, power, forward) : nothing}`;
  }

  /** The train on path `d`: radius and start time of each ball, travel time and period. */
  protected _trainOf(d: string, power: number) {
    const radii = trainBalls(power).map((k) => BALL_R[k]);
    // balls follow each other with a little air between them
    const begins: number[] = [];
    let pos = 0;
    radii.forEach((r, i) => {
      if (i) pos += radii[i - 1] + r + TRAIN_GAP;
      begins.push(pos / TRAIN_SPEED);
    });
    const travel = pathLength(d) / TRAIN_SPEED;
    const period = travel + (begins[begins.length - 1] ?? 0) + TRAIN_PAUSE;
    return { radii, begins, travel, period };
  }

  /**
   * Lines without their own train logic (everything except the load lists)
   * get a train of balls instead of one ball whose speed or size shows the power.
   */
  protected _dot(
    d: string,
    colour: string,
    power: number | null,
    forward = true,
    r = 3.2,
    train?: { period: number; begin: number; travel: number },
  ): SVGTemplateResult {
    if (train) return super._dot(d, colour, power, forward, r, train);
    if (power === null || Math.abs(power) < MIN_FLOW_W) return svg``;
    const { radii, travel, period, begins } = this._trainOf(d, power);
    return svg`${begins.map((b, i) =>
      this._ball(colour, { route: d, forward, r: radii[i], begin: b, travel, period }),
    )}`;
  }

  /** One ball riding its route once per period. */
  protected _ball(colour: string, b: Ball): SVGTemplateResult {
    const k = (b.travel / b.period).toFixed(4);
    const dur = `${b.period.toFixed(2)}s`;
    const begin = `${b.begin.toFixed(2)}s`;
    return this._orb(
      b.r,
      colour,
      svg`<animateMotion dur=${dur} begin=${begin} repeatCount="indefinite" calcMode="linear" rotate="auto"
          keyPoints=${b.forward ? "0;1;1" : "1;0;0"} keyTimes=${`0;${k};1`} path=${b.route} />
        <animate attributeName="opacity" dur=${dur} begin=${begin} repeatCount="indefinite" calcMode="discrete"
          values="1;0" keyTimes=${`0;${k}`} />`,
      true,
    );
  }

  /**
   * Where lines meet in a glass box, the trains are counted anew: the strings'
   * trains end inside the PV total box and the box sends one train with the
   * total PV power to the inverter; the storage box sends one train with the
   * total battery power to or from the inverter and one per battery.
   */
  protected _trainDots(
    kind: "pv" | "battery",
    colour: string,
    items: { route: string; w: number | null; forward: boolean }[],
  ): SVGTemplateResult {
    // power leaving a battery is green, like the battery itself
    const tint = (forward: boolean) => (kind === "battery" && !forward ? this._c.battery : colour);
    // charging batteries get balls in the colours of where the power comes from
    const ride = (route: string, w: number | null, forward: boolean) =>
      kind === "battery" && forward ? this._mixedTrain(route, w) : this._dot(route, tint(forward), w, forward);
    const own = items.map((it) => ride(it.route, it.w, it.forward));
    if (kind === "pv") {
      const out = `M ${PV_MID[0]} ${PV_MID[1]} V ${this._solarY} H ${this._invX}`;
      const total = this._own("solar_power");
      // every string's train ends in the blob
      const hits = items.flatMap((it) => this._arrivals(it.route, it.w));
      return svg`${own}${this._dot(out, colour, total, true)}${this._blob(PV_MID, colour, total, hits)}`;
    }
    // sum of what the batteries exchange with the house (see _lineFlow)
    const total = items.reduce<number | null>((s, it) => (it.w === null ? s : (s ?? 0) + it.w), null);
    const [bx, by] = this._invBottom;
    const feed = `M ${bx.toFixed(1)} ${by.toFixed(1)} V ${STORE_MID}`;
    const charging = (total ?? 0) > 0;
    // into the blob: the feed while charging, every discharging battery's train
    const hits = [
      ...(charging ? this._arrivals(feed, total) : []),
      ...items.filter((it) => !it.forward).flatMap((it) => this._arrivals(it.route, it.w)),
    ];
    return svg`${own}${ride(feed, total, charging)}${this._blob([bx, STORE_MID], tint(charging), Math.abs(total ?? 0), hits)}`;
  }

  /** When the balls of a train on `route` finish their way (at its end, or at its
   *  start for a train running backwards). */
  protected _arrivals(route: string, w: number | null): Hit[] {
    if (w === null || Math.abs(w) < MIN_FLOW_W) return [];
    const { radii, begins, travel, period } = this._trainOf(route, w);
    return begins.map((b, i) => ({ at: b + travel, period, big: radii[i] === BALL_BIG }));
  }

  /**
   * A drop of mercury where trains meet: its size shows the power that flows
   * through, it wobbles all the time and swells for a moment whenever a ball
   * runs into it (additive animations, one per arriving ball).
   */
  protected _blob([x, y]: [number, number], colour: string, watts: number | null, hits: Hit[]): SVGTemplateResult {
    if (watts === null || Math.abs(watts) < MIN_FLOW_W) return svg``;
    const R = 2.2 + 1.6 * Math.sqrt(Math.min(Math.abs(watts), 8000) / 1000);
    const key = Object.entries(this._c).find(([, v]) => v === colour)?.[0];
    const bump = (h: Hit, axis: "rx" | "ry") => {
      const d = (h.big ? 1.4 : 0.6) * (axis === "rx" ? 1.15 : 0.85);
      const k1 = Math.min(0.2, 0.12 / h.period);
      const k2 = Math.min(0.6, 0.55 / h.period);
      return svg`<animate attributeName=${axis} additive="sum" dur=${`${h.period.toFixed(2)}s`}
        begin=${`${h.at.toFixed(2)}s`} repeatCount="indefinite" values=${`0;${d};0;0`}
        keyTimes=${`0;${k1.toFixed(4)};${k2.toFixed(4)};1`} />`;
    };
    const wobble = (axis: "rx" | "ry", dur: number, phase: number) => {
      const a = axis === "rx" ? [1, 1.1, 0.94, 1] : [1, 0.92, 1.07, 1];
      return svg`<animate attributeName=${axis} dur=${`${dur}s`} begin=${`${phase}s`} repeatCount="indefinite"
        calcMode="spline" keyTimes="0;0.33;0.66;1" keySplines=${"0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1"}
        values=${a.map((f) => (R * f).toFixed(2)).join(";")} />`;
    };
    return svg`<g>
      <circle cx=${x} cy=${y} r=${R * 2.6} fill=${key ? `url(#ef-halo-${key})` : colour} fill-opacity=${key ? nothing : 0.2} />
      <ellipse cx=${x} cy=${y} rx=${R} ry=${R} fill=${colour}>
        ${wobble("rx", 1.7, 0)}${wobble("ry", 1.7, 0)}
        ${hits.map((h) => svg`${bump(h, "rx")}${bump(h, "ry")}`)}
      </ellipse>
      <ellipse cx=${x} cy=${y} rx=${R} ry=${R} fill="url(#ef-ball)">
        ${wobble("rx", 1.7, 0)}${wobble("ry", 1.7, 0)}
        ${hits.map((h) => svg`${bump(h, "rx")}${bump(h, "ry")}`)}
      </ellipse>
      <ellipse cx=${x - R * 0.32} cy=${y - R * 0.38} rx=${R * 0.4} ry=${R * 0.24} fill="#ffffff" fill-opacity="0.85" />
    </g>`;
  }

  // the house power runs into a blob in the house box; the load trains leave it
  protected _houseJunction(watts: number | null): SVGTemplateResult {
    return this._blob(HOUSE_MID, this._c.home, watts, this._arrivals(this._houseIn()!, watts));
  }

  /** Glowing glass ball: soft halo, coloured body, white core and a sheen. */
  protected _orb(radius: number, colour: string, motion: SVGTemplateResult, hidden = false): SVGTemplateResult {
    const r = radius;
    const key = Object.entries(this._c).find(([, v]) => v === colour)?.[0];
    return svg`<g opacity=${hidden ? "0" : nothing}>
      ${motion}
      <circle r=${r * 2.8} fill=${key ? `url(#ef-halo-${key})` : colour} fill-opacity=${key ? nothing : 0.18} />
      <circle r=${r} fill=${colour} />
      <circle r=${r} fill="url(#ef-ball)" />
      <circle cx=${-0.3 * r} cy=${-0.35 * r} r=${r * 0.38} fill="#ffffff" fill-opacity="0.85" />
    </g>`;
  }

  // -- glass building blocks -----------------------------------------------------
  /** A glass slab: drop shadow, tinted body, frosted gradient and a top sheen. */
  protected _panel(x: number, y: number, w: number, h: number, colour: string): SVGTemplateResult {
    const r = Math.min(7, h / 3);
    return svg`<g>
      <rect x=${x + 1} y=${y + 2.5} width=${w} height=${h} rx=${r} fill="#020a14" fill-opacity="0.32" />
      <rect x=${x} y=${y} width=${w} height=${h} rx=${r} fill=${colour} fill-opacity="0.1" />
      <rect x=${x} y=${y} width=${w} height=${h} rx=${r} fill="url(#ef-slab)" stroke=${colour} stroke-opacity="0.55"
        stroke-width="0.9" />
      <rect x=${x + 1.5} y=${y + 1.2} width=${w - 3} height=${Math.min(h * 0.42, 12)} rx=${Math.max(1, r - 1)}
        fill="url(#ef-sheen)" />
    </g>`;
  }

  /** A Tabler line icon at (x, y), `size` px. */
  protected _line(name: IconName, x: number, y: number, size: number, colour: string): SVGTemplateResult {
    return svg`<g transform=${`translate(${x} ${y}) scale(${size / 24})`} fill="none" stroke=${colour} stroke-width="1.7"
      stroke-linecap="round" stroke-linejoin="round">${ICONS[name].map((d) => svg`<path d=${d} />`)}</g>`;
  }

  // -- sections ------------------------------------------------------------------
  protected _solarIcon(): SVGTemplateResult {
    return svg``;
  }

  /** The glass solar panel picture below the string labels. */
  protected _solarBack(): SVGTemplateResult {
    return svg`<image href=${SOLAR_URL} x=${SOLAR_X} y=${SOLAR_Y} width=${SOLAR_W}
      height=${(SOLAR_IMAGE.height * SOLAR_K).toFixed(1)} />`;
  }

  /** One PV string: a glass label filling its quarter of the panel, lying in the
   *  panel's plane, with the same gap to the frame and to its neighbours. */
  protected _stringTile(x: number, y: number, entity: string, c: string): SVGTemplateResult {
    const mx = x + LABEL_W / 2;
    const my = y + LABEL_H / 2;
    const label = LABELS.reduce((a, b) =>
      Math.hypot(b.middle[0] - mx, b.middle[1] - my) < Math.hypot(a.middle[0] - mx, a.middle[1] - my) ? b : a,
    );
    const pts = label.corners.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(" ");
    const [ax, ay] = SOLAR_IMAGE.across;
    const [dx, dy] = SOLAR_IMAGE.down;
    const [, lh] = label.size;
    return svg`
      <polygon points=${pts} fill="#020a14" fill-opacity="0.35" transform="translate(0.8 1.6)" />
      <polygon points=${pts} fill=${c} fill-opacity="0.12" />
      <polygon points=${pts} fill="url(#ef-slab)" stroke=${c} stroke-opacity="0.6" stroke-width="0.8"
        stroke-linejoin="round" />
      <g transform=${`matrix(${ax} ${ay} ${dx} ${dy} ${mx.toFixed(1)} ${my.toFixed(1)})`}>
        <text x="0" y=${-lh / 2 + lh * 0.52} text-anchor="middle" class="val" font-size=${this._fs(12)} font-weight="600"
          >${fmtPower(this._w(entity), this._loc)}</text>
        <text x="0" y=${-lh / 2 + lh * 0.84} text-anchor="middle" class="tiny" style=${`font-size:${this._fs(7.5)}px`}
          >${shortName(this._name(entity), 16)}</text>
      </g>`;
  }


  /** The glass inverter picture, placed by its connectors. */
  protected _inverter(): SVGTemplateResult {
    const [x, y] = invAt([0, 0]);
    return svg`<image href=${INV_URL} x=${x.toFixed(1)} y=${y.toFixed(1)}
      width=${(INVERTER_IMAGE.width * INV_SCALE).toFixed(1)} height=${(INVERTER_IMAGE.height * INV_SCALE).toFixed(1)} />`;
  }

  /** Glass cylinder with a moving liquid level; name, SoC, kWh, power, status inside. */
  protected _batteryWidget(
    name: string,
    cx: number,
    top: number,
    w: number,
    p: number | null,
    s: number | null,
    label: string,
    c: string,
    capacity: number | null = null,
  ): SVGTemplateResult {
    const x0 = cx - w / 2 + 2;
    const x1 = cx + w / 2 - 2;
    const rx = (x1 - x0) / 2;
    const ry = 3.5;
    const yt = top + 8;
    const yb = top + BAT_H;
    const fill = Math.max(0, Math.min(100, s ?? 0));
    const lvl = yb + ry - (yb + ry - yt) * (fill / 100);
    const id = `ef-bat-${Math.round(cx)}-${Math.round(top)}`;
    const body = `M ${x0} ${yt} V ${yb} A ${rx} ${ry} 0 0 0 ${x1} ${yb} V ${yt} A ${rx} ${ry} 0 0 0 ${x0} ${yt} Z`;
    const moving = p !== null && Math.abs(p) >= MIN_FLOW_W;
    // drops fall in / bubbles rise into the line by what flows on the battery's line
    const flow = this._lineFlow(name, p);
    const charging = flow !== null && flow > MIN_FLOW_W;
    const t = moving ? 3.4 : 5.5;
    // While it discharges, bubbles rise to the cap just as a ball of the
    // outgoing train starts there, so they drive on into the line (see
    // _riseIntoLine). Backup trains start inside the battery themselves
    // (see _batteryLead), so they rise like bubbles and leave through the shell.
    const discharging = flow !== null && flow < -MIN_FLOW_W;
    const small = w < 54;
    const stored = capacity && s !== null ? fmtEnergy((capacity * s) / 100, this._loc) : "";
    return svg`<g>
      <ellipse cx=${cx} cy=${yb + 4} rx=${rx + 8} ry="6" fill="url(#ef-shadow)" />
      <clipPath id=${id}><path d=${body} /></clipPath>
      <path d=${body} fill=${c} fill-opacity="0.07" />
      ${fill > 0
        ? svg`<g clip-path=${`url(#${id})`}>
            ${this._liquid(x0, x1, lvl, yb + ry + 2, c, t)}
          </g>`
        : nothing}
      ${charging ? svg`<g clip-path=${`url(#${id})`}>${this._splash(cx, yt, lvl, rx, c, flow!, top)}</g>` : nothing}
      <path d=${body} fill="url(#ef-tube)" stroke=${RIM} stroke-opacity="0.55" stroke-width="0.9" />
      ${discharging ? this._riseIntoLine(cx, yb, top, this._c.battery, flow!) : nothing}
      <ellipse cx=${cx} cy=${yt} rx=${rx} ry=${ry} fill=${c} fill-opacity="0.12" stroke="#e6f6ff" stroke-opacity="0.7"
        stroke-width="0.8" />
      <rect x=${cx - 6} y=${top + 3} width="12" height=${yt - top - 3} fill=${c} fill-opacity="0.28" stroke=${RIM}
        stroke-opacity="0.6" stroke-width="0.7" />
      <ellipse cx=${cx} cy=${top + 3} rx="6" ry="1.8" fill="#e6f6ff" fill-opacity="0.45" />
      <text x=${cx} y=${top + 20} text-anchor="middle" class="bt" font-size=${this._fs(7.5)}>${shortName(name, small ? 9 : 11)}</text>
      <text x=${cx} y=${top + 33} text-anchor="middle" class="bt" font-size=${this._fs(13)} font-weight="600">${fmtPercent(s, this._loc)}</text>
      <text x=${cx} y=${top + 43} text-anchor="middle" class="bt" font-size=${this._fs(8)}>${stored}</text>
      <text x=${cx} y=${top + 53} text-anchor="middle" class="bt" font-size=${this._fs(8.5)}>${fmtPower(p === null ? null : Math.abs(p), this._loc)}</text>
      <text x=${cx} y=${top + 62} text-anchor="middle" class="bt" font-size=${this._fs(7.5)}>${label}</text>
    </g>`;
  }

  /**
   * Liquid like a phone's charging animation: one soft surface that slowly
   * sloshes between a few shapes (no repeating waves), a lighter layer behind
   * it and a bright rim. Every shape has the same commands so SMIL can morph
   * between them. Fills x0..x1 from `lvl` down to `bottom`; clip it outside.
   */
  protected _liquid(x0: number, x1: number, lvl: number, bottom: number, c: string, t: number): SVGTemplateResult {
    const bw = x1 - x0;
    const surface = ([a, b, c2, d]: number[], y: number) =>
      `M ${x0 - 1} ${(y + a).toFixed(2)} C ${(x0 + bw * 0.35).toFixed(2)} ${(y + b).toFixed(2)} ${(x1 - bw * 0.35).toFixed(2)} ${(y + c2).toFixed(2)} ${x1 + 1} ${(y + d).toFixed(2)}`;
    const shape = (k: number, y: number, closed: boolean) =>
      surface(LIQUID_SHAPES[k], y) + (closed ? ` V ${bottom} H ${x0 - 1} Z` : "");
    const morph = (y: number, closed: boolean, order: number[], dur: number) => svg`<path d=${shape(order[0], y, closed)}>
        <animate attributeName="d" dur=${`${dur.toFixed(1)}s`} repeatCount="indefinite" calcMode="spline"
          keyTimes="0;0.25;0.5;0.75;1" keySplines=${LIQUID_SPLINES}
          values=${[...order, order[0]].map((k) => shape(k, y, closed)).join(";")} />
      </path>`;
    return svg`
      <g fill=${c} fill-opacity="0.35">${morph(lvl - 1, true, [2, 3, 0, 1], t * 1.3)}</g>
      <g fill="url(#ef-liquid)">${morph(lvl, true, [0, 1, 2, 3], t)}</g>
      <g fill="none" stroke="#e9fff3" stroke-opacity="0.55" stroke-width="0.8">${morph(lvl, false, [0, 1, 2, 3], t)}</g>`;
  }

  // load list trains count the power in balls as well, big ones in front
  protected _wagonBalls(watts: number, colour: string, source?: string): { r: number; colour: string }[] {
    const kinds = trainBalls(watts);
    const tints = colour === this._c.backup ? this._tints(kinds, this._backupShares(source)) : this._tints(kinds);
    return kinds.map((k, i) => ({ r: BALL_R[k], colour: tints[i] }));
  }

  /**
   * Where a battery's backup loads get their power: from the battery (green);
   * a backup-only battery passes power from the house through as well, that
   * part has the house's colours (input up to its output, the rest from the cells).
   */
  protected _backupShares(source?: string): number[] {
    const bat = this._layout?.batteries.find((b) => b.name === source);
    if (!bat?.backup_only) return [0, 1, 0];
    const input = Math.max(this._w(bat.charge) ?? 0, 0);
    const output = Math.max(this._w(bat.discharge) ?? 0, 0);
    const through = output > 0 ? Math.min(input, output) / output : 0;
    const house = this._houseShares();
    return [house[0] * through, house[1] * through + (1 - through), house[2] * through];
  }

  /** Shares of PV, batteries and grid in what the house net gets right now. */
  protected _houseShares(): number[] {
    // every battery that feeds the house counts, even while others charge;
    // backup-only batteries never feed the house
    const discharge = (this._layout?.batteries ?? [])
      .filter((b) => !b.backup_only)
      .reduce((sum, b) => sum + Math.max(0, -(num(this._s(b.power)) ?? 0)), 0);
    return sourceShares(this._own("solar_power"), discharge, this._own("grid_power"));
  }

  /** Colours for a train's balls by source shares (PV, battery, grid); default: the house's mix. */
  protected _tints(kinds: BallKind[], shares = this._houseShares()): string[] {
    const palette = [this._c.solar, this._c.battery, this._c.grid];
    return colourBalls(kinds, shares).map((i) => palette[i]);
  }

  /** A train whose balls show where the power comes from (PV, battery, grid). */
  protected _mixedTrain(d: string, watts: number | null, forward = true): SVGTemplateResult {
    if (watts === null || Math.abs(watts) < MIN_FLOW_W) return svg``;
    const { radii, begins, travel, period } = this._trainOf(d, watts);
    const tints = this._tints(trainBalls(watts));
    return svg`${begins.map((b, i) => this._ball(tints[i], { route: d, forward, r: radii[i], begin: b, travel, period }))}`;
  }

  protected _houseDots(d: string, _colour: string, watts: number | null): SVGTemplateResult {
    return this._mixedTrain(d, watts);
  }

  protected get _wagonSpeed(): number {
    return TRAIN_SPEED;
  }

  /** A battery's own line: from the blob in the storage box to the battery's cap. */
  protected _route(cx: number, top: number): string {
    return `M ${this._invBottom[0].toFixed(1)} ${STORE_MID} V ${STORE_MID + STORE_H / 2} H ${cx} V ${top}`;
  }

  protected _batteryRoute(cx: number, top: number): string | null {
    return this._route(cx, top);
  }

  // Trains run into the glass boxes and new ones leave them: each PV string
  // into the middle of "PV gesamt", the house power from the inverter into
  // the middle of the house box, the load trains from there; backup trains
  // start at the bottom of their battery and leave through its shell.
  protected _stringRoute(x: number, y: number): string | null {
    return `M ${x + LABEL_W / 2} ${y + LABEL_H / 2} V ${PV_BOX_Y + 13} H ${PV_MID[0]} V ${PV_MID[1]}`;
  }

  protected _houseIn(): string | null {
    const [tx, ty] = this._invTop;
    return `M ${tx} ${ty} V ${HOUSE_MID[1]}`;
  }

  protected _houseLead(y: number): string | null {
    // along the box's bottom edge, then up its right side to the list's trunk
    return `M ${HOUSE_MID[0]} ${HOUSE_MID[1]} H 281 V ${y} H 285`;
  }

  protected _batteryLead(cx: number, top: number, w: number, y: number): string | null {
    return `M ${cx} ${top + BAT_H - 2} V ${y} H ${this._batteryOutX(cx, w)}`;
  }

  /**
   * Bubbles of a discharging battery: each rises from the bottom to the cap
   * and arrives just when a ball of the outgoing train starts there, so it
   * looks as if the bubble drives on into the line.
   */
  protected _riseIntoLine(cx: number, yb: number, top: number, c: string, p: number): SVGTemplateResult {
    const capY = top + 3;
    const { radii, begins, period } = this._trainOf(this._route(cx, top), p);
    return svg`${begins.map((b, i) => {
      const r = radii[i];
      const rise = Math.min(period * 0.8, (yb - capY) / TRAIN_SPEED);
      const k = (rise / period).toFixed(4);
      const dur = `${period.toFixed(2)}s`;
      const begin = `${(b - rise).toFixed(2)}s`;
      return svg`<circle cx=${cx} cy=${yb} r=${r} fill=${c} stroke="#ffffff" stroke-opacity="0.75" stroke-width="0.5"
        opacity="0">
        <animate attributeName="cy" dur=${dur} begin=${begin} repeatCount="indefinite" values=${`${yb};${capY};${capY}`}
          keyTimes=${`0;${k};1`} />
        <animate attributeName="r" dur=${dur} begin=${begin} repeatCount="indefinite"
          values=${`${r * 0.45};${r};${r}`} keyTimes=${`0;${k};1`} />
        <animate attributeName="opacity" dur=${dur} begin=${begin} repeatCount="indefinite" calcMode="discrete"
          values="0.9;0" keyTimes=${`0;${k}`} />
      </circle>`;
    })}`;
  }

  /**
   * A drop falls into the liquid each time a ball of the train arrives at the
   * battery, then a ripple spreads and two droplets jump. Uses the train's own
   * timing, so it stays in step with the arriving balls.
   */
  protected _splash(cx: number, yt: number, lvl: number, rx: number, c: string, p: number, top: number): SVGTemplateResult {
    const { travel, period, begins } = this._trainOf(this._route(cx, top), p);
    // each drop has the colour of the ball it comes from
    const tints = this._tints(trainBalls(p));
    return svg`${begins.map((b, i) => this._splashOnce(cx, yt, lvl, rx, tints[i] ?? c, period, b + travel))}`;
  }

  /** One drop with ripple, repeating every `period` s from `start` s on. */
  protected _splashOnce(cx: number, yt: number, lvl: number, rx: number, c: string, period: number, start: number): SVGTemplateResult {
    const fall = Math.min(0.45, period * 0.35);
    const k1 = fall / period;
    const k2 = Math.min(0.97, k1 + 0.6 / period);
    const km = k1 + (k2 - k1) * 0.4;
    const k1e = k1 + 0.001;
    const f = (n: number) => n.toFixed(3);
    const dur = `${period.toFixed(2)}s`;
    const begin = `${start.toFixed(2)}s`;
    const timed = (attr: string, values: string, keyTimes: string, spline = false) => svg`<animate attributeName=${attr}
      dur=${dur} begin=${begin} repeatCount="indefinite" values=${values} keyTimes=${keyTimes}
      calcMode=${spline ? "spline" : "linear"} keySplines=${spline ? "0.55 0 1 0.6;0 0 1 1" : nothing} />`;
    return svg`
      <ellipse cx=${cx} cy=${yt} rx="1.5" ry="2.1" fill=${c} stroke="#ffffff" stroke-opacity="0.7" stroke-width="0.4" opacity="0">
        ${timed("cy", `${yt + 1};${lvl - 1};${lvl - 1}`, `0;${f(k1)};1`, true)}
        ${timed("opacity", "1;1;0;0", `0;${f(k1)};${f(k1e)};1`)}
      </ellipse>
      <ellipse cx=${cx} cy=${lvl} rx="1" ry="0.5" fill="none" stroke="#e9fff3" stroke-width="0.8" opacity="0">
        ${timed("rx", `1;1;${f(rx * 0.75)};${f(rx * 0.75)}`, `0;${f(k1)};${f(k2)};1`)}
        ${timed("ry", `0.5;0.5;2;2`, `0;${f(k1)};${f(k2)};1`)}
        ${timed("opacity", "0;0;0.9;0;0", `0;${f(k1)};${f(k1e)};${f(k2)};1`)}
      </ellipse>
      ${[-1, 1].map(
        (side) => svg`<circle cx=${cx + side * 3} cy=${lvl} r="0.9" fill=${c} stroke="#ffffff" stroke-opacity="0.6" stroke-width="0.3"
          opacity="0">
          ${timed("cy", `${lvl};${lvl};${lvl - 6};${lvl};${lvl}`, `0;${f(k1)};${f(km)};${f(k2)};1`)}
          ${timed("cx", `${cx};${cx};${cx + side * 3};${cx + side * 5};${cx + side * 5}`, `0;${f(k1)};${f(km)};${f(k2)};1`)}
          ${timed("opacity", "0;0;1;0;0", `0;${f(k1)};${f(k1e)};${f(k2)};1`)}
        </circle>`,
      )}`;
  }

  /** 2.5D glass house: gable front, side wall, roof, chimney and warm windows. */
  protected _houseIcon(c: string): SVGTemplateResult {
    const warm = this._c.solar;
    return svg`<g transform="translate(232 26) scale(0.7)">
      <ellipse cx="28" cy="50" rx="30" ry="5" fill="url(#ef-shadow)" />
      <polygon points="4,28 14,18 42,6 32,16" fill=${c} fill-opacity="0.08" stroke=${RIM} stroke-opacity="0.3" stroke-width="0.7" />
      <polygon points="24,52 52,40 52,24 24,36" fill=${c} fill-opacity="0.12" stroke=${RIM} stroke-opacity="0.6" stroke-width="0.8" />
      <polygon points="24,52 52,40 52,24 24,36" fill="url(#ef-slab)" />
      <polygon points="4,44 24,52 24,36 14,18 4,28" fill=${c} fill-opacity="0.2" stroke=${RIM} stroke-opacity="0.75" stroke-width="0.9" />
      <polygon points="4,44 24,52 24,36 14,18 4,28" fill="url(#ef-slab)" />
      <polygon points="24,36 52,24 42,6 14,18" fill=${c} fill-opacity="0.28" stroke=${RIM} stroke-opacity="0.75" stroke-width="0.9" />
      <polygon points="24,36 52,24 42,6 14,18" fill="url(#ef-sheen)" />
      <polygon points="36.6,15 39.4,13.8 39.4,5.8 36.6,7" fill=${c} fill-opacity="0.35" stroke=${RIM} stroke-opacity="0.7" stroke-width="0.7" />
      <polygon points="28.2,43.2 35.2,40.2 35.2,32.2 28.2,35.2" fill=${warm} fill-opacity="0.5" stroke=${warm} stroke-opacity="0.8" stroke-width="0.6" />
      <polygon points="40.8,37.8 47.8,34.8 47.8,26.8 40.8,29.8" fill=${warm} fill-opacity="0.5" stroke=${warm} stroke-opacity="0.8" stroke-width="0.6" />
      <polygon points="12,47.2 17,49.2 17,37.2 12,35.2" fill=${c} fill-opacity="0.4" stroke=${RIM} stroke-opacity="0.7" stroke-width="0.6" />
      <ellipse cx="14" cy="28" rx="2.2" ry="2.6" fill=${warm} fill-opacity="0.45" stroke=${warm} stroke-opacity="0.7" stroke-width="0.5" />
      <path d="M 14 18 L 42 6" stroke="#ffffff" stroke-opacity="0.95" stroke-width="1.2" stroke-linecap="round" />
      <path d="M 4 28 V 44 M 24 36 V 52" stroke="#ffffff" stroke-opacity="0.55" stroke-width="0.8" />
    </g>`;
  }

  /**
   * Left column as in the glass concept: a free-standing glass pylon with one
   * glass cable into the inverter, the grid tile below it and the wallbox
   * below that.
   */
  protected _grid(): SVGTemplateResult {
    const c = this._c.grid;
    const inv = this._invX;
    const { grid, exporting, cents, label, power, imp, exp } = this._gridData();
    // one cable from the lowest right insulator (pylon coordinates) into the inverter
    const [ix, iy] = PYLON_INSULATORS[PYLON_INSULATORS.length - 1];
    const sx = PYLON_X + ix * PYLON_S;
    const sy = PYLON_Y + (iy + 6) * PYLON_S;
    const gridPortY = INV_LEFT[1][1];
    // a hanging cable: one shallow sag between pylon and inverter
    const sag = Math.max(sy, gridPortY) + 12;
    const cable = `M ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${((sx + inv) / 2).toFixed(1)} ${sag.toFixed(1)} ${inv} ${gridPortY}`;
    const price = cents !== null ? fmtCents(cents, this._loc) : "";
    // today's import / export inside the tile; the current direction is highlighted
    const rows = [
      { arrow: "↓", kwh: imp, name: "Bez.", active: label === "Bezug" },
      { arrow: "↑", kwh: exp, name: "Einsp.", active: label === "Einspeisung" },
    ].filter((r) => r.kwh !== null);
    const y = GRID_TILE_Y;
    // power, then the price in its own line, then today's import / export (compact)
    const sep = y + (cents !== null ? 23 : 15);
    const h = sep - y + (rows.length ? rows.length * 8.5 + 3 : 0);
    return svg`
      ${this._pylon(c)}
      ${this._flow(cable, c, grid, !exporting)}
      ${this._tap(this._layout!.entities.grid_power, this._panel(TILE_X, y, TILE_W, h, c))}
      <text x=${TILE_X + TILE_W / 2} y=${y + 11} text-anchor="middle" class="val" font-size=${this._fs(11.5)} font-weight="600"
        >${power}</text>
      ${cents !== null
        ? svg`<text x=${TILE_X + TILE_W / 2} y=${y + 19.5} text-anchor="middle" class="dim" style=${`font-size:${this._fs(8.5)}px`}>${price}</text>`
        : nothing}
      ${rows.length
        ? svg`<line x1=${TILE_X + 4} x2=${TILE_X + TILE_W - 4} y1=${sep} y2=${sep} class="sep" stroke=${c} />`
        : nothing}
      ${rows.map(
        (r, i) => svg`<text x=${TILE_X + 4} y=${sep + 8 + i * 8.5} class=${r.active ? "val" : "dim"} style=${`font-size:${this._fs(8.5)}px`}
          ><tspan fill=${r.active ? c : nothing}>${r.arrow}</tspan> ${fmtEnergy(r.kwh, this._loc)}<tspan
          class=${r.active ? "" : "tiny"} style=${`font-size:${this._fs(7.5)}px`} fill=${r.active ? c : nothing}> ${r.name}</tspan></text>`,
      )}
      ${this._wallbox(this._carTop(y + h + 8))}
    `;
  }

  /** Top of the car picture: its plate ends flush with the lowest battery, but
   *  never higher than `min` (just below the grid tile). */
  protected _carTop(min: number): number {
    const bats = this._displayBatteries();
    if (!bats.length) return min;
    const bottom = Math.max(...bats.map((b) => b.top)) + BAT_H + 3.5; // cylinder bottom, see _batteryWidget
    return Math.max(min, bottom - CAR_IMAGE.height * (CAR_W / CAR_IMAGE.width));
  }

  /**
   * Wallbox below the grid tile: the glass car picture (car, glass plate and
   * wallbox) with sloshing liquid inside the car body up to its state of
   * charge; power and today's energy are written on the plate along its front
   * edges. Fed from the inverter's left side into the wallbox.
   */
  protected _wallbox(top: number): SVGTemplateResult {
    const wb = this._layout?.wallbox;
    if (!wb) return svg``;
    const c = wb.flexible ? this._c.flexible : this._c.home;
    const w = this._w(wb.power);
    const soc = num(this._s(wb.soc ?? undefined));
    const today = num(this._s(wb.today ?? undefined));
    const idle = w === null || Math.abs(w) < MIN_FLOW_W;
    const charging = !idle && (w ?? 0) > 0;

    // picture pixels -> card units
    const k = CAR_W / CAR_IMAGE.width;
    const at = ([x, y]: [number, number]): [number, number] => [CAR_X + x * k, top + y * k];
    // The liquid is a box standing on the car's floor (its sides parallel to the
    // car's length and width), as high as the state of charge, cut to the car
    // body. Its top is the liquid surface; it sloshes by lifting and lowering
    // its four corners a little. All of it is drawn in picture pixels.
    const fill = soc === null ? null : Math.max(0, Math.min(100, soc)) / 100;
    const h = (fill ?? 0) * CAR_IMAGE.liquidHeight;
    const [ff, nf, nr, fr] = CAR_IMAGE.floorQuad;
    const up = ([x, y]: [number, number], d: number) => `${x.toFixed(1)},${(y - d).toFixed(1)}`;
    const pts = (o: number[]) => {
      const [a, b, c2, d] = o.map((v) => Math.max(0, h + v));
      return {
        body: [up(ff, 0), up(nf, 0), up(nr, 0), up(nr, c2), up(fr, d), up(ff, a)].join(" "),
        surface: [up(ff, a), up(nf, b), up(nr, c2), up(fr, d)].join(" "),
        edge: [up(ff, a), up(nf, b), up(nr, c2)].join(" "),
      };
    };
    const frames = SLOSH.map((o) => pts(o));
    const t = charging ? 3.4 : 5.5;
    const morph = (key: "body" | "surface" | "edge") => svg`<animate attributeName="points" dur=${`${t}s`}
      repeatCount="indefinite" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" keySplines=${LIQUID_SPLINES}
      values=${[...frames, frames[0]].map((f) => f[key]).join(";")} />`;
    const id = `ef-car-${Math.round(top)}`;
    const toCard = `translate(${CAR_X} ${top}) scale(${k.toFixed(5)})`;

    // feed: out of the inverter, then straight down into the wallbox
    const inv = this._invX;
    const wallboxPortY = INV_LEFT[2][1];
    const [wx, wy] = at(CAR_IMAGE.wallboxTop);
    // down right at the inverter, then left below the grid cable, then down to the wallbox
    const under = GRID_TILE_Y - 12;
    const feed = `M ${inv} ${wallboxPortY} H ${inv - 10} V ${under} H ${wx.toFixed(1)} V ${wy.toFixed(1)}`;

    const [px, py] = at(CAR_IMAGE.powerText);
    const [ex, ey] = at(CAR_IMAGE.energyText);
    const angle = CAR_IMAGE.edgeAngle;
    // percentage in the middle of the liquid's near side
    const [sx, sy] = at([(nf[0] + nr[0]) / 2, (nf[1] + nr[1]) / 2 - Math.max(h / 2, 14)]);

    return svg`
      ${this._flow(feed, c, w, true, false)}
      ${this._mixedTrain(feed, w)}
      <g class="tap" data-entity=${wb.power}>
        <title>${wb.name} · ${wb.flexible ? "Zusatzverbraucher" : "Grundlast"}</title>
        <image href=${CAR_URL} x=${CAR_X} y=${top} width=${CAR_W} height=${(CAR_IMAGE.height * k).toFixed(1)} />
        ${fill
          ? svg`<g transform=${toCard}>
              <clipPath id=${id}><polygon points=${CAR_IMAGE.tank} /></clipPath>
              <g clip-path=${`url(#${id})`} opacity="0.7">
                <polygon points=${frames[0].body} fill="url(#ef-liquid)">${morph("body")}</polygon>
                <polygon points=${frames[0].surface} fill="#c8ffe0" fill-opacity="0.45">${morph("surface")}</polygon>
                <polyline points=${frames[0].edge} fill="none" stroke="#e9fff3" stroke-opacity="0.85" stroke-width="2.4"
                  stroke-linejoin="round">${morph("edge")}</polyline>
              </g>
            </g>`
          : nothing}
        ${soc !== null
          ? svg`<text x=${sx.toFixed(1)} y=${sy.toFixed(1)} text-anchor="middle" class="bt" font-size=${this._fs(9)}
              font-weight="600">${fmtPercent(soc, this._loc)}</text>`
          : nothing}
        <text transform=${`translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(${angle})`} class=${idle ? "dim" : "val"}
          style=${`font-size:${this._fs(8)}px`} font-weight="600">${fmtPower(w, this._loc)}</text>
        <text transform=${`translate(${ex.toFixed(1)} ${ey.toFixed(1)}) rotate(${-angle})`} class="dim"
          style=${`font-size:${this._fs(8)}px`}>${fmtEnergy(today, this._loc)}</text>
      </g>`;
  }

  /** Free-standing pylon of glass rods on a hexagonal glass plate. */
  protected _pylon(c: string): SVGTemplateResult {
    const front = segs([...PYLON_LEGS, ...PYLON_ARMS, ...PYLON_BRACES]);
    const back = segs([...PYLON_LEGS, ...PYLON_ARMS], 7, -4);
    const depth = segs(PYLON_DEPTH);
    const hex = "65.5,84 48.5,92.7 14.5,92.7 -2.5,84 14.5,75.3 48.5,75.3";
    const hexSide = "65.5,84 65.5,87 48.5,95.7 14.5,95.7 -2.5,87 -2.5,84 14.5,92.7 48.5,92.7";
    return svg`<g transform=${`translate(${PYLON_X} ${PYLON_Y}) scale(${PYLON_S})`}>
      <ellipse cx="31.5" cy="97" rx="40" ry="7" fill="url(#ef-shadow)" />
      <polygon points=${hexSide} fill=${c} fill-opacity="0.3" stroke=${RIM} stroke-opacity="0.4" stroke-width="0.6" />
      <polygon points=${hex} fill=${c} fill-opacity="0.14" stroke=${RIM} stroke-opacity="0.65" stroke-width="0.8" />
      <polygon points=${hex} fill="url(#ef-slab)" />
      <path d=${back} fill="none" stroke=${c} stroke-opacity="0.22" stroke-width="2.6" stroke-linecap="round" />
      <path d=${back} fill="none" stroke=${RIM} stroke-opacity="0.4" stroke-width="0.7" stroke-linecap="round" />
      <path d=${depth} fill="none" stroke=${RIM} stroke-opacity="0.35" stroke-width="1.4" stroke-linecap="round" />
      <path d=${front} fill="none" stroke=${c} stroke-opacity="0.35" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" />
      <path d=${front} fill="none" stroke="#e6f6ff" stroke-opacity="0.9" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
      ${PYLON_INSULATORS.map(
        ([x, y]) => svg`
          <path d=${`M ${x} ${y} V ${y + 6}`} stroke=${RIM} stroke-opacity="0.8" stroke-width="0.8" />
          <circle cx=${x} cy=${y + 2.5} r="1.4" fill=${c} /><circle cx=${x} cy=${y + 5} r="1.4" fill=${c} />
          <circle cx=${x} cy=${y + 3.7} r="0.6" fill="#ffffff" />`,
      )}
      ${PYLON_NODES.map(([x, y]) => svg`<circle cx=${x} cy=${y} r="1.3" fill="#ffffff" fill-opacity="0.85" />`)}
    </g>`;
  }

  // -- load groups -------------------------------------------------------------
  /** Each group sits on its own tinted glass slab. */
  protected _groupPanel(g: LoadGroup): SVGTemplateResult {
    const x = LOAD_X0 - 12;
    const top = g.titleY - 13;
    const bottom = g.y0 + g.rows * this._rowH + 3;
    return this._panel(x, top, LOAD_X1 + 3 - x, bottom - top, g.colour);
  }

  protected _groupIcon(): SVGTemplateResult {
    return svg``;
  }

  protected _groupTitle(
    y: number,
    colour: string,
    title: string,
    power: number | null,
    loads: { today: string | null }[],
  ): SVGTemplateResult {
    const today = loads.reduce<number | null>((sum, l) => {
      const v = num(this._s(l.today));
      return v === null ? sum : (sum ?? 0) + v;
    }, null);
    return svg`
      <text x=${LOAD_X0 - 6} y=${y} class="small grp" fill=${colour}>${title}</text>
      <text x=${LOAD_XP - 1} y=${y} text-anchor="end" class="small" style=${`font-size:${this._fs(8)}px`} fill=${colour}>${fmtPower(power, this._loc)}</text>
      <text x=${LOAD_X1 - 1} y=${y} text-anchor="end" class="small" style=${`font-size:${this._fs(8)}px`} fill=${colour}>${fmtEnergy(today, this._loc)}</text>`;
  }

  /** Line icon chosen from the name, then the name (wrapped if long). */
  protected _nameBox(name: string, y: number, colour: string, tooltip = name, indent = 0): SVGTemplateResult {
    const R = this._rowH;
    const ICON = 9;
    const ix = LOAD_X0 + indent;
    const nx = ix + ICON + 3;
    const avail = LOAD_XP - LOAD_PW - 2 - nx;
    const { lines, small } = fitLabel(name, Math.floor(avail / 5.2), Math.floor(avail / 4.2));
    return svg`<g>
      <title>${tooltip}</title>
      ${this._line(iconFor(name), ix, y + (R - ICON) / 2, ICON, colour)}
      ${small
        ? svg`<text x=${nx} y=${y + R / 2 - 1.5} class="name" font-size=${this._fs(7.5)}>${lines[0]}</text>
              <text x=${nx} y=${y + R / 2 + 5.5} class="name" font-size=${this._fs(7.5)}>${lines[1] ?? ""}</text>`
        : svg`<text x=${nx} y=${y + R / 2 + 3} class="name" font-size=${this._fs(9.5)}>${lines[0]}</text>`}
    </g>`;
  }

  /** Plain right-aligned numbers: the group slab is the glass. */
  protected _valueCell(
    x: number,
    y: number,
    w: number,
    h: number,
    _colour: string,
    text: string,
    size: number,
    kind: "power" | "energy",
  ): SVGTemplateResult {
    return svg`<text x=${x + w - 1} y=${y + h / 2 + size * 0.36} text-anchor="end" class=${kind === "power" ? "val" : "dim"}
      font-size=${this._fs(size + 0.5)}>${text}</text>`;
  }

  static styles = [
    EnergieflussCard.styles,
    css`
      ha-card {
        padding: 10px;
        border-radius: 22px;
        border: 1px solid rgba(160, 215, 255, 0.14);
        background:
          radial-gradient(38% 30% at 18% 12%, rgba(255, 212, 59, 0.18), transparent 70%),
          radial-gradient(34% 32% at 10% 62%, rgba(62, 224, 143, 0.16), transparent 70%),
          radial-gradient(30% 26% at 62% 2%, rgba(62, 224, 143, 0.14), transparent 70%),
          radial-gradient(40% 36% at 42% 95%, rgba(62, 224, 143, 0.1), transparent 70%),
          radial-gradient(60% 50% at 96% 50%, rgba(77, 178, 255, 0.12), transparent 70%),
          linear-gradient(165deg, #0d2a47 0%, #0b3150 45%, #0a2440 100%);
        box-shadow:
          0 14px 40px rgba(0, 10, 25, 0.55),
          inset 0 1px 0 rgba(255, 255, 255, 0.08);
        color: #eaf6ff;
      }
      .val,
      .name,
      .big,
      .soc,
      .tiny.val {
        fill: #eef7ff;
      }
      .lbl,
      .small,
      .tiny {
        fill: rgba(214, 236, 255, 0.66);
      }
      /* the classic look's text classes at FONT_SCALE (0.8) */
      .lbl,
      .small {
        font-size: 8px;
      }
      .tiny {
        font-size: 6.4px;
      }
      .soc {
        font-size: 10.4px;
      }
      .big {
        font-size: 12.8px;
      }
      .dim {
        fill: rgba(214, 236, 255, 0.72);
      }
      .tube path {
        fill: none;
        stroke-linejoin: round;
        stroke-linecap: round;
      }
      .tube .rim {
        stroke: #bfe6ff;
        stroke-opacity: 0.3;
        stroke-width: 6.2;
      }
      .tube .bore {
        stroke: #0b2a46;
        stroke-opacity: 0.92;
        stroke-width: 4.4;
      }
      .tube .tint {
        stroke-width: 4.4;
      }
      .tube .shine {
        stroke: #ffffff;
        stroke-opacity: 0.22;
        stroke-width: 0.8;
      }
      /* the pipes inside the load lists: thinner glass tubes */
      .pipe path {
        fill: none;
        stroke-linejoin: round;
        stroke-linecap: round;
      }
      .pipe .rim {
        stroke: #bfe6ff;
        stroke-opacity: 0.28;
        stroke-width: 4.6;
      }
      .pipe .bore {
        stroke: #0b2a46;
        stroke-opacity: 0.9;
        stroke-width: 3;
      }
      .pipe .tint {
        stroke-width: 3;
        stroke-opacity: 0.22;
      }
      .pipe .shine {
        stroke: #ffffff;
        stroke-opacity: 0.2;
        stroke-width: 0.6;
      }
      .pipe.child .rim {
        stroke-width: 3.6;
      }
      .pipe.child .bore,
      .pipe.child .tint {
        stroke-width: 2.2;
      }
      .bt {
        fill: #f2fff8;
        paint-order: stroke;
        stroke: rgba(3, 28, 22, 0.55);
        stroke-width: 2px;
        stroke-linejoin: round;
      }
      line.sep {
        stroke-width: 0.6;
        stroke-opacity: 0.35;
      }
      .msg {
        color: rgba(214, 236, 255, 0.7);
      }
    `,
  ];
}

if (!customElements.get("energiefluss-glass-card")) {
  customElements.define("energiefluss-glass-card", EnergieflussGlassCard);
}

window.customCards = window.customCards ?? [];
if (!window.customCards.some((c) => c.type === "energiefluss-glass-card")) {
  window.customCards.push({
    type: "energiefluss-glass-card",
    name: "Energiefluss Glas",
    description: "Energiefluss im 2.5D-Glas-Look mit Glasrohren und leuchtenden Zügen – gleiche Daten wie die Energiefluss-Karte.",
    preview: true,
  });
}
