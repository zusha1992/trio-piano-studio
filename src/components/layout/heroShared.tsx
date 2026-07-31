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
    intro: '#f2f2f3',
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

/* ── Contacts ──────────────────────────────────────────────────────── */
export interface Contact {
  icon: string;
  label: Localized;
  href: string;
  external?: boolean;
}

export const MAPS_URL =
  'https://www.google.com/maps/place/Yad+Harutsim+St+16,+Jerusalem/@31.7519227,35.2136965,17z/data=!3m1!4b1!4m6!3m5!1s0x1503281e479e1845:0x71df54fdd9c2bb4e!8m2!3d31.7519227!4d35.2162768!16s%2Fg%2F11ghfqf26s?entry=ttu';

const PHONE_LABEL = { he: '054-3337-341', en: '054-3337-341', ar: '054-3337-341', ru: '054-3337-341' };
const EMAIL_LABEL = {
  he: 'trio.piano.studio@gmail.com',
  en: 'trio.piano.studio@gmail.com',
  ar: 'trio.piano.studio@gmail.com',
  ru: 'trio.piano.studio@gmail.com',
};
const IG_LABEL = { he: 'trio.piano.studio', en: 'trio.piano.studio', ar: 'trio.piano.studio', ru: 'trio.piano.studio' };

export const CONTACTS: Contact[] = [
  {
    icon: 'whatsapp.svg',
    label: PHONE_LABEL,
    href: 'https://wa.me/972543337341',
    external: true,
  },
  {
    icon: 'envelope-solid-full.svg',
    label: EMAIL_LABEL,
    href: 'mailto:trio.piano.studio@gmail.com',
  },
  {
    icon: 'instagram-logo-fill-svgrepo-com.svg',
    label: IG_LABEL,
    href: 'https://www.instagram.com/trio.piano.studio?igsh=MTV6MnRjZjhzdmMzag%3D%3D',
    external: true,
  },
  {
    icon: 'location-dot-solid-full.svg',
    label: {
      he: 'יד חרוצים 16, ירושלים',
      en: 'Yad Harutzim 16, Jerusalem',
      ar: 'يد حروتسيم 16، القدس',
      ru: 'Яд Харуцим 16, Иерусалим',
    },
    href: MAPS_URL,
    external: true,
  },
];

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
