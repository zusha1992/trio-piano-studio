import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Whitelisted site-level settings the admin may flip.
const ALLOWED_KEYS = new Set(['concerts_coming_soon']);

export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let body: { key?: string; value?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.key || !ALLOWED_KEYS.has(body.key)) {
    return NextResponse.json({ ok: false, error: 'Invalid key' }, { status: 400 });
  }

  const value = String(body.value ?? '');
  const { env } = getCloudflareContext();
  await env.DB.prepare(
    "INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, datetime('now')) " +
      'ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime(\'now\')',
  )
    .bind(body.key, value)
    .run();

  return NextResponse.json({ ok: true });
}
