import { i as g, A as u, b as s, a as f, n as p, r as d } from "./energiefluss-shared-4XYPgQBE.js";
var y = Object.defineProperty, n = (c, t, e, a) => {
  for (var i = void 0, o = c.length - 1, h; o >= 0; o--)
    (h = c[o]) && (i = h(t, e, i) || i);
  return i && y(t, e, i), i;
};
const l = class l extends g {
  constructor() {
    super(...arguments), this.narrow = !1, this._instances = [], this._loaded = !1;
  }
  async firstUpdated() {
    if (!this.hass) return;
    this._instances = await this.hass.callWS({ type: "energiefluss/instances" });
    const t = new URLSearchParams(location.search).get("entry");
    this._entryId = (this._instances.find((e) => e.entry_id === t) ?? this._instances[0])?.entry_id, this._loaded = !0;
  }
  updated(t) {
    const e = this.renderRoot.querySelector("#preview");
    e && this._entryId && this._cardFor !== this._entryId ? (this._cardFor = this._entryId, this._mountCard(e, this._entryId)) : t.has("hass") && this._card && (this._card.hass = this.hass);
  }
  async _mountCard(t, e) {
    await customElements.whenDefined("energiefluss-card");
    const a = document.createElement("energiefluss-card");
    a.setConfig({ type: "custom:energiefluss-card", entry_id: e }), a.hass = this.hass, t.replaceChildren(a), this._card = a;
  }
  render() {
    const t = s`<div class="toolbar ${this.narrow ? "narrow" : ""}">
      <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
      <div class="title">Wattrio</div>
      ${this._instances.length > 1 ? s`<select @change=${(e) => this._entryId = e.target.value}>
            ${this._instances.map(
      (e) => s`<option value=${e.entry_id} ?selected=${e.entry_id === this._entryId}>${e.title}</option>`
    )}
          </select>` : u}
    </div>`;
    return this._loaded ? this._entryId ? s`
      ${t}
      <div class="content ${this.narrow ? "narrow" : ""}">
        <div class="preview-col"><div id="preview"></div></div>
        <energiefluss-editor .hass=${this.hass} .entryId=${this._entryId}></energiefluss-editor>
      </div>
    ` : s`${t}<div class="empty">
        Noch keine Anlage angelegt. Unter Einstellungen → Geräte &amp; Dienste → Integration hinzufügen →
        „Wattrio“ eine Anlage anlegen.
      </div>` : s`${t}<div class="empty">Lade …</div>`;
  }
};
l.styles = f`
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
    }
    select {
      font: inherit;
      padding: 4px 8px;
      border-radius: 6px;
      max-width: 160px;
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
let r = l;
n([
  p({ attribute: !1 })
], r.prototype, "hass");
n([
  p({ type: Boolean })
], r.prototype, "narrow");
n([
  d()
], r.prototype, "_instances");
n([
  d()
], r.prototype, "_entryId");
n([
  d()
], r.prototype, "_loaded");
customElements.get("energiefluss-panel") || customElements.define("energiefluss-panel", r);
export {
  r as EnergieflussPanel
};
