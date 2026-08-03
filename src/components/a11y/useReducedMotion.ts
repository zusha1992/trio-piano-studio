'use client';

import { useEffect, useState } from 'react';

/**
 * True when motion should be suppressed — either the visitor asked for it in
 * the accessibility menu (`data-a11y-no-motion` on <html>) or their operating
 * system is set to "reduce motion".
 *
 * Content that moves on its own must be stoppable (WCAG 2.2.2), and CSS alone
 * can't stop a JS timer, so the auto-advancing carousel and the landing
 * background cycle read this hook and simply don't start.
 *
 * Reads the DOM rather than the React context so it works in any component,
 * including ones rendered outside the provider.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const read = () => setReduced(mql.matches || document.documentElement.hasAttribute('data-a11y-no-motion'));

    read();
    mql.addEventListener('change', read);
    // The menu toggles the attribute while the page is open.
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-a11y-no-motion'] });

    return () => {
      mql.removeEventListener('change', read);
      observer.disconnect();
    };
  }, []);

  return reduced;
}
