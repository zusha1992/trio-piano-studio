import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Creates a new concert with sensible defaults. Admin fills in the details
// inline afterwards. Defaults to unpublished so a half-filled concert doesn't
// appear publicly until the admin is ready.
export async function POST() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { env } = getCloudflareContext();
  const id = `concert_${crypto.randomUUID().slice(0, 8)}`;
  const today = new Date().toISOString().slice(0, 10);

  await env.DB.prepare(
    'INSERT INTO concerts (id, name_en, name_he, venue_en, venue_he, date, time, price_ils, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)',
  )
    .bind(id, 'New concert', 'קונצרט חדש', '', '', today, '20:30', 90)
    .run();

  return NextResponse.json({ ok: true, id });
}
