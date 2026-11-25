import { i as N, e as G, b as y, A as d, a as U, n as R, r as L, U as P, w as Y, c as w, l as j, d as l, f as Z, k, g as u, s as A, h as f, j as z, m as D, o as F } from "./energiefluss-shared-B6IU_vVd.js";
var q = Object.defineProperty, E = ($, t, e, s) => {
  for (var i = void 0, n = $.length - 1, o; n >= 0; n--)
    (o = $[n]) && (i = o(t, e, i) || i);
  return i && q(t, e, i), i;
};
const J = {
  entry_id: "Anlage",
  title: "Titel der Karte (optional)",
  max_power: "Leistung für schnellste Animation"
}, Q = {
  max_power: "Ab dieser Leistung laufen die Punkte am schnellsten. Standard 5000 W."
}, I = class I extends N {
  constructor() {
    super(...arguments), this._instances = [], this._ready = !1;
  }
  setConfig(t) {
    this._config = t;
  }
  async firstUpdated() {
    await G(), this.hass && (this._instances = await this.hass.callWS({ type: "energiefluss/instances" })), this._ready = !0;
  }
  get _entryId() {
    return this._config?.entry_id ?? this._instances[0]?.entry_id;
  }
  _schema() {
    const t = [];
    return this._instances.length > 1 && t.push({
      name: "entry_id",
      selector: {
        select: { mode: "dropdown", options: this._instances.map((e) => ({ value: e.entry_id, label: e.title })) }
      }
    }), t.push(
      { name: "title", selector: { text: {} } },
      { name: "max_power", selector: { number: { min: 500, max: 3e4, step: 100, mode: "box", unit_of_measurement: "W" } } }
    ), t;
  }
  _cardChanged(t) {
    t.stopPropagation();
    const e = { ...this._config, ...t.detail.value };
    for (const s of ["entry_id", "title", "max_power"])
      (e[s] === void 0 || e[s] === "" || e[s] === null) && delete e[s];
    this._config = e, this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: e }, bubbles: !0, composed: !0 }));
  }
  render() {
    return !this._ready || !this._config ? y`<div class="hint">Lade …</div>` : this._instances.length ? y`
      <h2>Karte</h2>
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schema()}
        .computeLabel=${(t) => J[t.name] ?? t.name}
        .computeHelper=${(t) => Q[t.name]}
        @value-changed=${this._cardChanged}
      ></ha-form>
      <h2 class="spaced">Anlage</h2>
      <p class="hint">
        Gilt für alle Karten dieser Anlage. Änderungen hier mit <b>„Anlage speichern“</b> übernehmen – das
        Speichern unten im Dialog speichert nur die Karten-Einstellungen oben.
      </p>
      ${this._entryId ? y`<energiefluss-editor compact .hass=${this.hass} .entryId=${this._entryId}></energiefluss-editor>` : d}
    ` : y`<div class="hint">
        Noch keine Anlage angelegt: Einstellungen → Geräte &amp; Dienste → Integration hinzufügen → „Energiefluss“.
      </div>`;
  }
};
I.styles = U`
    :host {
      display: block;
    }
    h2 {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 500;
    }
    h2.spaced {
      margin-top: 24px;
    }
    .hint {
      margin: 0 0 8px;
      color: var(--secondary-text-color);
      font-size: 13px;
    }
  `;
let p = I;
E([
  R({ attribute: !1 })
], p.prototype, "hass");
E([
  L()
], p.prototype, "_config");
E([
  L()
], p.prototype, "_instances");
E([
  L()
], p.prototype, "_ready");
customElements.get("energiefluss-card-editor") || customElements.define("energiefluss-card-editor", p);
var tt = Object.defineProperty, M = ($, t, e, s) => {
  for (var i = void 0, n = $.length - 1, o; n >= 0; n--)
    (o = $[n]) && (i = o(t, e, i) || i);
  return i && tt(t, e, i), i;
};
const et = {
  solar: "#ff9800",
  battery: "#ff69b4",
  grid: "#5490c2",
  home: "#5fb6ad",
  flexible: "#9575cd",
  inverter: "#959595"
}, st = 530, g = 148, C = g + 30, S = 400, _ = 344, W = 480, O = 526, V = 17, it = 18, v = 5, nt = "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z", rt = "M8.28,5.45L6.5,4.55L7.76,2H16.24L17.5,4.55L15.72,5.45L15,4H9L8.28,5.45M18.62,8H14.09L13.3,5H10.7L9.91,8H5.38L4.1,10.55L5.89,11.44L6.62,10H17.38L18.1,11.44L19.89,10.55L18.62,8M17.77,22H15.7L15.46,21.1L12,15.9L8.53,21.1L8.3,22H6.23L9.12,11H11.19L10.83,12.35L12,14.1L13.16,12.35L12.81,11H14.88L17.77,22M11.4,15L10.5,13.65L9.32,18.13L11.4,15M14.68,18.12L13.5,13.64L12.6,15L14.68,18.12Z", ot = "M4,2H20A2,2 0 0,1 22,4V14A2,2 0 0,1 20,16H15V20H18V22H13V16H11V22H6V20H9V16H4A2,2 0 0,1 2,14V4A2,2 0 0,1 4,2M4,4V8H11V4H4M4,14H11V10H4V14M20,14V10H13V14H20M20,4H13V8H20V4Z", T = class T extends N {
  constructor() {
    super(...arguments), this._loading = !1, this._onUpdated = (t) => {
      const e = t.detail?.entry_id;
      (!e || !this._layout || e === this._layout.entry_id) && (this._layout = void 0, this._loadLayout());
    };
  }
  static getStubConfig() {
    return {};
  }
  /** Visual editor in the dashboard's "edit card" dialog. */
  static getConfigElement() {
    return document.createElement("energiefluss-card-editor");
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(P, this._onUpdated);
  }
  disconnectedCallback() {
    window.removeEventListener(P, this._onUpdated), super.disconnectedCallback();
  }
  setConfig(t) {
    this._config = t, this._layout = void 0;
  }
  getCardSize() {
    return 8;
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" };
  }
  updated(t) {
    (t.has("hass") || t.has("_config")) && this.hass && !this._layout && !this._loading && this._loadLayout();
  }
  async _loadLayout() {
    if (this.hass) {
      this._loading = !0;
      try {
        const t = { type: "energiefluss/config" };
        this._config?.entry_id && (t.entry_id = this._config.entry_id);
        const e = await this.hass.callWS(t);
        this._layout = e.instance, this._error = void 0;
      } catch (t) {
        this._error = t?.message ?? "Energiefluss-Integration nicht gefunden. Bitte unter Einstellungen → Geräte & Dienste einrichten.";
      } finally {
        this._loading = !1;
      }
    }
  }
  // -- state helpers --------------------------------------------------------
  _s(t) {
    return t ? this.hass?.states[t] : void 0;
  }
  _w(t) {
    return Y(this._s(t));
  }
  _own(t) {
    return w(this._s(this._layout?.entities[t]));
  }
  _name(t) {
    return this._s(t)?.attributes.friendly_name ?? t.split(".")[1];
  }
  get _loc() {
    return this.hass?.locale?.language ?? "de";
  }
  get _c() {
    return { ...et, ...this._config?.colours ?? {} };
  }
  get _max() {
    return this._config?.max_power ?? 5e3;
  }
  // -- svg building blocks --------------------------------------------------
  /** A line with an animated dot. `forward` = dot travels along the path direction. */
  _flow(t, e, s, i, n = !0) {
    return l`
      <path d=${t} fill="none" stroke=${e} stroke-width=${j(s, this._max)} stroke-opacity="0.85" />
      ${n ? this._dot(t, e, s, i) : d}
    `;
  }
  /** Only the moving dot (for paths whose line is drawn elsewhere). */
  _dot(t, e, s, i = !0, n = 3.2) {
    return s === null || Math.abs(s) < v ? l`` : l`<circle r=${n} fill=${e}>
      <animateMotion dur=${`${Z(s, this._max)}s`} repeatCount="indefinite" calcMode="linear"
        keyPoints=${i ? "0;1" : "1;0"} keyTimes="0;1" path=${t} />
    </circle>`;
  }
  _box(t, e, s, i, n, o, r = 12) {
    return l`
      <rect x=${t} y=${e} width=${s} height=${i} rx="4" fill="none" stroke=${n} stroke-width="1" />
      <text x=${t + s / 2} y=${e + i / 2 + r * 0.35} text-anchor="middle" class="val" font-size=${r}>${o}</text>
    `;
  }
  _icon(t, e, s, i, n) {
    return l`<path d=${t} fill=${n} transform=${`translate(${e} ${s}) scale(${i / 24})`} />`;
  }
  // -- sections ---------------------------------------------------------------
  _solar() {
    const t = this._layout, e = this._c.solar, s = this._own("solar_power"), i = t.solar.strings.slice(0, 4), n = [
      [10, 10],
      [80, 10],
      [10, 58],
      [80, 58]
    ], o = k(this._s(t.solar.today)), r = k(this._s(t.solar.forecast_remaining));
    return l`
      ${i.map((c, a) => {
      const [h, x] = n[a];
      return l`${this._box(h, x, 60, 24, e, u(this._w(c.entity), this._loc), 11)}
          <text x=${h} y=${x + 35} class="lbl">${A(this._name(c.entity), 14)}</text>`;
    })}
      ${this._icon(ot, 152, 34, 26, e)}
      ${this._box(45, 108, 70, 26, e, u(s, this._loc), 13)}
      <text x="121" y="117" class="lbl">PV gesamt</text>
      ${o !== null ? l`<text x="121" y="130" class="small" fill=${e}>${f(o, this._loc)} heute</text>` : d}
      ${r !== null ? l`<text x="121" y="142" class="small">Rest ${f(r, this._loc)}</text>` : d}
      ${this._flow(`M 80 134 V 185 H ${g}`, e, s, !0)}
    `;
  }
  _batteries() {
    const t = this._layout, e = this._c.battery;
    if (!t.batteries.length) return l``;
    const s = this._own("battery_soc"), i = this._own("battery_energy"), n = t.batteries.slice(0, 3), o = [[250], [210, 290], [175, 245, 315]][n.length - 1];
    return l`
      ${n.map((r, c) => {
      const a = o[c], h = w(this._s(r.power)), x = w(this._s(r.soc)), b = Math.max(0, Math.min(100, x ?? 0)), H = n.length === 1 ? C : C - 12 + c * 12, X = 240 + c * 5, B = H === a ? `M ${a} 230 V 258` : `M ${H} 230 V ${X} H ${a} V 258`, K = h === null ? "" : h > v ? "lädt" : h < -v ? "entlädt" : "ruht";
      return l`
          ${this._flow(B, e, h, (h ?? 0) > 0)}
          ${this._box(a - 27, 258, 54, 22, e, u(h === null ? null : Math.abs(h), this._loc), 11)}
          <text x=${a} y="290" text-anchor="middle" class="tiny">${K}</text>
          <rect x=${a - 9} y="300" width="18" height="32" rx="3" fill="none" stroke=${e} />
          <rect x=${a - 4} y="297" width="8" height="3" fill=${e} />
          <rect x=${a - 7} y=${330 - 28 * b / 100} width="14" height=${28 * b / 100} rx="1" fill=${e} fill-opacity="0.7" />
          <text x=${a} y="349" text-anchor="middle" class="soc">${z(x, this._loc)}</text>
          <text x=${a} y="362" text-anchor="middle" class="tiny">${A(r.name, 14)}</text>
        `;
    })}
      <text x="245" y="384" text-anchor="middle" class="small" fill=${e}>
        Speicher ${z(s, this._loc)}${i !== null ? ` · ${f(i, this._loc)}` : ""}
      </text>
    `;
  }
  _inverter() {
    const t = this._c.inverter;
    return l`
      <rect x=${g} y="170" width="60" height="60" rx="6" fill="none" stroke=${t} stroke-width="1.5" />
      <path d=${`M ${g + 12} 210 q 6 -12 12 0 t 12 0`} fill="none" stroke=${t} stroke-width="1.5" />
      <line x1=${g + 12} y1="190" x2=${g + 48} y2="190" stroke=${t} stroke-width="1.5" />
    `;
  }
  /** One group as a vertical list: name, current power, energy today.
   *  `trunk` is the feed path from the house; every running load gets its own
   *  dot that travels the trunk and on to its row. */
  _loadList(t, e, s, i) {
    return l`
      <line x1=${_ - 8} y1=${e + 2} x2=${_ - 8} y2=${e + t.length * V - 6}
        stroke=${s} stroke-width="1" stroke-opacity="0.6" />
      ${t.map((n, o) => {
      const r = e + o * V, c = this._w(n.entity), a = c === null || Math.abs(c) < v;
      return l`
          <line x1=${_ - 8} y1=${r + 7} x2=${_ - 3} y2=${r + 7} stroke=${s} stroke-opacity="0.6" />
          ${this._dot(`${i} V ${r + 7} H ${_ - 3}`, s, c, !0, 2.4)}
          <g opacity=${a ? 0.45 : 1}>
            <text x=${_} y=${r + 10} class="small name">${A(this._name(n.entity), 22)}</text>
            <text x=${W} y=${r + 10} text-anchor="end" class="small val">${u(c, this._loc)}</text>
          </g>
          <text x=${O} y=${r + 10} text-anchor="end" class="small">${f(w(this._s(n.today)), this._loc)}</text>`;
    })}
    `;
  }
  _groupTitle(t, e, s, i, n) {
    const o = n.reduce((r, c) => {
      const a = w(this._s(c.today));
      return a === null ? r : (r ?? 0) + a;
    }, null);
    return l`
      <text x=${_ - 8} y=${t} class="small grp" fill=${e}>${s}</text>
      <text x=${W} y=${t} text-anchor="end" class="small grp" fill=${e}>${u(i, this._loc)}</text>
      <text x=${O} y=${t} text-anchor="end" class="small grp" fill=${e}>${f(o, this._loc)}</text>`;
  }
  /** Total svg height needed for the load lists (at least the base height). */
  get _viewH() {
    const t = this._layout;
    if (!t) return S;
    let e = 12;
    for (const s of [t.loads.fixed, t.loads.flexible])
      s.length && (e += it + s.length * V + 12);
    return Math.max(S, e);
  }
  _home() {
    const t = this._layout, e = this._c.home, s = this._c.flexible, i = this._own("home_power"), n = this._own("unmeasured_power"), o = t.loads.fixed, r = t.loads.flexible, c = 22, a = c + 6, h = o.length ? a + o.length * V + 16 : c, x = h + 6, b = `M 285 79 H 300 V ${a + 8} H ${_ - 8}`, H = `M 285 89 H 306 V ${x + 8} H ${_ - 8}`;
    return l`
      ${this._icon(nt, 226, 16, 48, e)}
      ${this._box(215, 70, 70, 26, e, u(i, this._loc), 13)}
      <text x="211" y="83" text-anchor="end" class="lbl">Haus</text>
      <text x="211" y="95" text-anchor="end" class="tiny val">${f(w(this._s(t.home_today)), this._loc)}</text>
      ${n !== null ? l`<text x="256" y="112" class="tiny">nicht erfasst</text>
              <text x="256" y="122" class="tiny val">${u(n, this._loc)}</text>` : d}
      ${this._flow(`M ${C} 170 V 152 H 250 V 96`, e, i, !0)}
      ${o.length || r.length ? l`<text x=${O} y="9" text-anchor="end" class="tiny">${t.energy_period === "rolling24" ? "24 h" : "heute"}</text>` : d}
      ${o.length ? l`${this._groupTitle(c, e, "Nicht steuerbar", this._own("fixed_power"), o)}
              ${this._flow(b, e, this._own("fixed_power"), !0, !1)}
              ${this._loadList(o, a, e, b)}` : d}
      ${r.length ? l`${this._groupTitle(h, s, "Steuerbar", this._own("flexible_power"), r)}
              ${this._flow(H, s, this._own("flexible_power"), !0, !1)}
              ${this._loadList(r, x, s, H)}` : d}
    `;
  }
  _grid() {
    const t = this._layout, e = this._c.grid, s = this._own("grid_power"), i = k(this._s(t.grid.import_today)), n = k(this._s(t.grid.export_today)), o = (s ?? 0) < -v, r = o ? t.grid.export_price ? D(this._s(t.grid.export_price)) : t.grid.export_price_fixed ?? null : D(this._s(t.grid.price)), c = s === null ? "" : s > v ? "Bezug" : o ? "Einspeisung" : "", a = u(s === null ? null : Math.abs(s), this._loc);
    return l`
      ${this._flow(`M ${g} 212 H 84`, e, s, o)}
      <rect x="10" y="192" width="74" height="40" rx="4" fill="none" stroke=${e} stroke-width="1" />
      <text x="47" y=${r === null ? 217 : 209} text-anchor="middle" class="val" font-size="13">${a}</text>
      ${r !== null ? l`<text x="47" y="225" text-anchor="middle" class="tiny" fill=${e}>${F(r, this._loc)}</text>` : d}
      <text x="90" y="207" class="tiny">${c}</text>
      ${this._icon(rt, 27, 240, 40, e)}
      ${i !== null ? l`<text x="10" y="298" class="small" fill=${e}>↓ ${f(i, this._loc)} Bezug</text>` : d}
      ${n !== null ? l`<text x="10" y="312" class="small">↑ ${f(n, this._loc)} Einspeisung</text>` : d}
    `;
  }
  // -- render -----------------------------------------------------------------
  render() {
    if (this._error)
      return y`<ha-card><div class="msg">${this._error}</div></ha-card>`;
    if (!this._layout || !this.hass)
      return y`<ha-card><div class="msg">Lade Energiefluss …</div></ha-card>`;
    const t = this._config?.title;
    return y`
      <ha-card .header=${t ?? d}>
        <svg viewBox=${`0 0 ${st} ${this._viewH}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Energiefluss">
          ${this._solar()} ${this._batteries()} ${this._inverter()} ${this._home()} ${this._grid()}
        </svg>
      </ha-card>
    `;
  }
};
T.styles = U`
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
let m = T;
M([
  R({ attribute: !1 })
], m.prototype, "hass");
M([
  L()
], m.prototype, "_config");
M([
  L()
], m.prototype, "_layout");
M([
  L()
], m.prototype, "_error");
customElements.get("energiefluss-card") || customElements.define("energiefluss-card", m);
window.customCards = window.customCards ?? [];
window.customCards.some(($) => $.type === "energiefluss-card") || window.customCards.push({
  type: "energiefluss-card",
  name: "Energiefluss",
  description: "Animierter Energiefluss – konfiguriert über die Energiefluss-Integration.",
  preview: !0
});
export {
  m as EnergieflussCard
};
