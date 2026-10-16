import Link from "next/link";
import { StudioImage } from "@/components/StudioImage";
import { eventStatus, formatRange } from "@/lib/format";
import type { Locale } from "@/lib/locale";
import type { Messages } from "@/lib/messages";
import type { StudioEvent } from "@/lib/types";

export function EventCard({
  event,
  lang,
  statusLabels,
  heading = "h2",
}: {
  event: StudioEvent;
  lang: Locale;
  statusLabels: Messages["status"];
  heading?: "h2" | "h3";
}) {
  const rawStatus = eventStatus(event);
  const status = rawStatus === "Upcoming" || rawStatus === "Past" || rawStatus === "Now" ? rawStatus : "Upcoming";
  const Title = heading;
  return (
    <article className="event-card">
      <div className="frame event-frame">
        <StudioImage src={event.image} alt={event.imageAlt} sizes="(max-width: 860px) 100vw, 280px" />
      </div>
      <div className="card-body">
        <div className="status-row">
          <span className="status">{statusLabels[status]}</span>
          {event.featured ? <span className="status">{statusLabels.featured}</span> : null}
        </div>
        <Title><Link href={`/${lang}/events/${event.slug}`}>{event.title}</Link></Title>
        <p>{formatRange(event.startDate, event.endDate, lang)}</p>
        {(event.guest || event.country) ? <p>{[event.guest, event.country].filter(Boolean).join(" · ")}</p> : null}
        <p>{event.description}</p>
      </div>
    </article>
  );
}
