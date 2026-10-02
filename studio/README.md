# ByVasoVasiko studio site

Japanese-tattoo studio site for the practice publicly listed as **Vaso Vasiko** / **byvasovasiko**. The name shown on this site is the temporary name **ByVasoVasiko**.

This app lives in `studio/` because the repository root is the existing Panorama glass site. Nothing in that site was replaced.

## Run it

From this directory:

```bash
cd studio
npm install
npm run dev
```

Open http://localhost:3001

```bash
npm run build
npm run start
```

## Demo admin

- URL: http://localhost:3001/admin
- Password: `byvaso-demo`

Set `ADMIN_PASSWORD` before any public deployment. See `.env.example`. When the variable is unset, the app uses this same demo password so a local preview works without copying the env file. Do not use the demo password in production.

## Where the name, tagline, and contact details live

They are not copied into the pages. Every page reads `data/store.json`.

Change them in **Admin → Studio settings** (name, tagline, official-name note, address, phones, email, hours, map coordinates, Google Business link, Instagram, Facebook, portfolio link, logo, and the about story). Saving writes `data/store.json`, which survives a server restart. Uploaded photos are stored in `data/uploads/`.

The public listing name **Vaso Vasiko** is stored as `officialName`, with a note in `officialNameNote`. It is not used as the site title.

## What was pulled from the public listing

- Google Business link resolved to **byvasovasiko**, a tattoo parlor in Asmalı Mescit: rating 4.7 from 22 reviews, phone **+90 533 203 67 40**, coordinates 41.029831, 28.975299, hours Monday–Saturday 10:00–20:00, Sunday closed.
- Address used everywhere: **Asmalı Mescit Mahallesi, İstiklal Cd. No:164, 34430 Beyoğlu/İstanbul, Türkiye**.
- Existing site https://www.vasovasiko.com/ : name Vaso Vasiko, email termin@vasovasiko.com, a second phone +49 163 787 99 67, biography of Vasil Kurakhchishvili, and portfolio captions (koi, tiger, samurai and snake, flowers, stork, hannya, fu dog, dragon).
- Logo file from https://www.vasovasiko.com/img/logo3.png (about 200×199, grey monogram). It is the header mark. It is small; replace it from Studio settings if you have a larger file.
- Instagram https://www.instagram.com/vasovasiko/ and Facebook https://www.facebook.com/vasovasiko are linked from the home page, the about page, and the footer. The existing portfolio is linked from those places and from Vaso Vasiko’s portfolio page.
- Marmaris Tattoo Festival (also written Marmari; the partners page calls it Marmaris Tattoo Convention). Last announced edition: 3–5 October 2025, Green Nature Diamond Hotel. No 2026 date was published.
- News posts on the existing site (`tattoo conventions` and `Actions for 2025`) had no real copy (placeholder or empty), and the portfolio site does not list a multi-artist roster. Fahriye Kayıhan and Ahmet (Mr Amo) are named in public Google reviews and are seeded so the roster can be edited. Guest spots are sample entries for the same reason.
- Portraits and design plates are original illustrations made for this site, not photographs of the artists or of their tattoos.

## Languages

Public pages are served at `/en`, `/tr`, `/de`, and `/ru`. The language switcher stays on the same page and stores the choice in the `studio_lang` cookie. That cookie is set only from the switcher. A later visit to `/` follows the cookie.

On a first visit, with no cookie, the site picks a language from the country:

- Turkey (`TR`) → Turkish
- Russia (`RU`) → Russian
- Germany (`DE`) → German
- Every other country, including Austria, and any failed or missing lookup → English

Platform headers `x-vercel-ip-country` and `cf-ipcountry` are used when present. In production, if neither header is set, the server asks geojs.io for the country code and does not log the IP. Local development with no country header stays on English and does not call the lookup. Known crawlers (Googlebot and the usual search bots) are not redirected by country. A crawler that opens `/` is sent to English. A crawler that opens `/tr`, `/de`, or `/ru` stays on that URL.

Admin stays in English at `/admin`.

English copy for artists, events, and the about text is what you edit in admin (`data/store.json`). Turkish, German, and Russian for the seeded records live in `src/lib/content.ts` and `src/lib/messages.ts`. A record you add in admin appears in the other languages with a short “not translated yet” line until a translation is added there.

## Search phrases

Each public page has one primary phrase in the title, with related phrases in the visible copy. English pages stay in English; Turkish pages stay in Turkish. German and Russian use the same intent in those languages.

- Home: tattoo studio Istanbul / İstanbul dövme stüdyosu
- Artists: tattoo shop Beyoğlu / Beyoğlu dövme
- About: Istiklal Street tattoo / İstiklal dövme
- Booking: tattoo appointment Beyoğlu / dövme randevu Beyoğlu
- Styles: Japanese tattoo Istanbul / Japon dövmesi
- Vaso: irezumi
- Fahriye: Japanese florals and peony / şakayık
- Ahmet: blackwork and black and grey
- Events: guest tattoo artist Istanbul / misafir dövme sanatçısı
- Marmaris event: Marmari Tattoo Festival / Marmari dövme festivali
