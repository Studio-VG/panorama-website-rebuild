import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventCard } from "@/components/EventCard";
import { localizeEvent } from "@/lib/content";
import { isLocale } from "@/lib/locale";
import { messages } from "@/lib/messages";
import { pageMetadata } from "@/lib/seo";
import { getStore } from "@/lib/store";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = messages[lang];
  return pageMetadata({
    lang,
    title: copy.seo.eventsTitle,
    description: copy.seo.eventsDescription,
    path: "/events",
    image: "/art/event-marmaris.jpg",
    imageAlt: copy.eventsPage.lead,
  });
}

export default async function EventsPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = messages[lang];
  const { events, settings } = getStore();
  const sorted = events.map((event) => localizeEvent(event, lang)).sort((a, b) => b.startDate.localeCompare(a.startDate));
  return (
    <section className="section">
      <div className="shell">
        <p className="eyebrow">{settings.name}</p>
        <h1>{copy.eventsPage.title}</h1>
        <p>{copy.eventsPage.lead}</p>
        <div className="event-list">
          {sorted.map((event) => <EventCard key={event.id} event={event} lang={lang} statusLabels={copy.status} />)}
        </div>
      </div>
    </section>
  );
}
