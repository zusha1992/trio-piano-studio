# Trio Piano Studio — Roadmap (next phase)

Planning doc for connecting the site to a backend and going live. Not started
yet. Order is roughly dependency-first; each phase has checkable tasks.

## Decisions (locked)

- **Payments:** none. Concert registration is a free reservation only (the price
  shown is informational).
- **Consent / privacy page:** none. Registration is a deliberate, user-initiated
  action.
- **Staging environment:** none — work against a single Supabase project.
- **Backups / data export:** none (beyond the admin's ability to export the
  registrations list).

## Open questions to resolve first

- **Registrant email:** no domain needed either way. Options: (a) **EmailJS**
  client-side with a second template to the registrant (works today, no backend);
  (b) **Nodemailer + Gmail SMTP** (App Password) server-side, sending from
  `trio.piano.studio@gmail.com` with the QR attached — this is exactly what
  `baroque_concerts_registration` does (`app/api/register/route.ts`).
  Recommended: **(b) Gmail SMTP**, since the concerts flow moves server-side
  anyway for capacity/registrations. _(pending)_
- **DB-only vs local fallback:** go fully DB-driven (cleaner) vs keep a minimal
  hardcoded fallback for resilience. Leaning **fully DB-driven** (ISR makes an
  outage unlikely to be visible). _(pending)_

---

## Phase 1 — Infrastructure: Supabase (DB + storage)

- [ ] Create Supabase project; add keys to Cloudflare/local env (no keys in client bundle).
- [ ] Design schema: `pianos`, `concerts`, `registrations`, `workshop_categories`,
      `workshop_services`, and per-entity `images` (with ordering + alt text).
- [ ] Localized text columns for **4 languages** (en/he/ar/ru) on all content tables.
- [ ] Row Level Security: public = read-only, admin = full write.
- [ ] One-time seed script migrating current hardcoded data
      (`shopItems.ts`, `workshopServices.ts`, `concerts.ts`) into the DB.

## Phase 2 — Admin auth

- [ ] Use **Supabase Auth** (email + password) for admins — never hardcode creds
      in the client.
- [ ] Entry point: long-press the top-toolbar logo → login modal.
- [ ] Authenticated admin session; all writes authorized server-side via RLS.

## Phase 3 — Admin controls

- [ ] Content CRUD: add/edit/remove **pianos** and **concerts**.
- [ ] Workshop CRUD: categories + their **services**, with descriptions.
- [ ] Gallery management: add / delete / reorder images per piano, concert, and
      workshop category.
- [ ] Registrations dashboard: live count + exportable attendee list.
- [ ] Door check-in: **QR scanner** page that validates tickets, prevents
      reuse/duplicates, and marks attendees checked-in
      (ref: `baroque-concerts-registration`).
- [ ] Concert **capacity / sold-out / waitlist**; server-side guard against
      double-booking.
- [ ] Admin UX safeguards: confirm-on-delete, draft/publish state, image
      drag-reorder, simple audit log.

## Phase 4 — Image storage pipeline

- [ ] Supabase Storage buckets for uploaded media.
- [ ] On-upload resize + WebP conversion (keep the perf gains from the cleanup).
- [ ] `next.config` `images.remotePatterns` for the Storage domain; serve via
      `next/image` + Storage CDN.

## Phase 5 — Email (registrant confirmation)

- [ ] Choose EmailJS (client) vs Nodemailer + Gmail SMTP (server) — see open
      questions. No domain required for either.
- [ ] If Gmail SMTP: create a Gmail **App Password** for
      `trio.piano.studio@gmail.com`; store as server env vars
      (`GMAIL_USER`, `GMAIL_APP_PASSWORD`).
- [ ] Send confirmation with the **ticket / QR** to the registrant after signup
      (Trio mailbox still notified), sent from the Trio Gmail address.

## Phase 6 — Domain + Cloudflare

- [ ] Purchase domain.
- [ ] Connect to Cloudflare: DNS, HTTPS, `www` → apex redirect, custom domain on the Worker.
- [ ] Move all secrets (email keys, admin password) into Cloudflare Worker secrets/vars.

## Phase 7 — i18n expansion (Arabic + Russian)

- [ ] Add **Arabic** (RTL — reuse the existing Hebrew RTL handling) and
      **Russian** (LTR).
- [ ] Fonts: Arabic-capable face for AR; verify (or add) Cyrillic coverage for RU.
- [ ] Replace the he/en toggle with a **language dropdown** (preserve current path
      on switch, like today).
- [ ] Translate message JSON + all DB content fields to 4 locales.
- [ ] SEO: per-locale metadata, `hreflang`, sitemap, robots, OpenGraph image.

## Phase 8 — Performance (verify DB/storage don't slow the site)

- [ ] Public pages: **static generation + ISR (revalidate)** so visitors read
      cached HTML, not per-request DB queries.
- [ ] Images via Storage CDN + `next/image`.
- [ ] Measure (Lighthouse / Cloudflare Web Analytics) before vs after; tune caching if
      any regression.

## Phase 9 — Hardening

- [ ] Spam protection (honeypot / captcha) on contact + registration forms.
- [ ] Error monitoring (Sentry).
- [ ] Traffic analytics (Cloudflare Web Analytics / Plausible) — separate from admin
      signup counts.

## Phase 10 — Post-migration cleanup (do last, after DB verified live)

- [ ] Remove hardcoded data arrays from `src/data/*` (keep the TS types).
- [ ] Delete local images now served from Storage; keep repo-static assets
      (logo, `icon.png`, brand/origin icons, size illustrations, contact SVGs).
- [ ] Remove obsolete code paths (hero image preload list, "reuse neighbouring
      pianos" placeholder galleries, local-only `next.config` bits).
- [ ] Re-run the audit: unused imports, dead assets, `tsc --noUnusedLocals`,
      `next build`; update `GAPS.md`.
- [ ] Only remove each local fallback once its DB-backed equivalent is confirmed.
