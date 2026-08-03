// D1-backed content layer.
//
// Each function reads from the `env.DB` D1 database and maps rows into the same
// shapes the UI already uses (ShopItem, Concert, WorkshopCategory, …), pulling
// related media from the shared `images` table. he/en are populated today; the
// ar/ru columns are read too and fall back to en so the UI keeps working as we
// add languages.

import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { ShopItem } from '@/data/shopItems';
import type { Concert } from '@/data/concerts';
import type { WorkshopCategory } from '@/data/workshopServices';

export interface LocalizedText {
  en: string;
  he: string;
  ar?: string;
  ru?: string;
}

export interface AboutSection {
  key: string;
  title: LocalizedText;
  body: { en: string[]; he: string[]; ar: string[]; ru: string[] };
  image: string;
  /** DB id of the lead image (for admin replace/delete). */
  imageId?: number;
}

export interface Founder {
  id: string;
  name: LocalizedText;
  bio: LocalizedText;
  image: string;
  /** DB id of the founder photo (for admin replace/delete). */
  imageId?: number;
}

function db() {
  return getCloudflareContext().env.DB;
}

const loc = (
  en: string | null,
  he: string | null,
  ar: string | null = null,
  ru: string | null = null,
): LocalizedText => ({
  en: en ?? '',
  he: he ?? '',
  ar: ar ?? '',
  ru: ru ?? '',
});

// Optional localized field: undefined when every language is empty, so callers
// can fall back to a generated string (matching the previous data behaviour).
const optLoc = (
  en: string | null,
  he: string | null,
  ar: string | null = null,
  ru: string | null = null,
): LocalizedText | undefined =>
  en || he || ar || ru ? { en: en ?? '', he: he ?? '', ar: ar ?? '', ru: ru ?? '' } : undefined;

export interface EntityImage {
  id: number;
  url: string;
}

// Fetch every image for an entity type, grouped by entity_id in sort order.
async function imagesByEntity(entityType: string): Promise<Map<string, EntityImage[]>> {
  const { results } = await db()
    .prepare('SELECT id, entity_id, url FROM images WHERE entity_type = ? ORDER BY entity_id, sort_order')
    .bind(entityType)
    .all<{ id: number; entity_id: string; url: string }>();
  const map = new Map<string, EntityImage[]>();
  for (const row of results) {
    const entry = { id: row.id, url: row.url };
    const arr = map.get(row.entity_id);
    if (arr) arr.push(entry);
    else map.set(row.entity_id, [entry]);
  }
  return map;
}

// ── Pianos ──────────────────────────────────────────────────────────────────
interface PianoRow {
  id: string;
  brand: string;
  model: string;
  type: string;
  serial: string | null;
  region: string;
  size: string;
  year: number | null;
  price_ils: number | null;
  color_hex: string;
  color_name_en: string | null;
  color_name_he: string | null;
  color_name_ar: string | null;
  color_name_ru: string | null;
  dim_width: number | null;
  dim_height: number | null;
  dim_depth: number | null;
  description_en: string | null;
  description_he: string | null;
  description_ar: string | null;
  description_ru: string | null;
  details_en: string | null;
  details_he: string | null;
  details_ar: string | null;
  details_ru: string | null;
  wip: number;
  published: number;
  rental: number;
}

/**
 * Shop inventory (`kind: 'store'`) or the rental fleet (`kind: 'rental'`) —
 * both live in the `pianos` table, split by the `rental` flag.
 */
export async function getPianos(
  includeUnpublished = false,
  kind: 'store' | 'rental' = 'store',
): Promise<ShopItem[]> {
  const rental = kind === 'rental' ? 1 : 0;
  const { results } = await db()
    .prepare(
      includeUnpublished
        ? 'SELECT * FROM pianos WHERE rental = ? ORDER BY sort_order'
        : 'SELECT * FROM pianos WHERE rental = ? AND published = 1 ORDER BY sort_order',
    )
    .bind(rental)
    .all<PianoRow>();
  const images = await imagesByEntity('piano');
  return results.map((r) => {
    const gallery = images.get(r.id) ?? [];
    return {
      id: r.id,
      brand: r.brand,
      model: r.model,
      type: r.type as ShopItem['type'],
      serial: r.serial ?? undefined,
      region: r.region as ShopItem['region'],
      size: r.size,
      year: r.year ?? undefined,
      price: r.price_ils === null ? 'contact' : r.price_ils,
      color: {
        hex: r.color_hex,
        name: loc(r.color_name_en, r.color_name_he, r.color_name_ar, r.color_name_ru),
      },
      dimensions: {
        width: r.dim_width ?? 0,
        height: r.dim_height ?? 0,
        depth: r.dim_depth ?? 0,
      },
      image: gallery[0]?.url ?? '',
      images: gallery.map((i) => i.url),
      galleryImages: gallery,
      description: optLoc(r.description_en, r.description_he, r.description_ar, r.description_ru),
      details: optLoc(r.details_en, r.details_he, r.details_ar, r.details_ru),
      wip: r.wip === 1,
      published: r.published === 1,
      rental: r.rental === 1,
    };
  });
}

// ── Option libraries (brands / origins / colors) ────────────────────────────
export interface BrandOption {
  id: string;
  name: string;
  logoUrl?: string;
}
export interface OriginOption {
  id: string;
  label: LocalizedText;
  flagUrl?: string;
}
export interface ColorOption {
  id: string;
  hex: string;
  name: LocalizedText;
}

export async function getBrands(): Promise<BrandOption[]> {
  const { results } = await db()
    .prepare('SELECT id, name, logo_url FROM brands ORDER BY sort_order, name')
    .all<{ id: string; name: string; logo_url: string | null }>();
  return results.map((r) => ({ id: r.id, name: r.name, logoUrl: r.logo_url ?? undefined }));
}

export async function getOrigins(): Promise<OriginOption[]> {
  const { results } = await db()
    .prepare('SELECT id, name_en, name_he, name_ar, name_ru, flag_url FROM origins ORDER BY sort_order, name_en')
    .all<{
      id: string;
      name_en: string | null;
      name_he: string | null;
      name_ar: string | null;
      name_ru: string | null;
      flag_url: string | null;
    }>();
  return results.map((r) => ({
    id: r.id,
    label: loc(r.name_en, r.name_he, r.name_ar, r.name_ru),
    flagUrl: r.flag_url ?? undefined,
  }));
}

export async function getColors(): Promise<ColorOption[]> {
  const { results } = await db()
    .prepare('SELECT id, hex, name_en, name_he, name_ar, name_ru FROM colors ORDER BY sort_order, name_en')
    .all<{
      id: string;
      hex: string;
      name_en: string | null;
      name_he: string | null;
      name_ar: string | null;
      name_ru: string | null;
    }>();
  return results.map((r) => ({ id: r.id, hex: r.hex, name: loc(r.name_en, r.name_he, r.name_ar, r.name_ru) }));
}

// ── Concerts ──────────────────────────────────────────────────────────────────
interface ConcertRow {
  id: string;
  name_en: string | null;
  name_he: string | null;
  name_ar: string | null;
  name_ru: string | null;
  date: string;
  time: string;
  venue_en: string | null;
  venue_he: string | null;
  venue_ar: string | null;
  venue_ru: string | null;
  price_ils: number;
  description_en: string | null;
  description_he: string | null;
  description_ar: string | null;
  description_ru: string | null;
  artists_en: string | null;
  artists_he: string | null;
  artists_ar: string | null;
  artists_ru: string | null;
  published: number;
}

export async function getConcerts(includeUnpublished = false): Promise<Concert[]> {
  const { results } = await db()
    .prepare(
      includeUnpublished
        ? 'SELECT * FROM concerts ORDER BY date'
        : 'SELECT * FROM concerts WHERE published = 1 ORDER BY date',
    )
    .all<ConcertRow>();
  const images = await imagesByEntity('concert');
  return results.map((r) => {
    const poster = (images.get(r.id) ?? [])[0];
    return {
      id: r.id,
      name: loc(r.name_en, r.name_he, r.name_ar, r.name_ru),
      poster: poster?.url ?? '',
      posterId: poster?.id,
      date: r.date,
      time: r.time,
      venue: loc(r.venue_en, r.venue_he, r.venue_ar, r.venue_ru),
      price: r.price_ils,
      description: optLoc(r.description_en, r.description_he, r.description_ar, r.description_ru),
      artists: optLoc(r.artists_en, r.artists_he, r.artists_ar, r.artists_ru),
      published: r.published === 1,
    };
  });
}

export async function getConcertGallery(): Promise<EntityImage[]> {
  const images = await imagesByEntity('gallery');
  return images.get('concerts') ?? [];
}

// ── Workshop categories + services ──────────────────────────────────────────
interface CategoryRow {
  id: string;
  name_en: string | null;
  name_he: string | null;
  name_ar: string | null;
  name_ru: string | null;
  description_en: string | null;
  description_he: string | null;
  description_ar: string | null;
  description_ru: string | null;
  intro_en: string | null;
  intro_he: string | null;
  intro_ar: string | null;
  intro_ru: string | null;
}
interface ServiceRow {
  id: string;
  category_id: string;
  name_en: string | null;
  name_he: string | null;
  name_ar: string | null;
  name_ru: string | null;
  description_en: string | null;
  description_he: string | null;
  description_ar: string | null;
  description_ru: string | null;
}

export async function getWorkshopCategories(): Promise<WorkshopCategory[]> {
  const { results: cats } = await db()
    .prepare('SELECT * FROM workshop_categories WHERE published = 1 ORDER BY sort_order')
    .all<CategoryRow>();
  const { results: svcs } = await db()
    .prepare('SELECT * FROM workshop_services ORDER BY category_id, sort_order')
    .all<ServiceRow>();
  const images = await imagesByEntity('workshop_category');

  const servicesByCat = new Map<string, WorkshopCategory['services']>();
  for (const s of svcs) {
    const entry = {
      id: s.id,
      name: loc(s.name_en, s.name_he, s.name_ar, s.name_ru),
      description: loc(s.description_en, s.description_he, s.description_ar, s.description_ru),
    };
    const arr = servicesByCat.get(s.category_id);
    if (arr) arr.push(entry);
    else servicesByCat.set(s.category_id, [entry]);
  }

  return cats.map((c) => {
    const catImgs = images.get(c.id) ?? [];
    return {
      id: c.id,
      name: loc(c.name_en, c.name_he, c.name_ar, c.name_ru),
      description: loc(c.description_en, c.description_he, c.description_ar, c.description_ru),
      intro: optLoc(c.intro_en, c.intro_he, c.intro_ar, c.intro_ru),
      image: catImgs[0]?.url ?? '',
      images: catImgs.map((i) => i.url),
      imageId: catImgs[0]?.id,
      galleryImages: catImgs,
      services: servicesByCat.get(c.id) ?? [],
    };
  });
}

// ── About sections + founders ───────────────────────────────────────────────
interface AboutRow {
  key: string;
  title_en: string | null;
  title_he: string | null;
  title_ar: string | null;
  title_ru: string | null;
  body_en: string | null;
  body_he: string | null;
  body_ar: string | null;
  body_ru: string | null;
}
interface FounderRow {
  id: string;
  name_en: string | null;
  name_he: string | null;
  name_ar: string | null;
  name_ru: string | null;
  bio_en: string | null;
  bio_he: string | null;
  bio_ar: string | null;
  bio_ru: string | null;
}

const parseBody = (json: string | null): string[] => {
  if (!json) return [];
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
};

export async function getAboutSections(): Promise<Record<string, AboutSection>> {
  const { results } = await db()
    .prepare('SELECT * FROM about_sections ORDER BY sort_order')
    .all<AboutRow>();
  const images = await imagesByEntity('about_section');
  const out: Record<string, AboutSection> = {};
  for (const r of results) {
    const lead = (images.get(r.key) ?? [])[0];
    out[r.key] = {
      key: r.key,
      title: loc(r.title_en, r.title_he, r.title_ar, r.title_ru),
      body: {
        en: parseBody(r.body_en),
        he: parseBody(r.body_he),
        ar: parseBody(r.body_ar),
        ru: parseBody(r.body_ru),
      },
      image: lead?.url ?? '',
      imageId: lead?.id,
    };
  }
  return out;
}

export async function getFounders(): Promise<Founder[]> {
  const { results } = await db()
    .prepare('SELECT * FROM founders ORDER BY sort_order')
    .all<FounderRow>();
  const images = await imagesByEntity('founder');
  return results.map((r) => {
    const lead = (images.get(r.id) ?? [])[0];
    return {
      id: r.id,
      name: loc(r.name_en, r.name_he, r.name_ar, r.name_ru),
      bio: loc(r.bio_en, r.bio_he, r.bio_ar, r.bio_ru),
      image: lead?.url ?? '',
      imageId: lead?.id,
    };
  });
}

// ── Last-modified timestamps (sitemap) ──────────────────────────────────────
//
// Every admin write bumps its row's `updated_at`, so the sitemap can report a
// truthful <lastmod> per URL instead of "now". Photo changes don't touch the
// parent row, so an entity's stamp also takes the newest image attached to it.

export interface ContentTimestamps {
  /** Piano id → last change (shop and rental alike). */
  pianos: Map<string, Date>;
  /** Workshop category id → last change (own row, its fixes, or its photos). */
  categories: Map<string, Date>;
  /** Newest change within each listing page's content. */
  sections: Record<'store' | 'rental' | 'services' | 'concerts' | 'about', Date | undefined>;
  /** Newest change anywhere — used for the pages with no content of their own. */
  site: Date | undefined;
}

// D1 stores 'YYYY-MM-DD HH:MM:SS' in UTC.
const toDate = (s: string | null | undefined): Date | undefined => {
  if (!s) return undefined;
  const d = new Date(`${s.replace(' ', 'T')}Z`);
  return Number.isNaN(d.getTime()) ? undefined : d;
};

const newest = (...dates: (Date | undefined)[]): Date | undefined =>
  dates.reduce<Date | undefined>((a, b) => (b && (!a || b > a) ? b : a), undefined);

const maxOf = (map: Map<string, Date>) => newest(...map.values());

export async function getContentTimestamps(): Promise<ContentTimestamps> {
  const [pianoRows, catRows, svcRows, imgRows, concertRow, aboutRow, founderRow] = await Promise.all([
    db()
      .prepare('SELECT id, rental, updated_at FROM pianos WHERE published = 1')
      .all<{ id: string; rental: number; updated_at: string }>(),
    db()
      .prepare('SELECT id, updated_at FROM workshop_categories WHERE published = 1')
      .all<{ id: string; updated_at: string }>(),
    db()
      .prepare('SELECT category_id, MAX(updated_at) AS updated_at FROM workshop_services GROUP BY category_id')
      .all<{ category_id: string; updated_at: string }>(),
    db()
      .prepare(
        "SELECT entity_type, entity_id, MAX(created_at) AS created_at FROM images WHERE entity_type IN ('piano','workshop_category') GROUP BY entity_type, entity_id",
      )
      .all<{ entity_type: string; entity_id: string; created_at: string }>(),
    db()
      .prepare('SELECT MAX(updated_at) AS updated_at FROM concerts WHERE published = 1')
      .first<{ updated_at: string | null }>(),
    db().prepare('SELECT MAX(updated_at) AS updated_at FROM about_sections').first<{ updated_at: string | null }>(),
    db().prepare('SELECT MAX(updated_at) AS updated_at FROM founders').first<{ updated_at: string | null }>(),
  ]);

  const pianos = new Map<string, Date>();
  const categories = new Map<string, Date>();
  const store = new Map<string, Date>();
  const rental = new Map<string, Date>();

  const bump = (map: Map<string, Date>, id: string, d: Date | undefined) => {
    if (!d) return;
    const current = map.get(id);
    if (!current || d > current) map.set(id, d);
  };

  for (const r of pianoRows.results) {
    const d = toDate(r.updated_at);
    bump(pianos, r.id, d);
    bump(r.rental === 1 ? rental : store, r.id, d);
  }
  for (const r of catRows.results) bump(categories, r.id, toDate(r.updated_at));
  for (const r of svcRows.results) bump(categories, r.category_id, toDate(r.updated_at));
  for (const r of imgRows.results) {
    const d = toDate(r.created_at);
    if (r.entity_type === 'piano') {
      bump(pianos, r.entity_id, d);
      if (rental.has(r.entity_id)) bump(rental, r.entity_id, d);
      else if (store.has(r.entity_id)) bump(store, r.entity_id, d);
    } else {
      bump(categories, r.entity_id, d);
    }
  }

  const sections = {
    store: maxOf(store),
    rental: maxOf(rental),
    services: maxOf(categories),
    concerts: toDate(concertRow?.updated_at),
    about: newest(toDate(aboutRow?.updated_at), toDate(founderRow?.updated_at)),
  };

  return { pianos, categories, sections, site: newest(...Object.values(sections)) };
}
