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
- [ ] Replace placeholder item data (brand, model, size, type, region) with real data — see `src/data/shopItems.ts`.
- [ ] Also sell non-piano items: chairs/benches and "life saver" devices (to be added later). Likely a small separate "Extras" / "Accessories" category alongside the pianos, with one image for a chair and one for the life-saver device.
