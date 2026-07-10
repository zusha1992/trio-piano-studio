'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import ContactCTA from '@/components/sections/ContactCTA';

const values = ['value1', 'value2', 'value3'] as const;

export default function AboutPage() {
  const t = useTranslations('about');
  const locale = useLocale();

  const headingFont =
    locale === 'he' ? 'var(--font-heebo), sans-serif' : 'var(--font-cormorant), serif';

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-center bg-[var(--c-bg)] pt-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 70% 70% at 30% 50%, rgba(201,168,76,0.05) 0%, transparent 60%)',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-[10px] tracking-[0.4em] uppercase text-[var(--c-accent)] mb-6"
          >
            {t('hero_label')}
          </motion.p>
          <div className="gold-divider" />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl lg:text-7xl font-light text-[var(--c-text)] max-w-3xl leading-tight"
            style={{ fontFamily: headingFont }}
          >
            {t('hero_title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-[var(--c-muted)] mt-6 max-w-xl"
          >
            {t('hero_subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-[var(--c-bg)] border-t border-[var(--c-card)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--c-accent)] mb-6">
                01
              </p>
              <h2
                className="text-4xl font-light text-[var(--c-text)] mb-8 leading-tight"
                style={{ fontFamily: headingFont }}
              >
                {t('story_title')}
              </h2>
              <div className="space-y-5">
                {(['story_body1', 'story_body2', 'story_body3'] as const).map((key) => (
                  <p key={key} className="text-base text-[var(--c-dim)] leading-relaxed">
                    {t(key)}
                  </p>
                ))}
              </div>
            </motion.div>

            {/* Visual element */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-[var(--c-card)] border border-[var(--c-border-lt)] h-[400px] flex items-center justify-center">
                <div className="text-center p-12">
                  <p
                    className="text-9xl font-light text-[var(--c-border-lt)]"
                    style={{ fontFamily: 'var(--font-cormorant), serif' }}
                  >
                    ♩
                  </p>
                  <p className="text-xs tracking-[0.3em] uppercase text-[var(--c-accent)] mt-6">
                    {locale === 'he' ? 'ירושלים, ישראל' : 'Jerusalem, Israel'}
                  </p>
                </div>
              </div>
              <div className="absolute -top-4 -start-4 w-16 h-16 border border-[var(--c-accent)] opacity-30" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-[var(--c-bg-alt)] border-t border-[var(--c-card)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--c-accent)] mb-4">
              {t('values_label')}
            </p>
            <h2
              className="text-4xl font-light text-[var(--c-text)]"
              style={{ fontFamily: headingFont }}
            >
              {t('values_title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((key, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="bg-[var(--c-card)] border border-[var(--c-border)] p-8"
              >
                <p className="text-3xl font-light text-[var(--c-accent)] mb-4"
                  style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                  0{i + 1}
                </p>
                <h3 className="text-xl font-light text-[var(--c-text)] mb-4">
                  {t(`${key}_title`)}
                </h3>
                <p className="text-sm text-[var(--c-muted)] leading-relaxed">
                  {t(`${key}_desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="section-padding bg-[var(--c-bg)] border-t border-[var(--c-card)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--c-accent)] mb-4">
                {t('location_label')}
              </p>
              <h2
                className="text-4xl font-light text-[var(--c-text)] mb-6"
                style={{ fontFamily: headingFont }}
              >
                {t('location_title')}
              </h2>
              <p className="text-base text-[var(--c-dim)] mb-4">{t('location_address')}</p>
              <p className="text-sm text-[var(--c-muted)] whitespace-pre-line mb-8">
                {t('location_hours')}
              </p>
              <Button href={`/${locale}/contact`} variant="outline">
                {locale === 'he' ? 'צור קשר' : 'Get Directions'}
              </Button>
            </div>
            <div className="h-80 bg-[var(--c-card)] border border-[var(--c-border-lt)] flex items-center justify-center">
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--c-ultra-dim)]">
                {locale === 'he' ? 'מפה תתווסף בקרוב' : 'Map Coming Soon'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
