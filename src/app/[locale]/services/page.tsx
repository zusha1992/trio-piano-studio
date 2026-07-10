'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import ContactCTA from '@/components/sections/ContactCTA';

export default function ServicesPage() {
  const t = useTranslations('services');
  const locale = useLocale();

  const headingFont =
    locale === 'he' ? 'var(--font-heebo), sans-serif' : 'var(--font-cormorant), serif';

  const restorationList = t.raw('restoration_list') as string[];

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-center bg-[var(--c-bg)] pt-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 80% 60% at 70% 50%, rgba(201,168,76,0.05) 0%, transparent 60%)',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] tracking-[0.4em] uppercase text-[var(--c-accent)] mb-6"
          >
            {t('hero_label')}
          </motion.p>
          <div className="gold-divider" />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl lg:text-7xl font-light text-[var(--c-text)] max-w-3xl leading-tight"
            style={{ fontFamily: headingFont }}
          >
            {t('hero_title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-[var(--c-muted)] mt-6 max-w-xl"
          >
            {t('hero_subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Restoration */}
      <section className="section-padding bg-[var(--c-bg)] border-t border-[var(--c-card)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--c-accent)] mb-4">
                01
              </p>
              <h2
                className="text-4xl font-light text-[var(--c-text)] mb-2"
                style={{ fontFamily: headingFont }}
              >
                {t('restoration_title')}
              </h2>
              <p className="text-xl font-light text-[var(--c-accent)] italic mb-8">
                {t('restoration_subtitle')}
              </p>
              <p className="text-base text-[var(--c-dim)] leading-relaxed mb-8">
                {t('restoration_body')}
              </p>
              <Button href={`/${locale}/contact`} variant="outline" size="sm">
                {t('cta')}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-[var(--c-card)] border border-[var(--c-border)] p-8"
            >
              <h3 className="text-sm tracking-[0.2em] uppercase text-[var(--c-accent)] mb-6">
                {t('restoration_includes')}
              </h3>
              <ul className="space-y-4">
                {restorationList.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0"
                      style={{ color: 'var(--c-accent)' }}
                    />
                    <span className="text-sm text-[var(--c-dim)]">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sales */}
      <section className="section-padding bg-[var(--c-bg-alt)] border-t border-[var(--c-card)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Visual */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="relative h-80 bg-[var(--c-card)] border border-[var(--c-border-lt)] flex items-center justify-center order-2 lg:order-1"
            >
              <div className="flex gap-3 items-end">
                {[60, 90, 75, 80, 100, 70, 85].map((h, i) => (
                  <div
                    key={i}
                    className="w-8 rounded-t-sm"
                    style={{
                      height: `${h}px`,
                      backgroundColor: i === 4 ? 'var(--c-accent)' : 'var(--c-border-lt)',
                    }}
                  />
                ))}
              </div>
              <div className="absolute top-4 start-4">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--c-ultra-dim)]">
                  {locale === 'he' ? 'מבחר אוסף' : 'Curated Selection'}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-1 lg:order-2"
            >
              <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--c-accent)] mb-4">
                02
              </p>
              <h2
                className="text-4xl font-light text-[var(--c-text)] mb-2"
                style={{ fontFamily: headingFont }}
              >
                {t('sales_title')}
              </h2>
              <p className="text-xl font-light text-[var(--c-accent)] italic mb-8">
                {t('sales_subtitle')}
              </p>
              <p className="text-base text-[var(--c-dim)] leading-relaxed mb-8">
                {t('sales_body')}
              </p>
              <Button href={`/${locale}/store`} variant="outline" size="sm">
                {locale === 'he' ? 'צפה בפסנתרים' : 'View Pianos'}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Japanese Import */}
      <section className="section-padding bg-[var(--c-bg)] border-t border-[var(--c-card)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--c-accent)] mb-4">
                03
              </p>
              <h2
                className="text-4xl font-light text-[var(--c-text)] mb-2"
                style={{ fontFamily: headingFont }}
              >
                {t('import_title')}
              </h2>
              <p className="text-xl font-light text-[var(--c-accent)] italic mb-8">
                {t('import_subtitle')}
              </p>
              <p className="text-base text-[var(--c-dim)] leading-relaxed mb-8">
                {t('import_body')}
              </p>
              <Button href={`/${locale}/contact`} variant="outline" size="sm">
                {t('cta')}
              </Button>
            </motion.div>

            {/* Brands */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {['Yamaha', 'Kawai', 'Steinway', 'Bösendorfer'].map((brand) => (
                <div
                  key={brand}
                  className="bg-[var(--c-card)] border border-[var(--c-border)] p-8 flex items-center justify-center"
                >
                  <p
                    className="text-lg font-light text-[var(--c-ultra-dim)]"
                    style={{ fontFamily: 'var(--font-cormorant), serif' }}
                  >
                    {brand}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-[var(--c-bg-alt)] border-t border-[var(--c-card)]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2
            className="text-4xl font-light text-[var(--c-text)] mb-6"
            style={{ fontFamily: headingFont }}
          >
            {t('cta_title')}
          </h2>
          <p className="text-base text-[var(--c-dim)] mb-10">{t('cta_body')}</p>
          <Button href={`/${locale}/contact`} size="lg">
            {t('cta')}
          </Button>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
