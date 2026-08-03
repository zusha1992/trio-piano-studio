'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, X } from 'lucide-react';
import DonutChart, { type Slice } from './analytics/DonutChart';
import BarChart, { type Bar } from './analytics/BarChart';

interface KeyCount {
  key: string;
  count: number;
}
interface AnalyticsData {
  totals: { sessions: number; pageviews: number; clicks: number; registrations: number };
  entrancesByDay: { day: string; count: number }[];
  entrancesByMonth: { month: string; count: number }[];
  languages: KeyCount[];
  devices: KeyCount[];
  clicks: KeyCount[];
  pages: KeyCount[];
}

const LANG_LABEL: Record<string, string> = { he: 'Hebrew', en: 'English', ar: 'Arabic', ru: 'Russian' };
const LANG_COLOR: Record<string, string> = { he: '#1b1b1d', en: '#9a8466', ar: '#5b7a6b', ru: '#7a3b2e' };
const DEVICE_LABEL: Record<string, string> = { desktop: 'Web', mobile: 'Mobile' };
const DEVICE_COLOR: Record<string, string> = { desktop: '#1b1b1d', mobile: '#9a8466' };

// 'home' is intentionally absent — the API drops it from the breakdown.
const PAGE_LABEL: Record<string, string> = {
  shop: 'Shop',
  rental: 'Rental',
  workshop: 'Workshop',
  about: 'About',
  contact: 'Contact',
  concerts: 'Concerts',
};
const CLICK_LABEL: Record<string, string> = {
  whatsapp: 'WhatsApp',
  email: 'Email',
  instagram: 'Instagram',
  phone: 'Phone',
  directions: 'Directions',
};
// A calm, earthy palette that suits the site; keys are assigned in order.
const PALETTE = ['#1b1b1d', '#9a8466', '#5b7a6b', '#7a3b2e', '#c9ccce', '#4a4a4d', '#b08968', '#3f5a52'];

function toSlices(rows: KeyCount[], labels: Record<string, string>): Slice[] {
  return rows.map((r, i) => ({
    label: labels[r.key] ?? r.key,
    value: r.count,
    color: PALETTE[i % PALETTE.length],
  }));
}

// Fills gaps so the last 30 days render as a continuous series (labels: DD).
function last30(rows: { day: string; count: number }[]): Bar[] {
  const map = new Map(rows.map((r) => [r.day, r.count]));
  const out: Bar[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push({
      label: key.slice(8),
      title: `${MONTHS[d.getMonth()]} ${d.getDate()}`,
      value: map.get(key) ?? 0,
    });
  }
  return out;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Fills gaps so the last 12 months render continuously (labels: short month).
function last12(rows: { month: string; count: number }[]): Bar[] {
  const map = new Map(rows.map((r) => [r.month, r.count]));
  const out: Bar[] = [];
  const today = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    out.push({
      label: MONTHS[d.getMonth()],
      title: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
      value: map.get(key) ?? 0,
    });
  }
  return out;
}

export default function AnalyticsPanel({ onClose }: { onClose: () => void }) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((r) => r.json() as Promise<{ ok?: boolean } & AnalyticsData>)
      .then((d) => (d.ok ? setData(d) : setError('Failed to load analytics.')))
      .catch(() => setError('Failed to load analytics.'));
  }, []);

  const langSlices: Slice[] = (data?.languages ?? []).map((l) => ({
    label: LANG_LABEL[l.key] ?? l.key,
    value: l.count,
    color: LANG_COLOR[l.key] ?? '#c9ccce',
  }));
  const deviceSlices: Slice[] = (data?.devices ?? []).map((d) => ({
    label: DEVICE_LABEL[d.key] ?? d.key,
    value: d.count,
    color: DEVICE_COLOR[d.key] ?? '#c9ccce',
  }));
  const pageSlices = toSlices(data?.pages ?? [], PAGE_LABEL);
  const clickSlices = toSlices(data?.clicks ?? [], CLICK_LABEL);

  return createPortal(
    <div className="fixed inset-0 z-[130] flex items-center justify-center px-4 py-[5vh]" dir="ltr">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-6xl rounded-2xl bg-white p-6 text-neutral-900 shadow-2xl sm:p-7">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute end-4 top-4 text-neutral-400 transition-colors hover:text-neutral-900"
        >
          <X size={18} />
        </button>

        <h2 className="mb-5 text-2xl font-medium tracking-tight">Analytics</h2>

        {error && <p className="py-10 text-center text-sm text-red-600">{error}</p>}
        {!data && !error && (
          <div className="flex justify-center py-16 text-neutral-400">
            <Loader2 className="animate-spin" />
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
            {/* Left (40%): counters on top, entrance graphs below. */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Visitors" value={data.totals.sessions} />
                <Stat label="Page views" value={data.totals.pageviews} />
                <Stat label="Contact clicks" value={data.totals.clicks} />
                <Stat label="Registrations" value={data.totals.registrations} />
              </div>
              <Card title="Entrances · last 12 months">
                <BarChart data={last12(data.entrancesByMonth)} maxLabels={12} height={96} />
              </Card>
              <Card title="Entrances · last 30 days">
                <BarChart data={last30(data.entrancesByDay)} maxLabels={10} height={96} />
              </Card>
            </div>

            {/* Right (60%): the four pie charts, 2×2. */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-3">
              <Card title="Language">
                <DonutChart data={langSlices} size={108} />
              </Card>
              <Card title="Device">
                <DonutChart data={deviceSlices} size={108} />
              </Card>
              <Card title="Contact Clicks">
                <DonutChart data={clickSlices} size={108} />
              </Card>
              <Card title="Pages Clicks">
                <DonutChart data={pageSlices} size={108} />
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <p className="text-2xl font-medium tracking-tight">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-neutral-400">{label}</p>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-neutral-400">{title}</p>
      {children}
    </div>
  );
}
