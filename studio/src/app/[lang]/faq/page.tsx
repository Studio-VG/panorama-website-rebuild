import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/locale";
import { messages } from "@/lib/messages";
import { JsonLd } from "@/components/JsonLd";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { getStore } from "@/lib/store";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = messages[lang];
  return pageMetadata({
    lang,
    title: copy.seo.faqTitle,
    description: copy.seo.faqDescription,
    path: "/faq",
  });
}

export default async function FaqPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = messages[lang];
  const { settings } = getStore();
  return (
    <section className="section paper">
      <div className="shell" style={{ maxWidth: 800 }}>
        <p className="kicker">{settings.name}</p>
        <h1>{copy.faq.title}</h1>
        <div className="faq-list">
          {copy.faq.items.map((item) => (
            <article className="panel" key={item.q}>
              <h2>{item.q}</h2>
              <p>{item.a}</p>
            </article>
          ))}
        </div>
        <p><Link href={`/${lang}/about`}>{copy.nav.about}</Link> · <Link href={`/${lang}/book`}>{copy.nav.book}</Link></p>
      </div>
      <JsonLd data={faqJsonLd(copy.faq.items)} />
    </section>
  );
}
