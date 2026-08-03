'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useReducedMotion } from '@/components/a11y/useReducedMotion';
import { EASE } from '@/lib/motion';

const FRAME_SWIPE_THRESHOLD = 40;

const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%' }),
  center: { x: '0%' },
  exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%' }),
};

interface ImageCarouselProps {
  images: string[];
  /** Alt text for every frame. */
  alt?: string;
  /** Reading direction — flips the arrow glyphs and keyboard/swipe mapping. */
  isHe: boolean;
  /** Extra classes for the inline clickable frame (aspect ratio, height, margins). */
  frameClassName?: string;
  /** `next/image` sizes hint for the inline frame. */
  sizes?: string;
  /** Auto-advance interval in ms; pass 0 to disable. */
  autoAdvanceMs?: number;
}

/**
 * Self-contained image carousel with prev/next arrows, dot navigation,
 * auto-advance, and a click-to-open fullscreen viewer (keyboard + swipe).
 * A single frame renders just the image (no controls) and still expands.
 */
export default function ImageCarousel({
  images,
  alt = '',
  isHe,
  frameClassName = 'aspect-square',
  sizes = '(max-width: 768px) 100vw, 45vw',
  autoAdvanceMs = 5000,
}: ImageCarouselProps) {
  const [[slide, dir], setSlide] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const reducedMotion = useReducedMotion();
  const many = images.length > 1;

  // Frames adjacent to the current one, pre-fetched (hidden) so the next/prev
  // image is already in cache before it slides in — otherwise the incoming
  // slide shows an empty dark frame until it finishes downloading, since
  // next/image only fetches a frame once it's mounted.
  const len = images.length;
  const neighbors = many
    ? Array.from(new Set([(slide + 1) % len, (slide - 1 + len) % len])).filter((i) => i !== slide)
    : [];

  const BackArrow = isHe ? ChevronRight : ChevronLeft;
  const FwdArrow = isHe ? ChevronLeft : ChevronRight;

  const paginate = (d: number) => {
    setPaused(true);
    setSlide(([s]) => [(s + d + images.length) % images.length, d]);
  };
  const goTo = (i: number) => {
    setPaused(true);
    setSlide(([s]) => [i, i > s ? 1 : -1]);
  };

  // Swipe support for the inline (non-fullscreen) frame — mainly for touch,
  // where the arrows are hidden. `swipedRef` tells the frame's click handler to
  // ignore the click that follows a swipe so it doesn't open fullscreen.
  const swipedRef = useRef(false);
  const handleFramePanEnd = (_e: unknown, info: PanInfo) => {
    if (!many || Math.abs(info.offset.x) < FRAME_SWIPE_THRESHOLD) return;
    swipedRef.current = true;
    paginate(info.offset.x < 0 ? 1 : -1);
  };
  const handleFrameClick = () => {
    if (swipedRef.current) {
      swipedRef.current = false;
      return;
    }
    openFullscreen();
  };

  // Auto-advance stops for good once the visitor takes manual control, and
  // never starts when the visitor asked for reduced motion (WCAG 2.2.2).
  useEffect(() => {
    if (reducedMotion || paused || fullscreen || !many || autoAdvanceMs <= 0) return;
    const id = setInterval(() => setSlide(([s]) => [(s + 1) % images.length, 1]), autoAdvanceMs);
    return () => clearInterval(id);
  }, [reducedMotion, paused, fullscreen, many, autoAdvanceMs, images.length]);

  // Guards against firing history.back() twice for a single close (e.g. the X
  // button click also bubbling to the backdrop), which would pop an extra
  // history entry and navigate the visitor off the page.
  const closingRef = useRef(false);

  // Open the viewer and push a history entry so the device back button /
  // swipe-back gesture closes the viewer instead of leaving the page.
  const openFullscreen = () => {
    closingRef.current = false;
    setFullscreen(true);
    window.history.pushState({ carouselFullscreen: true }, '');
  };
  // Route every close action through history so the back button and the
  // in-viewer controls stay in sync (this pops the entry we pushed above).
  const closeFullscreen = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    window.history.back();
  };

  // While open, a back navigation (device button or history.back) just closes
  // the viewer and keeps the visitor on the current page.
  useEffect(() => {
    if (!fullscreen) return;
    const onPop = () => {
      closingRef.current = true;
      setFullscreen(false);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [fullscreen]);

  // Keyboard control while the fullscreen viewer is open.
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeFullscreen();
      if (e.key === 'ArrowRight') paginate(isHe ? -1 : 1);
      if (e.key === 'ArrowLeft') paginate(isHe ? 1 : -1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullscreen, isHe, images.length]);

  return (
    <>
      <motion.div
        className={`group relative cursor-pointer overflow-hidden rounded-2xl bg-[var(--c-bg-alt)] ${frameClassName}`}
        style={{ touchAction: 'pan-y' }}
        onPointerDown={() => { swipedRef.current = false; }}
        onPanEnd={handleFramePanEnd}
        onClick={handleFrameClick}
      >
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={slide}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: EASE }}
            className="absolute inset-0"
          >
            <Image
              src={images[slide]}
              alt={alt}
              fill
              className="object-cover object-center"
              sizes={sizes}
            />
          </motion.div>
        </AnimatePresence>

        {/* Hidden warm-up of the neighbouring frames (see `neighbors`). */}
        {neighbors.length > 0 && (
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-0">
            {neighbors.map((i) => (
              <Image
                key={`pre-${images[i]}-${i}`}
                src={images[i]}
                alt=""
                fill
                sizes={sizes}
                className="object-cover"
              />
            ))}
          </div>
        )}

        {many && (
          <>
            {/* Arrows are desktop-only; on mobile the frame is swipeable. */}
            <button
              type="button"
              aria-label="Previous"
              onClick={(e) => { e.stopPropagation(); paginate(-1); }}
              className="absolute start-3 top-1/2 hidden -translate-y-1/2 cursor-pointer rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/60 lg:block"
            >
              <BackArrow size={20} />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={(e) => { e.stopPropagation(); paginate(1); }}
              className="absolute end-3 top-1/2 hidden -translate-y-1/2 cursor-pointer rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/60 lg:block"
            >
              <FwdArrow size={20} />
            </button>

            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
              {images.map((img, i) => (
                <button
                  key={`${img}-${i}`}
                  type="button"
                  aria-label={`Go to image ${i + 1}`}
                  onClick={(e) => { e.stopPropagation(); goTo(i); }}
                  className={`h-1.5 cursor-pointer rounded-full transition-all ${
                    i === slide ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </motion.div>

      {/* Fullscreen image viewer */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
            onClick={closeFullscreen}
          >
            <button
              onClick={(e) => { e.stopPropagation(); closeFullscreen(); }}
              aria-label="Close"
              className="absolute right-5 top-5 z-10 cursor-pointer text-white/70 transition-colors hover:text-white"
            >
              <X size={28} strokeWidth={1.5} />
            </button>

            {many && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); paginate(isHe ? 1 : -1); }}
                  aria-label="Previous"
                  className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer text-white/60 transition-colors hover:text-white"
                >
                  <ChevronLeft size={38} strokeWidth={1.5} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); paginate(isHe ? -1 : 1); }}
                  aria-label="Next"
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-white/60 transition-colors hover:text-white"
                >
                  <ChevronRight size={38} strokeWidth={1.5} />
                </button>
              </>
            )}

            <motion.div
              key={slide}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) paginate(1);
                else if (info.offset.x > 60) paginate(-1);
              }}
              className="relative h-[85vh] w-full max-w-5xl touch-pan-y"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[slide]}
                alt={alt}
                fill
                sizes="90vw"
                draggable={false}
                className="pointer-events-none object-contain"
              />
            </motion.div>

            {/* Warm up neighbouring frames at the fullscreen size too. */}
            {neighbors.length > 0 && (
              <div aria-hidden className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0">
                {neighbors.map((i) => (
                  <Image
                    key={`pre-fs-${images[i]}-${i}`}
                    src={images[i]}
                    alt=""
                    fill
                    sizes="90vw"
                    className="object-contain"
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
