'use client';

import type { ReactNode } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { shopItems, ShopRegion } from '@/data/shopItems';
import ContactCTA from '@/components/sections/ContactCTA';
import ImageCarousel from '@/components/ui/ImageCarousel';
import { EASE } from '@/lib/motion';
import { displayFont } from '@/lib/fonts';

const REGION_LABEL: Record<ShopRegion, { en: string; he: string }> = {
  japan: { en: 'Japan', he: 'יפן' },
  europe: { en: 'Europe', he: 'אירופה' },
  usa: { en: 'USA', he: 'ארה"ב' },
};
const ORIGIN_ICON: Record<ShopRegion, string> = {
  japan: '/images/shop/icons/japan_icon.webp',
  europe: '/images/shop/icons/eu_icon.webp',
  usa: '/images/shop/icons/usa_icon.webp',
};

// Diameter matches the color swatch, bumped by 5px of radius (i.e. +10px).
const SPEC_ICON = 26;

// Brand logos we ship today. Blüthner and Érard have no icon yet, so we return
// null and simply omit the badge (the brand name still shows).
function brandIcon(brand: string): string | null {
  const b = brand.toLowerCase();
  if (b.includes('yamaha')) return '/images/shop/icons/yamaha_icon.webp';
  if (b.includes('kawai')) return '/images/shop/icons/kawai_icon.webp';
  if (b.includes('steinway')) return '/images/shop/icons/steinwey_icon.webp';
  return null;
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
  const titleFont = displayFont(isHe);

  const id = params.id as string;
  const index = shopItems.findIndex((p) => p.id === id);
  if (index === -1) notFound();

  const item = shopItems[index];
  const prev = shopItems[(index - 1 + shopItems.length) % shopItems.length];
  const next = shopItems[(index + 1) % shopItems.length];

  // Gallery images — every piano ships its own photo set (id-0 … id-N); the
  // representative id-0 leads. Fall back to the single tile image if missing.
  const images = item.images?.length ? item.images : [item.image];

  // Page entrance is handled once by the route template; in-page elements stay
  // static so they don't re-animate ("slide up") while scrolling.
  const reveal = { initial: false } as const;

  const BackArrow = isHe ? ChevronRight : ChevronLeft;
  const FwdArrow = isHe ? ChevronLeft : ChevronRight;

  const typePhrase = t(item.type === 'grand' ? 'type_grand' : 'type_upright');
  const priceText =
    item.price === 'contact' ? t('price_contact') : `₪${item.price.toLocaleString('en-US')}`;
  const description = item.description
    ? item.description[locale]
    : t('desc_fallback', { brand: item.brand, model: item.model, type: typePhrase });
  const brandLogo = brandIcon(item.brand);

  // Descriptive facets; serial + price are rendered as a pair (below) so the
  // price never breaks onto its own line when a serial is present.
  const baseSpecs = [
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
          {item.color.name[locale]}
        </span>
      ),
    },
  ];
  const priceSpec = { label: t('spec_price'), value: priceText };

  const renderSpec = (s: { label: string; value: ReactNode }, key: string | number) => (
    <div key={key}>
      <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[var(--c-ultra-dim)]">
        {s.label}
      </p>
      <div className="text-base text-[var(--c-text)]">{s.value}</div>
    </div>
  );

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
          className={`ms-4 mt-5 grid grid-cols-2 gap-x-8 gap-y-8 sm:ms-8 md:ms-14 lg:ms-24 ${
            item.serial ? 'sm:grid-cols-5' : 'sm:grid-cols-4'
          }`}
        >
          {baseSpecs.map((s, i) => renderSpec(s, i))}
          {item.serial ? (
            // Keep serial + price side by side on one line (never split).
            <div className="col-span-2 grid grid-cols-2 gap-x-8">
              {renderSpec({ label: t('spec_serial'), value: item.serial }, 'serial')}
              {renderSpec(priceSpec, 'price')}
            </div>
          ) : (
            renderSpec(priceSpec, 'price')
          )}
        </motion.div>

        {/* Main part: description + illustration | gallery */}
        <div className="mt-16 grid grid-cols-1 gap-x-14 gap-y-12 md:mt-24 md:grid-cols-2">
          {/* Left — description + size illustration */}
          <motion.div {...reveal} className="order-1">
            {item.wip && (
              <p className="mb-6 rounded-xl border border-[color:var(--c-cat)]/40 bg-[color:var(--c-cat)]/5 px-4 py-3 text-sm leading-relaxed text-[color:var(--c-cat)]">
                {t('wip_notice')}
              </p>
            )}
            <p className="text-base leading-relaxed text-[var(--c-text)]">
              {description}
            </p>

            {/* Size illustration with overlaid values */}
            <div className="relative mt-10 aspect-[928/1131] w-full max-w-[15rem] mx-auto md:mx-0">
                <Image
                  src={item.type === 'grand' ? '/images/shop/Grand.webp' : '/images/shop/Upright.webp'}
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
          <motion.div {...reveal} className="order-2">
            <ImageCarousel
              images={images}
              alt={`${item.brand} ${item.model}`}
              isHe={isHe}
              frameClassName="aspect-[4/5] md:aspect-square"
            />
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
              {`${prev.brand} ${prev.model}`.trim()}
            </span>
          </Link>

          <Link
            href={`/${locale}/store/${next.id}`}
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
