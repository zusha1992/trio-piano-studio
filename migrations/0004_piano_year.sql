-- Year of manufacture for a piano (optional). Replaces the unused free-text
-- `size` field in the admin editor; shown as a spec on the detail page.
ALTER TABLE pianos ADD COLUMN year INTEGER;
