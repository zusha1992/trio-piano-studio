import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { MAPS_URL, STUDIO_GEO } from '@/data/contact';

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

const OFFER_NAMES: Record<string, { sale: string; workshop: string; rental: string }> = {
  he: { sale: 'פסנתרים למכירה', workshop: 'שיקום, כיוון, עיצוב צליל ותיקוני פסנתרים', rental: 'השכרת פסנתרים' },
  en: { sale: 'Pianos for sale', workshop: 'Piano restoration, tuning, voicing and repairs', rental: 'Piano rental' },
  ar: { sale: 'بيانوهات للبيع', workshop: 'ترميم البيانو ودوزنته', rental: 'تأجير البيانو' },
  ru: { sale: 'Фортепиано на продажу', workshop: 'Реставрация и настройка фортепиано', rental: 'Аренда фортепиано' },
};

/**
 * LocalBusiness + MusicStore JSON-LD. Tells Google this is a Jerusalem piano
 * shop/workshop (not only a brand homepage) and points at the Maps listing.
 */
export function localBusinessJsonLd({
  locale,
  name,
  description,
}: {
  locale: string;
  name: string;
  description: string;
}) {
  const offers = OFFER_NAMES[locale] ?? OFFER_NAMES.en;
  return {
    '@context': 'https://schema.org',
    '@type': ['MusicStore', 'LocalBusiness'],
    '@id': `${SITE_URL}/#business`,
    name,
    alternateName: [
      'Trio Piano Studio',
      'טריו סטודיו',
      'טריו סטודיו לפסנתרים',
      'טריו – בית מלאכה לפסנתרים',
    ],
    url: `${SITE_URL}/${locale}`,
    image: `${SITE_URL}/images/home/home.webp`,
    logo: `${SITE_URL}/icon.png`,
    telephone: '+972-54-333-7341',
    email: 'trio.piano.studio@gmail.com',
    description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Yad Harutzim 16',
      addressLocality: 'Jerusalem',
      addressCountry: 'IL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: STUDIO_GEO.latitude,
      longitude: STUDIO_GEO.longitude,
    },
    hasMap: MAPS_URL,
    sameAs: ['https://www.instagram.com/trio.piano.studio', MAPS_URL],
    areaServed: { '@type': 'City', name: 'Jerusalem' },
    makesOffer: [
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: offers.sale, url: `${SITE_URL}/${locale}/store` } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: offers.workshop, url: `${SITE_URL}/${locale}/services` } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: offers.rental, url: `${SITE_URL}/${locale}/rental` } },
    ],
  };
}

/** Product JSON-LD for a shop or rental piano page. */
export function pianoJsonLd({
  locale,
  path,
  name,
  description,
  image,
  brand,
  sku,
  price,
  wip,
  rental,
}: {
  locale: string;
  path: string;
  name: string;
  description: string;
  image?: string;
  brand: string;
  sku?: string;
  price: number | 'contact';
  wip?: boolean;
  rental?: boolean;
}) {
  const url = `${SITE_URL}/${locale}${path}`;
  const img = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : undefined;
  const offer: Record<string, unknown> = {
    '@type': 'Offer',
    url,
    priceCurrency: 'ILS',
    availability: wip ? 'https://schema.org/PreOrder' : 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/UsedCondition',
    seller: { '@id': `${SITE_URL}/#business` },
    areaServed: { '@type': 'City', name: 'Jerusalem' },
  };
  if (typeof price === 'number') offer.price = price;
  if (rental) offer.businessFunction = 'http://purl.org/goodrelations/v1#LeaseOut';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: img,
    brand: { '@type': 'Brand', name: brand },
    sku,
    url,
    offers: offer,
  };
}
