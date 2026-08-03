'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/**
 * Accessibility preferences (IS 5568 / WCAG 2.0 AA).
 *
 * These are real CSS-level adjustments applied to the document root, not an
 * overlay script: the underlying markup stays semantic and keyboard-navigable
 * whether the menu is used or not. Israeli law requires the *site* to be
 * accessible — a widget on top of an inaccessible site is not compliance —
 * so this menu is a convenience layer over an accessible baseline.
 */
export interface A11ySettings {
  /** Text scale multiplier: 1 → 1.6 in steps. */
  fontScale: number;
  /** Force a high-contrast palette (black on white / white on black). */
  contrast: 'off' | 'high' | 'invert';
  /** Drop all colour — helps some visual impairments and colour sensitivity. */
  grayscale: boolean;
  /** Underline and outline every link so they're distinguishable by shape. */
  highlightLinks: boolean;
  /** Swap the display typefaces for a plain, high-legibility sans. */
  readableFont: boolean;
  /** Freeze animations, transitions and the landing carousel. */
  stopAnimations: boolean;
  /** Enlarged cursor. */
  bigCursor: boolean;
}

export const DEFAULTS: A11ySettings = {
  fontScale: 1,
  contrast: 'off',
  grayscale: false,
  highlightLinks: false,
  readableFont: false,
  stopAnimations: false,
  bigCursor: false,
};

export const FONT_STEPS = [1, 1.15, 1.3, 1.45, 1.6];

const STORAGE_KEY = 'a11ySettings';

interface A11yContextValue {
  settings: A11ySettings;
  set: <K extends keyof A11ySettings>(key: K, value: A11ySettings[K]) => void;
  reset: () => void;
  /** True when anything differs from the defaults (drives the "on" indicator). */
  active: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const A11yContext = createContext<A11yContextValue | null>(null);

export function useA11y(): A11yContextValue {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error('useA11y must be used inside <AccessibilityProvider>');
  return ctx;
}

// Preferences are written straight onto <html> so plain CSS can react to them
// (see globals.css) — no re-render of the tree, and they survive navigation.
function apply(s: A11ySettings) {
  const root = document.documentElement;
  root.style.setProperty('--a11y-font', String(s.fontScale));
  const flag = (name: string, on: boolean) => {
    if (on) root.setAttribute(name, '');
    else root.removeAttribute(name);
  };
  flag('data-a11y-scaled', s.fontScale !== 1);
  if (s.contrast === 'off') root.removeAttribute('data-a11y-contrast');
  else root.setAttribute('data-a11y-contrast', s.contrast);
  flag('data-a11y-grayscale', s.grayscale);
  flag('data-a11y-links', s.highlightLinks);
  flag('data-a11y-font-readable', s.readableFont);
  flag('data-a11y-no-motion', s.stopAnimations);
  flag('data-a11y-cursor', s.bigCursor);
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<A11ySettings>(DEFAULTS);
  const [open, setOpen] = useState(false);

  // Restore the saved preferences on mount (they're per-device, like the theme).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = { ...DEFAULTS, ...(JSON.parse(raw) as Partial<A11ySettings>) };
        setSettings(saved);
        apply(saved);
        return;
      }
    } catch {
      // Ignore unreadable storage — fall through to the defaults.
    }
    apply(DEFAULTS);
  }, []);

  const persist = useCallback((next: A11ySettings) => {
    setSettings(next);
    apply(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage full or blocked — the settings still apply for this session.
    }
  }, []);

  const set = useCallback<A11yContextValue['set']>(
    (key, value) => persist({ ...settings, [key]: value }),
    [persist, settings],
  );

  const reset = useCallback(() => persist(DEFAULTS), [persist]);

  const active = useMemo(
    () => (Object.keys(DEFAULTS) as (keyof A11ySettings)[]).some((k) => settings[k] !== DEFAULTS[k]),
    [settings],
  );

  const value = useMemo(
    () => ({ settings, set, reset, active, open, setOpen }),
    [settings, set, reset, active, open],
  );

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
}
