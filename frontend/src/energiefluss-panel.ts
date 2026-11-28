// Sidebar page "Wattrio" (top of the sidebar after setup): shows the energy flow
// card in the chosen look; "Einstellungen" opens the shared editor
// (<energiefluss-editor>) next to a live preview.
//
// The page imports the cards itself: Home Assistant loads a panel's module when
// it is opened, so the card works right after the setup without reloading the
// browser (the extra_js_url of the integration only arrives with a reload).

import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { guideOpen, UPDATED_EVENT, type Hass, type Instance } from "./editor-core";
import "./editor-core";
import { EDIT_EVENT, type EditTarget } from "./edit-target";
import "./cards";

interface CardElement extends HTMLElement {
  hass?: Hass;
  editMode?: boolean;
  setConfig(config: Record<string, unknown>): void;
}

type Look = "glass" | "classic";
type View = "card" | "settings";

interface EntryOptions {
  title: string;
  options: Record<string, unknown>;
}

const TAGS: Record<Look, string> = { glass: "energiefluss-glass-card", classic: "energiefluss-card" };

/** Something assigned that the card can show. */
function configured(o: Record<string, unknown>): boolean {
  const filled = (k: string) => {
    const v = o[k];
    return Array.isArray(v) ? v.length > 0 : !!v;
  };
  return ["solar_strings", "solar_total", "grid_power", "grid_import_power", "grid_export_power", "batteries", "home_power"].some(filled);
}

export class EnergieflussPanel extends LitElement {
  @property({ attribute: false }) hass?: Hass;
  @property({ type: Boolean }) narrow = false;

  @state() private _instances: Instance[] = [];
  @state() private _entryId?: string;
  @state() private _loaded = false;
  @state() private _look: Look = "glass";
  @state() private _view: View = "card";
  private _options: Record<string, unknown> = {};
  private _card?: CardElement;
  private _host?: Element;
  private _cardKey?: string;

  // the look is switched in the settings (Allgemein): follow it
  private _onUpdated = (ev: Event): void => {
    const id = (ev as CustomEvent<{ entry_id?: string }>).detail?.entry_id;
    if (id && id === this._entryId) void this._select(id, false);
  };

  // settings mode: a click on a field of the card opens it in the settings
  private _onEdit = (ev: Event): void => {
    const editor = this.renderRoot.querySelector("energiefluss-editor") as (Element & {
      focusTarget?: (t: EditTarget) => Promise<void>;
    }) | null;
    void editor?.focusTarget?.((ev as CustomEvent<EditTarget>).detail);
  };

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener(UPDATED_EVENT, this._onUpdated);
    this.addEventListener(EDIT_EVENT, this._onEdit);
  }

  disconnectedCallback(): void {
    window.removeEventListener(UPDATED_EVENT, this._onUpdated);
    this.removeEventListener(EDIT_EVENT, this._onEdit);
    super.disconnectedCallback();
  }

  protected async firstUpdated(): Promise<void> {
    if (!this.hass) return;
    this._instances = await this.hass.callWS<Instance[]>({ type: "energiefluss/instances" });
    const wanted = new URLSearchParams(location.search).get("entry");
    const id = (this._instances.find((i) => i.entry_id === wanted) ?? this._instances[0])?.entry_id;
    if (id) await this._select(id, true);
    this._loaded = true;
  }

  private async _select(entryId: string, chooseView: boolean): Promise<void> {
    const res = await this.hass!.callWS<EntryOptions>({ type: "energiefluss/get_options", entry_id: entryId });
    this._options = res.options ?? {};
    this._look = this._options.look === "classic" ? "classic" : "glass";
    if (chooseView) this._view = !configured(this._options) || guideOpen(this._options) ? "settings" : "card";
    this._entryId = entryId;
  }

  private async _toggleView(): Promise<void> {
    if (this._view === "settings" && this._entryId) {
      // the editor may have saved: take its options (and the look) back
      await this._select(this._entryId, false);
      this._view = "card";
    } else {
      this._view = "settings";
    }
  }

  protected updated(changed: PropertyValues): void {
    const host = this.renderRoot.querySelector("#card");
    const key = `${this._entryId}|${this._look}`;
    if (host && this._entryId && (host !== this._host || key !== this._cardKey)) {
      this._host = host;
      this._cardKey = key;
      void this._mountCard(host, this._entryId, this._look);
    } else if (changed.has("hass") && this._card) {
      this._card.hass = this.hass;
    }
    if (this._card) this._card.editMode = this._view === "settings";
  }

  private async _mountCard(host: Element, entryId: string, look: Look): Promise<void> {
    const tag = TAGS[look];
    await customElements.whenDefined(tag);
    const card = document.createElement(tag) as CardElement;
    card.setConfig({ type: `custom:${tag}`, entry_id: entryId });
    card.hass = this.hass;
    card.editMode = this._view === "settings";
    host.replaceChildren(card);
    this._card = card;
  }

  protected render() {
    const settings = this._view === "settings";
    const toolbar = html`<div class="toolbar ${this.narrow ? "narrow" : ""}">
      <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
      <div class="title">Wattrio</div>
      ${this._instances.length > 1
        ? html`<select @change=${(e: Event) => void this._select((e.target as HTMLSelectElement).value, true)}>
            ${this._instances.map(
              (i) => html`<option value=${i.entry_id} ?selected=${i.entry_id === this._entryId}>${i.title}</option>`,
            )}
          </select>`
        : nothing}
      ${this._entryId
        ? html`<button class="settings" @click=${() => void this._toggleView()}>
              ${settings ? "Fertig" : "Einstellungen"}
            </button>`
        : nothing}
    </div>`;

    if (!this._loaded) return html`${toolbar}<div class="empty">Lade …</div>`;
    if (!this._entryId) {
      return html`${toolbar}<div class="empty">
        Noch keine Anlage angelegt. Unter Einstellungen → Geräte &amp; Dienste → Integration hinzufügen →
        „Wattrio“ eine Anlage anlegen.
      </div>`;
    }
    if (!settings) {
      return html`${toolbar}
        <div class="view"><div id="card"></div></div>`;
    }
    return html`
      ${toolbar}
      <div class="content ${this.narrow ? "narrow" : ""}">
        <div class="preview-col">
          <div id="card"></div>
          <p class="tip">Tipp: Klick auf ein Feld der Grafik öffnet rechts seine Einstellung.</p>
        </div>
        <energiefluss-editor .hass=${this.hass} .entryId=${this._entryId}></energiefluss-editor>
      </div>
    `;
  }

  static styles = css`
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
}

if (!customElements.get("energiefluss-panel")) {
  customElements.define("energiefluss-panel", EnergieflussPanel);
}
