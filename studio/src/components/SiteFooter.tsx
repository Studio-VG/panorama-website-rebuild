import Link from "next/link";
import { telHref } from "@/lib/format";
import type { Locale } from "@/lib/locale";
import type { Messages } from "@/lib/messages";
import type { Settings } from "@/lib/types";

export function SiteFooter({ settings, lang, labels, days, closed }: {
  settings: Settings;
  lang: Locale;
  labels: Messages["footer"];
  days: Record<string, string>;
  closed: string;
}) {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="footer-title">{settings.name}</p>
          <p>{settings.tagline}</p>
          <address>{settings.address}</address>
          <p>
            <a href={settings.googleBusinessUrl} target="_blank" rel="noopener noreferrer">
              {labels.google}<span className="sr-only"> ({labels.newTab})</span>
            </a>
          </p>
        </div>
        <div>
          <p className="footer-title">{labels.hours}</p>
          <ul className="hours">
            {settings.hours.map((entry) => (
              <li key={entry.day}>
                <span>{days[entry.day] || entry.day}</span>
                <span>{/closed/i.test(entry.hours) ? closed : entry.hours}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="footer-title">{labels.reach}</p>
          <p><a href={telHref(settings.phone)}>{settings.phone}</a></p>
          {settings.phoneAlt ? <p><a href={telHref(settings.phoneAlt)}>{settings.phoneAlt}</a></p> : null}
          {settings.email ? <p><a href={`mailto:${settings.email}`}>{settings.email}</a></p> : null}
          <p><a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a></p>
          <p><a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer">Facebook</a></p>
          <p><a href={settings.portfolioUrl} target="_blank" rel="noopener noreferrer">{labels.portfolio}</a></p>
          <p><Link href={`/${lang}/aftercare`}>{labels.aftercare}</Link> · <Link href="/admin">{labels.admin}</Link></p>
        </div>
      </div>
      <div className="shell"><p className="fine">{labels.note}</p></div>
    </footer>
  );
}
