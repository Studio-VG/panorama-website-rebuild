import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { localizeSettings } from "@/lib/content";
import { isLocale } from "@/lib/locale";
import { messages } from "@/lib/messages";
import { businessJsonLd } from "@/lib/seo";
import { getStore } from "@/lib/store";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = messages[lang];
  const { settings, locations } = getStore();
  const view = localizeSettings(settings, lang);
  const path = (await headers()).get("x-pathname") || "";
  const quiet = /\/guests\//.test(path);
  const shown = quiet ? { ...view, phone: "", phoneAlt: "", email: "", instagramUrl: "", facebookUrl: "", whatsappUrl: "", websiteUrl: "", portfolioUrl: "" } : view;

  return (
    <div className="site-canvas">
      <a className="skip" href="#content">{copy.nav.skip}</a>
      <SiteHeader name={settings.name} logo={settings.logoUrl} lang={lang} labels={copy.nav} />
      <main id="content">{children}</main>
      <SiteFooter settings={shown} locations={locations} lang={lang} labels={copy.footer} quiet={quiet} />
      {quiet ? null : <JsonLd data={businessJsonLd({ ...settings, tagline: view.tagline }, locations, lang, copy.home.facts)} />}
    </div>
  );
}
