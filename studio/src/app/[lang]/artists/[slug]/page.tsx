import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Paragraphs } from "@/components/Paragraphs";
import { StudioImage } from "@/components/StudioImage";
import { artistIsLocalized, artistSeo, localizeArtist } from "@/lib/content";
import { isLocale } from "@/lib/locale";
import { messages } from "@/lib/messages";
import { pageMetadata, personJsonLd } from "@/lib/seo";
import { getStore, isGuest, publicArtist } from "@/lib/store";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const { artists } = getStore();
  const artist = artists.find((item) => item.slug === slug && !isGuest(item));
  if (!artist) return { title: messages[lang].nav.artists };
  const seo = artistSeo(artist, lang);
  const view = localizeArtist(artist, lang);
  return pageMetadata({
    lang,
    title: seo.title,
    description: seo.description,
    path: `/artists/${artist.slug}`,
    image: artist.photo,
    imageAlt: view.photoAlt,
    openGraphType: "profile",
  });
}

export default async function ArtistPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const copy = messages[lang];
  const { artists, settings } = getStore();
  const artist = artists.find((item) => item.slug === slug);
  if (!artist) notFound();
  if (isGuest(artist)) redirect(`/${lang}/guests/${artist.slug}`);
  const view = localizeArtist(publicArtist(artist), lang);
  const localized = artistIsLocalized(artist, lang);

  return (
    <article>
      <JsonLd data={personJsonLd(view, settings, lang)} />
      <div className="shell story-hero">
        <div className="portrait-stage">
          <StudioImage src={view.photo} alt={view.photoAlt} sizes="(max-width: 860px) 100vw, 40vw" priority />
        </div>
        <div className="story">
          <p className="eyebrow">{view.styles.join(" · ")}</p>
          <h1>{view.name}</h1>
          <p className="lede">{localized ? view.blurb : copy.artistPage.untranslated}</p>
          <div className="actions">
            <Link className="btn" href={`/${lang}/book?artist=${encodeURIComponent(view.name)}`}>{copy.artistPage.request}</Link>
          </div>
          <p className="muted">{settings.phone} · {settings.phoneAlt} · {settings.email}</p>
        </div>
      </div>
      <div className="shell story">
        {localized ? <Paragraphs text={view.history} /> : null}
      </div>
      <section className="section" aria-labelledby="work-heading">
        <div className="shell">
          <h2 id="work-heading">{copy.artistPage.work}</h2>
          {view.portfolio.length ? (
            <div className="gallery">
              {view.portfolio.map((image) => (
                <figure key={image.id}>
                  <div className="frame plate-frame">
                    <StudioImage src={image.src} alt={image.alt} sizes="(max-width: 860px) 100vw, 50vw" />
                  </div>
                  {image.caption ? <figcaption>{image.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </article>
  );
}
