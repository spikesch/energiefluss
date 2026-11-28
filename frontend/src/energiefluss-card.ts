import {
  LitElement,
  css,
  html,
  svg,
  nothing,
  type CSSResultGroup,
  type PropertyValues,
  type SVGTemplateResult,
} from "lit";
import { property, state } from "lit/decorators.js";
import { UPDATED_EVENT } from "./editor-core";
import { EDIT_EVENT, editTarget } from "./edit-target";
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

export interface Load {
  entity: string;
  today: string | null;
  children?: Load[]; // loads contained in this one (counted only once)
}

/** A load row plus the feed path from its source (house, inverter or battery). */
export interface ListLoad extends Load {
  trunk: string;
  route?: string; // path of its dots if they start before the trunk (see _houseLead / _batteryLead)
  source?: string;
  label?: string; // shown instead of the entity's name
  tip?: string; // tooltip instead of the default one
  // the "+ N weitere" / "− weniger" row of a folded list: toggles the group,
  // shows the sum of the hidden loads (power, today's energy) and gets their train
  more?: { group: string; power: number | null; today: number | null };
}

/** One group of loads on the right with its position and feed path. */
export interface LoadGroup {
  title: string;
  colour: string;
  power: number | null;
  titleY: number;
  y0: number;
  trunk: string;
  loads: ListLoad[]; // the rows shown
  all: Load[]; // every load of the group (for the sums)
  rows: number; // visual rows incl. contained loads and the "more" row
  more?: { hidden: number; expanded: boolean }; // the list can be folded
}

interface Layout {
  entry_id: string;
  title: string;
  energy_period: "midnight" | "rolling24";
  home_today: string | null;
  unmeasured_today?: string | null;
  entities: Record<string, string | null>;
  solar: { strings: { entity: string }[]; today: string | null; forecast_remaining: string | null };
  batteries: {
    name: string;
    capacity_kwh: number | null;
    power: string | null;
    soc: string | null;
    backup?: Load[];
    backup_only?: boolean; // gives power only to its backup loads, never to the house
    charge?: string | null; // input sensor (split mode)
    discharge?: string | null; // output sensor (split mode)
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
  names?: Record<string, string>; // own names of loads
}

/** Visual rows of a load list: every load plus the loads contained in it. */
export const rowCount = (loads: Load[]): number => loads.reduce((n, l) => n + 1 + (l.children?.length ?? 0), 0);

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
export const INV_X = 148;
const VIEW_H = 400;
// Storage summary box between inverter and batteries (as wide as the battery
// boxes below it); battery lines branch from it.
export const STORE_Y = 240;
export const STORE_H = 22;
export const LOAD_X0 = 396; // list: name starts here (room for feed lanes left of it)
export const BRACKET_X = LOAD_X0 - 20; // vertical bracket of a list; rows branch off it
export const LOAD_XP = 504; // power box: right edge (name box ends 4 px before it)
export const LOAD_PW = 40; // power box: width
export const LOAD_X1 = 550; // energy box: right edge
export const LOAD_EW = 42; // energy box: width
export const LOAD_ROW = 22; // height of one list row
const LOAD_TITLE = 18; // height of a group title
// Vertical lanes between the batteries and the lists (bracket at BRACKET_X = 376).
const LANE_WALLBOX = 358; // wallbox feed from the inverter
const WALLBOX_LINE_DY = 37; // height of the wallbox feed below the inverter's top
const LANE_BATTERY_1 = 364; // rightmost battery's output
const LANE_BATTERY_2 = 370; // second battery's output // vertical lane of the backup feed, right of the batteries
export const MIN_FLOW_W = 5;
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
  /** Set by the Wattrio page while its settings are open: a click edits the field. */
  @property({ type: Boolean }) editMode = false;
  @state() protected _config?: CardConfig;
  @state() protected _layout?: Layout;
  @state() protected _error?: string;
  /** Titles of the load groups the user unfolded. */
  @state() protected _expanded = new Set<string>();
  protected _loading = false;

  static getStubConfig(): Partial<CardConfig> {
    return {};
  }

  /** Visual editor in the dashboard's "edit card" dialog. */
  static getConfigElement(): HTMLElement {
    return document.createElement("energiefluss-card-editor");
  }

  // Reload the layout when the instance was edited (editor page or card dialog).
  protected _onUpdated = (ev: Event): void => {
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

  protected async _loadLayout(): Promise<void> {
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
        "Wattrio-Integration nicht gefunden. Bitte unter Einstellungen → Geräte & Dienste einrichten.";
    } finally {
      this._loading = false;
    }
  }

  // -- state helpers --------------------------------------------------------
  protected _s(id: string | null | undefined): StateLike | undefined {
    return id ? this.hass?.states[id] : undefined;
  }
  protected _w(id: string | null | undefined): number | null {
    return watts(this._s(id));
  }
  protected _own(key: string): number | null {
    return num(this._s(this._layout?.entities[key]));
  }
  protected _name(id: string): string {
    const own = this._layout?.names?.[id];
    if (own) return own;
    const s = this._s(id);
    return (s?.attributes.friendly_name as string | undefined) ?? id.split(".")[1];
  }
  protected get _loc(): string {
    return this.hass?.locale?.language ?? "de";
  }
  protected get _c(): Record<keyof typeof DEFAULT_COLOURS, string> {
    return { ...DEFAULT_COLOURS, ...(this._config?.colours ?? {}) };
  }
  protected get _max(): number {
    return this._config?.max_power ?? 5000;
  }

  /** Top left corners of the PV string tiles. */
  protected get _stringPos(): number[][] {
    return [
      [10, 10],
      [80, 10],
      [10, 58],
      [80, 58],
    ];
  }
  /** Left edge and width of the "PV gesamt" box. */
  protected get _pvBox(): [number, number] {
    return [45, 70];
  }
  /** Top of the "PV gesamt" box (26 high). */
  protected get _pvBoxY(): number {
    return 108;
  }
  /** Top of the storage box above the batteries. */
  protected get _storeY(): number {
    return STORE_Y;
  }

  /** The card is at least this tall. */
  protected get _minViewH(): number {
    return VIEW_H;
  }

  /** Room the card keeps below the top of the lowest battery. */
  protected get _batteryTail(): number {
    return 138;
  }

  /** Height of one load list row; looks may make the lists denser. */
  protected get _rowH(): number {
    return LOAD_ROW;
  }

  /** Makes `content` open the more-info dialog of `entity` when clicked. */
  protected _tap(entity: string | null | undefined, content: SVGTemplateResult): SVGTemplateResult {
    return entity ? svg`<g class="tap" data-entity=${entity}>${content}</g>` : content;
  }

  /** Click on a value: open its sensor's more-info dialog (like other HA cards). */
  protected _onTap = (ev: Event): void => {
    const hit = ev.composedPath().find((e): e is Element => e instanceof Element && e.hasAttribute("data-entity"));
    const entityId = hit?.getAttribute("data-entity");
    if (!entityId) return;
    const target = this.editMode && this._layout ? editTarget(this._layout, entityId) : undefined;
    if (target) {
      this.dispatchEvent(new CustomEvent(EDIT_EVENT, { detail: target, bubbles: true, composed: true }));
      return;
    }
    this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }));
  };

  /** Font size for text set in the templates; looks may scale all of it. */
  protected _fs(size: number): number {
    return size;
  }

  // -- layout knobs that alternative looks may move ----------------------------
  /** Left edge of the inverter box (60 x 60). */
  protected get _invX(): number {
    return INV_X;
  }
  /** Top of the house value box (70 x 26 at x 215). */
  protected get _houseY(): number {
    return 70;
  }
  /** Top edge of the inverter box. */
  protected get _invY(): number {
    return 170;
  }
  /** Where the house line leaves the inverter (top) ... */
  protected get _invTop(): [number, number] {
    return [this._invX + 30, this._invY];
  }
  /** ... and where the storage line leaves it (bottom). */
  protected get _invBottom(): [number, number] {
    return [this._invX + 30, this._invY + 60];
  }
  /** Where the PV line leaves the PV total box (x) and enters the inverter (y). */
  protected get _solarX(): number {
    return 80;
  }
  protected get _solarY(): number {
    return this._invY + 15;
  }
  /** Whether the not measured part of the house is a row of its own in the
   *  "Grundlast" (base load) list (instead of a small note below the house). */
  protected get _unmeasuredInList(): boolean {
    return false;
  }
  /** Where a battery's own (backup) output leaves the battery symbol, to the right. */
  protected _batteryOutX(cx: number, _w: number): number {
    return cx + 10;
  }
  /** Path of the house line's dots (from the inverter into the house box);
   *  null = along the drawn line. */
  protected _houseIn(): string | null {
    return null;
  }
  /** Drawn where the house line's dots end (nothing in the classic look). */
  protected _houseJunction(_watts: number | null): SVGTemplateResult {
    return svg``;
  }
  /** Path inside the house box to its right side at height `y` (where a load
   *  list's trunk starts); null = the list's dots start at the box's side. */
  protected _houseLead(_y: number): string | null {
    return null;
  }
  /** Path inside a battery up to its own (backup) output at height `y`; null =
   *  the backup dots start at the battery's side. */
  protected _batteryLead(_cx: number, _top: number, _w: number, _y: number): string | null {
    return null;
  }
  /** Path from a PV string tile (top left x, y) through the PV total box to the
   *  inverter; null = one dot line from the PV total box only. */
  protected _stringRoute(_x: number, _y: number): string | null {
    return null;
  }
  /** Dots of several routes that share part of their way: the PV strings (they
   *  join at the PV total box) or the batteries (they part at the storage box).
   *  Looks may let them form one train there. */
  protected _trainDots(
    _kind: "pv" | "battery",
    colour: string,
    items: { route: string; w: number | null; forward: boolean }[],
  ): SVGTemplateResult {
    return svg`${items.map((it) => this._dot(it.route, colour, it.w, it.forward))}`;
  }
  /** Balls (radius, colour) a load's dots consist of, for looks that count the
   *  power in balls; null = one wagon per load whose size shows the power. */
  protected _wagonBalls(_watts: number, _colour: string, _source?: string): { r: number; colour: string }[] | null {
    return null;
  }
  /** One train for a whole group on its shared feed (house to the list's
   *  bracket); null = every load's wagon rides the whole way from the house. */
  protected _feedTrain(_d: string, _watts: number, _colour: string, _source?: string): SVGTemplateResult | null {
    return null;
  }
  /** Dots of the house line (from the inverter to the house). */
  protected _houseDots(d: string, colour: string, watts: number | null): SVGTemplateResult {
    return this._dot(d, colour, watts, true);
  }
  /** Speed of the load list trains in px per second. */
  protected get _wagonSpeed(): number {
    return DOT_SPEED;
  }
  /** A battery's whole route from the inverter through the storage box to the
   *  battery (for dots that pass through the box); null = dots stop at the box. */
  protected _batteryRoute(_cx: number, _top: number): string | null {
    return null;
  }
  /**
   * Power on the line between a battery and the storage box (+ = into the
   * battery). Usually its own power; a battery that can only give power to
   * its backup loads (e.g. EcoFlow) only ever takes power in: its input,
   * including what it just passes through to its backup loads.
   */
  protected _lineFlow(name: string, p: number | null): number | null {
    const bat = this._layout?.batteries.find((b) => b.name === name);
    if (bat?.backup_only) return Math.max(this._w(bat.charge) ?? 0, 0);
    // its backup loads take their share straight from it; only the rest
    // runs between the battery and the house
    if (p === null || !bat?.backup?.length) return p;
    return p + Math.max(this._sumW(bat.backup) ?? 0, 0);
  }

  /** Today's energy of the house net: the house's daily energy minus that of all
   *  backup loads (each has its own daily counter). */
  protected get _houseNetToday(): number | null {
    const home = num(this._s(this._layout?.home_today));
    if (home === null) return null;
    const backup = (this._layout?.batteries ?? [])
      .flatMap((b) => b.backup ?? [])
      .reduce((s, l) => s + (num(this._s(l.today)) ?? 0), 0);
    return Math.max(home - backup, 0);
  }

  /** Active power of all backup loads: batteries feed them straight from their own
   *  output, they are not on the house net. Their own sensors, not a battery's
   *  output (that may be apparent power and include its own consumption). */
  protected get _offGridLoads(): number {
    return (this._layout?.batteries ?? []).reduce((s, b) => s + Math.max(this._sumW(b.backup ?? []) ?? 0, 0), 0);
  }

  /** Horizontal offset of the whole storage area (n = number of batteries). */
  protected _batteryShift(_n: number): number {
    return 0;
  }
  /** Whether the wallbox is shown as a group in the load lists on the right. */
  protected get _wallboxInList(): boolean {
    return true;
  }

  // -- svg building blocks --------------------------------------------------
  /** A line with an animated dot. `forward` = dot travels along the path direction. */
  protected _flow(d: string, colour: string, power: number | null, forward: boolean, dot = true): SVGTemplateResult {
    return svg`
      <path d=${d} fill="none" stroke=${colour} stroke-width=${lineWidth(power, this._max)} stroke-opacity="0.85" />
      ${dot ? this._dot(d, colour, power, forward) : nothing}
    `;
  }

  /** Only the moving dot (for paths whose line is drawn elsewhere). */
  protected get _bySize(): boolean {
    return this._config?.flow_style === "size";
  }

  /**
   * One moving dot. "size" style: constant speed, the dot's size shows the
   * power; default "speed" style: the reverse. `timing` lets a group of dots
   * share one period and start staggered (see _loadList).
   */
  protected _dot(
    d: string,
    colour: string,
    power: number | null,
    forward = true,
    r = 3.2,
    train?: { period: number; begin: number; travel: number; radius?: number },
  ): SVGTemplateResult {
    if (power === null || Math.abs(power) < MIN_FLOW_W) return svg``;
    const bySize = this._bySize;
    const radius = train?.radius ?? (bySize ? Math.max(1.7, dotRadius(power, this._max) * (r / 3.2)) : r);
    if (train) {
      // a wagon of a train: rides for `travel` s, then waits hidden for the next train
      const t = (train.travel / train.period).toFixed(4);
      const timing = { dur: `${train.period.toFixed(2)}s`, begin: `${train.begin.toFixed(2)}s` };
      return this._orb(
        radius,
        colour,
        svg`<animateMotion dur=${timing.dur} begin=${timing.begin} repeatCount="indefinite" calcMode="linear" rotate="auto"
            keyPoints="0;1;1" keyTimes=${`0;${t};1`} path=${d} />
          <animate attributeName="opacity" dur=${timing.dur} begin=${timing.begin} repeatCount="indefinite"
            calcMode="discrete" values="1;0" keyTimes=${`0;${t}`} />`,
        true,
      );
    }
    const dur = this._dotDuration(d, power);
    return this._orb(
      radius,
      colour,
      svg`<animateMotion dur=${`${dur.toFixed(2)}s`} repeatCount="indefinite" calcMode="linear"
        rotate=${forward ? "auto" : "auto-reverse"}
        keyPoints=${forward ? "0;1" : "1;0"} keyTimes="0;1" path=${d} />`,
    );
  }

  /** Seconds a (non-train) dot needs for path `d`; looks use it to sync their own effects. */
  protected _dotDuration(d: string, power: number): number {
    return this._bySize ? Math.max(0.6, pathLength(d) / DOT_SPEED) : flowDuration(power, this._max);
  }

  /** Draws a moving dot; `motion` holds its animation elements. Looks override this. */
  protected _orb(radius: number, colour: string, motion: SVGTemplateResult, hidden = false): SVGTemplateResult {
    return svg`<circle r=${radius} fill=${colour} opacity=${hidden ? "0" : nothing}>${motion}</circle>`;
  }

  /** Drawn last, on top of everything (nothing in the classic look). */
  protected _overlay(): SVGTemplateResult {
    return svg``;
  }

  /** Extra <defs> (filters, gradients) for alternative looks. */
  protected _defs(): SVGTemplateResult {
    return svg``;
  }

  /** Background of a box; looks override this. */
  protected _panel(x: number, y: number, w: number, h: number, colour: string): SVGTemplateResult {
    return svg`<rect x=${x} y=${y} width=${w} height=${h} rx="4" fill="none" stroke=${colour} stroke-width="1" />`;
  }

  protected _box(x: number, y: number, w: number, h: number, colour: string, text: string, size = 12): SVGTemplateResult {
    return svg`
      ${this._panel(x, y, w, h, colour)}
      <text x=${x + w / 2} y=${y + h / 2 + size * 0.35} text-anchor="middle" class="val" font-size=${this._fs(size)}>${text}</text>
    `;
  }

  protected _icon(path: string, x: number, y: number, size: number, colour: string): SVGTemplateResult {
    return svg`<path d=${path} fill=${colour} transform=${`translate(${x} ${y}) scale(${size / 24})`} />`;
  }

  // -- sections ---------------------------------------------------------------
  protected _solar(): SVGTemplateResult {
    const L = this._layout!;
    const c = this._c.solar;
    const total = this._own("solar_power");
    const strings = L.solar.strings.slice(0, 4);
    const pos = this._stringPos;
    const by = this._pvBoxY;
    const [bx, bw] = this._pvBox;
    const lx = bx + bw + 6; // labels right of the box
    const today = kwh(this._s(L.solar.today));
    const rest = kwh(this._s(L.solar.forecast_remaining));
    const routes = strings.map((_s, i) => this._stringRoute(pos[i][0], pos[i][1]));
    const through = strings.length > 0 && routes.every((r) => r !== null);
    const line = `M ${this._solarX} ${by + 26} V ${this._solarY} H ${this._invX}`;
    return svg`
      ${this._solarBack()}
      ${through
        ? // the line first, the strings' dots on it, tiles and box on top (dots pass below the glass)
          svg`${this._flow(line, c, total, true, false)}
            ${this._trainDots("pv", c, strings.map((s, i) => ({ route: routes[i]!, w: this._w(s.entity), forward: true })))}`
        : nothing}
      ${strings.map((s, i) => {
        const [x, y] = pos[i];
        return this._tap(s.entity, this._stringTile(x, y, s.entity, c));
      })}
      ${this._solarIcon(c)}
      ${this._tap(L.entities.solar_power, this._box(bx, by, bw, 26, c, fmtPower(total, this._loc), 13))}
      <text x=${lx} y=${by + 9} class="lbl">PV gesamt</text>
      ${today !== null ? svg`<text x=${lx} y=${by + 22} class="small" fill=${c}>${fmtEnergy(today, this._loc)} heute</text>` : nothing}
      ${rest !== null ? svg`<text x=${lx} y=${by + 34} class="small">Rest ${fmtEnergy(rest, this._loc)}</text>` : nothing}
      ${through ? nothing : this._flow(line, c, total, true)}
    `;
  }

  /** Drawn first in the PV section, below the string tiles (nothing in the classic look). */
  protected _solarBack(): SVGTemplateResult {
    return svg``;
  }

  /** Symbol next to the PV strings. */
  protected _solarIcon(c: string): SVGTemplateResult {
    return this._icon(ICON_SOLAR, 152, 34, 26, c);
  }

  /** One PV string: value box with its name below (tile at x, y; 60 x 38 available). */
  protected _stringTile(x: number, y: number, entity: string, c: string): SVGTemplateResult {
    return svg`${this._box(x, y, 60, 24, c, fmtPower(this._w(entity), this._loc), 11)}
      <text x=${x} y=${y + 35} class="lbl">${shortName(this._name(entity), 14)}</text>`;
  }

  /** Batteries in display order: those with a backup output go to the right. */
  protected _displayBatteries() {
    const bats = this._layout?.batteries ?? [];
    const plain = bats.filter((b) => !(b.backup ?? []).length);
    const backup = bats.filter((b) => (b.backup ?? []).length);
    const ordered = [...plain, ...backup];
    const slots = batterySlots(ordered.length);
    const shift = this._batteryShift(ordered.length);
    const down = this._storeY - STORE_Y; // batteries keep their distance to the storage box
    return ordered.map((b, i) => ({ ...b, ...slots[i], cx: slots[i].cx + shift, top: slots[i].top + down, index: i }));
  }

  protected _batteries(): SVGTemplateResult {
    const L = this._layout!;
    const c = this._c.battery;
    if (!L.batteries.length) return svg``;
    const soc = this._own("battery_soc");
    const energy = this._own("battery_energy");
    const shown = this._displayBatteries();
    const n = shown.length;
    // what flows on the storage lines (see _lineFlow)
    const nets = shown.map((b) => this._lineFlow(b.name, num(this._s(b.power))));
    const anyBackup = shown.some((b) => b.backup_only || (b.backup ?? []).length);
    const total = anyBackup
      ? nets.reduce<number | null>((s, w) => (w === null ? s : (s ?? 0) + w), null)
      : this._own("battery_power");
    // flush with the outer edges of the battery boxes below
    const storeX = Math.min(...shown.map((b) => b.cx - b.w / 2));
    const storeW = Math.max(...shown.map((b) => b.cx + b.w / 2)) - storeX;
    // feed from the inverter: straight down if it is above the box, else with a knee
    const [invCx, invB] = this._invBottom;
    const sy = this._storeY;
    const feedX = Math.min(Math.max(invCx, storeX + 10), storeX + storeW - 10);
    const feed =
      feedX === invCx ? `M ${invCx} ${invB} V ${sy}` : `M ${invCx} ${invB} V ${sy - 5} H ${feedX} V ${sy}`;
    // looks may let each battery's dots run the whole way from the inverter
    // through the storage box (see _batteryRoute) instead of stopping at the box
    const routes = shown.map((b) => this._batteryRoute(b.cx, b.top));
    const through = routes.every((r) => r !== null);
    return svg`
      ${shown.map((b, i) => {
        const { cx, top, w } = b;
        const small = w < 54;
        const p = num(this._s(b.power));
        const s = num(this._s(b.soc));
        const fill = Math.max(0, Math.min(100, s ?? 0));
        // the storage box spans all batteries: every line drops straight down
        const path = `M ${cx} ${sy + STORE_H} V ${top}`;
        const label = p === null ? "" : p > MIN_FLOW_W ? "lädt" : p < -MIN_FLOW_W ? "entlädt" : "ruht";
        const net = nets[i];
        return svg`
          ${this._flow(path, c, net, (net ?? 0) > 0, !through)}
          ${this._tap(b.power, this._batteryWidget(b.name, cx, top, w, p, s, label, c, b.capacity_kwh))}
        `;
      })}
      ${this._flow(feed, c, total, (total ?? 0) > 0, !through)}
      ${through
        ? this._trainDots(
            "battery",
            c,
            shown.map((_b, i) => ({ route: routes[i]!, w: nets[i], forward: (nets[i] ?? 0) > 0 })),
          )
        : nothing}
      ${this._tap(L.entities.battery_soc, this._box(
        storeX,
        sy,
        storeW,
        STORE_H,
        c,
        [
          `${storeW >= 120 ? "Speicher " : ""}${fmtPercent(soc, this._loc)}`,
          energy !== null && storeW >= 80 ? fmtEnergy(energy, this._loc) : "",
          // what all batteries together take in or give out right now
          total !== null && Math.abs(total) >= MIN_FLOW_W && storeW >= 110
            ? `${storeW >= 200 ? (total > 0 ? "lädt " : "entlädt ") : total > 0 ? "+" : "−"}${fmtPower(Math.abs(total), this._loc)}`
            : "",
        ]
          .filter(Boolean)
          .join(" · "),
        storeW >= 150 ? 11 : 10,
      ))}
    `;
  }

  /** One battery below the storage box: widget spans top .. top + 104 around cx. */
  protected _batteryWidget(
    name: string,
    cx: number,
    top: number,
    w: number,
    p: number | null,
    s: number | null,
    label: string,
    c: string,
    _capacity: number | null = null,
  ): SVGTemplateResult {
    const small = w < 54;
    const fill = Math.max(0, Math.min(100, s ?? 0));
    return svg`
      ${this._box(cx - w / 2, top, w, 22, c, fmtPower(p === null ? null : Math.abs(p), this._loc), small ? 10 : 11)}
      <text x=${cx} y=${top + 32} text-anchor="middle" class="tiny">${label}</text>
      <rect x=${cx - 9} y=${top + 42} width="18" height="32" rx="3" fill="none" stroke=${c} />
      <rect x=${cx - 4} y=${top + 39} width="8" height="3" fill=${c} />
      <rect x=${cx - 7} y=${top + 72 - (28 * fill) / 100} width="14" height=${(28 * fill) / 100} rx="1" fill=${c} fill-opacity="0.7" />
      <text x=${cx} y=${top + 91} text-anchor="middle" class="soc">${fmtPercent(s, this._loc)}</text>
      <text x=${cx} y=${top + 104} text-anchor="middle" class="tiny">${shortName(name, small ? 10 : 14)}</text>
    `;
  }

  protected _inverter(): SVGTemplateResult {
    const c = this._c.inverter;
    const x = this._invX;
    const y = this._invY;
    return svg`
      <rect x=${x} y=${y} width="60" height="60" rx="6" fill="none" stroke=${c} stroke-width="1.5" />
      <path d=${`M ${x + 12} ${y + 40} q 6 -12 12 0 t 12 0`} fill="none" stroke=${c} stroke-width="1.5" />
      <line x1=${x + 12} y1=${y + 20} x2=${x + 48} y2=${y + 20} stroke=${c} stroke-width="1.5" />
    `;
  }

  /**
   * All load groups on the right, top to bottom, with their positions and the
   * feed path (trunk) from their source: house, inverter backup output or a
   * battery's own output (one group per battery).
   */
  protected _groups(): LoadGroup[] {
    const L = this._layout;
    if (!L) return [];
    const c = this._c;
    const bracket = BRACKET_X;
    const groups: LoadGroup[] = [];
    const R = this._rowH;
    const mid = R / 2 - 1; // middle of a row (10 at the classic 22)
    let y = this._groupsTop; // baseline of the first title
    const add = (
      title: string,
      colour: string,
      loads: (Load & { label?: string; tip?: string; more?: ListLoad["more"] })[],
      power: number | null,
      trunk: (rowY: number, lineY: number) => string,
      source?: string,
      // Where the feed may leave its source: preferred height and allowed range.
      // The first row goes to the preferred height if there is room; if the
      // list above pushes it down, the exit follows within the range so the
      // line still runs straight.
      exit?: { pref: number; lo: number; hi: number },
      // path that leads into the trunk's start, for dots that start earlier
      lead?: (lineY: number) => string | null,
    ) => {
      if (!loads.length) return;
      // long lists show only the biggest daily consumers until unfolded
      const limit = this._listLimit(title);
      const foldable = limit !== null && loads.length > limit;
      const expanded = this._expanded.has(title);
      let shown = loads;
      if (foldable) {
        const today = (l: Load) => num(this._s(l.today)) ?? 0;
        const keep = new Set([...loads].sort((a, b) => today(b) - today(a)).slice(0, limit));
        const hidden = loads.filter((l) => !keep.has(l));
        const sumToday = hidden.reduce<number | null>((sum, l) => {
          const v = num(this._s(l.today));
          return v === null ? sum : (sum ?? 0) + v;
        }, null);
        // the folded loads as one row with their sums; unfolded only "− weniger"
        const moreRow = {
          entity: "",
          today: null,
          label: expanded ? "− weniger" : `+ ${hidden.length} weitere`,
          more: { group: title, power: expanded ? null : this._sumW(hidden), today: expanded ? null : sumToday },
        };
        shown = [...(expanded ? loads : loads.filter((l) => keep.has(l))), moreRow];
      }
      const rows = rowCount(shown);
      const y0 = Math.max(y + 6, exit ? exit.pref - 10 : 0);
      const lineY = exit ? Math.min(Math.max(y0 + mid, exit.lo), exit.hi) : y0 + mid;
      const path = trunk(y0 + mid, lineY);
      const before = lead?.(lineY);
      // the lead ends where the trunk starts, so the trunk continues without its move
      const route = before ? `${before} ${path.replace(/^M\s+\S+\s+\S+\s*/, "")}` : undefined;
      groups.push({
        title,
        colour,
        power,
        titleY: y0 - 6,
        y0,
        trunk: path,
        loads: shown.map((l) => ({ ...l, trunk: path, route, source })),
        all: loads,
        rows,
        more: foldable ? { hidden: loads.length - shown.length, expanded } : undefined,
      });
      y = y0 + rows * R + this._groupGap;
    };
    const fixed: (Load & { label?: string; tip?: string })[] = [...L.loads.fixed];
    const rest = L.entities.unmeasured_power;
    if (this._unmeasuredInList && rest) {
      fixed.push({
        entity: rest,
        today: L.unmeasured_today ?? null,
        label: "Nicht erfasst",
        tip: "Nicht erfasst · Hausverbrauch ohne die gemessenen Verbraucher",
      });
    }
    const lane = this._laneFinder();
    const hy = this._houseY;
    add(
      "Grundlast",
      c.home,
      fixed,
      this._sumW(fixed),
      (t) => `M 285 ${hy + 9} H ${lane(300, hy + 9, t)} V ${t} H ${bracket}`,
      undefined,
      undefined,
      () => this._houseLead(hy + 9),
    );
    add(
      "Zusätzlich",
      c.flexible,
      L.loads.flexible,
      this._sumW(L.loads.flexible),
      (t) => `M 285 ${hy + 19} H ${lane(306, hy + 19, t)} V ${t} H ${bracket}`,
      undefined,
      undefined,
      () => this._houseLead(hy + 19),
    );
    // Wallbox / car: fed from the inverter's right side, straight if there is room
    const wb = L.wallbox;
    if (wb && this._wallboxInList) {
      const soc = num(this._s(wb.soc ?? undefined));
      const label = soc !== null ? `${wb.name} Auto ${fmtPercent(soc, this._loc)}` : wb.name;
      add(
        "Wallbox",
        wb.flexible ? c.flexible : c.home,
        [{ entity: wb.power, today: wb.today, label, tip: `${wb.name} · ${wb.flexible ? "Zusatzverbraucher" : "Grundlast"}` }],
        this._w(wb.power),
        (t, ly) => `M ${this._invX + 60} ${ly} H ${LANE_WALLBOX} V ${t} H ${bracket}`,
        undefined,
        { pref: this._invY + WALLBOX_LINE_DY, lo: this._invY + 6, hi: this._invY + 56 }, // anywhere on the inverter's right edge
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
        // red colour + feed line from the battery mark it as backup; with two
        // backup batteries the name tells them apart
        feeds.length > 1 ? `Notstrom – ${shortName(b.name, 10)}` : "Notstrom",
        c.backup,
        b.backup ?? [],
        this._sumW(b.backup ?? []),
        (t, ly) => `M ${this._batteryOutX(b.cx, b.w)} ${ly} H ${lane} V ${t} H ${bracket}`,
        b.name,
        exit,
        (ly) => this._batteryLead(b.cx, b.top, b.w, ly),
      );
    });
    return groups;
  }

  /** Baseline of the first load group's title. */
  protected get _groupsTop(): number {
    return 22;
  }

  /** Drawn above all load groups (nothing in the classic look); `home` = total consumption. */
  protected _listsHeader(_home: number | null): SVGTemplateResult {
    return svg``;
  }

  /** Show "heute" / "24 h" above the energy column of the load lists. */
  protected get _periodLabel(): boolean {
    return true;
  }

  /** Draw a load group's feed as part of its list's pipes (same look, clean joins). */
  protected get _pipeTrunk(): boolean {
    return false;
  }

  /** Where a load list's branch line ends at its row. */
  protected get _rowEntryX(): number {
    return LOAD_X0 - 3;
  }

  /** Lines inside a load list: the bracket with the rows' branches (one path),
   *  or the dashed link from a load to a load contained in it. */
  protected _branch(d: string, colour: string, kind: "row" | "child"): SVGTemplateResult {
    return svg`<path d=${d} fill="none" stroke=${colour} stroke-width="1" stroke-opacity="0.6"
      stroke-dasharray=${kind === "child" ? "2 2" : nothing} />`;
  }

  /** How many loads a group shows before it folds the rest away (by title);
   *  null = all. */
  protected _listLimit(_title: string): number | null {
    return null;
  }

  /** Sort idle loads by today's energy (after the running ones) instead of by name. */
  protected get _idleByEnergy(): boolean {
    return false;
  }

  protected _toggleList(title: string): void {
    const next = new Set(this._expanded);
    if (next.has(title)) next.delete(title);
    else next.add(title);
    this._expanded = next;
  }

  /**
   * Finds a free vertical lane for a feed from the house down (or up) to a
   * load list: the preferred x if the line from y1 to y2 passes no battery and
   * not the storage box, otherwise the next free lane to the right of them,
   * left of the lanes the battery (backup) and wallbox feeds use.
   */
  protected _laneFinder(): (pref: number, y1: number, y2: number) => number {
    const bats = this._displayBatteries();
    const boxes = bats.map((b) => ({ x0: b.cx - b.w / 2 - 3, x1: b.cx + b.w / 2 + 3, y0: b.top - 2, y1: b.top + 110 }));
    if (bats.length) {
      const x0 = Math.min(...bats.map((b) => b.cx - b.w / 2)) - 3;
      const x1 = Math.max(...bats.map((b) => b.cx + b.w / 2)) + 3;
      boxes.push({ x0, x1, y0: this._storeY - 3, y1: this._storeY + STORE_H + 3 });
    }
    const reserved = [LANE_BATTERY_1, LANE_BATTERY_2, ...(this._layout?.wallbox && this._wallboxInList ? [LANE_WALLBOX] : [])];
    const used: number[] = [];
    const free = (x: number, y1: number, y2: number) => {
      const [lo, hi] = y1 < y2 ? [y1, y2] : [y2, y1];
      return (
        !boxes.some((b) => x >= b.x0 && x <= b.x1 && hi >= b.y0 && lo <= b.y1) &&
        !reserved.some((r) => Math.abs(r - x) < 4) &&
        !used.some((u) => Math.abs(u - x) < 5)
      );
    };
    return (pref, y1, y2) => {
      let x = pref;
      while (!free(x, y1, y2) && x < BRACKET_X - 8) x += 3;
      if (x >= BRACKET_X - 8) x = pref; // no free lane: keep the usual one
      used.push(x);
      return x;
    };
  }

  /** Vertical space between two load groups. */
  protected get _groupGap(): number {
    return 16;
  }

  protected _sumW(loads: Load[]): number | null {
    return loads.reduce<number | null>((s, l) => {
      const w = this._w(l.entity);
      return w === null ? s : (s ?? 0) + w;
    }, null);
  }

  /** One group as a vertical list, biggest consumer on top: name, power, energy.
   *  Every row knows the feed path (`trunk`) from its source; a running load
   *  gets its own dot that travels the trunk and on to its row. */
  protected _loadList(loads: ListLoad[], y0: number, colour: string): SVGTemplateResult {
    const R = this._rowH;
    const mid = R / 2 - 1; // middle of a row
    // classic: by power, then by name; looks may put running loads first (by
    // power) and the idle ones after them by today's energy
    const isOn = (x: { w: number | null }) => x.w !== null && Math.abs(x.w) >= MIN_FLOW_W;
    const energy = (x: { today: string | null }) => num(this._s(x.today)) ?? 0;
    const byPower = <T extends { w: number | null; name: string; today: string | null }>(a: T, b: T) =>
      this._idleByEnergy
        ? Number(isOn(b)) - Number(isOn(a)) ||
          (isOn(a) ? b.w! - a.w! : energy(b) - energy(a)) ||
          a.name.localeCompare(b.name)
        : (b.w ?? -Infinity) - (a.w ?? -Infinity) || a.name.localeCompare(b.name);
    const mains = loads
      .map((l) => ({ ...l, w: l.more ? l.more.power : this._w(l.entity), name: l.label ?? this._name(l.entity) }))
      .sort((a, b) => Number(!!a.more) - Number(!!b.more) || byPower(a, b));
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
    const entry = this._rowEntryX;
    // a look may run the group's power as one train up to the bracket; the
    // wagons then start there and split off to their rows
    const feedRoute = loads[0]?.route ?? loads[0]?.trunk;
    const feedProbe = feedRoute ? this._feedTrain(feedRoute, 0, colour) : null;
    const split = feedProbe !== null;
    const path = (l: ListLoad, i: number) =>
      split ? `M ${BRACKET_X} ${y0 + mid} V ${y0 + i * R + mid} H ${entry}` : `${l.route ?? l.trunk} V ${y0 + i * R + mid} H ${entry}`;
    // a contained load's wagon rides into its parent's station and on along
    // the dashed connector to its own row
    const childPath = (l: Row, i: number) =>
      `${path(l, l.parentRow ?? 0)} H ${LOAD_X0 + 4} V ${y0 + i * R + mid} H ${LOAD_X0 + 10}`;
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
    // A look may split a load's wagon into balls that count its power; then
    // the whole train runs big balls first (stable in row order), so the
    // power can be read off the train.
    const speed = this._wagonSpeed;
    const parts = running.flatMap(({ l, i, w }) =>
      (this._wagonBalls(w!, colour, l.source) ?? [undefined]).map((ball) => ({ l, i, radius: ball?.r, tint: ball?.colour })),
    );
    if (parts.some((p) => p.radius !== undefined)) parts.sort((a, b) => (b.radius ?? 0) - (a.radius ?? 0));
    let pos = 0;
    const wagons = parts.map(({ l, i, radius, tint }, k) => {
      if (k) pos += radius === undefined ? TRAIN_GAP : (parts[k - 1].radius ?? 0) + radius + 2.5;
      return { i, radius, tint, begin: pos / speed, travel: pathLength(l.child ? childPath(l, i) : path(l, i)) / speed };
    });
    const period = Math.max(1, ...wagons.map((w) => w.begin + w.travel)) + TRAIN_PAUSE;
    const train = new Map<number, { period: number; begin: number; travel: number; radius?: number; tint?: string }[]>();
    for (const w of wagons) {
      train.set(w.i, [...(train.get(w.i) ?? []), { period, begin: w.begin, travel: w.travel, radius: w.radius, tint: w.tint }]);
    }
    const wagonDots = (d: string, w: number | null, i: number) =>
      (train.get(i) ?? []).map((t) => this._dot(d, t.tint ?? colour, w, true, 2.4, t));
    const feedPower = running.reduce((s, { w }) => s + Math.max(w ?? 0, 0), 0);
    const feedDots =
      split && feedRoute && feedPower >= MIN_FLOW_W ? this._feedTrain(feedRoute, feedPower, colour, loads[0]?.source) : nothing;
    const lastMain = rows.reduce((last, r, i) => (r.child ? last : i), 0);
    // the bracket and all row branches as one path, so their joins are clean
    // looks may draw the group's feed as part of it too (one pipe from the source)
    const feed = this._pipeTrunk ? loads[0]?.trunk : undefined;
    const pipes = [
      ...(feed ? [feed] : []),
      `M ${BRACKET_X} ${feed ? y0 + mid : y0 + 4} V ${y0 + lastMain * R + mid}`,
      ...rows.flatMap((r, i) => (r.child ? [] : [`M ${BRACKET_X} ${y0 + i * R + mid} H ${entry}`])),
    ].join(" ");
    return svg`
      ${this._branch(pipes, colour, "row")}
      ${feedDots}
      ${rows.map((l, i) => {
        const y = y0 + i * R;
        const idle = l.w === null || Math.abs(l.w) < MIN_FLOW_W;
        if (l.child) {
          const top = y0 + (l.parentRow ?? 0) * R + R - 3;
          const tip = `${l.name} · enthalten in ${rows[l.parentRow ?? 0].name}`;
          return svg`
            ${this._branch(`M ${LOAD_X0 + 4} ${top} V ${y + mid} H ${LOAD_X0 + 10}`, colour, "child")}
            ${this._bySize ? wagonDots(childPath(l, i), l.w, i) : split ? this._feedTrain(childPath(l, i), l.w ?? 0, colour, l.source) : nothing}
            <g opacity=${idle ? 0.45 : 0.85} class="tap" data-entity=${l.entity}>
              ${this._nameBox(l.name, y, colour, tip, 12)}
              ${this._valueCell(LOAD_XP - LOAD_PW, y + 1, LOAD_PW, R - 4, colour, fmtPower(l.w, this._loc), 9, "power")}
            </g>
            ${this._tap(l.today, this._valueCell(LOAD_X1 - LOAD_EW, y + 1, LOAD_EW, R - 4, colour, fmtEnergy(num(this._s(l.today)), this._loc), 8.5, "energy"))}`;
        }
        // a look that splits the feed colours each load's train by where its power comes from
        const dots = this._bySize
          ? wagonDots(path(l, i), own(i), i)
          : split
            ? this._feedTrain(path(l, i), (l.more ? l.w : own(i)) ?? 0, colour, l.source)
            : this._dot(path(l, i), colour, l.w, true, 2.4);
        if (l.more) {
          const group = l.more.group;
          return svg`
            ${dots}
            <g class="more" opacity=${l.more.power !== null && idle ? 0.55 : 1} @click=${() => this._toggleList(group)}>
              <rect x=${LOAD_X0 - 8} y=${y} width=${LOAD_X1 - LOAD_X0 + 8} height=${R} fill="transparent" />
              <text x=${LOAD_X0 + 2} y=${y + R * 0.62} class="small" fill=${colour}>${l.name}</text>
              ${l.more.power !== null
                ? this._valueCell(LOAD_XP - LOAD_PW, y + 1, LOAD_PW, R - 4, colour, fmtPower(l.w, this._loc), 9, "power")
                : nothing}
              ${l.more.today !== null
                ? this._valueCell(LOAD_X1 - LOAD_EW, y + 1, LOAD_EW, R - 4, colour, fmtEnergy(l.more.today, this._loc), 8.5, "energy")
                : nothing}
            </g>`;
        }
        const tip = l.tip ?? (l.source ? `${l.name} · gespeist von ${l.source}` : l.name);
        return svg`
          ${dots}
          <g opacity=${idle ? 0.45 : 1} class="tap" data-entity=${l.entity}>
            ${this._nameBox(l.name, y, colour, tip)}
            ${this._valueCell(LOAD_XP - LOAD_PW, y + 1, LOAD_PW, R - 4, colour, fmtPower(l.w, this._loc), 9, "power")}
          </g>
          ${this._tap(l.today, this._valueCell(LOAD_X1 - LOAD_EW, y + 1, LOAD_EW, R - 4, colour, fmtEnergy(num(this._s(l.today)), this._loc), 8.5, "energy"))}`;
      })}
    `;
  }

  /** Power or energy of one list row. */
  protected _valueCell(
    x: number,
    y: number,
    w: number,
    h: number,
    colour: string,
    text: string,
    size: number,
    _kind: "power" | "energy",
  ): SVGTemplateResult {
    return this._box(x, y, w, h, colour, text, size);
  }

  /** Name of a load in a rounded box; long names wrap to two smaller lines. */
  protected _nameBox(name: string, y: number, colour: string, tooltip = name, indent = 0): SVGTemplateResult {
    const x = LOAD_X0 - 2 + indent;
    const w = LOAD_XP - LOAD_PW - 4 - x;
    const { lines, small } = indent ? fitLabel(name, 9, 12) : fitLabel(name, 11, 15);
    return svg`<g>
      <title>${tooltip}</title>
      <rect x=${x} y=${y + 1} width=${w} height="18" rx="4" fill="none" stroke=${colour} stroke-width="1" />
      ${small
        ? svg`<text x=${x + 4} y=${y + 9} class="name" font-size=${this._fs(7.5)}>${lines[0]}</text>
              <text x=${x + 4} y=${y + 17} class="name" font-size=${this._fs(7.5)}>${lines[1] ?? ""}</text>`
        : svg`<text x=${x + 4} y=${y + 13.5} class="name" font-size=${this._fs(10)}>${lines[0]}</text>`}
    </g>`;
  }

  protected _groupTitle(y: number, colour: string, title: string, power: number | null, loads: Load[]): SVGTemplateResult {
    const today = loads.reduce<number | null>((sum, l) => {
      const v = num(this._s(l.today));
      return v === null ? sum : (sum ?? 0) + v;
    }, null);
    return svg`
      <text x=${BRACKET_X} y=${y} class="small grp" fill=${colour}
        >${shortName(title, 15)}${title.length > 15 ? svg`<title>${title}</title>` : nothing}</text>
      <text x=${LOAD_XP - LOAD_PW / 2} y=${y} text-anchor="middle" class="small grp" fill=${colour}>${fmtPower(power, this._loc)}</text>
      <text x=${LOAD_X1 - LOAD_EW / 2} y=${y} text-anchor="middle" class="small grp" fill=${colour}>${fmtEnergy(today, this._loc)}</text>`;
  }

  /** Total svg height needed for the load lists and the batteries. */
  protected get _viewH(): number {
    if (!this._layout) return VIEW_H;
    const groups = this._groups();
    const last = groups[groups.length - 1];
    const lists = last ? last.y0 + last.rows * this._rowH + 8 : 0;
    const shown = this._displayBatteries();
    const batBottom = shown.length ? Math.max(...shown.map((b) => b.top)) + this._batteryTail : 0;
    return Math.max(this._minViewH, lists, batBottom);
  }

  /** House symbol above the house value (area 226..274 x 16..64). */
  protected _houseIcon(c: string): SVGTemplateResult {
    return this._icon(ICON_HOME, 226, 16, 48, c);
  }

  /** Background behind a load group (none in the classic look). */
  protected _groupPanel(_g: LoadGroup): SVGTemplateResult {
    return svg``;
  }

  /** Small symbol next to a group title. */
  protected _groupIcon(g: LoadGroup): SVGTemplateResult {
    return g.title === "Wallbox" ? this._icon(ICON_CAR, BRACKET_X + 46, g.titleY - 11, 14, g.colour) : svg``;
  }

  protected _home(): SVGTemplateResult {
    const L = this._layout!;
    const c = this._c.home;
    const home = this._own("home_power");
    const rest = this._own("unmeasured_power");
    const groups = this._groups();
    const houseLine = `M ${this._invTop[0]} ${this._invTop[1]} V ${Math.min(152, this._invTop[1] - 8)} H 250 V ${this._houseY + 26}`;
    // house value and line: what the house net supplies, without the backup loads
    // the batteries feed directly
    const houseNet = home === null ? null : Math.max(home - this._offGridLoads, 0);

    return svg`
      ${this._houseIcon(c)}
      ${rest !== null && !this._unmeasuredInList
        ? svg`<text x="256" y=${this._houseY + 42} class="tiny">nicht erfasst</text>
              <text x="256" y=${this._houseY + 52} class="tiny val">${fmtPower(rest, this._loc)}</text>`
        : nothing}
      ${this._flow(houseLine, c, houseNet, true, false)}
      ${this._houseDots(this._houseIn() ?? houseLine, c, houseNet)}
      ${this._houseJunction(houseNet)}
      ${groups.length ? this._listsHeader(home) : nothing}
      ${groups.length && this._periodLabel
        ? svg`<text x=${LOAD_X1 - LOAD_EW / 2} y="9" text-anchor="middle" class="tiny">${L.energy_period === "rolling24" ? "24 h" : "heute"}</text>`
        : nothing}
      ${groups.map(
        (g) => svg`
          ${this._groupPanel(g)}
          ${this._groupTitle(g.titleY, g.colour, g.title, g.power, g.all)}
          ${this._groupIcon(g)}
          ${this._pipeTrunk ? nothing : this._flow(g.trunk, g.colour, g.power, true, false)}
          ${this._loadList(g.loads, g.y0, g.colour)}
        `,
      )}
      ${this._tap(L.entities.home_power, this._box(215, this._houseY, 70, 26, c, fmtPower(houseNet, this._loc), 13))}
      <text x="211" y=${this._houseY + 13} text-anchor="end" class="lbl">Haus</text>
      <text x="211" y=${this._houseY + 25} text-anchor="end" class="tiny val">${fmtEnergy(this._houseNetToday, this._loc)}</text>
    `;
  }

  /** Colour of the current price: buying (pale red) or selling (pale green). */
  protected _priceColour(exporting: boolean): string {
    return exporting ? "#4e9e62" : "#cc5a52";
  }

  /** Current grid values: power, direction, price and today's import / export. */
  protected _gridData() {
    const L = this._layout!;
    const grid = this._own("grid_power");
    // Current price: import price while buying (or idle), feed-in tariff while selling.
    const exporting = (grid ?? 0) < -MIN_FLOW_W;
    const cents = exporting
      ? L.grid.export_price
        ? centsPerKwh(this._s(L.grid.export_price))
        : (L.grid.export_price_fixed ?? null)
      : centsPerKwh(this._s(L.grid.price));
    return {
      grid,
      exporting,
      cents,
      label: grid === null ? "" : grid > MIN_FLOW_W ? "Bezug" : exporting ? "Einspeisung" : "",
      power: fmtPower(grid === null ? null : Math.abs(grid), this._loc),
      imp: kwh(this._s(L.grid.import_today)),
      exp: kwh(this._s(L.grid.export_today)),
    };
  }

  protected _grid(): SVGTemplateResult {
    const c = this._c.grid;
    const { grid, exporting, cents, label, power, imp, exp } = this._gridData();
    return svg`
      ${this._flow(`M ${this._invX} ${this._invY + 42} H 84`, c, grid, exporting)}
      ${this._tap(this._layout!.entities.grid_power, svg`${this._panel(10, 192, 74, 40, c)}
        <text x="47" y=${cents === null ? 217 : 209} text-anchor="middle" class="val" font-size=${this._fs(13)}>${power}</text>`)}
      ${cents !== null
        ? svg`<text x="47" y="225" text-anchor="middle" class="tiny" style=${`fill:${this._priceColour(exporting)}`}>${fmtCents(cents, this._loc)}</text>`
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
      return html`<ha-card><div class="msg">Lade Wattrio …</div></ha-card>`;
    }
    const title = this._config?.title;
    return html`
      <ha-card .header=${title ?? nothing}>
        <svg viewBox=${`0 0 ${VIEW_W} ${this._viewH}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Wattrio – Energiefluss"
          @click=${this._onTap}>
          ${this._defs()} ${this._solar()} ${this._batteries()} ${this._inverter()} ${this._home()} ${this._grid()}
          ${this._overlay()}
        </svg>
      </ha-card>
    `;
  }

  static styles: CSSResultGroup = css`
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
    .more,
    .tap {
      cursor: pointer;
    }
    .more:hover text {
      text-decoration: underline;
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
    name: "Wattrio Energiefluss Klassik",
    description: "Wattrio: animierter Energiefluss im klassischen, flachen Look – eingerichtet über die Wattrio-Integration.",
    preview: true,
  });
}
