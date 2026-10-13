import { existsSync, statSync } from "fs";
import path from "path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Settings } from "@/lib/types";
import { localizeArtist } from "@/lib/content";
import { telHref } from "@/lib/format";
import { isLocale } from "@/lib/locale";
import { messages } from "@/lib/messages";
import { pageMetadata } from "@/lib/seo";
import { getStore, isGuest, publicArtist } from "@/lib/store";

type Props = { params: Promise<{ lang: string }> };

const homeArtists = ["vaso-vasiko", "andrei-aivazian"];

function welcomeVideoSrc(settings: Settings) {
  for (const candidate of [settings.welcomeVideo, settings.vasoHomeVideo]) {
    const value = (candidate ?? "").split("?")[0];
    const match = /^\/api\/media\/([\w.-]+\.mp4)$/.exec(value);
    if (!match) continue;
    const file = path.join(process.cwd(), "data", "uploads", match[1]);
    if (!existsSync(file)) continue;
    const fast = file.replace(/\.mp4$/, ".faststart.mp4");
    const played = fast !== file && existsSync(fast) && statSync(fast).mtimeMs >= statSync(file).mtimeMs ? fast : file;
    return `${value}?v=${Math.floor(statSync(played).mtimeMs)}`;
  }
  return "";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = messages[lang];
  const settings = getStore().settings;
  return pageMetadata({
    lang,
    title: copy.seo.homeTitle,
    absoluteTitle: `${settings.name} · ${copy.seo.homeTitle}`,
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
  const settings = store.settings;
  const welcomeVideo = welcomeVideoSrc(settings);
  const residents = store.artists
    .filter((artist) => !isGuest(artist) && homeArtists.includes(artist.slug))
    .map((artist) => localizeArtist(publicArtist(artist), lang))
    .sort((a, b) => homeArtists.indexOf(a.slug) - homeArtists.indexOf(b.slug));

  return (
    <>
      {welcomeVideo ? (
        <link rel="preload" as="video" href={welcomeVideo} fetchPriority="high" />
      ) : null}
      <section className={welcomeVideo ? "welcome-top entry-screen has-video" : "welcome-top entry-screen"}>
        {welcomeVideo ? (
          <video className="welcome-video" src={welcomeVideo} muted loop playsInline autoPlay preload="auto" aria-hidden="true" />
        ) : null}
        <a className="scroll-cue" href="#artists" aria-label={copy.home.artistsTitle}><span /></a>
      </section>

      <section className="home-lower home-artists" id="artists" aria-labelledby="artists-heading">
        <h2 className="home-legend" id="artists-heading">{copy.home.legend}</h2>
        <div className="home-artist-grid">
          {residents.map((artist) => (
            <article key={artist.id}>
              <h3>{artist.name}</h3>
              <p>{artist.slug === "vaso-vasiko" ? copy.home.vasoDeed : copy.home.andreiDeed}</p>
            </article>
          ))}
        </div>
        <p className="home-book">
          <Link className="btn" href={`/${lang}/book`}>{copy.nav.book}</Link>
        </p>
        <div className="home-facts">
          <div>
            <h2>{copy.footer.location}</h2>
            <p>
              {settings.googleBusinessUrl ? (
                <a href={settings.googleBusinessUrl}>{settings.address}</a>
              ) : settings.address}
            </p>
          </div>
          <div>
            <h2>{copy.footer.contact}</h2>
            <p><a href={telHref(settings.phone)}>{settings.phone}</a></p>
            {settings.phoneAlt ? <p><a href={telHref(settings.phoneAlt)}>{settings.phoneAlt}</a></p> : null}
            <p><a href={`mailto:${settings.email}`}>{settings.email}</a></p>
            <p className="home-social">
              <a href={settings.instagramUrl}>Instagram</a>
              <a href={settings.facebookUrl}>Facebook</a>
            </p>
          </div>
          <div>
            <h2>{copy.footer.hours}</h2>
            <ul>
              {settings.hours.map((entry) => (
                <li key={entry.day}>
                  <span>{copy.days[entry.day] || entry.day}</span>
                  <span>{/closed/i.test(entry.hours) ? copy.closed : entry.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
