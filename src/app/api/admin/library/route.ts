import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Creates a new option-library entry (brand / origin / color). The logo/flag
// image (for brand/origin) is uploaded separately via /api/admin/library/image
// once the row exists. Returns the new row's id.
function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const suffix = crypto.randomUUID().slice(0, 4);
  return base ? `${base}-${suffix}` : `item-${suffix}`;
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let body: {
    kind?: 'brand' | 'origin' | 'color';
    name?: string;
    name_en?: string;
    name_he?: string;
    hex?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const { env } = getCloudflareContext();

  if (body.kind === 'brand') {
    const name = (body.name ?? '').trim();
    if (!name) return NextResponse.json({ ok: false, error: 'Missing name' }, { status: 400 });
    const id = slugify(name);
    const nextRow = await env.DB.prepare('SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM brands').first<{
      next: number;
    }>();
    await env.DB.prepare('INSERT INTO brands (id, name, sort_order) VALUES (?, ?, ?)')
      .bind(id, name, nextRow?.next ?? 0)
      .run();
    return NextResponse.json({ ok: true, id, name });
  }

  if (body.kind === 'origin') {
    const nameHe = (body.name_he ?? '').trim();
    const nameEn = (body.name_en ?? '').trim();
    if (!nameHe && !nameEn) return NextResponse.json({ ok: false, error: 'Missing name' }, { status: 400 });
    const id = slugify(nameEn || nameHe);
    const nextRow = await env.DB.prepare('SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM origins').first<{
      next: number;
    }>();
    await env.DB.prepare('INSERT INTO origins (id, name_en, name_he, sort_order) VALUES (?, ?, ?, ?)')
      .bind(id, nameEn, nameHe, nextRow?.next ?? 0)
      .run();
    return NextResponse.json({ ok: true, id });
  }

  if (body.kind === 'color') {
    const hex = (body.hex ?? '').trim();
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) {
      return NextResponse.json({ ok: false, error: 'Invalid hex' }, { status: 400 });
    }
    const nameHe = (body.name_he ?? '').trim();
    const nameEn = (body.name_en ?? '').trim();
    const id = slugify(nameEn || nameHe || hex.slice(1));
    const nextRow = await env.DB.prepare('SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM colors').first<{
      next: number;
    }>();
    await env.DB.prepare('INSERT INTO colors (id, hex, name_en, name_he, sort_order) VALUES (?, ?, ?, ?, ?)')
      .bind(id, hex, nameEn, nameHe, nextRow?.next ?? 0)
      .run();
    return NextResponse.json({ ok: true, id, hex, name: { en: nameEn, he: nameHe } });
  }

  return NextResponse.json({ ok: false, error: 'Invalid kind' }, { status: 400 });
}
