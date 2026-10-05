import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/InquiryForm";
import { isLocale } from "@/lib/locale";
import { messages } from "@/lib/messages";
import { istanbulAddress, pageMetadata } from "@/lib/seo";
import { getStore } from "@/lib/store";

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ artist?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = messages[lang];
  return pageMetadata({
    lang,
    title: copy.seo.bookTitle,
    description: copy.seo.bookDescription,
    path: "/book",
  });
}

export default async function BookPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { artist } = await searchParams;
  const copy = messages[lang];
  const { settings, artists, locations } = getStore();
  const street = istanbulAddress(settings, locations);
  return (
    <section className="section">
      <div className="shell split">
        <div>
          <p className="kicker">{settings.name}</p>
          <h1>{copy.book.title}</h1>
          <p>{copy.book.lead}</p>
          <p>{street}</p>
          <p><a href={`mailto:${settings.email}`}>{settings.email}</a> · <a href={settings.whatsappUrl}>{copy.about.whatsapp}</a></p>
        </div>
        <div className="book-form">
          <InquiryForm artists={artists} defaultArtist={artist} labels={copy.form} />
        </div>
      </div>
    </section>
  );
}
