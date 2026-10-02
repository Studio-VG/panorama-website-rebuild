import fs from "fs";
import path from "path";
import defaultStore from "../../data/store.json";
import { slugify } from "./format";
import type { Store } from "./types";

const file = path.join(process.cwd(), "data", "store.json");

function ensure() {
  if (!fs.existsSync(file)) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(defaultStore, null, 2));
  }
}

function withEventSlugs(store: Store): Store {
  const used = new Set<string>();
  store.events = store.events.map((event) => {
    let slug = event.slug || slugify(event.title);
    const base = slug;
    let n = 2;
    while (used.has(slug)) {
      slug = `${base}-${n}`;
      n += 1;
    }
    used.add(slug);
    return { ...event, slug };
  });
  return store;
}

export function getStore(): Store {
  ensure();
  const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as Store;
  return withEventSlugs(parsed);
}

export function saveStore(store: Store) {
  ensure();
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(store, null, 2));
  fs.renameSync(tmp, file);
}

export function publicStore() {
  const store = getStore();
  return {
    settings: store.settings,
    artists: store.artists,
    events: store.events,
  };
}
