import { LitElement, css, html, svg, nothing, type PropertyValues, type SVGTemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { UPDATED_EVENT } from "./editor-core";
import "./card-editor";
import {
  batterySlots,
  dotRadius,
  pathLength,
  fitLabel,
  centsPerKwh,
  fmtCents,
  flowDuration,
  fmtEnergy,
  fmtPercent,
  fmtPower,
  kwh,
  lineWidth,
  num,
  shortName,
  watts,
  type StateLike,
} from "./format";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Hass {
  states: Record<string, StateLike>;
  locale?: { language: string };
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
}

interface CardConfig {
  type: string;
  entry_id?: string;
  title?: string;
  max_power?: number;
  flow_style?: "speed" | "size";
  colours?: Partial<Record<"solar" | "battery" | "grid" | "home" | "flexible" | "backup" | "inverter", string>>;
}

interface Load {
  entity: string;
  today: string | null;
  children?: Load[]; // loads contained in this one (counted only once)
}

/** A load row plus the feed path from its source (house, inverter or battery). */
interface ListLoad extends Load {
  trunk: string;
  source?: string;
  label?: string; // shown instead of the entity's name
  tip?: string; // tooltip instead of the default one
}

/** One group of loads on the right with its position and feed path. */
interface LoadGroup {
  title: string;
  colour: string;
  power: number | null;
  titleY: number;
  y0: number;
  trunk: string;
  loads: ListLoad[];
}

interface Layout {
  entry_id: string;
  title: string;
  energy_period: "midnight" | "rolling24";
  home_today: string | null;
  entities: Record<string, string | null>;
  solar: { strings: { entity: string }[]; today: string | null; forecast_remaining: string | null };
  batteries: {
    name: string;
    capacity_kwh: number | null;
    power: string | null;
    soc: string | null;
    backup?: Load[];
  }[];
  grid: {
    price: string | null;
    export_price: string | null;
    export_price_fixed: number | null;
    import_today: string | null;
    export_today: string | null;
  };
  wallbox?: { name: string; power: string; soc: string | null; today: string | null; flexible: boolean } | null;
  loads: { fixed: Load[]; flexible: Load[] };
}

/** Visual rows of a load list: every load plus the loads contained in it. */
const rowCount = (loads: Load[]): number => loads.reduce((n, l) => n + 1 + (l.children?.length ?? 0), 0);

const DEFAULT_COLOURS = {
  solar: "#ff9800",
  battery: "#ff69b4",
  grid: "#5490c2",
  home: "#5fb6ad",
  flexible: "#9575cd",
  backup: "#ef5350",
  inverter: "#959595",
};

// Layout: left = PV (top) + grid (bottom); centre column = house, inverter,
// batteries; right = all loads as lists.
const VIEW_W = 554;
// Inverter box: left edge flush with the first battery's power box.
const INV_X = 148;
const INV_CX = INV_X + 30;
const VIEW_H = 400;
// Storage summary box between inverter and batteries (as wide as the battery
// boxes below it); battery lines branch from it.
const STORE_Y = 240;
const STORE_H = 22;
const LOAD_X0 = 396; // list: name starts here (room for feed lanes left of it)
const BRACKET_X = LOAD_X0 - 20; // vertical bracket of a list; rows branch off it
const LOAD_XP = 504; // power box: right edge (name box ends 4 px before it)
const LOAD_PW = 40; // power box: width
const LOAD_X1 = 550; // energy box: right edge
const LOAD_EW = 42; // energy box: width
const LOAD_ROW = 22; // height of one list row
const LOAD_TITLE = 18; // height of a group title
// Vertical lanes between the batteries and the lists (bracket at BRACKET_X = 376).
const LANE_WALLBOX = 358; // wallbox feed from the inverter
const WALLBOX_LINE_Y = 207; // height of the wallbox feed at the inverter's right side
const LANE_BATTERY_1 = 364; // rightmost battery's output
const LANE_BATTERY_2 = 370; // second battery's output // vertical lane of the backup feed, right of the batteries
const MIN_FLOW_W = 5;
const DOT_SPEED = 40; // px per second in the "size" style
const TRAIN_GAP = 14; // px between the wagons of a load train
const TRAIN_PAUSE = 0.8; // s between two trains

// mdi icon paths (Material Design Icons, Apache 2.0)
const ICON_HOME = "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z";
const ICON_TOWER =
  "M8.28,5.45L6.5,4.55L7.76,2H16.24L17.5,4.55L15.72,5.45L15,4H9L8.28,5.45M18.62,8H14.09L13.3,5H10.7L9.91,8H5.38L4.1,10.55L5.89,11.44L6.62,10H17.38L18.1,11.44L19.89,10.55L18.62,8M17.77,22H15.7L15.46,21.1L12,15.9L8.53,21.1L8.3,22H6.23L9.12,11H11.19L10.83,12.35L12,14.1L13.16,12.35L12.81,11H14.88L17.77,22M11.4,15L10.5,13.65L9.32,18.13L11.4,15M14.68,18.12L13.5,13.64L12.6,15L14.68,18.12Z";
const ICON_CAR =
  "M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z";
const ICON_SOLAR =
  "M4,2H20A2,2 0 0,1 22,4V14A2,2 0 0,1 20,16H15V20H18V22H13V16H11V22H6V20H9V16H4A2,2 0 0,1 2,14V4A2,2 0 0,1 4,2M4,4V8H11V4H4M4,14H11V10H4V14M20,14V10H13V14H20M20,4H13V8H20V4Z";

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

export class EnergieflussCard extends LitElement {
  @property({ attribute: false }) hass?: Hass;
  @state() private _config?: CardConfig;
  @state() private _layout?: Layout;
  @state() private _error?: string;
  private _loading = false;

  static getStubConfig(): Partial<CardConfig> {
    return {};
  }

  /** Visual editor in the dashboard's "edit card" dialog. */
  static getConfigElement(): HTMLElement {
    return document.createElement("energiefluss-card-editor");
  }

  // Reload the layout when the instance was edited (editor page or card dialog).
  private _onUpdated = (ev: Event): void => {
    const entry = (ev as CustomEvent<{ entry_id?: string }>).detail?.entry_id;
    if (!entry || !this._layout || entry === this._layout.entry_id) {
      this._layout = undefined;
      void this._loadLayout();
    }
  };

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener(UPDATED_EVENT, this._onUpdated);
  }

  disconnectedCallback(): void {
    window.removeEventListener(UPDATED_EVENT, this._onUpdated);
    super.disconnectedCallback();
  }

  setConfig(config: CardConfig): void {
    this._config = config;
    this._layout = undefined;
  }

  getCardSize(): number {
    return 8;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" };
  }

  protected updated(changed: PropertyValues): void {
    if ((changed.has("hass") || changed.has("_config")) && this.hass && !this._layout && !this._loading) {
      void this._loadLayout();
    }
  }

  private async _loadLayout(): Promise<void> {
    if (!this.hass) return;
    this._loading = true;
    try {
      const msg: Record<string, unknown> = { type: "energiefluss/config" };
      if (this._config?.entry_id) msg.entry_id = this._config.entry_id;
      const res = await this.hass.callWS<{ instance: Layout }>(msg);
      this._layout = res.instance;
      this._error = undefined;
    } catch (err) {
      this._error =
        (err as { message?: string })?.message ??
        "Energiefluss-Integration nicht gefunden. Bitte unter Einstellungen → Geräte & Dienste einrichten.";
    } finally {
      this._loading = false;
    }
  }

  // -- state helpers --------------------------------------------------------
  private _s(id: string | null | undefined): StateLike | undefined {
    return id ? this.hass?.states[id] : undefined;
  }
  private _w(id: string | null | undefined): number | null {
    return watts(this._s(id));
  }
  private _own(key: string): number | null {
    return num(this._s(this._layout?.entities[key]));
  }
  private _name(id: string): string {
    const s = this._s(id);
    return (s?.attributes.friendly_name as string | undefined) ?? id.split(".")[1];
  }
  private get _loc(): string {
    return this.hass?.locale?.language ?? "de";
  }
  private get _c() {
    return { ...DEFAULT_COLOURS, ...(this._config?.colours ?? {}) };
  }
  private get _max(): number {
    return this._config?.max_power ?? 5000;
  }

  // -- svg building blocks --------------------------------------------------
  /** A line with an animated dot. `forward` = dot travels along the path direction. */
  private _flow(d: string, colour: string, power: number | null, forward: boolean, dot = true): SVGTemplateResult {
    return svg`
      <path d=${d} fill="none" stroke=${colour} stroke-width=${lineWidth(power, this._max)} stroke-opacity="0.85" />
      ${dot ? this._dot(d, colour, power, forward) : nothing}
    `;
  }

  /** Only the moving dot (for paths whose line is drawn elsewhere). */
  private get _bySize(): boolean {
    return this._config?.flow_style === "size";
  }

  /**
   * One moving dot. "size" style: constant speed, the dot's size shows the
   * power; default "speed" style: the reverse. `timing` lets a group of dots
   * share one period and start staggered (see _loadList).
   */
  private _dot(
    d: string,
    colour: string,
    power: number | null,
    forward = true,
    r = 3.2,
    train?: { period: number; begin: number; travel: number },
  ): SVGTemplateResult {
    if (power === null || Math.abs(power) < MIN_FLOW_W) return svg``;
    const bySize = this._bySize;
    const radius = bySize ? Math.max(1.7, dotRadius(power, this._max) * (r / 3.2)) : r;
    if (train) {
      // a wagon of a train: rides for `travel` s, then waits hidden for the next train
      const t = (train.travel / train.period).toFixed(4);
      const timing = { dur: `${train.period.toFixed(2)}s`, begin: `${train.begin.toFixed(2)}s` };
      return svg`<circle r=${radius} fill=${colour} opacity="0">
        <animateMotion dur=${timing.dur} begin=${timing.begin} repeatCount="indefinite" calcMode="linear"
          keyPoints="0;1;1" keyTimes=${`0;${t};1`} path=${d} />
        <animate attributeName="opacity" dur=${timing.dur} begin=${timing.begin} repeatCount="indefinite"
          calcMode="discrete" values="1;0" keyTimes=${`0;${t}`} />
      </circle>`;
    }
    const dur = bySize ? Math.max(0.6, pathLength(d) / DOT_SPEED) : flowDuration(power, this._max);
    return svg`<circle r=${radius} fill=${colour}>
      <animateMotion dur=${`${dur.toFixed(2)}s`} repeatCount="indefinite" calcMode="linear"
        keyPoints=${forward ? "0;1" : "1;0"} keyTimes="0;1" path=${d} />
    </circle>`;
  }

  private _box(x: number, y: number, w: number, h: number, colour: string, text: string, size = 12): SVGTemplateResult {
    return svg`
      <rect x=${x} y=${y} width=${w} height=${h} rx="4" fill="none" stroke=${colour} stroke-width="1" />
      <text x=${x + w / 2} y=${y + h / 2 + size * 0.35} text-anchor="middle" class="val" font-size=${size}>${text}</text>
    `;
  }

  private _icon(path: string, x: number, y: number, size: number, colour: string): SVGTemplateResult {
    return svg`<path d=${path} fill=${colour} transform=${`translate(${x} ${y}) scale(${size / 24})`} />`;
  }

  // -- sections ---------------------------------------------------------------
  private _solar(): SVGTemplateResult {
    const L = this._layout!;
    const c = this._c.solar;
    const total = this._own("solar_power");
    const strings = L.solar.strings.slice(0, 4);
    const pos = [
      [10, 10],
      [80, 10],
      [10, 58],
      [80, 58],
    ];
    const today = kwh(this._s(L.solar.today));
    const rest = kwh(this._s(L.solar.forecast_remaining));
    return svg`
      ${strings.map((s, i) => {
        const [x, y] = pos[i];
        return svg`${this._box(x, y, 60, 24, c, fmtPower(this._w(s.entity), this._loc), 11)}
          <text x=${x} y=${y + 35} class="lbl">${shortName(this._name(s.entity), 14)}</text>`;
      })}
      ${this._icon(ICON_SOLAR, 152, 34, 26, c)}
      ${this._box(45, 108, 70, 26, c, fmtPower(total, this._loc), 13)}
      <text x="121" y="117" class="lbl">PV gesamt</text>
      ${today !== null ? svg`<text x="121" y="130" class="small" fill=${c}>${fmtEnergy(today, this._loc)} heute</text>` : nothing}
      ${rest !== null ? svg`<text x="121" y="142" class="small">Rest ${fmtEnergy(rest, this._loc)}</text>` : nothing}
      ${this._flow(`M 80 134 V 185 H ${INV_X}`, c, total, true)}
    `;
  }

  /** Batteries in display order: those with a backup output go to the right. */
  private _displayBatteries() {
    const bats = this._layout?.batteries ?? [];
    const plain = bats.filter((b) => !(b.backup ?? []).length);
    const backup = bats.filter((b) => (b.backup ?? []).length);
    const ordered = [...plain, ...backup];
    const slots = batterySlots(ordered.length);
    return ordered.map((b, i) => ({ ...b, ...slots[i], index: i }));
  }

  private _batteries(): SVGTemplateResult {
    const L = this._layout!;
    const c = this._c.battery;
    if (!L.batteries.length) return svg``;
    const soc = this._own("battery_soc");
    const energy = this._own("battery_energy");
    const shown = this._displayBatteries();
    const n = shown.length;
    const total = this._own("battery_power");
    // flush with the outer edges of the battery boxes below
    const storeX = Math.min(...shown.map((b) => b.cx - b.w / 2));
    const storeW = Math.max(...shown.map((b) => b.cx + b.w / 2)) - storeX;
    // feed from the inverter: straight down if it is above the box, else with a knee
    const feedX = Math.min(Math.max(INV_CX, storeX + 10), storeX + storeW - 10);
    const feed =
      feedX === INV_CX ? `M ${INV_CX} 230 V ${STORE_Y}` : `M ${INV_CX} 230 V ${STORE_Y - 5} H ${feedX} V ${STORE_Y}`;
    return svg`
      ${shown.map((b, i) => {
        const { cx, top, w } = b;
        const small = w < 54;
        const p = num(this._s(b.power));
        const s = num(this._s(b.soc));
        const fill = Math.max(0, Math.min(100, s ?? 0));
        // the storage box spans all batteries: every line drops straight down
        const path = `M ${cx} ${STORE_Y + STORE_H} V ${top}`;
        const label = p === null ? "" : p > MIN_FLOW_W ? "lädt" : p < -MIN_FLOW_W ? "entlädt" : "ruht";
        return svg`
          ${this._flow(path, c, p, (p ?? 0) > 0)}
          ${this._box(cx - w / 2, top, w, 22, c, fmtPower(p === null ? null : Math.abs(p), this._loc), small ? 10 : 11)}
          <text x=${cx} y=${top + 32} text-anchor="middle" class="tiny">${label}</text>
          <rect x=${cx - 9} y=${top + 42} width="18" height="32" rx="3" fill="none" stroke=${c} />
          <rect x=${cx - 4} y=${top + 39} width="8" height="3" fill=${c} />
          <rect x=${cx - 7} y=${top + 72 - (28 * fill) / 100} width="14" height=${(28 * fill) / 100} rx="1" fill=${c} fill-opacity="0.7" />
          <text x=${cx} y=${top + 91} text-anchor="middle" class="soc">${fmtPercent(s, this._loc)}</text>
          <text x=${cx} y=${top + 104} text-anchor="middle" class="tiny">${shortName(b.name, small ? 10 : 14)}</text>
        `;
      })}
      ${this._flow(feed, c, total, (total ?? 0) > 0)}
      ${this._box(
        storeX,
        STORE_Y,
        storeW,
        STORE_H,
        c,
        `${storeW >= 120 ? "Speicher " : ""}${fmtPercent(soc, this._loc)}${
          energy !== null && storeW >= 80 ? ` · ${fmtEnergy(energy, this._loc)}` : ""
        }`,
        storeW >= 150 ? 11 : 10,
      )}
    `;
  }

  private _inverter(): SVGTemplateResult {
    const c = this._c.inverter;
    return svg`
      <rect x=${INV_X} y="170" width="60" height="60" rx="6" fill="none" stroke=${c} stroke-width="1.5" />
      <path d=${`M ${INV_X + 12} 210 q 6 -12 12 0 t 12 0`} fill="none" stroke=${c} stroke-width="1.5" />
      <line x1=${INV_X + 12} y1="190" x2=${INV_X + 48} y2="190" stroke=${c} stroke-width="1.5" />
    `;
  }

  /**
   * All load groups on the right, top to bottom, with their positions and the
   * feed path (trunk) from their source: house, inverter backup output or a
   * battery's own output (one group per battery).
   */
  private _groups(): LoadGroup[] {
    const L = this._layout;
    if (!L) return [];
    const c = this._c;
    const bracket = BRACKET_X;
    const groups: LoadGroup[] = [];
    let y = 22; // baseline of the first title
    const add = (
      title: string,
      colour: string,
      loads: (Load & { label?: string; tip?: string })[],
      power: number | null,
      trunk: (rowY: number, lineY: number) => string,
      source?: string,
      // Where the feed may leave its source: preferred height and allowed range.
      // The first row goes to the preferred height if there is room; if the
      // list above pushes it down, the exit follows within the range so the
      // line still runs straight.
      exit?: { pref: number; lo: number; hi: number },
    ) => {
      if (!loads.length) return;
      const y0 = Math.max(y + 6, exit ? exit.pref - 10 : 0);
      const lineY = exit ? Math.min(Math.max(y0 + 10, exit.lo), exit.hi) : y0 + 10;
      const path = trunk(y0 + 10, lineY);
      groups.push({
        title,
        colour,
        power,
        titleY: y0 - 6,
        y0,
        trunk: path,
        loads: loads.map((l) => ({ ...l, trunk: path, source })),
      });
      y = y0 + rowCount(loads) * LOAD_ROW + 16;
    };
    add("Nicht steuerbar", c.home, L.loads.fixed, this._sumW(L.loads.fixed), (t) => `M 285 79 H 300 V ${t} H ${bracket}`);
    add("Steuerbar", c.flexible, L.loads.flexible, this._sumW(L.loads.flexible), (t) => `M 285 89 H 306 V ${t} H ${bracket}`);
    // Wallbox / car: fed from the inverter's right side, straight if there is room
    const wb = L.wallbox;
    if (wb) {
      const soc = num(this._s(wb.soc ?? undefined));
      const label = soc !== null ? `${wb.name} Auto ${fmtPercent(soc, this._loc)}` : wb.name;
      add(
        "Wallbox",
        wb.flexible ? c.flexible : c.home,
        [{ entity: wb.power, today: wb.today, label, tip: `${wb.name}${wb.flexible ? " · steuerbar" : ""}` }],
        this._w(wb.power),
        (t, ly) => `M ${INV_X + 60} ${ly} H ${LANE_WALLBOX} V ${t} H ${bracket}`,
        undefined,
        { pref: WALLBOX_LINE_Y, lo: 176, hi: 226 }, // anywhere on the inverter's right edge
      );
    }
    // Batteries with an own output sit rightmost and lead it straight to the right.
    const feeds = this._displayBatteries()
      .filter((b) => (b.backup ?? []).length)
      .reverse();
    feeds.forEach((b, k) => {
      const lane = k === 0 ? LANE_BATTERY_1 : LANE_BATTERY_2;
      // sideways out of the battery symbol; the lowered battery's line passes
      // just below the raised one on its right
      // out of the battery symbol (top+42 .. top+74); the lowered battery stays
      // below the raised one's name (raised top + 104)
      const exit =
        k === 0
          ? { pref: b.top + 57, lo: b.top + 46, hi: b.top + 70 }
          : { pref: b.top + 68, lo: b.top + 64, hi: b.top + 72 };
      add(
        shortName(b.name, 12), // red colour + feed line from the battery mark it as backup
        c.backup,
        b.backup ?? [],
        this._sumW(b.backup ?? []),
        (t, ly) => `M ${b.cx + 10} ${ly} H ${lane} V ${t} H ${bracket}`,
        b.name,
        exit,
      );
    });
    return groups;
  }

  private _sumW(loads: Load[]): number | null {
    return loads.reduce<number | null>((s, l) => {
      const w = this._w(l.entity);
      return w === null ? s : (s ?? 0) + w;
    }, null);
  }

  /** One group as a vertical list, biggest consumer on top: name, power, energy.
   *  Every row knows the feed path (`trunk`) from its source; a running load
   *  gets its own dot that travels the trunk and on to its row. */
  private _loadList(loads: ListLoad[], y0: number, colour: string): SVGTemplateResult {
    const byPower = <T extends { w: number | null; name: string }>(a: T, b: T) =>
      (b.w ?? -Infinity) - (a.w ?? -Infinity) || a.name.localeCompare(b.name);
    const mains = loads
      .map((l) => ({ ...l, w: this._w(l.entity), name: l.label ?? this._name(l.entity) }))
      .sort(byPower);
    // visual rows: each load, then its contained loads indented below it
    type Row = (typeof mains)[number] & { child: boolean; parentRow?: number };
    const rows: Row[] = [];
    for (const m of mains) {
      const at = rows.length;
      rows.push({ ...m, child: false });
      const kids = (m.children ?? [])
        .map((c) => ({ ...m, ...c, children: undefined, label: undefined, w: this._w(c.entity), name: this._name(c.entity) }))
        .sort(byPower);
      for (const k of kids) rows.push({ ...k, child: true, parentRow: at });
    }
    const path = (l: ListLoad, i: number) => `${l.trunk} V ${y0 + i * LOAD_ROW + 10} H ${LOAD_X0 - 3}`;
    // a contained load's wagon rides into its parent's station and on along
    // the dashed connector to its own row
    const childPath = (l: Row, i: number) =>
      `${path(l, l.parentRow ?? 0)} H ${LOAD_X0 + 4} V ${y0 + i * LOAD_ROW + 10} H ${LOAD_X0 + 10}`;
    // power that stays at a parent: its value minus what its contained loads take
    const own = (i: number): number | null => {
      const w = rows[i].w;
      if (w === null) return null;
      const kids = rows.filter((r) => r.child && r.parentRow === i).reduce((s, r) => s + Math.max(r.w ?? 0, 0), 0);
      return Math.max(w - kids, 0);
    };
    // "size" style: the dots run like a train down the feed line, one wagon
    // per running load in row order (biggest first). At each station the front
    // wagon uncouples and turns to its load; the rest rides on. A parent with
    // contained loads takes several wagons into its station; the smaller ones
    // ride on to the contained loads. All wagons share one period, so the
    // train keeps its formation.
    const wagonPower = (l: Row, i: number) => (l.child ? l.w : own(i));
    const running = rows
      .map((l, i) => ({ l, i, w: wagonPower(l, i) }))
      .filter(({ w }) => w !== null && Math.abs(w) >= MIN_FLOW_W);
    const wagons = running.map(({ l, i }, k) => ({
      i,
      begin: (k * TRAIN_GAP) / DOT_SPEED,
      travel: pathLength(l.child ? childPath(l, i) : path(l, i)) / DOT_SPEED,
    }));
    const period = Math.max(1, ...wagons.map((w) => w.begin + w.travel)) + TRAIN_PAUSE;
    const train = new Map(wagons.map((w) => [w.i, { period, begin: w.begin, travel: w.travel }] as const));
    const lastMain = rows.reduce((last, r, i) => (r.child ? last : i), 0);
    return svg`
      <line x1=${BRACKET_X} y1=${y0 + 4} x2=${BRACKET_X} y2=${y0 + lastMain * LOAD_ROW + 10}
        stroke=${colour} stroke-width="1" stroke-opacity="0.6" />
      ${rows.map((l, i) => {
        const y = y0 + i * LOAD_ROW;
        const idle = l.w === null || Math.abs(l.w) < MIN_FLOW_W;
        if (l.child) {
          const top = y0 + (l.parentRow ?? 0) * LOAD_ROW + 19;
          const tip = `${l.name} · enthalten in ${rows[l.parentRow ?? 0].name}`;
          return svg`
            <path d=${`M ${LOAD_X0 + 4} ${top} V ${y + 10} H ${LOAD_X0 + 10}`} fill="none" stroke=${colour}
              stroke-opacity="0.6" stroke-dasharray="2 2" />
            ${this._bySize ? this._dot(childPath(l, i), colour, l.w, true, 2.4, train.get(i)) : nothing}
            <g opacity=${idle ? 0.45 : 0.85}>
              ${this._nameBox(l.name, y, colour, tip, 12)}
              ${this._box(LOAD_XP - LOAD_PW, y + 1, LOAD_PW, 18, colour, fmtPower(l.w, this._loc), 9)}
            </g>
            ${this._box(LOAD_X1 - LOAD_EW, y + 1, LOAD_EW, 18, colour, fmtEnergy(num(this._s(l.today)), this._loc), 8.5)}`;
        }
        const tip = l.tip ?? (l.source ? `${l.name} · gespeist von ${l.source}` : l.name);
        return svg`
          <line x1=${BRACKET_X} y1=${y + 10} x2=${LOAD_X0 - 3} y2=${y + 10} stroke=${colour} stroke-opacity="0.6" />
          ${this._bySize
            ? this._dot(path(l, i), colour, own(i), true, 2.4, train.get(i))
            : this._dot(path(l, i), colour, l.w, true, 2.4)}
          <g opacity=${idle ? 0.45 : 1}>
            ${this._nameBox(l.name, y, colour, tip)}
            ${this._box(LOAD_XP - LOAD_PW, y + 1, LOAD_PW, 18, colour, fmtPower(l.w, this._loc), 9)}
          </g>
          ${this._box(LOAD_X1 - LOAD_EW, y + 1, LOAD_EW, 18, colour, fmtEnergy(num(this._s(l.today)), this._loc), 8.5)}`;
      })}
    `;
  }

  /** Name of a load in a rounded box; long names wrap to two smaller lines. */
  private _nameBox(name: string, y: number, colour: string, tooltip = name, indent = 0): SVGTemplateResult {
    const x = LOAD_X0 - 2 + indent;
    const w = LOAD_XP - LOAD_PW - 4 - x;
    const { lines, small } = indent ? fitLabel(name, 9, 12) : fitLabel(name, 11, 15);
    return svg`<g>
      <title>${tooltip}</title>
      <rect x=${x} y=${y + 1} width=${w} height="18" rx="4" fill="none" stroke=${colour} stroke-width="1" />
      ${small
        ? svg`<text x=${x + 4} y=${y + 9} class="name" font-size="7.5">${lines[0]}</text>
              <text x=${x + 4} y=${y + 17} class="name" font-size="7.5">${lines[1] ?? ""}</text>`
        : svg`<text x=${x + 4} y=${y + 13.5} class="name" font-size="10">${lines[0]}</text>`}
    </g>`;
  }

  private _groupTitle(y: number, colour: string, title: string, power: number | null, loads: Load[]): SVGTemplateResult {
    const today = loads.reduce<number | null>((sum, l) => {
      const v = num(this._s(l.today));
      return v === null ? sum : (sum ?? 0) + v;
    }, null);
    return svg`
      <text x=${BRACKET_X} y=${y} class="small grp" fill=${colour}>${title}</text>
      <text x=${LOAD_XP - LOAD_PW / 2} y=${y} text-anchor="middle" class="small grp" fill=${colour}>${fmtPower(power, this._loc)}</text>
      <text x=${LOAD_X1 - LOAD_EW / 2} y=${y} text-anchor="middle" class="small grp" fill=${colour}>${fmtEnergy(today, this._loc)}</text>`;
  }

  /** Total svg height needed for the load lists and the batteries. */
  private get _viewH(): number {
    if (!this._layout) return VIEW_H;
    const groups = this._groups();
    const last = groups[groups.length - 1];
    const lists = last ? last.y0 + rowCount(last.loads) * LOAD_ROW + 8 : 0;
    const shown = this._displayBatteries();
    const batBottom = shown.length ? Math.max(...shown.map((b) => b.top)) + 138 : 0;
    return Math.max(VIEW_H, lists, batBottom);
  }

  private _home(): SVGTemplateResult {
    const L = this._layout!;
    const c = this._c.home;
    const home = this._own("home_power");
    const rest = this._own("unmeasured_power");
    const groups = this._groups();

    return svg`
      ${this._icon(ICON_HOME, 226, 16, 48, c)}
      ${this._box(215, 70, 70, 26, c, fmtPower(home, this._loc), 13)}
      <text x="211" y="83" text-anchor="end" class="lbl">Haus</text>
      <text x="211" y="95" text-anchor="end" class="tiny val">${fmtEnergy(num(this._s(L.home_today)), this._loc)}</text>
      ${rest !== null
        ? svg`<text x="256" y="112" class="tiny">nicht erfasst</text>
              <text x="256" y="122" class="tiny val">${fmtPower(rest, this._loc)}</text>`
        : nothing}
      ${this._flow(`M ${INV_CX} 170 V 152 H 250 V 96`, c, home, true)}
      ${groups.length
        ? svg`<text x=${LOAD_X1 - LOAD_EW / 2} y="9" text-anchor="middle" class="tiny">${L.energy_period === "rolling24" ? "24 h" : "heute"}</text>`
        : nothing}
      ${groups.map(
        (g) => svg`
          ${this._groupTitle(g.titleY, g.colour, g.title, g.power, g.loads)}
          ${g.title === "Wallbox" ? this._icon(ICON_CAR, BRACKET_X + 46, g.titleY - 11, 14, g.colour) : nothing}
          ${this._flow(g.trunk, g.colour, g.power, true, false)}
          ${this._loadList(g.loads, g.y0, g.colour)}
        `,
      )}
    `;
  }

  private _grid(): SVGTemplateResult {
    const L = this._layout!;
    const c = this._c.grid;
    const grid = this._own("grid_power");
    const imp = kwh(this._s(L.grid.import_today));
    const exp = kwh(this._s(L.grid.export_today));
    // Current price: import price while buying (or idle), feed-in tariff while selling.
    const exporting = (grid ?? 0) < -MIN_FLOW_W;
    const cents = exporting
      ? L.grid.export_price
        ? centsPerKwh(this._s(L.grid.export_price))
        : (L.grid.export_price_fixed ?? null)
      : centsPerKwh(this._s(L.grid.price));
    const label = grid === null ? "" : grid > MIN_FLOW_W ? "Bezug" : exporting ? "Einspeisung" : "";
    const power = fmtPower(grid === null ? null : Math.abs(grid), this._loc);
    return svg`
      ${this._flow(`M ${INV_X} 212 H 84`, c, grid, exporting)}
      <rect x="10" y="192" width="74" height="40" rx="4" fill="none" stroke=${c} stroke-width="1" />
      <text x="47" y=${cents === null ? 217 : 209} text-anchor="middle" class="val" font-size="13">${power}</text>
      ${cents !== null
        ? svg`<text x="47" y="225" text-anchor="middle" class="tiny" fill=${c}>${fmtCents(cents, this._loc)}</text>`
        : nothing}
      <text x="90" y="207" class="tiny">${label}</text>
      ${this._icon(ICON_TOWER, 27, 240, 40, c)}
      ${imp !== null
        ? svg`<text x="10" y="292" class="small" fill=${c}>↓ ${fmtEnergy(imp, this._loc)}<tspan class="tiny"> Bezug</tspan></text>`
        : nothing}
      ${exp !== null
        ? svg`<text x="10" y="305" class="small">↑ ${fmtEnergy(exp, this._loc)}<tspan class="tiny"> Einspeisung</tspan></text>`
        : nothing}
    `;
  }

  // -- render -----------------------------------------------------------------
  protected render() {
    if (this._error) {
      return html`<ha-card><div class="msg">${this._error}</div></ha-card>`;
    }
    if (!this._layout || !this.hass) {
      return html`<ha-card><div class="msg">Lade Energiefluss …</div></ha-card>`;
    }
    const title = this._config?.title;
    return html`
      <ha-card .header=${title ?? nothing}>
        <svg viewBox=${`0 0 ${VIEW_W} ${this._viewH}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Energiefluss">
          ${this._solar()} ${this._batteries()} ${this._inverter()} ${this._home()} ${this._grid()}
        </svg>
      </ha-card>
    `;
  }

  static styles = css`
    ha-card {
      padding: 8px;
    }
    svg {
      width: 100%;
      height: auto;
      display: block;
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }
    .val {
      fill: var(--primary-text-color);
    }
    .lbl {
      fill: var(--secondary-text-color);
      font-size: 10px;
    }
    .small {
      fill: var(--secondary-text-color);
      font-size: 10px;
    }
    .tiny {
      fill: var(--secondary-text-color);
      font-size: 8px;
    }
    .grp {
      font-weight: 600;
    }
    .soc {
      fill: var(--primary-text-color);
      font-size: 13px;
    }
    .name {
      fill: var(--primary-text-color);
    }
    .tiny.val {
      fill: var(--primary-text-color);
    }
    .big {
      fill: var(--primary-text-color);
      font-size: 16px;
    }
    .msg {
      padding: 16px;
      color: var(--secondary-text-color);
    }
  `;
}

declare global {
  interface Window {
    customCards?: { type: string; name: string; description: string; preview?: boolean }[];
  }
}

if (!customElements.get("energiefluss-card")) {
  customElements.define("energiefluss-card", EnergieflussCard);
}

window.customCards = window.customCards ?? [];
if (!window.customCards.some((c) => c.type === "energiefluss-card")) {
  window.customCards.push({
    type: "energiefluss-card",
    name: "Energiefluss",
    description: "Animierter Energiefluss – konfiguriert über die Energiefluss-Integration.",
    preview: true,
  });
}
