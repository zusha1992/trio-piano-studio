import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { isAuthenticated } from '@/lib/auth';
import { SOURCE_LANG, TARGET_LANGS, translateValue } from '@/lib/admin/translate';

export const dynamic = 'force-dynamic';

// Backfills the target-language columns (en/ar/ru) for existing content by
// machine-translating from the Hebrew source. A target is filled only when it
// is empty AND not protected by a manual override, so re-running is safe and
// never clobbers hand-edited translations.
//
// Work is processed in small batches (MAX_OPS translations per request) to stay
// well under the Worker subrequest limit; the client calls this repeatedly and
// stops once `done` is true.
const MAX_OPS = 18;

interface EntityDef {
  entity: string;
  table: string;
  idCol: string;
  // Base column names (the `_he/_en/_ar/_ru` suffix is added per language).
  cols: string[];
  // Columns whose value is a JSON array of strings (e.g. about paragraphs).
  arrayCols?: string[];
}

const ENTITIES: EntityDef[] = [
  { entity: 'piano', table: 'pianos', idCol: 'id', cols: ['color_name', 'description', 'details'] },
  { entity: 'concert', table: 'concerts', idCol: 'id', cols: ['name', 'venue', 'description', 'artists'] },
  { entity: 'workshop_category', table: 'workshop_categories', idCol: 'id', cols: ['name', 'description'] },
  { entity: 'workshop_service', table: 'workshop_services', idCol: 'id', cols: ['name', 'description'] },
  { entity: 'about_section', table: 'about_sections', idCol: 'key', cols: ['title', 'body'], arrayCols: ['body'] },
  { entity: 'founder', table: 'founders', idCol: 'id', cols: ['name', 'bio'] },
];

interface PendingOp {
  table: string;
  idCol: string;
  id: string;
  targetCol: string;
  source: string;
  isArray: boolean;
}

export async function POST() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { env } = getCloudflareContext();
  const pending: PendingOp[] = [];
  let totalPending = 0;

  for (const def of ENTITIES) {
    const { results: rows } = await env.DB.prepare(`SELECT * FROM ${def.table}`).all<Record<string, unknown>>();
    const { results: ovr } = await env.DB.prepare(
      'SELECT entity_id, column_name FROM translation_overrides WHERE entity = ?',
    )
      .bind(def.entity)
      .all<{ entity_id: string; column_name: string }>();
    const overridden = new Set(ovr.map((o) => `${o.entity_id}:${o.column_name}`));

    for (const row of rows) {
      const id = String(row[def.idCol]);
      for (const base of def.cols) {
        const source = (row[`${base}_${SOURCE_LANG}`] as string | null) ?? '';
        if (!source.trim()) continue;
        for (const lang of TARGET_LANGS) {
          const targetCol = `${base}_${lang}`;
          const existing = (row[targetCol] as string | null) ?? '';
          if (existing.trim()) continue;
          if (overridden.has(`${id}:${targetCol}`)) continue;
          totalPending += 1;
          if (pending.length < MAX_OPS) {
            pending.push({
              table: def.table,
              idCol: def.idCol,
              id,
              targetCol,
              source,
              isArray: def.arrayCols?.includes(base) ?? false,
            });
          }
        }
      }
    }
  }

  let processed = 0;
  for (const op of pending) {
    let value: string | string[] = op.source;
    if (op.isArray) {
      try {
        const arr = JSON.parse(op.source);
        value = Array.isArray(arr) ? arr.map(String) : op.source;
      } catch {
        value = op.source;
      }
    }
    const translated = await translateValue(env, value, SOURCE_LANG, op.targetCol.slice(-2));
    const stored = Array.isArray(translated) ? JSON.stringify(translated) : translated;
    if (!stored) continue;
    await env.DB.prepare(`UPDATE ${op.table} SET ${op.targetCol} = ? WHERE ${op.idCol} = ?`)
      .bind(stored, op.id)
      .run();
    processed += 1;
  }

  const remaining = totalPending - processed;
  return NextResponse.json({ ok: true, processed, remaining, done: remaining <= 0 });
}
