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
  const locale = useLocale() as 'en' | 'he';
  const isHe = locale === 'he';
  const titleFont = displayFont(isHe);

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
        <EditableText
          entity="workshop_category"
          id={cat.id}
          column="name"
          value={cat.name[locale]}
          label="Category name"
          wrapAs="div"
          className="ms-4 mt-4 sm:ms-8 md:ms-14 lg:ms-24"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
            className="text-5xl leading-[0.98] tracking-tight text-[var(--c-text)] sm:text-6xl lg:text-7xl"
            style={{ fontFamily: titleFont, fontWeight: 500 }}
          >
            {cat.name[locale]}
          </motion.h1>
        </EditableText>

        {/* One-liner description */}
        <EditableText
          entity="workshop_category"
          id={cat.id}
          column="description"
          value={cat.description[locale]}
          multiline
          label="Category description"
          wrapAs="div"
          className="ms-4 mt-5 max-w-2xl sm:ms-8 md:ms-14 lg:ms-24"
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
            className="text-lg leading-relaxed text-[var(--c-dim)]"
          >
            {cat.description[locale]}
          </motion.p>
        </EditableText>

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
                  value={s.name[locale]}
                  label="Service name"
                  wrapAs="div"
                >
                  <h3
                    className="text-lg tracking-tight text-[var(--c-text)] sm:text-xl"
                    style={{ fontFamily: titleFont, fontWeight: 400 }}
                  >
                    {s.name[locale] || (editMode ? 'Untitled service' : '')}
                  </h3>
                </EditableText>
                {(s.description[locale] || editMode) && (
                  <EditableText
                    entity="workshop_service"
                    id={s.id}
                    column="description"
                    value={s.description[locale]}
                    multiline
                    label="Service description"
                    wrapAs="div"
                    className="mt-1.5 max-w-xs"
                  >
                    <p className="text-sm leading-relaxed text-[var(--c-dim)]">
                      {s.description[locale] || (editMode ? 'Add description…' : '')}
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

          {/* Image gallery / carousel */}
          <motion.div {...reveal} className="order-1 md:order-2">
            {images.length > 0 && (
              <ImageCarousel images={images} alt={cat.name[locale]} isHe={isHe} />
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
