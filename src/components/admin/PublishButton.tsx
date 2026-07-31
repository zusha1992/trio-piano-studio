'use client';

import { Check } from 'lucide-react';

// Prominent publish/unpublish toggle styled as a clear call-to-action button
// (rather than a small checkbox). Green = live/published; dark = draft, click to
// publish. Used by the piano and concert editors.
export default function PublishButton({
  published,
  onChange,
  className = '',
}: {
  published: boolean;
  onChange: (next: boolean) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!published)}
      title={published ? 'Published — click to unpublish' : 'Draft — click to publish'}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-2.5 text-[11px] uppercase tracking-[0.25em] transition-colors ${
        published
          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
          : 'bg-neutral-900 text-white hover:bg-neutral-800'
      } ${className}`}
    >
      {published ? (
        <>
          <Check size={13} /> Published
        </>
      ) : (
        'Publish'
      )}
    </button>
  );
}
