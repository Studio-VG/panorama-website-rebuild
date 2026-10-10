import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Cormorant_Garamond, Noto_Sans_Georgian, Noto_Serif_Georgian, Outfit } from "next/font/google";
import { HtmlLang } from "@/components/HtmlLang";
import { isLocale, type Locale } from "@/lib/locale";
import { messages } from "@/lib/messages";
import { istanbulAddress, siteUrl } from "@/lib/seo";
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

const displayKa = Noto_Serif_Georgian({
  subsets: ["georgian"],
  weight: ["500", "600", "700"],
  variable: "--font-display-ka",
});

const sansKa = Noto_Sans_Georgian({
  subsets: ["georgian"],
  weight: ["400", "500", "600"],
  variable: "--font-sans-ka",
});

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4eadb",
};

async function requestLocale(): Promise<Locale> {
  const headerStore = await headers();
  const value = headerStore.get("x-locale");
  return isLocale(value) ? value : "en";
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await requestLocale();
  const { settings, locations } = getStore();
  const copy = messages[lang];
  return {
    metadataBase: new URL(await siteUrl()),
    title: { default: `${settings.name} · ${copy.seo.homeTitle}`, template: `%s · ${settings.name}` },
    description: copy.seo.homeDescription,
    applicationName: settings.name,
    icons: { icon: settings.logoUrl || "/brand/favicon.png" },
    other: {
      "geo.position": `${settings.latitude};${settings.longitude}`,
      "geo.placename": istanbulAddress(settings, locations),
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await requestLocale();

  return (
    <html lang={lang} className={`${display.variable} ${sans.variable} ${displayKa.variable} ${sansKa.variable}`}>
      <body>
        <HtmlLang />
        {children}
      </body>
    </html>
  );
}
