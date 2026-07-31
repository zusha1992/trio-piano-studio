-- Add an optional "artists" field to concerts (localized). Stored as free text
-- (e.g. a comma-separated list of performer names) per language.
ALTER TABLE concerts ADD COLUMN artists_en TEXT;
ALTER TABLE concerts ADD COLUMN artists_he TEXT;
ALTER TABLE concerts ADD COLUMN artists_ar TEXT;
ALTER TABLE concerts ADD COLUMN artists_ru TEXT;
