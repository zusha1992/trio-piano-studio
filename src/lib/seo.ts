import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

export const SITE_URL = 'https://www.triopianostudio.com';

const { locales, defaultLocale } = routing;

// Default share image — the studio shot the landing page opens on.
const DEFAULT_OG_IMAGE = '/images/home/home.webp';

/**
 * Canonical URL + hreflang alternates for one page, in one locale.
 *
 * Every page exists in all four languages at the same path, so each one points
 * at its siblings; that is what stops Google reading them as duplicates. Hebrew
 * is x-default since it's the primary audience.
 */
export function alternates(path: string, locale: string): Metadata['alternates'] {
  const url = (l: string) => `${SITE_URL}/${l}${path}`;
  return {
    canonical: url(locale),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, url(l)])),
      'x-default': url(defaultLocale),
    },
  };
}

/** Trim a body paragraph down to a meta-description-sized sentence. */
export function clamp(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const stop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('، '), cut.lastIndexOf(', '));
  return `${(stop > max * 0.6 ? cut.slice(0, stop) : cut).trim()}…`;
}

/**
 * Page metadata: title + description, canonical/hreflang, and Open Graph and
 * Twitter cards built from the same pair so a shared link reads the same
 * everywhere.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  siteName,
  image,
  type = 'website',
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  siteName: string;
  /** Absolute or root-relative image URL; falls back to the studio photo. */
  image?: string;
  type?: 'website' | 'article';
}): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;
  const img = image || DEFAULT_OG_IMAGE;
  return {
    title,
    description,
    alternates: alternates(path, locale),
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale,
      type,
      images: [{ url: img.startsWith('http') ? img : `${SITE_URL}${img}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [img.startsWith('http') ? img : `${SITE_URL}${img}`],
    },
  };
}
