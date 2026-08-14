'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Loader2, Trash2, X } from 'lucide-react';
import type { ShopItem } from '@/data/shopItems';
import type { BrandOption, OriginOption, ColorOption } from '@/lib/content';
import { optimizeImage } from '@/lib/admin/optimizeImage';
import PublishButton from './PublishButton';

// Edit-mode settings panel for a piano's non-inline fields. Localized text
// (description/details) is edited in place elsewhere; this handles the
// structured/scalar attributes, the managed option pickers (brand / origin /
// colour), and delete.
export default function PianoEditor({
  item,
  brands,
  origins,
  colors,
}: {
  item: ShopItem;
  brands: BrandOption[];
  origins: OriginOption[];
  colors: ColorOption[];
}) {
  const router = useRouter();
  const locale = useLocale();

  const [model, setModel] = useState(item.model);
  const [serial, setSerial] = useState(item.serial ?? '');
  const [year, setYear] = useState(item.year ? String(item.year) : '');
  const [contact, setContact] = useState(item.price === 'contact');
  const [price, setPrice] = useState(item.price === 'contact' ? '' : String(item.price));
  const [width, setWidth] = useState(String(item.dimensions.width));
  const [height, setHeight] = useState(String(item.dimensions.height));
  const [depth, setDepth] = useState(String(item.dimensions.depth));
  const [deleting, setDeleting] = useState(false);
  const [adding, setAdding] = useState<null | 'brand' | 'origin' | 'color'>(null);

  useEffect(() => {
    setModel(item.model);
    setSerial(item.serial ?? '');
    setYear(item.year ? String(item.year) : '');
    setContact(item.price === 'contact');
    setPrice(item.price === 'contact' ? '' : String(item.price));
    setWidth(String(item.dimensions.width));
    setHeight(String(item.dimensions.height));
    setDepth(String(item.dimensions.depth));
  }, [item.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveScalar = async (fields: Record<string, unknown>) => {
    await fetch(`/api/admin/piano/${item.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ fields }),
    });
    router.refresh();
  };

  const saveColor = async (hex: string, name: { en: string; he: string }) => {
    await Promise.all([
      fetch(`/api/admin/piano/${item.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ fields: { color_hex: hex } }),
      }),
      fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ entity: 'piano', id: item.id, fields: { color_name_en: name.en, color_name_he: name.he } }),
      }),
    ]);
    router.refresh();
  };

  const remove = async () => {
    if (!window.confirm('Delete this piano? This cannot be undone.')) return;
    setDeleting(true);
    await fetch(`/api/admin/piano/${item.id}`, { method: 'DELETE' });
    router.push(`/${locale}/${item.rental ? 'rental' : 'store'}`);
    router.refresh();
  };

  const inputCls =
    'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-900';
  const labelCls = 'flex flex-col gap-1 text-[10px] uppercase tracking-[0.2em] text-neutral-400';
  // Custom chevron so the arrow has breathing room from the edge (the native
  // one sits flush and can't be nudged with padding).
  const selectCls = `${inputCls} appearance-none pe-9`;
  const selectStyle: CSSProperties = {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23737373' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.75rem center',
    backgroundSize: '12px',
  };

  const ADD = '__add__';
  const brandInList = brands.some((b) => b.name === item.brand);
  const colorInList = colors.some((c) => c.hex.toLowerCase() === item.color.hex.toLowerCase());

  return (
    <div className="ms-4 mt-6 rounded-2xl border border-dashed border-neutral-300 p-5 sm:ms-8 md:ms-14 lg:ms-24">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">Piano details · edit</p>
        <button
          type="button"
          onClick={remove}
          disabled={deleting}
          className="flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          Delete
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        <label className={labelCls}>
          Brand
          <select
            value={item.brand}
            onChange={(e) => {
              if (e.target.value === ADD) return setAdding('brand');
              saveScalar({ brand: e.target.value });
            }}
            className={selectCls}
            style={selectStyle}
          >
            {!brandInList && <option value={item.brand}>{item.brand || '—'}</option>}
            {brands.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
            <option value={ADD}>+ Add new brand…</option>
          </select>
        </label>

        <label className={labelCls}>
          Model
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            onBlur={() => model !== item.model && saveScalar({ model })}
            className={inputCls}
          />
        </label>

        <label className={labelCls}>
          Type
          <select
            value={item.type}
            onChange={(e) => {
              const type = e.target.value;
              // Grands share a closed-lid height of 100 cm.
              if (type === 'grand') {
                setHeight('100');
                saveScalar({ type, dim_height: 100 });
              } else {
                saveScalar({ type });
              }
            }}
            className={selectCls}
            style={selectStyle}
          >
            <option value="upright">Upright</option>
            <option value="grand">Grand</option>
          </select>
        </label>

        <label className={labelCls}>
          Origin
          <select
            value={item.region}
            onChange={(e) => {
              if (e.target.value === ADD) return setAdding('origin');
              saveScalar({ region: e.target.value });
            }}
            className={selectCls}
            style={selectStyle}
          >
            {!origins.some((o) => o.id === item.region) && item.region && (
              <option value={item.region}>{item.region}</option>
            )}
            {origins.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label.en || o.label.he || o.id}
              </option>
            ))}
            <option value={ADD}>+ Add new origin…</option>
          </select>
        </label>

        <label className={labelCls}>
          Serial (optional)
          <input
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            onBlur={() => serial !== (item.serial ?? '') && saveScalar({ serial })}
            className={inputCls}
          />
        </label>

        <label className={labelCls}>
          Year
          <input
            type="number"
            inputMode="numeric"
            placeholder="e.g. 1998"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            onBlur={() => year !== (item.year ? String(item.year) : '') && saveScalar({ year })}
            className={inputCls}
          />
        </label>

        <label className={labelCls}>
          Color
          <select
            value={item.color.hex}
            onChange={(e) => {
              if (e.target.value === ADD) return setAdding('color');
              const preset = colors.find((c) => c.hex === e.target.value);
              if (preset) saveColor(preset.hex, preset.name);
            }}
            className={selectCls}
            style={selectStyle}
          >
            {!colorInList && <option value={item.color.hex}>{item.color.name.en || 'Current'}</option>}
            {colors.map((c) => (
              <option key={c.id} value={c.hex}>
                {c.name.en || c.hex}
              </option>
            ))}
            <option value={ADD}>+ Add new color…</option>
          </select>
        </label>

        {/* Rentals are priced per client and occasion, so the rental page
            shows no price at all — the field is hidden rather than ignored. */}
        {!item.rental && (
          <div className={labelCls}>
            Price ₪
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={price}
                disabled={contact}
                onChange={(e) => setPrice(e.target.value)}
                onBlur={() => !contact && saveScalar({ price_ils: price })}
                className={`${inputCls} disabled:opacity-40`}
              />
            </div>
            <label className="mt-1 flex items-center gap-1.5 text-[10px] normal-case tracking-normal text-neutral-500">
              <input
                type="checkbox"
                checked={contact}
                onChange={(e) => {
                  setContact(e.target.checked);
                  saveScalar({ price_ils: e.target.checked ? 'contact' : Number(price) || 0 });
                }}
              />
              Price on request
            </label>
          </div>
        )}

        <label className={labelCls}>
          Width (cm)
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            onBlur={() => Number(width) !== item.dimensions.width && saveScalar({ dim_width: width })}
            className={inputCls}
          />
        </label>
        <label className={labelCls}>
          Height (cm)
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            onBlur={() => Number(height) !== item.dimensions.height && saveScalar({ dim_height: height })}
            className={inputCls}
          />
        </label>
        <label className={labelCls}>
          Depth (cm)
          <input
            type="number"
            value={depth}
            onChange={(e) => setDepth(e.target.value)}
            onBlur={() => Number(depth) !== item.dimensions.depth && saveScalar({ dim_depth: depth })}
            className={inputCls}
          />
        </label>

        <div className="flex items-end gap-5 pb-2">
          <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
            <input type="checkbox" checked={item.wip === true} onChange={(e) => saveScalar({ wip: e.target.checked })} />
            Restoration
          </label>
          {/* Moving a piano between the shop and the rental fleet changes the
              section it lives in, so follow it to its new address. */}
          <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
            <input
              type="checkbox"
              checked={item.rental === true}
              onChange={async (e) => {
                const rental = e.target.checked;
                await saveScalar({ rental });
                router.push(`/${locale}/${rental ? 'rental' : 'store'}/${item.id}`);
              }}
            />
            Rental
          </label>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <PublishButton
          published={item.published !== false}
          onChange={(next) => saveScalar({ published: next })}
        />
      </div>

      {adding && (
        <AddLibraryModal
          kind={adding}
          onClose={() => setAdding(null)}
          onDone={() => {
            setAdding(null);
            router.refresh();
          }}
          onBrand={(name) => saveScalar({ brand: name })}
          onOrigin={(id) => saveScalar({ region: id })}
          onColor={(hex, name) => saveColor(hex, name)}
        />
      )}
    </div>
  );
}

// Small modal for adding a new brand / origin / colour to the shared libraries.
// Brand & origin capture an image that is circle-cropped + heavily optimized on
// the client before upload; colour captures a hex + localized name.
function AddLibraryModal({
  kind,
  onClose,
  onDone,
  onBrand,
  onOrigin,
  onColor,
}: {
  kind: 'brand' | 'origin' | 'color';
  onClose: () => void;
  onDone: () => void;
  onBrand: (name: string) => Promise<void>;
  onOrigin: (id: string) => Promise<void>;
  onColor: (hex: string, name: { en: string; he: string }) => Promise<void>;
}) {
  const [nameEn, setNameEn] = useState('');
  const [nameHe, setNameHe] = useState('');
  const [hex, setHex] = useState('#1b1b1d');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = kind === 'brand' ? 'New brand' : kind === 'origin' ? 'New origin' : 'New color';

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      if (kind === 'brand') {
        const name = nameEn.trim();
        if (!name) throw new Error('Enter a brand name.');
        const res = await fetch('/api/admin/library', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ kind: 'brand', name }),
        });
        const data = (await res.json()) as { ok?: boolean; id?: string; error?: string };
        if (!data.ok || !data.id) throw new Error(data.error ?? 'Failed to create brand.');
        if (file) await uploadIcon('brand', data.id, file);
        await onBrand(name);
      } else if (kind === 'origin') {
        if (!nameHe.trim() && !nameEn.trim()) throw new Error('Enter an origin name.');
        const res = await fetch('/api/admin/library', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ kind: 'origin', name_en: nameEn.trim(), name_he: nameHe.trim() }),
        });
        const data = (await res.json()) as { ok?: boolean; id?: string; error?: string };
        if (!data.ok || !data.id) throw new Error(data.error ?? 'Failed to create origin.');
        if (file) await uploadIcon('origin', data.id, file);
        await onOrigin(data.id);
      } else {
        if (!/^#[0-9a-fA-F]{6}$/.test(hex)) throw new Error('Enter a valid hex colour.');
        const res = await fetch('/api/admin/library', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ kind: 'color', hex, name_en: nameEn.trim(), name_he: nameHe.trim() }),
        });
        const data = (await res.json()) as { ok?: boolean; error?: string };
        if (!data.ok) throw new Error(data.error ?? 'Failed to create colour.');
        await onColor(hex, { en: nameEn.trim(), he: nameHe.trim() });
      }
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      setBusy(false);
    }
  };

  const inputCls =
    'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-900';
  const labelCls = 'flex flex-col gap-1 text-[10px] uppercase tracking-[0.2em] text-neutral-400';

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-7 text-neutral-900 shadow-2xl">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute end-4 top-4 text-neutral-400 transition-colors hover:text-neutral-900"
        >
          <X size={18} />
        </button>
        <h3 className="mb-5 text-lg font-medium">{title}</h3>

        <div className="flex flex-col gap-3">
          {kind === 'color' && (
            <label className={labelCls}>
              Color
              <div className="flex items-center gap-2">
                <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="h-9 w-12 cursor-pointer rounded border border-neutral-300" />
                <input value={hex} onChange={(e) => setHex(e.target.value)} className={inputCls} />
              </div>
            </label>
          )}

          <label className={labelCls}>
            {kind === 'brand' ? 'Name' : 'Name (English)'}
            <input autoFocus value={nameEn} onChange={(e) => setNameEn(e.target.value)} className={inputCls} />
          </label>

          {kind !== 'brand' && (
            <label className={labelCls}>
              Name (Hebrew)
              <input value={nameHe} onChange={(e) => setNameHe(e.target.value)} dir="rtl" className={inputCls} />
            </label>
          )}

          {kind !== 'color' && (
            <label className={labelCls}>
              {kind === 'brand' ? 'Logo (cropped to a circle)' : 'Flag (cropped to a circle)'}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="text-xs text-neutral-600 file:mr-3 file:rounded-full file:border-0 file:bg-neutral-900 file:px-3 file:py-1.5 file:text-[10px] file:uppercase file:tracking-[0.2em] file:text-white"
              />
            </label>
          )}
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-neutral-500 transition-colors hover:text-neutral-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className="flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-2 text-[11px] uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {busy && <Loader2 size={12} className="animate-spin" />}
            {busy ? 'Saving…' : 'Add'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// Circle-crops + heavily downscales an icon on the client, then uploads it.
async function uploadIcon(kind: 'brand' | 'origin', id: string, file: File) {
  const { blob } = await optimizeImage(file, { circle: true, aspect: 1, maxEdge: 256, quality: 0.85 });
  await fetch(`/api/admin/library/image?kind=${kind}&id=${encodeURIComponent(id)}`, {
    method: 'POST',
    headers: { 'content-type': 'image/webp' },
    body: blob,
  });
}
