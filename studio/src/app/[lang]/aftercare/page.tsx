import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { telHref } from "@/lib/format";
import { isLocale } from "@/lib/locale";
import { messages } from "@/lib/messages";
import { pageMetadata } from "@/lib/seo";
import { getStore } from "@/lib/store";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = messages[lang];
  return pageMetadata({
    lang,
    title: copy.seo.aftercareTitle,
    description: copy.seo.aftercareDescription,
    path: "/aftercare",
  });
}

export default async function AftercarePage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = messages[lang];
  const { settings } = getStore();
  return (
    <section className="section paper">
      <div className="shell" style={{ maxWidth: 760 }}>
        <p className="kicker">{settings.name}</p>
        <h1>{copy.aftercare.title}</h1>
        <p>{copy.aftercare.intro}</p>
        {copy.aftercare.sections.map((section) => (
          <div key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </div>
        ))}
        <h2>{copy.aftercare.call}</h2>
        <p>
          {settings.name}: <a href={telHref(settings.phone)}>{settings.phone}</a>
          {settings.email ? <> · <a href={`mailto:${settings.email}`}>{settings.email}</a></> : null}
          . <Link href={`/${lang}/book`}>{copy.nav.book}</Link>
        </p>
      </div>
    </section>
  );
}
