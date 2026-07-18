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
  useHeroTheme,
} from '@/components/layout/heroShared';

const AUTO_MS = 4000;
const SWIPE_THRESHOLD = 50;
const FADE = { duration: 0.8, ease: [0.16, 1, 0.3, 1] } as const;

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

  const { negative, toggle: toggleTheme } = useHeroTheme();

  const headingFont = isHe ? 'var(--font-rubik), sans-serif' : 'var(--font-arimo), sans-serif';

  // Overlay color follows the theme (matte wash): black in dark, white in light.
  const grad = negative ? '0, 0, 0' : '255, 255, 255';
  // Foreground (text/icons/dots) is the opposite: white in dark, near-black in light.
  const fg = negative ? '#ffffff' : '#09090b';

  const [index, setIndex] = useState(0);
  // Distinguishes a real swipe from a tap so a tap-to-enter isn't swallowed.
  const draggedRef = useRef(false);

  const current = CATEGORIES[index];

  const goTo = useCallback((i: number) => {
    setIndex((i + CATEGORIES.length) % CATEGORIES.length);
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
    const t = setTimeout(() => goTo(index + 1), AUTO_MS);
    return () => clearTimeout(t);
  }, [index, isHome, goTo]);

  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 8) draggedRef.current = true;
    if (info.offset.x <= -SWIPE_THRESHOLD) goTo(index + 1);
    else if (info.offset.x >= SWIPE_THRESHOLD) goTo(index - 1);
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
      {/* Slides — crossfade + swipe (drag anywhere); tap-to-enter is a smaller
          central zone so it doesn't steal taps from the top toolbar/footer. */}
      <motion.div
        className="absolute inset-0"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        onDragEnd={handleDragEnd}
      >
        {CATEGORIES.map((c, i) => (
          <motion.div
            key={c.key}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === index ? 1 : 0 }}
            transition={FADE}
          >
            <Image src={c.img} alt="" fill priority sizes="100vw" className="object-cover" />
          </motion.div>
        ))}

        {/* Top wash: fully matte theme color for the top 20% of the screen,
            then a short fade into the photo. Bottom stays fully transparent. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, rgba(${grad},1) 0%, rgba(${grad},1) 20%, rgba(${grad},0) 60%)`,
          }}
        />

        {/* Tap-to-enter zone — central band only, clear of the toolbar/footer. */}
        <button
          type="button"
          aria-label={isHe ? current.labelHe : current.labelEn}
          onClick={handleEnter}
          className="absolute inset-x-0 top-[14%] bottom-[16%] z-[5] cursor-pointer"
        />

        {/* Title — sits inside the matte band */}
        <div className="pointer-events-none absolute inset-x-0 top-[11%] flex justify-center px-8">
          <AnimatePresence mode="wait">
            <motion.h2
              key={current.key}
              dir={isHe ? 'rtl' : 'ltr'}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-center text-[2.9rem] leading-none tracking-tight"
              style={{ fontFamily: headingFont, fontWeight: 400, color: fg }}
            >
              {isHe ? current.labelHe : current.labelEn}
            </motion.h2>
          </AnimatePresence>
        </div>
      </motion.div>

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
