'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  const paginate = (d: number) => {
    setPaused(true);
    setSlide([(slide + d + images.length) % images.length, d]);
  };
  const goTo = (i: number) => {
    setPaused(true);
    setSlide([i, i > slide ? 1 : -1]);
  };

  useEffect(() => {
    if (paused || images.length <= 1) return;
    const id = setInterval(() => setSlide(([s]) => [(s + 1) % images.length, 1]), 5000);
    return () => clearInterval(id);
  }, [paused, images.length]);

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%' }),
    center: { x: '0%' },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%' }),
  };

  // Break the fixes into two columns once a single column would run taller
  // than the (square) image beside it.
  const twoCols = cat.services.length > 4;

  const reveal = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.7, ease: EASE },
  };

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
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--c-bg-alt)]">
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
                    onClick={() => paginate(-1)}
                    className="absolute start-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                  >
                    <BackArrow size={20} />
                  </button>
                  <button
                    type="button"
                    aria-label="Next"
                    onClick={() => paginate(1)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                  >
                    <FwdArrow size={20} />
                  </button>

                  <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                    {images.map((img, i) => (
                      <button
                        key={img}
                        type="button"
                        aria-label={`Go to image ${i + 1}`}
                        onClick={() => goTo(i)}
                        className={`h-1.5 rounded-full transition-all ${
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

      <ContactCTA />
    </>
  );
}
