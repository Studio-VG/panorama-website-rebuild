"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import type { Artist, Location, PortfolioImage, Settings, Store, StudioEvent } from "@/lib/types";

type Tab = "settings" | "artists" | "events" | "inquiries" | "locations";
type Session = Store & { authenticated: true };

const emptyArtist = {
  name: "",
  stylesText: "",
  blurb: "",
  history: "",
  photo: "",
  photoAlt: "",
  portfolio: [] as PortfolioImage[],
};

const emptyEvent = {
  title: "",
  startDate: "",
  endDate: "",
  description: "",
  guest: "",
  country: "",
  image: "",
  imageAlt: "",
  featured: false,
};

async function upload(file: File) {
  const body = new FormData();
  body.set("file", file);
  const response = await fetch("/api/admin/upload", { method: "POST", body });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(json.error || "Upload failed");
  return json.url as string;
}

export function AdminApp() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [store, setStore] = useState<Session | null>(null);
  const [tab, setTab] = useState<Tab>("settings");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function reload() {
    const response = await fetch("/api/admin/session");
    if (!response.ok) {
      setAuthed(false);
      setStore(null);
      setReady(true);
      return;
    }
    const data = await response.json();
    setStore({
      ...data,
      artists: Array.isArray(data.artists) ? data.artists : [],
      events: Array.isArray(data.events) ? data.events : [],
      inquiries: Array.isArray(data.inquiries) ? data.inquiries : [],
      locations: Array.isArray(data.locations) ? data.locations : [],
    });
    setAuthed(true);
    setReady(true);
    router.refresh();
  }

  useEffect(() => {
    void reload();
    // The first load only checks the existing cookie.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const password = String(new FormData(event.currentTarget).get("password") || "");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(body.error || "Login failed.");
      return;
    }
    await reload();
  }

  if (!ready) return <p className="shell admin-wrap">Checking the studio login…</p>;

  if (!authed || !store) {
    return (
      <section className="section paper">
        <div className="shell" style={{ maxWidth: 480 }}>
          <h1>Studio admin</h1>
          <p>Staff sign-in. The demo password is in the studio README.</p>
          <form onSubmit={login}>
            <label htmlFor="admin-password">Password
              <input id="admin-password" name="password" type="password" autoComplete="current-password" required />
            </label>
            {error ? <p className="form-error" role="alert">{error}</p> : null}
            <button className="btn btn-ink" type="submit">Sign in</button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="section paper">
      <div className="shell admin-wrap">
        <h1>Studio admin</h1>
        <p>Changes are saved in <code>data/store.json</code> and stay after a restart. Uploaded images go to <code>data/uploads</code>.</p>
        <p><a href="/admin/chats">Guest conversations</a></p>
        <div className="tabs" role="tablist" aria-label="Admin sections">
          {(["settings", "artists", "events", "inquiries", "locations"] as Tab[]).map((item) => (
            <button key={item} className="btn btn-ink" type="button" role="tab" aria-selected={tab === item} onClick={() => { setTab(item); setMessage(""); setError(""); }}>
              {item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
          <button className="btn danger" type="button" onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); setAuthed(false); }}>Sign out</button>
        </div>
        {message ? <p className="form-ok" role="status">{message}</p> : null}
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        {tab === "settings" ? <SettingsForm settings={store.settings} onDone={async (text) => { setMessage(text); await reload(); }} onError={setError} /> : null}
        {tab === "artists" ? <ArtistsForm artists={store.artists} onDone={async (text) => { setMessage(text); await reload(); }} onError={setError} /> : null}
        {tab === "events" ? <EventsForm events={store.events} onDone={async (text) => { setMessage(text); await reload(); }} onError={setError} /> : null}
        {tab === "inquiries" ? <Inquiries inquiries={store.inquiries} onDone={async (text) => { setMessage(text); await reload(); }} /> : null}
        {tab === "locations" ? <LocationsForm locations={Array.isArray(store.locations) ? store.locations : []} onDone={async (text) => { setMessage(text); await reload(); }} onError={setError} /> : null}
      </div>
    </section>
  );
}

function SettingsForm({ settings, onDone, onError }: { settings: Settings; onDone: (text: string) => Promise<void>; onError: (text: string) => void }) {
  const [draft, setDraft] = useState(settings);
  useEffect(() => setDraft(settings), [settings]);

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    onError("");
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) return onError(body.error || "Could not save settings.");
    await onDone("Studio settings saved.");
  }

  return (
    <form onSubmit={save}>
      <label htmlFor="setting-name">Studio name
        <input id="setting-name" value={draft.name} onChange={(event) => set("name", event.target.value)} required />
      </label>
      <label htmlFor="setting-tagline">Tagline
        <input id="setting-tagline" value={draft.tagline} onChange={(event) => set("tagline", event.target.value)} />
      </label>
      <label htmlFor="setting-lead">Home introduction
        <textarea id="setting-lead" value={draft.heroLead} onChange={(event) => set("heroLead", event.target.value)} />
      </label>
      <label htmlFor="setting-official">Official name (alternate, not the site title)
        <input id="setting-official" value={draft.officialName} onChange={(event) => set("officialName", event.target.value)} />
      </label>
      <label htmlFor="setting-address">Address
        <textarea id="setting-address" value={draft.address} onChange={(event) => set("address", event.target.value)} required />
      </label>
      <label htmlFor="setting-phone">Phone
        <input id="setting-phone" value={draft.phone} onChange={(event) => set("phone", event.target.value)} required />
      </label>
      <label htmlFor="setting-phone-alt">Second phone
        <input id="setting-phone-alt" value={draft.phoneAlt} onChange={(event) => set("phoneAlt", event.target.value)} />
      </label>
      <label htmlFor="setting-email">Email
        <input id="setting-email" type="email" value={draft.email} onChange={(event) => set("email", event.target.value)} />
      </label>
      <fieldset>
        <legend>Opening hours</legend>
        <div className="hours-grid">
          {draft.hours.map((entry, index) => (
            <label key={entry.day} htmlFor={`hour-${index}`}>{entry.day}
              <input id={`hour-${index}`} value={entry.hours} onChange={(event) => {
                const hours = draft.hours.map((item, itemIndex) => itemIndex === index ? { ...item, hours: event.target.value } : item);
                set("hours", hours);
              }} />
            </label>
          ))}
        </div>
      </fieldset>
      <label htmlFor="setting-lat">Latitude
        <input id="setting-lat" value={draft.latitude} onChange={(event) => set("latitude", Number(event.target.value))} />
      </label>
      <label htmlFor="setting-lng">Longitude
        <input id="setting-lng" value={draft.longitude} onChange={(event) => set("longitude", Number(event.target.value))} />
      </label>
      <label htmlFor="setting-google">Google Business link
        <input id="setting-google" value={draft.googleBusinessUrl} onChange={(event) => set("googleBusinessUrl", event.target.value)} />
      </label>
      <label htmlFor="setting-instagram">Instagram
        <input id="setting-instagram" value={draft.instagramUrl} onChange={(event) => set("instagramUrl", event.target.value)} />
      </label>
      <label htmlFor="setting-facebook">Facebook
        <input id="setting-facebook" value={draft.facebookUrl} onChange={(event) => set("facebookUrl", event.target.value)} />
      </label>
      <label htmlFor="setting-whatsapp">WhatsApp link
        <input id="setting-whatsapp" value={draft.whatsappUrl} onChange={(event) => set("whatsappUrl", event.target.value)} />
      </label>
      <label htmlFor="setting-logo">Replace logo
        <input id="setting-logo" type="file" accept="image/*" onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          try { set("logoUrl", await upload(file)); } catch (reason) { onError(reason instanceof Error ? reason.message : "Upload failed"); }
        }} />
      </label>
      {draft.logoUrl ? <img src={draft.logoUrl} alt="Current studio logo" style={{ height: 64, width: 64, objectFit: "contain", background: "#14110e" }} /> : null}
      <label htmlFor="setting-about">About
        <textarea id="setting-about" value={draft.about} onChange={(event) => set("about", event.target.value)} />
      </label>
      <button className="btn btn-ink" id="setting-save" type="submit">Save studio settings</button>
    </form>
  );
}

function ArtistsForm({ artists, onDone, onError }: { artists: Artist[]; onDone: (text: string) => Promise<void>; onError: (text: string) => void }) {
  const [selected, setSelected] = useState<string>("new");
  const [confirming, setConfirming] = useState(false);
  const [draft, setDraft] = useState(emptyArtist);

  useEffect(() => {
    if (selected === "new") {
      setDraft(emptyArtist);
      return;
    }
    const artist = artists.find((item) => item.id === selected);
    if (!artist) return;
    setDraft({
      name: artist.name,
      stylesText: artist.styles.join(", "),
      blurb: artist.blurb,
      history: artist.history,
      photo: artist.photo,
      photoAlt: artist.photoAlt,
      portfolio: artist.portfolio,
    });
  }, [selected, artists]);

  async function save(event: FormEvent) {
    event.preventDefault();
    onError("");
    const payload = {
      name: draft.name,
      styles: draft.stylesText,
      blurb: draft.blurb,
      history: draft.history,
      photo: draft.photo,
      photoAlt: draft.photoAlt,
      portfolio: draft.portfolio,
    };
    const response = await fetch(selected === "new" ? "/api/admin/artists" : `/api/admin/artists/${selected}`, {
      method: selected === "new" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) return onError(body.error || "Could not save the artist.");
    setSelected(body.artist.id);
    await onDone(selected === "new" ? "Artist added." : "Artist updated.");
  }

  async function remove() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    const response = await fetch(`/api/admin/artists/${selected}`, { method: "DELETE" });
    if (!response.ok) return onError("Could not delete the artist.");
    setSelected("new");
    setConfirming(false);
    await onDone("Artist removed.");
  }

  return (
    <div className="admin-grid">
      <div>
        <button className="list-btn" type="button" aria-current={selected === "new"} onClick={() => { setSelected("new"); setConfirming(false); }}>New artist</button>
        {artists.map((artist) => (
          <button className="list-btn" type="button" key={artist.id} aria-current={selected === artist.id} onClick={() => { setSelected(artist.id); setConfirming(false); }}>
            {artist.name}
          </button>
        ))}
      </div>
      <form onSubmit={save}>
        <label htmlFor="artist-name">Name
          <input id="artist-name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required />
        </label>
        <label htmlFor="artist-styles">Style specialties, separated by commas
          <input id="artist-styles" value={draft.stylesText} onChange={(event) => setDraft({ ...draft, stylesText: event.target.value })} required />
        </label>
        <label htmlFor="artist-blurb">Short blurb
          <textarea id="artist-blurb" value={draft.blurb} onChange={(event) => setDraft({ ...draft, blurb: event.target.value })} required />
        </label>
        <label htmlFor="artist-history">Longer history
          <textarea id="artist-history" value={draft.history} onChange={(event) => setDraft({ ...draft, history: event.target.value })} required />
        </label>
        <label htmlFor="artist-photo">Photo
          <input id="artist-photo" type="file" accept="image/*" onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            try {
              const url = await upload(file);
              setDraft((current) => ({ ...current, photo: url, photoAlt: current.photoAlt || `Portrait of ${current.name || "the artist"}` }));
            } catch (reason) { onError(reason instanceof Error ? reason.message : "Upload failed"); }
          }} />
        </label>
        {draft.photo ? <img src={draft.photo} alt={draft.photoAlt || ""} style={{ width: 120 }} /> : null}
        <label htmlFor="artist-portfolio">Add portfolio images
          <input id="artist-portfolio" type="file" accept="image/*" multiple onChange={async (event) => {
            const files = [...(event.target.files || [])];
            try {
              const added: PortfolioImage[] = [];
              for (const file of files) {
                const src = await upload(file);
                added.push({ id: src, src, alt: file.name, caption: file.name.replace(/\.[^.]+$/, "") });
              }
              setDraft((current) => ({ ...current, portfolio: [...current.portfolio, ...added] }));
            } catch (reason) { onError(reason instanceof Error ? reason.message : "Upload failed"); }
          }} />
        </label>
        <div className="thumb-row">
          {draft.portfolio.map((image) => (
            <figure key={image.id}>
              <img src={image.src} alt={image.alt} />
              <button className="btn danger" type="button" onClick={() => setDraft({ ...draft, portfolio: draft.portfolio.filter((item) => item.id !== image.id) })}>Remove</button>
            </figure>
          ))}
        </div>
        <button className="btn btn-ink" id="artist-save" type="submit">{selected === "new" ? "Add artist" : "Save artist"}</button>
        {selected !== "new" ? (
          <button className="btn danger" id="artist-delete" type="button" onClick={() => void remove()}>
            {confirming ? "Confirm delete" : "Delete artist"}
          </button>
        ) : null}
      </form>
    </div>
  );
}

function EventsForm({ events, onDone, onError }: { events: StudioEvent[]; onDone: (text: string) => Promise<void>; onError: (text: string) => void }) {
  const [selected, setSelected] = useState<string>("new");
  const [confirming, setConfirming] = useState(false);
  const [draft, setDraft] = useState(emptyEvent);

  useEffect(() => {
    if (selected === "new") {
      setDraft(emptyEvent);
      return;
    }
    const event = events.find((item) => item.id === selected);
    if (!event) return;
    setDraft({
      title: event.title,
      startDate: event.startDate,
      endDate: event.endDate,
      description: event.description,
      guest: event.guest,
      country: event.country,
      image: event.image,
      imageAlt: event.imageAlt,
      featured: event.featured,
    });
  }, [selected, events]);

  async function save(event: FormEvent) {
    event.preventDefault();
    onError("");
    const response = await fetch(selected === "new" ? "/api/admin/events" : `/api/admin/events/${selected}`, {
      method: selected === "new" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) return onError(body.error || "Could not save the event.");
    setSelected(body.event.id);
    await onDone(selected === "new" ? "Event added." : "Event updated.");
  }

  async function remove() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    const response = await fetch(`/api/admin/events/${selected}`, { method: "DELETE" });
    if (!response.ok) return onError("Could not delete the event.");
    setSelected("new");
    setConfirming(false);
    await onDone("Event removed.");
  }

  return (
    <div className="admin-grid">
      <div>
        <button className="list-btn" type="button" aria-current={selected === "new"} onClick={() => { setSelected("new"); setConfirming(false); }}>New event</button>
        {events.map((event) => (
          <button className="list-btn" type="button" key={event.id} aria-current={selected === event.id} onClick={() => { setSelected(event.id); setConfirming(false); }}>
            {event.title}
          </button>
        ))}
      </div>
      <form onSubmit={save}>
        <label htmlFor="event-title">Title
          <input id="event-title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required />
        </label>
        <label htmlFor="event-start">Start date
          <input id="event-start" type="date" value={draft.startDate} onChange={(event) => setDraft({ ...draft, startDate: event.target.value })} required />
        </label>
        <label htmlFor="event-end">End date
          <input id="event-end" type="date" value={draft.endDate} onChange={(event) => setDraft({ ...draft, endDate: event.target.value })} />
        </label>
        <label htmlFor="event-guest">Guest
          <input id="event-guest" value={draft.guest} onChange={(event) => setDraft({ ...draft, guest: event.target.value })} />
        </label>
        <label htmlFor="event-country">Country
          <input id="event-country" value={draft.country} onChange={(event) => setDraft({ ...draft, country: event.target.value })} />
        </label>
        <label htmlFor="event-description">Description
          <textarea id="event-description" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} required />
        </label>
        <label className="check" htmlFor="event-featured">
          <input id="event-featured" type="checkbox" checked={draft.featured} onChange={(event) => setDraft({ ...draft, featured: event.target.checked })} />
          Featured on the home page
        </label>
        <label htmlFor="event-image">Image
          <input id="event-image" type="file" accept="image/*" onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            try {
              const url = await upload(file);
              setDraft((current) => ({ ...current, image: url, imageAlt: current.imageAlt || current.title }));
            } catch (reason) { onError(reason instanceof Error ? reason.message : "Upload failed"); }
          }} />
        </label>
        {draft.image ? <img src={draft.image} alt={draft.imageAlt || ""} style={{ width: 220 }} /> : null}
        <button className="btn btn-ink" id="event-save" type="submit">{selected === "new" ? "Add event" : "Save event"}</button>
        {selected !== "new" ? (
          <button className="btn danger" id="event-delete" type="button" onClick={() => void remove()}>
            {confirming ? "Confirm delete" : "Delete event"}
          </button>
        ) : null}
      </form>
    </div>
  );
}

const emptyLocation = { name: "", address: "", mapsUrl: "", mapQuery: "" };
const noLocations: Location[] = [];

function LocationsForm({ locations, onDone, onError }: { locations?: Location[]; onDone: (text: string) => Promise<void>; onError: (text: string) => void }) {
  const places = Array.isArray(locations) ? locations : noLocations;
  const [selected, setSelected] = useState<string>("new");
  const [confirming, setConfirming] = useState(false);
  const [draft, setDraft] = useState(emptyLocation);

  useEffect(() => {
    if (selected === "new") {
      setDraft(emptyLocation);
      return;
    }
    const place = places.find((item) => item.id === selected);
    if (!place) return;
    setDraft({ name: place.name, address: place.address, mapsUrl: place.mapsUrl, mapQuery: place.mapQuery });
  }, [selected, places]);

  async function save(event: FormEvent) {
    event.preventDefault();
    onError("");
    const response = await fetch(selected === "new" ? "/api/admin/locations" : `/api/admin/locations/${selected}`, {
      method: selected === "new" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) return onError(body.error || "Could not save the location.");
    setSelected(body.location.id);
    await onDone(selected === "new" ? "Location added." : "Location updated.");
  }

  async function remove() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    const response = await fetch(`/api/admin/locations/${selected}`, { method: "DELETE" });
    if (!response.ok) return onError("Could not remove the location.");
    setSelected("new");
    setConfirming(false);
    await onDone("Location removed.");
  }

  return (
    <div className="admin-grid">
      <div>
        <button className="list-btn" id="add-location" type="button" aria-current={selected === "new"} onClick={() => { setSelected("new"); setConfirming(false); }}>Add location</button>
        {places.map((place) => (
          <button className="list-btn" type="button" key={place.id} aria-current={selected === place.id} onClick={() => { setSelected(place.id); setConfirming(false); }}>
            {place.name}
          </button>
        ))}
      </div>
      <form onSubmit={save}>
        <p>Germany stays in the service area until a saved location uses that name. The map query is the street for the pin, not a share link.</p>
        <label htmlFor="location-name">Name
          <input id="location-name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required />
        </label>
        <label htmlFor="location-address">Full address
          <textarea id="location-address" value={draft.address} onChange={(event) => setDraft({ ...draft, address: event.target.value })} required />
        </label>
        <label htmlFor="location-maps">Google Maps link
          <input id="location-maps" value={draft.mapsUrl} onChange={(event) => setDraft({ ...draft, mapsUrl: event.target.value })} required />
        </label>
        <label htmlFor="location-query">Map query
          <textarea id="location-query" value={draft.mapQuery} onChange={(event) => setDraft({ ...draft, mapQuery: event.target.value })} required />
        </label>
        <button className="btn btn-ink" id="location-save" type="submit">{selected === "new" ? "Add location" : "Save location"}</button>
        {selected !== "new" ? (
          <button className="btn danger" id="location-remove" type="button" onClick={() => void remove()}>
            {confirming ? "Confirm remove" : "Remove location"}
          </button>
        ) : null}
      </form>
    </div>
  );
}

function Inquiries({ inquiries, onDone }: { inquiries: Store["inquiries"]; onDone: (text: string) => Promise<void> }) {
  if (!inquiries.length) return <p>No booking requests yet.</p>;
  return (
    <div className="faq-list">
      {inquiries.map((inquiry) => (
        <article className="panel" key={inquiry.id}>
          <h2>{inquiry.name}</h2>
          <p>{inquiry.email} · {inquiry.phone} · {inquiry.artist}</p>
          <p>{inquiry.message}</p>
          <p className="muted">{new Date(inquiry.createdAt).toLocaleString("en-GB")}</p>
          <button className="btn danger" type="button" onClick={async () => {
            await fetch(`/api/admin/inquiries/${inquiry.id}`, { method: "DELETE" });
            await onDone("Request removed.");
          }}>Remove</button>
        </article>
      ))}
    </div>
  );
}
