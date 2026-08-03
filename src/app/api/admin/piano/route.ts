import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Creates a new (draft) piano with sensible defaults. Admin fills in the rest
// on the detail page. Unpublished so it stays out of the public store until
// ready. `rental: true` files it under the rental fleet instead of the shop.
export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let rental = false;
  try {
    const body = (await request.json()) as { rental?: boolean };
    rental = body?.rental === true;
  } catch {
    // No body — a shop piano.
  }

  const { env } = getCloudflareContext();
  const id = `piano_${crypto.randomUUID().slice(0, 8)}`;
  const nextRow = await env.DB.prepare('SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM pianos').first<{
    next: number;
  }>();

  await env.DB.prepare(
    "INSERT INTO pianos (id, brand, model, type, region, size, price_ils, color_hex, color_name_en, color_name_he, sort_order, wip, published, rental) VALUES (?, 'New brand', '', 'upright', 'japan', '', NULL, '#1b1b1d', 'Ebony Black', 'שחור', ?, 0, 0, ?)",
  )
    .bind(id, nextRow?.next ?? 0, rental ? 1 : 0)
    .run();

  return NextResponse.json({ ok: true, id });
}
