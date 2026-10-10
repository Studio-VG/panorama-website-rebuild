import type { Metadata } from "next";
import { headers } from "next/headers";
import { parseHours } from "./format";
import { locales, openGraphLocale, type Locale } from "./locale";
import { getStore } from "./store";
import type { Artist, Location, Settings, StudioEvent } from "./types";

export async function siteUrl() {
  const configured = process.env.SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  try {
    const headerStore = await headers();
    const host = (headerStore.get("x-forwarded-host") || headerStore.get("host") || "").split(",")[0].trim();
    if (host) {
      const forwarded = (headerStore.get("x-forwarded-proto") || "").split(",")[0].trim();
      const proto = forwarded || (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
      return `${proto}://${host}`;
    }
  } catch {
    // headers() is unavailable outside a request
  }
  return "http://localhost:3001";
}

export async function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  const base = await siteUrl();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function clip(text: string, max = 155) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

export function localizedPath(lang: Locale, path: string) {
  if (path === "/") return `/${lang}`;
  return `/${lang}${path}`;
}

export function pageMetadata(options: {
  lang: Locale;
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  absoluteTitle?: string;
  openGraphType?: "website" | "profile" | "article";
}): Metadata {
  const { settings } = getStore();
  const description = clip(options.description);
  const image = options.image || "/art/hero-koi.jpg";
  const branded = options.absoluteTitle || `${options.title} · ${settings.name}`;
  const canonical = localizedPath(options.lang, options.path);
  const languages: Record<string, string> = { "x-default": localizedPath("en", options.path) };
  for (const locale of locales) languages[locale] = localizedPath(locale, options.path);
  return {
    title: options.absoluteTitle ? { absolute: options.absoluteTitle } : options.title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: options.openGraphType || "website",
      url: canonical,
      title: branded,
      description,
      siteName: settings.name,
      locale: openGraphLocale(options.lang),
      alternateLocale: locales.filter((locale) => locale !== options.lang).map(openGraphLocale),
      images: [{ url: image, alt: options.imageAlt || branded }],
    },
    twitter: {
      card: "summary_large_image",
      title: branded,
      description,
      images: [image],
    },
  };
}

function countryCode(address: string) {
  return /germany|düsseldorf|dusseldorf|duesseldorf/i.test(address) ? "DE" : "TR";
}

export function istanbulAddress(settings: Settings, locations: Location[]) {
  const istanbul = locations.find((place) => countryCode(place.address) === "TR");
  return istanbul?.address || settings.address;
}

function placeJson(place: Location, settings: Settings) {
  const germany = countryCode(place.address) === "DE";
  return {
    "@type": "Place",
    name: place.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: place.address,
      addressCountry: germany ? "DE" : "TR",
    },
    telephone: germany ? settings.phoneAlt || "+49 163 787 99 67" : settings.phone || "+90 533 203 67 40",
    hasMap: place.mapsUrl || undefined,
  };
}

export async function businessJsonLd(settings: Settings, locations: Location[] = [], lang: Locale = "en", description = "") {
  const origin = await siteUrl();
  const street = istanbulAddress(settings, locations);
  return {
    "@context": "https://schema.org",
    "@type": ["TattooParlor", "LocalBusiness"],
    "@id": `${origin}/#studio`,
    name: settings.name,
    alternateName: settings.officialName || undefined,
    description: description || settings.tagline,
    knowsAbout: ["Irezumi", "Japanese tattoo"],
    inLanguage: lang,
    url: `${origin}/${lang}`,
    telephone: settings.phone || "+90 533 203 67 40",
    email: settings.email || "termini@vasovasiko.com",
    image: await absoluteUrl(settings.logoUrl || "/brand/logo.png"),
    address: {
      "@type": "PostalAddress",
      streetAddress: street,
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: settings.latitude,
      longitude: settings.longitude,
    },
    areaServed: [
      { "@type": "City", name: "Istanbul" },
      { "@type": "City", name: "Düsseldorf" },
    ],
    location: locations.map((place) => placeJson(place, settings)),
    contactPoint: [
      settings.phone ? {
        "@type": "ContactPoint",
        telephone: settings.phone,
        contactType: "reservations",
        areaServed: "TR",
      } : undefined,
      settings.phoneAlt ? {
        "@type": "ContactPoint",
        telephone: settings.phoneAlt,
        contactType: "reservations",
        areaServed: "DE",
      } : undefined,
    ].filter(Boolean),
    hasMap: settings.googleBusinessUrl || undefined,
    sameAs: [settings.instagramUrl, settings.facebookUrl, settings.websiteUrl].filter(Boolean),
    openingHoursSpecification: settings.hours.flatMap((entry) => {
      const range = parseHours(entry);
      if (!range) return [];
      return [{
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${entry.day}`,
        opens: range.opens,
        closes: range.closes,
      }];
    }),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export async function personJsonLd(artist: Artist, settings: Settings, lang: Locale) {
  const origin = await siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: artist.name,
    description: artist.blurb,
    image: await absoluteUrl(artist.photo),
    jobTitle: "Tattoo artist",
    knowsAbout: artist.styles,
    url: await absoluteUrl(`/${lang}/artists/${artist.slug}`),
    worksFor: {
      "@id": `${origin}/#studio`,
      "@type": "TattooParlor",
      name: settings.name,
      telephone: settings.phone,
      address: istanbulAddress(settings, getStore().locations),
    },
  };
}

export async function eventJsonLd(event: StudioEvent, settings: Settings, lang: Locale) {
  const origin = await siteUrl();
  const awayFestival = event.slug === "marmaris-tattoo-festival" || /festival|convention|фестиваль/i.test(event.title);
  const street = istanbulAddress(settings, getStore().locations);
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    image: await absoluteUrl(event.image),
    url: await absoluteUrl(`/${lang}/events/${event.slug}`),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: awayFestival
      ? {
          "@type": "Place",
          name: event.country ? `${event.title}, ${event.country}` : event.title,
          address: event.country || undefined,
        }
      : {
          "@type": "Place",
          name: settings.name,
          telephone: settings.phone,
          address: {
            "@type": "PostalAddress",
            streetAddress: street,
            addressCountry: "TR",
          },
        },
    organizer: {
      "@id": `${origin}/#studio`,
      "@type": "TattooParlor",
      name: settings.name,
      telephone: settings.phone,
      address: street,
    },
    performer: event.guest ? { "@type": "Person", name: event.guest } : undefined,
  };
}
