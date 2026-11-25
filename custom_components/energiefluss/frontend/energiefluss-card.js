import { i as P, w as S, n as g, A as _, l as X, a as r, f as R, k as H, b as d, s as V, c as f, d as C, e as T, g as B, h as M, j as Y, m as Z, r as E } from "./energiefluss-shared-smNKBC8z.js";
var j = Object.defineProperty, v = (L, t, e, s) => {
  for (var i = void 0, o = L.length - 1, l; o >= 0; o--)
    (l = L[o]) && (i = l(t, e, i) || i);
  return i && j(t, e, i), i;
};
const F = {
  solar: "#ff9800",
  battery: "#ff69b4",
  grid: "#5490c2",
  home: "#5fb6ad",
  flexible: "#9575cd",
  inverter: "#959595"
}, G = 530, u = 148, k = u + 30, I = 400, x = 344, z = 480, O = 526, b = 17, U = 18, m = 5, q = "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z", K = "M8.28,5.45L6.5,4.55L7.76,2H16.24L17.5,4.55L15.72,5.45L15,4H9L8.28,5.45M18.62,8H14.09L13.3,5H10.7L9.91,8H5.38L4.1,10.55L5.89,11.44L6.62,10H17.38L18.1,11.44L19.89,10.55L18.62,8M17.77,22H15.7L15.46,21.1L12,15.9L8.53,21.1L8.3,22H6.23L9.12,11H11.19L10.83,12.35L12,14.1L13.16,12.35L12.81,11H14.88L17.77,22M11.4,15L10.5,13.65L9.32,18.13L11.4,15M14.68,18.12L13.5,13.64L12.6,15L14.68,18.12Z", J = "M4,2H20A2,2 0 0,1 22,4V14A2,2 0 0,1 20,16H15V20H18V22H13V16H11V22H6V20H9V16H4A2,2 0 0,1 2,14V4A2,2 0 0,1 4,2M4,4V8H11V4H4M4,14H11V10H4V14M20,14V10H13V14H20M20,4H13V8H20V4Z", A = class A extends P {
  constructor() {
    super(...arguments), this._loading = !1;
  }
  static getStubConfig() {
    return {};
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
    return S(this._s(t));
  }
  _own(t) {
    return g(this._s(this._layout?.entities[t]));
  }
  _name(t) {
    return this._s(t)?.attributes.friendly_name ?? t.split(".")[1];
  }
  get _loc() {
    return this.hass?.locale?.language ?? "de";
  }
  get _c() {
    return { ...F, ...this._config?.colours ?? {} };
  }
  get _max() {
    return this._config?.max_power ?? 5e3;
  }
  // -- svg building blocks --------------------------------------------------
  /** A line with an animated dot. `forward` = dot travels along the path direction. */
  _flow(t, e, s, i, o = !0) {
    return r`
      <path d=${t} fill="none" stroke=${e} stroke-width=${X(s, this._max)} stroke-opacity="0.85" />
      ${o ? this._dot(t, e, s, i) : _}
    `;
  }
  /** Only the moving dot (for paths whose line is drawn elsewhere). */
  _dot(t, e, s, i = !0, o = 3.2) {
    return s === null || Math.abs(s) < m ? r`` : r`<circle r=${o} fill=${e}>
      <animateMotion dur=${`${R(s, this._max)}s`} repeatCount="indefinite" calcMode="linear"
        keyPoints=${i ? "0;1" : "1;0"} keyTimes="0;1" path=${t} />
    </circle>`;
  }
  _box(t, e, s, i, o, l, n = 12) {
    return r`
      <rect x=${t} y=${e} width=${s} height=${i} rx="4" fill="none" stroke=${o} stroke-width="1" />
      <text x=${t + s / 2} y=${e + i / 2 + n * 0.35} text-anchor="middle" class="val" font-size=${n}>${l}</text>
    `;
  }
  _icon(t, e, s, i, o) {
    return r`<path d=${t} fill=${o} transform=${`translate(${e} ${s}) scale(${i / 24})`} />`;
  }
  // -- sections ---------------------------------------------------------------
  _solar() {
    const t = this._layout, e = this._c.solar, s = this._own("solar_power"), i = t.solar.strings.slice(0, 4), o = [
      [10, 10],
      [80, 10],
      [10, 58],
      [80, 58]
    ], l = H(this._s(t.solar.today)), n = H(this._s(t.solar.forecast_remaining));
    return r`
      ${i.map((c, a) => {
      const [h, $] = o[a];
      return r`${this._box(h, $, 60, 24, e, d(this._w(c.entity), this._loc), 11)}
          <text x=${h} y=${$ + 35} class="lbl">${V(this._name(c.entity), 14)}</text>`;
    })}
      ${this._icon(J, 152, 34, 26, e)}
      ${this._box(45, 108, 70, 26, e, d(s, this._loc), 13)}
      <text x="121" y="117" class="lbl">PV gesamt</text>
      ${l !== null ? r`<text x="121" y="130" class="small" fill=${e}>${f(l, this._loc)} heute</text>` : _}
      ${n !== null ? r`<text x="121" y="142" class="small">Rest ${f(n, this._loc)}</text>` : _}
      ${this._flow(`M 80 134 V 185 H ${u}`, e, s, !0)}
    `;
  }
  _batteries() {
    const t = this._layout, e = this._c.battery;
    if (!t.batteries.length) return r``;
    const s = this._own("battery_soc"), i = this._own("battery_energy"), o = t.batteries.slice(0, 3), l = [[250], [210, 290], [175, 245, 315]][o.length - 1];
    return r`
      ${o.map((n, c) => {
      const a = l[c], h = g(this._s(n.power)), $ = g(this._s(n.soc)), p = Math.max(0, Math.min(100, $ ?? 0)), w = o.length === 1 ? k : k - 12 + c * 12, W = 240 + c * 5, D = w === a ? `M ${a} 230 V 258` : `M ${w} 230 V ${W} H ${a} V 258`, N = h === null ? "" : h > m ? "lädt" : h < -m ? "entlädt" : "ruht";
      return r`
          ${this._flow(D, e, h, (h ?? 0) > 0)}
          ${this._box(a - 27, 258, 54, 22, e, d(h === null ? null : Math.abs(h), this._loc), 11)}
          <text x=${a} y="290" text-anchor="middle" class="tiny">${N}</text>
          <rect x=${a - 9} y="300" width="18" height="32" rx="3" fill="none" stroke=${e} />
          <rect x=${a - 4} y="297" width="8" height="3" fill=${e} />
          <rect x=${a - 7} y=${330 - 28 * p / 100} width="14" height=${28 * p / 100} rx="1" fill=${e} fill-opacity="0.7" />
          <text x=${a} y="349" text-anchor="middle" class="soc">${C($, this._loc)}</text>
          <text x=${a} y="362" text-anchor="middle" class="tiny">${V(n.name, 14)}</text>
        `;
    })}
      <text x="245" y="384" text-anchor="middle" class="small" fill=${e}>
        Speicher ${C(s, this._loc)}${i !== null ? ` · ${f(i, this._loc)}` : ""}
      </text>
    `;
  }
  _inverter() {
    const t = this._c.inverter;
    return r`
      <rect x=${u} y="170" width="60" height="60" rx="6" fill="none" stroke=${t} stroke-width="1.5" />
      <path d=${`M ${u + 12} 210 q 6 -12 12 0 t 12 0`} fill="none" stroke=${t} stroke-width="1.5" />
      <line x1=${u + 12} y1="190" x2=${u + 48} y2="190" stroke=${t} stroke-width="1.5" />
    `;
  }
  /** One group as a vertical list: name, current power, energy today.
   *  `trunk` is the feed path from the house; every running load gets its own
   *  dot that travels the trunk and on to its row. */
  _loadList(t, e, s, i) {
    return r`
      <line x1=${x - 8} y1=${e + 2} x2=${x - 8} y2=${e + t.length * b - 6}
        stroke=${s} stroke-width="1" stroke-opacity="0.6" />
      ${t.map((o, l) => {
      const n = e + l * b, c = this._w(o.entity), a = c === null || Math.abs(c) < m;
      return r`
          <line x1=${x - 8} y1=${n + 7} x2=${x - 3} y2=${n + 7} stroke=${s} stroke-opacity="0.6" />
          ${this._dot(`${i} V ${n + 7} H ${x - 3}`, s, c, !0, 2.4)}
          <g opacity=${a ? 0.45 : 1}>
            <text x=${x} y=${n + 10} class="small name">${V(this._name(o.entity), 22)}</text>
            <text x=${z} y=${n + 10} text-anchor="end" class="small val">${d(c, this._loc)}</text>
          </g>
          <text x=${O} y=${n + 10} text-anchor="end" class="small">${f(g(this._s(o.today)), this._loc)}</text>`;
    })}
    `;
  }
  _groupTitle(t, e, s, i, o) {
    const l = o.reduce((n, c) => {
      const a = g(this._s(c.today));
      return a === null ? n : (n ?? 0) + a;
    }, null);
    return r`
      <text x=${x - 8} y=${t} class="small grp" fill=${e}>${s}</text>
      <text x=${z} y=${t} text-anchor="end" class="small grp" fill=${e}>${d(i, this._loc)}</text>
      <text x=${O} y=${t} text-anchor="end" class="small grp" fill=${e}>${f(l, this._loc)}</text>`;
  }
  /** Total svg height needed for the load lists (at least the base height). */
  get _viewH() {
    const t = this._layout;
    if (!t) return I;
    let e = 12;
    for (const s of [t.loads.fixed, t.loads.flexible])
      s.length && (e += U + s.length * b + 12);
    return Math.max(I, e);
  }
  _home() {
    const t = this._layout, e = this._c.home, s = this._c.flexible, i = this._own("home_power"), o = this._own("unmeasured_power"), l = t.loads.fixed, n = t.loads.flexible, c = 22, a = c + 6, h = l.length ? a + l.length * b + 16 : c, $ = h + 6, p = `M 285 79 H 300 V ${a + 8} H ${x - 8}`, w = `M 285 89 H 306 V ${$ + 8} H ${x - 8}`;
    return r`
      ${this._icon(q, 226, 16, 48, e)}
      ${this._box(215, 70, 70, 26, e, d(i, this._loc), 13)}
      <text x="211" y="83" text-anchor="end" class="lbl">Haus</text>
      <text x="211" y="95" text-anchor="end" class="tiny val">${f(g(this._s(t.home_today)), this._loc)}</text>
      ${o !== null ? r`<text x="256" y="112" class="tiny">nicht erfasst</text>
              <text x="256" y="122" class="tiny val">${d(o, this._loc)}</text>` : _}
      ${this._flow(`M ${k} 170 V 152 H 250 V 96`, e, i, !0)}
      ${l.length || n.length ? r`<text x=${O} y="9" text-anchor="end" class="tiny">${t.energy_period === "rolling24" ? "24 h" : "heute"}</text>` : _}
      ${l.length ? r`${this._groupTitle(c, e, "Nicht steuerbar", this._own("fixed_power"), l)}
              ${this._flow(p, e, this._own("fixed_power"), !0, !1)}
              ${this._loadList(l, a, e, p)}` : _}
      ${n.length ? r`${this._groupTitle(h, s, "Steuerbar", this._own("flexible_power"), n)}
              ${this._flow(w, s, this._own("flexible_power"), !0, !1)}
              ${this._loadList(n, $, s, w)}` : _}
    `;
  }
  _grid() {
    const t = this._layout, e = this._c.grid, s = this._own("grid_power"), i = H(this._s(t.grid.import_today)), o = H(this._s(t.grid.export_today)), l = (s ?? 0) < -m, n = l ? t.grid.export_price ? T(this._s(t.grid.export_price)) : t.grid.export_price_fixed ?? null : T(this._s(t.grid.price)), c = s === null ? "" : s > m ? "Bezug" : l ? "Einspeisung" : "", a = d(s === null ? null : Math.abs(s), this._loc);
    return r`
      ${this._flow(`M ${u} 212 H 84`, e, s, l)}
      <rect x="10" y="192" width="74" height="40" rx="4" fill="none" stroke=${e} stroke-width="1" />
      <text x="47" y=${n === null ? 217 : 209} text-anchor="middle" class="val" font-size="13">${a}</text>
      ${n !== null ? r`<text x="47" y="225" text-anchor="middle" class="tiny" fill=${e}>${B(n, this._loc)}</text>` : _}
      <text x="90" y="207" class="tiny">${c}</text>
      ${this._icon(K, 27, 240, 40, e)}
      ${i !== null ? r`<text x="10" y="298" class="small" fill=${e}>↓ ${f(i, this._loc)} Bezug</text>` : _}
      ${o !== null ? r`<text x="10" y="312" class="small">↑ ${f(o, this._loc)} Einspeisung</text>` : _}
    `;
  }
  // -- render -----------------------------------------------------------------
  render() {
    if (this._error)
      return M`<ha-card><div class="msg">${this._error}</div></ha-card>`;
    if (!this._layout || !this.hass)
      return M`<ha-card><div class="msg">Lade Energiefluss …</div></ha-card>`;
    const t = this._config?.title;
    return M`
      <ha-card .header=${t ?? _}>
        <svg viewBox=${`0 0 ${G} ${this._viewH}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Energiefluss">
          ${this._solar()} ${this._batteries()} ${this._inverter()} ${this._home()} ${this._grid()}
        </svg>
      </ha-card>
    `;
  }
};
A.styles = Y`
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
let y = A;
v([
  Z({ attribute: !1 })
], y.prototype, "hass");
v([
  E()
], y.prototype, "_config");
v([
  E()
], y.prototype, "_layout");
v([
  E()
], y.prototype, "_error");
customElements.get("energiefluss-card") || customElements.define("energiefluss-card", y);
window.customCards = window.customCards ?? [];
window.customCards.some((L) => L.type === "energiefluss-card") || window.customCards.push({
  type: "energiefluss-card",
  name: "Energiefluss",
  description: "Animierter Energiefluss – konfiguriert über die Energiefluss-Integration.",
  preview: !0
});
export {
  y as EnergieflussCard
};
