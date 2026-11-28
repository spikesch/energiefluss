// Settings mode: which part of the settings belongs to a clicked field of the card.
//
// The card only knows entity ids (the configured sensors and the integration's
// own sensors such as "PV gesamt"); the layout tells where each one belongs.

export type EditTopic = "grid" | "battery" | "solar" | "tariff" | "wallbox" | "loads";

export interface EditTarget {
  topic: EditTopic;
  /** Battery number (0-based) for the battery section. */
  battery?: number;
  /** The load (its power sensor) for the loads section. */
  load?: string;
  /** The clicked entity. */
  entity: string;
}

/** Event a card sends instead of "hass-more-info" while the settings are open. */
export const EDIT_EVENT = "energiefluss-edit";

interface LoadLike {
  entity: string;
  today?: string | null;
  children?: { entity: string; today?: string | null }[];
}

export interface EditLayout {
  entities: Record<string, string | null>;
  home_today?: string | null;
  unmeasured_today?: string | null;
  solar: { strings: { entity: string }[]; today: string | null; forecast_remaining: string | null };
  batteries: {
    power: string | null;
    soc: string | null;
    charge?: string | null;
    discharge?: string | null;
    backup?: LoadLike[];
  }[];
  grid: {
    price: string | null;
    export_price: string | null;
    import_today: string | null;
    export_today: string | null;
  };
  wallbox?: { power: string; soc: string | null; today: string | null } | null;
  loads: { fixed: LoadLike[]; flexible: LoadLike[] };
}

/** The load whose power or energy sensor is `entity` (children included). */
function findLoad(loads: LoadLike[], entity: string): string | undefined {
  for (const l of loads) {
    if (l.entity === entity || l.today === entity) return l.entity;
    const child = (l.children ?? []).find((c) => c.entity === entity || c.today === entity);
    if (child) return child.entity;
  }
  return undefined;
}

export function editTarget(L: EditLayout, entity: string): EditTarget | undefined {
  const e = L.entities;
  const is = (...ids: (string | null | undefined)[]) => ids.some((id) => !!id && id === entity);

  if (is(e.solar_power, e.surplus, L.solar.today, L.solar.forecast_remaining) || L.solar.strings.some((s) => s.entity === entity)) {
    return { topic: "solar", entity };
  }
  for (const [i, b] of L.batteries.entries()) {
    if (is(b.power, b.soc, b.charge, b.discharge) || findLoad(b.backup ?? [], entity)) {
      return { topic: "battery", battery: i, entity };
    }
  }
  if (is(e.battery_power, e.battery_soc, e.battery_energy, e.backup_power)) return { topic: "battery", entity };
  if (L.wallbox && is(L.wallbox.power, L.wallbox.soc, L.wallbox.today, e.wallbox_power)) return { topic: "wallbox", entity };
  if (is(L.grid.price)) return { topic: "tariff", entity };
  if (is(e.grid_power, e.grid_import, e.grid_export, L.grid.import_today, L.grid.export_today, L.grid.export_price)) {
    return { topic: "grid", entity };
  }
  const load = findLoad([...L.loads.fixed, ...L.loads.flexible], entity);
  if (load) return { topic: "loads", load, entity };
  if (is(e.home_power, e.fixed_power, e.flexible_power, e.unmeasured_power, L.home_today, L.unmeasured_today)) {
    return { topic: "loads", entity };
  }
  return undefined;
}
