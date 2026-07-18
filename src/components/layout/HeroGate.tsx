'use client';

import { Fragment, useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useGate } from '@/components/layout/GateContext';
import LogoLoader from '@/components/layout/LogoLoader';

/* ── Slanted seam geometry (percent of viewport width) ──────────────
   Image sits on the left, logo/categories on the right. The seam leans
   like "\": wider image up top, wider text area toward the bottom. The
   angle is the gap between the top and bottom x-positions — smaller gap
   means a more vertical (less slanted) cut.                              */
const SEAM_OPTIONS: { label: string; top: number; bottom: number }[] = [
  { label: 'Subtle', top: 52, bottom: 48 },
  { label: 'Gentle', top: 54, bottom: 46 },
  { label: 'Medium', top: 56, bottom: 44 },
];

function seamClips(top: number, bottom: number) {
  return {
    left: `polygon(0 0, ${top}% 0, ${bottom}% 100%, 0 100%)`,
    right: `polygon(${top}% 0, 100% 0, 100% 100%, ${bottom}% 100%)`,
  };
}

const GATE_EASE = [0.83, 0, 0.17, 1] as const;
const GATE_DURATION = 0.95;

interface Category {
  key: string;
  href: string;
  labelHe: string;
  labelEn: string;
  descHe: string;
  descEn: string;
  img: string;
}

const CATEGORIES: Category[] = [
  {
    key: 'about',
    href: 'about',
    labelHe: 'על הסטודיו',
    labelEn: 'About Us',
    descHe: 'המקום שבו מלאכת יד, תרבות ומוזיקה חיה נפגשים תחת קורת גג אחת.',
    descEn: 'Where craftsmanship, culture, and living music meet under one roof.',
    img: '/images/cat-about.jpg',
  },
  {
    key: 'services',
    href: 'services',
    labelHe: 'בית המלאכה',
    labelEn: 'The Workshop',
    descHe: 'שיקום פסנתרים ברמה הגבוהה ביותר — החזרת הצליל, האופי והחיים לכל כלי.',
    descEn: 'Piano restoration at the highest level — restoring the sound, character, and life of every instrument.',
    img: '/images/cat-workshop.jpg',
  },
  {
    key: 'store',
    href: 'store',
    labelHe: 'החנות',
    labelEn: 'The Store',
    descHe: 'מבחר פסנתרים נבחרים, משוחזרים ומיובאים, שנבדקו והוכנו בקפידה.',
    descEn: 'A curated selection of restored and imported pianos, carefully inspected and prepared.',
    img: '/images/cat-store.jpg',
  },
  {
    key: 'concerts',
    href: 'concerts',
    labelHe: 'קונצרטים',
    labelEn: 'Concerts',
    descHe: 'קונצרטים אינטימיים סביב הפסנתרים עצמם — מוזיקה חיה מקרוב.',
    descEn: 'Intimate concerts built around the pianos themselves — live music up close.',
    img: '/images/cat-concerts.jpg',
  },
];

/* ── Right-panel background options (temporary iteration toggle) ────────
   Solids and gradients to preview live via the on-screen switcher. Once a
   favourite is chosen this list and the switcher can be removed.            */
const BG_OPTIONS: { label: string; value: string }[] = [
  { label: 'Current', value: 'var(--c-bg-alt)' },
  // Progressively warmer / deeper solids
  { label: 'Warm sand', value: '#ECE1CE' },
  { label: 'Clay beige', value: '#E4D4BC' },
  { label: 'Tan', value: '#DECAAC' },
  { label: 'Warm taupe', value: '#D6C3A8' },
  { label: 'Caramel', value: '#D8BE9B' },
  { label: 'Terracotta tint', value: '#DFC1A6' },
  { label: 'Dusty clay', value: '#D2B598' },
  // Bolder warm gradients
  { label: 'Warm fade', value: 'linear-gradient(160deg, #F0E4D0 0%, #D6BB97 100%)' },
  { label: 'Sunset sand', value: 'linear-gradient(135deg, #F2E4CB 0%, #D8B48F 100%)' },
  { label: 'Deep ochre', value: 'linear-gradient(160deg, #E7D2AF 0%, #C7A87F 100%)' },
  { label: 'Warm glow', value: 'radial-gradient(130% 120% at 85% 15%, #F4E7CF 0%, #CFAF86 100%)' },
];

const DEFAULT_IMG = '/images/hero-default.jpg';

// All hero images, rendered layered so they are decoded/cached up front and
// switching between them is an instant crossfade with no loading lag.
const ALL_IMAGES = [DEFAULT_IMG, ...CATEGORIES.map((c) => c.img)];

const SWAP_DURATION = 0.6;
const SWAP_EASE = [0.16, 1, 0.3, 1] as const;

interface Contact {
  icon: string;
  labelHe: string;
  labelEn: string;
  href: string;
  external?: boolean;
}

const MAPS_URL =
  'https://www.google.com/maps/place/Yad+Harutsim+St+16,+Jerusalem/@31.7519227,35.2136965,17z/data=!3m1!4b1!4m6!3m5!1s0x1503281e479e1845:0x71df54fdd9c2bb4e!8m2!3d31.7519227!4d35.2162768!16s%2Fg%2F11ghfqf26s?entry=ttu';

const CONTACTS: Contact[] = [
  {
    icon: 'phone-solid-full.svg',
    labelHe: '0543-337-341',
    labelEn: '0543-337-341',
    href: 'https://wa.me/972543337341',
    external: true,
  },
  {
    icon: 'envelope-solid-full.svg',
    labelHe: 'trio.piano.studio@gmail.com',
    labelEn: 'trio.piano.studio@gmail.com',
    href: 'mailto:trio.piano.studio@gmail.com',
  },
  {
    icon: 'instagram-logo-fill-svgrepo-com.svg',
    labelHe: 'trio.piano.studio',
    labelEn: 'trio.piano.studio',
    href: 'https://www.instagram.com/trio.piano.studio/',
    external: true,
  },
  {
    icon: 'location-dot-solid-full.svg',
    labelHe: 'יד חרוצים 16, ירושלים',
    labelEn: 'Yad Harutzim 16, Jerusalem',
    href: MAPS_URL,
    external: true,
  },
];

// Renders a monochrome SVG icon tinted with the current text color, so it can
// respond to hover/theme just like the label next to it.
function ContactIcon({ src }: { src: string }) {
  return (
    <span
      aria-hidden
      className="inline-block h-[15px] w-[15px] shrink-0 bg-current"
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
      }}
    />
  );
}

export default function HeroGate() {
  const locale = useLocale();
  const isHe = locale === 'he';
  const otherLocale = isHe ? 'en' : 'he';
  const pathname = usePathname();
  const router = useRouter();
  const gate = useGate();
  const homeClosing = gate?.homeClosing ?? false;

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  const [ready, setReady] = useState(false);
  const [opening, setOpening] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [bgIndex, setBgIndex] = useState(0);
  const [seamIndex, setSeamIndex] = useState(1);

  const { left: leftClip, right: rightClip } = seamClips(
    SEAM_OPTIONS[seamIndex].top,
    SEAM_OPTIONS[seamIndex].bottom,
  );

  const activeCat = CATEGORIES.find((c) => c.key === active) ?? null;
  const currentImg = activeCat?.img ?? DEFAULT_IMG;

  // Prefetch destination pages so the reveal shows a loaded page.
  useEffect(() => {
    CATEGORIES.forEach((c) => router.prefetch(`/${locale}/${c.href}`));
  }, [locale, router]);

  // Loading phase: preload every hero image so the curtain reveals a fully
  // decoded scene, while the LogoLoader assembles and blinks. Enforce a minimum
  // display time so the assembly animation always gets to finish.
  useEffect(() => {
    if (ready) return;
    let cancelled = false;
    const start = Date.now();
    const MIN_MS = 2000;

    Promise.all(
      ALL_IMAGES.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new window.Image();
            img.onload = img.onerror = () => resolve();
            img.src = src;
          }),
      ),
    ).then(() => {
      if (cancelled) return;
      const wait = Math.max(0, MIN_MS - (Date.now() - start));
      setTimeout(() => {
        if (!cancelled) setReady(true);
      }, wait);
    });

    return () => {
      cancelled = true;
    };
  }, [ready]);

  // Once we've arrived home, drop the transient opening/closing states.
  useEffect(() => {
    if (isHome) {
      setOpening(false);
      gate?.clearCloseHome();
    }
  }, [isHome, gate]);

  const handleSelect = useCallback(
    (href: string) => {
      setOpening(true);
      router.push(`/${locale}/${href}`);
    },
    [locale, router],
  );

  const show = isHome || opening || homeClosing;
  if (!show) return null;

  const target = opening ? 'off' : 'in';

  const leftVariants: Variants = {
    off: { x: '-102%' },
    in: { x: '0%' },
  };
  const rightVariants: Variants = {
    off: { x: '102%' },
    in: { x: '0%' },
  };

  const headingFont = isHe ? 'var(--font-heebo), sans-serif' : 'var(--font-cormorant), serif';

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden" aria-hidden={opening}>
      {/* Loading phase: the logo assembles from its three parts, then the left
          strokes blink until every hero image has finished preloading. */}
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--c-bg)]">
          <LogoLoader />
        </div>
      )}

      {ready && (
        <>
          {/* ── Left panel: image ─────────────────────────── */}
          <motion.div
            className="absolute inset-0"
            style={{ clipPath: leftClip }}
            variants={leftVariants}
            initial="off"
            animate={target}
            transition={{ duration: GATE_DURATION, ease: GATE_EASE }}
          >
            {ALL_IMAGES.map((src) => (
              <motion.div
                key={src}
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: src === currentImg ? 1 : 0 }}
                transition={{ duration: SWAP_DURATION, ease: SWAP_EASE }}
              >
                <Image src={src} alt="" fill priority sizes="70vw" className="object-cover" />
              </motion.div>
            ))}
            <div className="absolute inset-0 bg-black/25" />
          </motion.div>

          {/* ── Right panel: logo + categories ────────────── */}
          <motion.div
            className="absolute inset-0"
            style={{ clipPath: rightClip, filter: 'drop-shadow(-8px 0 24px rgba(0,0,0,0.18))' }}
            variants={rightVariants}
            initial="off"
            animate={target}
            transition={{ duration: GATE_DURATION, ease: GATE_EASE }}
            onAnimationComplete={(def) => {
              if (def === 'off') setOpening(false);
              else if (def === 'in' && homeClosing && !isHome) router.push(`/${locale}`);
            }}
          >
            <div className="absolute inset-0" style={{ background: BG_OPTIONS[bgIndex].value }} />

            {/* Language toggle */}
            <Link
              href={`/${otherLocale}`}
              className="absolute top-[4vh] right-[10vw] z-10 text-[11px] tracking-[0.25em] uppercase text-[var(--c-dim)] hover:text-[var(--c-text)] transition-colors duration-300"
            >
              {otherLocale === 'he' ? 'עב' : 'EN'}
            </Link>

            <div
              dir="ltr"
              className="absolute inset-y-0 right-0 flex flex-col items-end justify-between pt-[13vh] pb-[24vh] pr-[10vw] pl-6"
            >
              <Image
                src="/images/logo.png"
                alt="Trio Piano Workshop"
                width={2199}
                height={734}
                style={{ height: '120px', width: 'auto', filter: 'var(--logo-filter)' }}
                priority
              />

              <div className="flex items-center gap-10" dir={isHe ? 'rtl' : 'ltr'}>
                  {/* Category list */}
                  <ul
                    onMouseLeave={() => setActive(null)}
                    className="flex flex-col gap-6 shrink-0 border-e border-[var(--c-border)] pe-10"
                  >
                    {CATEGORIES.map((c) => {
                      const isActive = active === c.key;
                      return (
                        <li key={c.key}>
                          <button
                            type="button"
                            onMouseEnter={() => setActive(c.key)}
                            onFocus={() => setActive(c.key)}
                            onClick={() => handleSelect(c.href)}
                            className={`block cursor-pointer text-start text-4xl lg:text-5xl font-light leading-none transition-colors duration-300 ${
                              isActive
                                ? 'text-[var(--c-text)]'
                                : 'text-[var(--c-dim)] hover:text-[var(--c-text)]'
                            }`}
                            style={{ fontFamily: headingFont }}
                          >
                            {isHe ? c.labelHe : c.labelEn}
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Description — slides in from behind the list, synced with the image swap */}
                  <div className="relative w-64 h-52 overflow-hidden">
                    <AnimatePresence initial={false}>
                      {activeCat && (
                        <motion.div
                          key={activeCat.key}
                          className="absolute inset-0 flex items-center"
                          initial={{ x: isHe ? '100%' : '-100%', opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: SWAP_DURATION, ease: SWAP_EASE }}
                        >
                          <p className="text-lg lg:text-xl font-light leading-relaxed text-[var(--c-muted)]">
                            {isHe ? activeCat.descHe : activeCat.descEn}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
            </div>

            {/* Contact footer — pinned to the bottom like a footer */}
            <div
              dir={isHe ? 'rtl' : 'ltr'}
              className="absolute bottom-[5vh] right-[10vw] flex items-center gap-4"
            >
              {CONTACTS.map((c, i) => (
                <Fragment key={c.icon}>
                  {i > 0 && (
                    <span aria-hidden className="select-none text-[var(--c-ultra-dim)]">
                      ·
                    </span>
                  )}
                  <a
                    href={c.href}
                    {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="flex items-center gap-2 text-sm text-[var(--c-muted)] hover:text-[var(--c-text)] transition-colors duration-300"
                  >
                    <ContactIcon src={`/assets/icons/${c.icon}`} />
                    <span className="whitespace-nowrap">{isHe ? c.labelHe : c.labelEn}</span>
                  </a>
                </Fragment>
              ))}
            </div>
          </motion.div>

          {/* ── Temporary design switchers (remove once choices are made) ── */}
          <div className="fixed bottom-3 left-3 z-[120] flex max-w-[220px] flex-col gap-2">
            <div className="flex flex-wrap gap-1 rounded-lg bg-black/75 p-2 backdrop-blur-sm">
              <span className="mb-1 w-full text-[10px] uppercase tracking-[0.2em] text-white/50">
                Seam angle
              </span>
              {SEAM_OPTIONS.map((o, i) => (
                <button
                  key={o.label}
                  type="button"
                  onClick={() => setSeamIndex(i)}
                  className={`rounded px-2 py-1 text-[11px] transition-colors ${
                    i === seamIndex
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-1 rounded-lg bg-black/75 p-2 backdrop-blur-sm">
              <span className="mb-1 w-full text-[10px] uppercase tracking-[0.2em] text-white/50">
                Right panel bg
              </span>
              {BG_OPTIONS.map((o, i) => (
                <button
                  key={o.label}
                  type="button"
                  onClick={() => setBgIndex(i)}
                  className={`rounded px-2 py-1 text-[11px] transition-colors ${
                    i === bgIndex
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
