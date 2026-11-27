import { i as _, A as p, b as o, a as u, n as g, r as d } from "./energiefluss-shared-Bw4KU7X_.js";
var y = Object.defineProperty, n = (l, s, e, t) => {
  for (var r = void 0, a = l.length - 1, h; a >= 0; a--)
    (h = l[a]) && (r = h(s, e, r) || r);
  return r && y(s, e, r), r;
};
const f = { glass: "energiefluss-glass-card", classic: "energiefluss-card" };
function v(l) {
  const s = (e) => {
    const t = l[e];
    return Array.isArray(t) ? t.length > 0 : !!t;
  };
  return ["solar_strings", "grid_power", "grid_import_power", "grid_export_power", "batteries", "home_power"].some(s);
}
const c = class c extends _ {
  constructor() {
    super(...arguments), this.narrow = !1, this._instances = [], this._loaded = !1, this._look = "glass", this._view = "card", this._saving = !1, this._options = {};
  }
  async firstUpdated() {
    if (!this.hass) return;
    this._instances = await this.hass.callWS({ type: "energiefluss/instances" });
    const s = new URLSearchParams(location.search).get("entry"), e = (this._instances.find((t) => t.entry_id === s) ?? this._instances[0])?.entry_id;
    e && await this._select(e, !0), this._loaded = !0;
  }
  async _select(s, e) {
    const t = await this.hass.callWS({ type: "energiefluss/get_options", entry_id: s });
    this._options = t.options ?? {}, this._look = this._options.look === "classic" ? "classic" : "glass", e && (this._view = v(this._options) ? "card" : "settings"), this._entryId = s;
  }
  async _setLook(s) {
    if (!(!this.hass || !this._entryId || s === this._look || this._saving)) {
      this._look = s, this._saving = !0;
      try {
        await this.hass.callWS({ type: "energiefluss/set_look", entry_id: this._entryId, look: s }), this._options = { ...this._options, look: s };
      } finally {
        this._saving = !1;
      }
    }
  }
  async _toggleView() {
    this._view === "settings" && this._entryId ? (await this._select(this._entryId, !1), this._view = "card") : this._view = "settings";
  }
  updated(s) {
    const e = this.renderRoot.querySelector("#card"), t = `${this._entryId}|${this._look}`;
    e && this._entryId && (e !== this._host || t !== this._cardKey) ? (this._host = e, this._cardKey = t, this._mountCard(e, this._entryId, this._look)) : s.has("hass") && this._card && (this._card.hass = this.hass);
  }
  async _mountCard(s, e, t) {
    const r = f[t];
    await customElements.whenDefined(r);
    const a = document.createElement(r);
    a.setConfig({ type: `custom:${r}`, entry_id: e }), a.hass = this.hass, s.replaceChildren(a), this._card = a;
  }
  render() {
    const s = this._view === "settings", e = o`<div class="toolbar ${this.narrow ? "narrow" : ""}">
      <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
      <div class="title">Wattrio</div>
      ${this._instances.length > 1 ? o`<select @change=${(t) => void this._select(t.target.value, !0)}>
            ${this._instances.map(
      (t) => o`<option value=${t.entry_id} ?selected=${t.entry_id === this._entryId}>${t.title}</option>`
    )}
          </select>` : p}
      ${this._entryId ? o`<div class="looks" role="group" aria-label="Look">
              ${["glass", "classic"].map(
      (t) => o`<button
                  class=${this._look === t ? "on" : ""}
                  ?disabled=${this._saving}
                  @click=${() => void this._setLook(t)}
                >
                  ${t === "glass" ? "Glas" : "Klassik"}
                </button>`
    )}
            </div>
            <button class="settings" @click=${() => void this._toggleView()}>
              ${s ? "Fertig" : "Einstellungen"}
            </button>` : p}
    </div>`;
    return this._loaded ? this._entryId ? s ? o`
      ${e}
      <div class="content ${this.narrow ? "narrow" : ""}">
        <div class="preview-col"><div id="card"></div></div>
        <energiefluss-editor .hass=${this.hass} .entryId=${this._entryId}></energiefluss-editor>
      </div>
    ` : o`${e}
        <div class="view"><div id="card"></div></div>` : o`${e}<div class="empty">
        Noch keine Anlage angelegt. Unter Einstellungen → Geräte &amp; Dienste → Integration hinzufügen →
        „Wattrio“ eine Anlage anlegen.
      </div>` : o`${e}<div class="empty">Lade …</div>`;
  }
};
c.styles = u`
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
let i = c;
n([
  g({ attribute: !1 })
], i.prototype, "hass");
n([
  g({ type: Boolean })
], i.prototype, "narrow");
n([
  d()
], i.prototype, "_instances");
n([
  d()
], i.prototype, "_entryId");
n([
  d()
], i.prototype, "_loaded");
n([
  d()
], i.prototype, "_look");
n([
  d()
], i.prototype, "_view");
n([
  d()
], i.prototype, "_saving");
customElements.get("energiefluss-panel") || customElements.define("energiefluss-panel", i);
export {
  i as EnergieflussPanel
};
