'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { workshopCategories } from '@/data/workshopServices';
import ContactCTA from '@/components/sections/ContactCTA';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function CategoryPage() {
  const params = useParams();
  const t = useTranslations('services');
  const locale = useLocale() as 'en' | 'he';
  const isHe = locale === 'he';
  const titleFont = isHe ? 'var(--font-rubik), sans-serif' : 'var(--font-arimo), sans-serif';

  const slug = params.category as string;
  const index = workshopCategories.findIndex((c) => c.id === slug);
  if (index === -1) notFound();

  const cat = workshopCategories[index];
  const prev = workshopCategories[(index - 1 + workshopCategories.length) % workshopCategories.length];
  const next = workshopCategories[(index + 1) % workshopCategories.length];

  // Gallery images (falls back to the single tile image for now). Track the
  // travel direction so slides move in/out horizontally instead of fading.
  const images = cat.images?.length ? cat.images : [cat.image];
  const [[slide, dir], setSlide] = useState<[number, number]>([0, 0]);
  // Auto-advance stops for good once the visitor takes manual control.
  const [paused, setPaused] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const paginate = (d: number) => {
    setPaused(true);
    setSlide([(slide + d + images.length) % images.length, d]);
  };
  const goTo = (i: number) => {
    setPaused(true);
    setSlide([i, i > slide ? 1 : -1]);
  };

  useEffect(() => {
    if (paused || fullscreen || images.length <= 1) return;
    const id = setInterval(() => setSlide(([s]) => [(s + 1) % images.length, 1]), 5000);
    return () => clearInterval(id);
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
  }, [fullscreen, isHe, slide, images.length]);

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%' }),
    center: { x: '0%' },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%' }),
  };

  // Break the fixes into two columns once a single column would run taller
  // than the (square) image beside it.
  const twoCols = cat.services.length > 4;

  // Page entrance is handled once by the route template; in-page elements stay
  // static so they don't re-animate ("slide up") while scrolling.
  const reveal = { initial: false as const };

  // Reading-direction aware arrows: "previous" points to the start of the line.
  const BackArrow = isHe ? ChevronRight : ChevronLeft;
  const FwdArrow = isHe ? ChevronLeft : ChevronRight;

  return (
    <>
      <section className="mx-auto max-w-[100rem] px-6 pb-24 pt-32 sm:px-10 md:pt-44 lg:px-16 lg:pt-52">
        {/* Kicker / back to the workshop */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="ms-4 sm:ms-8 md:ms-14 lg:ms-24"
        >
          <Link
            href={`/${locale}/services`}
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-[color:var(--c-cat)] transition-colors hover:text-[color:var(--c-cat-active)]"
          >
            <BackArrow size={15} />
            {t('hero_title')}
          </Link>
        </motion.div>

        {/* Title (label) */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
          className="ms-4 mt-4 text-5xl leading-[0.98] tracking-tight text-[var(--c-text)] sm:ms-8 sm:text-6xl md:ms-14 lg:ms-24 lg:text-7xl"
          style={{ fontFamily: titleFont, fontWeight: 500 }}
        >
          {cat.name[locale]}
        </motion.h1>

        {/* One-liner description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
          className="ms-4 mt-5 max-w-2xl text-lg leading-relaxed text-[var(--c-dim)] sm:ms-8 md:ms-14 lg:ms-24"
        >
          {cat.description[locale]}
        </motion.p>

        {/* One row — fixes list on one side, image gallery on the other. The
            fixes list splits into two columns when the category has many. */}
        <div className="mt-16 grid grid-cols-1 gap-x-12 gap-y-10 md:mt-24 md:grid-cols-2 md:items-center">
          {/* Fixes list */}
          <motion.ul
            {...reveal}
            className={`order-2 gap-x-8 gap-y-7 md:order-1 ${
              twoCols ? 'grid grid-cols-1 sm:grid-cols-2' : 'flex flex-col'
            }`}
          >
            {cat.services.map((s) => (
              <li key={s.id}>
                <h3
                  className="text-lg tracking-tight text-[var(--c-text)] sm:text-xl"
                  style={{ fontFamily: titleFont, fontWeight: 400 }}
                >
                  {s.name[locale]}
                </h3>
                <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-[var(--c-dim)]">
                  {s.description[locale]}
                </p>
              </li>
            ))}
          </motion.ul>

          {/* Image gallery / carousel */}
          <motion.div {...reveal} className="order-1 md:order-2">
            <div
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl bg-[var(--c-bg-alt)]"
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
                    alt={cat.name[locale]}
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
                        key={img}
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

        {/* Prev / next category navigation */}
        <div className="mt-20 flex items-stretch justify-between gap-4 md:mt-28">
          <Link
            href={`/${locale}/services/${prev.id}`}
            className="group flex items-center gap-2 text-[color:var(--c-cat)] transition-colors hover:text-[color:var(--c-cat-active)]"
          >
            <BackArrow size={18} className="shrink-0" />
            <span
              className="text-sm tracking-tight sm:text-base"
              style={{ fontFamily: titleFont, fontWeight: 400 }}
            >
              {prev.name[locale]}
            </span>
          </Link>

          <Link
            href={`/${locale}/services/${next.id}`}
            className="group flex items-center gap-2 text-end text-[color:var(--c-cat)] transition-colors hover:text-[color:var(--c-cat-active)]"
          >
            <span
              className="text-sm tracking-tight sm:text-base"
              style={{ fontFamily: titleFont, fontWeight: 400 }}
            >
              {next.name[locale]}
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
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) paginate(1);
                else if (info.offset.x > 60) paginate(-1);
              }}
              className="relative h-[85vh] w-full max-w-5xl touch-pan-y"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[slide]}
                alt={cat.name[locale]}
                fill
                sizes="90vw"
                draggable={false}
                className="pointer-events-none object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ContactCTA />
    </>
  );
}
