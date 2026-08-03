'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Loader2, Plus, Trash2 } from 'lucide-react';
import type { WorkshopCategory } from '@/data/workshopServices';
import ContactCTA from '@/components/sections/ContactCTA';
import ImageCarousel from '@/components/ui/ImageCarousel';
import EditableText from '@/components/admin/EditableText';
import AdminGalleryEditor from '@/components/admin/AdminGalleryEditor';
import { useAdmin } from '@/components/admin/AdminContext';
import { EASE } from '@/lib/motion';
import { displayFont } from '@/lib/fonts';
import { pick, isRtl, type Locale } from '@/lib/i18n';

export default function CategoryView({
  cat,
  prev,
  next,
}: {
  cat: WorkshopCategory;
  prev: WorkshopCategory;
  next: WorkshopCategory;
}) {
  const t = useTranslations('services');
  const locale = useLocale() as Locale;
  const rtl = isRtl(locale);
  const titleFont = displayFont(locale);

  const { editMode } = useAdmin();
  const router = useRouter();
  const [addingService, setAddingService] = useState(false);
  const [deletingService, setDeletingService] = useState<string | null>(null);

  const addService = async () => {
    setAddingService(true);
    try {
      await fetch('/api/admin/service', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ category_id: cat.id }),
      });
      router.refresh();
    } finally {
      setAddingService(false);
    }
  };

  const deleteService = async (id: string) => {
    setDeletingService(id);
    try {
      await fetch(`/api/admin/service/${id}`, { method: 'DELETE' });
      router.refresh();
    } finally {
      setDeletingService(null);
    }
  };

  // Gallery images for the carousel (first is the tile/main image).
  const images = cat.images ?? [];

  // Optional longer intro paragraph (shown above the fixes list).
  const introText = cat.intro ? pick(cat.intro, locale) : '';

  // Break the fixes into two columns once a single column would run taller
  // than the (square) image beside it.
  const twoCols = cat.services.length > 4;

  // Page entrance is handled once by the route template; in-page elements stay
  // static so they don't re-animate ("slide up") while scrolling.
  const reveal = { initial: false as const };

  // Reading-direction aware arrows: "previous" points to the start of the line.
  const BackArrow = rtl ? ChevronRight : ChevronLeft;
  const FwdArrow = rtl ? ChevronLeft : ChevronRight;

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

        {/* Title (label). Margins live on the heading itself — EditableText
            drops its own className outside edit mode, so keeping the indent on
            the wrapper would leave the title flush-left in the public view. */}
        <EditableText
          entity="workshop_category"
          id={cat.id}
          column="name"
          value={cat.name[locale] ?? ''}
          label="Category name"
          wrapAs="div"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
            className="ms-4 mt-4 text-5xl leading-[0.98] tracking-tight text-[var(--c-text)] sm:ms-8 sm:text-6xl md:ms-14 lg:ms-24 lg:text-7xl"
            style={{ fontFamily: titleFont, fontWeight: 500 }}
          >
            {pick(cat.name, locale)}
          </motion.h1>
        </EditableText>

        {/* One row — intro paragraph + fixes on one side, the image on the
            other; both columns start at the same top so the text sits level
            with the top of the image. */}
        <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 md:mt-16 md:grid-cols-2 md:items-start">
          {/* Text column — optional intro paragraph on top, fixes list below */}
          <div className="order-2 ms-4 sm:ms-8 md:order-1 md:ms-14 lg:ms-24">
            {/* Longer description / intro (optional) */}
            {(introText || editMode) && (
              <EditableText
                entity="workshop_category"
                id={cat.id}
                column="intro"
                value={cat.intro?.[locale] ?? ''}
                multiline
                label="Description"
                wrapAs="div"
              >
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
                className="max-w-xl text-lg leading-relaxed text-[var(--c-text)]"
              >
                {introText || (editMode ? 'Add a description…' : '')}
                </motion.p>
              </EditableText>
            )}

            {/* Fixes list */}
            <motion.ul
              {...reveal}
              className={`gap-x-8 gap-y-7 ${introText || editMode ? 'mt-10' : ''} ${
                twoCols ? 'grid grid-cols-1 sm:grid-cols-2' : 'flex flex-col'
              }`}
            >
            {cat.services.map((s) => (
              <li key={s.id} className="relative">
                {editMode && (
                  <button
                    type="button"
                    aria-label="Delete service"
                    onClick={() => deleteService(s.id)}
                    disabled={deletingService === s.id}
                    className="absolute -start-6 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white transition-opacity hover:opacity-90"
                  >
                    {deletingService === s.id ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : (
                      <Trash2 size={11} />
                    )}
                  </button>
                )}
                <EditableText
                  entity="workshop_service"
                  id={s.id}
                  column="name"
                  value={s.name[locale] ?? ''}
                  label="Service name"
                  wrapAs="div"
                >
                  <h3
                    className="text-lg tracking-tight text-[var(--c-text)] sm:text-xl"
                    style={{ fontFamily: titleFont, fontWeight: 400 }}
                  >
                    {pick(s.name, locale) || (editMode ? 'Untitled service' : '')}
                  </h3>
                </EditableText>
                {(pick(s.description, locale) || editMode) && (
                  <EditableText
                    entity="workshop_service"
                    id={s.id}
                    column="description"
                    value={s.description[locale] ?? ''}
                    multiline
                    label="Service description"
                    wrapAs="div"
                    className="mt-1.5 max-w-xs"
                  >
                    <p className="text-sm leading-relaxed text-[var(--c-dim)]">
                      {pick(s.description, locale) || (editMode ? 'Add description…' : '')}
                    </p>
                  </EditableText>
                )}
              </li>
            ))}
            {editMode && (
              <li>
                <button
                  type="button"
                  onClick={addService}
                  disabled={addingService}
                  className="flex items-center gap-2 rounded-full border border-dashed border-neutral-400 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-[var(--c-dim)] transition-colors hover:text-[var(--c-text)] disabled:opacity-50"
                >
                  {addingService ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                  {addingService ? 'Adding' : 'Add service'}
                </button>
              </li>
            )}
            </motion.ul>
          </div>

          {/* Image gallery / carousel */}
          <motion.div {...reveal} className="order-1 md:order-2">
            {images.length > 0 && (
              <ImageCarousel images={images} alt={pick(cat.name, locale)} isHe={rtl} />
            )}
            <AdminGalleryEditor
              entityType="workshop_category"
              entityId={cat.id}
              images={cat.galleryImages ?? []}
              aspect={1}
              label="Category images (first = tile)"
            />
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
              {pick(prev.name, locale)}
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
              {pick(next.name, locale)}
            </span>
            <FwdArrow size={18} className="shrink-0" />
          </Link>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
