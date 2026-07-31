import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Stores a brand logo / origin flag (already circle-cropped + optimized on the
// client) in R2 and points the library row at it. Query params: kind, id.
const TARGETS: Record<string, { table: string; urlCol: string; keyCol: string }> = {
  brand: { table: 'brands', urlCol: 'logo_url', keyCol: 'logo_key' },
  origin: { table: 'origins', urlCol: 'flag_url', keyCol: 'flag_key' },
};

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const kind = url.searchParams.get('kind') ?? '';
  const id = url.searchParams.get('id') ?? '';
  const target = TARGETS[kind];
  if (!target || !id) {
    return NextResponse.json({ ok: false, error: 'Missing or invalid kind/id' }, { status: 400 });
  }

  const bytes = await request.arrayBuffer();
  if (!bytes.byteLength) {
    return NextResponse.json({ ok: false, error: 'Empty upload' }, { status: 400 });
  }

  const { env } = getCloudflareContext();

  // Replace any previous R2 object for this row (skip seeded static-asset urls).
  const existing = await env.DB.prepare(`SELECT ${target.keyCol} AS k FROM ${target.table} WHERE id = ?`)
    .bind(id)
    .first<{ k: string | null }>();
  if (existing?.k) await env.MEDIA.delete(existing.k);

  const key = `library/${kind}/${id}/${crypto.randomUUID()}.webp`;
  await env.MEDIA.put(key, bytes, { httpMetadata: { contentType: 'image/webp' } });
  const mediaUrl = `/media/${key}`;

  await env.DB.prepare(`UPDATE ${target.table} SET ${target.urlCol} = ?, ${target.keyCol} = ? WHERE id = ?`)
    .bind(mediaUrl, key, id)
    .run();

  return NextResponse.json({ ok: true, url: mediaUrl });
}
