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

export default async function ArtistsPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = messages[lang];
  const { artists, settings } = getStore();
  return (
    <section className="section paper">
      <div className="shell">
        <p className="kicker">{settings.name}</p>
        <h1>{copy.artistsPage.title}</h1>
        <p className="muted">{copy.artistsPage.lead}</p>
        <div className="artist-grid">
          {artists.filter((artist) => !isGuest(artist)).map((artist) => {
            const view = localizeArtist(publicArtist(artist), lang);
            return (
              <Link className="artist-card" href={`/${lang}/artists/${artist.slug}`} key={artist.id}>
                <div className="frame portrait-frame">
                  <StudioImage src={view.photo} alt={view.photoAlt} sizes="(max-width: 860px) 100vw, 340px" />
                </div>
                <div className="card-body">
                  <h2>{view.name}</h2>
                  <p>{view.blurb}</p>
                  <ul className="tags">{view.styles.map((style) => <li key={style}>{style}</li>)}</ul>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
