'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ContactCTA() {
  const t = useTranslations('cta_banner');
  const locale = useLocale();
  const isHe = locale === 'he';
  // Same header typeface as the store title / home-screen categories.
  const titleFont = isHe ? 'var(--font-rubik), sans-serif' : 'var(--font-arimo), sans-serif';

  return (
    <section className="mx-auto max-w-[100rem] px-6 py-16 text-center sm:px-10 lg:px-16 lg:py-20">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-2xl leading-tight tracking-tight text-[var(--c-text)] sm:text-3xl lg:text-4xl"
        style={{ fontFamily: titleFont, fontWeight: 400 }}
      >
        {t('title')}
      </motion.h2>

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
