import { i as se, e as le, b as Z, A as x, a as Pt, n as oe, r as Q, U as Yt, w as ce, c as E, d as c, l as he, f as de, p as Et, g as pe, k as ht, h as I, j as S, s as rt, m as fe, o as at, q as Tt, t as jt, u as ie, v as dt, x as ue, y as $e } from "./energiefluss-shared-CB9d2Cr1.js";
var _e = Object.defineProperty, kt = (C, t, e, n) => {
  for (var s = void 0, i = C.length - 1, o; i >= 0; i--)
    (o = C[i]) && (s = o(t, e, s) || s);
  return s && _e(t, e, s), s;
};
const ge = {
  entry_id: "Anlage",
  title: "Titel der Karte (optional)",
  flow_style: "Animation",
  max_power: "Leistung für größte bzw. schnellste Punkte"
}, we = {
  max_power: "Ab dieser Leistung sind die Punkte am größten bzw. schnellsten. Standard 5000 W."
}, Ot = class Ot extends se {
  constructor() {
    super(...arguments), this._instances = [], this._ready = !1;
  }
  setConfig(t) {
    this._config = t;
  }
  async firstUpdated() {
    await le(), this.hass && (this._instances = await this.hass.callWS({ type: "energiefluss/instances" })), this._ready = !0;
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
    return !this._ready || !this._config ? Z`<div class="hint">Lade …</div>` : this._instances.length ? Z`
      <h2>Karte</h2>
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schema()}
        .computeLabel=${(t) => ge[t.name] ?? t.name}
        .computeHelper=${(t) => we[t.name]}
        @value-changed=${this._cardChanged}
      ></ha-form>
      <h2 class="spaced">Anlage</h2>
      <p class="hint">
        Gilt für alle Karten dieser Anlage. Änderungen hier mit <b>„Anlage speichern“</b> übernehmen – das
        Speichern unten im Dialog speichert nur die Karten-Einstellungen oben.
      </p>
      ${this._entryId ? Z`<energiefluss-editor compact .hass=${this.hass} .entryId=${this._entryId}></energiefluss-editor>` : x}
    ` : Z`<div class="hint">
        Noch keine Anlage angelegt: Einstellungen → Geräte &amp; Dienste → Integration hinzufügen → „Energiefluss“.
      </div>`;
  }
};
Ot.styles = Pt`
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
let K = Ot;
kt([
  oe({ attribute: !1 })
], K.prototype, "hass");
kt([
  Q()
], K.prototype, "_config");
kt([
  Q()
], K.prototype, "_instances");
kt([
  Q()
], K.prototype, "_ready");
customElements.get("energiefluss-card-editor") || customElements.define("energiefluss-card-editor", K);
var me = Object.defineProperty, lt = (C, t, e, n) => {
  for (var s = void 0, i = C.length - 1, o; i >= 0; i--)
    (o = C[i]) && (s = o(t, e, s) || s);
  return s && me(t, e, s), s;
};
const xe = (C) => C.reduce((t, e) => t + 1 + (e.children?.length ?? 0), 0), ye = {
  solar: "#ff9800",
  battery: "#ff69b4",
  grid: "#5490c2",
  home: "#5fb6ad",
  flexible: "#9575cd",
  backup: "#ef5350",
  inverter: "#959595"
}, ke = 554, be = 148, Dt = 400, Gt = 240, wt = 22, V = 396, X = V - 20, nt = 504, W = 40, U = 550, tt = 42, ve = 22, Xt = 358, Me = 37, Wt = 364, Ut = 370, A = 5, Zt = 40, Le = 14, He = 0.8, Ce = "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z", ze = "M8.28,5.45L6.5,4.55L7.76,2H16.24L17.5,4.55L15.72,5.45L15,4H9L8.28,5.45M18.62,8H14.09L13.3,5H10.7L9.91,8H5.38L4.1,10.55L5.89,11.44L6.62,10H17.38L18.1,11.44L19.89,10.55L18.62,8M17.77,22H15.7L15.46,21.1L12,15.9L8.53,21.1L8.3,22H6.23L9.12,11H11.19L10.83,12.35L12,14.1L13.16,12.35L12.81,11H14.88L17.77,22M11.4,15L10.5,13.65L9.32,18.13L11.4,15M14.68,18.12L13.5,13.64L12.6,15L14.68,18.12Z", Ae = "M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z", Ee = "M4,2H20A2,2 0 0,1 22,4V14A2,2 0 0,1 20,16H15V20H18V22H13V16H11V22H6V20H9V16H4A2,2 0 0,1 2,14V4A2,2 0 0,1 4,2M4,4V8H11V4H4M4,14H11V10H4V14M20,14V10H13V14H20M20,4H13V8H20V4Z", Ft = class Ft extends se {
  constructor() {
    super(...arguments), this._expanded = /* @__PURE__ */ new Set(), this._loading = !1, this._onUpdated = (t) => {
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
    super.connectedCallback(), window.addEventListener(Yt, this._onUpdated);
  }
  disconnectedCallback() {
    window.removeEventListener(Yt, this._onUpdated), super.disconnectedCallback();
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
    return ce(this._s(t));
  }
  _own(t) {
    return E(this._s(this._layout?.entities[t]));
  }
  _name(t) {
    return this._s(t)?.attributes.friendly_name ?? t.split(".")[1];
  }
  get _loc() {
    return this.hass?.locale?.language ?? "de";
  }
  get _c() {
    return { ...ye, ...this._config?.colours ?? {} };
  }
  get _max() {
    return this._config?.max_power ?? 5e3;
  }
  /** Top left corners of the PV string tiles. */
  get _stringPos() {
    return [
      [10, 10],
      [80, 10],
      [10, 58],
      [80, 58]
    ];
  }
  /** Top of the "PV gesamt" box (70 x 26 at x 45). */
  get _pvBoxY() {
    return 108;
  }
  /** Top of the storage box above the batteries. */
  get _storeY() {
    return Gt;
  }
  /** The card is at least this tall. */
  get _minViewH() {
    return Dt;
  }
  /** Room the card keeps below the top of the lowest battery. */
  get _batteryTail() {
    return 138;
  }
  /** Height of one load list row; looks may make the lists denser. */
  get _rowH() {
    return ve;
  }
  /** Font size for text set in the templates; looks may scale all of it. */
  _fs(t) {
    return t;
  }
  // -- layout knobs that alternative looks may move ----------------------------
  /** Left edge of the inverter box (60 x 60). */
  get _invX() {
    return be;
  }
  /** Top edge of the inverter box. */
  get _invY() {
    return 170;
  }
  /** Where the house line leaves the inverter (top) ... */
  get _invTop() {
    return [this._invX + 30, this._invY];
  }
  /** ... and where the storage line leaves it (bottom). */
  get _invBottom() {
    return [this._invX + 30, this._invY + 60];
  }
  /** Where the PV line leaves the PV total box (x) and enters the inverter (y). */
  get _solarX() {
    return 80;
  }
  get _solarY() {
    return this._invY + 15;
  }
  /** Whether the not measured part of the house is a row of its own in the
   *  "Grundlast" (base load) list (instead of a small note below the house). */
  get _unmeasuredInList() {
    return !1;
  }
  /** Where a battery's own (backup) output leaves the battery symbol, to the right. */
  _batteryOutX(t, e) {
    return t + 10;
  }
  /** Path of the house line's dots (from the inverter into the house box);
   *  null = along the drawn line. */
  _houseIn() {
    return null;
  }
  /** Drawn where the house line's dots end (nothing in the classic look). */
  _houseJunction(t) {
    return c``;
  }
  /** Path inside the house box to its right side at height `y` (where a load
   *  list's trunk starts); null = the list's dots start at the box's side. */
  _houseLead(t) {
    return null;
  }
  /** Path inside a battery up to its own (backup) output at height `y`; null =
   *  the backup dots start at the battery's side. */
  _batteryLead(t, e, n, s) {
    return null;
  }
  /** Path from a PV string tile (top left x, y) through the PV total box to the
   *  inverter; null = one dot line from the PV total box only. */
  _stringRoute(t, e) {
    return null;
  }
  /** Dots of several routes that share part of their way: the PV strings (they
   *  join at the PV total box) or the batteries (they part at the storage box).
   *  Looks may let them form one train there. */
  _trainDots(t, e, n) {
    return c`${n.map((s) => this._dot(s.route, e, s.w, s.forward))}`;
  }
  /** Balls (radius, colour) a load's dots consist of, for looks that count the
   *  power in balls; null = one wagon per load whose size shows the power. */
  _wagonBalls(t, e) {
    return null;
  }
  /** Dots of the house line (from the inverter to the house). */
  _houseDots(t, e, n) {
    return this._dot(t, e, n, !0);
  }
  /** Speed of the load list trains in px per second. */
  get _wagonSpeed() {
    return Zt;
  }
  /** A battery's whole route from the inverter through the storage box to the
   *  battery (for dots that pass through the box); null = dots stop at the box. */
  _batteryRoute(t, e) {
    return null;
  }
  /** Horizontal offset of the whole storage area (n = number of batteries). */
  _batteryShift(t) {
    return 0;
  }
  /** Whether the wallbox is shown as a group in the load lists on the right. */
  get _wallboxInList() {
    return !0;
  }
  // -- svg building blocks --------------------------------------------------
  /** A line with an animated dot. `forward` = dot travels along the path direction. */
  _flow(t, e, n, s, i = !0) {
    return c`
      <path d=${t} fill="none" stroke=${e} stroke-width=${he(n, this._max)} stroke-opacity="0.85" />
      ${i ? this._dot(t, e, n, s) : x}
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
  _dot(t, e, n, s = !0, i = 3.2, o) {
    if (n === null || Math.abs(n) < A) return c``;
    const r = this._bySize, a = o?.radius ?? (r ? Math.max(1.7, de(n, this._max) * (i / 3.2)) : i);
    if (o) {
      const d = (o.travel / o.period).toFixed(4), u = { dur: `${o.period.toFixed(2)}s`, begin: `${o.begin.toFixed(2)}s` };
      return this._orb(
        a,
        e,
        c`<animateMotion dur=${u.dur} begin=${u.begin} repeatCount="indefinite" calcMode="linear" rotate="auto"
            keyPoints="0;1;1" keyTimes=${`0;${d};1`} path=${t} />
          <animate attributeName="opacity" dur=${u.dur} begin=${u.begin} repeatCount="indefinite"
            calcMode="discrete" values="1;0" keyTimes=${`0;${d}`} />`,
        !0
      );
    }
    const h = this._dotDuration(t, n);
    return this._orb(
      a,
      e,
      c`<animateMotion dur=${`${h.toFixed(2)}s`} repeatCount="indefinite" calcMode="linear"
        rotate=${s ? "auto" : "auto-reverse"}
        keyPoints=${s ? "0;1" : "1;0"} keyTimes="0;1" path=${t} />`
    );
  }
  /** Seconds a (non-train) dot needs for path `d`; looks use it to sync their own effects. */
  _dotDuration(t, e) {
    return this._bySize ? Math.max(0.6, Et(t) / Zt) : pe(e, this._max);
  }
  /** Draws a moving dot; `motion` holds its animation elements. Looks override this. */
  _orb(t, e, n, s = !1) {
    return c`<circle r=${t} fill=${e} opacity=${s ? "0" : x}>${n}</circle>`;
  }
  /** Extra <defs> (filters, gradients) for alternative looks. */
  _defs() {
    return c``;
  }
  /** Background of a box; looks override this. */
  _panel(t, e, n, s, i) {
    return c`<rect x=${t} y=${e} width=${n} height=${s} rx="4" fill="none" stroke=${i} stroke-width="1" />`;
  }
  _box(t, e, n, s, i, o, r = 12) {
    return c`
      ${this._panel(t, e, n, s, i)}
      <text x=${t + n / 2} y=${e + s / 2 + r * 0.35} text-anchor="middle" class="val" font-size=${this._fs(r)}>${o}</text>
    `;
  }
  _icon(t, e, n, s, i) {
    return c`<path d=${t} fill=${i} transform=${`translate(${e} ${n}) scale(${s / 24})`} />`;
  }
  // -- sections ---------------------------------------------------------------
  _solar() {
    const t = this._layout, e = this._c.solar, n = this._own("solar_power"), s = t.solar.strings.slice(0, 4), i = this._stringPos, o = this._pvBoxY, r = ht(this._s(t.solar.today)), a = ht(this._s(t.solar.forecast_remaining)), h = s.map(($, p) => this._stringRoute(i[p][0], i[p][1])), d = s.length > 0 && h.every(($) => $ !== null), u = `M ${this._solarX} ${o + 26} V ${this._solarY} H ${this._invX}`;
    return c`
      ${d ? (
      // the line first, the strings' dots on it, tiles and box on top (dots pass below the glass)
      c`${this._flow(u, e, n, !0, !1)}
            ${this._trainDots("pv", e, s.map(($, p) => ({ route: h[p], w: this._w($.entity), forward: !0 })))}`
    ) : x}
      ${s.map(($, p) => {
      const [f, g] = i[p];
      return this._stringTile(f, g, $.entity, e);
    })}
      ${this._solarIcon(e)}
      ${this._box(45, o, 70, 26, e, I(n, this._loc), 13)}
      <text x="121" y=${o + 9} class="lbl">PV gesamt</text>
      ${r !== null ? c`<text x="121" y=${o + 22} class="small" fill=${e}>${S(r, this._loc)} heute</text>` : x}
      ${a !== null ? c`<text x="121" y=${o + 34} class="small">Rest ${S(a, this._loc)}</text>` : x}
      ${d ? x : this._flow(u, e, n, !0)}
    `;
  }
  /** Symbol next to the PV strings. */
  _solarIcon(t) {
    return this._icon(Ee, 152, 34, 26, t);
  }
  /** One PV string: value box with its name below (tile at x, y; 60 x 38 available). */
  _stringTile(t, e, n, s) {
    return c`${this._box(t, e, 60, 24, s, I(this._w(n), this._loc), 11)}
      <text x=${t} y=${e + 35} class="lbl">${rt(this._name(n), 14)}</text>`;
  }
  /** Batteries in display order: those with a backup output go to the right. */
  _displayBatteries() {
    const t = this._layout?.batteries ?? [], e = t.filter((a) => !(a.backup ?? []).length), n = t.filter((a) => (a.backup ?? []).length), s = [...e, ...n], i = fe(s.length), o = this._batteryShift(s.length), r = this._storeY - Gt;
    return s.map((a, h) => ({ ...a, ...i[h], cx: i[h].cx + o, top: i[h].top + r, index: h }));
  }
  _batteries() {
    const t = this._layout, e = this._c.battery;
    if (!t.batteries.length) return c``;
    const n = this._own("battery_soc"), s = this._own("battery_energy"), i = this._displayBatteries();
    i.length;
    const o = this._own("battery_power"), r = Math.min(...i.map((_) => _.cx - _.w / 2)), a = Math.max(...i.map((_) => _.cx + _.w / 2)) - r, [h, d] = this._invBottom, u = this._storeY, $ = Math.min(Math.max(h, r + 10), r + a - 10), p = $ === h ? `M ${h} ${d} V ${u}` : `M ${h} ${d} V ${u - 5} H ${$} V ${u}`, f = i.map((_) => this._batteryRoute(_.cx, _.top)), g = f.every((_) => _ !== null);
    return c`
      ${i.map((_, m) => {
      const { cx: y, top: k, w: H } = _, z = E(this._s(_.power)), M = E(this._s(_.soc)), T = `M ${y} ${u + wt} V ${k}`, F = z === null ? "" : z > A ? "lädt" : z < -A ? "entlädt" : "ruht";
      return c`
          ${this._flow(T, e, z, (z ?? 0) > 0, !g)}
          ${this._batteryWidget(_.name, y, k, H, z, M, F, e, _.capacity_kwh)}
        `;
    })}
      ${this._flow(p, e, o, (o ?? 0) > 0, !g)}
      ${g ? this._trainDots(
      "battery",
      e,
      i.map((_, m) => {
        const y = E(this._s(_.power));
        return { route: f[m], w: y, forward: (y ?? 0) > 0 };
      })
    ) : x}
      ${this._box(
      r,
      u,
      a,
      wt,
      e,
      `${a >= 120 ? "Speicher " : ""}${at(n, this._loc)}${s !== null && a >= 80 ? ` · ${S(s, this._loc)}` : ""}`,
      a >= 150 ? 11 : 10
    )}
    `;
  }
  /** One battery below the storage box: widget spans top .. top + 104 around cx. */
  _batteryWidget(t, e, n, s, i, o, r, a, h = null) {
    const d = s < 54, u = Math.max(0, Math.min(100, o ?? 0));
    return c`
      ${this._box(e - s / 2, n, s, 22, a, I(i === null ? null : Math.abs(i), this._loc), d ? 10 : 11)}
      <text x=${e} y=${n + 32} text-anchor="middle" class="tiny">${r}</text>
      <rect x=${e - 9} y=${n + 42} width="18" height="32" rx="3" fill="none" stroke=${a} />
      <rect x=${e - 4} y=${n + 39} width="8" height="3" fill=${a} />
      <rect x=${e - 7} y=${n + 72 - 28 * u / 100} width="14" height=${28 * u / 100} rx="1" fill=${a} fill-opacity="0.7" />
      <text x=${e} y=${n + 91} text-anchor="middle" class="soc">${at(o, this._loc)}</text>
      <text x=${e} y=${n + 104} text-anchor="middle" class="tiny">${rt(t, d ? 10 : 14)}</text>
    `;
  }
  _inverter() {
    const t = this._c.inverter, e = this._invX, n = this._invY;
    return c`
      <rect x=${e} y=${n} width="60" height="60" rx="6" fill="none" stroke=${t} stroke-width="1.5" />
      <path d=${`M ${e + 12} ${n + 40} q 6 -12 12 0 t 12 0`} fill="none" stroke=${t} stroke-width="1.5" />
      <line x1=${e + 12} y1=${n + 20} x2=${e + 48} y2=${n + 20} stroke=${t} stroke-width="1.5" />
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
    const e = this._c, n = X, s = [], i = this._rowH, o = i / 2 - 1;
    let r = 22;
    const a = (f, g, _, m, y, k, H, z) => {
      if (!_.length) return;
      const M = this._listLimit(f), T = M !== null && _.length > M, F = this._expanded.has(f);
      let P = _;
      if (T && !F) {
        const D = (G) => E(this._s(G.today)) ?? 0, st = new Set([..._].sort((G, bt) => D(bt) - D(G)).slice(0, M));
        P = _.filter((G) => st.has(G));
      }
      const J = xe(P) + (T ? 1 : 0), l = Math.max(r + 6, H ? H.pref - 10 : 0), w = H ? Math.min(Math.max(l + o, H.lo), H.hi) : l + o, b = y(l + o, w), v = z?.(w), R = v ? `${v} ${b.replace(/^M\s+\S+\s+\S+\s*/, "")}` : void 0;
      s.push({
        title: f,
        colour: g,
        power: m,
        titleY: l - 6,
        y0: l,
        trunk: b,
        loads: P.map((D) => ({ ...D, trunk: b, route: R, source: k })),
        all: _,
        rows: J,
        more: T ? { hidden: _.length - P.length, expanded: F } : void 0
      }), r = l + J * i + this._groupGap;
    }, h = [...t.loads.fixed], d = t.entities.unmeasured_power;
    this._unmeasuredInList && d && h.push({
      entity: d,
      today: t.unmeasured_today ?? null,
      label: "Nicht erfasst",
      tip: "Nicht erfasst · Hausverbrauch ohne die gemessenen Verbraucher"
    });
    const u = this._laneFinder();
    a(
      "Grundlast",
      e.home,
      h,
      this._sumW(h),
      (f) => `M 285 79 H ${u(300, 79, f)} V ${f} H ${n}`,
      void 0,
      void 0,
      () => this._houseLead(79)
    ), a(
      "Zusätzlich",
      e.flexible,
      t.loads.flexible,
      this._sumW(t.loads.flexible),
      (f) => `M 285 89 H ${u(306, 89, f)} V ${f} H ${n}`,
      void 0,
      void 0,
      () => this._houseLead(89)
    );
    const $ = t.wallbox;
    if ($ && this._wallboxInList) {
      const f = E(this._s($.soc ?? void 0)), g = f !== null ? `${$.name} Auto ${at(f, this._loc)}` : $.name;
      a(
        "Wallbox",
        $.flexible ? e.flexible : e.home,
        [{ entity: $.power, today: $.today, label: g, tip: `${$.name} · ${$.flexible ? "Zusatzverbraucher" : "Grundlast"}` }],
        this._w($.power),
        (_, m) => `M ${this._invX + 60} ${m} H ${Xt} V ${_} H ${n}`,
        void 0,
        { pref: this._invY + Me, lo: this._invY + 6, hi: this._invY + 56 }
        // anywhere on the inverter's right edge
      );
    }
    return this._displayBatteries().filter((f) => (f.backup ?? []).length).reverse().forEach((f, g) => {
      const _ = g === 0 ? Wt : Ut, m = g === 0 ? { pref: f.top + 57, lo: f.top + 46, hi: f.top + 70 } : { pref: f.top + 68, lo: f.top + 64, hi: f.top + 72 };
      a(
        rt(f.name, 12),
        // red colour + feed line from the battery mark it as backup
        e.backup,
        f.backup ?? [],
        this._sumW(f.backup ?? []),
        (y, k) => `M ${this._batteryOutX(f.cx, f.w)} ${k} H ${_} V ${y} H ${n}`,
        f.name,
        m,
        (y) => this._batteryLead(f.cx, f.top, f.w, y)
      );
    }), s;
  }
  /** Draw a load group's feed as part of its list's pipes (same look, clean joins). */
  get _pipeTrunk() {
    return !1;
  }
  /** Where a load list's branch line ends at its row. */
  get _rowEntryX() {
    return V - 3;
  }
  /** Lines inside a load list: the bracket with the rows' branches (one path),
   *  or the dashed link from a load to a load contained in it. */
  _branch(t, e, n) {
    return c`<path d=${t} fill="none" stroke=${e} stroke-width="1" stroke-opacity="0.6"
      stroke-dasharray=${n === "child" ? "2 2" : x} />`;
  }
  /** How many loads a group shows before it folds the rest away (by title);
   *  null = all. */
  _listLimit(t) {
    return null;
  }
  /** Sort idle loads by today's energy (after the running ones) instead of by name. */
  get _idleByEnergy() {
    return !1;
  }
  /** The "+ N weitere" / "− weniger" row below a folded list. */
  _moreRow(t) {
    const e = this._rowH, n = t.y0 + (t.rows - 1) * e, s = t.more.expanded ? "− weniger" : `+ ${t.more.hidden} weitere`;
    return c`<g class="more" @click=${() => this._toggleList(t.title)}>
      <rect x=${V - 8} y=${n} width=${U - V + 8} height=${e} fill="transparent" />
      <text x=${V + 2} y=${n + e * 0.62} class="small" fill=${t.colour}>${s}</text>
    </g>`;
  }
  _toggleList(t) {
    const e = new Set(this._expanded);
    e.has(t) ? e.delete(t) : e.add(t), this._expanded = e;
  }
  /**
   * Finds a free vertical lane for a feed from the house down (or up) to a
   * load list: the preferred x if the line from y1 to y2 passes no battery and
   * not the storage box, otherwise the next free lane to the right of them,
   * left of the lanes the battery (backup) and wallbox feeds use.
   */
  _laneFinder() {
    const t = this._displayBatteries(), e = t.map((o) => ({ x0: o.cx - o.w / 2 - 3, x1: o.cx + o.w / 2 + 3, y0: o.top - 2, y1: o.top + 110 }));
    if (t.length) {
      const o = Math.min(...t.map((a) => a.cx - a.w / 2)) - 3, r = Math.max(...t.map((a) => a.cx + a.w / 2)) + 3;
      e.push({ x0: o, x1: r, y0: this._storeY - 3, y1: this._storeY + wt + 3 });
    }
    const n = [Wt, Ut, ...this._layout?.wallbox && this._wallboxInList ? [Xt] : []], s = [], i = (o, r, a) => {
      const [h, d] = r < a ? [r, a] : [a, r];
      return !e.some((u) => o >= u.x0 && o <= u.x1 && d >= u.y0 && h <= u.y1) && !n.some((u) => Math.abs(u - o) < 4) && !s.some((u) => Math.abs(u - o) < 5);
    };
    return (o, r, a) => {
      let h = o;
      for (; !i(h, r, a) && h < X - 8; ) h += 3;
      return h >= X - 8 && (h = o), s.push(h), h;
    };
  }
  /** Vertical space between two load groups. */
  get _groupGap() {
    return 16;
  }
  _sumW(t) {
    return t.reduce((e, n) => {
      const s = this._w(n.entity);
      return s === null ? e : (e ?? 0) + s;
    }, null);
  }
  /** One group as a vertical list, biggest consumer on top: name, power, energy.
   *  Every row knows the feed path (`trunk`) from its source; a running load
   *  gets its own dot that travels the trunk and on to its row. */
  _loadList(t, e, n) {
    const s = this._rowH, i = s / 2 - 1, o = (l) => l.w !== null && Math.abs(l.w) >= A, r = (l) => E(this._s(l.today)) ?? 0, a = (l, w) => this._idleByEnergy ? Number(o(w)) - Number(o(l)) || (o(l) ? w.w - l.w : r(w) - r(l)) || l.name.localeCompare(w.name) : (w.w ?? -1 / 0) - (l.w ?? -1 / 0) || l.name.localeCompare(w.name), h = t.map((l) => ({ ...l, w: this._w(l.entity), name: l.label ?? this._name(l.entity) })).sort(a), d = [];
    for (const l of h) {
      const w = d.length;
      d.push({ ...l, child: !1 });
      const b = (l.children ?? []).map((v) => ({ ...l, ...v, children: void 0, label: void 0, w: this._w(v.entity), name: this._name(v.entity) })).sort(a);
      for (const v of b) d.push({ ...v, child: !0, parentRow: w });
    }
    const u = this._rowEntryX, $ = (l, w) => `${l.route ?? l.trunk} V ${e + w * s + i} H ${u}`, p = (l, w) => `${$(l, l.parentRow ?? 0)} H ${V + 4} V ${e + w * s + i} H ${V + 10}`, f = (l) => {
      const w = d[l].w;
      if (w === null) return null;
      const b = d.filter((v) => v.child && v.parentRow === l).reduce((v, R) => v + Math.max(R.w ?? 0, 0), 0);
      return Math.max(w - b, 0);
    }, g = (l, w) => l.child ? l.w : f(w), _ = d.map((l, w) => ({ l, i: w, w: g(l, w) })).filter(({ w: l }) => l !== null && Math.abs(l) >= A), m = this._wagonSpeed, y = _.flatMap(
      ({ l, i: w, w: b }) => (this._wagonBalls(b, n) ?? [void 0]).map((v) => ({ l, i: w, radius: v?.r, tint: v?.colour }))
    );
    y.some((l) => l.radius !== void 0) && y.sort((l, w) => (w.radius ?? 0) - (l.radius ?? 0));
    let k = 0;
    const H = y.map(({ l, i: w, radius: b, tint: v }, R) => (R && (k += b === void 0 ? Le : (y[R - 1].radius ?? 0) + b + 2.5), { i: w, radius: b, tint: v, begin: k / m, travel: Et(l.child ? p(l, w) : $(l, w)) / m })), z = Math.max(1, ...H.map((l) => l.begin + l.travel)) + He, M = /* @__PURE__ */ new Map();
    for (const l of H)
      M.set(l.i, [...M.get(l.i) ?? [], { period: z, begin: l.begin, travel: l.travel, radius: l.radius, tint: l.tint }]);
    const T = (l, w, b) => (M.get(b) ?? []).map((v) => this._dot(l, v.tint ?? n, w, !0, 2.4, v)), F = d.reduce((l, w, b) => w.child ? l : b, 0), P = this._pipeTrunk ? t[0]?.trunk : void 0, J = [
      ...P ? [P] : [],
      `M ${X} ${P ? e + i : e + 4} V ${e + F * s + i}`,
      ...d.flatMap((l, w) => l.child ? [] : [`M ${X} ${e + w * s + i} H ${u}`])
    ].join(" ");
    return c`
      ${this._branch(J, n, "row")}
      ${d.map((l, w) => {
      const b = e + w * s, v = l.w === null || Math.abs(l.w) < A;
      if (l.child) {
        const D = e + (l.parentRow ?? 0) * s + s - 3, st = `${l.name} · enthalten in ${d[l.parentRow ?? 0].name}`;
        return c`
            ${this._branch(`M ${V + 4} ${D} V ${b + i} H ${V + 10}`, n, "child")}
            ${this._bySize ? T(p(l, w), l.w, w) : x}
            <g opacity=${v ? 0.45 : 0.85}>
              ${this._nameBox(l.name, b, n, st, 12)}
              ${this._valueCell(nt - W, b + 1, W, s - 4, n, I(l.w, this._loc), 9, "power")}
            </g>
            ${this._valueCell(U - tt, b + 1, tt, s - 4, n, S(E(this._s(l.today)), this._loc), 8.5, "energy")}`;
      }
      const R = l.tip ?? (l.source ? `${l.name} · gespeist von ${l.source}` : l.name);
      return c`
          ${this._bySize ? T($(l, w), f(w), w) : this._dot($(l, w), n, l.w, !0, 2.4)}
          <g opacity=${v ? 0.45 : 1}>
            ${this._nameBox(l.name, b, n, R)}
            ${this._valueCell(nt - W, b + 1, W, s - 4, n, I(l.w, this._loc), 9, "power")}
          </g>
          ${this._valueCell(U - tt, b + 1, tt, s - 4, n, S(E(this._s(l.today)), this._loc), 8.5, "energy")}`;
    })}
    `;
  }
  /** Power or energy of one list row. */
  _valueCell(t, e, n, s, i, o, r, a) {
    return this._box(t, e, n, s, i, o, r);
  }
  /** Name of a load in a rounded box; long names wrap to two smaller lines. */
  _nameBox(t, e, n, s = t, i = 0) {
    const o = V - 2 + i, r = nt - W - 4 - o, { lines: a, small: h } = i ? Tt(t, 9, 12) : Tt(t, 11, 15);
    return c`<g>
      <title>${s}</title>
      <rect x=${o} y=${e + 1} width=${r} height="18" rx="4" fill="none" stroke=${n} stroke-width="1" />
      ${h ? c`<text x=${o + 4} y=${e + 9} class="name" font-size=${this._fs(7.5)}>${a[0]}</text>
              <text x=${o + 4} y=${e + 17} class="name" font-size=${this._fs(7.5)}>${a[1] ?? ""}</text>` : c`<text x=${o + 4} y=${e + 13.5} class="name" font-size=${this._fs(10)}>${a[0]}</text>`}
    </g>`;
  }
  _groupTitle(t, e, n, s, i) {
    const o = i.reduce((r, a) => {
      const h = E(this._s(a.today));
      return h === null ? r : (r ?? 0) + h;
    }, null);
    return c`
      <text x=${X} y=${t} class="small grp" fill=${e}>${n}</text>
      <text x=${nt - W / 2} y=${t} text-anchor="middle" class="small grp" fill=${e}>${I(s, this._loc)}</text>
      <text x=${U - tt / 2} y=${t} text-anchor="middle" class="small grp" fill=${e}>${S(o, this._loc)}</text>`;
  }
  /** Total svg height needed for the load lists and the batteries. */
  get _viewH() {
    if (!this._layout) return Dt;
    const t = this._groups(), e = t[t.length - 1], n = e ? e.y0 + e.rows * this._rowH + 8 : 0, s = this._displayBatteries(), i = s.length ? Math.max(...s.map((o) => o.top)) + this._batteryTail : 0;
    return Math.max(this._minViewH, n, i);
  }
  /** House symbol above the house value (area 226..274 x 16..64). */
  _houseIcon(t) {
    return this._icon(Ce, 226, 16, 48, t);
  }
  /** Background behind a load group (none in the classic look). */
  _groupPanel(t) {
    return c``;
  }
  /** Small symbol next to a group title. */
  _groupIcon(t) {
    return t.title === "Wallbox" ? this._icon(Ae, X + 46, t.titleY - 11, 14, t.colour) : c``;
  }
  _home() {
    const t = this._layout, e = this._c.home, n = this._own("home_power"), s = this._own("unmeasured_power"), i = this._groups(), o = `M ${this._invTop[0]} ${this._invTop[1]} V ${Math.min(152, this._invTop[1] - 8)} H 250 V 96`;
    return c`
      ${this._houseIcon(e)}
      ${s !== null && !this._unmeasuredInList ? c`<text x="256" y="112" class="tiny">nicht erfasst</text>
              <text x="256" y="122" class="tiny val">${I(s, this._loc)}</text>` : x}
      ${this._flow(o, e, n, !0, !1)}
      ${this._houseDots(this._houseIn() ?? o, e, n)}
      ${this._houseJunction(n)}
      ${i.length ? c`<text x=${U - tt / 2} y="9" text-anchor="middle" class="tiny">${t.energy_period === "rolling24" ? "24 h" : "heute"}</text>` : x}
      ${i.map(
      (r) => c`
          ${this._groupPanel(r)}
          ${this._groupTitle(r.titleY, r.colour, r.title, r.power, r.all)}
          ${this._groupIcon(r)}
          ${this._pipeTrunk ? x : this._flow(r.trunk, r.colour, r.power, !0, !1)}
          ${this._loadList(r.loads, r.y0, r.colour)}
          ${r.more ? this._moreRow(r) : x}
        `
    )}
      ${this._box(215, 70, 70, 26, e, I(n, this._loc), 13)}
      <text x="211" y="83" text-anchor="end" class="lbl">Haus</text>
      <text x="211" y="95" text-anchor="end" class="tiny val">${S(E(this._s(t.home_today)), this._loc)}</text>
    `;
  }
  /** Current grid values: power, direction, price and today's import / export. */
  _gridData() {
    const t = this._layout, e = this._own("grid_power"), n = (e ?? 0) < -A, s = n ? t.grid.export_price ? jt(this._s(t.grid.export_price)) : t.grid.export_price_fixed ?? null : jt(this._s(t.grid.price));
    return {
      grid: e,
      exporting: n,
      cents: s,
      label: e === null ? "" : e > A ? "Bezug" : n ? "Einspeisung" : "",
      power: I(e === null ? null : Math.abs(e), this._loc),
      imp: ht(this._s(t.grid.import_today)),
      exp: ht(this._s(t.grid.export_today))
    };
  }
  _grid() {
    const t = this._c.grid, { grid: e, exporting: n, cents: s, label: i, power: o, imp: r, exp: a } = this._gridData();
    return c`
      ${this._flow(`M ${this._invX} ${this._invY + 42} H 84`, t, e, n)}
      ${this._panel(10, 192, 74, 40, t)}
      <text x="47" y=${s === null ? 217 : 209} text-anchor="middle" class="val" font-size=${this._fs(13)}>${o}</text>
      ${s !== null ? c`<text x="47" y="225" text-anchor="middle" class="tiny" fill=${t}>${ie(s, this._loc)}</text>` : x}
      <text x="90" y="207" class="tiny">${i}</text>
      ${this._icon(ze, 27, 240, 40, t)}
      ${r !== null ? c`<text x="10" y="292" class="small" fill=${t}>↓ ${S(r, this._loc)}<tspan class="tiny"> Bezug</tspan></text>` : x}
      ${a !== null ? c`<text x="10" y="305" class="small">↑ ${S(a, this._loc)}<tspan class="tiny"> Einspeisung</tspan></text>` : x}
    `;
  }
  // -- render -----------------------------------------------------------------
  render() {
    if (this._error)
      return Z`<ha-card><div class="msg">${this._error}</div></ha-card>`;
    if (!this._layout || !this.hass)
      return Z`<ha-card><div class="msg">Lade Energiefluss …</div></ha-card>`;
    const t = this._config?.title;
    return Z`
      <ha-card .header=${t ?? x}>
        <svg viewBox=${`0 0 ${ke} ${this._viewH}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Energiefluss">
          ${this._defs()} ${this._solar()} ${this._batteries()} ${this._inverter()} ${this._home()} ${this._grid()}
        </svg>
      </ha-card>
    `;
  }
};
Ft.styles = Pt`
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
    .more {
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
let N = Ft;
lt([
  oe({ attribute: !1 })
], N.prototype, "hass");
lt([
  Q()
], N.prototype, "_config");
lt([
  Q()
], N.prototype, "_layout");
lt([
  Q()
], N.prototype, "_error");
lt([
  Q()
], N.prototype, "_expanded");
customElements.get("energiefluss-card") || customElements.define("energiefluss-card", N);
window.customCards = window.customCards ?? [];
window.customCards.some((C) => C.type === "energiefluss-card") || window.customCards.push({
  type: "energiefluss-card",
  name: "Energiefluss",
  description: "Animierter Energiefluss – konfiguriert über die Energiefluss-Integration.",
  preview: !0
});
const Te = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-air-conditioning"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M8 16a3 3 0 0 1 -3 3" />
  <path d="M16 16a3 3 0 0 0 3 3" />
  <path d="M12 16v4" />
  <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -4" />
  <path d="M7 13v-3a1 1 0 0 1 1 -1h8a1 1 0 0 1 1 1v3" />
</svg>`, Ve = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-battery-2"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6 7h11a2 2 0 0 1 2 2v.5a.5 .5 0 0 0 .5 .5a.5 .5 0 0 1 .5 .5v3a.5 .5 0 0 1 -.5 .5a.5 .5 0 0 0 -.5 .5v.5a2 2 0 0 1 -2 2h-11a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2" />
  <path d="M7 10l0 4" />
  <path d="M10 10l0 4" />
</svg>`, Be = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-bulb"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7" />
  <path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3" />
  <path d="M9.7 17l4.6 0" />
</svg>`, Ie = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-car"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
</svg>`, Se = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-charging-pile"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M18 7l-1 1" />
  <path d="M14 11h1a2 2 0 0 1 2 2v3a1.5 1.5 0 0 0 3 0v-7l-3 -3" />
  <path d="M4 20v-14a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v14" />
  <path d="M9 11.5l-1.5 2.5h3l-1.5 2.5" />
  <path d="M3 20l12 0" />
  <path d="M4 8l10 0" />
</svg>`, Pe = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-coffee"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 14c.83 .642 2.077 1.017 3.5 1c1.423 .017 2.67 -.358 3.5 -1c.83 -.642 2.077 -1.017 3.5 -1c1.423 -.017 2.67 .358 3.5 1" />
  <path d="M8 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
  <path d="M12 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
  <path d="M3 10h14v5a6 6 0 0 1 -6 6h-2a6 6 0 0 1 -6 -6v-5" />
  <path d="M16.746 16.726a3 3 0 1 0 .252 -5.555" />
</svg>`, Oe = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-cooker"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 7h.01" />
  <path d="M15 7h.01" />
  <path d="M9 7h.01" />
  <path d="M5 5a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -14" />
  <path d="M9 15h6" />
  <path d="M5 11h14" />
</svg>`, Fe = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-device-desktop"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10" />
  <path d="M7 20h10" />
  <path d="M9 16v4" />
  <path d="M15 16v4" />
</svg>`, Re = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-droplet"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M7.502 19.423c2.602 2.105 6.395 2.105 8.996 0c2.602 -2.105 3.262 -5.708 1.566 -8.546l-4.89 -7.26c-.42 -.625 -1.287 -.803 -1.936 -.397a1.376 1.376 0 0 0 -.41 .397l-4.893 7.26c-1.695 2.838 -1.035 6.441 1.567 8.546" />
</svg>`, Ne = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-flame"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 10.941c2.333 -3.308 .167 -7.823 -1 -8.941c0 3.395 -2.235 5.299 -3.667 6.706c-1.43 1.408 -2.333 3.294 -2.333 5.588c0 3.704 3.134 6.706 7 6.706c3.866 0 7 -3.002 7 -6.706c0 -1.712 -1.232 -4.403 -2.333 -5.588c-2.084 3.353 -3.257 3.353 -4.667 2.235" />
</svg>`, Ye = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-fridge"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 5a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -14" />
  <path d="M5 10h14" />
  <path d="M9 13v3" />
  <path d="M9 6v1" />
</svg>`, je = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-home"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
  <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
  <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
</svg>`, De = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-lamp"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M9 20h6" />
  <path d="M12 20v-8" />
  <path d="M5 12h14l-4 -8h-6l-4 8" />
</svg>`, Ge = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-microwave"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 7a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1l0 -10" />
  <path d="M15 6v12" />
  <path d="M18 12h.01" />
  <path d="M18 15h.01" />
  <path d="M18 9h.01" />
  <path d="M6.5 10.5c1 -.667 1.5 -.667 2.5 0c.833 .347 1.667 .926 2.5 0" />
  <path d="M6.5 13.5c1 -.667 1.5 -.667 2.5 0c.833 .347 1.667 .926 2.5 0" />
</svg>`, Xe = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-plug"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M9.785 6l8.215 8.215l-2.054 2.054a5.81 5.81 0 1 1 -8.215 -8.215l2.054 -2.054" />
  <path d="M4 20l3.5 -3.5" />
  <path d="M15 4l-3.5 3.5" />
  <path d="M20 9l-3.5 3.5" />
</svg>`, We = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-pool"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M2 20a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1" />
  <path d="M2 16a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1" />
  <path d="M15 12v-7.5a1.5 1.5 0 0 1 3 0" />
  <path d="M9 12v-7.5a1.5 1.5 0 0 0 -3 0" />
  <path d="M15 5l-6 0" />
  <path d="M9 10l6 0" />
</svg>`, Ue = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-router"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 15a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -4" />
  <path d="M17 17l0 .01" />
  <path d="M13 17l0 .01" />
  <path d="M15 13l0 -2" />
  <path d="M11.75 8.75a4 4 0 0 1 6.5 0" />
  <path d="M8.5 6.5a8 8 0 0 1 13 0" />
</svg>`, Ze = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-server"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-2" />
  <path d="M3 15a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -2" />
  <path d="M7 8l0 .01" />
  <path d="M7 16l0 .01" />
</svg>`, qe = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-solar-panel"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M4.28 14h15.44a1 1 0 0 0 .97 -1.243l-1.5 -6a1 1 0 0 0 -.97 -.757h-12.44a1 1 0 0 0 -.97 .757l-1.5 6a1 1 0 0 0 .97 1.243" />
  <path d="M4 10h16" />
  <path d="M10 6l-1 8" />
  <path d="M14 6l1 8" />
  <path d="M12 14v4" />
  <path d="M7 18h10" />
</svg>`, Ke = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-building-broadcast-tower"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  <path d="M16.616 13.924a5 5 0 1 0 -9.23 0" />
  <path d="M20.307 15.469a9 9 0 1 0 -16.615 0" />
  <path d="M9 21l3 -9l3 9" />
  <path d="M10 19h4" />
</svg>`, Qe = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-device-tv"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 9a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -9" />
  <path d="M16 3l-4 4l-4 -4" />
</svg>`, Je = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-vacuum-cleaner"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M21 12a9 9 0 1 1 -18 0a9 9 0 0 1 18 0" />
  <path d="M14 9a2 2 0 1 1 -4 0a2 2 0 0 1 4 0" />
  <path d="M12 16h.01" />
</svg>`, tn = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-wash-machine"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 5a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -14" />
  <path d="M8 14a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
  <path d="M8 6h.01" />
  <path d="M11 6h.01" />
  <path d="M14 6h2" />
  <path d="M8 14c1.333 -.667 2.667 -.667 4 0c1.333 .667 2.667 .667 4 0" />
</svg>`;
function L(C) {
  return [...C.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((t) => t[1]).filter((t) => t !== "M0 0h24v24H0z");
}
const en = {
  airConditioning: L(Te),
  battery: L(Ve),
  bulb: L(Be),
  car: L(Ie),
  chargingPile: L(Se),
  coffee: L(Pe),
  cooker: L(Oe),
  desktop: L(Fe),
  droplet: L(Re),
  flame: L(Ne),
  fridge: L(Ye),
  home: L(je),
  lamp: L(De),
  microwave: L(Ge),
  plug: L(Xe),
  pool: L(We),
  router: L(Ue),
  server: L(Ze),
  solarPanel: L(qe),
  tower: L(Ke),
  tv: L(Qe),
  vacuum: L(Je),
  washMachine: L(tn)
}, nn = [
  [/k(ü|ue)hl|gefrier|fridge|freez/, "fridge"],
  [/wasch|washer|trockn|dryer/, "washMachine"],
  [/klima|air.?con|\bac\b|split/, "airConditioning"],
  [/wallbox|lade(station|punkt)|charger|evcc/, "chargingPile"],
  [/\bauto\b|\bcar\b|tesla|e.?auto/, "car"],
  [/\btv\b|fernseh|television/, "tv"],
  [/b(ü|ue)ro|office|\bpc\b|computer|desktop|rechner/, "desktop"],
  [/router|netzwerk|switch|fritz|wlan/, "router"],
  [/server|\bnas\b|synology/, "server"],
  [/heiz|heater|therme|w(ä|ae)rmepumpe|heat|boiler/, "flame"],
  [/kocher|kettle|kaffee|coffee|espresso/, "coffee"],
  [/dusch|warmwasser|wasser|shower|durchlauf/, "droplet"],
  [/mikro|microwave/, "microwave"],
  [/herd|ofen|oven|cooker|backofen/, "cooker"],
  [/pool|pumpe|pump/, "pool"],
  [/staubsaug|vacuum|robo/, "vacuum"],
  [/lampe|lamp|licht|light|leuchte/, "lamp"],
  [/ecoflow|powerstation|akku|speicher|batter/, "battery"]
];
function sn(C) {
  const t = C.toLowerCase();
  return nn.find(([e]) => e.test(t))?.[1] ?? "plug";
}
const O = {
  file: "car-glass.png",
  width: 420,
  height: 269,
  tank: "82.5,161.1 80.5,141.8 85.4,118.6 100.8,102.2 125.9,83.9 135.5,76.7 168.3,38.1 187.6,25.1 226.2,11.6 264.7,2.9 293.7,7.7 325.0,25.1 339.5,40.5 355.4,64.6 362.6,83.9 360.2,97.4 349.1,92.6 337.1,92.6 326.5,99.3 320.7,112.8 318.7,136.0 226.2,174.6 222.3,163.0 211.7,156.2 197.2,157.2 187.6,165.9 182.8,180.3 181.8,203.5 158.6,199.6 100.8,180.3",
  floorQuad: [[80.5, 154.8], [168.3, 199.6], [361.2, 119.1], [273.4, 74.3]],
  liquidHeight: 96.4,
  powerText: [28.5, 166.8],
  energyText: [240.6, 229.5],
  edgeAngle: 27.4,
  wallboxTop: [385.3, 21.2]
}, q = {
  file: "inverter-glass.png",
  width: 300,
  height: 278,
  top: [115.7, 23.5],
  bottom: [100.2, 221.8],
  left: [[18.7, 61], [18.7, 99.1], [18.7, 138.1]]
}, on = {
  solar: "#ffd43b",
  // yellow, clearly apart from the other sources
  battery: "#3ee08f",
  grid: "#4db2ff",
  home: "#2fd4b4",
  flexible: "#6f9dff",
  backup: "#ff6a3d",
  inverter: "#a8d4ff"
}, B = "#cfeaff", rn = [
  [0, -2.2, 2.2, 0],
  [1.6, 2.4, -1.8, -1.2],
  [-1.2, -1, 2, 1.4],
  [0.8, 2.2, -2.4, 0.4]
], pt = 26, an = 2.5, ln = 0.7, ft = 72, cn = 0.6, hn = 0.7, Mt = 5.2, qt = 2.7, mt = 32, it = [8, 8 + mt + 4], Vt = it[1] + mt + 6, ot = [104, Vt + 26], ut = [250, 96], Bt = 196, $t = Bt, Kt = "0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1", Lt = (C, t = 0, e = 0) => C.map(([n, s, i, o]) => `M ${n + t} ${s + e} L ${i + t} ${o + e}`).join(" "), Qt = [
  [22, 40, 8, 86],
  [34, 40, 48, 86],
  [24, 10, 22, 40],
  [32, 10, 34, 40],
  [24, 10, 28, 2],
  [32, 10, 28, 2]
], Jt = [
  [12, 12, 44, 12],
  [12, 12, 23.5, 17],
  [44, 12, 32.5, 17],
  [6, 24, 50, 24],
  [6, 24, 22.7, 30],
  [50, 24, 33.3, 30],
  [2, 36, 54, 36],
  [2, 36, 22, 40],
  [54, 36, 34, 40]
], dn = [
  [23.9, 12, 32.9, 24],
  [32.1, 12, 23.1, 24],
  [23.1, 24, 33.7, 36],
  [32.9, 24, 22.3, 36],
  [22, 40, 34, 40],
  [15.9, 60, 40.1, 60],
  [22, 40, 40.1, 60],
  [34, 40, 15.9, 60],
  [15.9, 60, 48, 86],
  [40.1, 60, 8, 86]
], pn = [
  [8, 86, 15, 82],
  [48, 86, 55, 82],
  [22, 40, 29, 36],
  [34, 40, 41, 36],
  [28, 2, 35, -2]
], Ht = [
  [12, 12],
  [44, 12],
  [6, 24],
  [50, 24],
  [2, 36],
  [54, 36]
], te = 10, ee = 122, Ct = 0.7, et = 8, _t = 64, ne = 196, xt = 0.24, yt = [250, 116], fn = import.meta.url.replace(/[^/]*$/, "") + q.file, It = ([C, t]) => [
  yt[0] + (C - q.top[0]) * xt,
  yt[1] + (t - q.top[1]) * xt
], gt = q.left.map(It), zt = 2, At = 120, un = import.meta.url.replace(/[^/]*$/, "") + O.file, $n = [
  [0, 0, 0, 0],
  [4, -1.5, -4, 1.5],
  [-1.5, 3, 1.5, -3],
  [-4, 1.5, 4, -1.5]
], _n = [
  [28, 2],
  [22, 40],
  [34, 40],
  [15.9, 60],
  [40.1, 60],
  [8, 86],
  [48, 86]
], Rt = class Rt extends N {
  get _c() {
    return { ...on, ...this._config?.colours ?? {} };
  }
  // inverter centred under the house; wallbox sits on the left below the pylon
  get _invX() {
    return gt[0][0];
  }
  get _solarX() {
    return 104;
  }
  get _invY() {
    return yt[1];
  }
  get _invTop() {
    return yt;
  }
  get _invBottom() {
    return It(q.bottom);
  }
  get _solarY() {
    return gt[0][1];
  }
  get _unmeasuredInList() {
    return !0;
  }
  get _wallboxInList() {
    return !1;
  }
  // backup pipes end at the glass shell of the battery cylinder (see _batteryWidget)
  _batteryOutX(t, e) {
    return t + e / 2 - 2;
  }
  // storage area a bit to the right; with five batteries the backup lanes leave less room
  _batteryShift(t) {
    return t >= 5 ? 6 : 14;
  }
  // as low as the content allows (aiming at about 16:9)
  get _minViewH() {
    return 300;
  }
  // the glass battery ends at top + BAT_H (shadow below), little room below it
  get _batteryTail() {
    return ft + 12;
  }
  // batteries closer together in height than in the classic look
  _displayBatteries() {
    const t = Bt + 50;
    return super._displayBatteries().map((e) => ({ ...e, top: t + (e.top - t) * cn }));
  }
  // denser lists: rows of 15 instead of 22
  get _stringPos() {
    return [
      [10, it[0]],
      [80, it[0]],
      [10, it[1]],
      [80, it[1]]
    ];
  }
  get _pvBoxY() {
    return Vt;
  }
  get _storeY() {
    return Bt;
  }
  get _rowH() {
    return 15;
  }
  _fs(t) {
    return +(t * hn).toFixed(2);
  }
  // each group's feed is one pipe with its list's bracket and branches
  get _pipeTrunk() {
    return !0;
  }
  // glass pipes run right up to each load's symbol
  get _rowEntryX() {
    return V - 1;
  }
  _branch(t, e, n) {
    return c`<g class=${`pipe ${n}`}>
      <path d=${t} class="rim" />
      <path d=${t} class="bore" />
      <path d=${t} class="tint" stroke=${e} />
      <path d=${t} class="shine" />
    </g>`;
  }
  // long lists: only the biggest daily consumers, the rest folds away
  _listLimit(t) {
    return t === "Grundlast" ? 8 : t === "Zusätzlich" ? 3 : null;
  }
  get _idleByEnergy() {
    return !0;
  }
  get _groupGap() {
    return 16;
  }
  /** Gradients for glass, shadows, liquid and the halos of the balls. */
  _defs() {
    const t = this._c;
    return c`<defs>
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
        <stop offset="0.12" stop-color=${t.battery} stop-opacity="0.85" />
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
      ${Object.entries(t).map(
      ([e, n]) => c`<radialGradient id=${`ef-halo-${e}`}>
          <stop offset="0" stop-color=${n} stop-opacity="0.55" />
          <stop offset="0.45" stop-color=${n} stop-opacity="0.18" />
          <stop offset="1" stop-color=${n} stop-opacity="0" />
        </radialGradient>`
    )}
    </defs>`;
  }
  // -- lines and balls ---------------------------------------------------------
  /** Glass tube: bright rim, dark bore tinted with the flow colour, a sheen line. */
  _flow(t, e, n, s, i = !0) {
    const o = n !== null && Math.abs(n) >= A;
    return c`<g class="tube">
        <path d=${t} class="rim" />
        <path d=${t} class="bore" />
        <path d=${t} class="tint" stroke=${e} stroke-opacity=${o ? 0.24 : 0.08} />
        <path d=${t} class="shine" />
      </g>
      ${i ? this._dot(t, e, n, s) : x}`;
  }
  /** The train on path `d`: radius and start time of each ball, travel time and period. */
  _trainOf(t, e) {
    const n = dt(e).map((a) => a === "big" ? Mt : qt), s = [];
    let i = 0;
    n.forEach((a, h) => {
      h && (i += n[h - 1] + a + an), s.push(i / pt);
    });
    const o = Et(t) / pt, r = o + s[s.length - 1] + ln;
    return { radii: n, begins: s, travel: o, period: r };
  }
  /**
   * Lines without their own train logic (everything except the load lists)
   * get a train of balls instead of one ball whose speed or size shows the power.
   */
  _dot(t, e, n, s = !0, i = 3.2, o) {
    if (o) return super._dot(t, e, n, s, i, o);
    if (n === null || Math.abs(n) < A) return c``;
    const { radii: r, travel: a, period: h, begins: d } = this._trainOf(t, n);
    return c`${d.map(
      (u, $) => this._ball(e, { route: t, forward: s, r: r[$], begin: u, travel: a, period: h })
    )}`;
  }
  /** One ball riding its route once per period. */
  _ball(t, e) {
    const n = (e.travel / e.period).toFixed(4), s = `${e.period.toFixed(2)}s`, i = `${e.begin.toFixed(2)}s`;
    return this._orb(
      e.r,
      t,
      c`<animateMotion dur=${s} begin=${i} repeatCount="indefinite" calcMode="linear" rotate="auto"
          keyPoints=${e.forward ? "0;1;1" : "1;0;0"} keyTimes=${`0;${n};1`} path=${e.route} />
        <animate attributeName="opacity" dur=${s} begin=${i} repeatCount="indefinite" calcMode="discrete"
          values="1;0" keyTimes=${`0;${n}`} />`,
      !0
    );
  }
  /**
   * Where lines meet in a glass box, the trains are counted anew: the strings'
   * trains end inside the PV total box and the box sends one train with the
   * total PV power to the inverter; the storage box sends one train with the
   * total battery power to or from the inverter and one per battery.
   */
  _trainDots(t, e, n) {
    const s = (p) => t === "battery" && !p ? this._c.battery : e, i = (p, f, g) => t === "battery" && g ? this._mixedTrain(p, f) : this._dot(p, s(g), f, g), o = n.map((p) => i(p.route, p.w, p.forward));
    if (t === "pv") {
      const p = `M ${ot[0]} ${ot[1]} V ${this._solarY} H ${this._invX}`, f = this._own("solar_power"), g = n.flatMap((_) => this._arrivals(_.route, _.w));
      return c`${o}${this._dot(p, e, f, !0)}${this._blob(ot, e, f, g)}`;
    }
    const r = this._own("battery_power"), [a, h] = this._invBottom, d = `M ${a.toFixed(1)} ${h.toFixed(1)} V ${$t}`, u = (r ?? 0) > 0, $ = [
      ...u ? this._arrivals(d, r) : [],
      ...n.filter((p) => !p.forward).flatMap((p) => this._arrivals(p.route, p.w))
    ];
    return c`${o}${i(d, r, u)}${this._blob([a, $t], s(u), Math.abs(r ?? 0), $)}`;
  }
  /** When the balls of a train on `route` finish their way (at its end, or at its
   *  start for a train running backwards). */
  _arrivals(t, e) {
    if (e === null || Math.abs(e) < A) return [];
    const { radii: n, begins: s, travel: i, period: o } = this._trainOf(t, e);
    return s.map((r, a) => ({ at: r + i, period: o, big: n[a] === Mt }));
  }
  /**
   * A drop of mercury where trains meet: its size shows the power that flows
   * through, it wobbles all the time and swells for a moment whenever a ball
   * runs into it (additive animations, one per arriving ball).
   */
  _blob([t, e], n, s, i) {
    if (s === null || Math.abs(s) < A) return c``;
    const o = 2.2 + 1.6 * Math.sqrt(Math.min(Math.abs(s), 8e3) / 1e3), r = Object.entries(this._c).find(([, d]) => d === n)?.[0], a = (d, u) => {
      const $ = (d.big ? 1.4 : 0.6) * (u === "rx" ? 1.15 : 0.85), p = Math.min(0.2, 0.12 / d.period), f = Math.min(0.6, 0.55 / d.period);
      return c`<animate attributeName=${u} additive="sum" dur=${`${d.period.toFixed(2)}s`}
        begin=${`${d.at.toFixed(2)}s`} repeatCount="indefinite" values=${`0;${$};0;0`}
        keyTimes=${`0;${p.toFixed(4)};${f.toFixed(4)};1`} />`;
    }, h = (d, u, $) => {
      const p = d === "rx" ? [1, 1.1, 0.94, 1] : [1, 0.92, 1.07, 1];
      return c`<animate attributeName=${d} dur=${`${u}s`} begin=${`${$}s`} repeatCount="indefinite"
        calcMode="spline" keyTimes="0;0.33;0.66;1" keySplines=${"0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1"}
        values=${p.map((f) => (o * f).toFixed(2)).join(";")} />`;
    };
    return c`<g>
      <circle cx=${t} cy=${e} r=${o * 2.6} fill=${r ? `url(#ef-halo-${r})` : n} fill-opacity=${r ? x : 0.2} />
      <ellipse cx=${t} cy=${e} rx=${o} ry=${o} fill=${n}>
        ${h("rx", 1.7, 0)}${h("ry", 1.7, 0)}
        ${i.map((d) => c`${a(d, "rx")}${a(d, "ry")}`)}
      </ellipse>
      <ellipse cx=${t} cy=${e} rx=${o} ry=${o} fill="url(#ef-ball)">
        ${h("rx", 1.7, 0)}${h("ry", 1.7, 0)}
        ${i.map((d) => c`${a(d, "rx")}${a(d, "ry")}`)}
      </ellipse>
      <ellipse cx=${t - o * 0.32} cy=${e - o * 0.38} rx=${o * 0.4} ry=${o * 0.24} fill="#ffffff" fill-opacity="0.85" />
    </g>`;
  }
  // the house power runs into a blob in the house box; the load trains leave it
  _houseJunction(t) {
    return this._blob(ut, this._c.home, t, this._arrivals(this._houseIn(), t));
  }
  /** Glowing glass ball: soft halo, coloured body, white core and a sheen. */
  _orb(t, e, n, s = !1) {
    const i = t, o = Object.entries(this._c).find(([, r]) => r === e)?.[0];
    return c`<g opacity=${s ? "0" : x}>
      ${n}
      <circle r=${i * 2.8} fill=${o ? `url(#ef-halo-${o})` : e} fill-opacity=${o ? x : 0.18} />
      <circle r=${i} fill=${e} />
      <circle r=${i} fill="url(#ef-ball)" />
      <circle cx=${-0.3 * i} cy=${-0.35 * i} r=${i * 0.38} fill="#ffffff" fill-opacity="0.85" />
    </g>`;
  }
  // -- glass building blocks -----------------------------------------------------
  /** A glass slab: drop shadow, tinted body, frosted gradient and a top sheen. */
  _panel(t, e, n, s, i) {
    const o = Math.min(7, s / 3);
    return c`<g>
      <rect x=${t + 1} y=${e + 2.5} width=${n} height=${s} rx=${o} fill="#020a14" fill-opacity="0.32" />
      <rect x=${t} y=${e} width=${n} height=${s} rx=${o} fill=${i} fill-opacity="0.1" />
      <rect x=${t} y=${e} width=${n} height=${s} rx=${o} fill="url(#ef-slab)" stroke=${i} stroke-opacity="0.55"
        stroke-width="0.9" />
      <rect x=${t + 1.5} y=${e + 1.2} width=${n - 3} height=${Math.min(s * 0.42, 12)} rx=${Math.max(1, o - 1)}
        fill="url(#ef-sheen)" />
    </g>`;
  }
  /** A Tabler line icon at (x, y), `size` px. */
  _line(t, e, n, s, i) {
    return c`<g transform=${`translate(${e} ${n}) scale(${s / 24})`} fill="none" stroke=${i} stroke-width="1.7"
      stroke-linecap="round" stroke-linejoin="round">${en[t].map((o) => c`<path d=${o} />`)}</g>`;
  }
  // -- sections ------------------------------------------------------------------
  _solarIcon() {
    return c``;
  }
  _stringTile(t, e, n, s) {
    return c`
      ${this._panel(t, e, 60, mt, s)}
      ${this._line("solarPanel", t + 25, e + 3, 10, s)}
      <text x=${t + 30} y=${e + 21} text-anchor="middle" class="val" font-size=${this._fs(11)}>${I(this._w(n), this._loc)}</text>
      <text x=${t + 30} y=${e + 29} text-anchor="middle" class="tiny">${rt(this._name(n), 13)}</text>`;
  }
  /** The glass inverter picture, placed by its connectors. */
  _inverter() {
    const [t, e] = It([0, 0]);
    return c`<image href=${fn} x=${t.toFixed(1)} y=${e.toFixed(1)}
      width=${(q.width * xt).toFixed(1)} height=${(q.height * xt).toFixed(1)} />`;
  }
  /** Glass cylinder with a moving liquid level; name, SoC, kWh, power, status inside. */
  _batteryWidget(t, e, n, s, i, o, r, a, h = null) {
    const d = e - s / 2 + 2, u = e + s / 2 - 2, $ = (u - d) / 2, p = 3.5, f = n + 8, g = n + ft, _ = Math.max(0, Math.min(100, o ?? 0)), m = g + p - (g + p - f) * (_ / 100), y = `ef-bat-${Math.round(e)}-${Math.round(n)}`, k = `M ${d} ${f} V ${g} A ${$} ${p} 0 0 0 ${u} ${g} V ${f} A ${$} ${p} 0 0 0 ${d} ${f} Z`, H = i !== null && Math.abs(i) >= A, z = i !== null && i > A, M = H ? 3.4 : 5.5, T = i !== null && i < -A, F = s < 54, P = h && o !== null ? S(h * o / 100, this._loc) : "";
    return c`<g>
      <ellipse cx=${e} cy=${g + 4} rx=${$ + 8} ry="6" fill="url(#ef-shadow)" />
      <clipPath id=${y}><path d=${k} /></clipPath>
      <path d=${k} fill=${a} fill-opacity="0.07" />
      ${_ > 0 ? c`<g clip-path=${`url(#${y})`}>
            ${this._liquid(d, u, m, g + p + 2, a, M)}
          </g>` : x}
      ${z ? c`<g clip-path=${`url(#${y})`}>${this._splash(e, f, m, $, a, i, n)}</g>` : x}
      <path d=${k} fill="url(#ef-tube)" stroke=${B} stroke-opacity="0.55" stroke-width="0.9" />
      ${T ? this._riseIntoLine(e, g, n, this._c.battery, i) : x}
      <ellipse cx=${e} cy=${f} rx=${$} ry=${p} fill=${a} fill-opacity="0.12" stroke="#e6f6ff" stroke-opacity="0.7"
        stroke-width="0.8" />
      <rect x=${e - 6} y=${n + 3} width="12" height=${f - n - 3} fill=${a} fill-opacity="0.28" stroke=${B}
        stroke-opacity="0.6" stroke-width="0.7" />
      <ellipse cx=${e} cy=${n + 3} rx="6" ry="1.8" fill="#e6f6ff" fill-opacity="0.45" />
      <text x=${e} y=${n + 20} text-anchor="middle" class="bt" font-size=${this._fs(7.5)}>${rt(t, F ? 9 : 11)}</text>
      <text x=${e} y=${n + 33} text-anchor="middle" class="bt" font-size=${this._fs(13)} font-weight="600">${at(o, this._loc)}</text>
      <text x=${e} y=${n + 43} text-anchor="middle" class="bt" font-size=${this._fs(8)}>${P}</text>
      <text x=${e} y=${n + 53} text-anchor="middle" class="bt" font-size=${this._fs(8.5)}>${I(i === null ? null : Math.abs(i), this._loc)}</text>
      <text x=${e} y=${n + 62} text-anchor="middle" class="bt" font-size=${this._fs(7.5)}>${r}</text>
    </g>`;
  }
  /**
   * Liquid like a phone's charging animation: one soft surface that slowly
   * sloshes between a few shapes (no repeating waves), a lighter layer behind
   * it and a bright rim. Every shape has the same commands so SMIL can morph
   * between them. Fills x0..x1 from `lvl` down to `bottom`; clip it outside.
   */
  _liquid(t, e, n, s, i, o) {
    const r = e - t, a = ([u, $, p, f], g) => `M ${t - 1} ${(g + u).toFixed(2)} C ${(t + r * 0.35).toFixed(2)} ${(g + $).toFixed(2)} ${(e - r * 0.35).toFixed(2)} ${(g + p).toFixed(2)} ${e + 1} ${(g + f).toFixed(2)}`, h = (u, $, p) => a(rn[u], $) + (p ? ` V ${s} H ${t - 1} Z` : ""), d = (u, $, p, f) => c`<path d=${h(p[0], u, $)}>
        <animate attributeName="d" dur=${`${f.toFixed(1)}s`} repeatCount="indefinite" calcMode="spline"
          keyTimes="0;0.25;0.5;0.75;1" keySplines=${Kt}
          values=${[...p, p[0]].map((g) => h(g, u, $)).join(";")} />
      </path>`;
    return c`
      <g fill=${i} fill-opacity="0.35">${d(n - 1, !0, [2, 3, 0, 1], o * 1.3)}</g>
      <g fill="url(#ef-liquid)">${d(n, !0, [0, 1, 2, 3], o)}</g>
      <g fill="none" stroke="#e9fff3" stroke-opacity="0.55" stroke-width="0.8">${d(n, !1, [0, 1, 2, 3], o)}</g>`;
  }
  // load list trains count the power in balls as well, big ones in front
  _wagonBalls(t, e) {
    const n = dt(t), s = e === this._c.backup ? n.map(() => this._c.battery) : this._tints(n);
    return n.map((i, o) => ({ r: i === "big" ? Mt : qt, colour: s[o] }));
  }
  /** Colours of where the house's power comes from right now: PV, battery, grid. */
  _tints(t) {
    const e = (this._layout?.batteries ?? []).reduce((o, r) => o + Math.max(0, -(E(this._s(r.power)) ?? 0)), 0), n = this._own("grid_power"), s = ue(this._own("solar_power"), e, n), i = [this._c.solar, this._c.battery, this._c.grid];
    return $e(t, s).map((o) => i[o]);
  }
  /** A train whose balls show where the power comes from (PV, battery, grid). */
  _mixedTrain(t, e, n = !0) {
    if (e === null || Math.abs(e) < A) return c``;
    const { radii: s, begins: i, travel: o, period: r } = this._trainOf(t, e), a = this._tints(dt(e));
    return c`${i.map((h, d) => this._ball(a[d], { route: t, forward: n, r: s[d], begin: h, travel: o, period: r }))}`;
  }
  _houseDots(t, e, n) {
    return this._mixedTrain(t, n);
  }
  get _wagonSpeed() {
    return pt;
  }
  /** A battery's own line: from the blob in the storage box to the battery's cap. */
  _route(t, e) {
    return `M ${this._invBottom[0].toFixed(1)} ${$t} V ${$t + wt / 2} H ${t} V ${e}`;
  }
  _batteryRoute(t, e) {
    return this._route(t, e);
  }
  // Trains run into the glass boxes and new ones leave them: each PV string
  // into the middle of "PV gesamt", the house power from the inverter into
  // the middle of the house box, the load trains from there; backup trains
  // start at the bottom of their battery and leave through its shell.
  _stringRoute(t, e) {
    return `M ${t + 30} ${e + mt / 2} V ${Vt + 13} H ${ot[0]} V ${ot[1]}`;
  }
  _houseIn() {
    const [t, e] = this._invTop;
    return `M ${t} ${e} V ${ut[1]}`;
  }
  _houseLead(t) {
    return `M ${ut[0]} ${ut[1]} H 281 V ${t} H 285`;
  }
  _batteryLead(t, e, n, s) {
    return `M ${t} ${e + ft - 2} V ${s} H ${this._batteryOutX(t, n)}`;
  }
  /**
   * Bubbles of a discharging battery: each rises from the bottom to the cap
   * and arrives just when a ball of the outgoing train starts there, so it
   * looks as if the bubble drives on into the line.
   */
  _riseIntoLine(t, e, n, s, i) {
    const o = n + 3, { radii: r, begins: a, period: h } = this._trainOf(this._route(t, n), i);
    return c`${a.map((d, u) => {
      const $ = r[u], p = Math.min(h * 0.8, (e - o) / pt), f = (p / h).toFixed(4), g = `${h.toFixed(2)}s`, _ = `${(d - p).toFixed(2)}s`;
      return c`<circle cx=${t} cy=${e} r=${$} fill=${s} stroke="#ffffff" stroke-opacity="0.75" stroke-width="0.5"
        opacity="0">
        <animate attributeName="cy" dur=${g} begin=${_} repeatCount="indefinite" values=${`${e};${o};${o}`}
          keyTimes=${`0;${f};1`} />
        <animate attributeName="r" dur=${g} begin=${_} repeatCount="indefinite"
          values=${`${$ * 0.45};${$};${$}`} keyTimes=${`0;${f};1`} />
        <animate attributeName="opacity" dur=${g} begin=${_} repeatCount="indefinite" calcMode="discrete"
          values="0.9;0" keyTimes=${`0;${f}`} />
      </circle>`;
    })}`;
  }
  /**
   * A drop falls into the liquid each time a ball of the train arrives at the
   * battery, then a ripple spreads and two droplets jump. Uses the train's own
   * timing, so it stays in step with the arriving balls.
   */
  _splash(t, e, n, s, i, o, r) {
    const { travel: a, period: h, begins: d } = this._trainOf(this._route(t, r), o), u = this._tints(dt(o));
    return c`${d.map(($, p) => this._splashOnce(t, e, n, s, u[p] ?? i, h, $ + a))}`;
  }
  /** One drop with ripple, repeating every `period` s from `start` s on. */
  _splashOnce(t, e, n, s, i, o, r) {
    const h = Math.min(0.45, o * 0.35) / o, d = Math.min(0.97, h + 0.6 / o), u = h + (d - h) * 0.4, $ = h + 1e-3, p = (m) => m.toFixed(3), f = `${o.toFixed(2)}s`, g = `${r.toFixed(2)}s`, _ = (m, y, k, H = !1) => c`<animate attributeName=${m}
      dur=${f} begin=${g} repeatCount="indefinite" values=${y} keyTimes=${k}
      calcMode=${H ? "spline" : "linear"} keySplines=${H ? "0.55 0 1 0.6;0 0 1 1" : x} />`;
    return c`
      <ellipse cx=${t} cy=${e} rx="1.5" ry="2.1" fill=${i} stroke="#ffffff" stroke-opacity="0.7" stroke-width="0.4" opacity="0">
        ${_("cy", `${e + 1};${n - 1};${n - 1}`, `0;${p(h)};1`, !0)}
        ${_("opacity", "1;1;0;0", `0;${p(h)};${p($)};1`)}
      </ellipse>
      <ellipse cx=${t} cy=${n} rx="1" ry="0.5" fill="none" stroke="#e9fff3" stroke-width="0.8" opacity="0">
        ${_("rx", `1;1;${p(s * 0.75)};${p(s * 0.75)}`, `0;${p(h)};${p(d)};1`)}
        ${_("ry", "0.5;0.5;2;2", `0;${p(h)};${p(d)};1`)}
        ${_("opacity", "0;0;0.9;0;0", `0;${p(h)};${p($)};${p(d)};1`)}
      </ellipse>
      ${[-1, 1].map(
      (m) => c`<circle cx=${t + m * 3} cy=${n} r="0.9" fill=${i} stroke="#ffffff" stroke-opacity="0.6" stroke-width="0.3"
          opacity="0">
          ${_("cy", `${n};${n};${n - 6};${n};${n}`, `0;${p(h)};${p(u)};${p(d)};1`)}
          ${_("cx", `${t};${t};${t + m * 3};${t + m * 5};${t + m * 5}`, `0;${p(h)};${p(u)};${p(d)};1`)}
          ${_("opacity", "0;0;1;0;0", `0;${p(h)};${p($)};${p(d)};1`)}
        </circle>`
    )}`;
  }
  /** 2.5D glass house: gable front, side wall, roof, chimney and warm windows. */
  _houseIcon(t) {
    const e = this._c.solar;
    return c`<g transform="translate(232 26) scale(0.7)">
      <ellipse cx="28" cy="50" rx="30" ry="5" fill="url(#ef-shadow)" />
      <polygon points="4,28 14,18 42,6 32,16" fill=${t} fill-opacity="0.08" stroke=${B} stroke-opacity="0.3" stroke-width="0.7" />
      <polygon points="24,52 52,40 52,24 24,36" fill=${t} fill-opacity="0.12" stroke=${B} stroke-opacity="0.6" stroke-width="0.8" />
      <polygon points="24,52 52,40 52,24 24,36" fill="url(#ef-slab)" />
      <polygon points="4,44 24,52 24,36 14,18 4,28" fill=${t} fill-opacity="0.2" stroke=${B} stroke-opacity="0.75" stroke-width="0.9" />
      <polygon points="4,44 24,52 24,36 14,18 4,28" fill="url(#ef-slab)" />
      <polygon points="24,36 52,24 42,6 14,18" fill=${t} fill-opacity="0.28" stroke=${B} stroke-opacity="0.75" stroke-width="0.9" />
      <polygon points="24,36 52,24 42,6 14,18" fill="url(#ef-sheen)" />
      <polygon points="36.6,15 39.4,13.8 39.4,5.8 36.6,7" fill=${t} fill-opacity="0.35" stroke=${B} stroke-opacity="0.7" stroke-width="0.7" />
      <polygon points="28.2,43.2 35.2,40.2 35.2,32.2 28.2,35.2" fill=${e} fill-opacity="0.5" stroke=${e} stroke-opacity="0.8" stroke-width="0.6" />
      <polygon points="40.8,37.8 47.8,34.8 47.8,26.8 40.8,29.8" fill=${e} fill-opacity="0.5" stroke=${e} stroke-opacity="0.8" stroke-width="0.6" />
      <polygon points="12,47.2 17,49.2 17,37.2 12,35.2" fill=${t} fill-opacity="0.4" stroke=${B} stroke-opacity="0.7" stroke-width="0.6" />
      <ellipse cx="14" cy="28" rx="2.2" ry="2.6" fill=${e} fill-opacity="0.45" stroke=${e} stroke-opacity="0.7" stroke-width="0.5" />
      <path d="M 14 18 L 42 6" stroke="#ffffff" stroke-opacity="0.95" stroke-width="1.2" stroke-linecap="round" />
      <path d="M 4 28 V 44 M 24 36 V 52" stroke="#ffffff" stroke-opacity="0.55" stroke-width="0.8" />
    </g>`;
  }
  /**
   * Left column as in the glass concept: a free-standing glass pylon with one
   * glass cable into the inverter, the grid tile below it and the wallbox
   * below that.
   */
  _grid() {
    const t = this._c.grid, e = this._invX, { grid: n, exporting: s, cents: i, label: o, power: r, imp: a, exp: h } = this._gridData(), [d, u] = Ht[Ht.length - 1], $ = te + d * Ct, p = ee + (u + 6) * Ct, f = gt[1][1], g = Math.max(p, f) + 12, _ = `M ${$.toFixed(1)} ${p.toFixed(1)} Q ${(($ + e) / 2).toFixed(1)} ${g.toFixed(1)} ${e} ${f}`, m = i !== null ? ie(i, this._loc) : "", y = [
      { arrow: "↓", kwh: a, name: "Bez.", active: o === "Bezug" },
      { arrow: "↑", kwh: h, name: "Einsp.", active: o === "Einspeisung" }
    ].filter((M) => M.kwh !== null), k = ne, H = k + (i !== null ? 32 : 21), z = H - k + (y.length ? y.length * 12 + 4 : 0);
    return c`
      ${this._pylon(t)}
      ${this._flow(_, t, n, !s)}
      ${this._panel(et, k, _t, z, t)}
      <text x=${et + _t / 2} y=${k + 15.5} text-anchor="middle" class="val" font-size=${this._fs(11.5)} font-weight="600"
        >${r}</text>
      ${i !== null ? c`<text x=${et + _t / 2} y=${k + 27} text-anchor="middle" class="dim" style=${`font-size:${this._fs(8.5)}px`}>${m}</text>` : x}
      ${y.length ? c`<line x1=${et + 6} x2=${et + _t - 6} y1=${H} y2=${H} class="sep" stroke=${t} />` : x}
      ${y.map(
      (M, T) => c`<text x=${et + 6} y=${H + 11 + T * 12} class=${M.active ? "val" : "dim"} style=${`font-size:${this._fs(8.5)}px`}
          ><tspan fill=${M.active ? t : x}>${M.arrow}</tspan> ${S(M.kwh, this._loc)}<tspan
          class=${M.active ? "" : "tiny"} style=${`font-size:${this._fs(7.5)}px`} fill=${M.active ? t : x}> ${M.name}</tspan></text>`
    )}
      ${this._wallbox(this._carTop(k + z + 8))}
    `;
  }
  /** Top of the car picture: its plate ends flush with the lowest battery, but
   *  never higher than `min` (just below the grid tile). */
  _carTop(t) {
    const e = this._displayBatteries();
    if (!e.length) return t;
    const n = Math.max(...e.map((s) => s.top)) + ft + 3.5;
    return Math.max(t, n - O.height * (At / O.width));
  }
  /**
   * Wallbox below the grid tile: the glass car picture (car, glass plate and
   * wallbox) with sloshing liquid inside the car body up to its state of
   * charge; power and today's energy are written on the plate along its front
   * edges. Fed from the inverter's left side into the wallbox.
   */
  _wallbox(t) {
    const e = this._layout?.wallbox;
    if (!e) return c``;
    const n = e.flexible ? this._c.flexible : this._c.home, s = this._w(e.power), i = E(this._s(e.soc ?? void 0)), o = E(this._s(e.today ?? void 0)), r = s === null || Math.abs(s) < A, a = !r && (s ?? 0) > 0, h = At / O.width, d = ([Y, j]) => [zt + Y * h, t + j * h], u = i === null ? null : Math.max(0, Math.min(100, i)) / 100, $ = (u ?? 0) * O.liquidHeight, [p, f, g, _] = O.floorQuad, m = ([Y, j], ct) => `${Y.toFixed(1)},${(j - ct).toFixed(1)}`, y = (Y) => {
      const [j, ct, vt, Nt] = Y.map((ae) => Math.max(0, $ + ae));
      return {
        body: [m(p, 0), m(f, 0), m(g, 0), m(g, vt), m(_, Nt), m(p, j)].join(" "),
        surface: [m(p, j), m(f, ct), m(g, vt), m(_, Nt)].join(" "),
        edge: [m(p, j), m(f, ct), m(g, vt)].join(" ")
      };
    }, k = $n.map((Y) => y(Y)), H = a ? 3.4 : 5.5, z = (Y) => c`<animate attributeName="points" dur=${`${H}s`}
      repeatCount="indefinite" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" keySplines=${Kt}
      values=${[...k, k[0]].map((j) => j[Y]).join(";")} />`, M = `ef-car-${Math.round(t)}`, T = `translate(${zt} ${t}) scale(${h.toFixed(5)})`, F = this._invX, P = gt[2][1], [J, l] = d(O.wallboxTop), w = ne - 12, b = `M ${F} ${P} H ${F - 10} V ${w} H ${J.toFixed(1)} V ${l.toFixed(1)}`, [v, R] = d(O.powerText), [D, st] = d(O.energyText), G = O.edgeAngle, [bt, re] = d([(f[0] + g[0]) / 2, (f[1] + g[1]) / 2 - Math.max($ / 2, 14)]);
    return c`
      ${this._flow(b, n, s, !0, !1)}
      ${this._mixedTrain(b, s)}
      <g>
        <title>${e.name} · ${e.flexible ? "Zusatzverbraucher" : "Grundlast"}</title>
        <image href=${un} x=${zt} y=${t} width=${At} height=${(O.height * h).toFixed(1)} />
        ${u ? c`<g transform=${T}>
              <clipPath id=${M}><polygon points=${O.tank} /></clipPath>
              <g clip-path=${`url(#${M})`} opacity="0.7">
                <polygon points=${k[0].body} fill="url(#ef-liquid)">${z("body")}</polygon>
                <polygon points=${k[0].surface} fill="#c8ffe0" fill-opacity="0.45">${z("surface")}</polygon>
                <polyline points=${k[0].edge} fill="none" stroke="#e9fff3" stroke-opacity="0.85" stroke-width="2.4"
                  stroke-linejoin="round">${z("edge")}</polyline>
              </g>
            </g>` : x}
        ${i !== null ? c`<text x=${bt.toFixed(1)} y=${re.toFixed(1)} text-anchor="middle" class="bt" font-size=${this._fs(9)}
              font-weight="600">${at(i, this._loc)}</text>` : x}
        <text transform=${`translate(${v.toFixed(1)} ${R.toFixed(1)}) rotate(${G})`} class=${r ? "dim" : "val"}
          style=${`font-size:${this._fs(8)}px`} font-weight="600">${I(s, this._loc)}</text>
        <text transform=${`translate(${D.toFixed(1)} ${st.toFixed(1)}) rotate(${-G})`} class="dim"
          style=${`font-size:${this._fs(8)}px`}>${S(o, this._loc)}</text>
      </g>`;
  }
  /** Free-standing pylon of glass rods on a hexagonal glass plate. */
  _pylon(t) {
    const e = Lt([...Qt, ...Jt, ...dn]), n = Lt([...Qt, ...Jt], 7, -4), s = Lt(pn), i = "65.5,84 48.5,92.7 14.5,92.7 -2.5,84 14.5,75.3 48.5,75.3";
    return c`<g transform=${`translate(${te} ${ee}) scale(${Ct})`}>
      <ellipse cx="31.5" cy="97" rx="40" ry="7" fill="url(#ef-shadow)" />
      <polygon points=${"65.5,84 65.5,87 48.5,95.7 14.5,95.7 -2.5,87 -2.5,84 14.5,92.7 48.5,92.7"} fill=${t} fill-opacity="0.3" stroke=${B} stroke-opacity="0.4" stroke-width="0.6" />
      <polygon points=${i} fill=${t} fill-opacity="0.14" stroke=${B} stroke-opacity="0.65" stroke-width="0.8" />
      <polygon points=${i} fill="url(#ef-slab)" />
      <path d=${n} fill="none" stroke=${t} stroke-opacity="0.22" stroke-width="2.6" stroke-linecap="round" />
      <path d=${n} fill="none" stroke=${B} stroke-opacity="0.4" stroke-width="0.7" stroke-linecap="round" />
      <path d=${s} fill="none" stroke=${B} stroke-opacity="0.35" stroke-width="1.4" stroke-linecap="round" />
      <path d=${e} fill="none" stroke=${t} stroke-opacity="0.35" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" />
      <path d=${e} fill="none" stroke="#e6f6ff" stroke-opacity="0.9" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
      ${Ht.map(
      ([r, a]) => c`
          <path d=${`M ${r} ${a} V ${a + 6}`} stroke=${B} stroke-opacity="0.8" stroke-width="0.8" />
          <circle cx=${r} cy=${a + 2.5} r="1.4" fill=${t} /><circle cx=${r} cy=${a + 5} r="1.4" fill=${t} />
          <circle cx=${r} cy=${a + 3.7} r="0.6" fill="#ffffff" />`
    )}
      ${_n.map(([r, a]) => c`<circle cx=${r} cy=${a} r="1.3" fill="#ffffff" fill-opacity="0.85" />`)}
    </g>`;
  }
  // -- load groups -------------------------------------------------------------
  /** Each group sits on its own tinted glass slab. */
  _groupPanel(t) {
    const e = V - 12, n = t.titleY - 13, s = t.y0 + t.rows * this._rowH + 3;
    return this._panel(e, n, U + 3 - e, s - n, t.colour);
  }
  _groupIcon() {
    return c``;
  }
  _groupTitle(t, e, n, s, i) {
    const o = i.reduce((r, a) => {
      const h = E(this._s(a.today));
      return h === null ? r : (r ?? 0) + h;
    }, null);
    return c`
      <text x=${V - 6} y=${t} class="small grp" fill=${e}>${n}</text>
      <text x=${nt - 1} y=${t} text-anchor="end" class="small" style=${`font-size:${this._fs(8)}px`} fill=${e}>${I(s, this._loc)}</text>
      <text x=${U - 1} y=${t} text-anchor="end" class="small" style=${`font-size:${this._fs(8)}px`} fill=${e}>${S(o, this._loc)}</text>`;
  }
  /** Line icon chosen from the name, then the name (wrapped if long). */
  _nameBox(t, e, n, s = t, i = 0) {
    const o = this._rowH, r = 9, a = V + i, h = a + r + 3, d = nt - W - 2 - h, { lines: u, small: $ } = Tt(t, Math.floor(d / 5.2), Math.floor(d / 4.2));
    return c`<g>
      <title>${s}</title>
      ${this._line(sn(t), a, e + (o - r) / 2, r, n)}
      ${$ ? c`<text x=${h} y=${e + o / 2 - 1.5} class="name" font-size=${this._fs(7.5)}>${u[0]}</text>
              <text x=${h} y=${e + o / 2 + 5.5} class="name" font-size=${this._fs(7.5)}>${u[1] ?? ""}</text>` : c`<text x=${h} y=${e + o / 2 + 3} class="name" font-size=${this._fs(9.5)}>${u[0]}</text>`}
    </g>`;
  }
  /** Plain right-aligned numbers: the group slab is the glass. */
  _valueCell(t, e, n, s, i, o, r, a) {
    return c`<text x=${t + n - 1} y=${e + s / 2 + r * 0.36} text-anchor="end" class=${a === "power" ? "val" : "dim"}
      font-size=${this._fs(r + 0.5)}>${o}</text>`;
  }
};
Rt.styles = [
  N.styles,
  Pt`
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
    `
];
let St = Rt;
customElements.get("energiefluss-glass-card") || customElements.define("energiefluss-glass-card", St);
window.customCards = window.customCards ?? [];
window.customCards.some((C) => C.type === "energiefluss-glass-card") || window.customCards.push({
  type: "energiefluss-glass-card",
  name: "Energiefluss Glas",
  description: "Energiefluss im 2.5D-Glas-Look mit Glasrohren und leuchtenden Zügen – gleiche Daten wie die Energiefluss-Karte.",
  preview: !0
});
