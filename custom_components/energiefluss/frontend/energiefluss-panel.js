import { i as f, U as p, E as g, g as v, A as _, b as n, a as y, n as u, r as d } from "./energiefluss-shared-SQGlDrTk.js";
var w = Object.defineProperty, a = (l, e, t, i) => {
  for (var s = void 0, o = l.length - 1, h; o >= 0; o--)
    (h = l[o]) && (s = h(e, t, s) || s);
  return s && w(e, t, s), s;
};
const x = { glass: "energiefluss-glass-card", classic: "energiefluss-card" };
function m(l) {
  const e = (t) => {
    const i = l[t];
    return Array.isArray(i) ? i.length > 0 : !!i;
  };
  return ["solar_strings", "solar_total", "grid_power", "grid_import_power", "grid_export_power", "batteries", "home_power"].some(e);
}
const c = class c extends f {
  constructor() {
    super(...arguments), this.narrow = !1, this._instances = [], this._loaded = !1, this._look = "glass", this._view = "card", this._options = {}, this._onUpdated = (e) => {
      const t = e.detail?.entry_id;
      t && t === this._entryId && this._select(t, !1);
    }, this._onEdit = (e) => {
      this.renderRoot.querySelector("energiefluss-editor")?.focusTarget?.(e.detail);
    };
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(p, this._onUpdated), this.addEventListener(g, this._onEdit);
  }
  disconnectedCallback() {
    window.removeEventListener(p, this._onUpdated), this.removeEventListener(g, this._onEdit), super.disconnectedCallback();
  }
  async firstUpdated() {
    if (!this.hass) return;
    this._instances = await this.hass.callWS({ type: "energiefluss/instances" });
    const e = new URLSearchParams(location.search).get("entry"), t = (this._instances.find((i) => i.entry_id === e) ?? this._instances[0])?.entry_id;
    t && await this._select(t, !0), this._loaded = !0;
  }
  async _select(e, t) {
    const i = await this.hass.callWS({ type: "energiefluss/get_options", entry_id: e });
    this._options = i.options ?? {}, this._look = this._options.look === "classic" ? "classic" : "glass", t && (this._view = !m(this._options) || v(this._options) ? "settings" : "card"), this._entryId = e;
  }
  async _toggleView() {
    this._view === "settings" && this._entryId ? (await this._select(this._entryId, !1), this._view = "card") : this._view = "settings";
  }
  updated(e) {
    const t = this.renderRoot.querySelector("#card"), i = `${this._entryId}|${this._look}`;
    t && this._entryId && (t !== this._host || i !== this._cardKey) ? (this._host = t, this._cardKey = i, this._mountCard(t, this._entryId, this._look)) : e.has("hass") && this._card && (this._card.hass = this.hass), this._card && (this._card.editMode = this._view === "settings");
  }
  async _mountCard(e, t, i) {
    const s = x[i];
    await customElements.whenDefined(s);
    const o = document.createElement(s);
    o.setConfig({ type: `custom:${s}`, entry_id: t }), o.hass = this.hass, o.editMode = this._view === "settings", e.replaceChildren(o), this._card = o;
  }
  render() {
    const e = this._view === "settings", t = n`<div class="toolbar ${this.narrow ? "narrow" : ""}">
      <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
      <div class="title">Wattrio</div>
      ${this._instances.length > 1 ? n`<select @change=${(i) => void this._select(i.target.value, !0)}>
            ${this._instances.map(
      (i) => n`<option value=${i.entry_id} ?selected=${i.entry_id === this._entryId}>${i.title}</option>`
    )}
          </select>` : _}
      ${this._entryId ? n`<button class="settings" @click=${() => void this._toggleView()}>
              ${e ? "Fertig" : "Einstellungen"}
            </button>` : _}
    </div>`;
    return this._loaded ? this._entryId ? e ? n`
      ${t}
      <div class="content ${this.narrow ? "narrow" : ""}">
        <div class="preview-col">
          <div id="card"></div>
          <p class="tip">Tipp: Klick auf ein Feld der Grafik öffnet rechts seine Einstellung.</p>
        </div>
        <energiefluss-editor .hass=${this.hass} .entryId=${this._entryId}></energiefluss-editor>
      </div>
    ` : n`${t}
        <div class="view"><div id="card"></div></div>` : n`${t}<div class="empty">
        Noch keine Anlage angelegt. Unter Einstellungen → Geräte &amp; Dienste → Integration hinzufügen →
        „Wattrio“ eine Anlage anlegen.
      </div>` : n`${t}<div class="empty">Lade …</div>`;
  }
};
c.styles = y`
    :host {
      display: block;
      min-height: 100vh;
      overflow-x: clip; /* not hidden: that would break position: sticky */
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
      padding: 0 4px;
      gap: 4px;
    }
    select {
      font: inherit;
      padding: 4px 8px;
      border-radius: 6px;
      max-width: 160px;
    }
    button {
      font: inherit;
      font-size: 14px;
      color: inherit;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.55);
      border-radius: 16px;
      padding: 5px 12px;
      cursor: pointer;
      white-space: nowrap;
    }
    button:disabled {
      opacity: 0.6;
      cursor: default;
    }
    .looks {
      display: flex;
    }
    .looks button {
      border-radius: 0;
    }
    .looks button:first-child {
      border-radius: 16px 0 0 16px;
    }
    .looks button:last-child {
      border-radius: 0 16px 16px 0;
      border-left: none;
    }
    .looks button.on {
      background: rgba(255, 255, 255, 0.22);
      font-weight: 600;
    }
    .settings {
      background: rgba(255, 255, 255, 0.14);
    }
    .view {
      padding: 16px;
      max-width: 1500px;
      margin: 0 auto;
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
    .tip {
      margin: 6px 4px 0;
      font-size: 0.85em;
      color: var(--secondary-text-color);
    }
    .preview-col {
      position: sticky;
      top: calc(var(--header-height, 56px) + 16px);
      align-self: start;
    }
    .content.narrow .preview-col {
      position: static;
    }
    energiefluss-editor {
      --ef-actions-bg: var(--primary-background-color);
    }
    .empty {
      padding: 32px;
      text-align: center;
      color: var(--secondary-text-color);
    }
  `;
let r = c;
a([
  u({ attribute: !1 })
], r.prototype, "hass");
a([
  u({ type: Boolean })
], r.prototype, "narrow");
a([
  d()
], r.prototype, "_instances");
a([
  d()
], r.prototype, "_entryId");
a([
  d()
], r.prototype, "_loaded");
a([
  d()
], r.prototype, "_look");
a([
  d()
], r.prototype, "_view");
customElements.get("energiefluss-panel") || customElements.define("energiefluss-panel", r);
export {
  r as EnergieflussPanel
};
