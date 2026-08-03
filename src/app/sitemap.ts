import type { MetadataRoute } from 'next';
import { getContentTimestamps, getPianos, getWorkshopCategories } from '@/lib/content';
import { routing } from '@/i18n/routing';

// Built from the live database on request, so newly added pianos, rental
// instruments and workshop categories appear without a redeploy.
export const dynamic = 'force-dynamic';

const SITE = 'https://www.triopianostudio.com';

const { locales, defaultLocale } = routing;

// Every page exists in all four languages, so each entry carries hreflang
// alternates for its siblings — that's what tells Google the pages are
// translations of one another rather than duplicates.
//
// `lastModified` is the real `updated_at` behind the page (see
// getContentTimestamps); pages with no content of their own fall back to the
// newest change on the site. Never "now" — a sitemap where everything is
// always fresh tells Google nothing.
function entry(
  path: string,
  lastModified: Date | undefined,
  changeFrequency: 'daily' | 'weekly' | 'monthly',
  priority: number,
  fallback: Date,
) {
  const url = (locale: string) => `${SITE}/${locale}${path}`;
  return locales.map((locale) => ({
    url: url(locale),
    lastModified: lastModified ?? fallback,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, url(l)])),
        'x-default': url(defaultLocale),
      },
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pianos, rentals, categories, stamps] = await Promise.all([
    getPianos(),
    getPianos(false, 'rental'),
    getWorkshopCategories(),
    getContentTimestamps(),
  ]);

  const { sections } = stamps;
  // Last resort for a site with no content rows at all.
  const fallback = stamps.site ?? new Date();
  const at = (path: string, d: Date | undefined, freq: 'daily' | 'weekly' | 'monthly', p: number) =>
    entry(path, d, freq, p, fallback);

  return [
    ...at('', stamps.site, 'weekly', 1),
    ...at('/store', sections.store, 'daily', 0.9),
    ...at('/rental', sections.rental, 'daily', 0.9),
    ...at('/services', sections.services, 'weekly', 0.9),
    ...at('/concerts', sections.concerts, 'daily', 0.8),
    ...at('/about', sections.about, 'monthly', 0.7),
    ...at('/contact', stamps.site, 'monthly', 0.7),
    ...categories.flatMap((c) => at(`/services/${c.id}`, stamps.categories.get(c.id), 'monthly', 0.6)),
    ...pianos.flatMap((p) => at(`/store/${p.id}`, stamps.pianos.get(p.id), 'weekly', 0.6)),
    ...rentals.flatMap((p) => at(`/rental/${p.id}`, stamps.pianos.get(p.id), 'weekly', 0.6)),
  ];
}
