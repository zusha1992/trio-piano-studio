import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Deletes an image: removes the R2 object (when stored there) and its row.
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ ok: false, error: 'Invalid id' }, { status: 400 });
  }

  const { env } = getCloudflareContext();
  const row = await env.DB.prepare('SELECT storage_key FROM images WHERE id = ?')
    .bind(id)
    .first<{ storage_key: string | null }>();

  if (row?.storage_key) {
    await env.MEDIA.delete(row.storage_key);
  }
  await env.DB.prepare('DELETE FROM images WHERE id = ?').bind(id).run();

  return NextResponse.json({ ok: true });
}
