-- Tracks localized fields whose value was set/edited by hand for a specific
-- language, so auto-translation from the Hebrew source never overwrites a
-- manual translation. `column_name` is the full localized column, e.g.
-- 'description_en'.
CREATE TABLE translation_overrides (
  entity      TEXT NOT NULL,
  entity_id   TEXT NOT NULL,
  column_name TEXT NOT NULL,
  updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (entity, entity_id, column_name)
);
