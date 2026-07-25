'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ALL_IMAGES,
  CATEGORIES,
  CONTACTS,
  ContactIcon,
} from '@/components/layout/heroShared';
import { useTheme } from '@/components/layout/ThemeContext';
import { EASE } from '@/lib/motion';

const AUTO_MS = 4000;
const SWIPE_THRESHOLD = 50;
const SLIDE = { duration: 0.6, ease: EASE } as const;

// Horizontal slide so it reads like navigating between pages.
const slideVariants = {
  enter: (d: number) => ({ x: d >= 0 ? '100%' : '-100%' }),
  center: { x: '0%' },
  exit: (d: number) => ({ x: d >= 0 ? '-100%' : '100%' }),
};

/**
 * Mobile landing (< lg) — concept B. A full-screen showcase that displays one
 * category at a time. It advances on its own every couple of seconds and also
 * responds to swipes; a tap enters the current category. This trades the
 * desktop hover-reveal for a lean-back, auto-playing carousel that suits touch.
 */
export default function HeroMobile() {
  const locale = useLocale();
  const isHe = locale === 'he';
  const otherLocale = isHe ? 'en' : 'he';
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  const { negative, toggle: toggleTheme } = useTheme();

  const headingFont = isHe ? 'var(--font-rubik), sans-serif' : 'var(--font-arimo), sans-serif';

  // Overlay color follows the theme (matte wash): black in dark, white in light.
  const grad = negative ? '0, 0, 0' : '255, 255, 255';
  // Foreground (text/icons/dots) is the opposite: white in dark, near-black in light.
  const fg = negative ? '#ffffff' : '#09090b';

  // Track the slide index together with the travel direction so slides move
  // in/out horizontally instead of crossfading.
  const [[index, dir], setSlide] = useState<[number, number]>([0, 0]);
  // Distinguishes a real swipe from a tap so a tap-to-enter isn't swallowed.
  const draggedRef = useRef(false);

  const current = CATEGORIES[index];

  // `dir` is the VISUAL travel (1 = current slide leaves toward the leading
  // edge and the next enters from the trailing edge) so the animation always
  // follows the finger. `step` is how the index moves through CATEGORIES, which
  // is mirrored for RTL so "forward" tracks the reading direction.
  const move = useCallback((dir: number, step: number) => {
    setSlide(([i]) => [(i + step + CATEGORIES.length) % CATEGORIES.length, dir]);
  }, []);
  // Auto-advance to the next category, sliding in the reading direction.
  const advance = useCallback(() => move(isHe ? -1 : 1, 1), [move, isHe]);
  const goTo = useCallback((i: number) => {
    setSlide(([cur]) => [i, i >= cur ? 1 : -1]);
  }, []);

  // Prefetch destinations + decode every image up front so swaps are instant.
  useEffect(() => {
    CATEGORIES.forEach((c) => router.prefetch(`/${locale}/${c.href}`));
    ALL_IMAGES.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [locale, router]);

  // Auto-advance. Keyed on `index`, so any manual change restarts the timer.
  useEffect(() => {
    if (!isHome) return;
    const t = setTimeout(advance, AUTO_MS);
    return () => clearTimeout(t);
  }, [index, isHome, advance]);

  const handlePanEnd = (_e: unknown, info: PanInfo) => {
    // Only count it as a swipe — and swallow the follow-up click — when the pan
    // clears the threshold. Smaller finger jitter during a tap must NOT block
    // the tap, otherwise pressing an image sometimes does nothing.
    // The slide follows the finger: swiping left slides content left (dir 1),
    // right slides it right (dir -1); the landing category is mirrored for RTL.
    if (info.offset.x <= -SWIPE_THRESHOLD) {
      draggedRef.current = true;
      move(1, isHe ? -1 : 1);
    } else if (info.offset.x >= SWIPE_THRESHOLD) {
      draggedRef.current = true;
      move(-1, isHe ? 1 : -1);
    }
  };

  const handleEnter = () => {
    if (draggedRef.current) {
      draggedRef.current = false;
      return;
    }
    router.push(`/${locale}/${current.href}`);
  };

  if (!isHome) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-black">
      {/* Background images — the ONLY layer that slides on swipe, so the matte
          overlay and title above it stay perfectly still between categories. */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={index}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={SLIDE}
            className="absolute inset-0"
          >
            <Image src={current.img} alt="" fill priority sizes="100vw" className="object-cover" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Constant matte overlay — shared by every category, never slides. Top
          ~20% is fully matte theme color, fading into the photo by 60%. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, rgba(${grad},1) 0%, rgba(${grad},1) 20%, rgba(${grad},0) 60%)`,
        }}
      />

      {/* Swipe + tap surface — one transparent layer that detects the pan
          (advance category) and the tap (enter category). Sits above the image
          and overlay but below the header/footer chrome (z-10). */}
      <motion.div
        role="button"
        tabIndex={0}
        aria-label={isHe ? current.labelHe : current.labelEn}
        className="absolute inset-0 z-[5] cursor-pointer touch-none select-none"
        style={{ touchAction: 'none', overscrollBehavior: 'none' }}
        onPointerDown={() => { draggedRef.current = false; }}
        onPanEnd={handlePanEnd}
        onClick={handleEnter}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleEnter();
        }}
      />

      {/* Title — constant band; only its text animates on category change. */}
      <div className="pointer-events-none absolute inset-x-0 top-[11%] z-[6] flex justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.h2
            key={current.key}
            dir={isHe ? 'rtl' : 'ltr'}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.22, ease: EASE } }}
            transition={{ duration: 0.5, ease: EASE }}
            className="text-center text-[2.9rem] leading-none tracking-tight"
            style={{ fontFamily: headingFont, fontWeight: 400, color: fg }}
          >
            {isHe ? current.labelHe : current.labelEn}
          </motion.h2>
        </AnimatePresence>
      </div>

      {/* Header: logo + language/theme toggles (color follows the theme) */}
      <header
        dir={isHe ? 'rtl' : 'ltr'}
        className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 pt-5"
      >
        <Image
          src="/images/logo.png"
          alt="Trio Piano Workshop"
          width={1512}
          height={531}
          priority
          className="pointer-events-auto"
          style={{
            height: 40,
            width: 'auto',
            filter: negative ? 'brightness(0) invert(1)' : 'var(--logo-filter)',
          }}
        />
        <div
          dir="ltr"
          className="pointer-events-auto flex items-center gap-3"
          style={{ color: fg }}
        >
          <Link
            href={`/${otherLocale}`}
            className="text-[11px] uppercase tracking-[0.25em]"
          >
            {otherLocale === 'he' ? 'עב' : 'EN'}
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {negative ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
          </button>
        </div>
      </header>

      {/* Bottom chrome: slide dots + contacts. Always white — it sits over the
          photo (transparent bottom), so white reads best in either theme. */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-4 pb-6">
        <div className="flex items-center gap-2.5">
          {CATEGORIES.map((c, i) => (
            <button
              key={c.key}
              type="button"
              aria-label={isHe ? c.labelHe : c.labelEn}
              onClick={() => goTo(i)}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === index ? 22 : 8,
                background: i === index ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-7 text-white">
          {CONTACTS.map((c) => (
            <a
              key={c.icon}
              href={c.href}
              aria-label={isHe ? c.labelHe : c.labelEn}
              {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <ContactIcon src={`/assets/icons/${c.icon}`} size={19} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
