import { i as le, e as ye, b as q, A as b, a as Rt, n as ce, r as J, U as Dt, w as me, c as B, d as c, l as we, f as xe, p as St, g as be, k as dt, h as V, j as O, s as at, m as ke, o as lt, q as Tt, t as Xt, u as he, v as pt, x as ve, y as Me } from "./energiefluss-shared-DijpqWKb.js";
var Le = Object.defineProperty, kt = (k, t, e, n) => {
  for (var s = void 0, i = k.length - 1, o; i >= 0; i--)
    (o = k[i]) && (s = o(t, e, s) || s);
  return s && Le(t, e, s), s;
};
const He = {
  entry_id: "Anlage",
  title: "Titel der Karte (optional)",
  flow_style: "Animation",
  max_power: "Leistung für größte bzw. schnellste Punkte"
}, Ae = {
  max_power: "Ab dieser Leistung sind die Punkte am größten bzw. schnellsten. Standard 5000 W."
}, Nt = class Nt extends le {
  constructor() {
    super(...arguments), this._instances = [], this._ready = !1;
  }
  setConfig(t) {
    this._config = t;
  }
  async firstUpdated() {
    await ye(), this.hass && (this._instances = await this.hass.callWS({ type: "energiefluss/instances" })), this._ready = !0;
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
    return !this._ready || !this._config ? q`<div class="hint">Lade …</div>` : this._instances.length ? q`
      <h2>Karte</h2>
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schema()}
        .computeLabel=${(t) => He[t.name] ?? t.name}
        .computeHelper=${(t) => Ae[t.name]}
        @value-changed=${this._cardChanged}
      ></ha-form>
      <h2 class="spaced">Anlage</h2>
      <p class="hint">
        Gilt für alle Karten dieser Anlage. Änderungen hier mit <b>„Anlage speichern“</b> übernehmen – das
        Speichern unten im Dialog speichert nur die Karten-Einstellungen oben.
      </p>
      ${this._entryId ? q`<energiefluss-editor compact .hass=${this.hass} .entryId=${this._entryId}></energiefluss-editor>` : b}
    ` : q`<div class="hint">
        Noch keine Anlage angelegt: Einstellungen → Geräte &amp; Dienste → Integration hinzufügen → „Energiefluss“.
      </div>`;
  }
};
Nt.styles = Rt`
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
let Q = Nt;
kt([
  ce({ attribute: !1 })
], Q.prototype, "hass");
kt([
  J()
], Q.prototype, "_config");
kt([
  J()
], Q.prototype, "_instances");
kt([
  J()
], Q.prototype, "_ready");
customElements.get("energiefluss-card-editor") || customElements.define("energiefluss-card-editor", Q);
var Ee = Object.defineProperty, ct = (k, t, e, n) => {
  for (var s = void 0, i = k.length - 1, o; i >= 0; i--)
    (o = k[i]) && (s = o(t, e, s) || s);
  return s && Ee(t, e, s), s;
};
const Ce = (k) => k.reduce((t, e) => t + 1 + (e.children?.length ?? 0), 0), ze = {
  solar: "#ff9800",
  battery: "#ff69b4",
  grid: "#5490c2",
  home: "#5fb6ad",
  flexible: "#9575cd",
  backup: "#ef5350",
  inverter: "#959595"
}, Be = 554, Se = 148, Wt = 400, Ut = 240, wt = 22, T = 396, W = T - 20, nt = 504, U = 40, Z = 550, tt = 42, Te = 22, Zt = 358, Ie = 37, qt = 364, Kt = 370, z = 5, Qt = 40, Ve = 14, Oe = 0.8, Fe = "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z", Pe = "M8.28,5.45L6.5,4.55L7.76,2H16.24L17.5,4.55L15.72,5.45L15,4H9L8.28,5.45M18.62,8H14.09L13.3,5H10.7L9.91,8H5.38L4.1,10.55L5.89,11.44L6.62,10H17.38L18.1,11.44L19.89,10.55L18.62,8M17.77,22H15.7L15.46,21.1L12,15.9L8.53,21.1L8.3,22H6.23L9.12,11H11.19L10.83,12.35L12,14.1L13.16,12.35L12.81,11H14.88L17.77,22M11.4,15L10.5,13.65L9.32,18.13L11.4,15M14.68,18.12L13.5,13.64L12.6,15L14.68,18.12Z", Re = "M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z", Ne = "M4,2H20A2,2 0 0,1 22,4V14A2,2 0 0,1 20,16H15V20H18V22H13V16H11V22H6V20H9V16H4A2,2 0 0,1 2,14V4A2,2 0 0,1 4,2M4,4V8H11V4H4M4,14H11V10H4V14M20,14V10H13V14H20M20,4H13V8H20V4Z", Yt = class Yt extends le {
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
    super.connectedCallback(), window.addEventListener(Dt, this._onUpdated);
  }
  disconnectedCallback() {
    window.removeEventListener(Dt, this._onUpdated), super.disconnectedCallback();
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
    return me(this._s(t));
  }
  _own(t) {
    return B(this._s(this._layout?.entities[t]));
  }
  _name(t) {
    return this._s(t)?.attributes.friendly_name ?? t.split(".")[1];
  }
  get _loc() {
    return this.hass?.locale?.language ?? "de";
  }
  get _c() {
    return { ...ze, ...this._config?.colours ?? {} };
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
    return Ut;
  }
  /** The card is at least this tall. */
  get _minViewH() {
    return Wt;
  }
  /** Room the card keeps below the top of the lowest battery. */
  get _batteryTail() {
    return 138;
  }
  /** Height of one load list row; looks may make the lists denser. */
  get _rowH() {
    return Te;
  }
  /** Makes `content` open the more-info dialog of `entity` when clicked. */
  _tap(t, e) {
    return t ? c`<g class="tap" data-entity=${t}>${e}</g>` : e;
  }
  /** Font size for text set in the templates; looks may scale all of it. */
  _fs(t) {
    return t;
  }
  // -- layout knobs that alternative looks may move ----------------------------
  /** Left edge of the inverter box (60 x 60). */
  get _invX() {
    return Se;
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
  _wagonBalls(t, e, n) {
    return null;
  }
  /** Dots of the house line (from the inverter to the house). */
  _houseDots(t, e, n) {
    return this._dot(t, e, n, !0);
  }
  /** Speed of the load list trains in px per second. */
  get _wagonSpeed() {
    return Qt;
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
    return n?.backup_only ? Math.max(this._w(n.charge) ?? 0, 0) : e;
  }
  /** Power the backup-only batteries give out (to loads that are not on the house net):
   *  their measured output, so loads that are only sometimes on them do not count. */
  get _offGridLoads() {
    return (this._layout?.batteries ?? []).filter((t) => t.backup_only).reduce((t, e) => t + Math.max(this._w(e.discharge) ?? 0, 0), 0);
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
      <path d=${t} fill="none" stroke=${e} stroke-width=${we(n, this._max)} stroke-opacity="0.85" />
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
    if (n === null || Math.abs(n) < z) return c``;
    const a = this._bySize, r = o?.radius ?? (a ? Math.max(1.7, xe(n, this._max) * (i / 3.2)) : i);
    if (o) {
      const p = (o.travel / o.period).toFixed(4), f = { dur: `${o.period.toFixed(2)}s`, begin: `${o.begin.toFixed(2)}s` };
      return this._orb(
        r,
        e,
        c`<animateMotion dur=${f.dur} begin=${f.begin} repeatCount="indefinite" calcMode="linear" rotate="auto"
            keyPoints="0;1;1" keyTimes=${`0;${p};1`} path=${t} />
          <animate attributeName="opacity" dur=${f.dur} begin=${f.begin} repeatCount="indefinite"
            calcMode="discrete" values="1;0" keyTimes=${`0;${p}`} />`,
        !0
      );
    }
    const h = this._dotDuration(t, n);
    return this._orb(
      r,
      e,
      c`<animateMotion dur=${`${h.toFixed(2)}s`} repeatCount="indefinite" calcMode="linear"
        rotate=${s ? "auto" : "auto-reverse"}
        keyPoints=${s ? "0;1" : "1;0"} keyTimes="0;1" path=${t} />`
    );
  }
  /** Seconds a (non-train) dot needs for path `d`; looks use it to sync their own effects. */
  _dotDuration(t, e) {
    return this._bySize ? Math.max(0.6, St(t) / Qt) : be(e, this._max);
  }
  /** Draws a moving dot; `motion` holds its animation elements. Looks override this. */
  _orb(t, e, n, s = !1) {
    return c`<circle r=${t} fill=${e} opacity=${s ? "0" : b}>${n}</circle>`;
  }
  /** Extra <defs> (filters, gradients) for alternative looks. */
  _defs() {
    return c``;
  }
  /** Background of a box; looks override this. */
  _panel(t, e, n, s, i) {
    return c`<rect x=${t} y=${e} width=${n} height=${s} rx="4" fill="none" stroke=${i} stroke-width="1" />`;
  }
  _box(t, e, n, s, i, o, a = 12) {
    return c`
      ${this._panel(t, e, n, s, i)}
      <text x=${t + n / 2} y=${e + s / 2 + a * 0.35} text-anchor="middle" class="val" font-size=${this._fs(a)}>${o}</text>
    `;
  }
  _icon(t, e, n, s, i) {
    return c`<path d=${t} fill=${i} transform=${`translate(${e} ${n}) scale(${s / 24})`} />`;
  }
  // -- sections ---------------------------------------------------------------
  _solar() {
    const t = this._layout, e = this._c.solar, n = this._own("solar_power"), s = t.solar.strings.slice(0, 4), i = this._stringPos, o = this._pvBoxY, [a, r] = this._pvBox, h = a + r + 6, p = dt(this._s(t.solar.today)), f = dt(this._s(t.solar.forecast_remaining)), $ = s.map((_, y) => this._stringRoute(i[y][0], i[y][1])), d = s.length > 0 && $.every((_) => _ !== null), u = `M ${this._solarX} ${o + 26} V ${this._solarY} H ${this._invX}`;
    return c`
      ${this._solarBack()}
      ${d ? (
      // the line first, the strings' dots on it, tiles and box on top (dots pass below the glass)
      c`${this._flow(u, e, n, !0, !1)}
            ${this._trainDots("pv", e, s.map((_, y) => ({ route: $[y], w: this._w(_.entity), forward: !0 })))}`
    ) : b}
      ${s.map((_, y) => {
      const [w, g] = i[y];
      return this._tap(_.entity, this._stringTile(w, g, _.entity, e));
    })}
      ${this._solarIcon(e)}
      ${this._tap(t.entities.solar_power, this._box(a, o, r, 26, e, V(n, this._loc), 13))}
      <text x=${h} y=${o + 9} class="lbl">PV gesamt</text>
      ${p !== null ? c`<text x=${h} y=${o + 22} class="small" fill=${e}>${O(p, this._loc)} heute</text>` : b}
      ${f !== null ? c`<text x=${h} y=${o + 34} class="small">Rest ${O(f, this._loc)}</text>` : b}
      ${d ? b : this._flow(u, e, n, !0)}
    `;
  }
  /** Drawn first in the PV section, below the string tiles (nothing in the classic look). */
  _solarBack() {
    return c``;
  }
  /** Symbol next to the PV strings. */
  _solarIcon(t) {
    return this._icon(Ne, 152, 34, 26, t);
  }
  /** One PV string: value box with its name below (tile at x, y; 60 x 38 available). */
  _stringTile(t, e, n, s) {
    return c`${this._box(t, e, 60, 24, s, V(this._w(n), this._loc), 11)}
      <text x=${t} y=${e + 35} class="lbl">${at(this._name(n), 14)}</text>`;
  }
  /** Batteries in display order: those with a backup output go to the right. */
  _displayBatteries() {
    const t = this._layout?.batteries ?? [], e = t.filter((r) => !(r.backup ?? []).length), n = t.filter((r) => (r.backup ?? []).length), s = [...e, ...n], i = ke(s.length), o = this._batteryShift(s.length), a = this._storeY - Ut;
    return s.map((r, h) => ({ ...r, ...i[h], cx: i[h].cx + o, top: i[h].top + a, index: h }));
  }
  _batteries() {
    const t = this._layout, e = this._c.battery;
    if (!t.batteries.length) return c``;
    const n = this._own("battery_soc"), s = this._own("battery_energy"), i = this._displayBatteries();
    i.length;
    const o = i.map((g) => this._lineFlow(g.name, B(this._s(g.power)))), r = i.some((g) => g.backup_only) ? o.reduce((g, x) => x === null ? g : (g ?? 0) + x, null) : this._own("battery_power"), h = Math.min(...i.map((g) => g.cx - g.w / 2)), p = Math.max(...i.map((g) => g.cx + g.w / 2)) - h, [f, $] = this._invBottom, d = this._storeY, u = Math.min(Math.max(f, h + 10), h + p - 10), _ = u === f ? `M ${f} ${$} V ${d}` : `M ${f} ${$} V ${d - 5} H ${u} V ${d}`, y = i.map((g) => this._batteryRoute(g.cx, g.top)), w = y.every((g) => g !== null);
    return c`
      ${i.map((g, x) => {
      const { cx: H, top: E, w: L } = g, C = B(this._s(g.power)), P = B(this._s(g.soc)), S = `M ${H} ${d + wt} V ${E}`, R = C === null ? "" : C > z ? "lädt" : C < -z ? "entlädt" : "ruht", l = o[x];
      return c`
          ${this._flow(S, e, l, (l ?? 0) > 0, !w)}
          ${this._tap(g.power, this._batteryWidget(g.name, H, E, L, C, P, R, e, g.capacity_kwh))}
        `;
    })}
      ${this._flow(_, e, r, (r ?? 0) > 0, !w)}
      ${w ? this._trainDots(
      "battery",
      e,
      i.map((g, x) => ({ route: y[x], w: o[x], forward: (o[x] ?? 0) > 0 }))
    ) : b}
      ${this._tap(t.entities.battery_soc, this._box(
      h,
      d,
      p,
      wt,
      e,
      `${p >= 120 ? "Speicher " : ""}${lt(n, this._loc)}${s !== null && p >= 80 ? ` · ${O(s, this._loc)}` : ""}`,
      p >= 150 ? 11 : 10
    ))}
    `;
  }
  /** One battery below the storage box: widget spans top .. top + 104 around cx. */
  _batteryWidget(t, e, n, s, i, o, a, r, h = null) {
    const p = s < 54, f = Math.max(0, Math.min(100, o ?? 0));
    return c`
      ${this._box(e - s / 2, n, s, 22, r, V(i === null ? null : Math.abs(i), this._loc), p ? 10 : 11)}
      <text x=${e} y=${n + 32} text-anchor="middle" class="tiny">${a}</text>
      <rect x=${e - 9} y=${n + 42} width="18" height="32" rx="3" fill="none" stroke=${r} />
      <rect x=${e - 4} y=${n + 39} width="8" height="3" fill=${r} />
      <rect x=${e - 7} y=${n + 72 - 28 * f / 100} width="14" height=${28 * f / 100} rx="1" fill=${r} fill-opacity="0.7" />
      <text x=${e} y=${n + 91} text-anchor="middle" class="soc">${lt(o, this._loc)}</text>
      <text x=${e} y=${n + 104} text-anchor="middle" class="tiny">${at(t, p ? 10 : 14)}</text>
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
    const e = this._c, n = W, s = [], i = this._rowH, o = i / 2 - 1;
    let a = 22;
    const r = (u, _, y, w, g, x, H, E) => {
      if (!y.length) return;
      const L = this._listLimit(u), C = L !== null && y.length > L, P = this._expanded.has(u);
      let S = y;
      if (C && !P) {
        const D = (X) => B(this._s(X.today)) ?? 0, ot = new Set([...y].sort((X, vt) => D(vt) - D(X)).slice(0, L));
        S = y.filter((X) => ot.has(X));
      }
      const R = Ce(S) + (C ? 1 : 0), l = Math.max(a + 6, H ? H.pref - 10 : 0), m = H ? Math.min(Math.max(l + o, H.lo), H.hi) : l + o, v = g(l + o, m), M = E?.(m), N = M ? `${M} ${v.replace(/^M\s+\S+\s+\S+\s*/, "")}` : void 0;
      s.push({
        title: u,
        colour: _,
        power: w,
        titleY: l - 6,
        y0: l,
        trunk: v,
        loads: S.map((D) => ({ ...D, trunk: v, route: N, source: x })),
        all: y,
        rows: R,
        more: C ? { hidden: y.length - S.length, expanded: P } : void 0
      }), a = l + R * i + this._groupGap;
    }, h = [...t.loads.fixed], p = t.entities.unmeasured_power;
    this._unmeasuredInList && p && h.push({
      entity: p,
      today: t.unmeasured_today ?? null,
      label: "Nicht erfasst",
      tip: "Nicht erfasst · Hausverbrauch ohne die gemessenen Verbraucher"
    });
    const f = this._laneFinder();
    r(
      "Grundlast",
      e.home,
      h,
      this._sumW(h),
      (u) => `M 285 79 H ${f(300, 79, u)} V ${u} H ${n}`,
      void 0,
      void 0,
      () => this._houseLead(79)
    ), r(
      "Zusätzlich",
      e.flexible,
      t.loads.flexible,
      this._sumW(t.loads.flexible),
      (u) => `M 285 89 H ${f(306, 89, u)} V ${u} H ${n}`,
      void 0,
      void 0,
      () => this._houseLead(89)
    );
    const $ = t.wallbox;
    if ($ && this._wallboxInList) {
      const u = B(this._s($.soc ?? void 0)), _ = u !== null ? `${$.name} Auto ${lt(u, this._loc)}` : $.name;
      r(
        "Wallbox",
        $.flexible ? e.flexible : e.home,
        [{ entity: $.power, today: $.today, label: _, tip: `${$.name} · ${$.flexible ? "Zusatzverbraucher" : "Grundlast"}` }],
        this._w($.power),
        (y, w) => `M ${this._invX + 60} ${w} H ${Zt} V ${y} H ${n}`,
        void 0,
        { pref: this._invY + Ie, lo: this._invY + 6, hi: this._invY + 56 }
        // anywhere on the inverter's right edge
      );
    }
    return this._displayBatteries().filter((u) => (u.backup ?? []).length).reverse().forEach((u, _) => {
      const y = _ === 0 ? qt : Kt, w = _ === 0 ? { pref: u.top + 57, lo: u.top + 46, hi: u.top + 70 } : { pref: u.top + 68, lo: u.top + 64, hi: u.top + 72 };
      r(
        at(u.name, 12),
        // red colour + feed line from the battery mark it as backup
        e.backup,
        u.backup ?? [],
        this._sumW(u.backup ?? []),
        (g, x) => `M ${this._batteryOutX(u.cx, u.w)} ${x} H ${y} V ${g} H ${n}`,
        u.name,
        w,
        (g) => this._batteryLead(u.cx, u.top, u.w, g)
      );
    }), s;
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
    return T - 3;
  }
  /** Lines inside a load list: the bracket with the rows' branches (one path),
   *  or the dashed link from a load to a load contained in it. */
  _branch(t, e, n) {
    return c`<path d=${t} fill="none" stroke=${e} stroke-width="1" stroke-opacity="0.6"
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
  /** The "+ N weitere" / "− weniger" row below a folded list. */
  _moreRow(t) {
    const e = this._rowH, n = t.y0 + (t.rows - 1) * e, s = t.more.expanded ? "− weniger" : `+ ${t.more.hidden} weitere`;
    return c`<g class="more" @click=${() => this._toggleList(t.title)}>
      <rect x=${T - 8} y=${n} width=${Z - T + 8} height=${e} fill="transparent" />
      <text x=${T + 2} y=${n + e * 0.62} class="small" fill=${t.colour}>${s}</text>
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
      const o = Math.min(...t.map((r) => r.cx - r.w / 2)) - 3, a = Math.max(...t.map((r) => r.cx + r.w / 2)) + 3;
      e.push({ x0: o, x1: a, y0: this._storeY - 3, y1: this._storeY + wt + 3 });
    }
    const n = [qt, Kt, ...this._layout?.wallbox && this._wallboxInList ? [Zt] : []], s = [], i = (o, a, r) => {
      const [h, p] = a < r ? [a, r] : [r, a];
      return !e.some((f) => o >= f.x0 && o <= f.x1 && p >= f.y0 && h <= f.y1) && !n.some((f) => Math.abs(f - o) < 4) && !s.some((f) => Math.abs(f - o) < 5);
    };
    return (o, a, r) => {
      let h = o;
      for (; !i(h, a, r) && h < W - 8; ) h += 3;
      return h >= W - 8 && (h = o), s.push(h), h;
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
    const s = this._rowH, i = s / 2 - 1, o = (l) => l.w !== null && Math.abs(l.w) >= z, a = (l) => B(this._s(l.today)) ?? 0, r = (l, m) => this._idleByEnergy ? Number(o(m)) - Number(o(l)) || (o(l) ? m.w - l.w : a(m) - a(l)) || l.name.localeCompare(m.name) : (m.w ?? -1 / 0) - (l.w ?? -1 / 0) || l.name.localeCompare(m.name), h = t.map((l) => ({ ...l, w: this._w(l.entity), name: l.label ?? this._name(l.entity) })).sort(r), p = [];
    for (const l of h) {
      const m = p.length;
      p.push({ ...l, child: !1 });
      const v = (l.children ?? []).map((M) => ({ ...l, ...M, children: void 0, label: void 0, w: this._w(M.entity), name: this._name(M.entity) })).sort(r);
      for (const M of v) p.push({ ...M, child: !0, parentRow: m });
    }
    const f = this._rowEntryX, $ = (l, m) => `${l.route ?? l.trunk} V ${e + m * s + i} H ${f}`, d = (l, m) => `${$(l, l.parentRow ?? 0)} H ${T + 4} V ${e + m * s + i} H ${T + 10}`, u = (l) => {
      const m = p[l].w;
      if (m === null) return null;
      const v = p.filter((M) => M.child && M.parentRow === l).reduce((M, N) => M + Math.max(N.w ?? 0, 0), 0);
      return Math.max(m - v, 0);
    }, _ = (l, m) => l.child ? l.w : u(m), y = p.map((l, m) => ({ l, i: m, w: _(l, m) })).filter(({ w: l }) => l !== null && Math.abs(l) >= z), w = this._wagonSpeed, g = y.flatMap(
      ({ l, i: m, w: v }) => (this._wagonBalls(v, n, l.source) ?? [void 0]).map((M) => ({ l, i: m, radius: M?.r, tint: M?.colour }))
    );
    g.some((l) => l.radius !== void 0) && g.sort((l, m) => (m.radius ?? 0) - (l.radius ?? 0));
    let x = 0;
    const H = g.map(({ l, i: m, radius: v, tint: M }, N) => (N && (x += v === void 0 ? Ve : (g[N - 1].radius ?? 0) + v + 2.5), { i: m, radius: v, tint: M, begin: x / w, travel: St(l.child ? d(l, m) : $(l, m)) / w })), E = Math.max(1, ...H.map((l) => l.begin + l.travel)) + Oe, L = /* @__PURE__ */ new Map();
    for (const l of H)
      L.set(l.i, [...L.get(l.i) ?? [], { period: E, begin: l.begin, travel: l.travel, radius: l.radius, tint: l.tint }]);
    const C = (l, m, v) => (L.get(v) ?? []).map((M) => this._dot(l, M.tint ?? n, m, !0, 2.4, M)), P = p.reduce((l, m, v) => m.child ? l : v, 0), S = this._pipeTrunk ? t[0]?.trunk : void 0, R = [
      ...S ? [S] : [],
      `M ${W} ${S ? e + i : e + 4} V ${e + P * s + i}`,
      ...p.flatMap((l, m) => l.child ? [] : [`M ${W} ${e + m * s + i} H ${f}`])
    ].join(" ");
    return c`
      ${this._branch(R, n, "row")}
      ${p.map((l, m) => {
      const v = e + m * s, M = l.w === null || Math.abs(l.w) < z;
      if (l.child) {
        const D = e + (l.parentRow ?? 0) * s + s - 3, ot = `${l.name} · enthalten in ${p[l.parentRow ?? 0].name}`;
        return c`
            ${this._branch(`M ${T + 4} ${D} V ${v + i} H ${T + 10}`, n, "child")}
            ${this._bySize ? C(d(l, m), l.w, m) : b}
            <g opacity=${M ? 0.45 : 0.85} class="tap" data-entity=${l.entity}>
              ${this._nameBox(l.name, v, n, ot, 12)}
              ${this._valueCell(nt - U, v + 1, U, s - 4, n, V(l.w, this._loc), 9, "power")}
            </g>
            ${this._tap(l.today, this._valueCell(Z - tt, v + 1, tt, s - 4, n, O(B(this._s(l.today)), this._loc), 8.5, "energy"))}`;
      }
      const N = l.tip ?? (l.source ? `${l.name} · gespeist von ${l.source}` : l.name);
      return c`
          ${this._bySize ? C($(l, m), u(m), m) : this._dot($(l, m), n, l.w, !0, 2.4)}
          <g opacity=${M ? 0.45 : 1} class="tap" data-entity=${l.entity}>
            ${this._nameBox(l.name, v, n, N)}
            ${this._valueCell(nt - U, v + 1, U, s - 4, n, V(l.w, this._loc), 9, "power")}
          </g>
          ${this._tap(l.today, this._valueCell(Z - tt, v + 1, tt, s - 4, n, O(B(this._s(l.today)), this._loc), 8.5, "energy"))}`;
    })}
    `;
  }
  /** Power or energy of one list row. */
  _valueCell(t, e, n, s, i, o, a, r) {
    return this._box(t, e, n, s, i, o, a);
  }
  /** Name of a load in a rounded box; long names wrap to two smaller lines. */
  _nameBox(t, e, n, s = t, i = 0) {
    const o = T - 2 + i, a = nt - U - 4 - o, { lines: r, small: h } = i ? Tt(t, 9, 12) : Tt(t, 11, 15);
    return c`<g>
      <title>${s}</title>
      <rect x=${o} y=${e + 1} width=${a} height="18" rx="4" fill="none" stroke=${n} stroke-width="1" />
      ${h ? c`<text x=${o + 4} y=${e + 9} class="name" font-size=${this._fs(7.5)}>${r[0]}</text>
              <text x=${o + 4} y=${e + 17} class="name" font-size=${this._fs(7.5)}>${r[1] ?? ""}</text>` : c`<text x=${o + 4} y=${e + 13.5} class="name" font-size=${this._fs(10)}>${r[0]}</text>`}
    </g>`;
  }
  _groupTitle(t, e, n, s, i) {
    const o = i.reduce((a, r) => {
      const h = B(this._s(r.today));
      return h === null ? a : (a ?? 0) + h;
    }, null);
    return c`
      <text x=${W} y=${t} class="small grp" fill=${e}>${n}</text>
      <text x=${nt - U / 2} y=${t} text-anchor="middle" class="small grp" fill=${e}>${V(s, this._loc)}</text>
      <text x=${Z - tt / 2} y=${t} text-anchor="middle" class="small grp" fill=${e}>${O(o, this._loc)}</text>`;
  }
  /** Total svg height needed for the load lists and the batteries. */
  get _viewH() {
    if (!this._layout) return Wt;
    const t = this._groups(), e = t[t.length - 1], n = e ? e.y0 + e.rows * this._rowH + 8 : 0, s = this._displayBatteries(), i = s.length ? Math.max(...s.map((o) => o.top)) + this._batteryTail : 0;
    return Math.max(this._minViewH, n, i);
  }
  /** House symbol above the house value (area 226..274 x 16..64). */
  _houseIcon(t) {
    return this._icon(Fe, 226, 16, 48, t);
  }
  /** Background behind a load group (none in the classic look). */
  _groupPanel(t) {
    return c``;
  }
  /** Small symbol next to a group title. */
  _groupIcon(t) {
    return t.title === "Wallbox" ? this._icon(Re, W + 46, t.titleY - 11, 14, t.colour) : c``;
  }
  _home() {
    const t = this._layout, e = this._c.home, n = this._own("home_power"), s = this._own("unmeasured_power"), i = this._groups(), o = `M ${this._invTop[0]} ${this._invTop[1]} V ${Math.min(152, this._invTop[1] - 8)} H 250 V 96`, a = n === null ? null : Math.max(n - this._offGridLoads, 0);
    return c`
      ${this._houseIcon(e)}
      ${s !== null && !this._unmeasuredInList ? c`<text x="256" y="112" class="tiny">nicht erfasst</text>
              <text x="256" y="122" class="tiny val">${V(s, this._loc)}</text>` : b}
      ${this._flow(o, e, a, !0, !1)}
      ${this._houseDots(this._houseIn() ?? o, e, a)}
      ${this._houseJunction(a)}
      ${i.length && this._periodLabel ? c`<text x=${Z - tt / 2} y="9" text-anchor="middle" class="tiny">${t.energy_period === "rolling24" ? "24 h" : "heute"}</text>` : b}
      ${i.map(
      (r) => c`
          ${this._groupPanel(r)}
          ${this._groupTitle(r.titleY, r.colour, r.title, r.power, r.all)}
          ${this._groupIcon(r)}
          ${this._pipeTrunk ? b : this._flow(r.trunk, r.colour, r.power, !0, !1)}
          ${this._loadList(r.loads, r.y0, r.colour)}
          ${r.more ? this._moreRow(r) : b}
        `
    )}
      ${this._tap(t.entities.home_power, this._box(215, 70, 70, 26, e, V(n, this._loc), 13))}
      <text x="211" y="83" text-anchor="end" class="lbl">Haus</text>
      <text x="211" y="95" text-anchor="end" class="tiny val">${O(B(this._s(t.home_today)), this._loc)}</text>
    `;
  }
  /** Current grid values: power, direction, price and today's import / export. */
  _gridData() {
    const t = this._layout, e = this._own("grid_power"), n = (e ?? 0) < -z, s = n ? t.grid.export_price ? Xt(this._s(t.grid.export_price)) : t.grid.export_price_fixed ?? null : Xt(this._s(t.grid.price));
    return {
      grid: e,
      exporting: n,
      cents: s,
      label: e === null ? "" : e > z ? "Bezug" : n ? "Einspeisung" : "",
      power: V(e === null ? null : Math.abs(e), this._loc),
      imp: dt(this._s(t.grid.import_today)),
      exp: dt(this._s(t.grid.export_today))
    };
  }
  _grid() {
    const t = this._c.grid, { grid: e, exporting: n, cents: s, label: i, power: o, imp: a, exp: r } = this._gridData();
    return c`
      ${this._flow(`M ${this._invX} ${this._invY + 42} H 84`, t, e, n)}
      ${this._tap(this._layout.entities.grid_power, c`${this._panel(10, 192, 74, 40, t)}
        <text x="47" y=${s === null ? 217 : 209} text-anchor="middle" class="val" font-size=${this._fs(13)}>${o}</text>`)}
      ${s !== null ? c`<text x="47" y="225" text-anchor="middle" class="tiny" fill=${t}>${he(s, this._loc)}</text>` : b}
      <text x="90" y="207" class="tiny">${i}</text>
      ${this._icon(Pe, 27, 240, 40, t)}
      ${a !== null ? c`<text x="10" y="292" class="small" fill=${t}>↓ ${O(a, this._loc)}<tspan class="tiny"> Bezug</tspan></text>` : b}
      ${r !== null ? c`<text x="10" y="305" class="small">↑ ${O(r, this._loc)}<tspan class="tiny"> Einspeisung</tspan></text>` : b}
    `;
  }
  // -- render -----------------------------------------------------------------
  render() {
    if (this._error)
      return q`<ha-card><div class="msg">${this._error}</div></ha-card>`;
    if (!this._layout || !this.hass)
      return q`<ha-card><div class="msg">Lade Energiefluss …</div></ha-card>`;
    const t = this._config?.title;
    return q`
      <ha-card .header=${t ?? b}>
        <svg viewBox=${`0 0 ${Be} ${this._viewH}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Energiefluss"
          @click=${this._onTap}>
          ${this._defs()} ${this._solar()} ${this._batteries()} ${this._inverter()} ${this._home()} ${this._grid()}
        </svg>
      </ha-card>
    `;
  }
};
Yt.styles = Rt`
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
let Y = Yt;
ct([
  ce({ attribute: !1 })
], Y.prototype, "hass");
ct([
  J()
], Y.prototype, "_config");
ct([
  J()
], Y.prototype, "_layout");
ct([
  J()
], Y.prototype, "_error");
ct([
  J()
], Y.prototype, "_expanded");
customElements.get("energiefluss-card") || customElements.define("energiefluss-card", Y);
window.customCards = window.customCards ?? [];
window.customCards.some((k) => k.type === "energiefluss-card") || window.customCards.push({
  type: "energiefluss-card",
  name: "Energiefluss",
  description: "Animierter Energiefluss – konfiguriert über die Energiefluss-Integration.",
  preview: !0
});
const Ye = `<svg
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-battery-2"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6 7h11a2 2 0 0 1 2 2v.5a.5 .5 0 0 0 .5 .5a.5 .5 0 0 1 .5 .5v3a.5 .5 0 0 1 -.5 .5a.5 .5 0 0 0 -.5 .5v.5a2 2 0 0 1 -2 2h-11a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2" />
  <path d="M7 10l0 4" />
  <path d="M10 10l0 4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-bulb"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7" />
  <path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3" />
  <path d="M9.7 17l4.6 0" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-car"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-charging-pile"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M18 7l-1 1" />
  <path d="M14 11h1a2 2 0 0 1 2 2v3a1.5 1.5 0 0 0 3 0v-7l-3 -3" />
  <path d="M4 20v-14a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v14" />
  <path d="M9 11.5l-1.5 2.5h3l-1.5 2.5" />
  <path d="M3 20l12 0" />
  <path d="M4 8l10 0" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-coffee"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 14c.83 .642 2.077 1.017 3.5 1c1.423 .017 2.67 -.358 3.5 -1c.83 -.642 2.077 -1.017 3.5 -1c1.423 -.017 2.67 .358 3.5 1" />
  <path d="M8 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
  <path d="M12 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
  <path d="M3 10h14v5a6 6 0 0 1 -6 6h-2a6 6 0 0 1 -6 -6v-5" />
  <path d="M16.746 16.726a3 3 0 1 0 .252 -5.555" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-cooker"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 7h.01" />
  <path d="M15 7h.01" />
  <path d="M9 7h.01" />
  <path d="M5 5a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -14" />
  <path d="M9 15h6" />
  <path d="M5 11h14" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-device-desktop"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10" />
  <path d="M7 20h10" />
  <path d="M9 16v4" />
  <path d="M15 16v4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-droplet"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M7.502 19.423c2.602 2.105 6.395 2.105 8.996 0c2.602 -2.105 3.262 -5.708 1.566 -8.546l-4.89 -7.26c-.42 -.625 -1.287 -.803 -1.936 -.397a1.376 1.376 0 0 0 -.41 .397l-4.893 7.26c-1.695 2.838 -1.035 6.441 1.567 8.546" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-flame"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 10.941c2.333 -3.308 .167 -7.823 -1 -8.941c0 3.395 -2.235 5.299 -3.667 6.706c-1.43 1.408 -2.333 3.294 -2.333 5.588c0 3.704 3.134 6.706 7 6.706c3.866 0 7 -3.002 7 -6.706c0 -1.712 -1.232 -4.403 -2.333 -5.588c-2.084 3.353 -3.257 3.353 -4.667 2.235" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-fridge"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 5a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -14" />
  <path d="M5 10h14" />
  <path d="M9 13v3" />
  <path d="M9 6v1" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-home"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
  <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
  <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-lamp"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M9 20h6" />
  <path d="M12 20v-8" />
  <path d="M5 12h14l-4 -8h-6l-4 8" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-plug"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M9.785 6l8.215 8.215l-2.054 2.054a5.81 5.81 0 1 1 -8.215 -8.215l2.054 -2.054" />
  <path d="M4 20l3.5 -3.5" />
  <path d="M15 4l-3.5 3.5" />
  <path d="M20 9l-3.5 3.5" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-pool"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M2 20a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1" />
  <path d="M2 16a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1" />
  <path d="M15 12v-7.5a1.5 1.5 0 0 1 3 0" />
  <path d="M9 12v-7.5a1.5 1.5 0 0 0 -3 0" />
  <path d="M15 5l-6 0" />
  <path d="M9 10l6 0" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-router"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 15a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -4" />
  <path d="M17 17l0 .01" />
  <path d="M13 17l0 .01" />
  <path d="M15 13l0 -2" />
  <path d="M11.75 8.75a4 4 0 0 1 6.5 0" />
  <path d="M8.5 6.5a8 8 0 0 1 13 0" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-server"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-2" />
  <path d="M3 15a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -2" />
  <path d="M7 8l0 .01" />
  <path d="M7 16l0 .01" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-solar-panel"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M4.28 14h15.44a1 1 0 0 0 .97 -1.243l-1.5 -6a1 1 0 0 0 -.97 -.757h-12.44a1 1 0 0 0 -.97 .757l-1.5 6a1 1 0 0 0 .97 1.243" />
  <path d="M4 10h16" />
  <path d="M10 6l-1 8" />
  <path d="M14 6l1 8" />
  <path d="M12 14v4" />
  <path d="M7 18h10" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-building-broadcast-tower"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  <path d="M16.616 13.924a5 5 0 1 0 -9.23 0" />
  <path d="M20.307 15.469a9 9 0 1 0 -16.615 0" />
  <path d="M9 21l3 -9l3 9" />
  <path d="M10 19h4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-device-tv"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 9a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -9" />
  <path d="M16 3l-4 4l-4 -4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-vacuum-cleaner"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M21 12a9 9 0 1 1 -18 0a9 9 0 0 1 18 0" />
  <path d="M14 9a2 2 0 1 1 -4 0a2 2 0 0 1 4 0" />
  <path d="M12 16h.01" />
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
function A(k) {
  return [...k.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((t) => t[1]).filter((t) => t !== "M0 0h24v24H0z");
}
const pn = {
  airConditioning: A(Ye),
  battery: A(je),
  bulb: A(Ge),
  car: A(De),
  chargingPile: A(Xe),
  coffee: A(We),
  cooker: A(Ue),
  desktop: A(Ze),
  droplet: A(qe),
  flame: A(Ke),
  fridge: A(Qe),
  home: A(Je),
  lamp: A(tn),
  microwave: A(en),
  plug: A(nn),
  pool: A(sn),
  router: A(on),
  server: A(rn),
  solarPanel: A(an),
  tower: A(ln),
  tv: A(cn),
  vacuum: A(hn),
  washMachine: A(dn)
}, un = [
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
function fn(k) {
  const t = k.toLowerCase();
  return un.find(([e]) => e.test(t))?.[1] ?? "plug";
}
const F = {
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
}, K = {
  file: "inverter-glass.png",
  width: 300,
  height: 278,
  top: [115.7, 23.5],
  bottom: [100.2, 221.8],
  left: [[18.7, 61], [18.7, 99.1], [18.7, 138.1]]
}, st = {
  file: "solar-glass.png",
  width: 360,
  height: 222,
  face: [[16.8, 42.7], [329.6, 11.1], [348.9, 165], [34.1, 204]],
  across: [0.9949, -0.1005],
  down: [0.1063, 0.9943]
}, $n = {
  solar: "#ffd43b",
  // yellow, clearly apart from the other sources
  battery: "#3ee08f",
  grid: "#4db2ff",
  home: "#2fd4b4",
  flexible: "#6f9dff",
  backup: "#ff6a3d",
  inverter: "#a8d4ff"
}, I = "#cfeaff", _n = [
  [0, -2.2, 2.2, 0],
  [1.6, 2.4, -1.8, -1.2],
  [-1.2, -1, 2, 1.4],
  [0.8, 2.2, -2.4, 0.4]
], ut = 26, gn = 2.5, yn = 0.7, ft = 72, mn = 0.6, wn = 0.7, de = 5.2, xn = 2.7, bn = 1.6, Jt = { big: de, medium: xn, small: bn }, pe = 6, ue = 0, fe = 130, It = fe / st.width, kn = import.meta.url.replace(/[^/]*$/, "") + st.file, te = 0, $t = 3.5, Lt = 44, Ht = 18, $e = st.face.map(([k, t]) => [pe + k * It, ue + t * It]), it = (k, t) => {
  const [e, n, s, i] = $e, o = [e[0] + (n[0] - e[0]) * k, e[1] + (n[1] - e[1]) * k], a = [i[0] + (s[0] - i[0]) * k, i[1] + (s[1] - i[1]) * k];
  return [o[0] + (a[0] - o[0]) * t, o[1] + (a[1] - o[1]) * t];
}, ee = (() => {
  const [k, t, , e] = $e, n = Math.hypot(t[0] - k[0], t[1] - k[1]), s = Math.hypot(e[0] - k[0], e[1] - k[1]), i = (te + $t) / n, o = (te + $t) / s, a = $t / n, r = $t / s, h = [
    [i, 0.5 - a / 2],
    [0.5 + a / 2, 1 - i]
  ], p = [
    [o, 0.5 - r / 2],
    [0.5 + r / 2, 1 - o]
  ];
  return [0, 1, 2, 3].map((f) => {
    const [$, d] = h[f % 2], [u, _] = p[Math.floor(f / 2)];
    return {
      corners: [it($, u), it(d, u), it(d, _), it($, _)],
      middle: it(($ + d) / 2, (u + _) / 2),
      size: [(d - $) * n, (_ - u) * s]
    };
  });
})(), Vt = 82, rt = [104, Vt + 26], _t = [250, 96], Ot = 196, gt = Ot, ne = "0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1", At = (k, t = 0, e = 0) => k.map(([n, s, i, o]) => `M ${n + t} ${s + e} L ${i + t} ${o + e}`).join(" "), se = [
  [22, 40, 8, 86],
  [34, 40, 48, 86],
  [24, 10, 22, 40],
  [32, 10, 34, 40],
  [24, 10, 28, 2],
  [32, 10, 28, 2]
], oe = [
  [12, 12, 44, 12],
  [12, 12, 23.5, 17],
  [44, 12, 32.5, 17],
  [6, 24, 50, 24],
  [6, 24, 22.7, 30],
  [50, 24, 33.3, 30],
  [2, 36, 54, 36],
  [2, 36, 22, 40],
  [54, 36, 34, 40]
], vn = [
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
], Mn = [
  [8, 86, 15, 82],
  [48, 86, 55, 82],
  [22, 40, 29, 36],
  [34, 40, 41, 36],
  [28, 2, 35, -2]
], Et = [
  [12, 12],
  [44, 12],
  [6, 24],
  [50, 24],
  [2, 36],
  [54, 36]
], ie = 10, re = 122, Ct = 0.7, et = 8, yt = 54, Ln = 1.25, ae = 196, xt = 0.24, bt = [250, 116], Hn = import.meta.url.replace(/[^/]*$/, "") + K.file, Ft = ([k, t]) => [
  bt[0] + (k - K.top[0]) * xt,
  bt[1] + (t - K.top[1]) * xt
], mt = K.left.map(Ft), zt = 2, Bt = 120, An = import.meta.url.replace(/[^/]*$/, "") + F.file, En = [
  [0, 0, 0, 0],
  [4, -1.5, -4, 1.5],
  [-1.5, 3, 1.5, -3],
  [-4, 1.5, 4, -1.5]
], Cn = [
  [28, 2],
  [22, 40],
  [34, 40],
  [15.9, 60],
  [40.1, 60],
  [8, 86],
  [48, 86]
], jt = class jt extends Y {
  get _c() {
    return { ...$n, ...this._config?.colours ?? {} };
  }
  // inverter centred under the house; wallbox sits on the left below the pylon
  get _invX() {
    return mt[0][0];
  }
  get _solarX() {
    return 104;
  }
  get _invY() {
    return bt[1];
  }
  get _invTop() {
    return bt;
  }
  get _invBottom() {
    return Ft(K.bottom);
  }
  get _solarY() {
    return mt[0][1];
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
    const t = Ot + 50;
    return super._displayBatteries().map((e) => ({ ...e, top: t + (e.top - t) * mn }));
  }
  // denser lists: rows of 15 instead of 22
  // the string labels sit on the middles of the panel's quarters
  get _stringPos() {
    return ee.map(({ middle: [t, e] }) => [t - Lt / 2, e - Ht / 2]);
  }
  get _pvBoxY() {
    return Vt;
  }
  // wide enough to catch the trains of both tile columns (tile middles at 40 and 110)
  get _pvBox() {
    return [22, 96];
  }
  get _storeY() {
    return Ot;
  }
  get _rowH() {
    return 15;
  }
  _fs(t) {
    return +(t * wn).toFixed(2);
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
    return T - 1;
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
  // a group's glass panel reaches 19 above its first row and 3 below its last;
  // the gap keeps PANEL_GAP of air between two panels
  get _groupGap() {
    return 16 + Ln;
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
    const o = n !== null && Math.abs(n) >= z;
    return c`<g class="tube">
        <path d=${t} class="rim" />
        <path d=${t} class="bore" />
        <path d=${t} class="tint" stroke=${e} stroke-opacity=${o ? 0.24 : 0.08} />
        <path d=${t} class="shine" />
      </g>
      ${i ? this._dot(t, e, n, s) : b}`;
  }
  /** The train on path `d`: radius and start time of each ball, travel time and period. */
  _trainOf(t, e) {
    const n = pt(e).map((r) => Jt[r]), s = [];
    let i = 0;
    n.forEach((r, h) => {
      h && (i += n[h - 1] + r + gn), s.push(i / ut);
    });
    const o = St(t) / ut, a = o + (s[s.length - 1] ?? 0) + yn;
    return { radii: n, begins: s, travel: o, period: a };
  }
  /**
   * Lines without their own train logic (everything except the load lists)
   * get a train of balls instead of one ball whose speed or size shows the power.
   */
  _dot(t, e, n, s = !0, i = 3.2, o) {
    if (o) return super._dot(t, e, n, s, i, o);
    if (n === null || Math.abs(n) < z) return c``;
    const { radii: a, travel: r, period: h, begins: p } = this._trainOf(t, n);
    return c`${p.map(
      (f, $) => this._ball(e, { route: t, forward: s, r: a[$], begin: f, travel: r, period: h })
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
    const s = (d) => t === "battery" && !d ? this._c.battery : e, i = (d, u, _) => t === "battery" && _ ? this._mixedTrain(d, u) : this._dot(d, s(_), u, _), o = n.map((d) => i(d.route, d.w, d.forward));
    if (t === "pv") {
      const d = `M ${rt[0]} ${rt[1]} V ${this._solarY} H ${this._invX}`, u = this._own("solar_power"), _ = n.flatMap((y) => this._arrivals(y.route, y.w));
      return c`${o}${this._dot(d, e, u, !0)}${this._blob(rt, e, u, _)}`;
    }
    const a = n.reduce((d, u) => u.w === null ? d : (d ?? 0) + u.w, null), [r, h] = this._invBottom, p = `M ${r.toFixed(1)} ${h.toFixed(1)} V ${gt}`, f = (a ?? 0) > 0, $ = [
      ...f ? this._arrivals(p, a) : [],
      ...n.filter((d) => !d.forward).flatMap((d) => this._arrivals(d.route, d.w))
    ];
    return c`${o}${i(p, a, f)}${this._blob([r, gt], s(f), Math.abs(a ?? 0), $)}`;
  }
  /** When the balls of a train on `route` finish their way (at its end, or at its
   *  start for a train running backwards). */
  _arrivals(t, e) {
    if (e === null || Math.abs(e) < z) return [];
    const { radii: n, begins: s, travel: i, period: o } = this._trainOf(t, e);
    return s.map((a, r) => ({ at: a + i, period: o, big: n[r] === de }));
  }
  /**
   * A drop of mercury where trains meet: its size shows the power that flows
   * through, it wobbles all the time and swells for a moment whenever a ball
   * runs into it (additive animations, one per arriving ball).
   */
  _blob([t, e], n, s, i) {
    if (s === null || Math.abs(s) < z) return c``;
    const o = 2.2 + 1.6 * Math.sqrt(Math.min(Math.abs(s), 8e3) / 1e3), a = Object.entries(this._c).find(([, p]) => p === n)?.[0], r = (p, f) => {
      const $ = (p.big ? 1.4 : 0.6) * (f === "rx" ? 1.15 : 0.85), d = Math.min(0.2, 0.12 / p.period), u = Math.min(0.6, 0.55 / p.period);
      return c`<animate attributeName=${f} additive="sum" dur=${`${p.period.toFixed(2)}s`}
        begin=${`${p.at.toFixed(2)}s`} repeatCount="indefinite" values=${`0;${$};0;0`}
        keyTimes=${`0;${d.toFixed(4)};${u.toFixed(4)};1`} />`;
    }, h = (p, f, $) => {
      const d = p === "rx" ? [1, 1.1, 0.94, 1] : [1, 0.92, 1.07, 1];
      return c`<animate attributeName=${p} dur=${`${f}s`} begin=${`${$}s`} repeatCount="indefinite"
        calcMode="spline" keyTimes="0;0.33;0.66;1" keySplines=${"0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1"}
        values=${d.map((u) => (o * u).toFixed(2)).join(";")} />`;
    };
    return c`<g>
      <circle cx=${t} cy=${e} r=${o * 2.6} fill=${a ? `url(#ef-halo-${a})` : n} fill-opacity=${a ? b : 0.2} />
      <ellipse cx=${t} cy=${e} rx=${o} ry=${o} fill=${n}>
        ${h("rx", 1.7, 0)}${h("ry", 1.7, 0)}
        ${i.map((p) => c`${r(p, "rx")}${r(p, "ry")}`)}
      </ellipse>
      <ellipse cx=${t} cy=${e} rx=${o} ry=${o} fill="url(#ef-ball)">
        ${h("rx", 1.7, 0)}${h("ry", 1.7, 0)}
        ${i.map((p) => c`${r(p, "rx")}${r(p, "ry")}`)}
      </ellipse>
      <ellipse cx=${t - o * 0.32} cy=${e - o * 0.38} rx=${o * 0.4} ry=${o * 0.24} fill="#ffffff" fill-opacity="0.85" />
    </g>`;
  }
  // the house power runs into a blob in the house box; the load trains leave it
  _houseJunction(t) {
    return this._blob(_t, this._c.home, t, this._arrivals(this._houseIn(), t));
  }
  /** Glowing glass ball: soft halo, coloured body, white core and a sheen. */
  _orb(t, e, n, s = !1) {
    const i = t, o = Object.entries(this._c).find(([, a]) => a === e)?.[0];
    return c`<g opacity=${s ? "0" : b}>
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
      stroke-linecap="round" stroke-linejoin="round">${pn[t].map((o) => c`<path d=${o} />`)}</g>`;
  }
  // -- sections ------------------------------------------------------------------
  _solarIcon() {
    return c``;
  }
  /** The glass solar panel picture below the string labels. */
  _solarBack() {
    return c`<image href=${kn} x=${pe} y=${ue} width=${fe}
      height=${(st.height * It).toFixed(1)} />`;
  }
  /** One PV string: a glass label filling its quarter of the panel, lying in the
   *  panel's plane, with the same gap to the frame and to its neighbours. */
  _stringTile(t, e, n, s) {
    const i = t + Lt / 2, o = e + Ht / 2, a = ee.reduce(
      (u, _) => Math.hypot(_.middle[0] - i, _.middle[1] - o) < Math.hypot(u.middle[0] - i, u.middle[1] - o) ? _ : u
    ), r = a.corners.map(([u, _]) => `${u.toFixed(1)},${_.toFixed(1)}`).join(" "), [h, p] = st.across, [f, $] = st.down, [, d] = a.size;
    return c`
      <polygon points=${r} fill="#020a14" fill-opacity="0.35" transform="translate(0.8 1.6)" />
      <polygon points=${r} fill=${s} fill-opacity="0.12" />
      <polygon points=${r} fill="url(#ef-slab)" stroke=${s} stroke-opacity="0.6" stroke-width="0.8"
        stroke-linejoin="round" />
      <g transform=${`matrix(${h} ${p} ${f} ${$} ${i.toFixed(1)} ${o.toFixed(1)})`}>
        <text x="0" y=${-d / 2 + d * 0.52} text-anchor="middle" class="val" font-size=${this._fs(12)} font-weight="600"
          >${V(this._w(n), this._loc)}</text>
        <text x="0" y=${-d / 2 + d * 0.84} text-anchor="middle" class="tiny" style=${`font-size:${this._fs(7.5)}px`}
          >${at(this._name(n), 16)}</text>
      </g>`;
  }
  /** The glass inverter picture, placed by its connectors. */
  _inverter() {
    const [t, e] = Ft([0, 0]);
    return c`<image href=${Hn} x=${t.toFixed(1)} y=${e.toFixed(1)}
      width=${(K.width * xt).toFixed(1)} height=${(K.height * xt).toFixed(1)} />`;
  }
  /** Glass cylinder with a moving liquid level; name, SoC, kWh, power, status inside. */
  _batteryWidget(t, e, n, s, i, o, a, r, h = null) {
    const p = e - s / 2 + 2, f = e + s / 2 - 2, $ = (f - p) / 2, d = 3.5, u = n + 8, _ = n + ft, y = Math.max(0, Math.min(100, o ?? 0)), w = _ + d - (_ + d - u) * (y / 100), g = `ef-bat-${Math.round(e)}-${Math.round(n)}`, x = `M ${p} ${u} V ${_} A ${$} ${d} 0 0 0 ${f} ${_} V ${u} A ${$} ${d} 0 0 0 ${p} ${u} Z`, H = i !== null && Math.abs(i) >= z, E = this._lineFlow(t, i), L = E !== null && E > z, C = H ? 3.4 : 5.5, P = E !== null && E < -z, S = s < 54, R = h && o !== null ? O(h * o / 100, this._loc) : "";
    return c`<g>
      <ellipse cx=${e} cy=${_ + 4} rx=${$ + 8} ry="6" fill="url(#ef-shadow)" />
      <clipPath id=${g}><path d=${x} /></clipPath>
      <path d=${x} fill=${r} fill-opacity="0.07" />
      ${y > 0 ? c`<g clip-path=${`url(#${g})`}>
            ${this._liquid(p, f, w, _ + d + 2, r, C)}
          </g>` : b}
      ${L ? c`<g clip-path=${`url(#${g})`}>${this._splash(e, u, w, $, r, E, n)}</g>` : b}
      <path d=${x} fill="url(#ef-tube)" stroke=${I} stroke-opacity="0.55" stroke-width="0.9" />
      ${P ? this._riseIntoLine(e, _, n, this._c.battery, E) : b}
      <ellipse cx=${e} cy=${u} rx=${$} ry=${d} fill=${r} fill-opacity="0.12" stroke="#e6f6ff" stroke-opacity="0.7"
        stroke-width="0.8" />
      <rect x=${e - 6} y=${n + 3} width="12" height=${u - n - 3} fill=${r} fill-opacity="0.28" stroke=${I}
        stroke-opacity="0.6" stroke-width="0.7" />
      <ellipse cx=${e} cy=${n + 3} rx="6" ry="1.8" fill="#e6f6ff" fill-opacity="0.45" />
      <text x=${e} y=${n + 20} text-anchor="middle" class="bt" font-size=${this._fs(7.5)}>${at(t, S ? 9 : 11)}</text>
      <text x=${e} y=${n + 33} text-anchor="middle" class="bt" font-size=${this._fs(13)} font-weight="600">${lt(o, this._loc)}</text>
      <text x=${e} y=${n + 43} text-anchor="middle" class="bt" font-size=${this._fs(8)}>${R}</text>
      <text x=${e} y=${n + 53} text-anchor="middle" class="bt" font-size=${this._fs(8.5)}>${V(i === null ? null : Math.abs(i), this._loc)}</text>
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
    const a = e - t, r = ([f, $, d, u], _) => `M ${t - 1} ${(_ + f).toFixed(2)} C ${(t + a * 0.35).toFixed(2)} ${(_ + $).toFixed(2)} ${(e - a * 0.35).toFixed(2)} ${(_ + d).toFixed(2)} ${e + 1} ${(_ + u).toFixed(2)}`, h = (f, $, d) => r(_n[f], $) + (d ? ` V ${s} H ${t - 1} Z` : ""), p = (f, $, d, u) => c`<path d=${h(d[0], f, $)}>
        <animate attributeName="d" dur=${`${u.toFixed(1)}s`} repeatCount="indefinite" calcMode="spline"
          keyTimes="0;0.25;0.5;0.75;1" keySplines=${ne}
          values=${[...d, d[0]].map((_) => h(_, f, $)).join(";")} />
      </path>`;
    return c`
      <g fill=${i} fill-opacity="0.35">${p(n - 1, !0, [2, 3, 0, 1], o * 1.3)}</g>
      <g fill="url(#ef-liquid)">${p(n, !0, [0, 1, 2, 3], o)}</g>
      <g fill="none" stroke="#e9fff3" stroke-opacity="0.55" stroke-width="0.8">${p(n, !1, [0, 1, 2, 3], o)}</g>`;
  }
  // load list trains count the power in balls as well, big ones in front
  _wagonBalls(t, e, n) {
    const s = pt(t), i = e === this._c.backup ? this._tints(s, this._backupShares(n)) : this._tints(s);
    return s.map((o, a) => ({ r: Jt[o], colour: i[a] }));
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
    const t = (this._layout?.batteries ?? []).filter((e) => !e.backup_only).reduce((e, n) => e + Math.max(0, -(B(this._s(n.power)) ?? 0)), 0);
    return ve(this._own("solar_power"), t, this._own("grid_power"));
  }
  /** Colours for a train's balls by source shares (PV, battery, grid); default: the house's mix. */
  _tints(t, e = this._houseShares()) {
    const n = [this._c.solar, this._c.battery, this._c.grid];
    return Me(t, e).map((s) => n[s]);
  }
  /** A train whose balls show where the power comes from (PV, battery, grid). */
  _mixedTrain(t, e, n = !0) {
    if (e === null || Math.abs(e) < z) return c``;
    const { radii: s, begins: i, travel: o, period: a } = this._trainOf(t, e), r = this._tints(pt(e));
    return c`${i.map((h, p) => this._ball(r[p], { route: t, forward: n, r: s[p], begin: h, travel: o, period: a }))}`;
  }
  _houseDots(t, e, n) {
    return this._mixedTrain(t, n);
  }
  get _wagonSpeed() {
    return ut;
  }
  /** A battery's own line: from the blob in the storage box to the battery's cap. */
  _route(t, e) {
    return `M ${this._invBottom[0].toFixed(1)} ${gt} V ${gt + wt / 2} H ${t} V ${e}`;
  }
  _batteryRoute(t, e) {
    return this._route(t, e);
  }
  // Trains run into the glass boxes and new ones leave them: each PV string
  // into the middle of "PV gesamt", the house power from the inverter into
  // the middle of the house box, the load trains from there; backup trains
  // start at the bottom of their battery and leave through its shell.
  _stringRoute(t, e) {
    return `M ${t + Lt / 2} ${e + Ht / 2} V ${Vt + 13} H ${rt[0]} V ${rt[1]}`;
  }
  _houseIn() {
    const [t, e] = this._invTop;
    return `M ${t} ${e} V ${_t[1]}`;
  }
  _houseLead(t) {
    return `M ${_t[0]} ${_t[1]} H 281 V ${t} H 285`;
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
    const o = n + 3, { radii: a, begins: r, period: h } = this._trainOf(this._route(t, n), i);
    return c`${r.map((p, f) => {
      const $ = a[f], d = Math.min(h * 0.8, (e - o) / ut), u = (d / h).toFixed(4), _ = `${h.toFixed(2)}s`, y = `${(p - d).toFixed(2)}s`;
      return c`<circle cx=${t} cy=${e} r=${$} fill=${s} stroke="#ffffff" stroke-opacity="0.75" stroke-width="0.5"
        opacity="0">
        <animate attributeName="cy" dur=${_} begin=${y} repeatCount="indefinite" values=${`${e};${o};${o}`}
          keyTimes=${`0;${u};1`} />
        <animate attributeName="r" dur=${_} begin=${y} repeatCount="indefinite"
          values=${`${$ * 0.45};${$};${$}`} keyTimes=${`0;${u};1`} />
        <animate attributeName="opacity" dur=${_} begin=${y} repeatCount="indefinite" calcMode="discrete"
          values="0.9;0" keyTimes=${`0;${u}`} />
      </circle>`;
    })}`;
  }
  /**
   * A drop falls into the liquid each time a ball of the train arrives at the
   * battery, then a ripple spreads and two droplets jump. Uses the train's own
   * timing, so it stays in step with the arriving balls.
   */
  _splash(t, e, n, s, i, o, a) {
    const { travel: r, period: h, begins: p } = this._trainOf(this._route(t, a), o), f = this._tints(pt(o));
    return c`${p.map(($, d) => this._splashOnce(t, e, n, s, f[d] ?? i, h, $ + r))}`;
  }
  /** One drop with ripple, repeating every `period` s from `start` s on. */
  _splashOnce(t, e, n, s, i, o, a) {
    const h = Math.min(0.45, o * 0.35) / o, p = Math.min(0.97, h + 0.6 / o), f = h + (p - h) * 0.4, $ = h + 1e-3, d = (w) => w.toFixed(3), u = `${o.toFixed(2)}s`, _ = `${a.toFixed(2)}s`, y = (w, g, x, H = !1) => c`<animate attributeName=${w}
      dur=${u} begin=${_} repeatCount="indefinite" values=${g} keyTimes=${x}
      calcMode=${H ? "spline" : "linear"} keySplines=${H ? "0.55 0 1 0.6;0 0 1 1" : b} />`;
    return c`
      <ellipse cx=${t} cy=${e} rx="1.5" ry="2.1" fill=${i} stroke="#ffffff" stroke-opacity="0.7" stroke-width="0.4" opacity="0">
        ${y("cy", `${e + 1};${n - 1};${n - 1}`, `0;${d(h)};1`, !0)}
        ${y("opacity", "1;1;0;0", `0;${d(h)};${d($)};1`)}
      </ellipse>
      <ellipse cx=${t} cy=${n} rx="1" ry="0.5" fill="none" stroke="#e9fff3" stroke-width="0.8" opacity="0">
        ${y("rx", `1;1;${d(s * 0.75)};${d(s * 0.75)}`, `0;${d(h)};${d(p)};1`)}
        ${y("ry", "0.5;0.5;2;2", `0;${d(h)};${d(p)};1`)}
        ${y("opacity", "0;0;0.9;0;0", `0;${d(h)};${d($)};${d(p)};1`)}
      </ellipse>
      ${[-1, 1].map(
      (w) => c`<circle cx=${t + w * 3} cy=${n} r="0.9" fill=${i} stroke="#ffffff" stroke-opacity="0.6" stroke-width="0.3"
          opacity="0">
          ${y("cy", `${n};${n};${n - 6};${n};${n}`, `0;${d(h)};${d(f)};${d(p)};1`)}
          ${y("cx", `${t};${t};${t + w * 3};${t + w * 5};${t + w * 5}`, `0;${d(h)};${d(f)};${d(p)};1`)}
          ${y("opacity", "0;0;1;0;0", `0;${d(h)};${d($)};${d(p)};1`)}
        </circle>`
    )}`;
  }
  /** 2.5D glass house: gable front, side wall, roof, chimney and warm windows. */
  _houseIcon(t) {
    const e = this._c.solar;
    return c`<g transform="translate(232 26) scale(0.7)">
      <ellipse cx="28" cy="50" rx="30" ry="5" fill="url(#ef-shadow)" />
      <polygon points="4,28 14,18 42,6 32,16" fill=${t} fill-opacity="0.08" stroke=${I} stroke-opacity="0.3" stroke-width="0.7" />
      <polygon points="24,52 52,40 52,24 24,36" fill=${t} fill-opacity="0.12" stroke=${I} stroke-opacity="0.6" stroke-width="0.8" />
      <polygon points="24,52 52,40 52,24 24,36" fill="url(#ef-slab)" />
      <polygon points="4,44 24,52 24,36 14,18 4,28" fill=${t} fill-opacity="0.2" stroke=${I} stroke-opacity="0.75" stroke-width="0.9" />
      <polygon points="4,44 24,52 24,36 14,18 4,28" fill="url(#ef-slab)" />
      <polygon points="24,36 52,24 42,6 14,18" fill=${t} fill-opacity="0.28" stroke=${I} stroke-opacity="0.75" stroke-width="0.9" />
      <polygon points="24,36 52,24 42,6 14,18" fill="url(#ef-sheen)" />
      <polygon points="36.6,15 39.4,13.8 39.4,5.8 36.6,7" fill=${t} fill-opacity="0.35" stroke=${I} stroke-opacity="0.7" stroke-width="0.7" />
      <polygon points="28.2,43.2 35.2,40.2 35.2,32.2 28.2,35.2" fill=${e} fill-opacity="0.5" stroke=${e} stroke-opacity="0.8" stroke-width="0.6" />
      <polygon points="40.8,37.8 47.8,34.8 47.8,26.8 40.8,29.8" fill=${e} fill-opacity="0.5" stroke=${e} stroke-opacity="0.8" stroke-width="0.6" />
      <polygon points="12,47.2 17,49.2 17,37.2 12,35.2" fill=${t} fill-opacity="0.4" stroke=${I} stroke-opacity="0.7" stroke-width="0.6" />
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
    const t = this._c.grid, e = this._invX, { grid: n, exporting: s, cents: i, label: o, power: a, imp: r, exp: h } = this._gridData(), [p, f] = Et[Et.length - 1], $ = ie + p * Ct, d = re + (f + 6) * Ct, u = mt[1][1], _ = Math.max(d, u) + 12, y = `M ${$.toFixed(1)} ${d.toFixed(1)} Q ${(($ + e) / 2).toFixed(1)} ${_.toFixed(1)} ${e} ${u}`, w = i !== null ? he(i, this._loc) : "", g = [
      { arrow: "↓", kwh: r, name: "Bez.", active: o === "Bezug" },
      { arrow: "↑", kwh: h, name: "Einsp.", active: o === "Einspeisung" }
    ].filter((L) => L.kwh !== null), x = ae, H = x + (i !== null ? 23 : 15), E = H - x + (g.length ? g.length * 8.5 + 3 : 0);
    return c`
      ${this._pylon(t)}
      ${this._flow(y, t, n, !s)}
      ${this._tap(this._layout.entities.grid_power, this._panel(et, x, yt, E, t))}
      <text x=${et + yt / 2} y=${x + 11} text-anchor="middle" class="val" font-size=${this._fs(11.5)} font-weight="600"
        >${a}</text>
      ${i !== null ? c`<text x=${et + yt / 2} y=${x + 19.5} text-anchor="middle" class="dim" style=${`font-size:${this._fs(8.5)}px`}>${w}</text>` : b}
      ${g.length ? c`<line x1=${et + 4} x2=${et + yt - 4} y1=${H} y2=${H} class="sep" stroke=${t} />` : b}
      ${g.map(
      (L, C) => c`<text x=${et + 4} y=${H + 8 + C * 8.5} class=${L.active ? "val" : "dim"} style=${`font-size:${this._fs(8.5)}px`}
          ><tspan fill=${L.active ? t : b}>${L.arrow}</tspan> ${O(L.kwh, this._loc)}<tspan
          class=${L.active ? "" : "tiny"} style=${`font-size:${this._fs(7.5)}px`} fill=${L.active ? t : b}> ${L.name}</tspan></text>`
    )}
      ${this._wallbox(this._carTop(x + E + 8))}
    `;
  }
  /** Top of the car picture: its plate ends flush with the lowest battery, but
   *  never higher than `min` (just below the grid tile). */
  _carTop(t) {
    const e = this._displayBatteries();
    if (!e.length) return t;
    const n = Math.max(...e.map((s) => s.top)) + ft + 3.5;
    return Math.max(t, n - F.height * (Bt / F.width));
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
    const n = e.flexible ? this._c.flexible : this._c.home, s = this._w(e.power), i = B(this._s(e.soc ?? void 0)), o = B(this._s(e.today ?? void 0)), a = s === null || Math.abs(s) < z, r = !a && (s ?? 0) > 0, h = Bt / F.width, p = ([j, G]) => [zt + j * h, t + G * h], f = i === null ? null : Math.max(0, Math.min(100, i)) / 100, $ = (f ?? 0) * F.liquidHeight, [d, u, _, y] = F.floorQuad, w = ([j, G], ht) => `${j.toFixed(1)},${(G - ht).toFixed(1)}`, g = (j) => {
      const [G, ht, Mt, Gt] = j.map((ge) => Math.max(0, $ + ge));
      return {
        body: [w(d, 0), w(u, 0), w(_, 0), w(_, Mt), w(y, Gt), w(d, G)].join(" "),
        surface: [w(d, G), w(u, ht), w(_, Mt), w(y, Gt)].join(" "),
        edge: [w(d, G), w(u, ht), w(_, Mt)].join(" ")
      };
    }, x = En.map((j) => g(j)), H = r ? 3.4 : 5.5, E = (j) => c`<animate attributeName="points" dur=${`${H}s`}
      repeatCount="indefinite" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" keySplines=${ne}
      values=${[...x, x[0]].map((G) => G[j]).join(";")} />`, L = `ef-car-${Math.round(t)}`, C = `translate(${zt} ${t}) scale(${h.toFixed(5)})`, P = this._invX, S = mt[2][1], [R, l] = p(F.wallboxTop), m = ae - 12, v = `M ${P} ${S} H ${P - 10} V ${m} H ${R.toFixed(1)} V ${l.toFixed(1)}`, [M, N] = p(F.powerText), [D, ot] = p(F.energyText), X = F.edgeAngle, [vt, _e] = p([(u[0] + _[0]) / 2, (u[1] + _[1]) / 2 - Math.max($ / 2, 14)]);
    return c`
      ${this._flow(v, n, s, !0, !1)}
      ${this._mixedTrain(v, s)}
      <g class="tap" data-entity=${e.power}>
        <title>${e.name} · ${e.flexible ? "Zusatzverbraucher" : "Grundlast"}</title>
        <image href=${An} x=${zt} y=${t} width=${Bt} height=${(F.height * h).toFixed(1)} />
        ${f ? c`<g transform=${C}>
              <clipPath id=${L}><polygon points=${F.tank} /></clipPath>
              <g clip-path=${`url(#${L})`} opacity="0.7">
                <polygon points=${x[0].body} fill="url(#ef-liquid)">${E("body")}</polygon>
                <polygon points=${x[0].surface} fill="#c8ffe0" fill-opacity="0.45">${E("surface")}</polygon>
                <polyline points=${x[0].edge} fill="none" stroke="#e9fff3" stroke-opacity="0.85" stroke-width="2.4"
                  stroke-linejoin="round">${E("edge")}</polyline>
              </g>
            </g>` : b}
        ${i !== null ? c`<text x=${vt.toFixed(1)} y=${_e.toFixed(1)} text-anchor="middle" class="bt" font-size=${this._fs(9)}
              font-weight="600">${lt(i, this._loc)}</text>` : b}
        <text transform=${`translate(${M.toFixed(1)} ${N.toFixed(1)}) rotate(${X})`} class=${a ? "dim" : "val"}
          style=${`font-size:${this._fs(8)}px`} font-weight="600">${V(s, this._loc)}</text>
        <text transform=${`translate(${D.toFixed(1)} ${ot.toFixed(1)}) rotate(${-X})`} class="dim"
          style=${`font-size:${this._fs(8)}px`}>${O(o, this._loc)}</text>
      </g>`;
  }
  /** Free-standing pylon of glass rods on a hexagonal glass plate. */
  _pylon(t) {
    const e = At([...se, ...oe, ...vn]), n = At([...se, ...oe], 7, -4), s = At(Mn), i = "65.5,84 48.5,92.7 14.5,92.7 -2.5,84 14.5,75.3 48.5,75.3";
    return c`<g transform=${`translate(${ie} ${re}) scale(${Ct})`}>
      <ellipse cx="31.5" cy="97" rx="40" ry="7" fill="url(#ef-shadow)" />
      <polygon points=${"65.5,84 65.5,87 48.5,95.7 14.5,95.7 -2.5,87 -2.5,84 14.5,92.7 48.5,92.7"} fill=${t} fill-opacity="0.3" stroke=${I} stroke-opacity="0.4" stroke-width="0.6" />
      <polygon points=${i} fill=${t} fill-opacity="0.14" stroke=${I} stroke-opacity="0.65" stroke-width="0.8" />
      <polygon points=${i} fill="url(#ef-slab)" />
      <path d=${n} fill="none" stroke=${t} stroke-opacity="0.22" stroke-width="2.6" stroke-linecap="round" />
      <path d=${n} fill="none" stroke=${I} stroke-opacity="0.4" stroke-width="0.7" stroke-linecap="round" />
      <path d=${s} fill="none" stroke=${I} stroke-opacity="0.35" stroke-width="1.4" stroke-linecap="round" />
      <path d=${e} fill="none" stroke=${t} stroke-opacity="0.35" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" />
      <path d=${e} fill="none" stroke="#e6f6ff" stroke-opacity="0.9" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
      ${Et.map(
      ([a, r]) => c`
          <path d=${`M ${a} ${r} V ${r + 6}`} stroke=${I} stroke-opacity="0.8" stroke-width="0.8" />
          <circle cx=${a} cy=${r + 2.5} r="1.4" fill=${t} /><circle cx=${a} cy=${r + 5} r="1.4" fill=${t} />
          <circle cx=${a} cy=${r + 3.7} r="0.6" fill="#ffffff" />`
    )}
      ${Cn.map(([a, r]) => c`<circle cx=${a} cy=${r} r="1.3" fill="#ffffff" fill-opacity="0.85" />`)}
    </g>`;
  }
  // -- load groups -------------------------------------------------------------
  /** Each group sits on its own tinted glass slab. */
  _groupPanel(t) {
    const e = T - 12, n = t.titleY - 13, s = t.y0 + t.rows * this._rowH + 3;
    return this._panel(e, n, Z + 3 - e, s - n, t.colour);
  }
  _groupIcon() {
    return c``;
  }
  _groupTitle(t, e, n, s, i) {
    const o = i.reduce((a, r) => {
      const h = B(this._s(r.today));
      return h === null ? a : (a ?? 0) + h;
    }, null);
    return c`
      <text x=${T - 6} y=${t} class="small grp" fill=${e}>${n}</text>
      <text x=${nt - 1} y=${t} text-anchor="end" class="small" style=${`font-size:${this._fs(8)}px`} fill=${e}>${V(s, this._loc)}</text>
      <text x=${Z - 1} y=${t} text-anchor="end" class="small" style=${`font-size:${this._fs(8)}px`} fill=${e}>${O(o, this._loc)}</text>`;
  }
  /** Line icon chosen from the name, then the name (wrapped if long). */
  _nameBox(t, e, n, s = t, i = 0) {
    const o = this._rowH, a = 9, r = T + i, h = r + a + 3, p = nt - U - 2 - h, { lines: f, small: $ } = Tt(t, Math.floor(p / 5.2), Math.floor(p / 4.2));
    return c`<g>
      <title>${s}</title>
      ${this._line(fn(t), r, e + (o - a) / 2, a, n)}
      ${$ ? c`<text x=${h} y=${e + o / 2 - 1.5} class="name" font-size=${this._fs(7.5)}>${f[0]}</text>
              <text x=${h} y=${e + o / 2 + 5.5} class="name" font-size=${this._fs(7.5)}>${f[1] ?? ""}</text>` : c`<text x=${h} y=${e + o / 2 + 3} class="name" font-size=${this._fs(9.5)}>${f[0]}</text>`}
    </g>`;
  }
  /** Plain right-aligned numbers: the group slab is the glass. */
  _valueCell(t, e, n, s, i, o, a, r) {
    return c`<text x=${t + n - 1} y=${e + s / 2 + a * 0.36} text-anchor="end" class=${r === "power" ? "val" : "dim"}
      font-size=${this._fs(a + 0.5)}>${o}</text>`;
  }
};
jt.styles = [
  Y.styles,
  Rt`
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
let Pt = jt;
customElements.get("energiefluss-glass-card") || customElements.define("energiefluss-glass-card", Pt);
window.customCards = window.customCards ?? [];
window.customCards.some((k) => k.type === "energiefluss-glass-card") || window.customCards.push({
  type: "energiefluss-glass-card",
  name: "Energiefluss Glas",
  description: "Energiefluss im 2.5D-Glas-Look mit Glasrohren und leuchtenden Zügen – gleiche Daten wie die Energiefluss-Karte.",
  preview: !0
});
