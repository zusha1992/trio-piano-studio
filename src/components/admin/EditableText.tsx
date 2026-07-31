'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Pencil, X } from 'lucide-react';
import { useAdmin } from './AdminContext';
import { isRtl } from '@/lib/i18n';

// English names for the editor chrome (the admin UI is in English).
const LANG_LABEL: Record<string, string> = {
  he: 'Hebrew',
  en: 'English',
  ar: 'Arabic',
  ru: 'Russian',
};

interface EditableTextProps {
  /** Entity key understood by /api/admin/content (e.g. 'about_section'). */
  entity: string;
  /** Row id / key. */
  id: string;
  /** Base column name; the active locale suffix is appended (e.g. 'title' → 'title_he'). */
  column: string;
  /** Current value for the active locale — string, or string[] for paragraph lists. */
  value: string | string[];
  /** Edit as a list of paragraphs (stored as a JSON array). */
  array?: boolean;
  /** Use a multi-line textarea. */
  multiline?: boolean;
  /** Human label shown in the editor. */
  label?: string;
  /** Optional live word-count guidance shown in the editor. */
  wordTarget?: { min: number; max: number };
  /** The rendered (read-mode) content. */
  children: ReactNode;
  className?: string;
  /** Wrapper element — use 'div' when wrapping block content (e.g. paragraphs). */
  wrapAs?: 'span' | 'div';
}

export default function EditableText({
  entity,
  id,
  column,
  value,
  array = false,
  multiline = false,
  label,
  wordTarget,
  children,
  className = '',
  wrapAs = 'span',
}: EditableTextProps) {
  const { editMode } = useAdmin();
  const [open, setOpen] = useState(false);

  if (!editMode) return <>{children}</>;

  const Wrapper = wrapAs;

  return (
    <Wrapper className={`group relative ${wrapAs === 'span' ? 'inline-block' : 'block'} ${className}`}>
      {children}
      <button
        type="button"
        aria-label="Edit"
        onClick={() => setOpen(true)}
        className="absolute -end-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white opacity-0 shadow transition-opacity group-hover:opacity-100"
      >
        <Pencil size={12} />
      </button>
      {open && (
        <EditModal
          entity={entity}
          id={id}
          column={column}
          value={value}
          array={array}
          multiline={multiline}
          label={label}
          wordTarget={wordTarget}
          onClose={() => setOpen(false)}
        />
      )}
    </Wrapper>
  );
}

function EditModal({
  entity,
  id,
  column,
  value,
  array,
  multiline,
  label,
  wordTarget,
  onClose,
}: Omit<EditableTextProps, 'children' | 'className'> & { onClose: () => void }) {
  const router = useRouter();
  const locale = useLocale();
  const initial = array ? (value as string[]).join('\n\n') : (value as string);
  const [text, setText] = useState(initial);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Editing the source language defaults to propagating everywhere; a fix in a
  // translated language defaults to that language only.
  const isSource = locale === 'he';
  const [scope, setScope] = useState<'all' | 'one'>(isSource ? 'all' : 'one');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const save = async () => {
    setPending(true);
    setError(null);
    const fieldValue = array
      ? text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
      : text.trim();
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          entity,
          id,
          fields: { [`${column}_${locale}`]: fieldValue },
          sync: { base: column, from: locale, scope },
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        onClose();
        router.refresh();
      } else {
        setError(data.error ?? 'Save failed.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setPending(false);
    }
  };

  const useTextarea = multiline || array;
  const rtl = isRtl(locale);
  const langName = LANG_LABEL[locale] ?? locale.toUpperCase();
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6" dir={rtl ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-7 text-neutral-900 shadow-2xl">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute end-4 top-4 text-neutral-400 transition-colors hover:text-neutral-900"
        >
          <X size={18} />
        </button>

        <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-neutral-400">
          Edit · {locale.toUpperCase()}
        </p>
        {label && <h3 className="mb-4 text-lg font-medium">{label}</h3>}

        <div className="mb-4">
          <div className="inline-flex rounded-full bg-neutral-100 p-1 text-[11px]">
            <button
              type="button"
              onClick={() => setScope('all')}
              className={`rounded-full px-3.5 py-1.5 transition-colors ${
                scope === 'all' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              All languages
            </button>
            <button
              type="button"
              onClick={() => setScope('one')}
              className={`rounded-full px-3.5 py-1.5 transition-colors ${
                scope === 'one' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {langName} only
            </button>
          </div>
          <p className="mt-2 text-xs text-neutral-400">
            {scope === 'all'
              ? `Saved in ${langName} and auto-translated to the other languages.`
              : `Only the ${langName} text changes; other languages stay as they are.`}
          </p>
        </div>

        {useTextarea ? (
          <textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={array ? 10 : 5}
            dir={rtl ? 'rtl' : 'ltr'}
            className="w-full resize-y rounded-lg border border-neutral-300 bg-white px-4 py-3 text-[15px] leading-relaxed outline-none focus:border-neutral-900"
          />
        ) : (
          <input
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            dir={rtl ? 'rtl' : 'ltr'}
            className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-[15px] outline-none focus:border-neutral-900"
          />
        )}

        {array && (
          <p className="mt-2 text-xs text-neutral-400">Separate paragraphs with a blank line.</p>
        )}
        {wordTarget && (
          <p
            className={`mt-2 text-xs ${
              wordCount >= wordTarget.min && wordCount <= wordTarget.max
                ? 'text-green-600'
                : 'text-neutral-400'
            }`}
          >
            {wordCount} words · suggested {wordTarget.min}–{wordTarget.max} for this layout
          </p>
        )}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-neutral-500 transition-colors hover:text-neutral-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="rounded-full bg-neutral-900 px-6 py-2 text-[11px] uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
