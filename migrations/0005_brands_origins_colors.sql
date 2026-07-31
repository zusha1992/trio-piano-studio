-- Managed option libraries for the piano editor: brands (with a circular logo),
-- origins (with a circular flag), and finish colors (hex + localized name).
-- Pianos keep referencing brand by name, origin by id, and store their chosen
-- colour denormalized (hex + name) — these tables just drive the pickers and
-- the logo/flag shown on the detail page.

CREATE TABLE brands (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  logo_url   TEXT,
  logo_key   TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE origins (
  id         TEXT PRIMARY KEY,
  name_en    TEXT,
  name_he    TEXT,
  flag_url   TEXT,
  flag_key   TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE colors (
  id         TEXT PRIMARY KEY,
  hex        TEXT NOT NULL,
  name_en    TEXT,
  name_he    TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Seed brands from the icons already shipped in /public/images/shop/icons.
INSERT INTO brands (id, name, logo_url, sort_order) VALUES
  ('bluthner', 'Blüthner',        '/images/shop/icons/bluthner_icon.webp', 0),
  ('erard',    'Érard',           '/images/shop/icons/erard_icon.webp',    1),
  ('kawai',    'Kawai',           '/images/shop/icons/kawai_icon.webp',    2),
  ('steinway', 'Steinway & Sons', '/images/shop/icons/steinwey_icon.webp', 3),
  ('yamaha',   'Yamaha',          '/images/shop/icons/yamaha_icon.webp',   4);

INSERT INTO origins (id, name_en, name_he, flag_url, sort_order) VALUES
  ('japan',  'Japan',  'יפן',    '/images/shop/icons/japan_icon.webp', 0),
  ('europe', 'Europe', 'אירופה', '/images/shop/icons/eu_icon.webp',    1),
  ('usa',    'USA',    'ארה"ב',  '/images/shop/icons/usa_icon.webp',   2);

INSERT INTO colors (id, hex, name_en, name_he, sort_order) VALUES
  ('ebony-black',    '#1b1b1d', 'Ebony Black',    'שחור',       0),
  ('polished-black', '#0f0f10', 'Polished Black', 'שחור מלוטש', 1),
  ('mahogany',       '#5b2a14', 'Mahogany',       'מהגוני',     2),
  ('walnut',         '#6b4226', 'Walnut',         'אגוז',       3),
  ('oak',            '#8a5a2b', 'Oak',            'אלון',       4),
  ('rosewood',       '#7a3b2e', 'Rosewood',       'סיסם',       5),
  ('polar-white',    '#f4f1ea', 'Polar White',    'לבן',        6),
  ('silver-grey',    '#c9ccce', 'Silver Grey',    'אפור',       7);
