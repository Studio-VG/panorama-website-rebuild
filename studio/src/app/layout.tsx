import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { JsonLd } from "@/components/JsonLd";
import { localizeSettings } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/locale";
import { messages } from "@/lib/messages";
import { businessJsonLd, siteUrl } from "@/lib/seo";
import { getStore } from "@/lib/store";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const sans = Outfit({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
});

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#14110e",
};

async function requestLocale(): Promise<Locale> {
  const headerStore = await headers();
  const value = headerStore.get("x-locale");
  return isLocale(value) ? value : "en";
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await requestLocale();
  const { settings } = getStore();
  const copy = messages[lang];
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: `${settings.name} · ${copy.seo.homeTitle}`, template: `%s · ${settings.name}` },
    description: copy.seo.homeDescription,
    applicationName: settings.name,
    icons: { icon: settings.logoUrl || "/brand/favicon.png" },
    other: {
      "geo.position": `${settings.latitude};${settings.longitude}`,
      "geo.placename": settings.address,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await requestLocale();
  const copy = messages[lang];
  const { settings } = getStore();
  const view = localizeSettings(settings, lang);

  return (
    <html lang={lang} className={`${display.variable} ${sans.variable}`}>
      <body>
        <a className="skip" href="#content">{copy.nav.skip}</a>
        <SiteHeader name={settings.name} logo={settings.logoUrl} lang={lang} labels={copy.nav} />
        <main id="content">{children}</main>
        <SiteFooter settings={view} lang={lang} labels={copy.footer} days={copy.days} closed={copy.closed} />
        <JsonLd data={businessJsonLd({ ...settings, tagline: view.tagline }, lang)} />
      </body>
    </html>
  );
}
