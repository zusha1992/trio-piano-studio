'use client';

import { useParams, notFound } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { workshopCategories } from '@/data/workshopServices';
import ContactCTA from '@/components/sections/ContactCTA';
import ImageCarousel from '@/components/ui/ImageCarousel';
import { EASE } from '@/lib/motion';
import { displayFont } from '@/lib/fonts';

export default function CategoryPage() {
  const params = useParams();
  const t = useTranslations('services');
  const locale = useLocale() as 'en' | 'he';
  const isHe = locale === 'he';
  const titleFont = displayFont(isHe);

  const slug = params.category as string;
  const index = workshopCategories.findIndex((c) => c.id === slug);
  if (index === -1) notFound();

  const cat = workshopCategories[index];
  const prev = workshopCategories[(index - 1 + workshopCategories.length) % workshopCategories.length];
  const next = workshopCategories[(index + 1) % workshopCategories.length];

  // Gallery images (falls back to the single tile image for now). Track the
  // travel direction so slides move in/out horizontally instead of fading.
  const images = cat.images?.length ? cat.images : [cat.image];

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
            <ImageCarousel images={images} alt={cat.name[locale]} isHe={isHe} />
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
