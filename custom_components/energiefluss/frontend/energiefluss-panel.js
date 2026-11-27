import { i as u, U as h, g as f, A as g, b as n, a as v, n as _, r as d } from "./energiefluss-shared-B7xiaUvn.js";
var y = Object.defineProperty, a = (l, s, t, e) => {
  for (var i = void 0, o = l.length - 1, p; o >= 0; o--)
    (p = l[o]) && (i = p(s, t, i) || i);
  return i && y(s, t, i), i;
};
const w = { glass: "energiefluss-glass-card", classic: "energiefluss-card" };
function x(l) {
  const s = (t) => {
    const e = l[t];
    return Array.isArray(e) ? e.length > 0 : !!e;
  };
  return ["solar_strings", "grid_power", "grid_import_power", "grid_export_power", "batteries", "home_power"].some(s);
}
const c = class c extends u {
  constructor() {
    super(...arguments), this.narrow = !1, this._instances = [], this._loaded = !1, this._look = "glass", this._view = "card", this._options = {}, this._onUpdated = (s) => {
      const t = s.detail?.entry_id;
      t && t === this._entryId && this._select(t, !1);
    };
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(h, this._onUpdated);
  }
  disconnectedCallback() {
    window.removeEventListener(h, this._onUpdated), super.disconnectedCallback();
  }
  async firstUpdated() {
    if (!this.hass) return;
    this._instances = await this.hass.callWS({ type: "energiefluss/instances" });
    const s = new URLSearchParams(location.search).get("entry"), t = (this._instances.find((e) => e.entry_id === s) ?? this._instances[0])?.entry_id;
    t && await this._select(t, !0), this._loaded = !0;
  }
  async _select(s, t) {
    const e = await this.hass.callWS({ type: "energiefluss/get_options", entry_id: s });
    this._options = e.options ?? {}, this._look = this._options.look === "classic" ? "classic" : "glass", t && (this._view = !x(this._options) || f(this._options) ? "settings" : "card"), this._entryId = s;
  }
  async _toggleView() {
    this._view === "settings" && this._entryId ? (await this._select(this._entryId, !1), this._view = "card") : this._view = "settings";
  }
  updated(s) {
    const t = this.renderRoot.querySelector("#card"), e = `${this._entryId}|${this._look}`;
    t && this._entryId && (t !== this._host || e !== this._cardKey) ? (this._host = t, this._cardKey = e, this._mountCard(t, this._entryId, this._look)) : s.has("hass") && this._card && (this._card.hass = this.hass);
  }
  async _mountCard(s, t, e) {
    const i = w[e];
    await customElements.whenDefined(i);
    const o = document.createElement(i);
    o.setConfig({ type: `custom:${i}`, entry_id: t }), o.hass = this.hass, s.replaceChildren(o), this._card = o;
  }
  render() {
    const s = this._view === "settings", t = n`<div class="toolbar ${this.narrow ? "narrow" : ""}">
      <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
      <div class="title">Wattrio</div>
      ${this._instances.length > 1 ? n`<select @change=${(e) => void this._select(e.target.value, !0)}>
            ${this._instances.map(
      (e) => n`<option value=${e.entry_id} ?selected=${e.entry_id === this._entryId}>${e.title}</option>`
    )}
          </select>` : g}
      ${this._entryId ? n`<button class="settings" @click=${() => void this._toggleView()}>
              ${s ? "Fertig" : "Einstellungen"}
            </button>` : g}
    </div>`;
    return this._loaded ? this._entryId ? s ? n`
      ${t}
      <div class="content ${this.narrow ? "narrow" : ""}">
        <div class="preview-col"><div id="card"></div></div>
        <energiefluss-editor .hass=${this.hass} .entryId=${this._entryId}></energiefluss-editor>
      </div>
    ` : n`${t}
        <div class="view"><div id="card"></div></div>` : n`${t}<div class="empty">
        Noch keine Anlage angelegt. Unter Einstellungen → Geräte &amp; Dienste → Integration hinzufügen →
        „Wattrio“ eine Anlage anlegen.
      </div>` : n`${t}<div class="empty">Lade …</div>`;
  }
};
c.styles = v`
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
  _({ attribute: !1 })
], r.prototype, "hass");
a([
  _({ type: Boolean })
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
