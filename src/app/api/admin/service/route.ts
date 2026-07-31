import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Creates a new (empty) workshop service in a category. The admin then fills in
// the name/description inline via the content endpoint.
export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let body: { category_id?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }
  if (!body.category_id) {
    return NextResponse.json({ ok: false, error: 'Missing category_id' }, { status: 400 });
  }

  const { env } = getCloudflareContext();
  const id = `svc_${crypto.randomUUID().slice(0, 8)}`;
  const nextRow = await env.DB.prepare(
    'SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM workshop_services WHERE category_id = ?',
  )
    .bind(body.category_id)
    .first<{ next: number }>();

  await env.DB.prepare(
    'INSERT INTO workshop_services (id, category_id, name_en, name_he, description_en, description_he, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
  )
    .bind(id, body.category_id, 'New service', 'שירות חדש', '', '', nextRow?.next ?? 0)
    .run();

  return NextResponse.json({ ok: true, id });
}
