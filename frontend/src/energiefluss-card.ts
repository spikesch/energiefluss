import { LitElement, css, html, svg, nothing, type PropertyValues, type SVGTemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { UPDATED_EVENT } from "./editor-core";
import "./card-editor";
import {
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
  colours?: Partial<Record<"solar" | "battery" | "grid" | "home" | "flexible" | "inverter", string>>;
}

interface Load {
  entity: string;
  today: string | null;
}

interface Layout {
  entry_id: string;
  title: string;
  energy_period: "midnight" | "rolling24";
  home_today: string | null;
  entities: Record<string, string | null>;
  solar: { strings: { entity: string }[]; today: string | null; forecast_remaining: string | null };
  batteries: { name: string; capacity_kwh: number | null; power: string | null; soc: string | null }[];
  grid: {
    price: string | null;
    export_price: string | null;
    export_price_fixed: number | null;
    import_today: string | null;
    export_today: string | null;
  };
  loads: { fixed: Load[]; flexible: Load[] };
}

const DEFAULT_COLOURS = {
  solar: "#ff9800",
  battery: "#ff69b4",
  grid: "#5490c2",
  home: "#5fb6ad",
  flexible: "#9575cd",
  inverter: "#959595",
};

// Layout: left = PV (top) + grid (bottom); centre column = house, inverter,
// batteries; right = all loads as lists.
const VIEW_W = 530;
// Inverter box: left edge flush with the first battery's power box.
const INV_X = 148;
const INV_CX = INV_X + 30;
const VIEW_H = 400;
const LOAD_X0 = 344; // list: name starts here
const LOAD_XP = 480; // power column (right-aligned)
const LOAD_X1 = 526; // today's energy column (right-aligned)
const LOAD_ROW = 17; // height of one list row
const LOAD_TITLE = 18; // height of a group title
const MIN_FLOW_W = 5;

// mdi icon paths (Material Design Icons, Apache 2.0)
const ICON_HOME = "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z";
const ICON_TOWER =
  "M8.28,5.45L6.5,4.55L7.76,2H16.24L17.5,4.55L15.72,5.45L15,4H9L8.28,5.45M18.62,8H14.09L13.3,5H10.7L9.91,8H5.38L4.1,10.55L5.89,11.44L6.62,10H17.38L18.1,11.44L19.89,10.55L18.62,8M17.77,22H15.7L15.46,21.1L12,15.9L8.53,21.1L8.3,22H6.23L9.12,11H11.19L10.83,12.35L12,14.1L13.16,12.35L12.81,11H14.88L17.77,22M11.4,15L10.5,13.65L9.32,18.13L11.4,15M14.68,18.12L13.5,13.64L12.6,15L14.68,18.12Z";
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
  private _dot(d: string, colour: string, power: number | null, forward = true, r = 3.2): SVGTemplateResult {
    if (power === null || Math.abs(power) < MIN_FLOW_W) return svg``;
    return svg`<circle r=${r} fill=${colour}>
      <animateMotion dur=${`${flowDuration(power, this._max)}s`} repeatCount="indefinite" calcMode="linear"
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

  private _batteries(): SVGTemplateResult {
    const L = this._layout!;
    const c = this._c.battery;
    if (!L.batteries.length) return svg``;
    const soc = this._own("battery_soc");
    const energy = this._own("battery_energy");
    const bats = L.batteries.slice(0, 3);
    // Column centres below the inverter, depending on how many batteries exist.
    const centres = ([[250], [210, 290], [175, 245, 315]] as number[][])[bats.length - 1];
    return svg`
      ${bats.map((b, i) => {
        const cx = centres[i];
        const p = num(this._s(b.power));
        const s = num(this._s(b.soc));
        const fill = Math.max(0, Math.min(100, s ?? 0));
        // own exit point on the inverter's bottom edge + own horizontal level
        const exitX = bats.length === 1 ? INV_CX : INV_CX - 12 + i * 12;
        const level = 240 + i * 5;
        const path = exitX === cx ? `M ${cx} 230 V 258` : `M ${exitX} 230 V ${level} H ${cx} V 258`;
        const label = p === null ? "" : p > MIN_FLOW_W ? "lädt" : p < -MIN_FLOW_W ? "entlädt" : "ruht";
        return svg`
          ${this._flow(path, c, p, (p ?? 0) > 0)}
          ${this._box(cx - 27, 258, 54, 22, c, fmtPower(p === null ? null : Math.abs(p), this._loc), 11)}
          <text x=${cx} y="290" text-anchor="middle" class="tiny">${label}</text>
          <rect x=${cx - 9} y="300" width="18" height="32" rx="3" fill="none" stroke=${c} />
          <rect x=${cx - 4} y="297" width="8" height="3" fill=${c} />
          <rect x=${cx - 7} y=${330 - (28 * fill) / 100} width="14" height=${(28 * fill) / 100} rx="1" fill=${c} fill-opacity="0.7" />
          <text x=${cx} y="349" text-anchor="middle" class="soc">${fmtPercent(s, this._loc)}</text>
          <text x=${cx} y="362" text-anchor="middle" class="tiny">${shortName(b.name, 14)}</text>
        `;
      })}
      <text x="245" y="384" text-anchor="middle" class="small" fill=${c}>
        Speicher ${fmtPercent(soc, this._loc)}${energy !== null ? ` · ${fmtEnergy(energy, this._loc)}` : ""}
      </text>
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

  /** One group as a vertical list: name, current power, energy today.
   *  `trunk` is the feed path from the house; every running load gets its own
   *  dot that travels the trunk and on to its row. */
  private _loadList(loads: Load[], y0: number, colour: string, trunk: string): SVGTemplateResult {
    return svg`
      <line x1=${LOAD_X0 - 8} y1=${y0 + 2} x2=${LOAD_X0 - 8} y2=${y0 + loads.length * LOAD_ROW - 6}
        stroke=${colour} stroke-width="1" stroke-opacity="0.6" />
      ${loads.map((l, i) => {
        const y = y0 + i * LOAD_ROW;
        const w = this._w(l.entity);
        const idle = w === null || Math.abs(w) < MIN_FLOW_W;
        return svg`
          <line x1=${LOAD_X0 - 8} y1=${y + 7} x2=${LOAD_X0 - 3} y2=${y + 7} stroke=${colour} stroke-opacity="0.6" />
          ${this._dot(`${trunk} V ${y + 7} H ${LOAD_X0 - 3}`, colour, w, true, 2.4)}
          <g opacity=${idle ? 0.45 : 1}>
            <text x=${LOAD_X0} y=${y + 10} class="small name">${shortName(this._name(l.entity), 22)}</text>
            <text x=${LOAD_XP} y=${y + 10} text-anchor="end" class="small val">${fmtPower(w, this._loc)}</text>
          </g>
          <text x=${LOAD_X1} y=${y + 10} text-anchor="end" class="small">${fmtEnergy(num(this._s(l.today)), this._loc)}</text>`;
      })}
    `;
  }

  private _groupTitle(y: number, colour: string, title: string, power: number | null, loads: Load[]): SVGTemplateResult {
    const today = loads.reduce<number | null>((sum, l) => {
      const v = num(this._s(l.today));
      return v === null ? sum : (sum ?? 0) + v;
    }, null);
    return svg`
      <text x=${LOAD_X0 - 8} y=${y} class="small grp" fill=${colour}>${title}</text>
      <text x=${LOAD_XP} y=${y} text-anchor="end" class="small grp" fill=${colour}>${fmtPower(power, this._loc)}</text>
      <text x=${LOAD_X1} y=${y} text-anchor="end" class="small grp" fill=${colour}>${fmtEnergy(today, this._loc)}</text>`;
  }

  /** Total svg height needed for the load lists (at least the base height). */
  private get _viewH(): number {
    const L = this._layout;
    if (!L) return VIEW_H;
    let h = 12;
    for (const g of [L.loads.fixed, L.loads.flexible]) {
      if (g.length) h += LOAD_TITLE + g.length * LOAD_ROW + 12;
    }
    return Math.max(VIEW_H, h);
  }

  private _home(): SVGTemplateResult {
    const L = this._layout!;
    const c = this._c.home;
    const cf = this._c.flexible;
    const home = this._own("home_power");
    const rest = this._own("unmeasured_power");
    const fixed = L.loads.fixed;
    const flexible = L.loads.flexible;

    // Non-controllable list on top, controllable list below it.
    const fixedTitleY = 22;
    const fixedY0 = fixedTitleY + 6;
    const flexTitleY = fixed.length ? fixedY0 + fixed.length * LOAD_ROW + 16 : fixedTitleY;
    const flexY0 = flexTitleY + 6;
    const fixedTrunk = `M 285 79 H 300 V ${fixedY0 + 8} H ${LOAD_X0 - 8}`;
    const flexTrunk = `M 285 89 H 306 V ${flexY0 + 8} H ${LOAD_X0 - 8}`;

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
      ${fixed.length || flexible.length
        ? svg`<text x=${LOAD_X1} y="9" text-anchor="end" class="tiny">${L.energy_period === "rolling24" ? "24 h" : "heute"}</text>`
        : nothing}
      ${fixed.length
        ? svg`${this._groupTitle(fixedTitleY, c, "Nicht steuerbar", this._own("fixed_power"), fixed)}
              ${this._flow(fixedTrunk, c, this._own("fixed_power"), true, false)}
              ${this._loadList(fixed, fixedY0, c, fixedTrunk)}`
        : nothing}
      ${flexible.length
        ? svg`${this._groupTitle(flexTitleY, cf, "Steuerbar", this._own("flexible_power"), flexible)}
              ${this._flow(flexTrunk, cf, this._own("flexible_power"), true, false)}
              ${this._loadList(flexible, flexY0, cf, flexTrunk)}`
        : nothing}
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
      ${imp !== null ? svg`<text x="10" y="298" class="small" fill=${c}>↓ ${fmtEnergy(imp, this._loc)} Bezug</text>` : nothing}
      ${exp !== null ? svg`<text x="10" y="312" class="small">↑ ${fmtEnergy(exp, this._loc)} Einspeisung</text>` : nothing}
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
