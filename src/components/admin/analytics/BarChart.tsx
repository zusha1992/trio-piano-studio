'use client';

export interface Bar {
  label: string;
  value: number;
  /** Full descriptor shown in the hover tooltip (falls back to label). */
  title?: string;
}

// Simple responsive column chart for a time series (e.g. entrances per day /
// month). Bars scale to the max value; labels are thinned to at most `maxLabels`
// to avoid crowding.
export default function BarChart({
  data,
  height = 140,
  maxLabels = 8,
}: {
  data: Bar[];
  height?: number;
  maxLabels?: number;
}) {
  if (data.length === 0) {
    return <p className="py-10 text-center text-sm text-neutral-400">No visits recorded yet.</p>;
  }
  const max = Math.max(...data.map((d) => d.value), 1);
  const labelEvery = Math.max(1, Math.ceil(data.length / maxLabels));

  return (
    <div className="flex items-end gap-1" style={{ height: height + 22 }}>
      {data.map((d, i) => (
        <div key={d.label + i} className="group flex flex-1 flex-col items-center justify-end gap-1">
          <div className="relative w-full" style={{ height }}>
            {/* Hover tooltip: full period + entrance count. */}
            <span className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 text-[10px] font-medium text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
              {d.title ?? d.label} · {d.value} {d.value === 1 ? 'entrance' : 'entrances'}
            </span>
            <div
              className="absolute bottom-0 w-full rounded-t bg-neutral-900/85 transition-colors group-hover:bg-neutral-900"
              style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value > 0 ? 2 : 0 }}
            />
          </div>
          <span className="h-3 whitespace-nowrap text-[9px] leading-none text-neutral-400">
            {i % labelEvery === 0 ? d.label : ''}
          </span>
        </div>
      ))}
    </div>
  );
}
