// Shared editor for an Energiefluss instance: sections to assign sensors, live
// interpretation of the chosen sensors, validation + saving via websocket.
// Used by the sidebar panel and by the card's editor in the dashboard dialog.

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

export interface Hass {
  states: Record<string, StateLike>;
  locale?: { language: string };
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
}

type Mode = "combined" | "split";

interface Battery {
  name?: string;
  mode?: Mode;
  power?: string;
  invert?: boolean;
  charge_power?: string;
  discharge_power?: string;
  soc?: string;
  capacity_kwh?: number;
  backup_loads?: string[];
  backup_only?: boolean;
}

interface Options {
  solar_strings?: string[];
  solar_today?: string;
  solar_forecast_remaining?: string;
  batteries?: Battery[];
  grid_mode?: Mode;
  grid_power?: string;
  grid_invert?: boolean;
  grid_import_power?: string;
  grid_export_power?: string;
  grid_price?: string;
  grid_export_price?: string;
  grid_export_price_fixed?: number;
  grid_import_today?: string;
  grid_export_today?: string;
  home_power?: string;
  fixed_loads?: string[];
  flexible_loads?: string[];
  load_parents?: Record<string, string>;
  wallbox_name?: string;
  wallbox_power?: string;
  wallbox_soc?: string;
  wallbox_flexible?: boolean;
  energy_period?: "midnight" | "rolling24";
  /** Answers of the setup dialog: what the system has. */
  topics?: string[];
  /** Settings sections the user already checked and saved. */
  checked?: string[];
  look?: "glass" | "classic";
}

interface Suggestion<T> {
  value: T;
  source: string;
  /** Same battery seen through a second integration: shown, but not applied by "fill all". */
  duplicate?: boolean;
}

interface Suggestions {
  solar_strings?: Suggestion<string[]>;
  solar_today?: Suggestion<string>;
  solar_forecast_remaining?: Suggestion<string>;
  grid?: Suggestion<Partial<Options>>;
  grid_price?: Suggestion<string>;
  grid_import_today?: Suggestion<string>;
  grid_export_today?: Suggestion<string>;
  home_power?: Suggestion<string>;
  wallbox_power?: Suggestion<string>;
  wallbox_soc?: Suggestion<string>;
  batteries?: Suggestion<Battery>[];
  loads?: { entity: string; name: string; source: string }[];
}

export interface Instance {
  entry_id: string;
  title: string;
  state: string;
}

type Schema = { name: string; selector: Record<string, unknown> }[];

const MAX_BATTERIES = 5;
const MAX_BACKUP_BATTERIES = 2;

/** Sections; the optional ones ask "Ja / Nein" first. */
type Topic = "general" | "grid" | "solar" | "battery" | "wallbox" | "tariff" | "loads";
const OPTIONAL: Topic[] = ["battery", "solar", "tariff", "wallbox"];
/** Order in which a new user goes through the settings. */
const GUIDE: Topic[] = ["grid", "battery", "solar", "tariff", "wallbox", "loads"];

/** Still sections to go through (the Wattrio page then opens the settings). */
export function guideOpen(o: { topics?: string[]; checked?: string[] } & Record<string, unknown>): boolean {
  const checked = o.checked ?? [];
  const has = (k: string) => {
    const v = o[k];
    return Array.isArray(v) ? v.length > 0 : !!v;
  };
  const on: Record<string, boolean> = {
    battery: has("batteries"),
    solar: has("solar_strings"),
    tariff: has("grid_price"),
    wallbox: has("wallbox_power"),
  };
  return GUIDE.some((t) => !checked.includes(t) && (!(t in on) || on[t] || (o.topics ?? []).includes(t)));
}

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

const modeSelect = (name: string) => ({
  name,
  selector: {
    select: {
      mode: "dropdown",
      options: [
        { value: "combined", label: "Ein Sensor mit + und −" },
        { value: "split", label: "Zwei Sensoren (getrennt, beide positiv)" },
      ],
    },
  },
});

function batterySchema(b: Battery, allowBackup = true): Schema {
  const power: Schema =
    b.mode === "split"
      ? [
          { name: "charge_power", selector: SENSOR },
          { name: "discharge_power", selector: SENSOR },
        ]
      : [
          { name: "power", selector: SENSOR },
          { name: "invert", selector: { boolean: {} } },
        ];
  return [
    { name: "name", selector: { text: {} } },
    modeSelect("mode"),
    ...power,
    { name: "soc", selector: SENSOR },
    { name: "capacity_kwh", selector: { number: { min: 0, max: 200, step: 0.1, mode: "box", unit_of_measurement: "kWh" } } },
    ...(allowBackup ? [{ name: "backup_loads", selector: SENSORS }] : []),
    ...(allowBackup && b.mode === "split" ? [{ name: "backup_only", selector: { boolean: {} } }] : []),
  ];
}

function gridSchema(d: Options): Schema {
  const power: Schema =
    d.grid_mode === "split"
      ? [
          { name: "grid_import_power", selector: SENSOR },
          { name: "grid_export_power", selector: SENSOR },
        ]
      : [
          { name: "grid_power", selector: SENSOR },
          { name: "grid_invert", selector: { boolean: {} } },
        ];
  return [modeSelect("grid_mode"), ...power, ...GRID_REST];
}

const GRID_KEYS = [
  "grid_mode",
  "grid_power",
  "grid_invert",
  "grid_import_power",
  "grid_export_power",
  "grid_export_price_fixed",
  "grid_export_price",
  "grid_import_today",
  "grid_export_today",
];

const TARIFF_SCHEMA: Schema = [{ name: "grid_price", selector: SENSOR }];

const GRID_REST: Schema = [
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

const WALLBOX_SCHEMA: Schema = [
  { name: "wallbox_name", selector: { text: {} } },
  { name: "wallbox_power", selector: SENSOR },
  { name: "wallbox_flexible", selector: { boolean: {} } },
  { name: "wallbox_soc", selector: SENSOR },
];

const LABELS: Record<string, string> = {
  wallbox_name: "Name",
  wallbox_power: "Ladeleistung",
  wallbox_flexible: "Zusatzverbraucher (sonst Grundlast)",
  wallbox_soc: "Ladestand Auto (optional)",
  title: "Name der Anlage",
  energy_period: "Tageswerte",
  solar_strings: "PV-Leistung (Strings / Wechselrichter)",
  solar_today: "PV-Ertrag heute",
  solar_forecast_remaining: "Prognose Rest heute",
  name: "Name",
  mode: "Leistung gemessen als",
  power: "Leistung",
  invert: "Sensor zählt Laden negativ",
  charge_power: "Ladeleistung",
  discharge_power: "Entladeleistung",
  backup_only: "Entlädt nur über Notstrom (nicht ins Haus)",
  grid_mode: "Netzleistung gemessen als",
  grid_import_power: "Bezug (z. B. Tibber „Leistung“)",
  grid_export_power: "Einspeisung (z. B. Tibber „Leistung Produktion“)",
  soc: "Ladestand (SoC)",
  capacity_kwh: "Kapazität",
  grid_power: "Netzleistung",
  grid_invert: "Sensor zählt Bezug negativ",
  grid_price: "Strompreis Bezug (z. B. Tibber)",
  grid_export_price_fixed: "Einspeisevergütung (fest)",
  grid_export_price: "Einspeisevergütung (Sensor)",
  grid_import_today: "Bezug heute",
  grid_export_today: "Einspeisung heute",
  fixed_loads: "Grundlast",
  flexible_loads: "Zusatzverbraucher",
  home_power: "Hausverbrauch gemessen (optional)",
};

const HELPERS: Record<string, string> = {
  energy_period: "Ab 0 Uhr setzt um Mitternacht auf null, 24 Stunden ist ein gleitendes Fenster.",
  solar_strings: "Mehrere Sensoren werden addiert. W oder kW.",
  grid_export_price: "Optional statt des festen Werts, falls sich die Vergütung ändert.",
  fixed_loads: "Laufen, wann sie müssen, ihr Verbrauch lässt sich kaum verschieben – z. B. Kühlschrank, Router, Server, Heizungspumpe, Licht, TV.",
  flexible_loads: "Du bestimmst selbst, wann sie laufen – z. B. Waschmaschine, Trockner, Spülmaschine, Wallbox, Pool-Pumpe. Diese lassen sich in Zeiten mit PV-Überschuss oder günstigem dynamischem Strompreis (z. B. Tibber) legen.",
  home_power: "Leer lassen: wird aus PV, Batterien und Netz berechnet.",
  solar_today: "Leer lassen: die Integration zählt selbst mit.",
  grid_import_today: "Leer lassen: die Integration zählt selbst mit.",
  grid_export_today: "Leer lassen: die Integration zählt selbst mit.",
  grid_power: "Leer lassen: wird berechnet, wenn der Hausverbrauch gemessen wird.",
  power: "Leer lassen: wird berechnet, wenn sonst alles gemessen ist (nur bei einer Batterie ohne Sensor).",
};

/** Make sure HA's lazily loaded form elements are defined before we use them. */
export async function ensureHaElements(): Promise<void> {
  if (customElements.get("ha-form") && customElements.get("ha-entity-picker")) return;
  const helpers = await (window as unknown as { loadCardHelpers(): Promise<any> }).loadCardHelpers();
  for (const type of ["tile", "entities"]) {
    const card = await helpers.createCardElement({ type, entity: "sun.sun", entities: [] });
    await card.constructor.getConfigElement?.();
  }
}

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v ?? {}));

/** Readable text for websocket errors ({code, message}, a bare code or an Error). */
function errorText(err: unknown): string {
  const e = err as { message?: unknown; code?: unknown } | number | null;
  // home-assistant-js-websocket rejects pending calls with code 3 when the connection drops
  if (e === 3 || (typeof e === "object" && e?.code === 3)) {
    return "Verbindung zu Home Assistant unterbrochen – bitte erneut speichern.";
  }
  if (typeof e === "object" && e && typeof e.message === "string") return e.message;
  return typeof err === "string" ? err : "Speichern fehlgeschlagen – bitte erneut versuchen.";
}


/** Fired on window after an instance was saved and reloaded; cards refresh. */
export const UPDATED_EVENT = "energiefluss-updated";

// ---------------------------------------------------------------------------
// <energiefluss-editor>: the sections, live hints and save/discard actions
// ---------------------------------------------------------------------------

export class EnergieflussEditor extends LitElement {
  @property({ attribute: false }) hass?: Hass;
  @property({ attribute: false }) entryId?: string;
  /** Compact look for the card dialog (no outer cards). */
  @property({ type: Boolean }) compact = false;

  @state() private _ready = false;
  @state() private _loadedFor?: string;
  @state() private _title = "";
  @state() private _draft: Options = {};
  @state() private _saved = "";
  @state() private _saving = false;
  @state() private _message?: { kind: "ok" | "error"; text: string };
  /** Values the integration currently computes (for the saved config). */
  @state() private _computed: string[] = [];
  @state() private _suggestions?: Suggestions;
  @state() private _detecting = false;
  @state() private _look: "glass" | "classic" = "glass";
  /** Open sections (all closed at first). */
  @state() private _open = new Set<Topic>();
  /** Answers to "Ja / Nein" given in this session; otherwise it follows the data. */
  @state() private _choice: Partial<Record<Topic, boolean>> = {};
  /** Sections whose detected sensors are shown. */
  @state() private _detectIn = new Set<Topic>();
  /** Batteries (by index) where "Notstrom-Steckdosen: Ja" was clicked in this session. */
  @state() private _backupYes = new Set<number>();

  protected async firstUpdated(): Promise<void> {
    await ensureHaElements();
    this._ready = true;
  }

  protected updated(changed: PropertyValues): void {
    if (
      (changed.has("entryId") || changed.has("hass")) &&
      this.hass &&
      this.entryId &&
      this._loadedFor !== this.entryId
    ) {
      this._loadedFor = this.entryId;
      void this._load();
    }
  }

  private async _load(): Promise<void> {
    const res = await this.hass!.callWS<{ title: string; options: Options; computed?: string[] }>({
      type: "energiefluss/get_options",
      entry_id: this.entryId,
    });
    this._computed = res.computed ?? [];
    this._title = res.title;
    this._look = res.options.look === "classic" ? "classic" : "glass";
    this._draft = clone(res.options);
    this._saved = this._snapshot();
    this._message = undefined;
    const next = this._nextOpen();
    this._open = new Set(next ? [next] : []);
  }

  /** The first section of the guide that is switched on and not yet ticked off. */
  private _nextOpen(): Topic | undefined {
    const checked = this._draft.checked ?? [];
    return GUIDE.find((t) => this._isOn(t) && !checked.includes(t));
  }

  /** Save, tick the section off, close it and open the next one. */
  private async _saveSection(topic: Topic): Promise<void> {
    const checked = [...new Set([...(this._draft.checked ?? []), topic])];
    this._draft = { ...this._draft, checked };
    await this.save();
    if (this._message?.kind !== "ok") return;
    const next = this._nextOpen();
    this._open = new Set(next ? [next] : []);
    this._message = { kind: "ok", text: next ? "Gespeichert – weiter mit dem nächsten Abschnitt." : "Gespeichert – alles eingerichtet." };
  }

  private async _setLook(look: "glass" | "classic"): Promise<void> {
    if (!this.hass || !this.entryId) return;
    await this.hass.callWS({ type: "energiefluss/set_look", entry_id: this.entryId, look });
    this._look = look;
    await new Promise((r) => setTimeout(r, 1200));
    window.dispatchEvent(new CustomEvent(UPDATED_EVENT, { detail: { entry_id: this.entryId } }));
  }

  private _snapshot(): string {
    return JSON.stringify({ t: this._title, o: this._draft });
  }

  get dirty(): boolean {
    return this._snapshot() !== this._saved;
  }

  // -- editing --------------------------------------------------------------------
  private _onForm(ev: CustomEvent<{ value: Record<string, unknown> }>, keys: string[]): void {
    ev.stopPropagation(); // keep HA's card dialog from treating it as card config
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
    ev.stopPropagation();
    const list = [...(this._draft.batteries ?? [])];
    while (list.length <= index) list.push({});
    list[index] = ev.detail.value;
    this._draft = { ...this._draft, batteries: list };
  }

  // -- sensor detection ----------------------------------------------------------------
  private async _detect(topic: Topic): Promise<void> {
    if (!this.hass) return;
    this._detectIn = new Set([...this._detectIn, topic]);
    if (this._suggestions) return;
    this._detecting = true;
    try {
      this._suggestions = await this.hass.callWS<Suggestions>({ type: "energiefluss/suggest" });
    } finally {
      this._detecting = false;
    }
  }

  // -- backup sockets of one battery ---------------------------------------------------
  private _backupOn(b: Battery, i: number): boolean {
    return this._backupYes.has(i) || !!(b.backup_loads ?? []).length || !!b.backup_only;
  }

  private _setBackup(i: number, yes: boolean): void {
    const set = new Set(this._backupYes);
    if (yes) set.add(i);
    else set.delete(i);
    this._backupYes = set;
    if (!yes) {
      const list = [...(this._draft.batteries ?? [])];
      const { backup_loads: _l, backup_only: _o, ...rest } = list[i];
      list[i] = rest;
      this._draft = { ...this._draft, batteries: list };
    }
  }

  private _backupPart(b: Battery, i: number): TemplateResult {
    const batteries = this._draft.batteries ?? [];
    const on = this._backupOn(b, i);
    const others = batteries.filter((x, j) => j !== i && this._backupOn(x, j)).length;
    const full = !on && others >= MAX_BACKUP_BATTERIES;
    const schema: Schema = [
      { name: "backup_loads", selector: SENSORS },
      ...(b.mode === "split" ? [{ name: "backup_only", selector: { boolean: {} } }] : []),
    ];
    return html`<div class="backup">
      <div class="head">
        <span class="bq">Hat diese Batterie Notstrom-Steckdosen?</span>
        <div class="yesno" role="group" aria-label="Notstrom-Steckdosen">
          <button class=${on ? "on" : ""} ?disabled=${full} @click=${() => this._setBackup(i, true)}>Ja</button>
          <button class=${on ? "" : "on"} @click=${() => this._setBackup(i, false)}>Nein</button>
        </div>
      </div>
      ${full ? html`<p class="hint">Höchstens ${MAX_BACKUP_BATTERIES} Batterien mit Notstrom.</p>` : nothing}
      ${on
        ? this._form(
            schema,
            { mode: "combined", ...b } as Record<string, unknown>,
            (ev) => this._onBattery(i, ev),
            { backup_loads: "Welche Geräte hängen dran?" },
            {
              backup_loads: "Leistungs-Sensoren der Geräte an den Notstrom-Steckdosen dieser Batterie.",
              backup_only:
                "Für Geräte wie EcoFlow, die nicht ins Haus einspeisen können: Ladeleistung = Eingang aus dem Haus, Entladeleistung = Ausgang an die Notstrom-Geräte.",
            },
          )
        : nothing}
    </div>`;
  }

  // -- sections: open / closed and "Ja / Nein" -----------------------------------------
  private _has(topic: Topic): boolean {
    const d = this._draft;
    const bats = d.batteries ?? [];
    switch (topic) {
      case "solar":
        return !!((d.solar_strings ?? []).length || d.solar_today || d.solar_forecast_remaining);
      case "battery":
        return bats.length > 0;
      case "wallbox":
        return !!(d.wallbox_power || d.wallbox_soc);
      case "tariff":
        return !!d.grid_price;
      default:
        return true;
    }
  }

  private _isOn(topic: Topic): boolean {
    if (!OPTIONAL.includes(topic)) return true;
    return this._choice[topic] ?? (this._has(topic) || (this._draft.topics ?? []).includes(topic));
  }

  private _toggleOpen(topic: Topic): void {
    const open = new Set(this._open);
    if (open.has(topic)) open.delete(topic);
    else open.add(topic);
    this._open = open;
  }

  private _answer(topic: Topic, yes: boolean): void {
    this._choice = { ...this._choice, [topic]: yes };
    if (yes) {
      this._open = new Set([...this._open, topic]);
      return;
    }
    this._clear(topic);
    this._draft = { ...this._draft, topics: (this._draft.topics ?? []).filter((t) => t !== topic) };
    void this._saveSection(topic);
  }

  /** "Nein": take the topic's sensors out of the draft (undo with "Verwerfen"). */
  private _clear(topic: Topic): void {
    const d: Options = { ...this._draft };
    const drop = (...keys: string[]) => keys.forEach((k) => delete (d as Record<string, unknown>)[k]);
    if (topic === "solar") drop("solar_strings", "solar_today", "solar_forecast_remaining");
    if (topic === "battery") drop("batteries");
    if (topic === "wallbox") drop("wallbox_name", "wallbox_power", "wallbox_soc", "wallbox_flexible");
    if (topic === "tariff") drop("grid_price");
    this._draft = d;
  }

  private _batteryUses(b: Battery): string[] {
    return [b.power, b.charge_power, b.discharge_power].filter((x): x is string => !!x);
  }

  private _hasBattery(b: Battery): boolean {
    const wanted = this._batteryUses(b);
    return (this._draft.batteries ?? []).some((x) => this._batteryUses(x).some((e) => wanted.includes(e)));
  }

  private _gridSet(): boolean {
    const d = this._draft;
    return !!(d.grid_power || d.grid_import_power || d.grid_export_power);
  }

  private _apply(patch: Partial<Options>): void {
    this._draft = { ...this._draft, ...patch };
  }

  private _applyBattery(b: Battery): void {
    if (this._hasBattery(b) || (this._draft.batteries ?? []).length >= MAX_BATTERIES) return;
    this._draft = { ...this._draft, batteries: [...(this._draft.batteries ?? []), { ...b }] };
  }

  private _applyLoad(entity: string, group: "fixed_loads" | "flexible_loads"): void {
    const list = [...(this._draft[group] ?? [])];
    if (!list.includes(entity)) list.push(entity);
    this._draft = { ...this._draft, [group]: list };
  }

  private _addBattery(): void {
    const list = [...(this._draft.batteries ?? [])];
    if (list.length >= MAX_BATTERIES) return;
    list.push({ mode: "combined" });
    this._draft = { ...this._draft, batteries: list };
  }

  private _removeBattery(index: number): void {
    this._backupYes = new Set([...this._backupYes].filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)));
    const list = [...(this._draft.batteries ?? [])];
    list.splice(index, 1);
    this._draft = { ...this._draft, batteries: list };
  }

  /** Drop values that belong to the mode not selected (kept while editing). */
  private _cleaned(): Options {
    const d: Options = clone(this._draft);
    d.batteries = (d.batteries ?? [])
      .map((b) => {
        const out = { ...b };
        if (out.mode === "split") {
          delete out.power;
          delete out.invert;
        } else {
          delete out.charge_power;
          delete out.discharge_power;
          delete out.backup_only;
        }
        return out;
      })
      .filter((b) => b.power || b.soc || b.charge_power || b.discharge_power);
    if (d.grid_mode === "split") {
      delete d.grid_power;
      delete d.grid_invert;
    } else {
      delete d.grid_import_power;
      delete d.grid_export_power;
    }
    return d;
  }

  async save(): Promise<void> {
    if (!this.hass || !this.entryId) return;
    this._saving = true;
    this._message = undefined;
    try {
      const res = await this.hass.callWS<{ title: string; options: Options }>({
        type: "energiefluss/save_options",
        entry_id: this.entryId,
        title: this._title,
        options: this._cleaned(),
      });
      this._title = res.title;
      this._draft = clone(res.options);
      this._saved = this._snapshot();
      // give the integration a moment to reload, then let every card refresh
      await new Promise((r) => setTimeout(r, 1200));
      window.dispatchEvent(new CustomEvent(UPDATED_EVENT, { detail: { entry_id: this.entryId } }));
      const fresh = await this.hass.callWS<{ computed?: string[] }>({
        type: "energiefluss/get_options",
        entry_id: this.entryId,
      });
      this._computed = fresh.computed ?? [];
      this._message = { kind: "ok", text: "Anlage gespeichert." };
    } catch (err) {
      this._message = { kind: "error", text: errorText(err) };
    } finally {
      this._saving = false;
    }
  }

  discard(): void {
    void this._load();
  }

  // -- live hints -------------------------------------------------------------------
  private _s(id?: string): StateLike | undefined {
    return id ? this.hass?.states[id] : undefined;
  }
  private get _loc(): string {
    return this.hass?.locale?.language ?? "de";
  }
  private _name(id: string): string {
    return (this._s(id)?.attributes.friendly_name as string | undefined) ?? id;
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
    if (!strings.length) {
      return html`<div class="live">
        ${this._calcNote(
          this._computed.includes("solar")
            ? "PV-Leistung wird aus der Energiebilanz berechnet."
            : "Ohne PV-Sensor: wird berechnet, wenn Netz und Hausverbrauch gemessen werden.",
        )}
      </div>`;
    }
    const total = strings.reduce((sum, e) => sum + (watts(this._s(e)) ?? 0), 0);
    return html`<div class="live">
      ${strings.map((e) => this._powerLine(this._name(e), e))}
      <div class="row total"><span>Summe</span><span>${fmtPower(total, this._loc)}</span></div>
      ${!this._draft.solar_today ? this._calcNote("PV-Ertrag heute zählt die Integration selbst.") : nothing}
    </div>`;
  }

  private _calcNote(text: string): TemplateResult {
    return html`<div class="calc">≈ ${text}</div>`;
  }

  private _batteryLive(b: Battery, index: number): TemplateResult | typeof nothing {
    const split = b.mode === "split";
    const hasPower = split ? !!(b.charge_power || b.discharge_power) : !!b.power;
    const soc = num(this._s(b.soc));
    let lines: TemplateResult | typeof nothing = nothing;
    if (split && hasPower) {
      const c = watts(this._s(b.charge_power));
      const dis = watts(this._s(b.discharge_power));
      const net = c === null && dis === null ? null : Math.abs(c ?? 0) - Math.abs(dis ?? 0);
      lines = html`${this._powerLine("Laden", b.charge_power)}${this._powerLine("Entladen", b.discharge_power)}
        <div class="row total"><span>Ergebnis</span>
          <span>${fmtPower(net === null ? null : Math.abs(net), this._loc)} → <b>${batteryMeaning(net, false)}</b></span>
        </div>`;
    } else if (hasPower) {
      lines = this._powerLine("Leistung", b.power, batteryMeaning(watts(this._s(b.power)), !!b.invert));
    }
    const computed = this._computed.includes(`battery_${index + 1}`);
    if (!hasPower && !b.soc && !(b.backup_loads ?? []).length) return nothing;
    return html`<div class="live">
      ${lines}
      ${!hasPower
        ? this._calcNote(
            computed
              ? "Leistung wird aus der Energiebilanz berechnet."
              : "Ohne Leistungssensor: wird nur berechnet, wenn der Hausverbrauch gemessen wird und dies die einzige Batterie ohne Sensor ist.",
          )
        : nothing}
      ${b.soc
        ? html`<div class="row"><span>Ladestand</span><span>${soc === null ? "–" : `${Math.round(soc)} %`}</span></div>`
        : nothing}
      ${(b.backup_loads ?? []).length
        ? html`<div class="row">
            <span>Notstrom-Abgang: ${b.backup_loads!.length} Geräte</span>
            <span>${fmtPower(b.backup_loads!.reduce((s, e) => s + (watts(this._s(e)) ?? 0), 0), this._loc)}</span>
          </div>`
        : nothing}
    </div>`;
  }

  private _gridLive(): TemplateResult | typeof nothing {
    const d = this._draft;
    const split = d.grid_mode === "split";
    const hasPower = split ? !!(d.grid_import_power || d.grid_export_power) : !!d.grid_power;
    let lines: TemplateResult | typeof nothing = nothing;
    if (split && hasPower) {
      const imp = watts(this._s(d.grid_import_power));
      const exp = watts(this._s(d.grid_export_power));
      const net = imp === null && exp === null ? null : Math.abs(imp ?? 0) - Math.abs(exp ?? 0);
      lines = html`${this._powerLine("Bezug", d.grid_import_power)}${this._powerLine("Einspeisung", d.grid_export_power)}
        <div class="row total"><span>Ergebnis</span>
          <span>${fmtPower(net === null ? null : Math.abs(net), this._loc)} → <b>${gridMeaning(net, false)}</b></span>
        </div>`;
    } else if (hasPower) {
      lines = this._powerLine("Netz", d.grid_power, gridMeaning(watts(this._s(d.grid_power)), !!d.grid_invert));
    }
    let note: TemplateResult | typeof nothing = nothing;
    if (!hasPower) {
      note = this._calcNote(
        d.home_power
          ? "Netzleistung wird aus der Energiebilanz berechnet (gemessener Hausverbrauch)."
          : "Ohne Netzsensor fehlt ein Wert der Bilanz – bitte Netzsensor wählen oder Hausverbrauch messen.",
      );
    }
    const today =
      !d.grid_import_today || !d.grid_export_today
        ? this._calcNote("Fehlende Tageswerte für Bezug/Einspeisung zählt die Integration selbst.")
        : nothing;
    return html`<div class="live">
      ${lines}${note}
      ${d.grid_price
        ? html`<div class="row">
            <span>Preis Bezug</span><span>${fmtCents(centsPerKwh(this._s(d.grid_price)), this._loc) || "–"}</span>
          </div>`
        : nothing}
      ${today}
    </div>`;
  }

  private _wallboxLive(): TemplateResult | typeof nothing {
    const d = this._draft;
    if (!d.wallbox_power) return nothing;
    const soc = num(this._s(d.wallbox_soc));
    return html`<div class="live">
      ${this._powerLine("Wallbox", d.wallbox_power, (d.wallbox_flexible ?? true) ? "Zusatzverbraucher" : "Grundlast")}
      ${d.wallbox_soc ? html`<div class="row"><span>Auto</span><span>${soc === null ? "–" : `${Math.round(soc)} %`}</span></div>` : nothing}
    </div>`;
  }

  /** All configured loads that can take part in a 'contained in' link. */
  private _linkableLoads(): string[] {
    const d = this._draft;
    return [
      ...new Set([
        ...(d.fixed_loads ?? []),
        ...(d.flexible_loads ?? []),
        ...(d.batteries ?? []).flatMap((b) => b.backup_loads ?? []),
      ]),
    ];
  }

  private _setParents(pairs: [string, string][]): void {
    const next = { ...this._draft };
    if (pairs.length) next.load_parents = Object.fromEntries(pairs);
    else delete next.load_parents;
    this._draft = next;
  }

  /** Editor for "<load> is contained in <load>" (counted only once). */
  private _parentsEditor(): TemplateResult {
    const loads = this._linkableLoads();
    const pairs = Object.entries(this._draft.load_parents ?? {});
    const update = (i: number, child: string, parent: string) => {
      const next = [...pairs];
      next[i] = [child, parent];
      this._setParents(next);
    };
    const add = () => {
      const used = new Set(pairs.flatMap(([c, p]) => [c, p]));
      const child = loads.find((e) => !used.has(e)) ?? loads[0];
      const parent = loads.find((e) => e !== child && !pairs.some(([c]) => c === e)) ?? "";
      if (child && parent) this._setParents([...pairs, [child, parent]]);
    };
    const option = (e: string, selected: string) =>
      html`<option value=${e} ?selected=${e === selected}>${this._name(e)}</option>`;
    return html`<div class="pairs">
      <h3>Enthaltene Verbraucher</h3>
      <p class="hint">
        Ist ein Gerät schon im Wert eines anderen enthalten (z. B. Wasserkocher im Unterzähler „Neubau“), wird es
        nur einmal gezählt und auf der Karte eingerückt darunter angezeigt.
      </p>
      ${pairs.map(
        ([child, parent], i) => html`<div class="pair">
          <select @change=${(e: Event) => update(i, (e.target as HTMLSelectElement).value, parent)}>
            ${loads.map((e) => option(e, child))}
          </select>
          <span>ist enthalten in</span>
          <select @change=${(e: Event) => update(i, child, (e.target as HTMLSelectElement).value)}>
            ${loads.filter((e) => e !== child).map((e) => option(e, parent))}
          </select>
          <button class="link" @click=${() => this._setParents(pairs.filter((_, k) => k !== i))}>Entfernen</button>
        </div>
        ${child === parent || pairs.some(([c]) => c === parent)
          ? html`<div class="warn">⚠ Ungültig: ein Gerät kann nicht in sich selbst oder in einem enthaltenen Gerät stecken.</div>`
          : nothing}`,
      )}
      <button class="add" ?disabled=${loads.length < 2} @click=${add}>+ Enthaltenen Verbraucher hinzufügen</button>
    </div>`;
  }

  private _loadsLive(): TemplateResult | typeof nothing {
    const groups: [string, string[]][] = [
      ["Grundlast", this._draft.fixed_loads ?? []],
      ["Zusatzverbraucher", this._draft.flexible_loads ?? []],
    ];
    if (!groups.some(([, l]) => l.length)) return nothing;
    const all = [
      ...groups.flatMap(([, l]) => l),
      ...(this._draft.batteries ?? []).flatMap((b) => b.backup_loads ?? []),
      ...(this._draft.wallbox_power ? [this._draft.wallbox_power] : []),
    ];
    const both = [...new Set(all.filter((e, i) => all.indexOf(e) !== i))];
    return html`<div class="live">
      ${groups.map(([label, list]) => {
        const contained = this._draft.load_parents ?? {};
        // loads contained in another one are already part of its value
        const sum = list.filter((e) => !(e in contained)).reduce((s, e) => s + (watts(this._s(e)) ?? 0), 0);
        const warns = list.map((e) => [e, powerUnitWarning(this._s(e))] as const).filter(([, w]) => w);
        return html`<div class="row"><span>${label}: ${list.length} Geräte</span><span>${fmtPower(sum, this._loc)}</span></div>
          ${warns.map(([e, w]) => html`<div class="warn">⚠ ${this._name(e)}: ${w}</div>`)}`;
      })}
      ${both.length
        ? html`<div class="warn">⚠ In mehreren Gruppen: ${both.map((e) => this._name(e)).join(", ")}</div>`
        : nothing}
    </div>`;
  }

  private _suggestRow(label: string, text: string, source: string, done: boolean, apply: () => void, action = "Übernehmen") {
    return html`<div class="sg-row">
      <div class="sg-text"><b>${label}</b><span>${text}</span><small>${source}</small></div>
      ${done ? html`<span class="sg-done">✓ gesetzt</span>` : html`<button @click=${apply}>${action}</button>`}
    </div>`;
  }

  /** Detected sensors that belong to one section, each with "Übernehmen". */
  private _topicSuggestions(topic: Topic): TemplateResult | typeof nothing {
    if (!this._detectIn.has(topic)) return nothing;
    const sg = this._suggestions;
    if (!sg) return html`<p class="hint">Suche …</p>`;
    const d = this._draft;
    const names = (ids: string[]) => ids.map((e) => this._name(e)).join(", ");
    const rows: TemplateResult[] = [];
    const scalar = (key: keyof Suggestions & keyof Options, label: string) => {
      const item = sg[key] as Suggestion<string> | undefined;
      if (!item) return;
      rows.push(
        this._suggestRow(label, this._name(item.value), item.source, d[key] === item.value, () =>
          this._apply({ [key]: item.value } as Partial<Options>),
        ),
      );
    };
    if (topic === "solar") {
      if (sg.solar_strings) {
        const v = sg.solar_strings.value;
        const done = v.every((e) => (d.solar_strings ?? []).includes(e));
        rows.push(this._suggestRow("PV-Leistung", names(v), sg.solar_strings.source, done, () => this._apply({ solar_strings: v })));
      }
      scalar("solar_today", "PV-Ertrag heute");
      scalar("solar_forecast_remaining", "PV-Prognose Rest heute");
    }
    if (topic === "grid") {
      if (sg.grid) {
        const g = sg.grid.value;
        const ids = [g.grid_power, g.grid_import_power, g.grid_export_power].filter((x): x is string => !!x);
        const done = ids.every((e) => [d.grid_power, d.grid_import_power, d.grid_export_power].includes(e));
        const text =
          g.grid_mode === "split"
            ? `Bezug: ${this._name(g.grid_import_power!)} · Einspeisung: ${this._name(g.grid_export_power!)}`
            : names(ids);
        rows.push(this._suggestRow("Netz", text, sg.grid.source, done, () => this._apply(g)));
      }
      scalar("grid_import_today", "Bezug heute");
      scalar("grid_export_today", "Einspeisung heute");
    }
    if (topic === "tariff") scalar("grid_price", "Strompreis");
    if (topic === "wallbox") {
      scalar("wallbox_power", "Ladeleistung");
      scalar("wallbox_soc", "Ladestand Auto");
    }
    if (topic === "battery") {
      for (const b of sg.batteries ?? []) {
        const v = b.value;
        const parts = v.mode === "split" ? "Laden + Entladen" : "Leistung";
        const dup = b.duplicate ? " – vermutlich dieselbe Batterie wie eine andere" : "";
        rows.push(
          this._suggestRow(
            v.name ?? "Batterie",
            `${parts}${v.soc ? " + Ladestand" : ""}${dup}`,
            b.source,
            this._hasBattery(v),
            () => this._applyBattery(v),
            "Hinzufügen",
          ),
        );
      }
    }
    let loads: TemplateResult | typeof nothing = nothing;
    if (topic === "loads") {
      scalar("home_power", "Hausverbrauch gemessen");
      const used = new Set([
        ...(d.fixed_loads ?? []),
        ...(d.flexible_loads ?? []),
        ...(d.wallbox_power ? [d.wallbox_power] : []),
        ...(d.batteries ?? []).flatMap((x) => x.backup_loads ?? []),
      ]);
      const list = (sg.loads ?? []).filter((l) => !used.has(l.entity));
      loads = list.length
        ? html`<h3>Mögliche Verbraucher</h3>
            ${list.map(
              (l) => html`<div class="sg-row">
                <div class="sg-text"><span>${l.name}</span><small>${l.source}</small></div>
                <div class="sg-btns">
                  <button @click=${() => this._applyLoad(l.entity, "fixed_loads")}>Grundlast</button>
                  <button @click=${() => this._applyLoad(l.entity, "flexible_loads")}>Zusatzverbraucher</button>
                </div>
              </div>`,
            )}`
        : nothing;
    }
    return html`<div class="suggest">
      <div class="sg-head">
        <h3>Gefunden</h3>
        <button @click=${() => (this._detectIn = new Set([...this._detectIn].filter((t) => t !== topic)))}>
          Schließen
        </button>
      </div>
      ${rows.length || loads !== nothing ? rows : html`<p class="hint">Hier nichts Passendes gefunden – bitte unten selbst wählen.</p>`}
      ${loads}
      <p class="hint">Übernommenes landet im Entwurf – erst „Speichern“ übernimmt es.</p>
    </div>`;
  }

  // -- render ---------------------------------------------------------------------------
  private _form(
    schema: Schema,
    data: Record<string, unknown>,
    onChange: (ev: CustomEvent) => void,
    labels: Record<string, string> = {},
    helpers: Record<string, string> = {},
  ) {
    return html`<ha-form
      .hass=${this.hass}
      .data=${data}
      .schema=${schema}
      .computeLabel=${(s: { name: string }) => labels[s.name] ?? LABELS[s.name] ?? s.name}
      .computeHelper=${(s: { name: string }) => helpers[s.name] ?? HELPERS[s.name]}
      @value-changed=${onChange}
    ></ha-form>`;
  }

  private _section(
    topic: Topic,
    title: string,
    body: () => TemplateResult,
    hint?: string,
    question?: string,
    detect = true,
  ): TemplateResult {
    const optional = OPTIONAL.includes(topic);
    const on = this._isOn(topic);
    const open = on && this._open.has(topic);
    const blocked = false;
    const inner = html`<div class="section">
      <div class="head">
        <button class="fold" ?disabled=${!on} @click=${() => this._toggleOpen(topic)} aria-expanded=${open}>
          <span class="chev ${open ? "open" : ""}">›</span>
          <span class="htitle">${title}</span>
          ${(this._draft.checked ?? []).includes(topic) ? html`<span class="tick" title="geprüft und gespeichert">✓</span>` : nothing}
        </button>
        ${optional
          ? html`<div class="yesno" role="group" aria-label=${question ?? title}>
              <button class=${on ? "on" : ""} ?disabled=${blocked} @click=${() => this._answer(topic, true)}>Ja</button>
              <button class=${on ? "" : "on"} @click=${() => this._answer(topic, false)}>Nein</button>
            </div>`
          : nothing}
      </div>
      ${optional && !open ? html`<p class="hint q">${blocked ? "Erst einen Batteriespeicher anlegen." : question}</p>` : nothing}
      ${open
        ? html`${hint ? html`<p class="hint">${hint}</p>` : nothing}
            ${detect
              ? html`<button class="secondary detect" ?disabled=${this._detecting} @click=${() => this._detect(topic)}>
                  ${this._detecting ? "Suche …" : "Sensoren erkennen"}
                </button>`
              : nothing}
            ${this._topicSuggestions(topic)} ${body()}
            <div class="secsave">
              <button class="primary" ?disabled=${this._saving} @click=${() => this._saveSection(topic)}>
                ${this._saving ? "Speichert …" : "Speichern"}
              </button>
            </div>`
        : nothing}
    </div>`;
    return this.compact ? html`<div class="plain">${inner}</div>` : html`<ha-card>${inner}</ha-card>`;
  }

  protected render() {
    if (!this._ready || !this._loadedFor) return html`<div class="hint">Lade …</div>`;
    const d = this._draft;
    const batteries = d.batteries ?? [];
    const busy = this._saving;
    const status = this._message
      ? html`<span class="msg ${this._message.kind}">${this._message.text}</span>`
      : html`<span class="msg">${this.dirty ? "Noch nicht gespeichert – im Abschnitt auf „Speichern“." : ""}</span>`;
    return html`
      <div class="actions">
        ${status}
        <button class="secondary" ?disabled=${!this.dirty || busy} @click=${this.discard}>Verwerfen</button>
      </div>
      ${this._section(
        "general",
        "Allgemein",
        () =>
          html`${this._form(SYSTEM_SCHEMA, { title: this._title, energy_period: d.energy_period ?? "midnight" }, (ev) =>
            this._onForm(ev, ["title", "energy_period"]),
          )}
            <div class="lookrow">
              <span>Look der Karte</span>
              <div class="yesno" role="group" aria-label="Look">
                <button class=${this._look === "glass" ? "on" : ""} @click=${() => this._setLook("glass")}>Glas</button>
                <button class=${this._look === "classic" ? "on" : ""} @click=${() => this._setLook("classic")}>Klassik</button>
              </div>
            </div>`,
        undefined,
        undefined,
        false,
      )}
      ${this._section(
        "grid",
        "Netz",
        () =>
          html`${this._form(gridSchema(d), { grid_mode: "combined", ...d } as Record<string, unknown>, (ev) =>
            this._onForm(ev, GRID_KEYS),
          )}${this._gridLive()}`,
        "Ein Sensor mit + und − (positiv = Bezug) oder getrennt, z. B. Tibber Pulse: „Leistung“ und „Leistung Produktion“.",
      )}
      ${this._section(
        "battery",
        "Batteriespeicher",
        () => html`${batteries.map((b, i) => {
          const data = { mode: "combined", ...b } as Record<string, unknown>;
          return html`<div class="sub">
            <div class="subhead">
              <h3>Batterie ${i + 1}${b.name ? ` – ${b.name}` : ""}</h3>
              <button class="link" @click=${() => this._removeBattery(i)}>Entfernen</button>
            </div>
            ${this._form(batterySchema(b, false), data, (ev) => this._onBattery(i, ev))}
            ${this._batteryLive(b, i)}
            ${this._backupPart(b, i)}
          </div>`;
        })}
        ${batteries.length < MAX_BATTERIES
          ? html`<button class="add" @click=${this._addBattery}>+ Batterie hinzufügen</button>`
          : nothing}`,
        `Ein Sensor mit + und − (positiv = lädt, sonst Schalter setzen) oder zwei getrennte Sensoren für Laden und Entladen. Bis zu ${MAX_BATTERIES} Batterien.`,
        "Hast du einen oder mehrere Batteriespeicher?",
      )}
      ${this._section(
        "solar",
        "Photovoltaik",
        () =>
          html`${this._form(SOLAR_SCHEMA, d as Record<string, unknown>, (ev) =>
            this._onForm(ev, ["solar_strings", "solar_today", "solar_forecast_remaining"]),
          )}${this._solarLive()}`,
        "Ein Sensor je Strang (z. B. Dachseite), höchstens 4 – jeder wird ein Feld auf dem Solarmodul.",
        "Hast du Solarpanele?",
      )}
      ${this._section(
        "tariff",
        "Dynamischer Stromtarif",
        () => this._form(TARIFF_SCHEMA, d as Record<string, unknown>, (ev) => this._onForm(ev, ["grid_price"])),
        "Preis-Sensor in €/kWh, z. B. von Tibber.",
        "Hast du einen dynamischen Stromtarif (z. B. Tibber)?",
      )}
      ${this._section(
        "wallbox",
        "E-Auto / Wallbox",
        () =>
          html`${this._form(
            WALLBOX_SCHEMA,
            { wallbox_flexible: true, ...d } as Record<string, unknown>,
            (ev) => this._onForm(ev, ["wallbox_name", "wallbox_power", "wallbox_soc", "wallbox_flexible"]),
          )}${this._wallboxLive()}`,
        "Hängt am Wechselrichter und zählt zum Hausverbrauch; standardmäßig als Zusatzverbraucher.",
        "Hast du ein E-Auto oder eine Wallbox?",
      )}
      ${this._section(
        "loads",
        "Verbraucher",
        () =>
          html`${this._form(LOADS_SCHEMA, d as Record<string, unknown>, (ev) =>
            this._onForm(ev, ["fixed_loads", "flexible_loads", "home_power"]),
          )}${this._loadsLive()}${this._parentsEditor()}`,
        "Alle Verbraucher zählen zum Haus. Grundlast läuft sowieso, Zusatzverbraucher lassen sich zeitlich verschieben.",
      )}
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    .actions {
      position: sticky;
      top: 0;
      z-index: 2;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 0;
      margin-bottom: 8px;
      background: var(--ef-actions-bg, var(--card-background-color, var(--primary-background-color)));
    }
    .actions .msg {
      flex: 1;
      min-width: 0;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .msg.ok {
      color: var(--success-color, #43a047);
    }
    .msg.error {
      color: var(--error-color, #db4437);
    }
    button {
      flex: none;
      font: inherit;
      font-weight: 500;
      padding: 6px 14px;
      border-radius: 18px;
      cursor: pointer;
      border: 1px solid var(--primary-color);
      background: transparent;
      color: var(--primary-color);
    }
    button.primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    button:disabled {
      opacity: 0.4;
      cursor: default;
    }
    ha-card {
      display: block;
      margin-bottom: 16px;
    }
    .section {
      padding: 16px;
    }
    .plain .section {
      padding: 8px 0 16px;
      border-top: 1px solid var(--divider-color);
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
    .calc {
      color: var(--info-color, var(--primary-color));
      padding: 2px 0;
    }
    .subhead {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    button.link {
      border: none;
      padding: 2px 6px;
      font-size: 13px;
      color: var(--error-color, #db4437);
    }
    .suggest {
      margin-bottom: 16px;
      padding: 12px 16px;
      border: 1px solid var(--primary-color);
      border-radius: 12px;
      background: var(--card-background-color, var(--primary-background-color));
    }
    .sg-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }
    .sg-head div,
    .sg-btns {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .sg-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 6px 0;
      border-top: 1px solid var(--divider-color);
      font-size: 13px;
    }
    .sg-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .sg-text small {
      color: var(--secondary-text-color);
    }
    .sg-done {
      color: var(--success-color, #43a047);
      white-space: nowrap;
    }
    .suggest button {
      padding: 4px 10px;
      font-size: 12px;
    }
    .pairs {
      margin-top: 16px;
    }
    .pair {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
      padding: 4px 0;
      font-size: 13px;
    }
    .pair select {
      flex: 1;
      min-width: 110px;
      font: inherit;
      padding: 4px 6px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
    }
    button.add {
      margin-top: 12px;
      width: 100%;
      border-style: dashed;
    }
    .head {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    button.fold {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      border: none;
      padding: 4px 0;
      border-radius: 0;
      color: var(--primary-text-color);
      text-align: left;
    }
    button.fold:disabled {
      opacity: 1;
    }
    .htitle {
      font-size: 18px;
      font-weight: 500;
    }
    .chev {
      display: inline-block;
      width: 14px;
      font-size: 20px;
      line-height: 1;
      transition: transform 0.15s;
      color: var(--secondary-text-color);
    }
    .chev.open {
      transform: rotate(90deg);
    }
    button.fold:disabled .chev {
      visibility: hidden;
    }
    .yesno {
      display: flex;
    }
    .yesno button {
      padding: 4px 14px;
      border-radius: 0;
    }
    .yesno button:first-child {
      border-radius: 16px 0 0 16px;
    }
    .yesno button:last-child {
      border-radius: 0 16px 16px 0;
      border-left: none;
    }
    .yesno button.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .hint.q {
      margin: 4px 0 0 22px;
    }
    button.detect {
      margin: 4px 0 12px;
    }
    .secsave {
      display: flex;
      justify-content: flex-end;
      margin-top: 14px;
    }
    .tick {
      color: var(--success-color, #43a047);
      font-weight: 700;
    }
    .lookrow {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-top: 8px;
    }
    .backup {
      margin-top: 10px;
      padding-top: 8px;
      border-top: 1px dashed var(--divider-color);
    }
    .bq {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
    }
  `;
}

if (!customElements.get("energiefluss-editor")) {
  customElements.define("energiefluss-editor", EnergieflussEditor);
}
