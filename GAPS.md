# Open Gaps / To Close Before Launch

Running list of placeholders and pending approvals so nothing slips through.
Check items off as they're resolved.

## About page (`/about`)
- [ ] Replace Noam's photo (`public/images/About/Noam.jpg`) — current one is a temporary headshot.
- [ ] Replace the Studio banner photo (`public/images/About/about-trio.jpg`) — placeholder.
- [ ] Get approval on the copy for "The Studio" and "Who We Are" sections (EN + HE).

## Home / landing page
- [ ] Provide final photos for all categories (About, The Workshop, The Store, Concerts).

## Workshop page (`/services` + category pages)
- [ ] Get approval on the category descriptions and the suggested fixes (name + one-liner) for every category (EN + HE) — see `src/data/workshopServices.ts`.
- [ ] Provide real photos for each category. Currently every category reuses the same 8 generated images (mixed across categories to demo the gallery/carousel); replace with real per-category photography via the `image` / `images` fields in `src/data/workshopServices.ts`.

## Shop / store page (`/store`)
- [ ] Replace example piano photos with real product photography.
- [ ] Replace placeholder item data (brand, model, size, type, region, color, dimensions, description) with real data — see `src/data/shopItems.ts`.
- [ ] Per-piano galleries: each piano currently reuses neighbouring pianos' photos in its carousel — add real per-item `images` in `src/data/shopItems.ts`.
- [ ] Replace the size illustrations (`public/images/shop/Grand.png` / `Upright.png`) with clean versions that have no printed `XXcm` placeholders; the width/height/depth values are overlaid in code (positions in `DIM_POS` in `store/[id]/page.tsx`).
- [ ] Also sell non-piano items: chairs/benches and "life saver" devices (to be added later). Likely a small separate "Extras" / "Accessories" category alongside the pianos, with one image for a chair and one for the life-saver device.

## Concerts page (`/concerts`)
- [ ] Approve concert data (names, dates, times, venue, prices) — placeholder in `src/data/concerts.ts`.
- [ ] Approve the "How registration works" notes (EN + HE) in `messages/*.json` under `concerts` — currently adapted from the Baroque bar copy (mentions of seat counts / drinks may not fit Trio).
- [ ] Registration email currently reuses the contact EmailJS template (`template_8ozp076`) and sends to `trio.piano.studio@gmail.com`. Consider a dedicated template with a proper subject/layout, and confirm the recipient mailbox.
- [ ] Barcode is a QR of a client-generated ticket ID (no backend). If real ticketing/capacity/waitlist is needed, add a backend (the Baroque app uses Supabase + Nodemailer).
- [ ] Replace poster/gallery images with final assets if needed (`public/images/Concerts/`).
