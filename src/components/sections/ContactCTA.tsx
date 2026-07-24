'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { displayFont } from '@/lib/fonts';

export default function ContactCTA() {
  const t = useTranslations('cta_banner');
  const locale = useLocale();
  const isHe = locale === 'he';
  // Same header typeface as the store title / home-screen categories.
  const titleFont = displayFont(isHe);

  return (
    <section className="mx-auto max-w-[100rem] px-6 py-16 text-center sm:px-10 lg:px-16 lg:py-20">
      <h2
        className="text-2xl leading-tight tracking-tight text-[var(--c-text)] sm:text-3xl lg:text-4xl"
        style={{ fontFamily: titleFont, fontWeight: 400 }}
      >
        {t('title')}
      </h2>

      <div className="mt-8">
        <Link
          href={`/${locale}/contact`}
          className="inline-block rounded-full bg-[color:var(--c-cat)] px-7 py-3 text-[11px] uppercase tracking-[0.25em] text-[var(--c-bg)] transition-colors duration-300 hover:bg-[color:var(--c-cat-active)]"
          style={{ fontFamily: titleFont, fontWeight: 400 }}
        >
          {t('cta')}
        </Link>
      </div>
    </section>
  );
}
