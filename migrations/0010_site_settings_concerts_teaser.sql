-- Site-wide key/value settings, plus the editable "coming soon" teaser copy for
-- the concerts page.
--
--  * site_settings: simple KV store for site-level flags. `concerts_coming_soon`
--    ('1' | '0') decides whether the public concerts page shows the teaser
--    instead of the concert list. On now, flipped off once the first concert is
--    scheduled.
--  * The teaser paragraph reuses the about_sections table (key
--    'concerts_teaser') so it flows through the existing inline editor and
--    auto-translation pipeline. Only he/en are seeded; ar/ru are backfilled via
--    the admin "Translate" action.

CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO site_settings (key, value) VALUES ('concerts_coming_soon', '1');

INSERT OR IGNORE INTO about_sections (key, sort_order, body_he, body_en) VALUES (
  'concerts_teaser',
  100,
  '["אנחנו מתכננים להביא אלינו פסנתרנים מהארץ ומרחבי העולם להופעות אינטימיות בתוך בית המלאכה, בין הפסנתרים. התוכנייה המלאה תפורסם כאן בקרוב."]',
  '["We are planning to bring outstanding pianists from Israel and around the world for intimate concerts inside the workshop, among the pianos. The full programme will be announced here soon."]'
);
