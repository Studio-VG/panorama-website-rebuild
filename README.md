# Panorama — Architectural Glass & Aluminum Systems

Rebuilt full-stack site for Panorama (Tbilisi, Georgia). Same stack as the
original AI Studio build — Vite + React 19 + TypeScript + Tailwind v4 +
Express/Bun, trilingual (ka/en/ru) — so it drops back into the same
deployment (Cloud Run) without changes to the hosting setup.

## Run it

```bash
bun install       # or: npm install
bun run dev        # or: npm run dev   → http://localhost:3000
bun run build       # or: npm run build
bun run start       # or: npm run start
```

## What was actually wrong, and what changed

The original project had almost everything already built — it just wasn't
wired together. Six full sections existed in code, fully translated in all
three languages, and were simply never rendered:

- **`App.tsx` only rendered 5 of 11 built sections.** Engineering,
  CostCalculator, ProjectsSection, ShowroomSection, TestimonialsAndFAQ, and
  the product detail modal were fully coded and translated but never
  mounted on the page. All are now restored, in this order: Hero → Systems
  → Engineering → Calculator → Projects → TikTok showcase → Showroom →
  Partners → Testimonials/FAQ → Contact.

- **Two disconnected catalog data models.** `ProductSystem` (rich schema,
  but empty placeholder data and identical fake pricing for every item) and
  `ListingItem` (the one actually shown, with the real Georgian copy) never
  talked to each other. They're now one model — `SystemListing` in
  `src/types.ts`, populated in `src/data/catalog.ts` — so the catalog
  cards, the description modal, the cost calculator, and the footer links
  all read the same data.

- **No actual contact form.** `ContactSection` showed phone/WhatsApp/email
  cards but had no `<form>`, even though the translation keys and the
  `/api/contact` backend endpoint already existed. `ContactSection.tsx` now
  has a real form wired to that endpoint, and it accepts hand-offs from
  other sections — using the calculator, requesting a project, or booking a
  showroom visit all pre-fill this form instead of dead-ending.

- **Recurring photo loss — root cause and fix.** The repeatedly-reported
  bug where uploaded photos vanished over time had two causes:
  1. `server.ts` wrote uploaded images to the server's local filesystem
     (`user_data/`, `public/user-listings/`), which most hosts (including a
     typical Cloud Run setup) wipe on every redeploy.
  2. `SocialMediaShowcase.tsx` had a live, **public, unauthenticated**
     "change photo" button on every TikTok card that posted straight to
     `/api/upload-image` — any site visitor could overwrite it, not just
     accidentally lose it.

  Fix: the six listing photos and three TikTok stills are now committed
  as static files under `/public` (`public/user-listings/slot-1.jpg`
  through `slot-6.jpg`, `public/tiktok/video-1.jpg` through `video-3.jpg`),
  so they ship with the code and survive every redeploy regardless of
  server storage. The public upload button is removed entirely. The
  server-side upload/edit endpoints still exist for convenience but now
  require an admin key (see below) — no longer reachable by a random
  visitor.

- **Contact leads were lost on every restart.** Inquiries were kept in an
  in-memory array only (seeded with two fake demo entries). They now
  persist to `user_data/inquiries.json` on disk, and you can optionally
  set `INQUIRY_WEBHOOK_URL` to get each new inquiry POSTed to a
  Slack/Zapier/Make webhook as JSON, since no real email/CRM credentials
  were available to wire up directly.

## Design direction

Recolored off the generic blue/slate SaaS palette to materials the company
actually works with: a brass/bronze accent anchored on the site's existing
gold (#C29B38), and an anthracite dark neutral matching the RAL 7016
"Anthracite Matt" profile finish mentioned in your own project specs,
instead of a generic near-black. Typography is Noto Serif Georgian for
headings (paired with Plus Jakarta Sans body text and JetBrains Mono for
specs/numbers) instead of the default sans-only stack. The Hero has a
one-time load animation — three vertical panels slide open like one of
your own sliding systems — and a subtle hairline "mullion grid" texture
recurs as a structural motif instead of soft gradient blobs. All of this
respects `prefers-reduced-motion`.

## Needs your input before this goes live

1. **Pricing in `src/data/catalog.ts`** (`startingPricePerM2`) is a
   realistic, internally-consistent placeholder set — cheapest for insect
   screens, dearest for structural glazing — not your verified price list.
   Each entry is commented; swap in real numbers whenever you have them.
2. **Engineering specs** in the same file (Uw, Rw, wind class, etc.) are
   realistic placeholders in the style of your own project specs, not
   certified datasheet numbers from your fabricator.
3. **Project case-study photos** (`src/data/projects.ts`) and the
   fabrication-plant photo in `EngineeringSection.tsx` are stock imagery —
   no real job-site or factory photos were available. The project copy,
   specs, and architect credits are real; only the photography is a
   placeholder. Swap in real photos when you have them, since presenting
   stock photos as documentary project photos isn't something to leave
   long-term.
4. **`ADMIN_API_KEY`** — set this environment variable to enable the
   admin-only endpoints (`POST /api/listings`, `POST /api/tiktok`,
   `POST /api/upload-image`, `GET /api/inquiries`). Without it, those
   routes return 503 and are effectively disabled. Send it as an
   `x-admin-key` header. Example, updating one listing's photo:
   ```bash
   curl -X POST https://your-site/api/upload-image \
     -H "x-admin-key: YOUR_KEY" -H "Content-Type: application/json" \
     -d '{"targetSlot": 1, "base64": "data:image/jpeg;base64,..."}'
   ```
   For anything longer-term, editing the files in `/public` directly and
   redeploying is simpler and doesn't depend on the key at all.
5. **`INQUIRY_WEBHOOK_URL`** (optional) — a URL that receives a POST with
   the full inquiry JSON every time someone submits the contact form.
   Works with a Slack incoming webhook, Zapier/Make catch hook, etc.

See `.env.example` for both variables.
