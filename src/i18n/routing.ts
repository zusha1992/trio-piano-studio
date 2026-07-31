import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['he', 'en', 'ar', 'ru'],
  defaultLocale: 'he',
  localePrefix: 'always',
});
