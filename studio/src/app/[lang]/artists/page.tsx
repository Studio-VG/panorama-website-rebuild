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
  const copy = messages[lang];
  return pageMetadata({
    lang,
    title: copy.seo.artistsTitle,
    description: copy.seo.artistsDescription,
    path: "/artists",
    image: "/art/portrait-vaso.jpg",
    imageAlt: copy.artistsPage.lead,
  });
}

function rank(slug: string) {
  if (slug === "vaso-vasiko") return 0;
  if (slug === "andrei-aivazian") return 1;
  return 2;
}

export default async function ArtistsPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = messages[lang];
  const artists = getStore().artists.map((artist) => localizeArtist(publicArtist(artist), lang));
  const residents = artists.filter((artist) => !isGuest(artist)).sort((a, b) => rank(a.slug) - rank(b.slug));
  const guests = artists.filter((artist) => isGuest(artist));
  return (
    <section className="home-lower home-artists">
      <h1 className="home-legend">{copy.artistsPage.title}</h1>
      <div className="home-artist-grid">
        {residents.map((artist) => (
          <article key={artist.id}>
            <h2><Link href={`/${lang}/artists/${artist.slug}`}>{artist.name}</Link></h2>
            <p>{artist.slug === "vaso-vasiko" ? copy.home.vasoDeed : artist.slug === "andrei-aivazian" ? copy.home.andreiDeed : artist.blurb}</p>
          </article>
        ))}
      </div>
      <section className="home-guests" id="guests" aria-labelledby="guests-heading">
        <h2 className="home-legend" id="guests-heading">{copy.nav.guests}</h2>
        <div className="home-artist-grid">
          {guests.map((artist) => (
            <article key={artist.id}>
              <h3><Link href={`/${lang}/guests/${artist.slug}`}>{artist.name}</Link></h3>
              <p>{artist.blurb}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
