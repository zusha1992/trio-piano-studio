'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import PianoCard from '@/components/ui/PianoCard';
import ContactCTA from '@/components/sections/ContactCTA';
import { pianos, PianoType, PianoCondition } from '@/data/pianos';

type FilterType = 'all' | PianoType | PianoCondition;

export default function StorePage() {
  const t = useTranslations('store');
  const locale = useLocale();
  const [filter, setFilter] = useState<FilterType>('all');

  const headingFont =
    locale === 'he' ? 'var(--font-heebo), sans-serif' : 'var(--font-cormorant), serif';

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: t('filter_all') },
    { key: 'restored', label: t('filter_restored') },
    { key: 'imported', label: t('filter_imported') },
    { key: 'grand', label: t('filter_grand') },
    { key: 'upright', label: t('filter_upright') },
  ];

  const filtered = pianos.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'restored' || filter === 'imported' || filter === 'new')
      return p.condition === filter;
    return p.type === filter || (p.type === 'baby-grand' && filter === 'grand');
  });

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end bg-[var(--c-bg)] pt-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(201,168,76,0.04) 0%, transparent 60%)',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-16 w-full">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] tracking-[0.4em] uppercase text-[var(--c-accent)] mb-4"
          >
            {t('hero_label')}
          </motion.p>
          <div className="gold-divider" />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl lg:text-6xl font-light text-[var(--c-text)] leading-tight mb-4"
            style={{ fontFamily: headingFont }}
          >
            {t('hero_title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base text-[var(--c-muted)] max-w-xl"
          >
            {t('hero_subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="section-padding bg-[var(--c-bg)] border-t border-[var(--c-card)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Filter bar */}
          <div className="flex flex-wrap gap-2 mb-12">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 border transition-all duration-200 cursor-pointer ${
                  filter === f.key
                    ? 'bg-[var(--c-accent)] text-[var(--c-bg)] border-[var(--c-accent)]'
                    : 'border-[var(--c-border)] text-[var(--c-muted)] hover:border-[var(--c-accent)] hover:text-[var(--c-accent)]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[var(--c-ultra-dim)] text-sm">{t('empty')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((piano, i) => (
                <motion.div
                  key={piano.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <PianoCard piano={piano} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
