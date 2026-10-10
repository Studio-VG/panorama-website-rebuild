import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { localizeArtist } from "@/lib/content";
import { isLocale } from "@/lib/locale";
import { messages } from "@/lib/messages";
import { pageMetadata } from "@/lib/seo";
import { getStore, isGuest, publicArtist } from "@/lib/store";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata({
    lang,
    title: messages[lang].nav.guests,
    description: messages[lang].salon.guestListMeta,
    path: "/guests",
  });
}

export default async function GuestsPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = messages[lang];
  const guests = getStore().artists.filter(isGuest).map((artist) => localizeArtist(publicArtist(artist), lang));
  return (
    <section className="section">
      <div className="shell">
        <p className="eyebrow">{copy.nav.kicker}</p>
        <h1>{copy.nav.guests}</h1>
        <p className="lede">{copy.salon.guestList}</p>
        <div className="guest-row">
          {guests.map((artist) => (
            <Link className="guest-card" key={artist.id} href={`/${lang}/guests/${artist.slug}`}>
              <strong>{artist.name}</strong>
              <span>{artist.blurb}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
