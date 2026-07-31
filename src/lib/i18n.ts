// Shared locale helpers for the four site languages.
//
// Hebrew is the authoring/source language; English, Arabic and Russian are
// filled by auto-translation (with per-field manual overrides). Hebrew and
// Arabic are right-to-left.

export const LOCALES = ['he', 'en', 'ar', 'ru'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'he';

// Right-to-left scripts.
const RTL = new Set<string>(['he', 'ar']);
export const isRtl = (locale: string): boolean => RTL.has(locale);
export const dirOf = (locale: string): 'rtl' | 'ltr' => (isRtl(locale) ? 'rtl' : 'ltr');

// Native names shown in the language switcher.
export const LOCALE_NAMES: Record<Locale, string> = {
  he: 'עברית',
  en: 'English',
  ar: 'العربية',
  ru: 'Русский',
};

// Compact labels (used where space is tight).
export const LOCALE_SHORT: Record<Locale, string> = {
  he: 'עב',
  en: 'EN',
  ar: 'ع',
  ru: 'RU',
};

export const isLocale = (v: string): v is Locale => (LOCALES as readonly string[]).includes(v);

// A string localized into (some of) the four languages.
export type Localized = Partial<Record<Locale, string>>;

// Pick the best available string for a locale, falling back through the source
// languages so a not-yet-translated field still renders something sensible:
//   requested → English → Hebrew → any non-empty → ''.
export function pick(value: Localized | undefined | null, locale: string): string {
  if (!value) return '';
  const chain = [locale, 'en', 'he'];
  for (const l of chain) {
    const v = value[l as Locale];
    if (v) return v;
  }
  for (const l of LOCALES) {
    if (value[l]) return value[l] as string;
  }
  return '';
}

// Array variant (e.g. paragraph lists) with the same fallback chain: the first
// locale that has a non-empty array wins.
export function pickArray(
  value: Partial<Record<Locale, string[]>> | undefined | null,
  locale: string,
): string[] {
  if (!value) return [];
  const chain = [locale, 'en', 'he'];
  for (const l of chain) {
    const v = value[l as Locale];
    if (v && v.length) return v;
  }
  for (const l of LOCALES) {
    const v = value[l];
    if (v && v.length) return v;
  }
  return [];
}
