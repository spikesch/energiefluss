// Line icons from Tabler Icons (MIT License, https://tabler.io/icons),
// bundled as raw SVG and drawn as stroked paths in a 24 x 24 box.

import airConditioning from "@tabler/icons/outline/air-conditioning.svg?raw";
import battery from "@tabler/icons/outline/battery-2.svg?raw";
import bulb from "@tabler/icons/outline/bulb.svg?raw";
import car from "@tabler/icons/outline/car.svg?raw";
import chargingPile from "@tabler/icons/outline/charging-pile.svg?raw";
import coffee from "@tabler/icons/outline/coffee.svg?raw";
import cooker from "@tabler/icons/outline/cooker.svg?raw";
import desktop from "@tabler/icons/outline/device-desktop.svg?raw";
import droplet from "@tabler/icons/outline/droplet.svg?raw";
import flame from "@tabler/icons/outline/flame.svg?raw";
import fridge from "@tabler/icons/outline/fridge.svg?raw";
import home from "@tabler/icons/outline/home.svg?raw";
import lamp from "@tabler/icons/outline/lamp.svg?raw";
import microwave from "@tabler/icons/outline/microwave.svg?raw";
import plug from "@tabler/icons/outline/plug.svg?raw";
import pool from "@tabler/icons/outline/pool.svg?raw";
import router from "@tabler/icons/outline/router.svg?raw";
import server from "@tabler/icons/outline/server.svg?raw";
import solarPanel from "@tabler/icons/outline/solar-panel.svg?raw";
import tower from "@tabler/icons/outline/building-broadcast-tower.svg?raw";
import tv from "@tabler/icons/outline/device-tv.svg?raw";
import vacuum from "@tabler/icons/outline/vacuum-cleaner.svg?raw";
import washMachine from "@tabler/icons/outline/wash-machine.svg?raw";

/** The drawable path data of a Tabler SVG (the invisible bounding box removed). */
function paths(raw: string): string[] {
  return [...raw.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]).filter((d) => d !== "M0 0h24v24H0z");
}

export const ICONS = {
  airConditioning: paths(airConditioning),
  battery: paths(battery),
  bulb: paths(bulb),
  car: paths(car),
  chargingPile: paths(chargingPile),
  coffee: paths(coffee),
  cooker: paths(cooker),
  desktop: paths(desktop),
  droplet: paths(droplet),
  flame: paths(flame),
  fridge: paths(fridge),
  home: paths(home),
  lamp: paths(lamp),
  microwave: paths(microwave),
  plug: paths(plug),
  pool: paths(pool),
  router: paths(router),
  server: paths(server),
  solarPanel: paths(solarPanel),
  tower: paths(tower),
  tv: paths(tv),
  vacuum: paths(vacuum),
  washMachine: paths(washMachine),
};

export type IconName = keyof typeof ICONS;

// First match wins; checked against the lower-case entity name and id.
const RULES: [RegExp, IconName][] = [
  [/k(ü|ue)hl|gefrier|fridge|freez/, "fridge"],
  [/wasch|washer|trockn|dryer/, "washMachine"],
  [/klima|air.?con|\bac\b|split/, "airConditioning"],
  [/wallbox|lade(station|punkt)|charger|evcc/, "chargingPile"],
  [/\bauto\b|\bcar\b|tesla|e.?auto/, "car"],
  [/\btv\b|fernseh|television/, "tv"],
  [/b(ü|ue)ro|office|\bpc\b|computer|desktop|rechner/, "desktop"],
  [/router|netzwerk|switch|fritz|wlan/, "router"],
  [/server|\bnas\b|synology/, "server"],
  [/heiz|heater|therme|w(ä|ae)rmepumpe|heat|boiler/, "flame"],
  [/kocher|kettle|kaffee|coffee|espresso/, "coffee"],
  [/dusch|warmwasser|wasser|shower|durchlauf/, "droplet"],
  [/mikro|microwave/, "microwave"],
  [/herd|ofen|oven|cooker|backofen/, "cooker"],
  [/pool|pumpe|pump/, "pool"],
  [/staubsaug|vacuum|robo/, "vacuum"],
  [/lampe|lamp|licht|light|leuchte/, "lamp"],
  [/ecoflow|powerstation|akku|speicher|batter/, "battery"],
];

/** Icon for a load, chosen from its name (falls back to a plug). */
export function iconFor(text: string): IconName {
  const t = text.toLowerCase();
  return RULES.find(([re]) => re.test(t))?.[1] ?? "plug";
}
