import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Scalar (non-localized) piano fields. Localized text (color name, description,
// details) goes through /api/admin/content instead.
const SCALAR_COLS = [
  'brand',
  'model',
  'type',
  'serial',
  'region',
  'size',
  'year',
  'price_ils',
  'color_hex',
  'dim_width',
  'dim_height',
  'dim_depth',
  'wip',
  'published',
  'rental',
];
const NUMERIC = new Set(['dim_width', 'dim_height', 'dim_depth']);
// Optional numbers: blank clears the value (NULL) rather than coercing to 0.
const NULLABLE_NUMERIC = new Set(['year']);
const BOOL = new Set(['wip', 'published', 'rental']);

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let body: { fields?: Record<string, unknown> };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const entries = Object.entries(body.fields ?? {}).filter(([col]) => SCALAR_COLS.includes(col));
  if (!entries.length) {
    return NextResponse.json({ ok: false, error: 'No writable fields' }, { status: 400 });
  }

  const setClause = entries.map(([col]) => `${col} = ?`).join(', ');
  const values = entries.map(([col, value]) => {
    if (col === 'price_ils') {
      // '' / 'contact' / null → NULL ("contact for price"); otherwise a number.
      if (value === '' || value === 'contact' || value == null) return null;
      return Number(value) || 0;
    }
    if (NULLABLE_NUMERIC.has(col)) {
      if (value === '' || value == null) return null;
      return Number(value) || null;
    }
    if (NUMERIC.has(col)) return Number(value) || 0;
    if (BOOL.has(col)) return value ? 1 : 0;
    return value == null ? null : String(value);
  });

  const { env } = getCloudflareContext();
  await env.DB.prepare(
    `UPDATE pianos SET ${setClause}, updated_at = datetime('now') WHERE id = ?`,
  )
    .bind(...values, params.id)
    .run();

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { env } = getCloudflareContext();
  // Seeded rental copies point at the same R2 objects as the shop piano they
  // were duplicated from, so an object is only removed once no other image row
  // still references it.
  const { results } = await env.DB.prepare(
    'SELECT storage_key FROM images WHERE entity_type = ? AND entity_id = ?',
  )
    .bind('piano', params.id)
    .all<{ storage_key: string | null }>();
  for (const row of results) {
    if (!row.storage_key) continue;
    const shared = await env.DB.prepare(
      'SELECT 1 FROM images WHERE storage_key = ? AND NOT (entity_type = ? AND entity_id = ?) LIMIT 1',
    )
      .bind(row.storage_key, 'piano', params.id)
      .first();
    if (!shared) await env.MEDIA.delete(row.storage_key);
  }
  await env.DB.prepare('DELETE FROM images WHERE entity_type = ? AND entity_id = ?')
    .bind('piano', params.id)
    .run();
  await env.DB.prepare('DELETE FROM pianos WHERE id = ?').bind(params.id).run();

  return NextResponse.json({ ok: true });
}
