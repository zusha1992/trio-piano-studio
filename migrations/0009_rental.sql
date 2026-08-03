-- Rental inventory.
--
-- Rentals are pianos like any other, so they live in the same table behind a
-- `rental` flag rather than in a parallel schema: the detail page, photo
-- pipeline, option libraries and admin editor all keep working unchanged.
--  * /store  → rental = 0
--  * /rental → rental = 1
-- A rental listing carries no price (it depends on the client and the
-- occasion), so price_ils is left NULL on the seeded rows.

ALTER TABLE pianos ADD COLUMN rental INTEGER NOT NULL DEFAULT 0;

CREATE INDEX idx_pianos_rental ON pianos(rental, sort_order);

-- Seed the rental fleet by duplicating the first four shop pianos that are
-- published and not in restoration. Fresh rows (id prefixed `rental-`), so
-- editing or deleting one never touches the shop listing it came from.
INSERT INTO pianos (
  id, brand, model, type, serial, region, size, price_ils, color_hex,
  color_name_en, color_name_he, color_name_ar, color_name_ru,
  dim_width, dim_height, dim_depth,
  description_en, description_he, description_ar, description_ru,
  details_en, details_he, details_ar, details_ru,
  year, wip, sort_order, published, rental
)
SELECT
  'rental-' || id, brand, model, type, serial, region, size, NULL, color_hex,
  color_name_en, color_name_he, color_name_ar, color_name_ru,
  dim_width, dim_height, dim_depth,
  description_en, description_he, description_ar, description_ru,
  details_en, details_he, details_ar, details_ru,
  year, 0, sort_order, 1, 1
FROM pianos
WHERE rental = 0 AND wip = 0 AND published = 1
ORDER BY sort_order
LIMIT 4;

-- Point the copies at the same photos. The R2 objects are shared, so deleting
-- a rental piano must not delete an object another row still references — the
-- admin delete handler checks for that.
INSERT INTO images (entity_type, entity_id, storage_key, url, sort_order, alt_en, alt_he, alt_ar, alt_ru, width, height)
SELECT 'piano', 'rental-' || i.entity_id, i.storage_key, i.url, i.sort_order, i.alt_en, i.alt_he, i.alt_ar, i.alt_ru, i.width, i.height
FROM images i
JOIN pianos p ON p.id = 'rental-' || i.entity_id AND p.rental = 1
WHERE i.entity_type = 'piano';
