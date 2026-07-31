'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { CONTACTS, ContactIcon } from '@/components/layout/heroShared';
import { displayFont } from '@/lib/fonts';
import { pick } from '@/lib/i18n';

export default function ContactCTA() {
  const t = useTranslations('cta_banner');
  const locale = useLocale();
  // Same header typeface as the store title / home-screen categories.
  const titleFont = displayFont(locale);

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

      {/* Direct contact shortcuts — WhatsApp, mail, Instagram, and directions —
          so visitors can reach out or find the studio without leaving the page. */}
      <div className="mt-6 flex items-center justify-center gap-4 sm:gap-5">
        {CONTACTS.map((c) => (
          <a
            key={c.icon}
            href={c.href}
            target={c.external ? '_blank' : undefined}
            rel={c.external ? 'noopener noreferrer' : undefined}
            aria-label={pick(c.label, locale)}
            className="text-[color:var(--c-cat)] transition-colors duration-300 hover:text-[color:var(--c-cat-active)]"
          >
            <ContactIcon src={`/assets/icons/${c.icon}`} size={22} />
          </a>
        ))}
      </div>
    </section>
  );
}
