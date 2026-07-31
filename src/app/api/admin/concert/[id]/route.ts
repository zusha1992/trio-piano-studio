import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Scalar (non-localized) concert fields. Localized text (name/venue/description/
// artists) goes through /api/admin/content instead.
const SCALAR_COLS = ['date', 'time', 'price_ils', 'published'];

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
    if (col === 'price_ils') return Number(value) || 0;
    if (col === 'published') return value ? 1 : 0;
    return value == null ? null : String(value);
  });

  const { env } = getCloudflareContext();
  await env.DB.prepare(
    `UPDATE concerts SET ${setClause}, updated_at = datetime('now') WHERE id = ?`,
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

  // Remove the concert's images from R2, then their rows, then the concert.
  const { results } = await env.DB.prepare(
    'SELECT storage_key FROM images WHERE entity_type = ? AND entity_id = ?',
  )
    .bind('concert', params.id)
    .all<{ storage_key: string | null }>();
  for (const row of results) {
    if (row.storage_key) await env.MEDIA.delete(row.storage_key);
  }
  await env.DB.prepare('DELETE FROM images WHERE entity_type = ? AND entity_id = ?')
    .bind('concert', params.id)
    .run();
  await env.DB.prepare('DELETE FROM concerts WHERE id = ?').bind(params.id).run();

  return NextResponse.json({ ok: true });
}
