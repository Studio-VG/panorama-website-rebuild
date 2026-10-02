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
  const { settings } = getStore();
  const view = localizeSettings(settings, lang);

  return (
    <div className="site-canvas">
      <a className="skip" href="#content">{copy.nav.skip}</a>
      <SiteHeader name={settings.name} logo={settings.logoUrl} lang={lang} labels={copy.nav} />
      <main id="content">{children}</main>
      <SiteFooter settings={view} lang={lang} labels={copy.footer} days={copy.days} closed={copy.closed} />
      <JsonLd data={businessJsonLd({ ...settings, tagline: view.tagline }, lang)} />
    </div>
  );
}
