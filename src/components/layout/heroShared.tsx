'use client';

import type { Localized } from '@/lib/i18n';

/* ── Theme ─────────────────────────────────────────────────────────────
   Shared by the desktop gate and the mobile landing so a choice made on
   one persists on the other. `bg` is the panel/background color; `intro`
   is the slightly different shade behind the closing curtain (desktop).
   The live preference/toggle lives in ThemeContext (`useTheme`).           */
export const SCHEMES = {
  light: {
    bg: '#ffffff',
    intro: '#ffffff',
    cat: '#3a3a3c',
    catActive: '#09090b',
    sub: 'text-[var(--c-muted)] hover:text-[var(--c-text)]',
    toggle: 'text-[var(--c-dim)] hover:text-[var(--c-text)]',
  },
  dark: {
    bg: '#09090b',
    intro: '#151517',
    cat: '#8a8a8f',
    catActive: '#ffffff',
    sub: 'text-white/60 hover:text-white',
    toggle: 'text-white/50 hover:text-white',
  },
} as const;

export const THEME_KEY = 'heroTheme';

/* ── Categories ────────────────────────────────────────────────────── */
export interface Category {
  key: string;
  href: string;
  label: Localized;
  img: string;
}

export const CATEGORIES: Category[] = [
  {
    key: 'services',
    href: 'services',
    label: { he: 'בית המלאכה', en: 'The Workshop', ar: 'الورشة', ru: 'Мастерская' },
    img: '/images/home/workshop.webp',
  },
  {
    key: 'store',
    href: 'store',
    label: { he: 'החנות', en: 'The Store', ar: 'المتجر', ru: 'Магазин' },
    img: '/images/home/shop.webp',
  },
  {
    key: 'rental',
    href: 'rental',
    label: { he: 'השכרה', en: 'Rental', ar: 'الإيجار', ru: 'Аренда' },
    img: '/images/home/rental.webp',
  },
  {
    key: 'concerts',
    href: 'concerts',
    label: { he: 'קונצרטים', en: 'Concerts', ar: 'حفلات موسيقية', ru: 'Концерты' },
    img: '/images/home/concerts.webp',
  },
  {
    key: 'about',
    href: 'about',
    label: { he: 'על הסטודיו', en: 'About', ar: 'عن الاستوديو', ru: 'О студии' },
    img: '/images/home/studio.webp',
  },
];

export const DEFAULT_IMG = '/images/home/home.webp';

// All hero images, used to preload/decode up front for instant swaps.
export const ALL_IMAGES = [DEFAULT_IMG, ...CATEGORIES.map((c) => c.img)];

/* ── Contacts ─────────────────────────────────────────────────────────
   Defined in @/data/contact (a non-client module) and re-exported here so the
   existing import sites keep working. */
export { CONTACTS, MAPS_URL } from '@/data/contact';
export type { Contact } from '@/data/contact';

// Renders a monochrome SVG icon tinted with the current text color, so it can
// respond to hover/theme just like the label next to it.
export function ContactIcon({ src, size = 15 }: { src: string; size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-block shrink-0 bg-current"
      style={{
        width: size,
        height: size,
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
      }}
    />
  );
}
