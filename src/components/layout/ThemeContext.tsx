'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { SCHEMES, THEME_KEY } from '@/components/layout/heroShared';

// Either scheme — `SCHEMES` is `as const`, so light/dark have distinct literal
// types; the union keeps both assignable to `scheme`.
type Scheme = (typeof SCHEMES)[keyof typeof SCHEMES];

interface ThemeValue {
  /** true = dark ("negative") scheme */
  negative: boolean;
  /** color scheme used by the home-screen overlay (inline colors) */
  scheme: Scheme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

/**
 * Single source of truth for the light/dark preference. It persists the choice
 * (so it survives language switches / reloads) and mirrors it onto the `dark`
 * class of <html>, which drives all the CSS `--c-*` tokens on the subpages.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Start `false` so the first client render matches the server (avoids a
  // hydration mismatch on theme-dependent UI like the toggle icon). The real
  // preference is read after mount; the pre-paint script in the layout has
  // already set the `html.dark` class, so CSS-token colors never flash.
  const [negative, setNegative] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setNegative(window.localStorage.getItem(THEME_KEY) === 'dark');
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle('dark', negative);
  }, [negative, mounted]);

  const toggle = useCallback(() => {
    setNegative((v) => {
      const next = !v;
      try {
        window.localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
      } catch {}
      return next;
    });
  }, []);

  const scheme = negative ? SCHEMES.dark : SCHEMES.light;
  return (
    <ThemeContext.Provider value={{ negative, scheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
