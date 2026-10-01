import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
    title: copy.seo.stylesTitle,
    description: copy.seo.stylesDescription,
    path: "/styles",
    image: "/art/plate-koi.jpg",
    imageAlt: copy.styles.lead,
  });
}

export default async function StylesPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = messages[lang];
  const { settings } = getStore();
  return (
    <section className="section paper">
      <div className="shell">
        <p className="kicker">{settings.name}</p>
        <h1>{copy.styles.title}</h1>
        <p className="muted">{copy.styles.lead}</p>
        <div className="style-grid" style={{ marginTop: "1.2rem" }}>
          {copy.styles.items.map((item) => (
            <article className="style-card" key={item.title}>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
        <p><Link href={`/${lang}/artists`}>{copy.styles.more}</Link></p>
      </div>
    </section>
  );
}
