'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocale, useTranslations } from 'next-intl';
import { Minus, Plus, RotateCcw, X } from 'lucide-react';
import { FONT_STEPS, useA11y } from './AccessibilityContext';
import { isRtl } from '@/lib/i18n';

/**
 * The accessibility button (toolbar + landing screens) and its panel.
 *
 * The panel is a modal dialog: focus moves into it on open, Tab is trapped
 * inside it, Escape closes it and focus returns to the button that opened it —
 * the keyboard behaviour WCAG 2.1.2 / 2.4.3 expect.
 */
export function AccessibilityButton({ className = '' }: { className?: string }) {
  const t = useTranslations('a11y');
  const { open, setOpen, active } = useA11y();

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      aria-label={t('open')}
      aria-expanded={open}
      aria-haspopup="dialog"
      data-a11y-trigger
      className={`relative inline-flex items-center justify-center transition-colors duration-300 ${className}`}
    >
      {/* The icon is a monochrome PNG used as a mask, so it takes the current
          text colour and works in both themes and in high contrast. */}
      <span
        aria-hidden
        className="inline-block h-[17px] w-[17px] bg-current"
        style={{
          maskImage: 'url(/assets/icons/accessibility.png)',
          WebkitMaskImage: 'url(/assets/icons/accessibility.png)',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
        }}
      />
      {active && (
        <span
          aria-hidden
          className="absolute -end-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-current"
        />
      )}
    </button>
  );
}

export function AccessibilityPanel() {
  const t = useTranslations('a11y');
  const locale = useLocale();
  const rtl = isRtl(locale);
  const { settings, set, reset, open, setOpen } = useA11y();
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  // Remember what opened the panel, move focus in, and hand it back on close.
  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement as HTMLElement | null;
    const first = panelRef.current?.querySelector<HTMLElement>('button, [href], input');
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      openerRef.current?.focus?.();
    };
  }, [open, setOpen]);

  if (!open) return null;

  const step = FONT_STEPS.indexOf(settings.fontScale);
  const atMin = step <= 0;
  const atMax = step >= FONT_STEPS.length - 1;

  const rowCls =
    'flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-start text-[15px] transition-colors';
  const onCls = 'bg-[var(--c-text)] text-[var(--c-bg)]';
  const offCls = 'text-[var(--c-text)] hover:bg-[var(--c-bg-alt)]';

  const Toggle = ({
    label,
    on,
    onClick,
  }: {
    label: string;
    on: boolean;
    onClick: () => void;
  }) => (
    <button type="button" onClick={onClick} aria-pressed={on} className={`${rowCls} ${on ? onCls : offCls}`}>
      <span>{label}</span>
      <span
        aria-hidden
        className={`h-4 w-4 shrink-0 rounded border ${
          on ? 'border-current bg-current' : 'border-[var(--c-dim)]'
        }`}
      />
    </button>
  );

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center p-4 sm:items-center"
      dir={rtl ? 'rtl' : 'ltr'}
    >
      <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} aria-hidden />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('menu_title')}
        className="relative mt-16 max-h-[80vh] w-full max-w-sm overflow-y-auto rounded-2xl border border-[var(--c-border)] bg-[var(--c-bg)] p-5 shadow-2xl sm:mt-0"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-[var(--c-text)]">{t('menu_title')}</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t('close')}
            className="rounded p-1 text-[var(--c-dim)] transition-colors hover:text-[var(--c-text)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Text size */}
        <div className="mb-3 rounded-xl border border-[var(--c-border)] p-3">
          <div className="mb-2 flex items-center justify-between text-[15px] text-[var(--c-text)]">
            <span>{t('font_size')}</span>
            <span aria-hidden className="text-[var(--c-dim)]">
              {Math.round(settings.fontScale * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => set('fontScale', FONT_STEPS[Math.max(0, step - 1)])}
              disabled={atMin}
              aria-label={t('decrease')}
              className="flex h-10 flex-1 items-center justify-center rounded-lg border border-[var(--c-border)] text-[var(--c-text)] transition-colors hover:bg-[var(--c-bg-alt)] disabled:opacity-40"
            >
              <Minus size={16} />
            </button>
            <button
              type="button"
              onClick={() => set('fontScale', FONT_STEPS[Math.min(FONT_STEPS.length - 1, step + 1)])}
              disabled={atMax}
              aria-label={t('increase')}
              className="flex h-10 flex-1 items-center justify-center rounded-lg border border-[var(--c-border)] text-[var(--c-text)] transition-colors hover:bg-[var(--c-bg-alt)] disabled:opacity-40"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Contrast — three exclusive choices */}
        <div className="mb-3 rounded-xl border border-[var(--c-border)] p-3">
          <p className="mb-2 text-[15px] text-[var(--c-text)]">{t('contrast')}</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t('contrast')}>
            {(['off', 'high', 'invert'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => set('contrast', mode)}
                aria-pressed={settings.contrast === mode}
                className={`rounded-full border px-3 py-1.5 text-[13px] transition-colors ${
                  settings.contrast === mode
                    ? 'border-[var(--c-text)] bg-[var(--c-text)] text-[var(--c-bg)]'
                    : 'border-[var(--c-border)] text-[var(--c-text)] hover:bg-[var(--c-bg-alt)]'
                }`}
              >
                {t(mode === 'off' ? 'contrast_off' : mode === 'high' ? 'contrast_high' : 'contrast_invert')}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Toggle
            label={t('grayscale')}
            on={settings.grayscale}
            onClick={() => set('grayscale', !settings.grayscale)}
          />
          <Toggle
            label={t('highlight_links')}
            on={settings.highlightLinks}
            onClick={() => set('highlightLinks', !settings.highlightLinks)}
          />
          <Toggle
            label={t('readable_font')}
            on={settings.readableFont}
            onClick={() => set('readableFont', !settings.readableFont)}
          />
          <Toggle
            label={t('stop_animations')}
            on={settings.stopAnimations}
            onClick={() => set('stopAnimations', !settings.stopAnimations)}
          />
          <Toggle
            label={t('big_cursor')}
            on={settings.bigCursor}
            onClick={() => set('bigCursor', !settings.bigCursor)}
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--c-border)] pt-4">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 text-[13px] text-[var(--c-dim)] transition-colors hover:text-[var(--c-text)]"
          >
            <RotateCcw size={14} />
            {t('reset')}
          </button>
          <a
            href={`/${locale}/accessibility`}
            className="text-[13px] text-[var(--c-text)] underline underline-offset-4"
          >
            {t('statement')}
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}
