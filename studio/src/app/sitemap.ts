import type { MetadataRoute } from "next";
import { locales } from "@/lib/locale";
import { siteUrl } from "@/lib/seo";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { artists, events } = getStore();
  const residents = artists.filter((artist) => artist.role !== "guest");
  const guests = artists.filter((artist) => artist.role === "guest");
  const base = await siteUrl();
  const paths = [
    "/",
    "/artists",
    "/events",
    "/about",
    "/book",
    "/faq",
    "/guests",
    ...residents.map((artist) => `/artists/${artist.slug}`),
    ...guests.map((artist) => `/guests/${artist.slug}`),
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
