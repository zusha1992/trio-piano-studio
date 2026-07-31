'use client';

import { useEffect, useRef, useState, type DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ImageUp, Loader2, Trash2 } from 'lucide-react';
import { useAdmin } from './AdminContext';
import { optimizeImage } from '@/lib/admin/optimizeImage';
import type { EntityImage } from '@/lib/content';

interface AdminGalleryEditorProps {
  entityType: string;
  entityId: string;
  images: EntityImage[];
  /** Optional cover-crop ratio for uploads; omit to keep original aspect. */
  aspect?: number;
  label?: string;
}

// Edit-mode-only management grid for a multi-image gallery: drag to reorder,
// delete individual images (from R2 + DB), and add new ones (optimized in the
// browser). Renders nothing for public visitors — the normal carousel handles
// display and reflects changes after a refresh.
export default function AdminGalleryEditor({
  entityType,
  entityId,
  images,
  aspect,
  label = 'Gallery',
}: AdminGalleryEditorProps) {
  const { editMode } = useAdmin();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<EntityImage[]>(images);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // The index being dragged and a live mirror of the current order, so drop can
  // persist without relying on a stale render closure.
  const dragFrom = useRef<number | null>(null);
  const orderRef = useRef<EntityImage[]>(images);

  // Keep local order in sync when the server data refreshes.
  useEffect(() => {
    setItems(images);
    orderRef.current = images;
  }, [images]);

  if (!editMode) return null;

  const scheduleOrderSave = (ordered: EntityImage[]) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void fetch('/api/admin/media/reorder', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ids: ordered.map((i) => i.id) }),
      });
    }, 600);
  };

  const addFiles = async (files: FileList) => {
    setAdding(true);
    try {
      for (const file of Array.from(files)) {
        const { blob, width, height } = await optimizeImage(file, { aspect });
        await fetch(
          `/api/admin/upload?entity_type=${encodeURIComponent(entityType)}&entity_id=${encodeURIComponent(
            entityId,
          )}&w=${width}&h=${height}`,
          { method: 'POST', headers: { 'content-type': 'image/webp' }, body: blob },
        );
      }
      router.refresh();
    } finally {
      setAdding(false);
    }
  };

  const remove = async (id: number) => {
    setDeletingId(id);
    try {
      await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((i) => i.id !== id));
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  };

  // Native HTML5 drag-and-drop — unlike a single-axis Reorder it handles a
  // wrapping multi-row grid correctly. Reordering happens live as you drag over
  // a neighbour; the new order is saved on drop.
  const onDragStart = (index: number, id: number) => {
    dragFrom.current = index;
    setDraggingId(id);
  };

  const onDragOverItem = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const from = dragFrom.current;
    if (from === null || from === index) return;
    const next = [...orderRef.current];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);
    orderRef.current = next;
    dragFrom.current = index;
    setItems(next);
  };

  const onDragEnd = () => {
    if (dragFrom.current !== null) scheduleOrderSave(orderRef.current);
    dragFrom.current = null;
    setDraggingId(null);
  };

  return (
    <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">{label} · edit</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={adding}
          className="flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {adding ? <Loader2 size={13} className="animate-spin" /> : <ImageUp size={13} />}
          {adding ? 'Uploading' : 'Add photos'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-neutral-400">No photos yet.</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {items.map((img, index) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => onDragStart(index, img.id)}
              onDragOver={(e) => onDragOverItem(e, index)}
              onDrop={(e) => e.preventDefault()}
              onDragEnd={onDragEnd}
              className={`group relative h-24 w-24 shrink-0 cursor-grab overflow-hidden rounded-lg bg-neutral-100 transition-opacity active:cursor-grabbing ${
                draggingId === img.id ? 'opacity-40' : ''
              }`}
            >
              <Image src={img.url} alt="" fill sizes="96px" className="pointer-events-none object-cover" />
              <button
                type="button"
                aria-label="Delete photo"
                onClick={() => remove(img.id)}
                disabled={deletingId === img.id}
                className="absolute end-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                {deletingId === img.id ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Trash2 size={12} />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="mt-3 text-[11px] text-neutral-400">Drag to reorder · hover a photo to delete.</p>
    </div>
  );
}
