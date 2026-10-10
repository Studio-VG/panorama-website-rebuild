import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Paragraphs } from "@/components/Paragraphs";
import { StudioImage } from "@/components/StudioImage";
import { artistIsLocalized, localizeArtist } from "@/lib/content";
import { isLocale } from "@/lib/locale";
import { messages } from "@/lib/messages";
import { pageMetadata } from "@/lib/seo";
import { getStore, isGuest, publicArtist } from "@/lib/store";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const artist = getStore().artists.find((item) => item.slug === slug && isGuest(item));
  if (!artist) return { title: messages[lang].nav.guests };
  const view = localizeArtist(publicArtist(artist), lang);
  return pageMetadata({
    lang,
    title: view.name,
    description: view.blurb,
    path: `/guests/${artist.slug}`,
    image: artist.photo,
    imageAlt: view.photoAlt,
  });
}

export default async function GuestProfilePage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const artist = getStore().artists.find((item) => item.slug === slug && isGuest(item));
  if (!artist) notFound();
  const view = localizeArtist(publicArtist(artist), lang);
  const localized = artistIsLocalized(artist, lang);
  return (
    <article>
      <div className="shell story-hero">
        <div className="portrait-stage">
          <StudioImage src={view.photo} alt={view.photoAlt} sizes="(max-width: 860px) 100vw, 40vw" priority />
        </div>
        <div className="story">
          <p className="eyebrow">{messages[lang].nav.guests}</p>
          <h1>{view.name}</h1>
          <p className="lede">{localized ? view.blurb : messages[lang].artistPage.untranslated}</p>
          <Link className="btn" href={`/${lang}/guests/${artist.slug}/chat`}>{messages[lang].salon.writeHere}</Link>
        </div>
      </div>
      <div className="shell story">
        {localized ? <Paragraphs text={view.history} /> : null}
      </div>
      {view.portfolio.length ? (
        <section className="section">
          <div className="shell">
            <h2>{messages[lang].artistPage.work}</h2>
            <div className="gallery">
              {view.portfolio.map((image) => (
                <figure key={image.id}>
                  <StudioImage src={image.src} alt={image.alt} sizes="(max-width: 860px) 100vw, 40vw" />
                  {image.caption ? <figcaption>{image.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
