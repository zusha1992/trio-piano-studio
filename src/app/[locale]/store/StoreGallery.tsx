'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import type { ShopItem, ShopType, ShopRegion } from '@/data/shopItems';
import type { OriginOption } from '@/lib/content';
import ContactCTA from '@/components/sections/ContactCTA';
import { useAdmin } from '@/components/admin/AdminContext';
import { EASE } from '@/lib/motion';
import { displayFont } from '@/lib/fonts';

const MotionLink = motion.create(Link);

// Tile shape is driven by the instrument type, not by position: grand pianos
// are landscape by nature so they take the wide, horizontal cells, while
// uprights sit in square cells (their landscape photo is center-cropped by
// object-cover). `grid-auto-flow: dense` then back-fills any gaps left by the
// mix of 1- and 2-column tiles.
//
// On the 3-col desktop grid we alternate which pair of columns each successive
// wide grand occupies (1–2, then 2–3, …) via col-start, so the grands don't all
// hug the same side — the rhythm reads uneven/editorial.
const tileClass = (type: ShopType, grandIndex: number) =>
  type === 'grand'
    ? `col-span-2 aspect-[16/10] md:col-span-2 md:aspect-auto ${
        grandIndex % 2 === 0 ? 'md:col-start-1' : 'md:col-start-2'
      }`
    : 'col-span-1 aspect-square md:col-span-1 md:aspect-auto';

const TYPE_LABEL: Record<ShopType, { en: string; he: string }> = {
  grand: { en: 'Grand', he: 'כנף' },
  upright: { en: 'Upright', he: 'קיר' },
};

const TYPES: ShopType[] = ['grand', 'upright'];

export default function StoreGallery({
  pianos,
  origins = [],
}: {
  pianos: ShopItem[];
  origins?: OriginOption[];
}) {
  const t = useTranslations('store');
  const locale = useLocale() as 'en' | 'he';

  // Region filter facets come from the origins library, limited to those that
  // actually have inventory, in library order.
  const present = new Set(pianos.map((p) => p.region));
  const REGIONS: ShopRegion[] = origins.filter((o) => present.has(o.id)).map((o) => o.id);
  const REGION_LABEL: Record<string, { en: string; he: string }> = Object.fromEntries(
    origins.map((o) => [o.id, o.label]),
  );
  const isHe = locale === 'he';
  // Multi-select facets: type (grand/upright) and region. Empty = "All".
  // Within a facet the selections are OR'd; the two facets are AND'd together.
  const [types, setTypes] = useState<ShopType[]>([]);
  const [regions, setRegions] = useState<ShopRegion[]>([]);

  const { editMode } = useAdmin();
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const addPiano = async () => {
    setAdding(true);
    try {
      const res = await fetch('/api/admin/piano', { method: 'POST' });
      const data = (await res.json()) as { id?: string };
      if (data.id) router.push(`/${locale}/store/${data.id}`);
      else router.refresh();
    } finally {
      setAdding(false);
    }
  };
  const deletePiano = async (id: string) => {
    if (!window.confirm('Delete this piano? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/piano/${id}`, { method: 'DELETE' });
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  };

  const titleFont = displayFont(isHe);
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
    const base = pianos.filter((p) => regions.length === 0 || regions.includes(p.region));
    return new Set(base.map((p) => p.type));
  }, [pianos, regions]);
  const availableRegions = useMemo(() => {
    const base = pianos.filter((p) => types.length === 0 || types.includes(p.type));
    return new Set(base.map((p) => p.region));
  }, [pianos, types]);

  const toggleType = (v: ShopType) => {
    const next = types.includes(v) ? types.filter((x) => x !== v) : [...types, v];
    setTypes(next);
    // Drop any selected region that no longer has items under the new types.
    setRegions((rs) =>
      rs.filter((r) => pianos.some((p) => (next.length === 0 || next.includes(p.type)) && p.region === r)),
    );
  };
  const toggleRegion = (v: ShopRegion) => {
    const next = regions.includes(v) ? regions.filter((x) => x !== v) : [...regions, v];
    setRegions(next);
    setTypes((ts) =>
      ts.filter((t2) => pianos.some((p) => (next.length === 0 || next.includes(p.region)) && p.type === t2)),
    );
  };

  const items = useMemo(
    () =>
      pianos.filter(
        (p) =>
          (types.length === 0 || types.includes(p.type)) &&
          (regions.length === 0 || regions.includes(p.region)),
      ),
    [pianos, types, regions],
  );

  // Pair each visible item with its tile classes, alternating the side of every
  // successive wide grand (see tileClass).
  const tiles = useMemo(() => {
    let grandIndex = 0;
    return items.map((item) => ({
      item,
      cls: tileClass(item.type, item.type === 'grand' ? grandIndex++ : 0),
    }));
  }, [items]);

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

        {/* Editorial asymmetric gallery — grands wide, uprights square */}
        <div className="mt-12 grid grid-cols-2 gap-3 [grid-auto-flow:dense] sm:gap-4 md:mt-16 md:grid-cols-3 md:auto-rows-[24rem] lg:auto-rows-[30rem]">
          <AnimatePresence mode="popLayout">
            {tiles.map(({ item, cls }) => (
              <MotionLink
                key={item.id}
                href={`/${locale}/store/${item.id}`}
                layout
                initial={false}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className={`group relative block cursor-pointer overflow-hidden rounded-2xl bg-[var(--c-bg-alt)] ${cls}`}
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

                {/* Work-in-progress badge — restored pianos not yet for sale. */}
                {item.wip && (
                  <span className="pointer-events-none absolute start-3 top-3 rounded-full bg-[var(--c-bg)]/90 px-3 py-1 text-[9px] uppercase tracking-[0.22em] text-[var(--c-text)] backdrop-blur-sm sm:text-[10px]">
                    {t('wip_badge')}
                  </span>
                )}

                {editMode && (
                  <>
                    {item.published === false && (
                      <span className="pointer-events-none absolute end-3 top-3 rounded bg-amber-400 px-2 py-0.5 text-[9px] uppercase tracking-wide text-black">
                        draft
                      </span>
                    )}
                    <button
                      type="button"
                      aria-label="Delete piano"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deletePiano(item.id);
                      }}
                      className="absolute bottom-3 end-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow transition-opacity hover:opacity-90"
                    >
                      {deletingId === item.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </>
                )}

                {/* Minimal details + reveal-up CTA */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center px-3 pb-7 text-center">
                  <div className="transition-transform duration-500 ease-out md:group-hover:-translate-y-14">
                    <h3
                      className="text-base uppercase leading-tight tracking-[0.15em] text-white md:text-lg"
                      style={{ fontFamily: titleFont, fontWeight: 400 }}
                    >
                      {`${item.brand} ${item.model}`.trim()}
                    </h3>
                    <p
                      dir="ltr"
                      className="mt-1 text-[11px] uppercase tracking-[0.25em] text-white/85"
                      style={{ fontFamily: 'var(--font-rubik), sans-serif', fontWeight: 300 }}
                    >
                      {`${item.serial ? `${item.serial} · ` : ''}${item.dimensions.width} × ${item.dimensions.height} cm`}
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

          {editMode && (
            <button
              type="button"
              onClick={addPiano}
              disabled={adding}
              className="col-span-1 flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-neutral-300 text-neutral-400 transition-colors hover:border-neutral-500 hover:text-neutral-600 md:aspect-auto"
            >
              {adding ? <Loader2 size={28} className="animate-spin" /> : <Plus size={28} />}
              <span className="text-[11px] uppercase tracking-[0.25em]">
                {adding ? 'Creating' : 'Add piano'}
              </span>
            </button>
          )}
        </div>

        {items.length === 0 && !editMode && (
          <p className="py-20 text-center text-sm text-[var(--c-ultra-dim)]">{t('empty')}</p>
        )}
      </section>

      <ContactCTA />
    </>
  );
}
