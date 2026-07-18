'use client';

import { useEffect, useState } from 'react';

/**
 * Single source of truth for the mobile/desktop split used across the site.
 * The line is drawn at Tailwind's `lg` breakpoint (1024px): the desktop
 * split-screen needs width, so phones and portrait tablets get the mobile
 * look while anything wider keeps the desktop experience.
 *
 * Returns `null` until mounted so the server/first client render can default
 * to the desktop tree, avoiding a hydration mismatch.
 */
export function useIsMobile(query = '(max-width: 1023px)'): boolean | null {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);

  return isMobile;
}
