// Sidebar page "Energiefluss": live preview of the card next to the shared
// editor (<energiefluss-editor>) for one instance.

import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { type Hass, type Instance } from "./editor-core";
import "./editor-core";

interface CardElement extends HTMLElement {
  hass?: Hass;
  setConfig(config: Record<string, unknown>): void;
}

export class EnergieflussPanel extends LitElement {
  @property({ attribute: false }) hass?: Hass;
  @property({ type: Boolean }) narrow = false;

  @state() private _instances: Instance[] = [];
  @state() private _entryId?: string;
  @state() private _loaded = false;
  private _card?: CardElement;
  private _cardFor?: string;

  protected async firstUpdated(): Promise<void> {
    if (!this.hass) return;
    this._instances = await this.hass.callWS<Instance[]>({ type: "energiefluss/instances" });
    const wanted = new URLSearchParams(location.search).get("entry");
    this._entryId = (this._instances.find((i) => i.entry_id === wanted) ?? this._instances[0])?.entry_id;
    this._loaded = true;
  }

  protected updated(changed: PropertyValues): void {
    const host = this.renderRoot.querySelector("#preview");
    if (host && this._entryId && this._cardFor !== this._entryId) {
      this._cardFor = this._entryId;
      void this._mountCard(host, this._entryId);
    } else if (changed.has("hass") && this._card) {
      this._card.hass = this.hass;
    }
  }

  private async _mountCard(host: Element, entryId: string): Promise<void> {
    await customElements.whenDefined("energiefluss-card");
    const card = document.createElement("energiefluss-card") as CardElement;
    card.setConfig({ type: "custom:energiefluss-card", entry_id: entryId });
    card.hass = this.hass;
    host.replaceChildren(card);
    this._card = card;
  }

  protected render() {
    const toolbar = html`<div class="toolbar ${this.narrow ? "narrow" : ""}">
      <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
      <div class="title">Energiefluss</div>
      ${this._instances.length > 1
        ? html`<select @change=${(e: Event) => (this._entryId = (e.target as HTMLSelectElement).value)}>
            ${this._instances.map(
              (i) => html`<option value=${i.entry_id} ?selected=${i.entry_id === this._entryId}>${i.title}</option>`,
            )}
          </select>`
        : nothing}
    </div>`;

    if (!this._loaded) return html`${toolbar}<div class="empty">Lade …</div>`;
    if (!this._entryId) {
      return html`${toolbar}<div class="empty">
        Noch keine Anlage angelegt. Unter Einstellungen → Geräte &amp; Dienste → Integration hinzufügen →
        „Energiefluss“ eine Anlage anlegen.
      </div>`;
    }
    return html`
      ${toolbar}
      <div class="content ${this.narrow ? "narrow" : ""}">
        <div class="preview-col"><div id="preview"></div></div>
        <energiefluss-editor .hass=${this.hass} .entryId=${this._entryId}></energiefluss-editor>
      </div>
    `;
  }

  static styles = css`
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
}

if (!customElements.get("energiefluss-panel")) {
  customElements.define("energiefluss-panel", EnergieflussPanel);
}
