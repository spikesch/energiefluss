// Visual editor for the Energiefluss integration (sidebar panel).
// Live preview of the real card on one side, sections to assign sensors on the
// other. Every chosen sensor shows its current value and how it is understood,
// so wrong signs are visible before saving.

import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import {
  batteryMeaning,
  centsPerKwh,
  fmtCents,
  fmtPower,
  gridMeaning,
  num,
  powerUnitWarning,
  watts,
  type StateLike,
} from "./format";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Hass {
  states: Record<string, StateLike>;
  locale?: { language: string };
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
}

interface Battery {
  name?: string;
  power?: string;
  soc?: string;
  capacity_kwh?: number;
  invert?: boolean;
}

interface Options {
  solar_strings?: string[];
  solar_today?: string;
  solar_forecast_remaining?: string;
  batteries?: Battery[];
  grid_power?: string;
  grid_invert?: boolean;
  grid_price?: string;
  grid_export_price?: string;
  grid_export_price_fixed?: number;
  grid_import_today?: string;
  grid_export_today?: string;
  home_power?: string;
  fixed_loads?: string[];
  flexible_loads?: string[];
  energy_period?: "midnight" | "rolling24";
}

interface Instance {
  entry_id: string;
  title: string;
  state: string;
}

interface CardElement extends HTMLElement {
  hass?: Hass;
  setConfig(config: Record<string, unknown>): void;
}

type Schema = { name: string; selector: Record<string, unknown> }[];

const MAX_BATTERIES = 3;

// ---------------------------------------------------------------------------
// Form schemas (rendered by Home Assistant's own <ha-form>)
// ---------------------------------------------------------------------------

const SENSOR = { entity: { domain: "sensor" } };
const SENSORS = { entity: { domain: "sensor", multiple: true, reorder: true } };

const SYSTEM_SCHEMA: Schema = [
  { name: "title", selector: { text: {} } },
  {
    name: "energy_period",
    selector: {
      select: {
        mode: "list",
        options: [
          { value: "midnight", label: "Ab 0 Uhr (heute)" },
          { value: "rolling24", label: "Letzte 24 Stunden" },
        ],
      },
    },
  },
];

const SOLAR_SCHEMA: Schema = [
  { name: "solar_strings", selector: SENSORS },
  { name: "solar_today", selector: SENSOR },
  { name: "solar_forecast_remaining", selector: SENSOR },
];

const BATTERY_SCHEMA: Schema = [
  { name: "name", selector: { text: {} } },
  { name: "power", selector: SENSOR },
  { name: "invert", selector: { boolean: {} } },
  { name: "soc", selector: SENSOR },
  { name: "capacity_kwh", selector: { number: { min: 0, max: 200, step: 0.1, mode: "box", unit_of_measurement: "kWh" } } },
];

const GRID_SCHEMA: Schema = [
  { name: "grid_power", selector: SENSOR },
  { name: "grid_invert", selector: { boolean: {} } },
  { name: "grid_price", selector: SENSOR },
  {
    name: "grid_export_price_fixed",
    selector: { number: { min: 0, max: 100, step: 0.01, mode: "box", unit_of_measurement: "ct/kWh" } },
  },
  { name: "grid_export_price", selector: SENSOR },
  { name: "grid_import_today", selector: SENSOR },
  { name: "grid_export_today", selector: SENSOR },
];

const LOADS_SCHEMA: Schema = [
  { name: "fixed_loads", selector: SENSORS },
  { name: "flexible_loads", selector: SENSORS },
  { name: "home_power", selector: SENSOR },
];

const LABELS: Record<string, string> = {
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
  home_power: "Hausverbrauch gemessen (optional)",
};

const HELPERS: Record<string, string> = {
  energy_period: "Ab 0 Uhr setzt um Mitternacht auf null, 24 Stunden ist ein gleitendes Fenster.",
  solar_strings: "Mehrere Sensoren werden addiert. W oder kW.",
  grid_export_price: "Optional statt des festen Werts, falls sich die Vergütung ändert.",
  fixed_loads: "Laufen, wann sie müssen – z. B. Kühlschrank, TV, Server.",
  flexible_loads: "Zeitpunkt frei wählbar – z. B. Waschmaschine, Trockner, Wallbox.",
  home_power: "Leer lassen: wird aus PV, Batterien und Netz berechnet.",
};

/** Make sure HA's lazily loaded form elements are defined before we use them. */
async function ensureHaElements(): Promise<void> {
  if (customElements.get("ha-form") && customElements.get("ha-entity-picker")) return;
  const helpers = await (window as unknown as { loadCardHelpers(): Promise<any> }).loadCardHelpers();
  for (const type of ["tile", "entities"]) {
    const card = await helpers.createCardElement({ type, entity: "sun.sun", entities: [] });
    await card.constructor.getConfigElement?.();
  }
}

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v ?? {}));

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------

export class EnergieflussPanel extends LitElement {
  @property({ attribute: false }) hass?: Hass;
  @property({ type: Boolean }) narrow = false;

  @state() private _ready = false;
  @state() private _instances: Instance[] = [];
  @state() private _entryId?: string;
  @state() private _title = "";
  @state() private _draft: Options = {};
  @state() private _saved = "";
  @state() private _saving = false;
  @state() private _message?: { kind: "ok" | "error"; text: string };
  private _card?: CardElement;
  private _cardFor = "";

  // -- loading ------------------------------------------------------------------
  protected async firstUpdated(): Promise<void> {
    await ensureHaElements();
    this._ready = true;
    await this._loadInstances();
  }

  private async _loadInstances(): Promise<void> {
    if (!this.hass) return;
    this._instances = await this.hass.callWS<Instance[]>({ type: "energiefluss/instances" });
    const wanted = new URLSearchParams(location.search).get("entry");
    const pick = this._instances.find((i) => i.entry_id === wanted) ?? this._instances[0];
    if (pick) await this._loadEntry(pick.entry_id);
  }

  private async _loadEntry(entryId: string): Promise<void> {
    const res = await this.hass!.callWS<{ title: string; options: Options }>({
      type: "energiefluss/get_options",
      entry_id: entryId,
    });
    this._entryId = entryId;
    this._title = res.title;
    this._draft = clone(res.options);
    this._saved = this._snapshot();
    this._message = undefined;
    this._cardFor = ""; // rebuild preview
  }

  private _snapshot(): string {
    return JSON.stringify({ t: this._title, o: this._draft });
  }

  private get _dirty(): boolean {
    return this._snapshot() !== this._saved;
  }

  // -- preview --------------------------------------------------------------------
  protected updated(changed: PropertyValues): void {
    const host = this.renderRoot.querySelector("#preview");
    if (!host || !this._entryId) return;
    const key = `${this._entryId}:${this._saved}`;
    if (this._cardFor !== key) {
      this._cardFor = key;
      void this._mountCard(host);
    } else if (changed.has("hass") && this._card) {
      this._card.hass = this.hass;
    }
  }

  private async _mountCard(host: Element): Promise<void> {
    await customElements.whenDefined("energiefluss-card");
    const card = document.createElement("energiefluss-card") as CardElement;
    card.setConfig({ type: "custom:energiefluss-card", entry_id: this._entryId });
    card.hass = this.hass;
    host.replaceChildren(card);
    this._card = card;
  }

  // -- editing ----------------------------------------------------------------------
  private _setOptions(patch: Partial<Options>): void {
    this._draft = { ...this._draft, ...patch };
  }

  private _onForm(ev: CustomEvent<{ value: Record<string, unknown> }>, keys: string[]): void {
    const value = ev.detail.value;
    const next: Options = { ...this._draft };
    for (const key of keys) {
      if (key === "title") continue;
      const v = value[key];
      if (v === undefined || v === "" || (Array.isArray(v) && v.length === 0)) {
        delete (next as Record<string, unknown>)[key];
      } else {
        (next as Record<string, unknown>)[key] = v;
      }
    }
    if ("title" in value) this._title = String(value.title ?? "");
    this._draft = next;
  }

  private _onBattery(index: number, ev: CustomEvent<{ value: Battery }>): void {
    const list = [...(this._draft.batteries ?? [])];
    while (list.length <= index) list.push({});
    list[index] = ev.detail.value;
    this._setOptions({ batteries: list });
  }

  private async _save(): Promise<void> {
    if (!this.hass || !this._entryId) return;
    this._saving = true;
    this._message = undefined;
    try {
      const batteries = (this._draft.batteries ?? []).filter((b) => b && (b.power || b.soc));
      const res = await this.hass.callWS<{ title: string; options: Options }>({
        type: "energiefluss/save_options",
        entry_id: this._entryId,
        title: this._title,
        options: { ...this._draft, batteries },
      });
      this._title = res.title;
      this._draft = clone(res.options);
      // give the integration a moment to reload before the preview asks again
      await new Promise((r) => setTimeout(r, 1200));
      this._saved = this._snapshot();
      this._message = { kind: "ok", text: "Gespeichert." };
    } catch (err) {
      this._message = { kind: "error", text: (err as { message?: string }).message ?? String(err) };
    } finally {
      this._saving = false;
    }
  }

  private _discard(): void {
    if (this._entryId) void this._loadEntry(this._entryId);
  }

  // -- live hints ------------------------------------------------------------------------
  private _s(id?: string): StateLike | undefined {
    return id ? this.hass?.states[id] : undefined;
  }
  private get _loc(): string {
    return this.hass?.locale?.language ?? "de";
  }
  private _powerLine(label: string, id: string | undefined, meaning?: string): TemplateResult | typeof nothing {
    if (!id) return nothing;
    const st = this._s(id);
    const warn = powerUnitWarning(st);
    return html`<div class="row">
      <span>${label}</span>
      <span>${fmtPower(watts(st), this._loc)}${meaning ? html` → <b>${meaning}</b>` : nothing}</span>
    </div>
    ${warn ? html`<div class="warn">⚠ ${warn}</div>` : nothing}`;
  }

  private _solarLive(): TemplateResult | typeof nothing {
    const strings = this._draft.solar_strings ?? [];
    if (!strings.length) return nothing;
    const total = strings.reduce((sum, e) => sum + (watts(this._s(e)) ?? 0), 0);
    return html`<div class="live">
      ${strings.map((e) => this._powerLine(this._name(e), e))}
      <div class="row total"><span>Summe</span><span>${fmtPower(total, this._loc)}</span></div>
    </div>`;
  }

  private _batteryLive(b: Battery): TemplateResult | typeof nothing {
    if (!b.power && !b.soc) return nothing;
    const soc = num(this._s(b.soc));
    return html`<div class="live">
      ${this._powerLine("Leistung", b.power, batteryMeaning(watts(this._s(b.power)), !!b.invert))}
      ${b.soc ? html`<div class="row"><span>Ladestand</span><span>${soc === null ? "–" : `${Math.round(soc)} %`}</span></div>` : nothing}
    </div>`;
  }

  private _gridLive(): TemplateResult | typeof nothing {
    const d = this._draft;
    if (!d.grid_power && !d.grid_price) return nothing;
    const w = watts(this._s(d.grid_power));
    return html`<div class="live">
      ${this._powerLine("Netz", d.grid_power, gridMeaning(w, !!d.grid_invert))}
      ${d.grid_price
        ? html`<div class="row"><span>Preis Bezug</span><span>${fmtCents(centsPerKwh(this._s(d.grid_price)), this._loc) || "–"}</span></div>`
        : nothing}
    </div>`;
  }

  private _loadsLive(): TemplateResult | typeof nothing {
    const groups: [string, string[]][] = [
      ["Nicht steuerbar", this._draft.fixed_loads ?? []],
      ["Steuerbar", this._draft.flexible_loads ?? []],
    ];
    if (!groups.some(([, l]) => l.length)) return nothing;
    const both = groups[0][1].filter((e) => groups[1][1].includes(e));
    return html`<div class="live">
      ${groups.map(([label, list]) => {
        const sum = list.reduce((s, e) => s + (watts(this._s(e)) ?? 0), 0);
        const warns = list.map((e) => [e, powerUnitWarning(this._s(e))] as const).filter(([, w]) => w);
        return html`<div class="row"><span>${label}: ${list.length} Geräte</span><span>${fmtPower(sum, this._loc)}</span></div>
          ${warns.map(([e, w]) => html`<div class="warn">⚠ ${this._name(e)}: ${w}</div>`)}`;
      })}
      ${both.length ? html`<div class="warn">⚠ In beiden Gruppen: ${both.map((e) => this._name(e)).join(", ")}</div>` : nothing}
    </div>`;
  }

  private _name(id: string): string {
    return (this._s(id)?.attributes.friendly_name as string | undefined) ?? id;
  }

  // -- render --------------------------------------------------------------------------
  private _form(schema: Schema, data: Record<string, unknown>, onChange: (ev: CustomEvent) => void) {
    return html`<ha-form
      .hass=${this.hass}
      .data=${data}
      .schema=${schema}
      .computeLabel=${(s: { name: string }) => LABELS[s.name] ?? s.name}
      .computeHelper=${(s: { name: string }) => HELPERS[s.name]}
      @value-changed=${onChange}
    ></ha-form>`;
  }

  private _section(title: string, body: TemplateResult, hint?: string): TemplateResult {
    return html`<ha-card>
      <div class="section">
        <h2>${title}</h2>
        ${hint ? html`<p class="hint">${hint}</p>` : nothing}
        ${body}
      </div>
    </ha-card>`;
  }

  protected render() {
    const toolbar = html`<div class="toolbar ${this.narrow ? "narrow" : ""}">
      <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
      <div class="title">Energiefluss</div>
      ${this._instances.length > 1
        ? html`<select @change=${(e: Event) => this._loadEntry((e.target as HTMLSelectElement).value)}>
            ${this._instances.map(
              (i) => html`<option value=${i.entry_id} ?selected=${i.entry_id === this._entryId}>${i.title}</option>`,
            )}
          </select>`
        : nothing}
      <button class="secondary" ?disabled=${!this._dirty || this._saving} @click=${this._discard}>Verwerfen</button>
      <button class="primary" ?disabled=${!this._dirty || this._saving} @click=${this._save}>
        ${this._saving ? "Speichert …" : "Speichern"}
      </button>
    </div>`;

    if (!this._ready) return html`${toolbar}<div class="empty">Lade Editor …</div>`;
    if (!this._entryId) {
      return html`${toolbar}<div class="empty">
        Noch keine Anlage angelegt. Unter Einstellungen → Geräte &amp; Dienste → Integration hinzufügen →
        „Energiefluss“ eine Anlage anlegen.
      </div>`;
    }

    const d = this._draft;
    const batteries = d.batteries ?? [];
    return html`
      ${toolbar}
      ${this._message ? html`<div class="msg ${this._message.kind}">${this._message.text}</div>` : nothing}
      <div class="content ${this.narrow ? "narrow" : ""}">
        <div class="preview-col">
          <div id="preview"></div>
          ${this._dirty ? html`<p class="hint center">Die Vorschau zeigt den gespeicherten Stand.</p>` : nothing}
        </div>
        <div class="editor-col">
          ${this._section(
            "Anlage",
            this._form(SYSTEM_SCHEMA, { title: this._title, energy_period: d.energy_period ?? "midnight" }, (ev) =>
              this._onForm(ev, ["title", "energy_period"]),
            ),
          )}
          ${this._section(
            "Solar",
            html`${this._form(SOLAR_SCHEMA, d as Record<string, unknown>, (ev) =>
              this._onForm(ev, ["solar_strings", "solar_today", "solar_forecast_remaining"]),
            )}${this._solarLive()}`,
          )}
          ${this._section(
            "Batterien",
            html`${Array.from({ length: MAX_BATTERIES }, (_, i) => {
              const b = batteries[i] ?? {};
              return html`<div class="sub">
                <h3>Batterie ${i + 1}${b.name ? ` – ${b.name}` : ""}</h3>
                ${this._form(BATTERY_SCHEMA, b as Record<string, unknown>, (ev) => this._onBattery(i, ev))}
                ${this._batteryLive(b)}
              </div>`;
            })}`,
            "Leer lassen, wenn nicht vorhanden. Positiv soll „lädt“ bedeuten – sonst den Schalter setzen.",
          )}
          ${this._section(
            "Netz",
            html`${this._form(GRID_SCHEMA, d as Record<string, unknown>, (ev) =>
              this._onForm(ev, GRID_SCHEMA.map((s) => s.name)),
            )}${this._gridLive()}`,
            "Positiv soll „Bezug“ bedeuten – sonst den Schalter setzen.",
          )}
          ${this._section(
            "Verbraucher",
            html`${this._form(LOADS_SCHEMA, d as Record<string, unknown>, (ev) =>
              this._onForm(ev, ["fixed_loads", "flexible_loads", "home_power"]),
            )}${this._loadsLive()}`,
            "Alle Verbraucher zählen zum Haus. Je Gerät wird der Tagesverbrauch mitgezählt.",
          )}
        </div>
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
}

if (!customElements.get("energiefluss-panel")) {
  customElements.define("energiefluss-panel", EnergieflussPanel);
}
