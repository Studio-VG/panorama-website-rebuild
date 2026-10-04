import type { Metadata } from "next";
import { parseHours } from "./format";
import { locales, openGraphLocale, type Locale } from "./locale";
import { getStore } from "./store";
import type { Artist, Settings, StudioEvent } from "./types";

export function siteUrl() {
  const configured = process.env.SITE_URL?.trim();
  return (configured || "http://localhost:3001").replace(/\/$/, "");
}

export function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
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

export function businessJsonLd(settings: Settings, lang: Locale = "en") {
  return {
    "@context": "https://schema.org",
    "@type": ["TattooParlor", "LocalBusiness"],
    "@id": `${siteUrl()}/#studio`,
    name: settings.name,
    alternateName: settings.officialName || undefined,
    description: settings.tagline,
    inLanguage: lang,
    url: `${siteUrl()}/${lang}`,
    telephone: settings.phone,
    email: settings.email || undefined,
    image: absoluteUrl(settings.logoUrl || "/brand/logo.png"),
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: settings.latitude,
      longitude: settings.longitude,
    },
    hasMap: settings.googleBusinessUrl,
    sameAs: [settings.instagramUrl, settings.facebookUrl, settings.websiteUrl].filter(Boolean),
    openingHoursSpecification: settings.hours.flatMap((entry) => {
      const range = parseHours(entry);
      if (!range) return [];
      return [{
        "@type": "OpeningHoursSpecification",
        dayOfWeek: entry.day,
        opens: range.opens,
        closes: range.closes,
      }];
    }),
  };
}

export function personJsonLd(artist: Artist, settings: Settings, lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: artist.name,
    description: artist.blurb,
    image: absoluteUrl(artist.photo),
    jobTitle: "Tattoo artist",
    knowsAbout: artist.styles,
    url: absoluteUrl(`/${lang}/artists/${artist.slug}`),
    worksFor: {
      "@id": `${siteUrl()}/#studio`,
      "@type": "TattooParlor",
      name: settings.name,
      telephone: settings.phone,
      address: settings.address,
    },
  };
}

export function eventJsonLd(event: StudioEvent, settings: Settings, lang: Locale) {
  const awayFestival = event.slug === "marmaris-tattoo-festival" || /festival|convention|фестиваль/i.test(event.title);
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    image: absoluteUrl(event.image),
    url: absoluteUrl(`/${lang}/events/${event.slug}`),
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
            streetAddress: settings.address,
            addressCountry: "TR",
          },
        },
    organizer: {
      "@id": `${siteUrl()}/#studio`,
      "@type": "TattooParlor",
      name: settings.name,
      telephone: settings.phone,
      address: settings.address,
    },
    performer: event.guest ? { "@type": "Person", name: event.guest } : undefined,
  };
}
