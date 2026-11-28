// Which entities a card shows. Home Assistant hands every card a new `hass`
// object on each state change anywhere in the house; the cards only redraw
// when one of these changed.

const ENTITY_ID = /^[a-z0-9_]+\.[a-z0-9_]+$/;

/** Every entity id in the layout the integration sends (at any depth), so new
 *  fields are covered without listing them here. */
export function watchedEntities(layout: unknown): Set<string> {
  const ids = new Set<string>();
  const walk = (v: unknown): void => {
    if (typeof v === "string") {
      if (ENTITY_ID.test(v)) ids.add(v);
    } else if (Array.isArray(v)) {
      v.forEach(walk);
    } else if (v && typeof v === "object") {
      for (const [key, value] of Object.entries(v)) {
        // own names of loads are keyed by their entity
        if (ENTITY_ID.test(key)) ids.add(key);
        walk(value);
      }
    }
  };
  walk(layout);
  return ids;
}

/** Whether any of `ids` has another state object in `now` than in `before`. */
export function statesChanged(
  ids: Iterable<string>,
  before: Record<string, unknown>,
  now: Record<string, unknown>,
): boolean {
  for (const id of ids) if (before[id] !== now[id]) return true;
  return false;
}
