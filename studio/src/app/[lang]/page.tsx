import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StudioImage } from "@/components/StudioImage";
import { localizeArtist, localizeSettings } from "@/lib/content";
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
    title: copy.seo.homeTitle,
    absoluteTitle: `${copy.seo.homeTitle} · ByVasoVasiko`,
    description: copy.seo.homeDescription,
    path: "/",
    image: "/art/hero-back.jpg",
    imageAlt: copy.home.heroAlt,
  });
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = messages[lang];
  const store = getStore();
  const settings = localizeSettings(store.settings, lang);
  const residents = store.artists.filter((artist) => !isGuest(artist)).map((artist) => localizeArtist(publicArtist(artist), lang));
  const guests = store.artists.filter(isGuest).map((artist) => localizeArtist(publicArtist(artist), lang));

  return (
    <>
      <section className="shell salon-hero">
        <p className="eyebrow">{settings.name} · {copy.nav.kicker}</p>
        <h1>{residents[0]?.name}{residents[1] ? <> <span>&amp; {residents[1].name}</span></> : null}</h1>
        <p className="lede">{copy.home.intro}</p>
        <div className="actions">
          <Link className="btn" href={`/${lang}/artists/${residents[0]?.slug || "vaso-vasiko"}`}>Vaso Vasiko</Link>
          <Link className="btn btn-ghost" href={`/${lang}/artists/${residents[1]?.slug || "andrei-aivazian"}`}>Andrei Aivazian</Link>
        </div>
      </section>
      <section className="shell artist-spread" aria-label={copy.nav.artists}>
        {residents.map((artist) => (
          <article className="artist-feature" key={artist.id}>
            <div className="portrait-stage">
              <StudioImage src={artist.photo} alt={artist.photoAlt} sizes="(max-width: 860px) 100vw, 50vw" priority />
            </div>
            <p className="role">{artist.styles.slice(0, 3).join(" · ")}</p>
            <h2>{artist.name}</h2>
            <p>{artist.blurb}</p>
            <Link className="btn btn-ghost" href={`/${lang}/artists/${artist.slug}`}>{copy.artistPage.work}</Link>
          </article>
        ))}
      </section>
      <section className="guest-band">
        <div className="shell">
          <p className="eyebrow">{copy.nav.guests}</p>
          <h2>{copy.nav.guests}</h2>
          <p className="muted">{copy.salon.guestLead}</p>
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
      <section className="shell book-band">
        <div>
          <p className="eyebrow">{copy.nav.book}</p>
          <h2>{copy.book.title}</h2>
          <p>{copy.book.lead}</p>
          <p>{copy.salon.bookNote}</p>
          <Link className="btn" href={`/${lang}/book`}>{copy.nav.book}</Link>
        </div>
        <ul className="fact-list">
          <li><span>Istanbul</span><span>İstiklal Avenue</span></li>
          <li><span>Tbilisi</span><span>Andrei Aivazian</span></li>
          <li><span>{copy.about.hours}</span><span>{copy.salon.hoursLine}</span></li>
        </ul>
      </section>
    </>
  );
}
