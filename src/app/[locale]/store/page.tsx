'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { shopItems, ShopType, ShopRegion } from '@/data/shopItems';
import ContactCTA from '@/components/sections/ContactCTA';

const MotionLink = motion.create(Link);

// Organized-but-varied rhythm on the 3-col desktop grid. Purely positional so
// it works for any number of items (see shopItems). Repeats every 7 tiles as
// three row types that each fill the 3 columns exactly:
//   row A: [wide-left (2) | single]
//   row B: [single | single | single]
//   row C: [single | wide-right (2)]
const TILE_SPANS = [
  'md:col-span-2', // A
  'md:col-span-1',
  'md:col-span-1', // B
  'md:col-span-1',
  'md:col-span-1',
  'md:col-span-1', // C
  'md:col-span-2',
];

const TYPE_LABEL: Record<ShopType, { en: string; he: string }> = {
  grand: { en: 'Grand', he: 'כנף' },
  upright: { en: 'Upright', he: 'קיר' },
};

const TYPES: ShopType[] = ['grand', 'upright'];

const REGIONS: ShopRegion[] = ['japan', 'europe', 'usa'];
const REGION_LABEL: Record<ShopRegion, { en: string; he: string }> = {
  japan: { en: 'Japan', he: 'יפן' },
  europe: { en: 'Europe', he: 'אירופה' },
  usa: { en: 'USA', he: 'ארה"ב' },
};

export default function StorePage() {
  const t = useTranslations('store');
  const locale = useLocale() as 'en' | 'he';
  const isHe = locale === 'he';
  // Multi-select facets: type (grand/upright) and region. Empty = "All".
  // Within a facet the selections are OR'd; the two facets are AND'd together.
  const [types, setTypes] = useState<ShopType[]>([]);
  const [regions, setRegions] = useState<ShopRegion[]>([]);

  const titleFont = isHe ? 'var(--font-rubik), sans-serif' : 'var(--font-arimo), sans-serif';
  // Delicate serif for the descriptor line (Hebrew has no serif → soft sans).
  const allActive = types.length === 0 && regions.length === 0;
  const clearAll = () => {
    setTypes([]);
    setRegions([]);
  };

  // Which options still yield results given the *other* facet's selection, so we
  // can grey out (disable) combinations we don't stock — e.g. a region with no
  // grands once "Grand" is chosen.
  const availableTypes = useMemo(() => {
    const base = shopItems.filter((p) => regions.length === 0 || regions.includes(p.region));
    return new Set(base.map((p) => p.type));
  }, [regions]);
  const availableRegions = useMemo(() => {
    const base = shopItems.filter((p) => types.length === 0 || types.includes(p.type));
    return new Set(base.map((p) => p.region));
  }, [types]);

  const toggleType = (v: ShopType) => {
    const next = types.includes(v) ? types.filter((x) => x !== v) : [...types, v];
    setTypes(next);
    // Drop any selected region that no longer has items under the new types.
    setRegions((rs) =>
      rs.filter((r) => shopItems.some((p) => (next.length === 0 || next.includes(p.type)) && p.region === r)),
    );
  };
  const toggleRegion = (v: ShopRegion) => {
    const next = regions.includes(v) ? regions.filter((x) => x !== v) : [...regions, v];
    setRegions(next);
    setTypes((ts) =>
      ts.filter((t2) => shopItems.some((p) => (next.length === 0 || next.includes(p.region)) && p.type === t2)),
    );
  };

  const items = useMemo(
    () =>
      shopItems.filter(
        (p) =>
          (types.length === 0 || types.includes(p.type)) &&
          (regions.length === 0 || regions.includes(p.region)),
      ),
    [types, regions],
  );

  return (
    <>
      <section className="mx-auto max-w-[100rem] px-6 pb-20 pt-32 sm:px-10 md:pt-44 lg:px-16 lg:pt-52">
        {/* Title row — big heading (indented from the gallery edge), filters
            bottom-aligned on the right */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="ms-4 text-6xl leading-[0.95] tracking-tight text-[var(--c-text)] sm:ms-8 sm:text-7xl md:ms-14 lg:ms-24 lg:text-8xl"
            style={{ fontFamily: titleFont, fontWeight: 500 }}
          >
            {t('hero_title')}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap gap-2 md:max-w-[42rem] md:justify-end md:pb-3"
          >
            {[
              // "All" is a desktop-only convenience — on mobile the chips are
              // clear enough and deselecting everything already shows all.
              { key: 'all', label: t('filter_all'), active: allActive, disabled: false, onClick: clearAll, extra: 'hidden lg:inline-block' },
              ...TYPES.map((tp) => ({
                key: tp,
                label: TYPE_LABEL[tp][locale],
                active: types.includes(tp),
                disabled: !availableTypes.has(tp),
                onClick: () => toggleType(tp),
                extra: '',
              })),
              ...REGIONS.map((r) => ({
                key: r,
                label: REGION_LABEL[r][locale],
                active: regions.includes(r),
                disabled: !availableRegions.has(r),
                onClick: () => toggleRegion(r),
                extra: '',
              })),
            ].map((f) => (
              <button
                key={f.key}
                onClick={f.onClick}
                disabled={f.disabled}
                className={`rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${f.extra} ${
                  f.disabled
                    ? 'cursor-not-allowed border-[var(--c-border-lt)] text-[var(--c-ultra-dim)] opacity-50'
                    : f.active
                      ? 'cursor-pointer border-[var(--c-text)] bg-[var(--c-text)] text-[var(--c-bg)]'
                      : 'cursor-pointer border-[var(--c-border)] text-[var(--c-dim)] hover:border-[var(--c-text)] hover:text-[var(--c-text)]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Editorial asymmetric gallery */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:mt-16 md:grid-cols-3 md:auto-rows-[24rem] lg:auto-rows-[30rem]">
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => (
              <MotionLink
                key={item.id}
                href={`/${locale}/store/${item.id}`}
                layout
                initial={false}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative block aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl bg-[var(--c-bg-alt)] md:aspect-auto ${
                  TILE_SPANS[i % TILE_SPANS.length]
                }`}
              >
                <Image
                  src={item.image}
                  alt={`${item.brand} ${item.model}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover object-center"
                />

                {/* Legibility scrim — constant, keeps the labels readable. */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent opacity-80" />

                {/* Minimal details + reveal-up CTA */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center px-3 pb-7 text-center">
                  <div className="transition-transform duration-500 ease-out md:group-hover:-translate-y-14">
                    <h3
                      className="text-base uppercase leading-tight tracking-[0.15em] text-white md:text-lg"
                      style={{ fontFamily: titleFont, fontWeight: 400 }}
                    >
                      {item.brand}
                    </h3>
                    <p
                      className="mt-1 text-[11px] uppercase tracking-[0.25em] text-white/85"
                      style={{ fontFamily: 'var(--font-rubik), sans-serif', fontWeight: 300 }}
                    >
                      {item.model} — {item.size}
                    </p>
                  </div>

                  {/* Button revealed upward from behind, using our slide-in reveal */}
                  <div className="absolute bottom-7 overflow-hidden">
                    <span className="block translate-y-full bg-white px-6 py-2.5 text-[10px] uppercase tracking-[0.25em] text-black opacity-0 transition-all duration-500 ease-out md:group-hover:translate-y-0 md:group-hover:opacity-100">
                      {t('learn_more')}
                    </span>
                  </div>
                </div>
              </MotionLink>
            ))}
          </AnimatePresence>
        </div>

        {items.length === 0 && (
          <p className="py-20 text-center text-sm text-[var(--c-ultra-dim)]">{t('empty')}</p>
        )}
      </section>

      <ContactCTA />
    </>
  );
}
