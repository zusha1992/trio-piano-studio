'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { shopItems, ShopRegion } from '@/data/shopItems';
import ContactCTA from '@/components/sections/ContactCTA';

const EASE = [0.16, 1, 0.3, 1] as const;

const REGION_LABEL: Record<ShopRegion, { en: string; he: string }> = {
  japan: { en: 'Japan', he: 'יפן' },
  europe: { en: 'Europe', he: 'אירופה' },
  usa: { en: 'USA', he: 'ארה"ב' },
};
const ORIGIN_ICON: Record<ShopRegion, string> = {
  japan: '/images/shop/icons/japan_icon.png',
  europe: '/images/shop/icons/eu_icon.png',
  usa: '/images/shop/icons/usa_icon.png',
};

// Diameter matches the color swatch, bumped by 5px of radius (i.e. +10px).
const SPEC_ICON = 26;

function brandIcon(brand: string): string {
  const b = brand.toLowerCase();
  if (b.includes('yamaha')) return '/images/shop/icons/yamaha_icon.png';
  if (b.includes('kawai')) return '/images/shop/icons/kawai_icon.png';
  return '/images/shop/icons/steinwey_icon.png';
}

// Overlay positions (in % of the illustration box) for the width / height / depth
// labels, tuned to the current placeholder art. When the un-labelled artwork is
// dropped in these just sit where the measurements are drawn.
// Both illustrations share the same three measurements in the same spots
// (upright is the reference layout).
const DIM_POS: Record<'width' | 'height' | 'depth', { top: string; left: string }> = {
  width: { top: '15%', left: '55%' },
  height: { top: '50%', left: '92%' },
  depth: { top: '86%', left: '80%' },
};

export default function PianoPage() {
  const params = useParams();
  const t = useTranslations('store');
  const locale = useLocale() as 'en' | 'he';
  const isHe = locale === 'he';
  const titleFont = isHe ? 'var(--font-rubik), sans-serif' : 'var(--font-arimo), sans-serif';

  const id = params.id as string;
  const index = shopItems.findIndex((p) => p.id === id);
  if (index === -1) notFound();

  const item = shopItems[index];
  const prev = shopItems[(index - 1 + shopItems.length) % shopItems.length];
  const next = shopItems[(index + 1) % shopItems.length];

  // Gallery images — for now reuse neighbouring pianos so the carousel has a
  // few frames to move through. Replaced per-item via `images` when available.
  const images =
    item.images?.length
      ? item.images
      : [
          item.image,
          shopItems[(index + 1) % shopItems.length].image,
          shopItems[(index + 2) % shopItems.length].image,
        ];

  const [[slide, dir], setSlide] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const paginate = (d: number) => {
    setPaused(true);
    setSlide(([s]) => [(s + d + images.length) % images.length, d]);
  };
  const goTo = (i: number) => {
    setPaused(true);
    setSlide(([s]) => [i, i > s ? 1 : -1]);
  };

  useEffect(() => {
    if (paused || fullscreen || images.length <= 1) return;
    const t2 = setInterval(() => setSlide(([s]) => [(s + 1) % images.length, 1]), 5000);
    return () => clearInterval(t2);
  }, [paused, fullscreen, images.length]);

  // Keyboard control while the fullscreen viewer is open.
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false);
      if (e.key === 'ArrowRight') paginate(isHe ? -1 : 1);
      if (e.key === 'ArrowLeft') paginate(isHe ? 1 : -1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullscreen, isHe, images.length]);

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%' }),
    center: { x: '0%' },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%' }),
  };

  const reveal = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.7, ease: EASE },
  } as const;

  const BackArrow = isHe ? ChevronRight : ChevronLeft;
  const FwdArrow = isHe ? ChevronLeft : ChevronRight;

  const typePhrase = t(item.type === 'grand' ? 'type_grand' : 'type_upright');
  const priceText =
    item.price === 'contact' ? t('price_contact') : `₪${item.price.toLocaleString('en-US')}`;
  const description = item.description
    ? item.description[locale]
    : t('desc_fallback', { brand: item.brand, model: item.model, type: typePhrase });

  const specs = [
    {
      label: t('spec_origin'),
      value: (
        <span className="inline-flex items-center gap-2.5">
          <Image
            src={ORIGIN_ICON[item.region]}
            alt=""
            width={SPEC_ICON}
            height={SPEC_ICON}
            className="rounded-full object-cover"
          />
          {REGION_LABEL[item.region][locale]}
        </span>
      ),
    },
    {
      label: t('spec_brand'),
      value: (
        <span className="inline-flex items-center gap-2.5">
          <Image
            src={brandIcon(item.brand)}
            alt=""
            width={SPEC_ICON}
            height={SPEC_ICON}
            className="rounded-full object-cover"
          />
          {item.brand}
        </span>
      ),
    },
    {
      label: t('spec_color'),
      value: (
        <span className="inline-flex items-center gap-2.5">
          <span
            className="inline-block rounded-full border border-[var(--c-border)]"
            style={{ width: SPEC_ICON, height: SPEC_ICON, backgroundColor: item.color.hex }}
          />
          {item.color.name[locale]}
        </span>
      ),
    },
    { label: t('spec_price'), value: priceText },
  ];

  const dims: { key: 'width' | 'height' | 'depth'; value: number }[] = [
    { key: 'width', value: item.dimensions.width },
    { key: 'height', value: item.dimensions.height },
    { key: 'depth', value: item.dimensions.depth },
  ];

  return (
    <>
      <section className="mx-auto max-w-[100rem] px-6 pb-24 pt-32 sm:px-10 md:pt-44 lg:px-16 lg:pt-52">
        {/* Kicker / back to the store */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="ms-4 sm:ms-8 md:ms-14 lg:ms-24"
        >
          <Link
            href={`/${locale}/store`}
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-[color:var(--c-cat)] transition-colors hover:text-[color:var(--c-cat-active)]"
          >
            <BackArrow size={15} />
            {t('back')}
          </Link>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
          className="ms-4 mt-4 text-5xl leading-[0.98] tracking-tight text-[var(--c-text)] sm:ms-8 sm:text-6xl md:ms-14 lg:ms-24 lg:text-7xl"
          style={{ fontFamily: titleFont, fontWeight: 500 }}
        >
          {item.brand} {item.model}
        </motion.h1>

        {/* ID / spec row — full width beneath the title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
          className="ms-4 mt-5 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-8 sm:ms-8 sm:grid-cols-4 md:ms-14 lg:ms-24"
        >
          {specs.map((s, i) => (
            <div key={i}>
              <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[var(--c-ultra-dim)]">
                {s.label}
              </p>
              <div className="text-base text-[var(--c-text)]">{s.value}</div>
            </div>
          ))}
        </motion.div>

        {/* Main part: description + illustration | gallery */}
        <div className="mt-16 grid grid-cols-1 gap-x-14 gap-y-12 md:mt-24 md:grid-cols-2">
          {/* Left — description + size illustration */}
          <motion.div {...reveal} className="order-2 md:order-1">
            <p className="text-base leading-relaxed text-[var(--c-text)]">
              {description}
            </p>

            {/* Size illustration with overlaid values */}
            <div className="relative mt-10 aspect-[928/1131] w-full max-w-[15rem]">
                <Image
                  src={item.type === 'grand' ? '/images/shop/Grand.png' : '/images/shop/Upright.png'}
                  alt=""
                  fill
                  sizes="19rem"
                  className="object-contain"
                  style={{ filter: 'var(--logo-filter)' }}
                />
                {dims.map((d) => {
                  const pos = DIM_POS[d.key];
                  // Fine-tune nudge (px) applied on top of the percentage anchor.
                  const nudgeX = 20;
                  return (
                    <span
                      key={d.key}
                      dir="ltr"
                      style={{
                        top: pos.top,
                        left: pos.left,
                        transform: `translate(calc(-50% + ${nudgeX}px), -50%)`,
                      }}
                      className="absolute whitespace-nowrap rounded bg-[var(--c-bg)] px-1.5 py-0.5 text-xs font-medium text-[var(--c-text)] sm:text-sm"
                    >
                      {d.value} cm
                    </span>
                  );
                })}
              </div>
          </motion.div>

          {/* Right column — carousel (click for fullscreen) */}
          <motion.div {...reveal} className="order-1 md:order-2">
            <div
              className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl bg-[var(--c-bg-alt)] md:aspect-square"
              onClick={() => setFullscreen(true)}
            >
              <AnimatePresence initial={false} custom={dir}>
                <motion.div
                  key={slide}
                  custom={dir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: EASE }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[slide]}
                    alt={`${item.brand} ${item.model}`}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 45vw"
                  />
                </motion.div>
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous"
                    onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                    className="absolute start-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                  >
                    <BackArrow size={20} />
                  </button>
                  <button
                    type="button"
                    aria-label="Next"
                    onClick={(e) => { e.stopPropagation(); paginate(1); }}
                    className="absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                  >
                    <FwdArrow size={20} />
                  </button>

                  <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                    {images.map((img, i) => (
                      <button
                        key={`${img}-${i}`}
                        type="button"
                        aria-label={`Go to image ${i + 1}`}
                        onClick={(e) => { e.stopPropagation(); goTo(i); }}
                        className={`h-1.5 cursor-pointer rounded-full transition-all ${
                          i === slide ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Prev / next piano navigation */}
        <div className="mt-20 flex items-stretch justify-between gap-4 md:mt-28">
          <Link
            href={`/${locale}/store/${prev.id}`}
            className="group flex items-center gap-2 text-[color:var(--c-cat)] transition-colors hover:text-[color:var(--c-cat-active)]"
          >
            <BackArrow size={18} className="shrink-0" />
            <span className="text-sm tracking-tight sm:text-base" style={{ fontFamily: titleFont, fontWeight: 400 }}>
              {prev.brand} {prev.model}
            </span>
          </Link>

          <Link
            href={`/${locale}/store/${next.id}`}
            className="group flex items-center gap-2 text-end text-[color:var(--c-cat)] transition-colors hover:text-[color:var(--c-cat-active)]"
          >
            <span className="text-sm tracking-tight sm:text-base" style={{ fontFamily: titleFont, fontWeight: 400 }}>
              {next.brand} {next.model}
            </span>
            <FwdArrow size={18} className="shrink-0" />
          </Link>
        </div>
      </section>

      {/* Fullscreen image viewer */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
            onClick={() => setFullscreen(false)}
          >
            <button
              onClick={() => setFullscreen(false)}
              aria-label="Close"
              className="absolute right-5 top-5 z-10 cursor-pointer text-white/70 transition-colors hover:text-white"
            >
              <X size={28} strokeWidth={1.5} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); paginate(isHe ? 1 : -1); }}
                  aria-label="Previous"
                  className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer text-white/60 transition-colors hover:text-white"
                >
                  <ChevronLeft size={38} strokeWidth={1.5} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); paginate(isHe ? -1 : 1); }}
                  aria-label="Next"
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-white/60 transition-colors hover:text-white"
                >
                  <ChevronRight size={38} strokeWidth={1.5} />
                </button>
              </>
            )}

            <motion.div
              key={slide}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative h-[85vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[slide]}
                alt={`${item.brand} ${item.model}`}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ContactCTA />
    </>
  );
}
