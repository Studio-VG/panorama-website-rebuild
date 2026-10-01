import { randomUUID } from "crypto";
import type { Artist, Inquiry, PortfolioImage, Settings, Store, StudioEvent } from "./types";
import { slugify } from "./format";

function text(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function stylesOf(value: unknown) {
  const raw = Array.isArray(value) ? value.join(",") : text(value, 400);
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
}

export function uniqueSlug(store: Store, name: string, ignoreId?: string) {
  const base = slugify(name);
  let slug = base;
  let n = 2;
  while (store.artists.some((artist) => artist.slug === slug && artist.id !== ignoreId)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

export function portfolioFrom(value: unknown): PortfolioImage[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 24).map((item) => {
    const image = item as Partial<PortfolioImage>;
    const caption = text(image.caption, 180);
    const src = text(image.src, 400);
    return {
      id: text(image.id, 80) || randomUUID(),
      src,
      alt: text(image.alt, 240) || caption || "Portfolio image",
      caption,
    };
  }).filter((image) => image.src.startsWith("/"));
}

export function artistFrom(body: unknown, store: Store, existing?: Artist): { artist?: Artist; error?: string } {
  const input = (body ?? {}) as Partial<Artist> & { stylesText?: string };
  const name = text(input.name, 120);
  const blurb = text(input.blurb, 600);
  const history = text(input.history, 8000);
  const styles = stylesOf(input.styles ?? input.stylesText);
  if (name.length < 2) return { error: "Name is required." };
  if (styles.length === 0) return { error: "Add at least one style specialty." };
  if (blurb.length < 12) return { error: "Add a short blurb." };
  if (history.length < 12) return { error: "Add a longer history." };
  const photo = text(input.photo, 400) || "/art/placeholder-portrait.svg";
  if (!photo.startsWith("/")) return { error: "Photo must be an uploaded studio file." };
  const artist: Artist = {
    id: existing?.id || randomUUID(),
    slug: existing?.slug || uniqueSlug(store, name),
    name,
    styles,
    blurb,
    history,
    photo,
    photoAlt: text(input.photoAlt, 240) || `Portrait of ${name}`,
    portfolio: portfolioFrom(input.portfolio),
  };
  return { artist };
}

export function uniqueEventSlug(store: Store, title: string, ignoreId?: string) {
  const base = slugify(title);
  let slug = base;
  let n = 2;
  while (store.events.some((event) => event.slug === slug && event.id !== ignoreId)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

export function eventFrom(body: unknown, store: Store, existing?: StudioEvent): { event?: StudioEvent; error?: string } {
  const input = (body ?? {}) as Partial<StudioEvent>;
  const title = text(input.title, 160);
  const startDate = text(input.startDate, 10);
  const endDate = text(input.endDate, 10);
  const description = text(input.description, 4000);
  if (title.length < 3) return { error: "Title is required." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) return { error: "Start date is required." };
  if (endDate && !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) return { error: "End date must be a date." };
  if (endDate && endDate < startDate) return { error: "End date is before the start date." };
  if (description.length < 12) return { error: "Add a description." };
  const image = text(input.image, 400) || "/art/placeholder-portrait.svg";
  if (!image.startsWith("/")) return { error: "Image must be an uploaded studio file." };
  const event: StudioEvent = {
    id: existing?.id || randomUUID(),
    slug: existing?.slug || uniqueEventSlug(store, title),
    title,
    startDate,
    endDate: endDate || startDate,
    description,
    guest: text(input.guest, 160),
    country: text(input.country, 80),
    image,
    imageAlt: text(input.imageAlt, 240) || title,
    featured: Boolean(input.featured),
  };
  return { event };
}

export function settingsFrom(body: unknown, current: Settings): { settings?: Settings; error?: string } {
  const input = (body ?? {}) as Partial<Settings>;
  const name = text(input.name, 80);
  const address = text(input.address, 300);
  const phone = text(input.phone, 40);
  const email = text(input.email, 120);
  const tagline = text(input.tagline, 180);
  if (name.length < 2) return { error: "Studio name is required." };
  if (address.length < 8) return { error: "Address is required." };
  if (phone.length < 6) return { error: "Phone is required." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Email looks incomplete." };
  const hours = Array.isArray(input.hours)
    ? input.hours.slice(0, 7).map((entry) => ({
        day: text(entry?.day, 20),
        hours: text(entry?.hours, 40),
      })).filter((entry) => entry.day)
    : current.hours;
  const latitude = Number(input.latitude);
  const longitude = Number(input.longitude);
  const settings: Settings = {
    name,
    tagline: tagline || current.tagline,
    heroLead: text(input.heroLead, 500),
    officialName: text(input.officialName, 80),
    officialNameNote: text(input.officialNameNote, 600),
    phone,
    phoneAlt: text(input.phoneAlt, 40),
    email,
    address,
    hours: hours.length ? hours : current.hours,
    latitude: Number.isFinite(latitude) ? latitude : current.latitude,
    longitude: Number.isFinite(longitude) ? longitude : current.longitude,
    googleBusinessUrl: text(input.googleBusinessUrl, 300),
    portfolioUrl: text(input.portfolioUrl, 300),
    instagramUrl: text(input.instagramUrl, 300),
    facebookUrl: text(input.facebookUrl, 300),
    whatsappUrl: text(input.whatsappUrl, 300),
    websiteUrl: text(input.websiteUrl, 300),
    logoUrl: text(input.logoUrl, 400) || current.logoUrl,
    about: text(input.about, 8000),
  };
  if (settings.logoUrl && !settings.logoUrl.startsWith("/")) {
    return { error: "Logo must be an uploaded studio file." };
  }
  return { settings };
}

export function inquiryFrom(body: unknown): { inquiry?: Inquiry; error?: string } {
  const input = (body ?? {}) as Partial<Inquiry>;
  const name = text(input.name, 120);
  const email = text(input.email, 160);
  const phone = text(input.phone, 40);
  const message = text(input.message, 4000);
  const artist = text(input.artist, 120);
  if (name.length < 2) return { error: "Name is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "A valid email is required." };
  if (phone.length < 6) return { error: "A phone number is required." };
  if (message.length < 10) return { error: "Tell us a little more in the message." };
  return {
    inquiry: {
      id: randomUUID(),
      name,
      email,
      phone,
      artist: artist || "No preference",
      message,
      createdAt: new Date().toISOString(),
    },
  };
}
