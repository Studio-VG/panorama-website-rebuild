import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/InquiryForm";
import { Paragraphs } from "@/components/Paragraphs";
import { SocialLinks } from "@/components/SocialLinks";
import { localizeSettings } from "@/lib/content";
import { telHref } from "@/lib/format";
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
    title: copy.seo.aboutTitle,
    description: copy.seo.aboutDescription,
    path: "/about",
  });
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = messages[lang];
  const { settings, artists, locations } = getStore();
  const residents = artists.filter((artist) => !isGuest(artist)).map(publicArtist);
  const istanbul = locations.find((place) => /istanbul|beyoğlu|beyoglu/i.test(`${place.name} ${place.address}`));
  const studio = localizeSettings(settings, lang);
  return (
    <section className="section about-page">
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
            <p>{copy.home.facts}</p>
          </div>
          <div className="reach-card">
            <h2>{copy.about.reach} {settings.name}</h2>
            <ul className="contact-list">
              <li><span>{copy.about.address}</span><span>{istanbul?.address || settings.address}</span></li>
              <li><span>{copy.about.phone}</span><a href={telHref(settings.phone)}>{settings.phone}</a></li>
              {settings.phoneAlt ? <li><span>{copy.about.also}</span><a href={telHref(settings.phoneAlt)}>{settings.phoneAlt}</a></li> : null}
              {settings.email ? <li><span>{copy.about.email}</span><a href={`mailto:${settings.email}`}>{settings.email}</a></li> : null}
              {settings.whatsappUrl ? <li><span>{copy.about.whatsapp}</span><a href={settings.whatsappUrl}>{copy.about.whatsapp}</a></li> : null}
            </ul>
            <SocialLinks settings={settings} newTab={copy.footer.newTab} />
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
        <div className="about-form">
          <InquiryForm artists={residents} labels={copy.form} />
        </div>
      </div>
    </section>
  );
}
