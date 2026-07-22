'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion, type Variants } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useGate } from '@/components/layout/GateContext';
import { markGateReveal } from '@/components/layout/gateReveal';
import {
  ALL_IMAGES,
  CATEGORIES,
  CONTACTS,
  ContactIcon,
  DEFAULT_IMG,
} from '@/components/layout/heroShared';
import { useTheme } from '@/components/layout/ThemeContext';

/* ── Straight vertical seam ─────────────────────────────────────────
   Image fills the left half, logo/categories the right half.          */
const LEFT_CLIP = 'polygon(0 0, 50% 0, 50% 100%, 0 100%)';
const RIGHT_CLIP = 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)';

// Module-level so it survives client-side navigations (e.g. locale switch)
// but resets on a real page load/refresh — the only time we want the intro.
let introPlayed = false;

const GATE_EASE = [0.83, 0, 0.17, 1] as const;
// The panels close (curtain shut) slower than they open (reveal a page).
const GATE_CLOSE_DURATION = 2.3;
const GATE_OPEN_DURATION = 1.5;

const SWAP_DURATION = 0.6;
const SWAP_EASE = [0.16, 1, 0.3, 1] as const;

export default function HeroGate() {
  const locale = useLocale();
  const isHe = locale === 'he';
  const otherLocale = isHe ? 'en' : 'he';
  const pathname = usePathname();
  const router = useRouter();
  const gate = useGate();
  const homeClosing = gate?.homeClosing ?? false;

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  // Once the intro has played in this session (real load/refresh), skip it on
  // subsequent remounts within the same runtime — e.g. switching language,
  // which is a client-side navigation across the [locale] segment.
  const [skipIntro] = useState(introPlayed);
  const [ready, setReady] = useState(skipIntro);
  const [opening, setOpening] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  // The image "sticks" to the last hovered category — it is NOT cleared on mouse
  // leave. This keeps the backdrop stable (no flash back to the default image)
  // when moving between categories, selecting one, or returning home.
  const [imgKey, setImgKey] = useState<string | null>(null);
  // True once the panels have finished closing over the intro logo on first load.
  const [closed, setClosed] = useState(skipIntro);
  const { negative, scheme, toggle: toggleTheme } = useTheme();

  const currentImg = CATEGORIES.find((c) => c.key === imgKey)?.img ?? DEFAULT_IMG;

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
      // The intro logo belongs to the very first load only. As soon as the user
      // opens a category, retire it for good so the curtain reveals the page
      // behind it — never the logo again.
      setClosed(true);
      introPlayed = true;
      // Let the destination hold its entrance until the curtain has opened.
      markGateReveal();
      setOpening(true);
      router.push(`/${locale}/${href}`);
    },
    [locale, router],
  );

  const show = isHome || opening || homeClosing;
  if (!show) return null;

  const target = opening ? 'off' : 'in';
  const gateDuration = target === 'in' ? GATE_CLOSE_DURATION : GATE_OPEN_DURATION;

  // Start the panels already-closed ("in", no gate animation) ONLY on the home
  // page when the intro already played this session (e.g. after a language
  // switch). When closing the curtain over a subpage on the way home, always
  // start open ("off") so the curtain actually animates shut before navigating.
  const startClosed = isHome && skipIntro && !opening && !homeClosing;
  const panelInitial = startClosed ? 'in' : 'off';

  // Mirror the whole layout by language: image fills the reading-start half
  // (right in Hebrew/RTL, left in English/LTR), categories fill the other half.
  const imageOnRight = isHe;
  const imageHalfPos = imageOnRight ? 'right-0' : 'left-0';
  const catClip = imageOnRight ? LEFT_CLIP : RIGHT_CLIP;

  const imageVariants: Variants = {
    off: { x: imageOnRight ? '102%' : '-102%' },
    in: { x: '0%' },
  };
  const catVariants: Variants = {
    off: { x: imageOnRight ? '-102%' : '102%' },
    in: { x: '0%' },
  };

  const catShadow = imageOnRight
    ? 'drop-shadow(8px 0 24px rgba(0,0,0,0.18))'
    : 'drop-shadow(-8px 0 24px rgba(0,0,0,0.18))';
  const catHalfPos = imageOnRight ? 'left-0 right-1/2' : 'left-1/2 right-0';
  const toggleCorner = imageOnRight ? 'left-[6vw]' : 'right-[6vw]';

  const headingFont = isHe ? 'var(--font-rubik), sans-serif' : 'var(--font-arimo), sans-serif';
  const headingWeight = 400;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden" aria-hidden={opening}>
      {/* Intro logo — fades in while loading and stays on screen (behind the
          panels) until the two panels have closed over it on first load. It is
          strictly a first-load element: never shown while opening a category
          (`opening`) or closing the curtain on the way home (`homeClosing`), so
          those transitions only ever reveal/hide the page behind. */}
      {!closed && !opening && !homeClosing && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: scheme.intro }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, ease: SWAP_EASE }}
          >
            <Image
              src="/images/logo.png"
              alt="Trio Piano Workshop"
              width={1512}
              height={531}
              style={{
                height: '190px',
                width: 'auto',
                filter: negative ? 'brightness(0) invert(1)' : 'var(--logo-filter)',
              }}
              priority
            />
          </motion.div>
        </div>
      )}

      {ready && (
        <>
          {/* ── Image panel (constrained to its half so the photo covers the
              half, not the full viewport width) ─────────────────────────── */}
          <motion.div
            className={`absolute inset-y-0 ${imageHalfPos} w-[calc(50%+1px)]`}
            variants={imageVariants}
            initial={panelInitial}
            animate={target}
            transition={{ duration: gateDuration, ease: GATE_EASE }}
          >
            {ALL_IMAGES.map((src) => (
              <motion.div
                key={src}
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: src === currentImg ? 1 : 0 }}
                transition={{ duration: SWAP_DURATION, ease: SWAP_EASE }}
              >
                <Image src={src} alt="" fill priority sizes="50vw" className="object-cover" />
              </motion.div>
            ))}
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>

          {/* ── Categories panel ────────────────────────────── */}
          <motion.div
            className="absolute inset-0"
            style={{ clipPath: catClip, filter: catShadow }}
            variants={catVariants}
            initial={panelInitial}
            animate={target}
            transition={{ duration: gateDuration, ease: GATE_EASE }}
            onAnimationComplete={(def) => {
              if (def === 'off') setOpening(false);
              else if (def === 'in') {
                // Any completed curtain-close means the intro is over for good.
                setClosed(true);
                introPlayed = true;
                if (homeClosing && !isHome) router.push(`/${locale}`);
              }
            }}
          >
            <div className="absolute inset-0" style={{ background: scheme.bg }} />

            {/* Language toggle + theme toggle */}
            <div dir="ltr" className={`absolute top-[4vh] ${toggleCorner} z-10 flex items-center gap-3`}>
              <Link
                href={`/${otherLocale}`}
                className={`text-[11px] tracking-[0.25em] uppercase ${scheme.toggle} transition-colors duration-300`}
              >
                {otherLocale === 'he' ? 'עב' : 'EN'}
              </Link>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className={`${scheme.toggle} transition-colors duration-300`}
              >
                {negative ? <Sun size={15} strokeWidth={1.5} /> : <Moon size={15} strokeWidth={1.5} />}
              </button>
            </div>

            {/* Big category headers — vertically centered; hover swaps the image */}
            <div
              dir={isHe ? 'rtl' : 'ltr'}
              className={`absolute inset-y-0 ${catHalfPos} flex flex-col items-start justify-center pb-[12vh] ps-[7vw] pe-[6vw]`}
            >
              <ul onMouseLeave={() => setActive(null)} className="flex flex-col gap-12">
                {CATEGORIES.map((c) => {
                  const isActive = active === c.key;
                  return (
                    <li key={c.key}>
                      <button
                        type="button"
                        onMouseEnter={() => {
                          setActive(c.key);
                          setImgKey(c.key);
                        }}
                        onFocus={() => {
                          setActive(c.key);
                          setImgKey(c.key);
                        }}
                        onClick={() => handleSelect(c.href)}
                        className="block cursor-pointer text-start text-[3.75rem] tracking-tight leading-[1.02] transition-colors duration-300"
                        style={{
                          fontFamily: headingFont,
                          fontWeight: headingWeight,
                          color: isActive ? scheme.catActive : scheme.cat,
                        }}
                      >
                        {isHe ? c.labelHe : c.labelEn}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Contact footer — one row centered within the categories half.
                Kept compact (small text, tight gaps, no side padding) so the
                four labels use the full 50% width and stay on a single line.
                flex-wrap is only a graceful fallback for very narrow screens. */}
            <div
              dir={isHe ? 'rtl' : 'ltr'}
              className={`absolute bottom-[5vh] ${catHalfPos} flex items-center justify-center gap-x-4 gap-y-2 flex-wrap px-4`}
            >
              {CONTACTS.map((c) => (
                <a
                  key={c.icon}
                  href={c.href}
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className={`flex items-center gap-1.5 text-xs ${scheme.sub} transition-colors duration-300`}
                >
                  <ContactIcon src={`/assets/icons/${c.icon}`} size={13} />
                  <span className="whitespace-nowrap">{isHe ? c.labelHe : c.labelEn}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
