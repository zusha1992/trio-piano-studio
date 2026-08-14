'use client';

import type { ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ShopItem } from '@/data/shopItems';
import type { BrandOption, OriginOption, ColorOption } from '@/lib/content';
import ContactCTA from '@/components/sections/ContactCTA';
import ImageCarousel from '@/components/ui/ImageCarousel';
import EditableText from '@/components/admin/EditableText';
import AdminGalleryEditor from '@/components/admin/AdminGalleryEditor';
import PianoEditor from '@/components/admin/PianoEditor';
import { useAdmin } from '@/components/admin/AdminContext';
import { EASE } from '@/lib/motion';
import { displayFont } from '@/lib/fonts';
import { pick, isRtl, type Locale } from '@/lib/i18n';

// Diameter matches the color swatch, bumped by 5px of radius (i.e. +10px).
const SPEC_ICON = 26;

// Two illustrations per piano type, shown side by side below the description.
// Each drawing carries the dimension labels it depicts; the overlay chips sit
// on top of the baked-in numbers (positions are % of the illustration box,
// tuned to the current placeholder art) and use the page background so they
// mask the hardcoded values. When the un-labelled artwork is dropped in, the
// chips just sit where the measurement lines are drawn.
type DimKey = 'width' | 'height' | 'depth';
interface DimOverlay {
  key: DimKey;
  top: string;
  left: string;
  /** Left-hand measurements are drawn vertically, so rotate the chip to match. */
  vertical?: boolean;
}
interface Illustration {
  src: string;
  overlays: DimOverlay[];
}

const ILLUSTRATIONS: Record<'grand' | 'upright', Illustration[]> = {
  grand: [
    {
      src: '/images/shop/grand_widthxdepth.webp',
      // Top-down: keyboard on the left, tail to the right. The vertical
      // line across the keys is width; the horizontal line along the body
      // is depth (overall length).
      overlays: [
        { key: 'depth', top: '13%', left: '53%' },
        { key: 'width', top: '50%', left: '8%', vertical: true },
      ],
    },
    {
      src: '/images/shop/grand_height.webp',
      overlays: [{ key: 'height', top: '48%', left: '7%', vertical: true }],
    },
  ],
  upright: [
    {
      src: '/images/shop/upright_widthxheight.webp',
      overlays: [
        { key: 'width', top: '10%', left: '57%' },
        { key: 'height', top: '57%', left: '7%', vertical: true },
      ],
    },
    {
      src: '/images/shop/upright_heightxdepth.webp',
      overlays: [
        { key: 'depth', top: '9%', left: '65%' },
        { key: 'height', top: '55%', left: '30%', vertical: true },
      ],
    },
  ],
};

/**
 * A single piano, shared by the shop and the rental fleet. Rentals differ only
 * in where the page links back to and in carrying no price — the rate depends
 * on the client and the occasion, so it's a conversation, not a spec.
 */
export default function PianoDetail({
  item,
  prev,
  next,
  brands = [],
  origins = [],
  colors = [],
  variant = 'store',
}: {
  item: ShopItem;
  prev: ShopItem;
  next: ShopItem;
  brands?: BrandOption[];
  origins?: OriginOption[];
  colors?: ColorOption[];
  variant?: 'store' | 'rental';
}) {
  const t = useTranslations('store');
  const tv = useTranslations(variant);
  const isRental = variant === 'rental';
  const base = isRental ? 'rental' : 'store';
  const locale = useLocale() as Locale;
  const rtl = isRtl(locale);
  const titleFont = displayFont(locale);
  const { editMode } = useAdmin();

  // Gallery images — every piano ships its own photo set (id-0 … id-N); the
  // representative id-0 leads.
  const images = item.images ?? [];

  // Page entrance is handled once by the route template; in-page elements stay
  // static so they don't re-animate ("slide up") while scrolling.
  const reveal = { initial: false } as const;

  const BackArrow = rtl ? ChevronRight : ChevronLeft;
  const FwdArrow = rtl ? ChevronLeft : ChevronRight;

  const typePhrase = t(item.type === 'grand' ? 'type_grand' : 'type_upright');
  const priceText =
    item.price === 'contact' ? t('price_contact') : `₪${item.price.toLocaleString('en-US')}`;
  const description = item.description
    ? pick(item.description, locale)
    : tv('desc_fallback', { brand: item.brand, model: item.model, type: typePhrase });

  const brandRow = brands.find((b) => b.name.toLowerCase() === item.brand.toLowerCase());
  const brandLogo = brandRow?.logoUrl ?? null;
  const originRow = origins.find((o) => o.id === item.region);
  const originLabel = pick(originRow?.label, locale) || item.region;
  const originIcon = originRow?.flagUrl ?? null;

  // Descriptive facets; serial + price are rendered as a pair (below) so the
  // price never breaks onto its own line when a serial is present.
  const baseSpecs = [
    {
      label: t('spec_origin'),
      value: (
        <span className="inline-flex items-center gap-2.5">
          {originIcon && (
            <Image
              src={originIcon}
              alt=""
              width={SPEC_ICON}
              height={SPEC_ICON}
              className="rounded-full object-cover"
            />
          )}
          {originLabel}
        </span>
      ),
    },
    {
      label: t('spec_brand'),
      value: (
        <span className="inline-flex items-center gap-2.5">
          {brandLogo && (
            <Image
              src={brandLogo}
              alt=""
              width={SPEC_ICON}
              height={SPEC_ICON}
              className="rounded-full object-cover"
            />
          )}
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
          {pick(item.color.name, locale)}
        </span>
      ),
    },
    ...(item.year
      ? [{ label: t('spec_year'), value: <span dir="ltr">{item.year}</span> }]
      : []),
  ];
  // Rentals carry no price — the rate depends on the client and the occasion.
  const priceSpec = isRental ? null : { label: t('spec_price'), value: priceText };

  // One row when everything fits: the base specs plus the serial and/or price.
  // Static classes so Tailwind keeps them.
  const specColCount = baseSpecs.length + (item.serial ? 1 : 0) + (priceSpec ? 1 : 0);
  const specColsCls =
    specColCount >= 6 ? 'sm:grid-cols-6' : specColCount === 5 ? 'sm:grid-cols-5' : 'sm:grid-cols-4';

  const renderSpec = (s: { label: string; value: ReactNode }, key: string | number) => (
    <div key={key}>
      <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[var(--c-ultra-dim)]">
        {s.label}
      </p>
      <div className="text-base text-[var(--c-text)]">{s.value}</div>
    </div>
  );

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
            href={`/${locale}/${base}`}
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-[color:var(--c-cat)] transition-colors hover:text-[color:var(--c-cat-active)]"
          >
            <BackArrow size={15} />
            {tv('back')}
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
          {`${item.brand} ${item.model}`.trim()}
        </motion.h1>

        {item.wip && (
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: EASE }}
            className="ms-4 mt-4 inline-block rounded-full border border-[color:var(--c-cat)] px-4 py-1.5 text-[10px] uppercase tracking-[0.25em] text-[color:var(--c-cat)] sm:ms-8 md:ms-14 lg:ms-24"
          >
            {t('wip_badge')}
          </motion.span>
        )}

        {/* ID / spec row — spans the full content width (same start margin as
            the title, no width cap) so the columns stay wide enough to keep
            every label on a single line. Column count matches the spec count so
            the whole row fits on one line at sm+. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
          className={`ms-4 mt-5 grid grid-cols-2 gap-x-8 gap-y-8 sm:ms-8 md:ms-14 lg:ms-24 ${specColsCls}`}
        >
          {baseSpecs.map((s, i) => renderSpec(s, i))}
          {item.serial && priceSpec ? (
            // Keep serial + price side by side on one line (never split).
            <div className="col-span-2 grid grid-cols-2 gap-x-8">
              {renderSpec({ label: t('spec_serial'), value: item.serial }, 'serial')}
              {renderSpec(priceSpec, 'price')}
            </div>
          ) : (
            <>
              {item.serial && renderSpec({ label: t('spec_serial'), value: item.serial }, 'serial')}
              {priceSpec && renderSpec(priceSpec, 'price')}
            </>
          )}
        </motion.div>

        {editMode && <PianoEditor item={item} brands={brands} origins={origins} colors={colors} />}

        {/* Main part: description + illustration | gallery */}
        <div className="mt-16 grid grid-cols-1 gap-x-14 gap-y-12 md:mt-24 md:grid-cols-2">
          {/* Left — description + size illustration */}
          <motion.div {...reveal} className="order-1">
            {item.wip && (
              <p className="mb-6 rounded-xl border border-[color:var(--c-cat)]/40 bg-[color:var(--c-cat)]/5 px-4 py-3 text-sm leading-relaxed text-[color:var(--c-cat)]">
                {t('wip_notice')}
              </p>
            )}
            <EditableText
              entity="piano"
              id={item.id}
              column="description"
              value={item.description?.[locale] ?? ''}
              multiline
              label="Description"
              wordTarget={{ min: 60, max: 110 }}
              wrapAs="div"
            >
              <p className="text-base leading-relaxed text-[var(--c-text)]">{description}</p>
            </EditableText>
            {(pick(item.details, locale) || editMode) && (
              <EditableText
                entity="piano"
                id={item.id}
                column="details"
                value={item.details?.[locale] ?? ''}
                multiline
                label="Second paragraph"
                wordTarget={{ min: 50, max: 90 }}
                wrapAs="div"
                className="mt-4"
              >
                <p className="text-base leading-relaxed text-[var(--c-muted)]">
                  {pick(item.details, locale) || (editMode ? 'Add a second paragraph…' : '')}
                </p>
              </EditableText>
            )}

            {/* Size illustrations — two views side by side, with the real
                dimension values overlaid on the drawn measurements. The line
                art is inverted in dark mode via --logo-filter. */}
            <div
              className={`mt-10 grid grid-cols-2 ${
                item.type === 'grand' ? 'gap-10 sm:gap-14' : 'gap-4 sm:gap-6'
              }`}
            >
              {ILLUSTRATIONS[item.type === 'grand' ? 'grand' : 'upright'].map((ill) => (
                <div key={ill.src} className="relative aspect-[910/828] w-full">
                  <Image
                    src={ill.src}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 45vw, 12rem"
                    className="object-contain"
                    style={{ filter: 'var(--logo-filter)' }}
                  />
                  {ill.overlays.map((o) => (
                    <span
                      key={o.key}
                      dir="ltr"
                      style={{
                        top: o.top,
                        left: o.left,
                        transform: `translate(-50%, -50%)${o.vertical ? ' rotate(-90deg)' : ''}`,
                      }}
                      className="absolute whitespace-nowrap rounded bg-[var(--c-bg)] px-2 py-0.5 text-sm font-semibold text-[var(--c-text)] sm:text-base"
                    >
                      {item.dimensions[o.key]} cm
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right column — carousel (click for fullscreen) */}
          <motion.div {...reveal} className="order-2">
            {images.length > 0 && (
              <ImageCarousel
                images={images}
                alt={`${item.brand} ${item.model}`}
                isHe={rtl}
                frameClassName="aspect-[4/5] md:aspect-square"
              />
            )}
            <AdminGalleryEditor
              entityType="piano"
              entityId={item.id}
              images={item.galleryImages ?? []}
              label="Piano photos (first = tile)"
            />
          </motion.div>
        </div>

        {/* Prev / next piano navigation */}
        <div className="mt-20 flex items-stretch justify-between gap-4 md:mt-28">
          <Link
            href={`/${locale}/${base}/${prev.id}`}
            className="group flex items-center gap-2 text-[color:var(--c-cat)] transition-colors hover:text-[color:var(--c-cat-active)]"
          >
            <BackArrow size={18} className="shrink-0" />
            <span className="text-sm tracking-tight sm:text-base" style={{ fontFamily: titleFont, fontWeight: 400 }}>
              {`${prev.brand} ${prev.model}`.trim()}
            </span>
          </Link>

          <Link
            href={`/${locale}/${base}/${next.id}`}
            className="group flex items-center gap-2 text-end text-[color:var(--c-cat)] transition-colors hover:text-[color:var(--c-cat-active)]"
          >
            <span className="text-sm tracking-tight sm:text-base" style={{ fontFamily: titleFont, fontWeight: 400 }}>
              {`${next.brand} ${next.model}`.trim()}
            </span>
            <FwdArrow size={18} className="shrink-0" />
          </Link>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
