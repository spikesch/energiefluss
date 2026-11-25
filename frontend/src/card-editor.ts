// Visual editor shown in the dashboard's "edit card" dialog.
// Top: options of this card (instance, title, animation scale) -> card config.
// Below: the shared instance editor; its "Anlage speichern" writes straight to
// the integration and applies to every card of that instance.

import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { ensureHaElements, type Hass, type Instance } from "./editor-core";
import "./editor-core";

interface CardConfig {
  type: string;
  entry_id?: string;
  title?: string;
  max_power?: number;
  flow_style?: "speed" | "size";
  [key: string]: unknown;
}

const LABELS: Record<string, string> = {
  entry_id: "Anlage",
  title: "Titel der Karte (optional)",
  flow_style: "Animation",
  max_power: "Leistung für größte bzw. schnellste Punkte",
};

const HELPERS: Record<string, string> = {
  max_power: "Ab dieser Leistung sind die Punkte am größten bzw. schnellsten. Standard 5000 W.",
};

export class EnergieflussCardEditor extends LitElement {
  @property({ attribute: false }) hass?: Hass;
  @state() private _config?: CardConfig;
  @state() private _instances: Instance[] = [];
  @state() private _ready = false;

  setConfig(config: CardConfig): void {
    this._config = config;
  }

  protected async firstUpdated(): Promise<void> {
    await ensureHaElements();
    if (this.hass) {
      this._instances = await this.hass.callWS<Instance[]>({ type: "energiefluss/instances" });
    }
    this._ready = true;
  }

  private get _entryId(): string | undefined {
    return this._config?.entry_id ?? this._instances[0]?.entry_id;
  }

  private _schema() {
    const schema: { name: string; selector: Record<string, unknown> }[] = [];
    if (this._instances.length > 1) {
      schema.push({
        name: "entry_id",
        selector: {
          select: { mode: "dropdown", options: this._instances.map((i) => ({ value: i.entry_id, label: i.title })) },
        },
      });
    }
    schema.push(
      { name: "title", selector: { text: {} } },
      {
        name: "flow_style",
        selector: {
          select: {
            mode: "list",
            options: [
              { value: "speed", label: "Tempo der Punkte zeigt die Leistung" },
              { value: "size", label: "Größe der Punkte zeigt die Leistung" },
            ],
          },
        },
      },
      { name: "max_power", selector: { number: { min: 500, max: 30000, step: 100, mode: "box", unit_of_measurement: "W" } } },
    );
    return schema;
  }

  private _cardChanged(ev: CustomEvent<{ value: Partial<CardConfig> }>): void {
    ev.stopPropagation();
    const next: CardConfig = { ...this._config!, ...ev.detail.value };
    for (const key of ["entry_id", "title", "max_power", "flow_style"] as const) {
      if (next[key] === undefined || next[key] === "" || next[key] === null) delete next[key];
    }
    this._config = next;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: next }, bubbles: true, composed: true }));
  }

  protected render() {
    if (!this._ready || !this._config) return html`<div class="hint">Lade …</div>`;
    if (!this._instances.length) {
      return html`<div class="hint">
        Noch keine Anlage angelegt: Einstellungen → Geräte &amp; Dienste → Integration hinzufügen → „Energiefluss“.
      </div>`;
    }
    return html`
      <h2>Karte</h2>
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schema()}
        .computeLabel=${(s: { name: string }) => LABELS[s.name] ?? s.name}
        .computeHelper=${(s: { name: string }) => HELPERS[s.name]}
        @value-changed=${this._cardChanged}
      ></ha-form>
      <h2 class="spaced">Anlage</h2>
      <p class="hint">
        Gilt für alle Karten dieser Anlage. Änderungen hier mit <b>„Anlage speichern“</b> übernehmen – das
        Speichern unten im Dialog speichert nur die Karten-Einstellungen oben.
      </p>
      ${this._entryId
        ? html`<energiefluss-editor compact .hass=${this.hass} .entryId=${this._entryId}></energiefluss-editor>`
        : nothing}
    `;
  }

  static styles = css`
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
}

if (!customElements.get("energiefluss-card-editor")) {
  customElements.define("energiefluss-card-editor", EnergieflussCardEditor);
}
