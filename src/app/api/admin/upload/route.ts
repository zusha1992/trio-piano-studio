import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Receives an already-optimized image (raw body, typically image/webp) plus
// entity_type / entity_id query params, stores it in R2, and records a row in
// the shared `images` table. Returns the new image's id + public URL.
export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const entityType = url.searchParams.get('entity_type');
  const entityId = url.searchParams.get('entity_id');
  if (!entityType || !entityId) {
    return NextResponse.json({ ok: false, error: 'Missing entity_type or entity_id' }, { status: 400 });
  }

  const bytes = await request.arrayBuffer();
  if (!bytes.byteLength) {
    return NextResponse.json({ ok: false, error: 'Empty upload' }, { status: 400 });
  }

  const contentType = request.headers.get('content-type') || 'image/webp';
  const ext = contentType.includes('png') ? 'png' : contentType.includes('jpeg') ? 'jpg' : 'webp';
  const width = Number(url.searchParams.get('w')) || null;
  const height = Number(url.searchParams.get('h')) || null;

  const { env } = getCloudflareContext();
  const key = `${entityType}/${entityId}/${crypto.randomUUID()}.${ext}`;

  await env.MEDIA.put(key, bytes, { httpMetadata: { contentType } });

  const mediaUrl = `/media/${key}`;
  const nextRow = await env.DB.prepare(
    'SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM images WHERE entity_type = ? AND entity_id = ?',
  )
    .bind(entityType, entityId)
    .first<{ next: number }>();
  const sortOrder = nextRow?.next ?? 0;

  const result = await env.DB.prepare(
    'INSERT INTO images (entity_type, entity_id, storage_key, url, sort_order, width, height) VALUES (?, ?, ?, ?, ?, ?, ?)',
  )
    .bind(entityType, entityId, key, mediaUrl, sortOrder, width, height)
    .run();

  return NextResponse.json({
    ok: true,
    image: { id: result.meta.last_row_id, url: mediaUrl, sort_order: sortOrder },
  });
}
