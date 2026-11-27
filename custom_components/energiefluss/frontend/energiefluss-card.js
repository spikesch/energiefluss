import { i as pe, e as xe, b as J, A as b, a as jt, n as ue, r as nt, U as Ut, w as be, c as T, d as h, l as ke, f as ve, p as It, g as Me, k as ft, h as F, j as V, s as dt, m as Le, o as pt, q as Ft, t as qt, u as fe, v as $t, x as He, y as Ae } from "./energiefluss-shared-4XYPgQBE.js";
var Ce = Object.defineProperty, Lt = (k, t, e, n) => {
  for (var s = void 0, i = k.length - 1, o; i >= 0; i--)
    (o = k[i]) && (s = o(t, e, s) || s);
  return s && Ce(t, e, s), s;
};
const ze = {
  entry_id: "Anlage",
  title: "Titel der Karte (optional)",
  flow_style: "Animation",
  max_power: "Leistung für größte bzw. schnellste Punkte"
}, Te = {
  max_power: "Ab dieser Leistung sind die Punkte am größten bzw. schnellsten. Standard 5000 W."
}, Gt = class Gt extends pe {
  constructor() {
    super(...arguments), this._instances = [], this._ready = !1;
  }
  setConfig(t) {
    this._config = t;
  }
  async firstUpdated() {
    await xe(), this.hass && (this._instances = await this.hass.callWS({ type: "energiefluss/instances" })), this._ready = !0;
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
    return !this._ready || !this._config ? J`<div class="hint">Lade …</div>` : this._instances.length ? J`
      <h2>Karte</h2>
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schema()}
        .computeLabel=${(t) => ze[t.name] ?? t.name}
        .computeHelper=${(t) => Te[t.name]}
        @value-changed=${this._cardChanged}
      ></ha-form>
      <h2 class="spaced">Anlage</h2>
      <p class="hint">
        Gilt für alle Karten dieser Anlage. Änderungen hier mit <b>„Anlage speichern“</b> übernehmen – das
        Speichern unten im Dialog speichert nur die Karten-Einstellungen oben.
      </p>
      ${this._entryId ? J`<energiefluss-editor compact .hass=${this.hass} .entryId=${this._entryId}></energiefluss-editor>` : b}
    ` : J`<div class="hint">
        Noch keine Anlage angelegt: Einstellungen → Geräte &amp; Dienste → Integration hinzufügen → „Wattrio“.
      </div>`;
  }
};
Gt.styles = jt`
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
let et = Gt;
Lt([
  ue({ attribute: !1 })
], et.prototype, "hass");
Lt([
  nt()
], et.prototype, "_config");
Lt([
  nt()
], et.prototype, "_instances");
Lt([
  nt()
], et.prototype, "_ready");
customElements.get("energiefluss-card-editor") || customElements.define("energiefluss-card-editor", et);
var Ee = Object.defineProperty, ut = (k, t, e, n) => {
  for (var s = void 0, i = k.length - 1, o; i >= 0; i--)
    (o = k[i]) && (s = o(t, e, s) || s);
  return s && Ee(t, e, s), s;
};
const Se = (k) => k.reduce((t, e) => t + 1 + (e.children?.length ?? 0), 0), Be = {
  solar: "#ff9800",
  battery: "#ff69b4",
  grid: "#5490c2",
  home: "#5fb6ad",
  flexible: "#9575cd",
  backup: "#ef5350",
  inverter: "#959595"
}, Ie = 554, Fe = 148, Kt = 400, Zt = 240, kt = 22, B = 396, Q = B - 20, K = 504, X = 40, W = 550, q = 42, Ve = 22, Qt = 358, Oe = 37, Jt = 364, te = 370, E = 5, ee = 40, Pe = 14, Ne = 0.8, Re = "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z", Ye = "M8.28,5.45L6.5,4.55L7.76,2H16.24L17.5,4.55L15.72,5.45L15,4H9L8.28,5.45M18.62,8H14.09L13.3,5H10.7L9.91,8H5.38L4.1,10.55L5.89,11.44L6.62,10H17.38L18.1,11.44L19.89,10.55L18.62,8M17.77,22H15.7L15.46,21.1L12,15.9L8.53,21.1L8.3,22H6.23L9.12,11H11.19L10.83,12.35L12,14.1L13.16,12.35L12.81,11H14.88L17.77,22M11.4,15L10.5,13.65L9.32,18.13L11.4,15M14.68,18.12L13.5,13.64L12.6,15L14.68,18.12Z", je = "M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z", Ge = "M4,2H20A2,2 0 0,1 22,4V14A2,2 0 0,1 20,16H15V20H18V22H13V16H11V22H6V20H9V16H4A2,2 0 0,1 2,14V4A2,2 0 0,1 4,2M4,4V8H11V4H4M4,14H11V10H4V14M20,14V10H13V14H20M20,4H13V8H20V4Z", Wt = class Wt extends pe {
  constructor() {
    super(...arguments), this._expanded = /* @__PURE__ */ new Set(), this._loading = !1, this._onUpdated = (t) => {
      const e = t.detail?.entry_id;
      (!e || !this._layout || e === this._layout.entry_id) && (this._layout = void 0, this._loadLayout());
    }, this._onTap = (t) => {
      const n = t.composedPath().find((s) => s instanceof Element && s.hasAttribute("data-entity"))?.getAttribute("data-entity");
      n && this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: n }, bubbles: !0, composed: !0 }));
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
    super.connectedCallback(), window.addEventListener(Ut, this._onUpdated);
  }
  disconnectedCallback() {
    window.removeEventListener(Ut, this._onUpdated), super.disconnectedCallback();
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
        this._error = t?.message ?? "Wattrio-Integration nicht gefunden. Bitte unter Einstellungen → Geräte & Dienste einrichten.";
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
    return be(this._s(t));
  }
  _own(t) {
    return T(this._s(this._layout?.entities[t]));
  }
  _name(t) {
    return this._s(t)?.attributes.friendly_name ?? t.split(".")[1];
  }
  get _loc() {
    return this.hass?.locale?.language ?? "de";
  }
  get _c() {
    return { ...Be, ...this._config?.colours ?? {} };
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
  /** Left edge and width of the "PV gesamt" box. */
  get _pvBox() {
    return [45, 70];
  }
  /** Top of the "PV gesamt" box (26 high). */
  get _pvBoxY() {
    return 108;
  }
  /** Top of the storage box above the batteries. */
  get _storeY() {
    return Zt;
  }
  /** The card is at least this tall. */
  get _minViewH() {
    return Kt;
  }
  /** Room the card keeps below the top of the lowest battery. */
  get _batteryTail() {
    return 138;
  }
  /** Height of one load list row; looks may make the lists denser. */
  get _rowH() {
    return Ve;
  }
  /** Makes `content` open the more-info dialog of `entity` when clicked. */
  _tap(t, e) {
    return t ? h`<g class="tap" data-entity=${t}>${e}</g>` : e;
  }
  /** Font size for text set in the templates; looks may scale all of it. */
  _fs(t) {
    return t;
  }
  // -- layout knobs that alternative looks may move ----------------------------
  /** Left edge of the inverter box (60 x 60). */
  get _invX() {
    return Fe;
  }
  /** Top of the house value box (70 x 26 at x 215). */
  get _houseY() {
    return 70;
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
    return h``;
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
    return h`${n.map((s) => this._dot(s.route, e, s.w, s.forward))}`;
  }
  /** Balls (radius, colour) a load's dots consist of, for looks that count the
   *  power in balls; null = one wagon per load whose size shows the power. */
  _wagonBalls(t, e, n) {
    return null;
  }
  /** Dots of the house line (from the inverter to the house). */
  _houseDots(t, e, n) {
    return this._dot(t, e, n, !0);
  }
  /** Speed of the load list trains in px per second. */
  get _wagonSpeed() {
    return ee;
  }
  /** A battery's whole route from the inverter through the storage box to the
   *  battery (for dots that pass through the box); null = dots stop at the box. */
  _batteryRoute(t, e) {
    return null;
  }
  /**
   * Power on the line between a battery and the storage box (+ = into the
   * battery). Usually its own power; a battery that can only give power to
   * its backup loads (e.g. EcoFlow) only ever takes power in: its input,
   * including what it just passes through to its backup loads.
   */
  _lineFlow(t, e) {
    const n = this._layout?.batteries.find((s) => s.name === t);
    return n?.backup_only ? Math.max(this._w(n.charge) ?? 0, 0) : e === null || !n?.backup?.length ? e : e + Math.max(this._sumW(n.backup) ?? 0, 0);
  }
  /** Today's energy of the house net: the house's daily energy minus that of all
   *  backup loads (each has its own daily counter). */
  get _houseNetToday() {
    const t = T(this._s(this._layout?.home_today));
    if (t === null) return null;
    const e = (this._layout?.batteries ?? []).flatMap((n) => n.backup ?? []).reduce((n, s) => n + (T(this._s(s.today)) ?? 0), 0);
    return Math.max(t - e, 0);
  }
  /** Active power of all backup loads: batteries feed them straight from their own
   *  output, they are not on the house net. Their own sensors, not a battery's
   *  output (that may be apparent power and include its own consumption). */
  get _offGridLoads() {
    return (this._layout?.batteries ?? []).reduce((t, e) => t + Math.max(this._sumW(e.backup ?? []) ?? 0, 0), 0);
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
    return h`
      <path d=${t} fill="none" stroke=${e} stroke-width=${ke(n, this._max)} stroke-opacity="0.85" />
      ${i ? this._dot(t, e, n, s) : b}
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
    if (n === null || Math.abs(n) < E) return h``;
    const a = this._bySize, r = o?.radius ?? (a ? Math.max(1.7, ve(n, this._max) * (i / 3.2)) : i);
    if (o) {
      const p = (o.travel / o.period).toFixed(4), f = { dur: `${o.period.toFixed(2)}s`, begin: `${o.begin.toFixed(2)}s` };
      return this._orb(
        r,
        e,
        h`<animateMotion dur=${f.dur} begin=${f.begin} repeatCount="indefinite" calcMode="linear" rotate="auto"
            keyPoints="0;1;1" keyTimes=${`0;${p};1`} path=${t} />
          <animate attributeName="opacity" dur=${f.dur} begin=${f.begin} repeatCount="indefinite"
            calcMode="discrete" values="1;0" keyTimes=${`0;${p}`} />`,
        !0
      );
    }
    const d = this._dotDuration(t, n);
    return this._orb(
      r,
      e,
      h`<animateMotion dur=${`${d.toFixed(2)}s`} repeatCount="indefinite" calcMode="linear"
        rotate=${s ? "auto" : "auto-reverse"}
        keyPoints=${s ? "0;1" : "1;0"} keyTimes="0;1" path=${t} />`
    );
  }
  /** Seconds a (non-train) dot needs for path `d`; looks use it to sync their own effects. */
  _dotDuration(t, e) {
    return this._bySize ? Math.max(0.6, It(t) / ee) : Me(e, this._max);
  }
  /** Draws a moving dot; `motion` holds its animation elements. Looks override this. */
  _orb(t, e, n, s = !1) {
    return h`<circle r=${t} fill=${e} opacity=${s ? "0" : b}>${n}</circle>`;
  }
  /** Drawn last, on top of everything (nothing in the classic look). */
  _overlay() {
    return h``;
  }
  /** Extra <defs> (filters, gradients) for alternative looks. */
  _defs() {
    return h``;
  }
  /** Background of a box; looks override this. */
  _panel(t, e, n, s, i) {
    return h`<rect x=${t} y=${e} width=${n} height=${s} rx="4" fill="none" stroke=${i} stroke-width="1" />`;
  }
  _box(t, e, n, s, i, o, a = 12) {
    return h`
      ${this._panel(t, e, n, s, i)}
      <text x=${t + n / 2} y=${e + s / 2 + a * 0.35} text-anchor="middle" class="val" font-size=${this._fs(a)}>${o}</text>
    `;
  }
  _icon(t, e, n, s, i) {
    return h`<path d=${t} fill=${i} transform=${`translate(${e} ${n}) scale(${s / 24})`} />`;
  }
  // -- sections ---------------------------------------------------------------
  _solar() {
    const t = this._layout, e = this._c.solar, n = this._own("solar_power"), s = t.solar.strings.slice(0, 4), i = this._stringPos, o = this._pvBoxY, [a, r] = this._pvBox, d = a + r + 6, p = ft(this._s(t.solar.today)), f = ft(this._s(t.solar.forecast_remaining)), $ = s.map((u, w) => this._stringRoute(i[w][0], i[w][1])), c = s.length > 0 && $.every((u) => u !== null), _ = `M ${this._solarX} ${o + 26} V ${this._solarY} H ${this._invX}`;
    return h`
      ${this._solarBack()}
      ${c ? (
      // the line first, the strings' dots on it, tiles and box on top (dots pass below the glass)
      h`${this._flow(_, e, n, !0, !1)}
            ${this._trainDots("pv", e, s.map((u, w) => ({ route: $[w], w: this._w(u.entity), forward: !0 })))}`
    ) : b}
      ${s.map((u, w) => {
      const [y, m] = i[w];
      return this._tap(u.entity, this._stringTile(y, m, u.entity, e));
    })}
      ${this._solarIcon(e)}
      ${this._tap(t.entities.solar_power, this._box(a, o, r, 26, e, F(n, this._loc), 13))}
      <text x=${d} y=${o + 9} class="lbl">PV gesamt</text>
      ${p !== null ? h`<text x=${d} y=${o + 22} class="small" fill=${e}>${V(p, this._loc)} heute</text>` : b}
      ${f !== null ? h`<text x=${d} y=${o + 34} class="small">Rest ${V(f, this._loc)}</text>` : b}
      ${c ? b : this._flow(_, e, n, !0)}
    `;
  }
  /** Drawn first in the PV section, below the string tiles (nothing in the classic look). */
  _solarBack() {
    return h``;
  }
  /** Symbol next to the PV strings. */
  _solarIcon(t) {
    return this._icon(Ge, 152, 34, 26, t);
  }
  /** One PV string: value box with its name below (tile at x, y; 60 x 38 available). */
  _stringTile(t, e, n, s) {
    return h`${this._box(t, e, 60, 24, s, F(this._w(n), this._loc), 11)}
      <text x=${t} y=${e + 35} class="lbl">${dt(this._name(n), 14)}</text>`;
  }
  /** Batteries in display order: those with a backup output go to the right. */
  _displayBatteries() {
    const t = this._layout?.batteries ?? [], e = t.filter((r) => !(r.backup ?? []).length), n = t.filter((r) => (r.backup ?? []).length), s = [...e, ...n], i = Le(s.length), o = this._batteryShift(s.length), a = this._storeY - Zt;
    return s.map((r, d) => ({ ...r, ...i[d], cx: i[d].cx + o, top: i[d].top + a, index: d }));
  }
  _batteries() {
    const t = this._layout, e = this._c.battery;
    if (!t.batteries.length) return h``;
    const n = this._own("battery_soc"), s = this._own("battery_energy"), i = this._displayBatteries();
    i.length;
    const o = i.map((m) => this._lineFlow(m.name, T(this._s(m.power)))), r = i.some((m) => m.backup_only || (m.backup ?? []).length) ? o.reduce((m, x) => x === null ? m : (m ?? 0) + x, null) : this._own("battery_power"), d = Math.min(...i.map((m) => m.cx - m.w / 2)), p = Math.max(...i.map((m) => m.cx + m.w / 2)) - d, [f, $] = this._invBottom, c = this._storeY, _ = Math.min(Math.max(f, d + 10), d + p - 10), u = _ === f ? `M ${f} ${$} V ${c}` : `M ${f} ${$} V ${c - 5} H ${_} V ${c}`, w = i.map((m) => this._batteryRoute(m.cx, m.top)), y = w.every((m) => m !== null);
    return h`
      ${i.map((m, x) => {
      const { cx: C, top: L, w: A } = m, S = T(this._s(m.power)), Y = T(this._s(m.soc)), I = `M ${C} ${c + kt} V ${L}`, P = S === null ? "" : S > E ? "lädt" : S < -E ? "entlädt" : "ruht", l = o[x];
      return h`
          ${this._flow(I, e, l, (l ?? 0) > 0, !y)}
          ${this._tap(m.power, this._batteryWidget(m.name, C, L, A, S, Y, P, e, m.capacity_kwh))}
        `;
    })}
      ${this._flow(u, e, r, (r ?? 0) > 0, !y)}
      ${y ? this._trainDots(
      "battery",
      e,
      i.map((m, x) => ({ route: w[x], w: o[x], forward: (o[x] ?? 0) > 0 }))
    ) : b}
      ${this._tap(t.entities.battery_soc, this._box(
      d,
      c,
      p,
      kt,
      e,
      `${p >= 120 ? "Speicher " : ""}${pt(n, this._loc)}${s !== null && p >= 80 ? ` · ${V(s, this._loc)}` : ""}`,
      p >= 150 ? 11 : 10
    ))}
    `;
  }
  /** One battery below the storage box: widget spans top .. top + 104 around cx. */
  _batteryWidget(t, e, n, s, i, o, a, r, d = null) {
    const p = s < 54, f = Math.max(0, Math.min(100, o ?? 0));
    return h`
      ${this._box(e - s / 2, n, s, 22, r, F(i === null ? null : Math.abs(i), this._loc), p ? 10 : 11)}
      <text x=${e} y=${n + 32} text-anchor="middle" class="tiny">${a}</text>
      <rect x=${e - 9} y=${n + 42} width="18" height="32" rx="3" fill="none" stroke=${r} />
      <rect x=${e - 4} y=${n + 39} width="8" height="3" fill=${r} />
      <rect x=${e - 7} y=${n + 72 - 28 * f / 100} width="14" height=${28 * f / 100} rx="1" fill=${r} fill-opacity="0.7" />
      <text x=${e} y=${n + 91} text-anchor="middle" class="soc">${pt(o, this._loc)}</text>
      <text x=${e} y=${n + 104} text-anchor="middle" class="tiny">${dt(t, p ? 10 : 14)}</text>
    `;
  }
  _inverter() {
    const t = this._c.inverter, e = this._invX, n = this._invY;
    return h`
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
    const e = this._c, n = Q, s = [], i = this._rowH, o = i / 2 - 1;
    let a = this._groupsTop;
    const r = (u, w, y, m, x, C, L, A) => {
      if (!y.length) return;
      const S = this._listLimit(u), Y = S !== null && y.length > S, I = this._expanded.has(u);
      let P = y;
      if (Y) {
        const G = (z) => T(this._s(z.today)) ?? 0, Z = new Set([...y].sort((z, U) => G(U) - G(z)).slice(0, S)), at = y.filter((z) => !Z.has(z)), Ht = at.reduce((z, U) => {
          const st = T(this._s(U.today));
          return st === null ? z : (z ?? 0) + st;
        }, null), j = {
          entity: "",
          today: null,
          label: I ? "− weniger" : `+ ${at.length} weitere`,
          more: { group: u, power: I ? null : this._sumW(at), today: I ? null : Ht }
        };
        P = [...I ? y : y.filter((z) => Z.has(z)), j];
      }
      const l = Se(P), g = Math.max(a + 6, L ? L.pref - 10 : 0), v = L ? Math.min(Math.max(g + o, L.lo), L.hi) : g + o, M = x(g + o, v), N = A?.(v), rt = N ? `${N} ${M.replace(/^M\s+\S+\s+\S+\s*/, "")}` : void 0;
      s.push({
        title: u,
        colour: w,
        power: m,
        titleY: g - 6,
        y0: g,
        trunk: M,
        loads: P.map((G) => ({ ...G, trunk: M, route: rt, source: C })),
        all: y,
        rows: l,
        more: Y ? { hidden: y.length - P.length, expanded: I } : void 0
      }), a = g + l * i + this._groupGap;
    }, d = [...t.loads.fixed], p = t.entities.unmeasured_power;
    this._unmeasuredInList && p && d.push({
      entity: p,
      today: t.unmeasured_today ?? null,
      label: "Nicht erfasst",
      tip: "Nicht erfasst · Hausverbrauch ohne die gemessenen Verbraucher"
    });
    const f = this._laneFinder(), $ = this._houseY;
    r(
      "Grundlast",
      e.home,
      d,
      this._sumW(d),
      (u) => `M 285 ${$ + 9} H ${f(300, $ + 9, u)} V ${u} H ${n}`,
      void 0,
      void 0,
      () => this._houseLead($ + 9)
    ), r(
      "Zusätzlich",
      e.flexible,
      t.loads.flexible,
      this._sumW(t.loads.flexible),
      (u) => `M 285 ${$ + 19} H ${f(306, $ + 19, u)} V ${u} H ${n}`,
      void 0,
      void 0,
      () => this._houseLead($ + 19)
    );
    const c = t.wallbox;
    if (c && this._wallboxInList) {
      const u = T(this._s(c.soc ?? void 0)), w = u !== null ? `${c.name} Auto ${pt(u, this._loc)}` : c.name;
      r(
        "Wallbox",
        c.flexible ? e.flexible : e.home,
        [{ entity: c.power, today: c.today, label: w, tip: `${c.name} · ${c.flexible ? "Zusatzverbraucher" : "Grundlast"}` }],
        this._w(c.power),
        (y, m) => `M ${this._invX + 60} ${m} H ${Qt} V ${y} H ${n}`,
        void 0,
        { pref: this._invY + Oe, lo: this._invY + 6, hi: this._invY + 56 }
        // anywhere on the inverter's right edge
      );
    }
    return this._displayBatteries().filter((u) => (u.backup ?? []).length).reverse().forEach((u, w) => {
      const y = w === 0 ? Jt : te, m = w === 0 ? { pref: u.top + 57, lo: u.top + 46, hi: u.top + 70 } : { pref: u.top + 68, lo: u.top + 64, hi: u.top + 72 };
      r(
        dt(u.name, 12),
        // red colour + feed line from the battery mark it as backup
        e.backup,
        u.backup ?? [],
        this._sumW(u.backup ?? []),
        (x, C) => `M ${this._batteryOutX(u.cx, u.w)} ${C} H ${y} V ${x} H ${n}`,
        u.name,
        m,
        (x) => this._batteryLead(u.cx, u.top, u.w, x)
      );
    }), s;
  }
  /** Baseline of the first load group's title. */
  get _groupsTop() {
    return 22;
  }
  /** Drawn above all load groups (nothing in the classic look); `home` = total consumption. */
  _listsHeader(t) {
    return h``;
  }
  /** Show "heute" / "24 h" above the energy column of the load lists. */
  get _periodLabel() {
    return !0;
  }
  /** Draw a load group's feed as part of its list's pipes (same look, clean joins). */
  get _pipeTrunk() {
    return !1;
  }
  /** Where a load list's branch line ends at its row. */
  get _rowEntryX() {
    return B - 3;
  }
  /** Lines inside a load list: the bracket with the rows' branches (one path),
   *  or the dashed link from a load to a load contained in it. */
  _branch(t, e, n) {
    return h`<path d=${t} fill="none" stroke=${e} stroke-width="1" stroke-opacity="0.6"
      stroke-dasharray=${n === "child" ? "2 2" : b} />`;
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
      const o = Math.min(...t.map((r) => r.cx - r.w / 2)) - 3, a = Math.max(...t.map((r) => r.cx + r.w / 2)) + 3;
      e.push({ x0: o, x1: a, y0: this._storeY - 3, y1: this._storeY + kt + 3 });
    }
    const n = [Jt, te, ...this._layout?.wallbox && this._wallboxInList ? [Qt] : []], s = [], i = (o, a, r) => {
      const [d, p] = a < r ? [a, r] : [r, a];
      return !e.some((f) => o >= f.x0 && o <= f.x1 && p >= f.y0 && d <= f.y1) && !n.some((f) => Math.abs(f - o) < 4) && !s.some((f) => Math.abs(f - o) < 5);
    };
    return (o, a, r) => {
      let d = o;
      for (; !i(d, a, r) && d < Q - 8; ) d += 3;
      return d >= Q - 8 && (d = o), s.push(d), d;
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
    const s = this._rowH, i = s / 2 - 1, o = (l) => l.w !== null && Math.abs(l.w) >= E, a = (l) => T(this._s(l.today)) ?? 0, r = (l, g) => this._idleByEnergy ? Number(o(g)) - Number(o(l)) || (o(l) ? g.w - l.w : a(g) - a(l)) || l.name.localeCompare(g.name) : (g.w ?? -1 / 0) - (l.w ?? -1 / 0) || l.name.localeCompare(g.name), d = t.map((l) => ({ ...l, w: l.more ? l.more.power : this._w(l.entity), name: l.label ?? this._name(l.entity) })).sort((l, g) => +!!l.more - +!!g.more || r(l, g)), p = [];
    for (const l of d) {
      const g = p.length;
      p.push({ ...l, child: !1 });
      const v = (l.children ?? []).map((M) => ({ ...l, ...M, children: void 0, label: void 0, w: this._w(M.entity), name: this._name(M.entity) })).sort(r);
      for (const M of v) p.push({ ...M, child: !0, parentRow: g });
    }
    const f = this._rowEntryX, $ = (l, g) => `${l.route ?? l.trunk} V ${e + g * s + i} H ${f}`, c = (l, g) => `${$(l, l.parentRow ?? 0)} H ${B + 4} V ${e + g * s + i} H ${B + 10}`, _ = (l) => {
      const g = p[l].w;
      if (g === null) return null;
      const v = p.filter((M) => M.child && M.parentRow === l).reduce((M, N) => M + Math.max(N.w ?? 0, 0), 0);
      return Math.max(g - v, 0);
    }, u = (l, g) => l.child ? l.w : _(g), w = p.map((l, g) => ({ l, i: g, w: u(l, g) })).filter(({ w: l }) => l !== null && Math.abs(l) >= E), y = this._wagonSpeed, m = w.flatMap(
      ({ l, i: g, w: v }) => (this._wagonBalls(v, n, l.source) ?? [void 0]).map((M) => ({ l, i: g, radius: M?.r, tint: M?.colour }))
    );
    m.some((l) => l.radius !== void 0) && m.sort((l, g) => (g.radius ?? 0) - (l.radius ?? 0));
    let x = 0;
    const C = m.map(({ l, i: g, radius: v, tint: M }, N) => (N && (x += v === void 0 ? Pe : (m[N - 1].radius ?? 0) + v + 2.5), { i: g, radius: v, tint: M, begin: x / y, travel: It(l.child ? c(l, g) : $(l, g)) / y })), L = Math.max(1, ...C.map((l) => l.begin + l.travel)) + Ne, A = /* @__PURE__ */ new Map();
    for (const l of C)
      A.set(l.i, [...A.get(l.i) ?? [], { period: L, begin: l.begin, travel: l.travel, radius: l.radius, tint: l.tint }]);
    const S = (l, g, v) => (A.get(v) ?? []).map((M) => this._dot(l, M.tint ?? n, g, !0, 2.4, M)), Y = p.reduce((l, g, v) => g.child ? l : v, 0), I = this._pipeTrunk ? t[0]?.trunk : void 0, P = [
      ...I ? [I] : [],
      `M ${Q} ${I ? e + i : e + 4} V ${e + Y * s + i}`,
      ...p.flatMap((l, g) => l.child ? [] : [`M ${Q} ${e + g * s + i} H ${f}`])
    ].join(" ");
    return h`
      ${this._branch(P, n, "row")}
      ${p.map((l, g) => {
      const v = e + g * s, M = l.w === null || Math.abs(l.w) < E;
      if (l.child) {
        const G = e + (l.parentRow ?? 0) * s + s - 3, Z = `${l.name} · enthalten in ${p[l.parentRow ?? 0].name}`;
        return h`
            ${this._branch(`M ${B + 4} ${G} V ${v + i} H ${B + 10}`, n, "child")}
            ${this._bySize ? S(c(l, g), l.w, g) : b}
            <g opacity=${M ? 0.45 : 0.85} class="tap" data-entity=${l.entity}>
              ${this._nameBox(l.name, v, n, Z, 12)}
              ${this._valueCell(K - X, v + 1, X, s - 4, n, F(l.w, this._loc), 9, "power")}
            </g>
            ${this._tap(l.today, this._valueCell(W - q, v + 1, q, s - 4, n, V(T(this._s(l.today)), this._loc), 8.5, "energy"))}`;
      }
      const N = this._bySize ? S($(l, g), _(g), g) : this._dot($(l, g), n, l.w, !0, 2.4);
      if (l.more) {
        const G = l.more.group;
        return h`
            ${N}
            <g class="more" opacity=${l.more.power !== null && M ? 0.55 : 1} @click=${() => this._toggleList(G)}>
              <rect x=${B - 8} y=${v} width=${W - B + 8} height=${s} fill="transparent" />
              <text x=${B + 2} y=${v + s * 0.62} class="small" fill=${n}>${l.name}</text>
              ${l.more.power !== null ? this._valueCell(K - X, v + 1, X, s - 4, n, F(l.w, this._loc), 9, "power") : b}
              ${l.more.today !== null ? this._valueCell(W - q, v + 1, q, s - 4, n, V(l.more.today, this._loc), 8.5, "energy") : b}
            </g>`;
      }
      const rt = l.tip ?? (l.source ? `${l.name} · gespeist von ${l.source}` : l.name);
      return h`
          ${N}
          <g opacity=${M ? 0.45 : 1} class="tap" data-entity=${l.entity}>
            ${this._nameBox(l.name, v, n, rt)}
            ${this._valueCell(K - X, v + 1, X, s - 4, n, F(l.w, this._loc), 9, "power")}
          </g>
          ${this._tap(l.today, this._valueCell(W - q, v + 1, q, s - 4, n, V(T(this._s(l.today)), this._loc), 8.5, "energy"))}`;
    })}
    `;
  }
  /** Power or energy of one list row. */
  _valueCell(t, e, n, s, i, o, a, r) {
    return this._box(t, e, n, s, i, o, a);
  }
  /** Name of a load in a rounded box; long names wrap to two smaller lines. */
  _nameBox(t, e, n, s = t, i = 0) {
    const o = B - 2 + i, a = K - X - 4 - o, { lines: r, small: d } = i ? Ft(t, 9, 12) : Ft(t, 11, 15);
    return h`<g>
      <title>${s}</title>
      <rect x=${o} y=${e + 1} width=${a} height="18" rx="4" fill="none" stroke=${n} stroke-width="1" />
      ${d ? h`<text x=${o + 4} y=${e + 9} class="name" font-size=${this._fs(7.5)}>${r[0]}</text>
              <text x=${o + 4} y=${e + 17} class="name" font-size=${this._fs(7.5)}>${r[1] ?? ""}</text>` : h`<text x=${o + 4} y=${e + 13.5} class="name" font-size=${this._fs(10)}>${r[0]}</text>`}
    </g>`;
  }
  _groupTitle(t, e, n, s, i) {
    const o = i.reduce((a, r) => {
      const d = T(this._s(r.today));
      return d === null ? a : (a ?? 0) + d;
    }, null);
    return h`
      <text x=${Q} y=${t} class="small grp" fill=${e}>${n}</text>
      <text x=${K - X / 2} y=${t} text-anchor="middle" class="small grp" fill=${e}>${F(s, this._loc)}</text>
      <text x=${W - q / 2} y=${t} text-anchor="middle" class="small grp" fill=${e}>${V(o, this._loc)}</text>`;
  }
  /** Total svg height needed for the load lists and the batteries. */
  get _viewH() {
    if (!this._layout) return Kt;
    const t = this._groups(), e = t[t.length - 1], n = e ? e.y0 + e.rows * this._rowH + 8 : 0, s = this._displayBatteries(), i = s.length ? Math.max(...s.map((o) => o.top)) + this._batteryTail : 0;
    return Math.max(this._minViewH, n, i);
  }
  /** House symbol above the house value (area 226..274 x 16..64). */
  _houseIcon(t) {
    return this._icon(Re, 226, 16, 48, t);
  }
  /** Background behind a load group (none in the classic look). */
  _groupPanel(t) {
    return h``;
  }
  /** Small symbol next to a group title. */
  _groupIcon(t) {
    return t.title === "Wallbox" ? this._icon(je, Q + 46, t.titleY - 11, 14, t.colour) : h``;
  }
  _home() {
    const t = this._layout, e = this._c.home, n = this._own("home_power"), s = this._own("unmeasured_power"), i = this._groups(), o = `M ${this._invTop[0]} ${this._invTop[1]} V ${Math.min(152, this._invTop[1] - 8)} H 250 V ${this._houseY + 26}`, a = n === null ? null : Math.max(n - this._offGridLoads, 0);
    return h`
      ${this._houseIcon(e)}
      ${s !== null && !this._unmeasuredInList ? h`<text x="256" y=${this._houseY + 42} class="tiny">nicht erfasst</text>
              <text x="256" y=${this._houseY + 52} class="tiny val">${F(s, this._loc)}</text>` : b}
      ${this._flow(o, e, a, !0, !1)}
      ${this._houseDots(this._houseIn() ?? o, e, a)}
      ${this._houseJunction(a)}
      ${i.length ? this._listsHeader(n) : b}
      ${i.length && this._periodLabel ? h`<text x=${W - q / 2} y="9" text-anchor="middle" class="tiny">${t.energy_period === "rolling24" ? "24 h" : "heute"}</text>` : b}
      ${i.map(
      (r) => h`
          ${this._groupPanel(r)}
          ${this._groupTitle(r.titleY, r.colour, r.title, r.power, r.all)}
          ${this._groupIcon(r)}
          ${this._pipeTrunk ? b : this._flow(r.trunk, r.colour, r.power, !0, !1)}
          ${this._loadList(r.loads, r.y0, r.colour)}
        `
    )}
      ${this._tap(t.entities.home_power, this._box(215, this._houseY, 70, 26, e, F(a, this._loc), 13))}
      <text x="211" y=${this._houseY + 13} text-anchor="end" class="lbl">Haus</text>
      <text x="211" y=${this._houseY + 25} text-anchor="end" class="tiny val">${V(this._houseNetToday, this._loc)}</text>
    `;
  }
  /** Current grid values: power, direction, price and today's import / export. */
  _gridData() {
    const t = this._layout, e = this._own("grid_power"), n = (e ?? 0) < -E, s = n ? t.grid.export_price ? qt(this._s(t.grid.export_price)) : t.grid.export_price_fixed ?? null : qt(this._s(t.grid.price));
    return {
      grid: e,
      exporting: n,
      cents: s,
      label: e === null ? "" : e > E ? "Bezug" : n ? "Einspeisung" : "",
      power: F(e === null ? null : Math.abs(e), this._loc),
      imp: ft(this._s(t.grid.import_today)),
      exp: ft(this._s(t.grid.export_today))
    };
  }
  _grid() {
    const t = this._c.grid, { grid: e, exporting: n, cents: s, label: i, power: o, imp: a, exp: r } = this._gridData();
    return h`
      ${this._flow(`M ${this._invX} ${this._invY + 42} H 84`, t, e, n)}
      ${this._tap(this._layout.entities.grid_power, h`${this._panel(10, 192, 74, 40, t)}
        <text x="47" y=${s === null ? 217 : 209} text-anchor="middle" class="val" font-size=${this._fs(13)}>${o}</text>`)}
      ${s !== null ? h`<text x="47" y="225" text-anchor="middle" class="tiny" fill=${t}>${fe(s, this._loc)}</text>` : b}
      <text x="90" y="207" class="tiny">${i}</text>
      ${this._icon(Ye, 27, 240, 40, t)}
      ${a !== null ? h`<text x="10" y="292" class="small" fill=${t}>↓ ${V(a, this._loc)}<tspan class="tiny"> Bezug</tspan></text>` : b}
      ${r !== null ? h`<text x="10" y="305" class="small">↑ ${V(r, this._loc)}<tspan class="tiny"> Einspeisung</tspan></text>` : b}
    `;
  }
  // -- render -----------------------------------------------------------------
  render() {
    if (this._error)
      return J`<ha-card><div class="msg">${this._error}</div></ha-card>`;
    if (!this._layout || !this.hass)
      return J`<ha-card><div class="msg">Lade Wattrio …</div></ha-card>`;
    const t = this._config?.title;
    return J`
      <ha-card .header=${t ?? b}>
        <svg viewBox=${`0 0 ${Ie} ${this._viewH}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Wattrio – Energiefluss"
          @click=${this._onTap}>
          ${this._defs()} ${this._solar()} ${this._batteries()} ${this._inverter()} ${this._home()} ${this._grid()}
          ${this._overlay()}
        </svg>
      </ha-card>
    `;
  }
};
Wt.styles = jt`
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
let D = Wt;
ut([
  ue({ attribute: !1 })
], D.prototype, "hass");
ut([
  nt()
], D.prototype, "_config");
ut([
  nt()
], D.prototype, "_layout");
ut([
  nt()
], D.prototype, "_error");
ut([
  nt()
], D.prototype, "_expanded");
customElements.get("energiefluss-card") || customElements.define("energiefluss-card", D);
window.customCards = window.customCards ?? [];
window.customCards.some((k) => k.type === "energiefluss-card") || window.customCards.push({
  type: "energiefluss-card",
  name: "Wattrio Energiefluss Klassik",
  description: "Wattrio: animierter Energiefluss im klassischen, flachen Look – eingerichtet über die Wattrio-Integration.",
  preview: !0
});
const We = `<svg
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-battery-2"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6 7h11a2 2 0 0 1 2 2v.5a.5 .5 0 0 0 .5 .5a.5 .5 0 0 1 .5 .5v3a.5 .5 0 0 1 -.5 .5a.5 .5 0 0 0 -.5 .5v.5a2 2 0 0 1 -2 2h-11a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2" />
  <path d="M7 10l0 4" />
  <path d="M10 10l0 4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-bulb"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7" />
  <path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3" />
  <path d="M9.7 17l4.6 0" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-car"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-charging-pile"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M18 7l-1 1" />
  <path d="M14 11h1a2 2 0 0 1 2 2v3a1.5 1.5 0 0 0 3 0v-7l-3 -3" />
  <path d="M4 20v-14a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v14" />
  <path d="M9 11.5l-1.5 2.5h3l-1.5 2.5" />
  <path d="M3 20l12 0" />
  <path d="M4 8l10 0" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-coffee"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 14c.83 .642 2.077 1.017 3.5 1c1.423 .017 2.67 -.358 3.5 -1c.83 -.642 2.077 -1.017 3.5 -1c1.423 -.017 2.67 .358 3.5 1" />
  <path d="M8 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
  <path d="M12 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
  <path d="M3 10h14v5a6 6 0 0 1 -6 6h-2a6 6 0 0 1 -6 -6v-5" />
  <path d="M16.746 16.726a3 3 0 1 0 .252 -5.555" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-cooker"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 7h.01" />
  <path d="M15 7h.01" />
  <path d="M9 7h.01" />
  <path d="M5 5a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -14" />
  <path d="M9 15h6" />
  <path d="M5 11h14" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-device-desktop"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10" />
  <path d="M7 20h10" />
  <path d="M9 16v4" />
  <path d="M15 16v4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-droplet"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M7.502 19.423c2.602 2.105 6.395 2.105 8.996 0c2.602 -2.105 3.262 -5.708 1.566 -8.546l-4.89 -7.26c-.42 -.625 -1.287 -.803 -1.936 -.397a1.376 1.376 0 0 0 -.41 .397l-4.893 7.26c-1.695 2.838 -1.035 6.441 1.567 8.546" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-flame"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 10.941c2.333 -3.308 .167 -7.823 -1 -8.941c0 3.395 -2.235 5.299 -3.667 6.706c-1.43 1.408 -2.333 3.294 -2.333 5.588c0 3.704 3.134 6.706 7 6.706c3.866 0 7 -3.002 7 -6.706c0 -1.712 -1.232 -4.403 -2.333 -5.588c-2.084 3.353 -3.257 3.353 -4.667 2.235" />
</svg>`, en = `<svg
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
</svg>`, nn = `<svg
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
</svg>`, sn = `<svg
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
</svg>`, on = `<svg
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
</svg>`, rn = `<svg
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
</svg>`, an = `<svg
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
</svg>`, ln = `<svg
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
</svg>`, cn = `<svg
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
</svg>`, hn = `<svg
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
</svg>`, dn = `<svg
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
</svg>`, pn = `<svg
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
</svg>`, un = `<svg
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
</svg>`, fn = `<svg
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
function H(k) {
  return [...k.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((t) => t[1]).filter((t) => t !== "M0 0h24v24H0z");
}
const $n = {
  airConditioning: H(We),
  battery: H(De),
  bulb: H(Xe),
  car: H(Ue),
  chargingPile: H(qe),
  coffee: H(Ke),
  cooker: H(Ze),
  desktop: H(Qe),
  droplet: H(Je),
  flame: H(tn),
  fridge: H(en),
  home: H(nn),
  lamp: H(sn),
  microwave: H(on),
  plug: H(rn),
  pool: H(an),
  router: H(ln),
  server: H(cn),
  solarPanel: H(hn),
  tower: H(dn),
  tv: H(pn),
  vacuum: H(un),
  washMachine: H(fn)
}, _n = [
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
function gn(k) {
  const t = k.toLowerCase();
  return _n.find(([e]) => e.test(t))?.[1] ?? "plug";
}
const R = {
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
}, tt = {
  file: "inverter-glass.png",
  width: 300,
  height: 278,
  top: [115.7, 23.5],
  bottom: [100.2, 221.8],
  left: [[18.7, 61], [18.7, 99.1], [18.7, 138.1]]
}, it = {
  file: "solar-glass.png",
  width: 360,
  height: 222,
  face: [[16.8, 42.7], [329.6, 11.1], [348.9, 165], [34.1, 204]],
  across: [0.9949, -0.1005],
  down: [0.1063, 0.9943]
}, mn = {
  solar: "#ffd43b",
  // yellow, clearly apart from the other sources
  battery: "#3ee08f",
  grid: "#4db2ff",
  home: "#2fd4b4",
  flexible: "#6f9dff",
  backup: "#ff6a3d",
  inverter: "#a8d4ff"
}, O = "#cfeaff", yn = [
  [0, -2.2, 2.2, 0],
  [1.6, 2.4, -1.8, -1.2],
  [-1.2, -1, 2, 1.4],
  [0.8, 2.2, -2.4, 0.4]
], _t = 26, wn = 2.5, xn = 0.7, gt = 72, bn = 0.6, kn = 0.7, $e = 5.2, vn = 2.7, Mn = 1.6, ne = { big: $e, medium: vn, small: Mn }, _e = 6, ge = 0, me = 130, Vt = me / it.width, Ln = import.meta.url.replace(/[^/]*$/, "") + it.file, se = 0, mt = 3.5, At = 44, Ct = 18, ye = it.face.map(([k, t]) => [_e + k * Vt, ge + t * Vt]), lt = (k, t) => {
  const [e, n, s, i] = ye, o = [e[0] + (n[0] - e[0]) * k, e[1] + (n[1] - e[1]) * k], a = [i[0] + (s[0] - i[0]) * k, i[1] + (s[1] - i[1]) * k];
  return [o[0] + (a[0] - o[0]) * t, o[1] + (a[1] - o[1]) * t];
}, oe = (() => {
  const [k, t, , e] = ye, n = Math.hypot(t[0] - k[0], t[1] - k[1]), s = Math.hypot(e[0] - k[0], e[1] - k[1]), i = (se + mt) / n, o = (se + mt) / s, a = mt / n, r = mt / s, d = [
    [i, 0.5 - a / 2],
    [0.5 + a / 2, 1 - i]
  ], p = [
    [o, 0.5 - r / 2],
    [0.5 + r / 2, 1 - o]
  ];
  return [0, 1, 2, 3].map((f) => {
    const [$, c] = d[f % 2], [_, u] = p[Math.floor(f / 2)];
    return {
      corners: [lt($, _), lt(c, _), lt(c, u), lt($, u)],
      middle: lt(($ + c) / 2, (_ + u) / 2),
      size: [(c - $) * n, (u - _) * s]
    };
  });
})(), Ot = 82, ct = [104, Ot + 26], Pt = 58, yt = [250, Pt + 26], Nt = 196, wt = Nt, ie = "0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1", zt = (k, t = 0, e = 0) => k.map(([n, s, i, o]) => `M ${n + t} ${s + e} L ${i + t} ${o + e}`).join(" "), re = [
  [22, 40, 8, 86],
  [34, 40, 48, 86],
  [24, 10, 22, 40],
  [32, 10, 34, 40],
  [24, 10, 28, 2],
  [32, 10, 28, 2]
], ae = [
  [12, 12, 44, 12],
  [12, 12, 23.5, 17],
  [44, 12, 32.5, 17],
  [6, 24, 50, 24],
  [6, 24, 22.7, 30],
  [50, 24, 33.3, 30],
  [2, 36, 54, 36],
  [2, 36, 22, 40],
  [54, 36, 34, 40]
], Hn = [
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
], An = [
  [8, 86, 15, 82],
  [48, 86, 55, 82],
  [22, 40, 29, 36],
  [34, 40, 41, 36],
  [28, 2, 35, -2]
], Tt = [
  [12, 12],
  [44, 12],
  [6, 24],
  [50, 24],
  [2, 36],
  [54, 36]
], le = 10, ce = 122, Et = 0.7, ot = 8, xt = 48, he = 1.25, ht = 15, de = 196, vt = 0.24, Mt = [250, 116], Cn = import.meta.url.replace(/[^/]*$/, "") + tt.file, Rt = ([k, t]) => [
  Mt[0] + (k - tt.top[0]) * vt,
  Mt[1] + (t - tt.top[1]) * vt
], bt = tt.left.map(Rt), St = 6, Bt = 132, zn = import.meta.url.replace(/[^/]*$/, "") + R.file, Tn = [
  [0, 0, 0, 0],
  [4, -1.5, -4, 1.5],
  [-1.5, 3, 1.5, -3],
  [-4, 1.5, 4, -1.5]
], En = [
  [28, 2],
  [22, 40],
  [34, 40],
  [15.9, 60],
  [40.1, 60],
  [8, 86],
  [48, 86]
], Dt = class Dt extends D {
  constructor() {
    super(...arguments), this._seen = /* @__PURE__ */ new Map(), this._lastSeen = /* @__PURE__ */ new Map(), this._routeIdx = /* @__PURE__ */ new Map(), this._ghosts = [];
  }
  get _c() {
    return { ...mn, ...this._config?.colours ?? {} };
  }
  // inverter centred under the house; wallbox sits on the left below the pylon
  get _invX() {
    return bt[0][0];
  }
  get _solarX() {
    return 104;
  }
  get _houseY() {
    return Pt;
  }
  get _invY() {
    return Mt[1];
  }
  get _invTop() {
    return Mt;
  }
  get _invBottom() {
    return Rt(tt.bottom);
  }
  get _solarY() {
    return bt[0][1];
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
    return gt + 12;
  }
  // batteries closer together in height than in the classic look
  _displayBatteries() {
    const t = Nt + 50;
    return super._displayBatteries().map((e) => ({ ...e, top: t + (e.top - t) * bn }));
  }
  // denser lists: rows of 15 instead of 22
  // the string labels sit on the middles of the panel's quarters
  get _stringPos() {
    return oe.map(({ middle: [t, e] }) => [t - At / 2, e - Ct / 2]);
  }
  get _pvBoxY() {
    return Ot;
  }
  // wide enough to catch the trains of both tile columns (tile middles at 40 and 110)
  get _pvBox() {
    return [22, 96];
  }
  get _storeY() {
    return Nt;
  }
  get _rowH() {
    return 15;
  }
  _fs(t) {
    return +(t * kn).toFixed(2);
  }
  // each group's feed is one pipe with its list's bracket and branches
  get _pipeTrunk() {
    return !0;
  }
  // no "heute" / "24 h" above the load lists
  get _periodLabel() {
    return !1;
  }
  // glass pipes run right up to each load's symbol
  get _rowEntryX() {
    return B - 1;
  }
  _branch(t, e, n) {
    return h`<g class=${`pipe ${n}`}>
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
  // a group's glass panel reaches 19 above its first row and 3 below its last;
  // the gap keeps PANEL_GAP of air between two panels
  get _groupGap() {
    return 16 + he;
  }
  render() {
    return this._lastSeen = this._seen, this._seen = /* @__PURE__ */ new Map(), this._routeIdx = /* @__PURE__ */ new Map(), super.render();
  }
  updated(t) {
    super.updated(t);
    const e = this.renderRoot.querySelector("svg");
    if (!e || !this._lastSeen.size) return;
    const n = e.getCurrentTime();
    let s = !1;
    for (const [i, { colour: o, b: a }] of this._lastSeen) {
      if (this._seen.has(i) || n < a.begin) continue;
      const r = (n - a.begin) % a.period;
      if (r >= a.travel) continue;
      const d = a.travel - r;
      this._ghosts.push({ colour: o, route: a.route, forward: a.forward, r: a.r, from: r / a.travel, dur: d, start: n, until: performance.now() + d * 1e3 }), setTimeout(() => this.requestUpdate(), d * 1e3 + 50), s = !0;
    }
    this._lastSeen = /* @__PURE__ */ new Map(), s && this.requestUpdate();
  }
  _overlay() {
    const t = performance.now();
    return this._ghosts = this._ghosts.filter((e) => e.until > t), h`${this._ghosts.map((e) => {
      const n = `${e.dur.toFixed(2)}s`, s = `${e.start.toFixed(2)}s`, i = e.forward ? `${e.from.toFixed(4)};1` : `${(1 - e.from).toFixed(4)};0`;
      return this._orb(
        e.r,
        e.colour,
        h`<animateMotion dur=${n} begin=${s} fill="freeze" calcMode="linear" rotate="auto" keyPoints=${i}
            keyTimes="0;1" path=${e.route} />
          <animate attributeName="opacity" dur=${n} begin=${s} fill="freeze" calcMode="discrete" values="1;0"
            keyTimes="0;1" />`
      );
    })}`;
  }
  /** Gradients for glass, shadows, liquid and the halos of the balls. */
  _defs() {
    const t = this._c;
    return h`<defs>
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
      ([e, n]) => h`<radialGradient id=${`ef-halo-${e}`}>
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
    const o = n !== null && Math.abs(n) >= E;
    return h`<g class="tube">
        <path d=${t} class="rim" />
        <path d=${t} class="bore" />
        <path d=${t} class="tint" stroke=${e} stroke-opacity=${o ? 0.24 : 0.08} />
        <path d=${t} class="shine" />
      </g>
      ${i ? this._dot(t, e, n, s) : b}`;
  }
  /** The train on path `d`: radius and start time of each ball, travel time and period. */
  _trainOf(t, e) {
    const n = $t(e).map((r) => ne[r]), s = [];
    let i = 0;
    n.forEach((r, d) => {
      d && (i += n[d - 1] + r + wn), s.push(i / _t);
    });
    const o = It(t) / _t, a = o + (s[s.length - 1] ?? 0) + xn;
    return { radii: n, begins: s, travel: o, period: a };
  }
  /**
   * Lines without their own train logic (everything except the load lists)
   * get a train of balls instead of one ball whose speed or size shows the power.
   */
  _dot(t, e, n, s = !0, i = 3.2, o) {
    if (o)
      return n === null || Math.abs(n) < E ? h`` : this._ball(e, { route: t, forward: s, r: o.radius ?? i, begin: o.begin, travel: o.travel, period: o.period });
    if (n === null || Math.abs(n) < E) return h``;
    const { radii: a, travel: r, period: d, begins: p } = this._trainOf(t, n);
    return h`${p.map(
      (f, $) => this._ball(e, { route: t, forward: s, r: a[$], begin: f, travel: r, period: d })
    )}`;
  }
  /** One ball riding its route once per period. */
  _ball(t, e) {
    const n = this._routeIdx.get(e.route) ?? 0;
    this._routeIdx.set(e.route, n + 1), this._seen.set(`${e.forward ? ">" : "<"}${e.route}#${n}`, { colour: t, b: e });
    const s = (e.travel / e.period).toFixed(4), i = `${e.period.toFixed(2)}s`, o = `${e.begin.toFixed(2)}s`;
    return this._orb(
      e.r,
      t,
      h`<animateMotion dur=${i} begin=${o} repeatCount="indefinite" calcMode="linear" rotate="auto"
          keyPoints=${e.forward ? "0;1;1" : "1;0;0"} keyTimes=${`0;${s};1`} path=${e.route} />
        <animate attributeName="opacity" dur=${i} begin=${o} repeatCount="indefinite" calcMode="discrete"
          values="1;0" keyTimes=${`0;${s}`} />`,
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
    const s = (c) => t === "battery" && !c ? this._c.battery : e, i = (c, _, u) => t === "battery" && u ? this._mixedTrain(c, _) : this._dot(c, s(u), _, u), o = n.map((c) => i(c.route, c.w, c.forward));
    if (t === "pv") {
      const c = `M ${ct[0]} ${ct[1]} V ${this._solarY} H ${this._invX}`, _ = this._own("solar_power"), u = n.flatMap((w) => this._arrivals(w.route, w.w));
      return h`${o}${this._dot(c, e, _, !0)}${this._blob(ct, e, _, u)}`;
    }
    const a = n.reduce((c, _) => _.w === null ? c : (c ?? 0) + _.w, null), [r, d] = this._invBottom, p = `M ${r.toFixed(1)} ${d.toFixed(1)} V ${wt}`, f = (a ?? 0) > 0, $ = [
      ...f ? this._arrivals(p, a) : [],
      ...n.filter((c) => !c.forward).flatMap((c) => this._arrivals(c.route, c.w))
    ];
    return h`${o}${i(p, a, f)}${this._blob([r, wt], s(f), Math.abs(a ?? 0), $)}`;
  }
  /** When the balls of a train on `route` finish their way (at its end, or at its
   *  start for a train running backwards). */
  _arrivals(t, e) {
    if (e === null || Math.abs(e) < E) return [];
    const { radii: n, begins: s, travel: i, period: o } = this._trainOf(t, e);
    return s.map((a, r) => ({ at: a + i, period: o, big: n[r] === $e }));
  }
  /**
   * A drop of mercury where trains meet: its size shows the power that flows
   * through, it wobbles all the time and swells for a moment whenever a ball
   * runs into it (additive animations, one per arriving ball).
   */
  _blob([t, e], n, s, i) {
    if (s === null || Math.abs(s) < E) return h``;
    const o = 2.2 + 1.6 * Math.sqrt(Math.min(Math.abs(s), 8e3) / 1e3), a = Object.entries(this._c).find(([, p]) => p === n)?.[0], r = (p, f) => {
      const $ = (p.big ? 1.4 : 0.6) * (f === "rx" ? 1.15 : 0.85), c = Math.min(0.2, 0.12 / p.period), _ = Math.min(0.6, 0.55 / p.period);
      return h`<animate attributeName=${f} additive="sum" dur=${`${p.period.toFixed(2)}s`}
        begin=${`${p.at.toFixed(2)}s`} repeatCount="indefinite" values=${`0;${$};0;0`}
        keyTimes=${`0;${c.toFixed(4)};${_.toFixed(4)};1`} />`;
    }, d = (p, f, $) => {
      const c = p === "rx" ? [1, 1.1, 0.94, 1] : [1, 0.92, 1.07, 1];
      return h`<animate attributeName=${p} dur=${`${f}s`} begin=${`${$}s`} repeatCount="indefinite"
        calcMode="spline" keyTimes="0;0.33;0.66;1" keySplines=${"0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1"}
        values=${c.map((_) => (o * _).toFixed(2)).join(";")} />`;
    };
    return h`<g>
      <circle cx=${t} cy=${e} r=${o * 2.6} fill=${a ? `url(#ef-halo-${a})` : n} fill-opacity=${a ? b : 0.2} />
      <ellipse cx=${t} cy=${e} rx=${o} ry=${o} fill=${n}>
        ${d("rx", 1.7, 0)}${d("ry", 1.7, 0)}
        ${i.map((p) => h`${r(p, "rx")}${r(p, "ry")}`)}
      </ellipse>
      <ellipse cx=${t} cy=${e} rx=${o} ry=${o} fill="url(#ef-ball)">
        ${d("rx", 1.7, 0)}${d("ry", 1.7, 0)}
        ${i.map((p) => h`${r(p, "rx")}${r(p, "ry")}`)}
      </ellipse>
      <ellipse cx=${t - o * 0.32} cy=${e - o * 0.38} rx=${o * 0.4} ry=${o * 0.24} fill="#ffffff" fill-opacity="0.85" />
    </g>`;
  }
  // the house power runs into a blob in the house box; the load trains leave it
  _houseJunction(t) {
    return this._blob(yt, this._c.home, t, this._arrivals(this._houseIn(), t));
  }
  /** Glowing glass ball: soft halo, coloured body, white core and a sheen. */
  _orb(t, e, n, s = !1) {
    const i = t, o = Object.entries(this._c).find(([, a]) => a === e)?.[0];
    return h`<g opacity=${s ? "0" : b}>
      ${n}
      <circle r=${i * 2.8} fill=${o ? `url(#ef-halo-${o})` : e} fill-opacity=${o ? b : 0.18} />
      <circle r=${i} fill=${e} />
      <circle r=${i} fill="url(#ef-ball)" />
      <circle cx=${-0.3 * i} cy=${-0.35 * i} r=${i * 0.38} fill="#ffffff" fill-opacity="0.85" />
    </g>`;
  }
  // -- glass building blocks -----------------------------------------------------
  /** A glass slab: drop shadow, tinted body, frosted gradient and a top sheen. */
  _panel(t, e, n, s, i) {
    const o = Math.min(7, s / 3);
    return h`<g>
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
    return h`<g transform=${`translate(${e} ${n}) scale(${s / 24})`} fill="none" stroke=${i} stroke-width="1.7"
      stroke-linecap="round" stroke-linejoin="round">${$n[t].map((o) => h`<path d=${o} />`)}</g>`;
  }
  // -- sections ------------------------------------------------------------------
  _solarIcon() {
    return h``;
  }
  /** The glass solar panel picture below the string labels. */
  _solarBack() {
    return h`<image href=${Ln} x=${_e} y=${ge} width=${me}
      height=${(it.height * Vt).toFixed(1)} />`;
  }
  /** One PV string: a glass label filling its quarter of the panel, lying in the
   *  panel's plane, with the same gap to the frame and to its neighbours. */
  _stringTile(t, e, n, s) {
    const i = t + At / 2, o = e + Ct / 2, a = oe.reduce(
      (_, u) => Math.hypot(u.middle[0] - i, u.middle[1] - o) < Math.hypot(_.middle[0] - i, _.middle[1] - o) ? u : _
    ), r = a.corners.map(([_, u]) => `${_.toFixed(1)},${u.toFixed(1)}`).join(" "), [d, p] = it.across, [f, $] = it.down, [, c] = a.size;
    return h`
      <polygon points=${r} fill="#020a14" fill-opacity="0.35" transform="translate(0.8 1.6)" />
      <polygon points=${r} fill=${s} fill-opacity="0.12" />
      <polygon points=${r} fill="url(#ef-slab)" stroke=${s} stroke-opacity="0.6" stroke-width="0.8"
        stroke-linejoin="round" />
      <g transform=${`matrix(${d} ${p} ${f} ${$} ${i.toFixed(1)} ${o.toFixed(1)})`}>
        <text x="0" y=${-c / 2 + c * 0.52} text-anchor="middle" class="val" font-size=${this._fs(12)} font-weight="600"
          >${F(this._w(n), this._loc)}</text>
        <text x="0" y=${-c / 2 + c * 0.84} text-anchor="middle" class="tiny" style=${`font-size:${this._fs(7.5)}px`}
          >${dt(this._name(n), 16)}</text>
      </g>`;
  }
  /** The glass inverter picture, placed by its connectors. */
  _inverter() {
    const [t, e] = Rt([0, 0]);
    return h`<image href=${Cn} x=${t.toFixed(1)} y=${e.toFixed(1)}
      width=${(tt.width * vt).toFixed(1)} height=${(tt.height * vt).toFixed(1)} />`;
  }
  /** Glass cylinder with a moving liquid level; name, SoC, kWh, power, status inside. */
  _batteryWidget(t, e, n, s, i, o, a, r, d = null) {
    const p = e - s / 2 + 2, f = e + s / 2 - 2, $ = (f - p) / 2, c = 3.5, _ = n + 8, u = n + gt, w = Math.max(0, Math.min(100, o ?? 0)), y = u + c - (u + c - _) * (w / 100), m = `ef-bat-${Math.round(e)}-${Math.round(n)}`, x = `M ${p} ${_} V ${u} A ${$} ${c} 0 0 0 ${f} ${u} V ${_} A ${$} ${c} 0 0 0 ${p} ${_} Z`, C = i !== null && Math.abs(i) >= E, L = this._lineFlow(t, i), A = L !== null && L > E, S = C ? 3.4 : 5.5, Y = L !== null && L < -E, I = s < 54, P = d && o !== null ? V(d * o / 100, this._loc) : "";
    return h`<g>
      <ellipse cx=${e} cy=${u + 4} rx=${$ + 8} ry="6" fill="url(#ef-shadow)" />
      <clipPath id=${m}><path d=${x} /></clipPath>
      <path d=${x} fill=${r} fill-opacity="0.07" />
      ${w > 0 ? h`<g clip-path=${`url(#${m})`}>
            ${this._liquid(p, f, y, u + c + 2, r, S)}
          </g>` : b}
      ${A ? h`<g clip-path=${`url(#${m})`}>${this._splash(e, _, y, $, r, L, n)}</g>` : b}
      <path d=${x} fill="url(#ef-tube)" stroke=${O} stroke-opacity="0.55" stroke-width="0.9" />
      ${Y ? this._riseIntoLine(e, u, n, this._c.battery, L) : b}
      <ellipse cx=${e} cy=${_} rx=${$} ry=${c} fill=${r} fill-opacity="0.12" stroke="#e6f6ff" stroke-opacity="0.7"
        stroke-width="0.8" />
      <rect x=${e - 6} y=${n + 3} width="12" height=${_ - n - 3} fill=${r} fill-opacity="0.28" stroke=${O}
        stroke-opacity="0.6" stroke-width="0.7" />
      <ellipse cx=${e} cy=${n + 3} rx="6" ry="1.8" fill="#e6f6ff" fill-opacity="0.45" />
      <text x=${e} y=${n + 20} text-anchor="middle" class="bt" font-size=${this._fs(7.5)}>${dt(t, I ? 9 : 11)}</text>
      <text x=${e} y=${n + 33} text-anchor="middle" class="bt" font-size=${this._fs(13)} font-weight="600">${pt(o, this._loc)}</text>
      <text x=${e} y=${n + 43} text-anchor="middle" class="bt" font-size=${this._fs(8)}>${P}</text>
      <text x=${e} y=${n + 53} text-anchor="middle" class="bt" font-size=${this._fs(8.5)}>${F(i === null ? null : Math.abs(i), this._loc)}</text>
      <text x=${e} y=${n + 62} text-anchor="middle" class="bt" font-size=${this._fs(7.5)}>${a}</text>
    </g>`;
  }
  /**
   * Liquid like a phone's charging animation: one soft surface that slowly
   * sloshes between a few shapes (no repeating waves), a lighter layer behind
   * it and a bright rim. Every shape has the same commands so SMIL can morph
   * between them. Fills x0..x1 from `lvl` down to `bottom`; clip it outside.
   */
  _liquid(t, e, n, s, i, o) {
    const a = e - t, r = ([f, $, c, _], u) => `M ${t - 1} ${(u + f).toFixed(2)} C ${(t + a * 0.35).toFixed(2)} ${(u + $).toFixed(2)} ${(e - a * 0.35).toFixed(2)} ${(u + c).toFixed(2)} ${e + 1} ${(u + _).toFixed(2)}`, d = (f, $, c) => r(yn[f], $) + (c ? ` V ${s} H ${t - 1} Z` : ""), p = (f, $, c, _) => h`<path d=${d(c[0], f, $)}>
        <animate attributeName="d" dur=${`${_.toFixed(1)}s`} repeatCount="indefinite" calcMode="spline"
          keyTimes="0;0.25;0.5;0.75;1" keySplines=${ie}
          values=${[...c, c[0]].map((u) => d(u, f, $)).join(";")} />
      </path>`;
    return h`
      <g fill=${i} fill-opacity="0.35">${p(n - 1, !0, [2, 3, 0, 1], o * 1.3)}</g>
      <g fill="url(#ef-liquid)">${p(n, !0, [0, 1, 2, 3], o)}</g>
      <g fill="none" stroke="#e9fff3" stroke-opacity="0.55" stroke-width="0.8">${p(n, !1, [0, 1, 2, 3], o)}</g>`;
  }
  // load list trains count the power in balls as well, big ones in front
  _wagonBalls(t, e, n) {
    const s = $t(t), i = e === this._c.backup ? this._tints(s, this._backupShares(n)) : this._tints(s);
    return s.map((o, a) => ({ r: ne[o], colour: i[a] }));
  }
  /**
   * Where a battery's backup loads get their power: from the battery (green);
   * a backup-only battery passes power from the house through as well, that
   * part has the house's colours (input up to its output, the rest from the cells).
   */
  _backupShares(t) {
    const e = this._layout?.batteries.find((a) => a.name === t);
    if (!e?.backup_only) return [0, 1, 0];
    const n = Math.max(this._w(e.charge) ?? 0, 0), s = Math.max(this._w(e.discharge) ?? 0, 0), i = s > 0 ? Math.min(n, s) / s : 0, o = this._houseShares();
    return [o[0] * i, o[1] * i + (1 - i), o[2] * i];
  }
  /** Shares of PV, batteries and grid in what the house net gets right now. */
  _houseShares() {
    const t = (this._layout?.batteries ?? []).filter((e) => !e.backup_only).reduce((e, n) => e + Math.max(0, -(T(this._s(n.power)) ?? 0)), 0);
    return He(this._own("solar_power"), t, this._own("grid_power"));
  }
  /** Colours for a train's balls by source shares (PV, battery, grid); default: the house's mix. */
  _tints(t, e = this._houseShares()) {
    const n = [this._c.solar, this._c.battery, this._c.grid];
    return Ae(t, e).map((s) => n[s]);
  }
  /** A train whose balls show where the power comes from (PV, battery, grid). */
  _mixedTrain(t, e, n = !0) {
    if (e === null || Math.abs(e) < E) return h``;
    const { radii: s, begins: i, travel: o, period: a } = this._trainOf(t, e), r = this._tints($t(e));
    return h`${i.map((d, p) => this._ball(r[p], { route: t, forward: n, r: s[p], begin: d, travel: o, period: a }))}`;
  }
  _houseDots(t, e, n) {
    return this._mixedTrain(t, n);
  }
  get _wagonSpeed() {
    return _t;
  }
  /** A battery's own line: from the blob in the storage box to the battery's cap. */
  _route(t, e) {
    return `M ${this._invBottom[0].toFixed(1)} ${wt} V ${wt + kt / 2} H ${t} V ${e}`;
  }
  _batteryRoute(t, e) {
    return this._route(t, e);
  }
  // Trains run into the glass boxes and new ones leave them: each PV string
  // into the middle of "PV gesamt", the house power from the inverter into
  // the middle of the house box, the load trains from there; backup trains
  // start at the bottom of their battery and leave through its shell.
  _stringRoute(t, e) {
    return `M ${t + At / 2} ${e + Ct / 2} V ${Ot + 13} H ${ct[0]} V ${ct[1]}`;
  }
  _houseIn() {
    const [t, e] = this._invTop;
    return `M ${t} ${e} V ${yt[1]}`;
  }
  _houseLead(t) {
    return `M ${yt[0]} ${yt[1]} H 281 V ${t} H 285`;
  }
  _batteryLead(t, e, n, s) {
    return `M ${t} ${e + gt - 2} V ${s} H ${this._batteryOutX(t, n)}`;
  }
  /**
   * Bubbles of a discharging battery: each rises from the bottom to the cap
   * and arrives just when a ball of the outgoing train starts there, so it
   * looks as if the bubble drives on into the line.
   */
  _riseIntoLine(t, e, n, s, i) {
    const o = n + 3, { radii: a, begins: r, period: d } = this._trainOf(this._route(t, n), i);
    return h`${r.map((p, f) => {
      const $ = a[f], c = Math.min(d * 0.8, (e - o) / _t), _ = (c / d).toFixed(4), u = `${d.toFixed(2)}s`, w = `${(p - c).toFixed(2)}s`;
      return h`<circle cx=${t} cy=${e} r=${$} fill=${s} stroke="#ffffff" stroke-opacity="0.75" stroke-width="0.5"
        opacity="0">
        <animate attributeName="cy" dur=${u} begin=${w} repeatCount="indefinite" values=${`${e};${o};${o}`}
          keyTimes=${`0;${_};1`} />
        <animate attributeName="r" dur=${u} begin=${w} repeatCount="indefinite"
          values=${`${$ * 0.45};${$};${$}`} keyTimes=${`0;${_};1`} />
        <animate attributeName="opacity" dur=${u} begin=${w} repeatCount="indefinite" calcMode="discrete"
          values="0.9;0" keyTimes=${`0;${_}`} />
      </circle>`;
    })}`;
  }
  /**
   * A drop falls into the liquid each time a ball of the train arrives at the
   * battery, then a ripple spreads and two droplets jump. Uses the train's own
   * timing, so it stays in step with the arriving balls.
   */
  _splash(t, e, n, s, i, o, a) {
    const { travel: r, period: d, begins: p } = this._trainOf(this._route(t, a), o), f = this._tints($t(o));
    return h`${p.map(($, c) => this._splashOnce(t, e, n, s, f[c] ?? i, d, $ + r))}`;
  }
  /** One drop with ripple, repeating every `period` s from `start` s on. */
  _splashOnce(t, e, n, s, i, o, a) {
    const d = Math.min(0.45, o * 0.35) / o, p = Math.min(0.97, d + 0.6 / o), f = d + (p - d) * 0.4, $ = d + 1e-3, c = (y) => y.toFixed(3), _ = `${o.toFixed(2)}s`, u = `${a.toFixed(2)}s`, w = (y, m, x, C = !1) => h`<animate attributeName=${y}
      dur=${_} begin=${u} repeatCount="indefinite" values=${m} keyTimes=${x}
      calcMode=${C ? "spline" : "linear"} keySplines=${C ? "0.55 0 1 0.6;0 0 1 1" : b} />`;
    return h`
      <ellipse cx=${t} cy=${e} rx="1.5" ry="2.1" fill=${i} stroke="#ffffff" stroke-opacity="0.7" stroke-width="0.4" opacity="0">
        ${w("cy", `${e + 1};${n - 1};${n - 1}`, `0;${c(d)};1`, !0)}
        ${w("opacity", "1;1;0;0", `0;${c(d)};${c($)};1`)}
      </ellipse>
      <ellipse cx=${t} cy=${n} rx="1" ry="0.5" fill="none" stroke="#e9fff3" stroke-width="0.8" opacity="0">
        ${w("rx", `1;1;${c(s * 0.75)};${c(s * 0.75)}`, `0;${c(d)};${c(p)};1`)}
        ${w("ry", "0.5;0.5;2;2", `0;${c(d)};${c(p)};1`)}
        ${w("opacity", "0;0;0.9;0;0", `0;${c(d)};${c($)};${c(p)};1`)}
      </ellipse>
      ${[-1, 1].map(
      (y) => h`<circle cx=${t + y * 3} cy=${n} r="0.9" fill=${i} stroke="#ffffff" stroke-opacity="0.6" stroke-width="0.3"
          opacity="0">
          ${w("cy", `${n};${n};${n - 6};${n};${n}`, `0;${c(d)};${c(f)};${c(p)};1`)}
          ${w("cx", `${t};${t};${t + y * 3};${t + y * 5};${t + y * 5}`, `0;${c(d)};${c(f)};${c(p)};1`)}
          ${w("opacity", "0;0;1;0;0", `0;${c(d)};${c($)};${c(p)};1`)}
        </circle>`
    )}`;
  }
  /** 2.5D glass house: gable front, side wall, roof, chimney and warm windows. */
  _houseIcon(t) {
    const e = this._c.solar;
    return h`<g transform=${`translate(225 ${Pt - 51}) scale(0.9)`}>
      <ellipse cx="28" cy="50" rx="30" ry="5" fill="url(#ef-shadow)" />
      <polygon points="4,28 14,18 42,6 32,16" fill=${t} fill-opacity="0.08" stroke=${O} stroke-opacity="0.3" stroke-width="0.7" />
      <polygon points="24,52 52,40 52,24 24,36" fill=${t} fill-opacity="0.12" stroke=${O} stroke-opacity="0.6" stroke-width="0.8" />
      <polygon points="24,52 52,40 52,24 24,36" fill="url(#ef-slab)" />
      <polygon points="4,44 24,52 24,36 14,18 4,28" fill=${t} fill-opacity="0.2" stroke=${O} stroke-opacity="0.75" stroke-width="0.9" />
      <polygon points="4,44 24,52 24,36 14,18 4,28" fill="url(#ef-slab)" />
      <polygon points="24,36 52,24 42,6 14,18" fill=${t} fill-opacity="0.28" stroke=${O} stroke-opacity="0.75" stroke-width="0.9" />
      <polygon points="24,36 52,24 42,6 14,18" fill="url(#ef-sheen)" />
      <polygon points="36.6,15 39.4,13.8 39.4,5.8 36.6,7" fill=${t} fill-opacity="0.35" stroke=${O} stroke-opacity="0.7" stroke-width="0.7" />
      <polygon points="28.2,43.2 35.2,40.2 35.2,32.2 28.2,35.2" fill=${e} fill-opacity="0.5" stroke=${e} stroke-opacity="0.8" stroke-width="0.6" />
      <polygon points="40.8,37.8 47.8,34.8 47.8,26.8 40.8,29.8" fill=${e} fill-opacity="0.5" stroke=${e} stroke-opacity="0.8" stroke-width="0.6" />
      <polygon points="12,47.2 17,49.2 17,37.2 12,35.2" fill=${t} fill-opacity="0.4" stroke=${O} stroke-opacity="0.7" stroke-width="0.6" />
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
    const t = this._c.grid, e = this._invX, { grid: n, exporting: s, cents: i, label: o, power: a, imp: r, exp: d } = this._gridData(), [p, f] = Tt[Tt.length - 1], $ = le + p * Et, c = ce + (f + 6) * Et, _ = bt[1][1], u = Math.max(c, _) + 12, w = `M ${$.toFixed(1)} ${c.toFixed(1)} Q ${(($ + e) / 2).toFixed(1)} ${u.toFixed(1)} ${e} ${_}`, y = i !== null ? fe(i, this._loc) : "", m = [
      { arrow: "↓", kwh: r, name: "Bez.", active: o === "Bezug" },
      { arrow: "↑", kwh: d, name: "Einsp.", active: o === "Einspeisung" }
    ].filter((A) => A.kwh !== null), x = de, C = x + (i !== null ? 23 : 15), L = C - x + (m.length ? m.length * 8.5 + 3 : 0);
    return h`
      ${this._pylon(t)}
      ${this._flow(w, t, n, !s)}
      ${this._tap(this._layout.entities.grid_power, this._panel(ot, x, xt, L, t))}
      <text x=${ot + xt / 2} y=${x + 11} text-anchor="middle" class="val" font-size=${this._fs(11.5)} font-weight="600"
        >${a}</text>
      ${i !== null ? h`<text x=${ot + xt / 2} y=${x + 19.5} text-anchor="middle" class="dim" style=${`font-size:${this._fs(8.5)}px`}>${y}</text>` : b}
      ${m.length ? h`<line x1=${ot + 3} x2=${ot + xt - 3} y1=${C} y2=${C} class="sep" stroke=${t} />` : b}
      ${m.map(
      (A, S) => h`<text x=${ot + 3} y=${C + 8 + S * 8.5} class=${A.active ? "val" : "dim"} style=${`font-size:${this._fs(7.8)}px`}
          ><tspan fill=${A.active ? t : b}>${A.arrow}</tspan> ${V(A.kwh, this._loc)}<tspan
          class=${A.active ? "" : "tiny"} style=${`font-size:${this._fs(7.5)}px`} fill=${A.active ? t : b}> ${A.name}</tspan></text>`
    )}
      ${this._wallbox(this._carTop(x + L + 8))}
    `;
  }
  /** Top of the car picture: its plate ends flush with the lowest battery, but
   *  never higher than `min` (just below the grid tile). */
  _carTop(t) {
    const e = this._displayBatteries();
    if (!e.length) return t;
    const n = Math.max(...e.map((s) => s.top)) + gt + 3.5;
    return Math.max(t, n - R.height * (Bt / R.width));
  }
  /**
   * Wallbox below the grid tile: the glass car picture (car, glass plate and
   * wallbox) with sloshing liquid inside the car body up to its state of
   * charge; power and today's energy are written on the plate along its front
   * edges. Fed from the inverter's left side into the wallbox.
   */
  _wallbox(t) {
    const e = this._layout?.wallbox;
    if (!e) return h``;
    const n = e.flexible ? this._c.flexible : this._c.home, s = this._w(e.power), i = T(this._s(e.soc ?? void 0)), o = T(this._s(e.today ?? void 0)), a = s === null || Math.abs(s) < E, r = !a && (s ?? 0) > 0, d = Bt / R.width, p = ([j, z]) => [St + j * d, t + z * d], f = i === null ? null : Math.max(0, Math.min(100, i)) / 100, $ = (f ?? 0) * R.liquidHeight, [c, _, u, w] = R.floorQuad, y = ([j, z], U) => `${j.toFixed(1)},${(z - U).toFixed(1)}`, m = (j) => {
      const [z, U, st, Xt] = j.map((we) => Math.max(0, $ + we));
      return {
        body: [y(c, 0), y(_, 0), y(u, 0), y(u, st), y(w, Xt), y(c, z)].join(" "),
        surface: [y(c, z), y(_, U), y(u, st), y(w, Xt)].join(" "),
        edge: [y(c, z), y(_, U), y(u, st)].join(" ")
      };
    }, x = Tn.map((j) => m(j)), C = r ? 3.4 : 5.5, L = (j) => h`<animate attributeName="points" dur=${`${C}s`}
      repeatCount="indefinite" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" keySplines=${ie}
      values=${[...x, x[0]].map((z) => z[j]).join(";")} />`, A = `ef-car-${Math.round(t)}`, S = `translate(${St} ${t}) scale(${d.toFixed(5)})`, Y = this._invX, I = bt[2][1], [P, l] = p(R.wallboxTop), g = de - 12, v = `M ${Y} ${I} H ${Y - 10} V ${g} H ${P.toFixed(1)} V ${l.toFixed(1)}`, [M, N] = p(R.powerText), [rt, G] = p(R.energyText), Z = R.edgeAngle, [at, Ht] = p([(_[0] + u[0]) / 2, (_[1] + u[1]) / 2 - Math.max($ / 2, 14)]);
    return h`
      ${this._flow(v, n, s, !0, !1)}
      ${this._mixedTrain(v, s)}
      <g class="tap" data-entity=${e.power}>
        <title>${e.name} · ${e.flexible ? "Zusatzverbraucher" : "Grundlast"}</title>
        <image href=${zn} x=${St} y=${t} width=${Bt} height=${(R.height * d).toFixed(1)} />
        ${f ? h`<g transform=${S}>
              <clipPath id=${A}><polygon points=${R.tank} /></clipPath>
              <g clip-path=${`url(#${A})`} opacity="0.7">
                <polygon points=${x[0].body} fill="url(#ef-liquid)">${L("body")}</polygon>
                <polygon points=${x[0].surface} fill="#c8ffe0" fill-opacity="0.45">${L("surface")}</polygon>
                <polyline points=${x[0].edge} fill="none" stroke="#e9fff3" stroke-opacity="0.85" stroke-width="2.4"
                  stroke-linejoin="round">${L("edge")}</polyline>
              </g>
            </g>` : b}
        ${i !== null ? h`<text x=${at.toFixed(1)} y=${Ht.toFixed(1)} text-anchor="middle" class="bt" font-size=${this._fs(9)}
              font-weight="600">${pt(i, this._loc)}</text>` : b}
        <text transform=${`translate(${M.toFixed(1)} ${N.toFixed(1)}) rotate(${Z})`} class=${a ? "dim" : "val"}
          style=${`font-size:${this._fs(11)}px`} font-weight="600">${F(s, this._loc)}</text>
        <text transform=${`translate(${rt.toFixed(1)} ${G.toFixed(1)}) rotate(${-Z})`} class="dim"
          style=${`font-size:${this._fs(11)}px`}>${V(o, this._loc)}</text>
      </g>`;
  }
  /** Free-standing pylon of glass rods on a hexagonal glass plate. */
  _pylon(t) {
    const e = zt([...re, ...ae, ...Hn]), n = zt([...re, ...ae], 7, -4), s = zt(An), i = "65.5,84 48.5,92.7 14.5,92.7 -2.5,84 14.5,75.3 48.5,75.3";
    return h`<g transform=${`translate(${le} ${ce}) scale(${Et})`}>
      <ellipse cx="31.5" cy="97" rx="40" ry="7" fill="url(#ef-shadow)" />
      <polygon points=${"65.5,84 65.5,87 48.5,95.7 14.5,95.7 -2.5,87 -2.5,84 14.5,92.7 48.5,92.7"} fill=${t} fill-opacity="0.3" stroke=${O} stroke-opacity="0.4" stroke-width="0.6" />
      <polygon points=${i} fill=${t} fill-opacity="0.14" stroke=${O} stroke-opacity="0.65" stroke-width="0.8" />
      <polygon points=${i} fill="url(#ef-slab)" />
      <path d=${n} fill="none" stroke=${t} stroke-opacity="0.22" stroke-width="2.6" stroke-linecap="round" />
      <path d=${n} fill="none" stroke=${O} stroke-opacity="0.4" stroke-width="0.7" stroke-linecap="round" />
      <path d=${s} fill="none" stroke=${O} stroke-opacity="0.35" stroke-width="1.4" stroke-linecap="round" />
      <path d=${e} fill="none" stroke=${t} stroke-opacity="0.35" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" />
      <path d=${e} fill="none" stroke="#e6f6ff" stroke-opacity="0.9" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
      ${Tt.map(
      ([a, r]) => h`
          <path d=${`M ${a} ${r} V ${r + 6}`} stroke=${O} stroke-opacity="0.8" stroke-width="0.8" />
          <circle cx=${a} cy=${r + 2.5} r="1.4" fill=${t} /><circle cx=${a} cy=${r + 5} r="1.4" fill=${t} />
          <circle cx=${a} cy=${r + 3.7} r="0.6" fill="#ffffff" />`
    )}
      ${En.map(([a, r]) => h`<circle cx=${a} cy=${r} r="1.3" fill="#ffffff" fill-opacity="0.85" />`)}
    </g>`;
  }
  // -- load groups -------------------------------------------------------------
  /** Each group sits on its own tinted glass slab. */
  // a small "Gesamt" box above all load groups: every consumer incl. backup loads
  get _groupsTop() {
    return 22 + ht + he;
  }
  _listsHeader(t) {
    const e = B - 12, n = 4, s = this._c.home, i = T(this._s(this._layout?.home_today));
    return this._tap(this._layout?.entities.home_power, h`
      ${this._panel(e, n, W + 3 - e, ht, s)}
      <text x=${B - 6} y=${n + ht * 0.68} class="small grp" fill=${s}>Gesamt</text>
      <text x=${K - 1} y=${n + ht * 0.68} text-anchor="end" class="val" style=${`font-size:${this._fs(10)}px`}
        font-weight="600">${F(t, this._loc)}</text>
      <text x=${W - 1} y=${n + ht * 0.68} text-anchor="end" class="dim" style=${`font-size:${this._fs(9)}px`}
        >${V(i, this._loc)}</text>`);
  }
  _groupPanel(t) {
    const e = B - 12, n = t.titleY - 13, s = t.y0 + t.rows * this._rowH + 3;
    return this._panel(e, n, W + 3 - e, s - n, t.colour);
  }
  _groupIcon() {
    return h``;
  }
  _groupTitle(t, e, n, s, i) {
    const o = i.reduce((a, r) => {
      const d = T(this._s(r.today));
      return d === null ? a : (a ?? 0) + d;
    }, null);
    return h`
      <text x=${B - 6} y=${t} class="small grp" fill=${e}>${n}</text>
      <text x=${K - 1} y=${t} text-anchor="end" class="small" style=${`font-size:${this._fs(8)}px`} fill=${e}>${F(s, this._loc)}</text>
      <text x=${W - 1} y=${t} text-anchor="end" class="small" style=${`font-size:${this._fs(8)}px`} fill=${e}>${V(o, this._loc)}</text>`;
  }
  /** Line icon chosen from the name, then the name (wrapped if long). */
  _nameBox(t, e, n, s = t, i = 0) {
    const o = this._rowH, a = 9, r = B + i, d = r + a + 3, p = K - X - 2 - d, { lines: f, small: $ } = Ft(t, Math.floor(p / 5.2), Math.floor(p / 4.2));
    return h`<g>
      <title>${s}</title>
      ${this._line(gn(t), r, e + (o - a) / 2, a, n)}
      ${$ ? h`<text x=${d} y=${e + o / 2 - 1.5} class="name" font-size=${this._fs(7.5)}>${f[0]}</text>
              <text x=${d} y=${e + o / 2 + 5.5} class="name" font-size=${this._fs(7.5)}>${f[1] ?? ""}</text>` : h`<text x=${d} y=${e + o / 2 + 3} class="name" font-size=${this._fs(9.5)}>${f[0]}</text>`}
    </g>`;
  }
  /** Plain right-aligned numbers: the group slab is the glass. */
  _valueCell(t, e, n, s, i, o, a, r) {
    return h`<text x=${t + n - 1} y=${e + s / 2 + a * 0.36} text-anchor="end" class=${r === "power" ? "val" : "dim"}
      font-size=${this._fs(a + 0.5)}>${o}</text>`;
  }
};
Dt.styles = [
  D.styles,
  jt`
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
let Yt = Dt;
customElements.get("energiefluss-glass-card") || customElements.define("energiefluss-glass-card", Yt);
window.customCards = window.customCards ?? [];
window.customCards.some((k) => k.type === "energiefluss-glass-card") || window.customCards.push({
  type: "energiefluss-glass-card",
  name: "Wattrio Energiefluss Glas",
  description: "Wattrio: Energiefluss im 2.5D-Glas-Look mit Glasrohren und leuchtenden Kugelzügen – gleiche Daten wie Wattrio Klassik.",
  preview: !0
});
