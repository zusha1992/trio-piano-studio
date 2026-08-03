'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import Image from 'next/image';
import {
  ALL_IMAGES,
  CATEGORIES,
  CONTACTS,
  ContactIcon,
  DEFAULT_IMG,
} from '@/components/layout/heroShared';
import { useGate } from '@/components/layout/GateContext';
import LanguageToggle from '@/components/layout/LanguageToggle';
import { AccessibilityButton } from '@/components/a11y/AccessibilityMenu';
import { useReducedMotion } from '@/components/a11y/useReducedMotion';
import { EASE } from '@/lib/motion';
import { pick, isRtl } from '@/lib/i18n';
import { displayFont } from '@/lib/fonts';

// Mirrors the desktop gate's easing so both landings feel like the same
// mechanism, just on a different axis.
const GATE_EASE = [0.83, 0, 0.17, 1] as const;
const GATE_CLOSE_DURATION = 2.1; // curtain shuts (slow, deliberate)
const GATE_OPEN_DURATION = 1.2; // curtain parts to reveal the chosen page

const SWAP_DURATION = 1.0; // ambient background cross-fade
const CYCLE_MS = 2000; // how long each background image lingers

// Reveal timing for the category list + contacts once the gate has closed.
const CAT_STAGGER = 0.13;
const CONTACTS_DELAY = CAT_STAGGER * CATEGORIES.length + 0.25;

// Module-level so the intro plays once per real page load but is skipped on
// client-side remounts (e.g. switching language re-mounts across [locale]).
let mobileIntroPlayed = false;

// The two curtain halves travel one panel-height (50vh) each, in opposite
// directions, so they meet at the seam when closed and clear the screen when
// open.
const TOP_VARIANTS: Variants = { closed: { y: '0%' }, open: { y: '-100%' } };
const BOTTOM_VARIANTS: Variants = { closed: { y: '0%' }, open: { y: '100%' } };

/**
 * One curtain half. It clips a full-container-tall image to its half-height
 * window (anchored top or bottom) so the two halves together form one seamless
 * photo. The inner image is sized to 200% of the half (i.e. the full container
 * height) rather than 100vh, so it tracks the *actual* visible viewport — on
 * mobile 100vh is the large viewport behind the browser toolbars, which would
 * offset the two halves at the seam.
 *
 * Ambient cross-fade: the last settled image stays fully opaque as a base while
 * the incoming image fades in on top of it; once the fade completes the incoming
 * image becomes the new base. Opacity therefore never dips below full, so the
 * switch reads as a smooth dissolve with no flash to the background. Both halves
 * receive the same `currentImg` and fade duration, so they stay in lockstep.
 */
function CurtainHalf({ anchor, currentImg }: { anchor: 'top' | 'bottom'; currentImg: string }) {
  const edge = anchor === 'top' ? 'top-0' : 'bottom-0';
  const [base, setBase] = useState(currentImg);
  return (
    <div className={`absolute inset-x-0 ${edge} h-[200%]`}>
      <Image src={base} alt="" fill priority sizes="100vw" className="object-cover" />
      <AnimatePresence>
        {currentImg !== base && (
          <motion.div
            key={currentImg}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: SWAP_DURATION, ease: EASE }}
            onAnimationComplete={() => setBase(currentImg)}
          >
            <Image src={currentImg} alt="" fill priority sizes="100vw" className="object-cover" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Mobile landing (< lg) — a vertical echo of the desktop gate. On first load a
 * centred logo sits on white; a single photo (split top/bottom) then slides
 * shut like a closing gate. Once closed, the category list reveals top-to-
 * bottom, the contacts slide up, and the background quietly cycles. Tapping a
 * category parts the two halves vertically to reveal the page beneath.
 */
export default function HeroMobile() {
  const locale = useLocale();
  const rtl = isRtl(locale);
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  const gate = useGate();
  const homeClosing = gate?.homeClosing ?? false;

  const headingFont = displayFont(locale);
  const reducedMotion = useReducedMotion();

  // Skip the intro on remounts within the same runtime (e.g. locale switch).
  const [skipIntro] = useState(mobileIntroPlayed);
  const [ready, setReady] = useState(skipIntro);
  // `closed` gates the one-time logo splash; `settled` means the curtain has
  // finished shutting and the home chrome should reveal. They diverge when the
  // curtain re-closes on the way home (splash never returns, but the reveal
  // should replay just like the first load).
  const [closed, setClosed] = useState(skipIntro);
  const [settled, setSettled] = useState(skipIntro);
  const [opening, setOpening] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const currentImg = ALL_IMAGES[imgIndex % ALL_IMAGES.length] ?? DEFAULT_IMG;
  const revealChrome = ready && settled && !opening;

  // Prefetch destinations so the reveal shows a loaded page.
  useEffect(() => {
    CATEGORIES.forEach((c) => router.prefetch(`/${locale}/${c.href}`));
  }, [locale, router]);

  // Loading phase: preload every hero image so the curtain closes over a fully
  // decoded scene, with a minimum on-screen time for the logo splash.
  useEffect(() => {
    if (ready) return;
    let cancelled = false;
    const start = Date.now();
    const MIN_MS = 1800;

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

  // Ambient background cycle — only once the landing has settled, and never
  // when the visitor asked for reduced motion (WCAG 2.2.2).
  useEffect(() => {
    if (reducedMotion || !revealChrome || !isHome) return;
    const t = setInterval(() => setImgIndex((i) => (i + 1) % ALL_IMAGES.length), CYCLE_MS);
    return () => clearInterval(t);
  }, [reducedMotion, revealChrome, isHome]);

  // Returning home from a subpage: keep the chrome hidden until the curtain has
  // fully shut over the page, so the titles/contacts reveal exactly like the
  // first-load sequence rather than popping in over the still-open curtain.
  useEffect(() => {
    if (homeClosing) setSettled(false);
  }, [homeClosing]);

  // Once we've arrived home, drop the transient states and clear the request.
  useEffect(() => {
    if (isHome) {
      setOpening(false);
      gate?.clearCloseHome();
    }
  }, [isHome, gate]);

  const handleSelect = useCallback(
    (href: string) => {
      mobileIntroPlayed = true;
      setClosed(true);
      setSettled(false);
      setOpening(true);
      router.push(`/${locale}/${href}`);
    },
    [locale, router],
  );

  const show = isHome || opening || homeClosing;
  if (!show) return null;

  const target = opening ? 'open' : 'closed';
  const gateDuration = target === 'closed' ? GATE_CLOSE_DURATION : GATE_OPEN_DURATION;
  // Start already-closed (no animation) only when returning to a home that has
  // already played its intro this session; otherwise animate the curtain.
  const startClosed = isHome && skipIntro && !opening;
  const panelInitial = startClosed ? 'closed' : 'open';

  const fg = '#ffffff';

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Intro splash: logo centred on white (both themes) — the first thing
          seen on a real load, sitting behind the curtain until it closes. Never
          shown while returning home, where the curtain must close over the page
          that's already on screen. */}
      {!closed && !homeClosing && (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: EASE }}
          >
            <Image
              src="/images/logo.png"
              alt="Trio Piano Workshop"
              width={1512}
              height={531}
              priority
              style={{ height: 120, width: 'auto', filter: 'none' }}
            />
          </motion.div>
        </div>
      )}

      {ready && (
        <>
          {/* ── The two curtain halves ─────────────────────────────────── */}
          <motion.div
            className="absolute inset-x-0 top-0 z-10 h-1/2 overflow-hidden"
            variants={TOP_VARIANTS}
            initial={panelInitial}
            animate={target}
            transition={{ duration: gateDuration, ease: GATE_EASE }}
          >
            <CurtainHalf anchor="top" currentImg={currentImg} />
          </motion.div>

          <motion.div
            className="absolute inset-x-0 bottom-0 z-10 h-1/2 overflow-hidden"
            variants={BOTTOM_VARIANTS}
            initial={panelInitial}
            animate={target}
            transition={{ duration: gateDuration, ease: GATE_EASE }}
            onAnimationComplete={(def) => {
              if (def === 'open') setOpening(false);
              else if (def === 'closed') {
                setClosed(true);
                setSettled(true);
                mobileIntroPlayed = true;
                // Curtain shut over a subpage on the way home → now navigate.
                if (homeClosing && !isHome) router.push(`/${locale}`);
              }
            }}
          >
            <CurtainHalf anchor="bottom" currentImg={currentImg} />
          </motion.div>

          {/* ── Chrome: scrim + toggles + categories + contacts ─────────
              Above the curtain, fades out while opening so the parting halves
              reveal a clean page. pointer-events only on interactive bits. */}
          <div className="pointer-events-none absolute inset-0 z-20">
            {/* Legibility scrim over the photo — darker top/bottom for the
                toggles and contacts, lighter through the middle. */}
            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: revealChrome ? 1 : 0 }}
              transition={{ duration: 0.85, ease: EASE }}
              style={{
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.66) 0%, rgba(0,0,0,0.42) 24%, rgba(0,0,0,0.4) 56%, rgba(0,0,0,0.72) 100%)',
              }}
            />

            {/* Language toggle — the theme toggle is omitted here since the
                theme has no effect on the photo landing; it lives in the
                toolbar that appears once you're inside a page. */}
            <motion.div
              dir="ltr"
              className="pointer-events-auto absolute end-5 top-5 flex items-center gap-3"
              style={{ color: fg }}
              initial={false}
              animate={{ opacity: revealChrome ? 1 : 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: revealChrome ? 0.2 : 0 }}
            >
              <LanguageToggle triggerClassName="" align="end" />
              <AccessibilityButton />
            </motion.div>

            {/* Category list — revealed top-to-bottom */}
            <motion.ul
              dir={rtl ? 'rtl' : 'ltr'}
              className="pointer-events-none absolute inset-y-0 flex flex-col items-start justify-center gap-5 ps-[10vw] pe-[8vw]"
              style={{ insetInlineStart: 0 }}
              initial={false}
              animate={revealChrome ? 'show' : 'hidden'}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: CAT_STAGGER, delayChildren: 0.1 } },
              }}
            >
              {CATEGORIES.map((c) => (
                <motion.li
                  key={c.key}
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleSelect(c.href)}
                    className="pointer-events-auto block cursor-pointer text-start leading-[1.05] tracking-tight"
                    style={{
                      fontFamily: headingFont,
                      fontWeight: 400,
                      fontSize: '3.15rem',
                      color: fg,
                      textShadow: '0 1px 14px rgba(0,0,0,0.45)',
                    }}
                  >
                    {pick(c.label, locale)}
                  </button>
                </motion.li>
              ))}
            </motion.ul>

            {/* Contacts — slide up to their resting position */}
            <motion.div
              className="pointer-events-auto absolute inset-x-0 bottom-0 flex items-center justify-center gap-7 pb-7"
              style={{ color: fg }}
              initial={false}
              animate={revealChrome ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.55, ease: EASE, delay: revealChrome ? CONTACTS_DELAY : 0 }}
            >
              {CONTACTS.map((c) => (
                <a
                  key={c.icon}
                  href={c.href}
                  aria-label={pick(c.label, locale)}
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <ContactIcon src={`/assets/icons/${c.icon}`} size={19} />
                </a>
              ))}
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
