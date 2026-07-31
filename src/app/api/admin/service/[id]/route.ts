import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!params.id) {
    return NextResponse.json({ ok: false, error: 'Missing id' }, { status: 400 });
  }

  const { env } = getCloudflareContext();
  await env.DB.prepare('DELETE FROM workshop_services WHERE id = ?').bind(params.id).run();

  return NextResponse.json({ ok: true });
}
