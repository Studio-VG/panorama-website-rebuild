import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/InquiryForm";
import { Paragraphs } from "@/components/Paragraphs";
import { SocialLinks } from "@/components/SocialLinks";
import { StudioMap } from "@/components/StudioMap";
import { localizeSettings } from "@/lib/content";
import { telHref } from "@/lib/format";
import { isLocale } from "@/lib/locale";
import { messages } from "@/lib/messages";
import { pageMetadata } from "@/lib/seo";
import { getStore } from "@/lib/store";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = messages[lang];
  const { settings } = getStore();
  return pageMetadata({
    lang,
    title: copy.seo.aboutTitle,
    description: `${copy.seo.aboutDescription} ${settings.address}`,
    path: "/about",
  });
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = messages[lang];
  const { settings, artists } = getStore();
  const studio = localizeSettings(settings, lang);
  return (
    <section className="section paper">
      <div className="shell">
        <p className="kicker">{settings.name}</p>
        <h1>{copy.about.title}</h1>
        <div className="split">
          <div>
            <Paragraphs text={studio.about} />
            {settings.officialName ? (
              <p className="note">
                {copy.about.publicName}: {settings.officialName}. {studio.officialNameNote}
              </p>
            ) : null}
            <p>
              <a href={settings.portfolioUrl} target="_blank" rel="noopener noreferrer">
                {copy.about.portfolio}<span className="sr-only"> ({copy.footer.newTab})</span>
              </a>
            </p>
          </div>
          <div className="panel">
            <h2>{copy.about.reach} {settings.name}</h2>
            <ul className="contact-list">
              <li><span>{copy.about.address}</span><span>{settings.address}</span></li>
              <li><span>{copy.about.phone}</span><a href={telHref(settings.phone)}>{settings.phone}</a></li>
              {settings.phoneAlt ? <li><span>{copy.about.also}</span><a href={telHref(settings.phoneAlt)}>{settings.phoneAlt}</a></li> : null}
              {settings.email ? <li><span>{copy.about.email}</span><a href={`mailto:${settings.email}`}>{settings.email}</a></li> : null}
              {settings.whatsappUrl ? <li><span>{copy.about.whatsapp}</span><a href={settings.whatsappUrl}>{copy.about.whatsapp}</a></li> : null}
            </ul>
            <SocialLinks settings={settings} portfolio={copy.footer.portfolio} newTab={copy.footer.newTab} />
            <h3>{copy.about.hours}</h3>
            <ul className="hours">
              {settings.hours.map((entry) => (
                <li key={entry.day}>
                  <span>{copy.days[entry.day] || entry.day}</span>
                  <span>{/closed/i.test(entry.hours) ? copy.closed : entry.hours}</span>
                </li>
              ))}
            </ul>
            <p><Link href={`/${lang}/book`}>{copy.about.booking}</Link></p>
          </div>
        </div>
        <div className="split" style={{ marginTop: "1.5rem" }}>
          <StudioMap address={settings.address} />
          <div>
            <InquiryForm artists={artists} labels={copy.form} />
          </div>
        </div>
      </div>
    </section>
  );
}
