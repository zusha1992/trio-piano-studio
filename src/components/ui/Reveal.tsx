'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

type Direction = 'left' | 'right' | 'up' | 'down';

interface RevealProps {
  children: ReactNode;
  /** Edge the content emerges from. */
  direction?: Direction;
  /**
   * How far the content starts offset from its resting place.
   * `'100%'` (default) keeps it fully hidden behind the mask until it slides in;
   * a smaller value (e.g. `'40%'` or `60`) gives a subtler peek-in.
   */
  distance?: number | string;
  /** Seconds the slide takes. */
  duration?: number;
  /** Seconds to wait before starting (handy for staggering siblings). */
  delay?: number;
  /** Fade opacity in alongside the slide. */
  fade?: boolean;
  /**
   * Clip the content to its frame so it appears to emerge from the edge.
   * Set to `false` for a plain slide that is allowed to overflow.
   */
  clip?: boolean;
  /** Replay every time it re-enters the viewport instead of only once. */
  once?: boolean;
  /** Portion of the element that must be visible before triggering (0–1). */
  amount?: number;
  className?: string;
}

function offsetFor(direction: Direction, distance: number | string) {
  const d = typeof distance === 'number' ? `${distance}px` : distance;
  switch (direction) {
    case 'left':
      return { x: `-${d}` };
    case 'right':
      return { x: d };
    case 'up':
      return { y: `-${d}` };
    case 'down':
      return { y: d };
  }
}

export default function Reveal({
  children,
  direction = 'left',
  distance = '100%',
  duration = 0.8,
  delay = 0,
  fade = true,
  clip = true,
  once = true,
  amount = 0.3,
  className,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  // Variants live on the inner element (the part that moves), while the trigger
  // lives on the outer frame. The frame stays put and correctly positioned, so
  // viewport detection is reliable no matter how far the content is offset.
  const inner: Variants = {
    hidden: { ...offsetFor(direction, distance), ...(fade ? { opacity: 0 } : {}) },
    shown: {
      x: 0,
      y: 0,
      ...(fade ? { opacity: 1 } : {}),
      transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      className={className}
      style={clip ? { overflow: 'hidden' } : undefined}
      initial="hidden"
      whileInView="shown"
      viewport={{ once, amount }}
    >
      <motion.div variants={inner}>{children}</motion.div>
    </motion.div>
  );
}
