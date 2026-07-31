-- Lightweight first-party analytics stored in D1 (no third party, no cookies
-- beyond a random session id kept client-side). One row per visit session plus
-- an event log. Admin-only aggregation reads from these.

CREATE TABLE analytics_sessions (
  id          TEXT PRIMARY KEY,      -- random id generated + persisted client-side
  first_seen  TEXT NOT NULL DEFAULT (datetime('now')),
  last_seen   TEXT NOT NULL DEFAULT (datetime('now')),
  day         TEXT NOT NULL,         -- date(first_seen) for entrances-per-day
  device      TEXT,                  -- 'mobile' | 'desktop' (from user-agent)
  entry_path  TEXT,
  -- Language the visitor ended on. We only care about the exit language because
  -- everyone starts on the default locale and may switch by mistake.
  last_locale TEXT
);
CREATE INDEX idx_sessions_day ON analytics_sessions(day);

CREATE TABLE analytics_events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  ts         TEXT NOT NULL DEFAULT (datetime('now')),
  day        TEXT NOT NULL,
  type       TEXT NOT NULL,          -- 'pageview' | 'click'
  name       TEXT,                   -- click target (whatsapp/email/…) or null
  path       TEXT,
  locale     TEXT
);
CREATE INDEX idx_events_day ON analytics_events(day);
CREATE INDEX idx_events_type ON analytics_events(type);
