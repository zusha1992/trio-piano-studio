-- One-time: repoint seeded image rows from their local /public path to R2.
--   storage_key = the R2 object key (path without leading slash)
--   url         = same-origin /media/<key> route served by the Worker from R2
-- Guarded by the /images/ prefix so re-running is a no-op.
UPDATE images
SET storage_key = substr(url, 2),
    url = '/media' || url
WHERE url LIKE '/images/%';
