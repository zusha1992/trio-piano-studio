// Studio contact details — plain data, no 'use client', so both the client
// landing screens and server components (the accessibility statement) can
// import it. Single source of truth for the phone, email and address shown
// across the site.

import type { Localized } from '@/lib/i18n';

/* ── Contacts ──────────────────────────────────────────────────────── */
export interface Contact {
  icon: string;
  label: Localized;
  href: string;
  external?: boolean;
}

export const MAPS_URL =
  'https://www.google.com/maps/place/Yad+Harutsim+St+16,+Jerusalem/@31.7519227,35.2136965,17z/data=!3m1!4b1!4m6!3m5!1s0x1503281e479e1845:0x71df54fdd9c2bb4e!8m2!3d31.7519227!4d35.2162768!16s%2Fg%2F11ghfqf26s?entry=ttu';

const PHONE_LABEL = { he: '054-333-7341', en: '054-333-7341', ar: '054-333-7341', ru: '054-333-7341' };
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
