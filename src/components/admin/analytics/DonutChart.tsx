'use client';

export interface Slice {
  label: string;
  value: number;
  color: string;
}

// Minimal SVG donut with a side legend. No dependencies; sized to sit neatly in
// a card. Empty data renders a soft placeholder ring.
export default function DonutChart({ data, size = 132 }: { data: Slice[]; size?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const stroke = 18;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const cx = size / 2;

  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        <g transform={`rotate(-90 ${cx} ${cx})`}>
          <circle cx={cx} cy={cx} r={r} fill="none" stroke="#f0f0ef" strokeWidth={stroke} />
          {total > 0 &&
            data.map((d) => {
              const len = (d.value / total) * c;
              const seg = (
                <circle
                  key={d.label}
                  cx={cx}
                  cy={cx}
                  r={r}
                  fill="none"
                  stroke={d.color}
                  strokeWidth={stroke}
                  strokeDasharray={`${len} ${c - len}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += len;
              return seg;
            })}
        </g>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-neutral-900"
          style={{ fontSize: 22, fontWeight: 500 }}
        >
          {total}
        </text>
      </svg>

      <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        {data.length === 0 && <li className="text-neutral-400">No data yet</li>}
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-1.5 text-neutral-700">
            <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="truncate capitalize">{d.label}</span>
            <span className="ms-auto shrink-0 text-neutral-400">
              {total > 0 ? `${Math.round((d.value / total) * 100)}%` : d.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
