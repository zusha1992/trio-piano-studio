'use client';

import { useTranslations } from 'next-intl';

/**
 * First tab stop on every page: jumps past the toolbar straight to the content
 * (WCAG 2.4.1, "bypass blocks"). Invisible until it receives keyboard focus.
 */
export default function SkipLink() {
  const t = useTranslations('a11y');
  return (
    <a href="#main-content" className="skip-link">
      {t('skip')}
    </a>
  );
}
