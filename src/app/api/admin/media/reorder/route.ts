import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Persists a new gallery order: sort_order is set to each id's position in the
// provided array. Runs as a single D1 batch.
export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let body: { ids?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const ids = Array.isArray(body.ids) ? body.ids.map(Number).filter(Number.isFinite) : [];
  if (!ids.length) {
    return NextResponse.json({ ok: false, error: 'No ids' }, { status: 400 });
  }

  const { env } = getCloudflareContext();
  await env.DB.batch(
    ids.map((id, index) => env.DB.prepare('UPDATE images SET sort_order = ? WHERE id = ?').bind(index, id)),
  );

  return NextResponse.json({ ok: true });
}
