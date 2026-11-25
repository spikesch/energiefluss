import { i as it, e as rt, b as V, A as x, a as nt, n as ot, r as W, U as j, w as lt, c as v, l as ct, d as h, f as ht, p as q, g as dt, k as R, h as b, s as Y, j as L, m as _t, o as F, q as J, t as Q, u as ut } from "./energiefluss-shared-Lu9uTvhu.js";
var $t = Object.defineProperty, D = (y, t, e, n) => {
  for (var o = void 0, a = y.length - 1, i; a >= 0; a--)
    (i = y[a]) && (o = i(t, e, o) || o);
  return o && $t(t, e, o), o;
};
const pt = {
  entry_id: "Anlage",
  title: "Titel der Karte (optional)",
  flow_style: "Animation",
  max_power: "Leistung für größte bzw. schnellste Punkte"
}, ft = {
  max_power: "Ab dieser Leistung sind die Punkte am größten bzw. schnellsten. Standard 5000 W."
}, K = class K extends it {
  constructor() {
    super(...arguments), this._instances = [], this._ready = !1;
  }
  setConfig(t) {
    this._config = t;
  }
  async firstUpdated() {
    await rt(), this.hass && (this._instances = await this.hass.callWS({ type: "energiefluss/instances" })), this._ready = !0;
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
      {
        name: "flow_style",
        selector: {
          select: {
            mode: "list",
            options: [
              { value: "speed", label: "Tempo der Punkte zeigt die Leistung" },
              { value: "size", label: "Größe der Punkte zeigt die Leistung" }
            ]
          }
        }
      },
      { name: "max_power", selector: { number: { min: 500, max: 3e4, step: 100, mode: "box", unit_of_measurement: "W" } } }
    ), t;
  }
  _cardChanged(t) {
    t.stopPropagation();
    const e = { ...this._config, ...t.detail.value };
    for (const n of ["entry_id", "title", "max_power", "flow_style"])
      (e[n] === void 0 || e[n] === "" || e[n] === null) && delete e[n];
    this._config = e, this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: e }, bubbles: !0, composed: !0 }));
  }
  render() {
    return !this._ready || !this._config ? V`<div class="hint">Lade …</div>` : this._instances.length ? V`
      <h2>Karte</h2>
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schema()}
        .computeLabel=${(t) => pt[t.name] ?? t.name}
        .computeHelper=${(t) => ft[t.name]}
        @value-changed=${this._cardChanged}
      ></ha-form>
      <h2 class="spaced">Anlage</h2>
      <p class="hint">
        Gilt für alle Karten dieser Anlage. Änderungen hier mit <b>„Anlage speichern“</b> übernehmen – das
        Speichern unten im Dialog speichert nur die Karten-Einstellungen oben.
      </p>
      ${this._entryId ? V`<energiefluss-editor compact .hass=${this.hass} .entryId=${this._entryId}></energiefluss-editor>` : x}
    ` : V`<div class="hint">
        Noch keine Anlage angelegt: Einstellungen → Geräte &amp; Dienste → Integration hinzufügen → „Energiefluss“.
      </div>`;
  }
};
K.styles = nt`
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
let E = K;
D([
  ot({ attribute: !1 })
], E.prototype, "hass");
D([
  W()
], E.prototype, "_config");
D([
  W()
], E.prototype, "_instances");
D([
  W()
], E.prototype, "_ready");
customElements.get("energiefluss-card-editor") || customElements.define("energiefluss-card-editor", E);
var mt = Object.defineProperty, X = (y, t, e, n) => {
  for (var o = void 0, a = y.length - 1, i; a >= 0; a--)
    (i = y[a]) && (o = i(t, e, o) || o);
  return o && mt(t, e, o), o;
};
const tt = (y) => y.reduce((t, e) => t + 1 + (e.children?.length ?? 0), 0), xt = {
  solar: "#ff9800",
  battery: "#ff69b4",
  grid: "#5490c2",
  home: "#5fb6ad",
  flexible: "#9575cd",
  backup: "#ef5350",
  inverter: "#959595"
}, gt = 554, H = 148, I = H + 30, et = 400, T = 240, st = 22, k = 396, z = k - 20, B = 504, O = 40, N = 550, P = 42, M = 22, yt = 358, wt = 207, bt = 364, Lt = 370, A = 5, G = 40, vt = 14, Ht = 0.8, kt = "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z", Mt = "M8.28,5.45L6.5,4.55L7.76,2H16.24L17.5,4.55L15.72,5.45L15,4H9L8.28,5.45M18.62,8H14.09L13.3,5H10.7L9.91,8H5.38L4.1,10.55L5.89,11.44L6.62,10H17.38L18.1,11.44L19.89,10.55L18.62,8M17.77,22H15.7L15.46,21.1L12,15.9L8.53,21.1L8.3,22H6.23L9.12,11H11.19L10.83,12.35L12,14.1L13.16,12.35L12.81,11H14.88L17.77,22M11.4,15L10.5,13.65L9.32,18.13L11.4,15M14.68,18.12L13.5,13.64L12.6,15L14.68,18.12Z", At = "M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z", Vt = "M4,2H20A2,2 0 0,1 22,4V14A2,2 0 0,1 20,16H15V20H18V22H13V16H11V22H6V20H9V16H4A2,2 0 0,1 2,14V4A2,2 0 0,1 4,2M4,4V8H11V4H4M4,14H11V10H4V14M20,14V10H13V14H20M20,4H13V8H20V4Z", Z = class Z extends it {
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
    super.connectedCallback(), window.addEventListener(j, this._onUpdated);
  }
  disconnectedCallback() {
    window.removeEventListener(j, this._onUpdated), super.disconnectedCallback();
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
    return lt(this._s(t));
  }
  _own(t) {
    return v(this._s(this._layout?.entities[t]));
  }
  _name(t) {
    return this._s(t)?.attributes.friendly_name ?? t.split(".")[1];
  }
  get _loc() {
    return this.hass?.locale?.language ?? "de";
  }
  get _c() {
    return { ...xt, ...this._config?.colours ?? {} };
  }
  get _max() {
    return this._config?.max_power ?? 5e3;
  }
  // -- svg building blocks --------------------------------------------------
  /** A line with an animated dot. `forward` = dot travels along the path direction. */
  _flow(t, e, n, o, a = !0) {
    return h`
      <path d=${t} fill="none" stroke=${e} stroke-width=${ct(n, this._max)} stroke-opacity="0.85" />
      ${a ? this._dot(t, e, n, o) : x}
    `;
  }
  /** Only the moving dot (for paths whose line is drawn elsewhere). */
  get _bySize() {
    return this._config?.flow_style === "size";
  }
  /**
   * One moving dot. "size" style: constant speed, the dot's size shows the
   * power; default "speed" style: the reverse. `timing` lets a group of dots
   * share one period and start staggered (see _loadList).
   */
  _dot(t, e, n, o = !0, a = 3.2, i) {
    if (n === null || Math.abs(n) < A) return h``;
    const r = this._bySize, _ = r ? Math.max(1.7, ht(n, this._max) * (a / 3.2)) : a;
    if (i) {
      const p = (i.travel / i.period).toFixed(4), d = { dur: `${i.period.toFixed(2)}s`, begin: `${i.begin.toFixed(2)}s` };
      return h`<circle r=${_} fill=${e} opacity="0">
        <animateMotion dur=${d.dur} begin=${d.begin} repeatCount="indefinite" calcMode="linear"
          keyPoints="0;1;1" keyTimes=${`0;${p};1`} path=${t} />
        <animate attributeName="opacity" dur=${d.dur} begin=${d.begin} repeatCount="indefinite"
          calcMode="discrete" values="1;0" keyTimes=${`0;${p}`} />
      </circle>`;
    }
    const c = r ? Math.max(0.6, q(t) / G) : dt(n, this._max);
    return h`<circle r=${_} fill=${e}>
      <animateMotion dur=${`${c.toFixed(2)}s`} repeatCount="indefinite" calcMode="linear"
        keyPoints=${o ? "0;1" : "1;0"} keyTimes="0;1" path=${t} />
    </circle>`;
  }
  _box(t, e, n, o, a, i, r = 12) {
    return h`
      <rect x=${t} y=${e} width=${n} height=${o} rx="4" fill="none" stroke=${a} stroke-width="1" />
      <text x=${t + n / 2} y=${e + o / 2 + r * 0.35} text-anchor="middle" class="val" font-size=${r}>${i}</text>
    `;
  }
  _icon(t, e, n, o, a) {
    return h`<path d=${t} fill=${a} transform=${`translate(${e} ${n}) scale(${o / 24})`} />`;
  }
  // -- sections ---------------------------------------------------------------
  _solar() {
    const t = this._layout, e = this._c.solar, n = this._own("solar_power"), o = t.solar.strings.slice(0, 4), a = [
      [10, 10],
      [80, 10],
      [10, 58],
      [80, 58]
    ], i = R(this._s(t.solar.today)), r = R(this._s(t.solar.forecast_remaining));
    return h`
      ${o.map((_, c) => {
      const [p, d] = a[c];
      return h`${this._box(p, d, 60, 24, e, b(this._w(_.entity), this._loc), 11)}
          <text x=${p} y=${d + 35} class="lbl">${Y(this._name(_.entity), 14)}</text>`;
    })}
      ${this._icon(Vt, 152, 34, 26, e)}
      ${this._box(45, 108, 70, 26, e, b(n, this._loc), 13)}
      <text x="121" y="117" class="lbl">PV gesamt</text>
      ${i !== null ? h`<text x="121" y="130" class="small" fill=${e}>${L(i, this._loc)} heute</text>` : x}
      ${r !== null ? h`<text x="121" y="142" class="small">Rest ${L(r, this._loc)}</text>` : x}
      ${this._flow(`M 80 134 V 185 H ${H}`, e, n, !0)}
    `;
  }
  /** Batteries in display order: those with a backup output go to the right. */
  _displayBatteries() {
    const t = this._layout?.batteries ?? [], e = t.filter((i) => !(i.backup ?? []).length), n = t.filter((i) => (i.backup ?? []).length), o = [...e, ...n], a = _t(o.length);
    return o.map((i, r) => ({ ...i, ...a[r], index: r }));
  }
  _batteries() {
    const t = this._layout, e = this._c.battery;
    if (!t.batteries.length) return h``;
    const n = this._own("battery_soc"), o = this._own("battery_energy"), a = this._displayBatteries();
    a.length;
    const i = this._own("battery_power"), r = Math.min(...a.map((d) => d.cx - d.w / 2)), _ = Math.max(...a.map((d) => d.cx + d.w / 2)) - r, c = Math.min(Math.max(I, r + 10), r + _ - 10), p = c === I ? `M ${I} 230 V ${T}` : `M ${I} 230 V ${T - 5} H ${c} V ${T}`;
    return h`
      ${a.map((d, w) => {
      const { cx: m, top: f, w: g } = d, s = g < 54, l = v(this._s(d.power)), u = v(this._s(d.soc)), $ = Math.max(0, Math.min(100, u ?? 0)), S = `M ${m} ${T + st} V ${f}`, U = l === null ? "" : l > A ? "lädt" : l < -A ? "entlädt" : "ruht";
      return h`
          ${this._flow(S, e, l, (l ?? 0) > 0)}
          ${this._box(m - g / 2, f, g, 22, e, b(l === null ? null : Math.abs(l), this._loc), s ? 10 : 11)}
          <text x=${m} y=${f + 32} text-anchor="middle" class="tiny">${U}</text>
          <rect x=${m - 9} y=${f + 42} width="18" height="32" rx="3" fill="none" stroke=${e} />
          <rect x=${m - 4} y=${f + 39} width="8" height="3" fill=${e} />
          <rect x=${m - 7} y=${f + 72 - 28 * $ / 100} width="14" height=${28 * $ / 100} rx="1" fill=${e} fill-opacity="0.7" />
          <text x=${m} y=${f + 91} text-anchor="middle" class="soc">${F(u, this._loc)}</text>
          <text x=${m} y=${f + 104} text-anchor="middle" class="tiny">${Y(d.name, s ? 10 : 14)}</text>
        `;
    })}
      ${this._flow(p, e, i, (i ?? 0) > 0)}
      ${this._box(
      r,
      T,
      _,
      st,
      e,
      `${_ >= 120 ? "Speicher " : ""}${F(n, this._loc)}${o !== null && _ >= 80 ? ` · ${L(o, this._loc)}` : ""}`,
      _ >= 150 ? 11 : 10
    )}
    `;
  }
  _inverter() {
    const t = this._c.inverter;
    return h`
      <rect x=${H} y="170" width="60" height="60" rx="6" fill="none" stroke=${t} stroke-width="1.5" />
      <path d=${`M ${H + 12} 210 q 6 -12 12 0 t 12 0`} fill="none" stroke=${t} stroke-width="1.5" />
      <line x1=${H + 12} y1="190" x2=${H + 48} y2="190" stroke=${t} stroke-width="1.5" />
    `;
  }
  /**
   * All load groups on the right, top to bottom, with their positions and the
   * feed path (trunk) from their source: house, inverter backup output or a
   * battery's own output (one group per battery).
   */
  _groups() {
    const t = this._layout;
    if (!t) return [];
    const e = this._c, n = z, o = [];
    let a = 22;
    const i = (c, p, d, w, m, f, g) => {
      if (!d.length) return;
      const s = Math.max(a + 6, g ? g.pref - 10 : 0), l = g ? Math.min(Math.max(s + 10, g.lo), g.hi) : s + 10, u = m(s + 10, l);
      o.push({
        title: c,
        colour: p,
        power: w,
        titleY: s - 6,
        y0: s,
        trunk: u,
        loads: d.map(($) => ({ ...$, trunk: u, source: f }))
      }), a = s + tt(d) * M + 16;
    };
    i("Nicht steuerbar", e.home, t.loads.fixed, this._sumW(t.loads.fixed), (c) => `M 285 79 H 300 V ${c} H ${n}`), i("Steuerbar", e.flexible, t.loads.flexible, this._sumW(t.loads.flexible), (c) => `M 285 89 H 306 V ${c} H ${n}`);
    const r = t.wallbox;
    if (r) {
      const c = v(this._s(r.soc ?? void 0)), p = c !== null ? `${r.name} Auto ${F(c, this._loc)}` : r.name;
      i(
        "Wallbox",
        r.flexible ? e.flexible : e.home,
        [{ entity: r.power, today: r.today, label: p, tip: `${r.name}${r.flexible ? " · steuerbar" : ""}` }],
        this._w(r.power),
        (d, w) => `M ${H + 60} ${w} H ${yt} V ${d} H ${n}`,
        void 0,
        { pref: wt, lo: 176, hi: 226 }
        // anywhere on the inverter's right edge
      );
    }
    return this._displayBatteries().filter((c) => (c.backup ?? []).length).reverse().forEach((c, p) => {
      const d = p === 0 ? bt : Lt, w = p === 0 ? { pref: c.top + 57, lo: c.top + 46, hi: c.top + 70 } : { pref: c.top + 68, lo: c.top + 64, hi: c.top + 72 };
      i(
        Y(c.name, 12),
        // red colour + feed line from the battery mark it as backup
        e.backup,
        c.backup ?? [],
        this._sumW(c.backup ?? []),
        (m, f) => `M ${c.cx + 10} ${f} H ${d} V ${m} H ${n}`,
        c.name,
        w
      );
    }), o;
  }
  _sumW(t) {
    return t.reduce((e, n) => {
      const o = this._w(n.entity);
      return o === null ? e : (e ?? 0) + o;
    }, null);
  }
  /** One group as a vertical list, biggest consumer on top: name, power, energy.
   *  Every row knows the feed path (`trunk`) from its source; a running load
   *  gets its own dot that travels the trunk and on to its row. */
  _loadList(t, e, n) {
    const o = (s, l) => (l.w ?? -1 / 0) - (s.w ?? -1 / 0) || s.name.localeCompare(l.name), a = t.map((s) => ({ ...s, w: this._w(s.entity), name: s.label ?? this._name(s.entity) })).sort(o), i = [];
    for (const s of a) {
      const l = i.length;
      i.push({ ...s, child: !1 });
      const u = (s.children ?? []).map(($) => ({ ...s, ...$, children: void 0, label: void 0, w: this._w($.entity), name: this._name($.entity) })).sort(o);
      for (const $ of u) i.push({ ...$, child: !0, parentRow: l });
    }
    const r = (s, l) => `${s.trunk} V ${e + l * M + 10} H ${k - 3}`, _ = (s, l) => `${r(s, s.parentRow ?? 0)} H ${k + 4} V ${e + l * M + 10} H ${k + 10}`, c = (s) => {
      const l = i[s].w;
      if (l === null) return null;
      const u = i.filter(($) => $.child && $.parentRow === s).reduce(($, S) => $ + Math.max(S.w ?? 0, 0), 0);
      return Math.max(l - u, 0);
    }, p = (s, l) => s.child ? s.w : c(l), w = i.map((s, l) => ({ l: s, i: l, w: p(s, l) })).filter(({ w: s }) => s !== null && Math.abs(s) >= A).map(({ l: s, i: l }, u) => ({
      i: l,
      begin: u * vt / G,
      travel: q(s.child ? _(s, l) : r(s, l)) / G
    })), m = Math.max(1, ...w.map((s) => s.begin + s.travel)) + Ht, f = new Map(w.map((s) => [s.i, { period: m, begin: s.begin, travel: s.travel }])), g = i.reduce((s, l, u) => l.child ? s : u, 0);
    return h`
      <line x1=${z} y1=${e + 4} x2=${z} y2=${e + g * M + 10}
        stroke=${n} stroke-width="1" stroke-opacity="0.6" />
      ${i.map((s, l) => {
      const u = e + l * M, $ = s.w === null || Math.abs(s.w) < A;
      if (s.child) {
        const U = e + (s.parentRow ?? 0) * M + 19, at = `${s.name} · enthalten in ${i[s.parentRow ?? 0].name}`;
        return h`
            <path d=${`M ${k + 4} ${U} V ${u + 10} H ${k + 10}`} fill="none" stroke=${n}
              stroke-opacity="0.6" stroke-dasharray="2 2" />
            ${this._bySize ? this._dot(_(s, l), n, s.w, !0, 2.4, f.get(l)) : x}
            <g opacity=${$ ? 0.45 : 0.85}>
              ${this._nameBox(s.name, u, n, at, 12)}
              ${this._box(B - O, u + 1, O, 18, n, b(s.w, this._loc), 9)}
            </g>
            ${this._box(N - P, u + 1, P, 18, n, L(v(this._s(s.today)), this._loc), 8.5)}`;
      }
      const S = s.tip ?? (s.source ? `${s.name} · gespeist von ${s.source}` : s.name);
      return h`
          <line x1=${z} y1=${u + 10} x2=${k - 3} y2=${u + 10} stroke=${n} stroke-opacity="0.6" />
          ${this._bySize ? this._dot(r(s, l), n, c(l), !0, 2.4, f.get(l)) : this._dot(r(s, l), n, s.w, !0, 2.4)}
          <g opacity=${$ ? 0.45 : 1}>
            ${this._nameBox(s.name, u, n, S)}
            ${this._box(B - O, u + 1, O, 18, n, b(s.w, this._loc), 9)}
          </g>
          ${this._box(N - P, u + 1, P, 18, n, L(v(this._s(s.today)), this._loc), 8.5)}`;
    })}
    `;
  }
  /** Name of a load in a rounded box; long names wrap to two smaller lines. */
  _nameBox(t, e, n, o = t, a = 0) {
    const i = k - 2 + a, r = B - O - 4 - i, { lines: _, small: c } = a ? J(t, 9, 12) : J(t, 11, 15);
    return h`<g>
      <title>${o}</title>
      <rect x=${i} y=${e + 1} width=${r} height="18" rx="4" fill="none" stroke=${n} stroke-width="1" />
      ${c ? h`<text x=${i + 4} y=${e + 9} class="name" font-size="7.5">${_[0]}</text>
              <text x=${i + 4} y=${e + 17} class="name" font-size="7.5">${_[1] ?? ""}</text>` : h`<text x=${i + 4} y=${e + 13.5} class="name" font-size="10">${_[0]}</text>`}
    </g>`;
  }
  _groupTitle(t, e, n, o, a) {
    const i = a.reduce((r, _) => {
      const c = v(this._s(_.today));
      return c === null ? r : (r ?? 0) + c;
    }, null);
    return h`
      <text x=${z} y=${t} class="small grp" fill=${e}>${n}</text>
      <text x=${B - O / 2} y=${t} text-anchor="middle" class="small grp" fill=${e}>${b(o, this._loc)}</text>
      <text x=${N - P / 2} y=${t} text-anchor="middle" class="small grp" fill=${e}>${L(i, this._loc)}</text>`;
  }
  /** Total svg height needed for the load lists and the batteries. */
  get _viewH() {
    if (!this._layout) return et;
    const t = this._groups(), e = t[t.length - 1], n = e ? e.y0 + tt(e.loads) * M + 8 : 0, o = this._displayBatteries(), a = o.length ? Math.max(...o.map((i) => i.top)) + 138 : 0;
    return Math.max(et, n, a);
  }
  _home() {
    const t = this._layout, e = this._c.home, n = this._own("home_power"), o = this._own("unmeasured_power"), a = this._groups();
    return h`
      ${this._icon(kt, 226, 16, 48, e)}
      ${this._box(215, 70, 70, 26, e, b(n, this._loc), 13)}
      <text x="211" y="83" text-anchor="end" class="lbl">Haus</text>
      <text x="211" y="95" text-anchor="end" class="tiny val">${L(v(this._s(t.home_today)), this._loc)}</text>
      ${o !== null ? h`<text x="256" y="112" class="tiny">nicht erfasst</text>
              <text x="256" y="122" class="tiny val">${b(o, this._loc)}</text>` : x}
      ${this._flow(`M ${I} 170 V 152 H 250 V 96`, e, n, !0)}
      ${a.length ? h`<text x=${N - P / 2} y="9" text-anchor="middle" class="tiny">${t.energy_period === "rolling24" ? "24 h" : "heute"}</text>` : x}
      ${a.map(
      (i) => h`
          ${this._groupTitle(i.titleY, i.colour, i.title, i.power, i.loads)}
          ${i.title === "Wallbox" ? this._icon(At, z + 46, i.titleY - 11, 14, i.colour) : x}
          ${this._flow(i.trunk, i.colour, i.power, !0, !1)}
          ${this._loadList(i.loads, i.y0, i.colour)}
        `
    )}
    `;
  }
  _grid() {
    const t = this._layout, e = this._c.grid, n = this._own("grid_power"), o = R(this._s(t.grid.import_today)), a = R(this._s(t.grid.export_today)), i = (n ?? 0) < -A, r = i ? t.grid.export_price ? Q(this._s(t.grid.export_price)) : t.grid.export_price_fixed ?? null : Q(this._s(t.grid.price)), _ = n === null ? "" : n > A ? "Bezug" : i ? "Einspeisung" : "", c = b(n === null ? null : Math.abs(n), this._loc);
    return h`
      ${this._flow(`M ${H} 212 H 84`, e, n, i)}
      <rect x="10" y="192" width="74" height="40" rx="4" fill="none" stroke=${e} stroke-width="1" />
      <text x="47" y=${r === null ? 217 : 209} text-anchor="middle" class="val" font-size="13">${c}</text>
      ${r !== null ? h`<text x="47" y="225" text-anchor="middle" class="tiny" fill=${e}>${ut(r, this._loc)}</text>` : x}
      <text x="90" y="207" class="tiny">${_}</text>
      ${this._icon(Mt, 27, 240, 40, e)}
      ${o !== null ? h`<text x="10" y="292" class="small" fill=${e}>↓ ${L(o, this._loc)}<tspan class="tiny"> Bezug</tspan></text>` : x}
      ${a !== null ? h`<text x="10" y="305" class="small">↑ ${L(a, this._loc)}<tspan class="tiny"> Einspeisung</tspan></text>` : x}
    `;
  }
  // -- render -----------------------------------------------------------------
  render() {
    if (this._error)
      return V`<ha-card><div class="msg">${this._error}</div></ha-card>`;
    if (!this._layout || !this.hass)
      return V`<ha-card><div class="msg">Lade Energiefluss …</div></ha-card>`;
    const t = this._config?.title;
    return V`
      <ha-card .header=${t ?? x}>
        <svg viewBox=${`0 0 ${gt} ${this._viewH}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Energiefluss">
          ${this._solar()} ${this._batteries()} ${this._inverter()} ${this._home()} ${this._grid()}
        </svg>
      </ha-card>
    `;
  }
};
Z.styles = nt`
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
let C = Z;
X([
  ot({ attribute: !1 })
], C.prototype, "hass");
X([
  W()
], C.prototype, "_config");
X([
  W()
], C.prototype, "_layout");
X([
  W()
], C.prototype, "_error");
customElements.get("energiefluss-card") || customElements.define("energiefluss-card", C);
window.customCards = window.customCards ?? [];
window.customCards.some((y) => y.type === "energiefluss-card") || window.customCards.push({
  type: "energiefluss-card",
  name: "Energiefluss",
  description: "Animierter Energiefluss – konfiguriert über die Energiefluss-Integration.",
  preview: !0
});
export {
  C as EnergieflussCard
};
