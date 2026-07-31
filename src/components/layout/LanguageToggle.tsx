'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { LOCALES, LOCALE_NAMES, LOCALE_SHORT, type Locale } from '@/lib/i18n';

// Language switcher: the trigger shows the CURRENT language; clicking it opens a
// menu with all four languages. Switching keeps the current path and only swaps
// the locale segment (e.g. /en/store → /ar/store). The trigger inherits its
// color from `triggerClassName` so it fits the toolbar and the hero chrome.
export default function LanguageToggle({
  triggerClassName = '',
  align = 'end',
}: {
  triggerClassName?: string;
  align?: 'start' | 'end';
}) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const restOfPath = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '');

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} dir="ltr" className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Change language"
        className={`text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${triggerClassName}`}
      >
        {LOCALE_SHORT[locale]}
      </button>
      {open && (
        <div
          role="menu"
          className={`absolute top-full z-50 mt-3 min-w-[8.5rem] overflow-hidden rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)] py-1 shadow-xl ${
            align === 'end' ? 'end-0' : 'start-0'
          }`}
        >
          {LOCALES.map((l) => (
            <Link
              key={l}
              href={`/${l}${restOfPath}`}
              onClick={() => setOpen(false)}
            dir={l === 'he' || l === 'ar' ? 'rtl' : 'ltr'}
            className={`block px-4 py-2 text-center text-sm transition-colors ${
                l === locale
                  ? 'text-[color:var(--c-cat-active)]'
                  : 'text-[color:var(--c-cat)] hover:text-[color:var(--c-cat-active)]'
              }`}
            >
              {LOCALE_NAMES[l]}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
