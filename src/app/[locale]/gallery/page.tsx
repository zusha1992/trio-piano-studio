'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import ContactCTA from '@/components/sections/ContactCTA';

interface GalleryItem {
  id: string;
  title: { en: string; he: string };
  category: 'restoration' | 'grand' | 'upright';
  before: string;
  after: string;
  year: number;
}

const galleryItems: GalleryItem[] = [
  {
    id: '1',
    title: { en: 'Yamaha U3 Full Restoration', he: 'שיקום מלא יאמהה U3' },
    category: 'restoration',
    before: '/images/gallery/u3-before.jpg',
    after: '/images/gallery/u3-after.jpg',
    year: 2024,
  },
  {
    id: '2',
    title: { en: 'Kawai Baby Grand Rebuild', he: 'שיקום גרנד קוואי' },
    category: 'grand',
    before: '/images/gallery/kawai-grand-before.jpg',
    after: '/images/gallery/kawai-grand-after.jpg',
    year: 2024,
  },
  {
    id: '3',
    title: { en: 'Steinway Upright Revival', he: 'שיקום שטיינווי קיר' },
    category: 'upright',
    before: '/images/gallery/steinway-upright-before.jpg',
    after: '/images/gallery/steinway-upright-after.jpg',
    year: 2023,
  },
  {
    id: '4',
    title: { en: 'Vintage Grand Piano Restoration', he: 'שיקום גרנד ישן' },
    category: 'grand',
    before: '/images/gallery/vintage-grand-before.jpg',
    after: '/images/gallery/vintage-grand-after.jpg',
    year: 2023,
  },
  {
    id: '5',
    title: { en: 'Family Upright Complete Overhaul', he: 'שיקום פסנתר קיר משפחתי' },
    category: 'upright',
    before: '/images/gallery/family-upright-before.jpg',
    after: '/images/gallery/family-upright-after.jpg',
    year: 2024,
  },
  {
    id: '6',
    title: { en: 'Japanese Grand Import Prep', he: 'הכנת גרנד יפני' },
    category: 'grand',
    before: '/images/gallery/japanese-grand-before.jpg',
    after: '/images/gallery/japanese-grand-after.jpg',
    year: 2023,
  },
];

type Category = 'all' | 'restoration' | 'grand' | 'upright';

export default function GalleryPage() {
  const t = useTranslations('gallery');
  const locale = useLocale() as 'en' | 'he';
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const headingFont =
    locale === 'he' ? 'var(--font-heebo), sans-serif' : 'var(--font-cormorant), serif';

  const categories: { key: Category; label: string }[] = [
    { key: 'all', label: t('category_all') },
    { key: 'restoration', label: t('category_restoration') },
    { key: 'grand', label: t('category_grand') },
    { key: 'upright', label: t('category_upright') },
  ];

  const filtered =
    activeCategory === 'all'
      ? galleryItems
      : galleryItems.filter((i) => i.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end bg-[var(--c-bg)] pt-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.04) 0%, transparent 60%)',
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

      {/* Gallery */}
      <section className="section-padding bg-[var(--c-bg)] border-t border-[var(--c-card)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                className={`text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 border transition-all duration-200 cursor-pointer ${
                  activeCategory === c.key
                    ? 'bg-[var(--c-accent)] text-[var(--c-bg)] border-[var(--c-accent)]'
                    : 'border-[var(--c-border)] text-[var(--c-muted)] hover:border-[var(--c-accent)] hover:text-[var(--c-accent)]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="relative group h-72 overflow-hidden bg-[var(--c-card)] border border-[var(--c-border-lt)] cursor-pointer"
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Before/After placeholder since we don't have real images yet */}
                  <div
                    className="absolute inset-0 flex items-center justify-center transition-all duration-500"
                    style={{
                      background:
                        hoveredId === item.id
                          ? 'linear-gradient(135deg, #1A1A0A 0%, #1C1500 100%)'
                          : 'var(--c-card)',
                    }}
                  >
                    <div className="text-center">
                      <div className="flex gap-3 justify-center mb-4">
                        {[50, 80, 65].map((h, j) => (
                          <div
                            key={j}
                            className="w-7 rounded-b-sm transition-all duration-500"
                            style={{
                              height: `${h}px`,
                              backgroundColor:
                                hoveredId === item.id ? 'var(--c-accent)' : '#2A2A2A',
                              opacity: hoveredId === item.id ? 0.9 : 0.4,
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--c-ultra-dim)] group-hover:text-[var(--c-accent)] transition-colors duration-300">
                        {hoveredId === item.id ? t('after') : t('before')}
                      </p>
                    </div>
                  </div>

                  {/* Info overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-[var(--c-bg)] to-transparent">
                    <p className="text-xs text-[var(--c-accent)] mb-1">{item.year}</p>
                    <p className="text-sm text-[var(--c-text)] font-light">{item.title[locale]}</p>
                  </div>

                  {/* Hover indicator */}
                  <div className="absolute top-4 end-4 text-[10px] tracking-[0.2em] uppercase text-[var(--c-ultra-dim)] group-hover:text-[var(--c-accent)] transition-colors">
                    {hoveredId === item.id ? t('after') : t('before')}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <p className="text-center text-xs text-[var(--c-ultra-dim)] mt-12 tracking-[0.2em] uppercase">
            {locale === 'he'
              ? 'תמונות בפועל יתווספו בקרוב'
              : 'Real project photos coming soon'}
          </p>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
