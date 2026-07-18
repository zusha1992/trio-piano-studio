'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

/* ── Logo part geometry (intrinsic pixel sizes of the 3 exported parts) ──
   The left brush strokes fill the full height on the left. On the right the
   "TRIO" wordmark (top) and "Piano Workshop" subtitle (bottom) stack together
   to fill the same height, reconstructing the complete logo.                */
const LEFT = { w: 468, h: 544 };
const TOP = { w: 1087, h: 422 };
const BOTTOM = { w: 1087, h: 122 };

// On-screen height of the assembled logo; everything else scales from it.
const LOGO_H = 150;
const scale = LOGO_H / LEFT.h;

const leftW = LEFT.w * scale;
const rightW = TOP.w * scale;
const topH = TOP.h * scale;
const bottomH = BOTTOM.h * scale;

const EASE = [0.16, 1, 0.3, 1] as const;
const PART_DURATION = 0.6;
const STAGGER = 0.45;

// Distance (px) each part travels as it slides into place.
const DX = 90;
const DY = 70;

export default function LogoLoader() {
  const reduceMotion = useReducedMotion();
  const [blinking, setBlinking] = useState(false);

  // Once all three parts have assembled, let the left strokes pulse to signal
  // that loading is still in progress.
  useEffect(() => {
    if (reduceMotion) return;
    const assembledAt = (STAGGER * 2 + PART_DURATION) * 1000;
    const t = setTimeout(() => setBlinking(true), assembledAt);
    return () => clearTimeout(t);
  }, [reduceMotion]);

  const imgStyle = { filter: 'var(--logo-filter)' } as const;

  if (reduceMotion) {
    return (
      <div dir="ltr" className="flex items-stretch" style={{ height: LOGO_H }}>
        <div className="relative" style={{ width: leftW, height: LOGO_H }}>
          <Image src="/images/logo-part-left.png" alt="Trio Piano Workshop" fill priority className="object-contain" style={imgStyle} />
        </div>
        <div className="flex flex-col" style={{ width: rightW, height: LOGO_H }}>
          <div className="relative" style={{ width: rightW, height: topH }}>
            <Image src="/images/logo-part-top.png" alt="" fill priority className="object-contain" style={imgStyle} />
          </div>
          <div className="relative" style={{ width: rightW, height: bottomH }}>
            <Image src="/images/logo-part-bottom.png" alt="" fill priority className="object-contain" style={imgStyle} />
          </div>
        </div>
      </div>
    );
  }

  return (
    // Force LTR so the logo layout is identical in Hebrew and English — "left"
    // is always physically the left of the logo, regardless of page direction.
    <div dir="ltr" className="flex items-stretch" style={{ height: LOGO_H }}>
      {/* Left brush strokes — slide in first, travelling left, then blink. */}
      <motion.div
        className="relative"
        style={{ width: leftW, height: LOGO_H }}
        initial={{ opacity: 0, x: DX }}
        animate={blinking ? { opacity: [1, 0.35, 1], x: 0 } : { opacity: 1, x: 0 }}
        transition={
          blinking
            ? { opacity: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } }
            : { duration: PART_DURATION, ease: EASE }
        }
      >
        <Image src="/images/logo-part-left.png" alt="Trio Piano Workshop" fill priority className="object-contain" style={imgStyle} />
      </motion.div>

      {/* Right column: TRIO on top, subtitle below. */}
      <div className="flex flex-col" style={{ width: rightW, height: LOGO_H }}>
        {/* TRIO — slides in second, travelling right. */}
        <motion.div
          className="relative"
          style={{ width: rightW, height: topH }}
          initial={{ opacity: 0, x: -DX }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: PART_DURATION, delay: STAGGER, ease: EASE }}
        >
          <Image src="/images/logo-part-top.png" alt="" fill priority className="object-contain" style={imgStyle} />
        </motion.div>

        {/* Piano Workshop — slides in last, travelling down. */}
        <motion.div
          className="relative"
          style={{ width: rightW, height: bottomH }}
          initial={{ opacity: 0, y: -DY }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: PART_DURATION, delay: STAGGER * 2, ease: EASE }}
        >
          <Image src="/images/logo-part-bottom.png" alt="" fill priority className="object-contain" style={imgStyle} />
        </motion.div>
      </div>
    </div>
  );
}
