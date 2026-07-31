-- Trio Piano Studio — initial content schema (D1 / SQLite).
--
-- Conventions:
--  * Localized text uses four columns per field: _en, _he, _ar, _ru.
--    he/en are populated now; ar/ru stay NULL until Phase 7.
--  * Timestamps are ISO strings via datetime('now').
--  * Booleans are stored as INTEGER 0/1.
--  * All media lives in the shared `images` table (polymorphic).

PRAGMA foreign_keys = ON;

-- ── Pianos (shop inventory) ────────────────────────────────────────────────
CREATE TABLE pianos (
  id           TEXT PRIMARY KEY,
  brand        TEXT NOT NULL,
  model        TEXT NOT NULL DEFAULT '',
  type         TEXT NOT NULL CHECK (type IN ('grand', 'upright')),
  serial       TEXT,
  region       TEXT NOT NULL CHECK (region IN ('japan', 'europe', 'usa')),
  size         TEXT NOT NULL DEFAULT '',
  price_ils    INTEGER,                       -- NULL = "contact for price"
  color_hex    TEXT NOT NULL DEFAULT '#000000',
  color_name_en TEXT, color_name_he TEXT, color_name_ar TEXT, color_name_ru TEXT,
  dim_width    INTEGER, dim_height INTEGER, dim_depth INTEGER,
  description_en TEXT, description_he TEXT, description_ar TEXT, description_ru TEXT,
  details_en   TEXT, details_he TEXT, details_ar TEXT, details_ru TEXT,
  wip          INTEGER NOT NULL DEFAULT 0,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  published    INTEGER NOT NULL DEFAULT 1,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── Concerts ────────────────────────────────────────────────────────────────
CREATE TABLE concerts (
  id           TEXT PRIMARY KEY,
  name_en      TEXT, name_he TEXT, name_ar TEXT, name_ru TEXT,
  date         TEXT NOT NULL,                 -- ISO yyyy-mm-dd
  time         TEXT NOT NULL DEFAULT '',
  venue_en     TEXT, venue_he TEXT, venue_ar TEXT, venue_ru TEXT,
  price_ils    INTEGER NOT NULL DEFAULT 0,
  description_en TEXT, description_he TEXT, description_ar TEXT, description_ru TEXT,
  capacity     INTEGER,                       -- NULL = unlimited
  published    INTEGER NOT NULL DEFAULT 1,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── Workshop categories + services ──────────────────────────────────────────
CREATE TABLE workshop_categories (
  id           TEXT PRIMARY KEY,
  name_en      TEXT, name_he TEXT, name_ar TEXT, name_ru TEXT,
  description_en TEXT, description_he TEXT, description_ar TEXT, description_ru TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  published    INTEGER NOT NULL DEFAULT 1,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE workshop_services (
  id           TEXT PRIMARY KEY,
  category_id  TEXT NOT NULL REFERENCES workshop_categories(id) ON DELETE CASCADE,
  name_en      TEXT, name_he TEXT, name_ar TEXT, name_ru TEXT,
  description_en TEXT, description_he TEXT, description_ar TEXT, description_ru TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_services_category ON workshop_services(category_id, sort_order);

-- ── About page content ──────────────────────────────────────────────────────
CREATE TABLE about_sections (
  key          TEXT PRIMARY KEY,              -- 'studio', 'who'
  title_en     TEXT, title_he TEXT, title_ar TEXT, title_ru TEXT,
  body_en      TEXT, body_he TEXT, body_ar TEXT, body_ru TEXT,  -- JSON array of paragraphs
  sort_order   INTEGER NOT NULL DEFAULT 0,
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE founders (
  id           TEXT PRIMARY KEY,
  name_en      TEXT, name_he TEXT, name_ar TEXT, name_ru TEXT,
  bio_en       TEXT, bio_he TEXT, bio_ar TEXT, bio_ru TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── Shared media (polymorphic) ──────────────────────────────────────────────
-- entity_type: 'piano' | 'concert' | 'workshop_category' | 'founder'
--              | 'about_section' | 'gallery'
-- storage_key is the R2 object key (filled in Phase 4); until then images are
-- served from their existing local /public path stored in `url`.
CREATE TABLE images (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type  TEXT NOT NULL,
  entity_id    TEXT NOT NULL,
  storage_key  TEXT,
  url          TEXT NOT NULL,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  alt_en       TEXT, alt_he TEXT, alt_ar TEXT, alt_ru TEXT,
  width        INTEGER, height INTEGER,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_images_entity ON images(entity_type, entity_id, sort_order);

-- ── Concert registrations (for the later QR check-in flow) ───────────────────
CREATE TABLE registrations (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  concert_id   TEXT NOT NULL REFERENCES concerts(id) ON DELETE CASCADE,
  ticket_code  TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  phone        TEXT NOT NULL,
  email        TEXT NOT NULL,
  seats        INTEGER NOT NULL DEFAULT 1,
  checked_in   INTEGER NOT NULL DEFAULT 0,
  checked_in_at TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_registrations_concert ON registrations(concert_id);
