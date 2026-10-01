import type { MetadataRoute } from "next";
import { locales } from "@/lib/locale";
import { siteUrl } from "@/lib/seo";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const { artists, events } = getStore();
  const base = siteUrl();
  const paths = [
    "/",
    "/artists",
    "/events",
    "/about",
    "/book",
    "/styles",
    "/aftercare",
    "/faq",
    ...artists.map((artist) => `/artists/${artist.slug}`),
    ...events.map((event) => `/events/${event.slug}`),
  ];
  return locales.flatMap((lang) =>
    paths.map((path) => {
      const url = path === "/" ? `${base}/${lang}` : `${base}/${lang}${path}`;
      const languages: Record<string, string> = {
        "x-default": path === "/" ? `${base}/en` : `${base}/en${path}`,
      };
      for (const locale of locales) {
        languages[locale] = path === "/" ? `${base}/${locale}` : `${base}/${locale}${path}`;
      }
      return {
        url,
        changeFrequency: path === "/" ? "weekly" as const : "monthly" as const,
        priority: path === "/" ? 1 : 0.7,
        alternates: { languages },
      };
    }),
  );
}
