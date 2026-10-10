import fs from "fs";
import path from "path";
import defaultStore from "../../data/store.json";
import { slugify } from "./format";
import { ISTANBUL_LOCATION } from "./locations";
import type { Artist, ChatThread, Location, Store } from "./types";

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

function withLocations(store: Store): Store {
  const raw = Array.isArray(store.locations) ? store.locations : [];
  const locations = raw.map((item) => {
    const place = item as Partial<Location>;
    return {
      id: String(place.id || "").trim(),
      name: String(place.name || "").trim(),
      address: String(place.address || "").trim(),
      mapsUrl: String(place.mapsUrl || "").trim(),
      mapQuery: String(place.mapQuery || "").trim(),
    };
  }).filter((place) => place.name && place.address && place.mapsUrl && place.mapQuery);
  store.locations = locations.length > 0 ? locations : [{ ...ISTANBUL_LOCATION }];
  return store;
}

function withArtists(store: Store): Store {
  store.artists = (store.artists || []).map((artist) => ({
    ...artist,
    role: artist.role === "guest" ? "guest" : "resident",
  }));
  store.threads = Array.isArray(store.threads) ? store.threads : [];
  store.clients = Array.isArray(store.clients) ? store.clients : [];
  store.registrations = Array.isArray(store.registrations) ? store.registrations : [];
  return store;
}

export function isGuest(artist: Pick<Artist, "role">) {
  return artist.role === "guest";
}

export function publicArtist<T extends Artist>(artist: T): T {
  const copy = { ...artist };
  delete copy.portalPassword;
  return copy;
}

export function publicThread(thread: ChatThread) {
  return {
    id: thread.id,
    guestId: thread.guestId,
    clientName: thread.clientName,
    messages: thread.messages,
  };
}

export function getStore(): Store {
  ensure();
  const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as Store;
  return withArtists(withLocations(withEventSlugs(parsed)));
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
