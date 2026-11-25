import { i as $, A as o, p as y, b as u, w as g, h as i, n as S, o as k, q as z, g as E, e as L, j as A, m as b, r as p } from "./energiefluss-shared-smNKBC8z.js";
var B = Object.defineProperty, h = (_, e, t, s) => {
  for (var r = void 0, a = _.length - 1, n; a >= 0; a--)
    (n = _[a]) && (r = n(e, t, r) || r);
  return r && B(e, t, r), r;
};
const C = 3, c = { entity: { domain: "sensor" } }, f = { entity: { domain: "sensor", multiple: !0, reorder: !0 } }, I = [
  { name: "title", selector: { text: {} } },
  {
    name: "energy_period",
    selector: {
      select: {
        mode: "list",
        options: [
          { value: "midnight", label: "Ab 0 Uhr (heute)" },
          { value: "rolling24", label: "Letzte 24 Stunden" }
        ]
      }
    }
  }
], N = [
  { name: "solar_strings", selector: f },
  { name: "solar_today", selector: c },
  { name: "solar_forecast_remaining", selector: c }
], M = [
  { name: "name", selector: { text: {} } },
  { name: "power", selector: c },
  { name: "invert", selector: { boolean: {} } },
  { name: "soc", selector: c },
  { name: "capacity_kwh", selector: { number: { min: 0, max: 200, step: 0.1, mode: "box", unit_of_measurement: "kWh" } } }
], x = [
  { name: "grid_power", selector: c },
  { name: "grid_invert", selector: { boolean: {} } },
  { name: "grid_price", selector: c },
  {
    name: "grid_export_price_fixed",
    selector: { number: { min: 0, max: 100, step: 0.01, mode: "box", unit_of_measurement: "ct/kWh" } }
  },
  { name: "grid_export_price", selector: c },
  { name: "grid_import_today", selector: c },
  { name: "grid_export_today", selector: c }
], P = [
  { name: "fixed_loads", selector: f },
  { name: "flexible_loads", selector: f },
  { name: "home_power", selector: c }
], W = {
  title: "Name der Anlage",
  energy_period: "Tageswerte",
  solar_strings: "PV-Leistung (Strings / Wechselrichter)",
  solar_today: "PV-Ertrag heute",
  solar_forecast_remaining: "Prognose Rest heute",
  name: "Name",
  power: "Leistung",
  invert: "Sensor zählt Laden negativ",
  soc: "Ladestand (SoC)",
  capacity_kwh: "Kapazität",
  grid_power: "Netzleistung",
  grid_invert: "Sensor zählt Bezug negativ",
  grid_price: "Strompreis Bezug (z. B. Tibber)",
  grid_export_price_fixed: "Einspeisevergütung (fest)",
  grid_export_price: "Einspeisevergütung (Sensor)",
  grid_import_today: "Bezug heute",
  grid_export_today: "Einspeisung heute",
  fixed_loads: "Nicht steuerbare Verbraucher",
  flexible_loads: "Steuerbare Verbraucher",
  home_power: "Hausverbrauch gemessen (optional)"
}, H = {
  energy_period: "Ab 0 Uhr setzt um Mitternacht auf null, 24 Stunden ist ein gleitendes Fenster.",
  solar_strings: "Mehrere Sensoren werden addiert. W oder kW.",
  grid_export_price: "Optional statt des festen Werts, falls sich die Vergütung ändert.",
  fixed_loads: "Laufen, wann sie müssen – z. B. Kühlschrank, TV, Server.",
  flexible_loads: "Zeitpunkt frei wählbar – z. B. Waschmaschine, Trockner, Wallbox.",
  home_power: "Leer lassen: wird aus PV, Batterien und Netz berechnet."
};
async function O() {
  if (customElements.get("ha-form") && customElements.get("ha-entity-picker")) return;
  const _ = await window.loadCardHelpers();
  for (const e of ["tile", "entities"])
    await (await _.createCardElement({ type: e, entity: "sun.sun", entities: [] })).constructor.getConfigElement?.();
}
const w = (_) => JSON.parse(JSON.stringify(_ ?? {})), v = class v extends $ {
  constructor() {
    super(...arguments), this.narrow = !1, this._ready = !1, this._instances = [], this._title = "", this._draft = {}, this._saved = "", this._saving = !1, this._cardFor = "";
  }
  // -- loading ------------------------------------------------------------------
  async firstUpdated() {
    await O(), this._ready = !0, await this._loadInstances();
  }
  async _loadInstances() {
    if (!this.hass) return;
    this._instances = await this.hass.callWS({ type: "energiefluss/instances" });
    const e = new URLSearchParams(location.search).get("entry"), t = this._instances.find((s) => s.entry_id === e) ?? this._instances[0];
    t && await this._loadEntry(t.entry_id);
  }
  async _loadEntry(e) {
    const t = await this.hass.callWS({
      type: "energiefluss/get_options",
      entry_id: e
    });
    this._entryId = e, this._title = t.title, this._draft = w(t.options), this._saved = this._snapshot(), this._message = void 0, this._cardFor = "";
  }
  _snapshot() {
    return JSON.stringify({ t: this._title, o: this._draft });
  }
  get _dirty() {
    return this._snapshot() !== this._saved;
  }
  // -- preview --------------------------------------------------------------------
  updated(e) {
    const t = this.renderRoot.querySelector("#preview");
    if (!t || !this._entryId) return;
    const s = `${this._entryId}:${this._saved}`;
    this._cardFor !== s ? (this._cardFor = s, this._mountCard(t)) : e.has("hass") && this._card && (this._card.hass = this.hass);
  }
  async _mountCard(e) {
    await customElements.whenDefined("energiefluss-card");
    const t = document.createElement("energiefluss-card");
    t.setConfig({ type: "custom:energiefluss-card", entry_id: this._entryId }), t.hass = this.hass, e.replaceChildren(t), this._card = t;
  }
  // -- editing ----------------------------------------------------------------------
  _setOptions(e) {
    this._draft = { ...this._draft, ...e };
  }
  _onForm(e, t) {
    const s = e.detail.value, r = { ...this._draft };
    for (const a of t) {
      if (a === "title") continue;
      const n = s[a];
      n === void 0 || n === "" || Array.isArray(n) && n.length === 0 ? delete r[a] : r[a] = n;
    }
    "title" in s && (this._title = String(s.title ?? "")), this._draft = r;
  }
  _onBattery(e, t) {
    const s = [...this._draft.batteries ?? []];
    for (; s.length <= e; ) s.push({});
    s[e] = t.detail.value, this._setOptions({ batteries: s });
  }
  async _save() {
    if (!(!this.hass || !this._entryId)) {
      this._saving = !0, this._message = void 0;
      try {
        const e = (this._draft.batteries ?? []).filter((s) => s && (s.power || s.soc)), t = await this.hass.callWS({
          type: "energiefluss/save_options",
          entry_id: this._entryId,
          title: this._title,
          options: { ...this._draft, batteries: e }
        });
        this._title = t.title, this._draft = w(t.options), await new Promise((s) => setTimeout(s, 1200)), this._saved = this._snapshot(), this._message = { kind: "ok", text: "Gespeichert." };
      } catch (e) {
        this._message = { kind: "error", text: e.message ?? String(e) };
      } finally {
        this._saving = !1;
      }
    }
  }
  _discard() {
    this._entryId && this._loadEntry(this._entryId);
  }
  // -- live hints ------------------------------------------------------------------------
  _s(e) {
    return e ? this.hass?.states[e] : void 0;
  }
  get _loc() {
    return this.hass?.locale?.language ?? "de";
  }
  _powerLine(e, t, s) {
    if (!t) return o;
    const r = this._s(t), a = y(r);
    return i`<div class="row">
      <span>${e}</span>
      <span>${u(g(r), this._loc)}${s ? i` → <b>${s}</b>` : o}</span>
    </div>
    ${a ? i`<div class="warn">⚠ ${a}</div>` : o}`;
  }
  _solarLive() {
    const e = this._draft.solar_strings ?? [];
    if (!e.length) return o;
    const t = e.reduce((s, r) => s + (g(this._s(r)) ?? 0), 0);
    return i`<div class="live">
      ${e.map((s) => this._powerLine(this._name(s), s))}
      <div class="row total"><span>Summe</span><span>${u(t, this._loc)}</span></div>
    </div>`;
  }
  _batteryLive(e) {
    if (!e.power && !e.soc) return o;
    const t = S(this._s(e.soc));
    return i`<div class="live">
      ${this._powerLine("Leistung", e.power, k(g(this._s(e.power)), !!e.invert))}
      ${e.soc ? i`<div class="row"><span>Ladestand</span><span>${t === null ? "–" : `${Math.round(t)} %`}</span></div>` : o}
    </div>`;
  }
  _gridLive() {
    const e = this._draft;
    if (!e.grid_power && !e.grid_price) return o;
    const t = g(this._s(e.grid_power));
    return i`<div class="live">
      ${this._powerLine("Netz", e.grid_power, z(t, !!e.grid_invert))}
      ${e.grid_price ? i`<div class="row"><span>Preis Bezug</span><span>${E(L(this._s(e.grid_price)), this._loc) || "–"}</span></div>` : o}
    </div>`;
  }
  _loadsLive() {
    const e = [
      ["Nicht steuerbar", this._draft.fixed_loads ?? []],
      ["Steuerbar", this._draft.flexible_loads ?? []]
    ];
    if (!e.some(([, s]) => s.length)) return o;
    const t = e[0][1].filter((s) => e[1][1].includes(s));
    return i`<div class="live">
      ${e.map(([s, r]) => {
      const a = r.reduce((l, m) => l + (g(this._s(m)) ?? 0), 0), n = r.map((l) => [l, y(this._s(l))]).filter(([, l]) => l);
      return i`<div class="row"><span>${s}: ${r.length} Geräte</span><span>${u(a, this._loc)}</span></div>
          ${n.map(([l, m]) => i`<div class="warn">⚠ ${this._name(l)}: ${m}</div>`)}`;
    })}
      ${t.length ? i`<div class="warn">⚠ In beiden Gruppen: ${t.map((s) => this._name(s)).join(", ")}</div>` : o}
    </div>`;
  }
  _name(e) {
    return this._s(e)?.attributes.friendly_name ?? e;
  }
  // -- render --------------------------------------------------------------------------
  _form(e, t, s) {
    return i`<ha-form
      .hass=${this.hass}
      .data=${t}
      .schema=${e}
      .computeLabel=${(r) => W[r.name] ?? r.name}
      .computeHelper=${(r) => H[r.name]}
      @value-changed=${s}
    ></ha-form>`;
  }
  _section(e, t, s) {
    return i`<ha-card>
      <div class="section">
        <h2>${e}</h2>
        ${s ? i`<p class="hint">${s}</p>` : o}
        ${t}
      </div>
    </ha-card>`;
  }
  render() {
    const e = i`<div class="toolbar ${this.narrow ? "narrow" : ""}">
      <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
      <div class="title">Energiefluss</div>
      ${this._instances.length > 1 ? i`<select @change=${(r) => this._loadEntry(r.target.value)}>
            ${this._instances.map(
      (r) => i`<option value=${r.entry_id} ?selected=${r.entry_id === this._entryId}>${r.title}</option>`
    )}
          </select>` : o}
      <button class="secondary" ?disabled=${!this._dirty || this._saving} @click=${this._discard}>Verwerfen</button>
      <button class="primary" ?disabled=${!this._dirty || this._saving} @click=${this._save}>
        ${this._saving ? "Speichert …" : "Speichern"}
      </button>
    </div>`;
    if (!this._ready) return i`${e}<div class="empty">Lade Editor …</div>`;
    if (!this._entryId)
      return i`${e}<div class="empty">
        Noch keine Anlage angelegt. Unter Einstellungen → Geräte &amp; Dienste → Integration hinzufügen →
        „Energiefluss“ eine Anlage anlegen.
      </div>`;
    const t = this._draft, s = t.batteries ?? [];
    return i`
      ${e}
      ${this._message ? i`<div class="msg ${this._message.kind}">${this._message.text}</div>` : o}
      <div class="content ${this.narrow ? "narrow" : ""}">
        <div class="preview-col">
          <div id="preview"></div>
          ${this._dirty ? i`<p class="hint center">Die Vorschau zeigt den gespeicherten Stand.</p>` : o}
        </div>
        <div class="editor-col">
          ${this._section(
      "Anlage",
      this._form(
        I,
        { title: this._title, energy_period: t.energy_period ?? "midnight" },
        (r) => this._onForm(r, ["title", "energy_period"])
      )
    )}
          ${this._section(
      "Solar",
      i`${this._form(
        N,
        t,
        (r) => this._onForm(r, ["solar_strings", "solar_today", "solar_forecast_remaining"])
      )}${this._solarLive()}`
    )}
          ${this._section(
      "Batterien",
      i`${Array.from({ length: C }, (r, a) => {
        const n = s[a] ?? {};
        return i`<div class="sub">
                <h3>Batterie ${a + 1}${n.name ? ` – ${n.name}` : ""}</h3>
                ${this._form(M, n, (l) => this._onBattery(a, l))}
                ${this._batteryLive(n)}
              </div>`;
      })}`,
      "Leer lassen, wenn nicht vorhanden. Positiv soll „lädt“ bedeuten – sonst den Schalter setzen."
    )}
          ${this._section(
      "Netz",
      i`${this._form(
        x,
        t,
        (r) => this._onForm(r, x.map((a) => a.name))
      )}${this._gridLive()}`,
      "Positiv soll „Bezug“ bedeuten – sonst den Schalter setzen."
    )}
          ${this._section(
      "Verbraucher",
      i`${this._form(
        P,
        t,
        (r) => this._onForm(r, ["fixed_loads", "flexible_loads", "home_power"])
      )}${this._loadsLive()}`,
      "Alle Verbraucher zählen zum Haus. Je Gerät wird der Tagesverbrauch mitgezählt."
    )}
        </div>
      </div>
    `;
  }
};
v.styles = A`
    :host {
      display: block;
      min-height: 100vh;
      overflow-x: hidden;
      background: var(--primary-background-color);
      color: var(--primary-text-color);
    }
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 3;
      display: flex;
      align-items: center;
      gap: 8px;
      height: var(--header-height, 56px);
      padding: 0 12px;
      box-sizing: border-box;
      background: var(--app-header-background-color, var(--primary-color));
      color: var(--app-header-text-color, #fff);
    }
    .toolbar .title {
      flex: 1;
      min-width: 0;
      font-size: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .toolbar.narrow {
      gap: 4px;
      padding: 0 4px;
    }
    .toolbar.narrow .title {
      font-size: 17px;
    }
    .toolbar.narrow button {
      padding: 4px 8px;
      font-size: 12px;
    }
    .toolbar.narrow select {
      max-width: 90px;
    }
    select {
      font: inherit;
      padding: 4px 8px;
      border-radius: 6px;
    }
    button {
      flex: none;
      font: inherit;
      font-weight: 500;
      padding: 6px 14px;
      border-radius: 18px;
      border: 1px solid currentColor;
      cursor: pointer;
      background: transparent;
      color: inherit;
    }
    button.primary {
      background: var(--app-header-text-color, #fff);
      color: var(--app-header-background-color, var(--primary-color));
      border-color: transparent;
    }
    button:disabled {
      opacity: 0.45;
      cursor: default;
    }
    .content {
      display: grid;
      grid-template-columns: minmax(0, 3fr) minmax(340px, 2fr);
      gap: 16px;
      padding: 16px;
      max-width: 1500px;
      margin: 0 auto;
    }
    .content.narrow {
      grid-template-columns: minmax(0, 1fr);
      padding: 8px;
    }
    .preview-col {
      position: sticky;
      top: calc(var(--header-height, 56px) + 16px);
      align-self: start;
    }
    .content.narrow .preview-col {
      position: static;
    }
    ha-card {
      display: block;
      margin-bottom: 16px;
    }
    .section {
      padding: 16px;
    }
    h2 {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 500;
    }
    h3 {
      margin: 8px 0 4px;
      font-size: 15px;
      font-weight: 500;
    }
    .sub + .sub {
      margin-top: 12px;
      padding-top: 8px;
      border-top: 1px solid var(--divider-color);
    }
    .hint {
      margin: 0 0 8px;
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .center {
      text-align: center;
    }
    .live {
      margin-top: 8px;
      padding: 8px 12px;
      border-radius: 8px;
      background: var(--secondary-background-color);
      font-size: 13px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 2px 0;
    }
    .row.total {
      border-top: 1px solid var(--divider-color);
      margin-top: 2px;
      font-weight: 500;
    }
    .warn {
      color: var(--warning-color, #e69a00);
      padding: 2px 0;
    }
    .msg {
      margin: 12px 16px 0;
      padding: 8px 12px;
      border-radius: 8px;
    }
    .msg.ok {
      background: rgba(76, 175, 80, 0.15);
    }
    .msg.error {
      background: rgba(244, 67, 54, 0.15);
    }
    .empty {
      padding: 32px;
      text-align: center;
      color: var(--secondary-text-color);
    }
  `;
let d = v;
h([
  b({ attribute: !1 })
], d.prototype, "hass");
h([
  b({ type: Boolean })
], d.prototype, "narrow");
h([
  p()
], d.prototype, "_ready");
h([
  p()
], d.prototype, "_instances");
h([
  p()
], d.prototype, "_entryId");
h([
  p()
], d.prototype, "_title");
h([
  p()
], d.prototype, "_draft");
h([
  p()
], d.prototype, "_saved");
h([
  p()
], d.prototype, "_saving");
h([
  p()
], d.prototype, "_message");
customElements.get("energiefluss-panel") || customElements.define("energiefluss-panel", d);
export {
  d as EnergieflussPanel
};
