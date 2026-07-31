'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUp, Loader2 } from 'lucide-react';
import { useAdmin } from './AdminContext';
import { optimizeImage } from '@/lib/admin/optimizeImage';

interface AdminImageOverlayProps {
  entityType: string;
  entityId: string;
  /** Existing lead-image id; when set, it's deleted after the replacement uploads. */
  imageId?: number;
  /** Cover-crop ratio to match the container (e.g. 1 for square, 12/13). */
  aspect?: number;
  /** Circular mask + harsher compression for icons. */
  circle?: boolean;
  maxEdge?: number;
  quality?: number;
}

// Drop into any `position: relative` image container. Renders nothing unless
// edit mode is on; then it overlays a click-to-replace control that optimizes
// the chosen file in-browser, uploads it, removes the previous image, and
// refreshes the server data.
export default function AdminImageOverlay({
  entityType,
  entityId,
  imageId,
  aspect,
  circle = false,
  maxEdge,
  quality,
}: AdminImageOverlayProps) {
  const { editMode } = useAdmin();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  if (!editMode) return null;

  const onPick = async (file: File) => {
    setBusy(true);
    setError(false);
    try {
      const { blob, width, height } = await optimizeImage(file, {
        aspect,
        circle,
        maxEdge: maxEdge ?? (circle ? 256 : 2000),
        quality: quality ?? (circle ? 0.7 : 0.82),
      });
      const res = await fetch(
        `/api/admin/upload?entity_type=${encodeURIComponent(entityType)}&entity_id=${encodeURIComponent(
          entityId,
        )}&w=${width}&h=${height}`,
        { method: 'POST', headers: { 'content-type': 'image/webp' }, body: blob },
      );
      if (!res.ok) throw new Error('upload failed');
      // Replace semantics: remove the old lead image once the new one is stored.
      if (imageId) {
        await fetch(`/api/admin/media/${imageId}`, { method: 'DELETE' });
      }
      router.refresh();
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className={`absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-black/45 text-white opacity-0 transition-opacity hover:opacity-100 focus:opacity-100 ${
          circle ? 'rounded-full' : ''
        }`}
      >
        {busy ? <Loader2 size={22} className="animate-spin" /> : <ImageUp size={22} />}
        <span className="text-[10px] uppercase tracking-[0.25em]">
          {busy ? 'Uploading' : error ? 'Retry' : 'Replace'}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPick(file);
          e.target.value = '';
        }}
      />
    </>
  );
}
