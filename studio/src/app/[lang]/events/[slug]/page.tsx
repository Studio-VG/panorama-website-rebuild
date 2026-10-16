import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventCard } from "@/components/EventCard";
import { JsonLd } from "@/components/JsonLd";
import { StudioImage } from "@/components/StudioImage";
import { eventIsLocalized, localizeEvent } from "@/lib/content";
import { eventStatus, formatRange, telHref } from "@/lib/format";
import { isLocale } from "@/lib/locale";
import { messages } from "@/lib/messages";
import { eventJsonLd, istanbulAddress, pageMetadata } from "@/lib/seo";
import { getStore } from "@/lib/store";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const { events } = getStore();
  const event = events.find((item) => item.slug === slug);
  if (!event) return { title: messages[lang].nav.events };
  const view = localizeEvent(event, lang);
  const localized = eventIsLocalized(event, lang);
  return pageMetadata({
    lang,
    title: view.title,
    description: localized ? view.seoDescription : view.title,
    path: `/events/${event.slug}`,
    image: event.image,
    imageAlt: view.imageAlt,
  });
}

export default async function EventPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const copy = messages[lang];
  const { settings, events, locations } = getStore();
  const event = events.find((item) => item.slug === slug);
  if (!event) notFound();
  const view = localizeEvent(event, lang);
  const localized = eventIsLocalized(event, lang);
  const others = events.filter((item) => item.id !== event.id).map((item) => localizeEvent(item, lang));
  const status = eventStatus(event);
  const statusLabel = status === "Upcoming" || status === "Past" || status === "Now" ? copy.status[status] : status;

  return (
    <article>
      <JsonLd data={await eventJsonLd(view, settings, lang)} />
      <div className="shell portfolio-hero">
        <div className="frame portrait-frame">
          <StudioImage src={view.image} alt={view.imageAlt} sizes="(max-width: 860px) 100vw, 320px" priority />
        </div>
        <div>
          <p className="eyebrow">{statusLabel}</p>
          <h1>{view.title}</h1>
          <p className="lede">{formatRange(view.startDate, view.endDate, lang)}</p>
          {(view.guest || view.country) ? <p>{[view.guest, view.country].filter(Boolean).join(" · ")}</p> : null}
          <p>{localized ? view.description : copy.eventPage.untranslated}</p>
          <p>
            {settings.name} · <a href={telHref(settings.phone)}>{settings.phone}</a>
          </p>
          <address>{istanbulAddress(settings, locations)}</address>
          <div className="actions">
            <Link className="btn" href={`/${lang}/book`}>{copy.eventPage.request}</Link>
            <Link className="btn btn-ghost" href={`/${lang}/events`}>{copy.eventPage.all}</Link>
          </div>
        </div>
      </div>
      {others.length ? (
        <section className="section" aria-labelledby="more-events">
          <div className="shell">
            <h2 id="more-events">{copy.eventPage.other}</h2>
            <div className="event-list">
              {others.map((item) => <EventCard key={item.id} event={item} lang={lang} statusLabels={copy.status} heading="h3" />)}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
