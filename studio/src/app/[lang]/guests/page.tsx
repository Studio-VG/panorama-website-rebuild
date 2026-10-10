import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StudioImage } from "@/components/StudioImage";
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
    <section className="section paper">
      <div className="shell">
        <p className="kicker">{copy.nav.kicker}</p>
        <h1>{copy.nav.guests}</h1>
        <p className="muted">{copy.salon.guestList}</p>
        <div className="artist-grid">
          {guests.map((artist) => (
            <Link className="artist-card" key={artist.id} href={`/${lang}/guests/${artist.slug}`}>
              <div className="frame portrait-frame">
                <StudioImage src={artist.photo} alt={artist.photoAlt} sizes="(max-width: 860px) 100vw, 340px" />
              </div>
              <div className="card-body">
                <h2>{artist.name}</h2>
                <p>{artist.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
