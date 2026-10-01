import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventCard } from "@/components/EventCard";
import { SectionPrelude } from "@/components/SectionPrelude";
import { SocialLinks } from "@/components/SocialLinks";
import { StudioImage } from "@/components/StudioImage";
import { localizeArtist, localizeEvent, localizeSettings } from "@/lib/content";
import { eventStatus } from "@/lib/format";
import { isLocale } from "@/lib/locale";
import { messages } from "@/lib/messages";
import { pageMetadata } from "@/lib/seo";
import { getStore } from "@/lib/store";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { settings } = getStore();
  const copy = messages[lang];
  return pageMetadata({
    lang,
    title: settings.name,
    absoluteTitle: `${settings.name} · ${copy.seo.homeTitle}`,
    description: copy.seo.homeDescription,
    path: "/",
    image: "/art/hero-koi.jpg",
    imageAlt: copy.home.heroAlt,
  });
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = messages[lang];
  const { settings, artists, events } = getStore();
  const studio = localizeSettings(settings, lang);
  const featured = events
    .map((event) => localizeEvent(event, lang))
    .filter((event) => event.featured)
    .sort((a, b) => {
      const rank = (status: string) => (status === "Now" ? 0 : status === "Upcoming" ? 1 : 2);
      return rank(eventStatus(a)) - rank(eventStatus(b)) || b.startDate.localeCompare(a.startDate);
    });

  return (
    <>
      <section className="shell hero">
        <div className="hero-copy">
          <p className="eyebrow">{copy.nav.kicker}</p>
          <h1>{settings.name}</h1>
          <p className="lede">{studio.tagline}</p>
          <p>{copy.home.intro}</p>
          <p>{studio.heroLead}</p>
          <div className="actions">
            <Link className="btn" href={`/${lang}/book`}>{copy.nav.book}</Link>
            <Link className="btn btn-ghost" href={`/${lang}/artists`}>{copy.home.allArtists}</Link>
          </div>
          <SocialLinks settings={settings} portfolio={copy.footer.portfolio} newTab={copy.footer.newTab} />
        </div>
        <div className="hero-art frame">
          <StudioImage src="/art/hero-koi.jpg" alt={copy.home.heroAlt} sizes="(max-width: 860px) 100vw, 46vw" priority />
        </div>
      </section>

      <section className="section" aria-labelledby="events-heading">
        <div className="shell">
          <div className="section-head">
            <div>
              <p className="kicker" style={{ color: "var(--gold-2)" }}>{copy.home.eventsKicker}</p>
              <h2 id="events-heading">{copy.home.eventsTitle}</h2>
              <p>{copy.home.eventsLead}</p>
            </div>
            <Link className="btn btn-ghost" href={`/${lang}/events`}>{copy.home.allEvents}</Link>
          </div>
          <div className="event-list">
            {featured.map((event) => (
              <EventCard key={event.id} event={event} lang={lang} statusLabels={copy.status} heading="h3" />
            ))}
          </div>
        </div>
      </section>

      <SectionPrelude />

      <section className="section paper prelude-kicker">
        <div className="shell">
          <p className="kicker">{copy.home.artistsKicker}</p>
        </div>
      </section>

      <SectionPrelude />

      <section className="section paper prelude-heading" aria-labelledby="artists-heading">
        <div className="shell">
          <div className="section-head">
            <div>
              <h2 id="artists-heading">{copy.home.artistsTitle}</h2>
              <p>{copy.home.artistsLead}</p>
            </div>
            <Link className="btn btn-ink" href={`/${lang}/artists`}>{copy.home.allArtists}</Link>
          </div>
          <div className="artist-grid">
            {artists.map((artist) => {
              const view = localizeArtist(artist, lang);
              return (
                <Link className="artist-card" href={`/${lang}/artists/${artist.slug}`} key={artist.id}>
                  <div className="frame portrait-frame">
                    <StudioImage src={view.photo} alt={view.photoAlt} sizes="(max-width: 860px) 100vw, 340px" />
                  </div>
                  <div className="card-body">
                    <h3>{view.name}</h3>
                    <p>{view.blurb}</p>
                    <ul className="tags">{view.styles.map((style) => <li key={style}>{style}</li>)}</ul>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="visit-heading">
        <div className="shell split">
          <div>
            <p className="eyebrow">{copy.about.title}</p>
            <h2 id="visit-heading">{copy.home.visitTitle}</h2>
            <address>{settings.address}</address>
            <ul className="hours">
              {settings.hours.map((entry) => (
                <li key={entry.day}>
                  <span>{copy.days[entry.day] || entry.day}</span>
                  <span>{/closed/i.test(entry.hours) ? copy.closed : entry.hours}</span>
                </li>
              ))}
            </ul>
            <div className="actions">
              <Link className="btn" href={`/${lang}/about`}>{copy.nav.about}</Link>
              <Link className="btn btn-ghost" href={`/${lang}/book`}>{copy.nav.book}</Link>
            </div>
          </div>
          <div className="panel">
            <h3>{copy.home.online}</h3>
            <SocialLinks settings={settings} portfolio={copy.footer.portfolio} newTab={copy.footer.newTab} />
            <p>
              <a href={settings.googleBusinessUrl} target="_blank" rel="noopener noreferrer">
                {copy.home.listing}<span className="sr-only"> ({copy.footer.newTab})</span>
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
