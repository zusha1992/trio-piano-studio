import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { isAuthenticated } from '@/lib/auth';
import { ALL_LANGS, SOURCE_LANG, TARGET_LANGS, translateValue } from '@/lib/admin/translate';

export const dynamic = 'force-dynamic';

// Whitelisted per-entity content updates. Each entity maps to its table, its
// primary-key column, and the exact set of columns that may be written — so a
// request can never touch anything it shouldn't. Array values (e.g. about
// paragraph lists) are stored as JSON strings.
const ENTITIES: Record<string, { table: string; idCol: string; cols: string[] }> = {
  about_section: {
    table: 'about_sections',
    idCol: 'key',
    cols: ['title_en', 'title_he', 'title_ar', 'title_ru', 'body_en', 'body_he', 'body_ar', 'body_ru'],
  },
  founder: {
    table: 'founders',
    idCol: 'id',
    cols: ['name_en', 'name_he', 'name_ar', 'name_ru', 'bio_en', 'bio_he', 'bio_ar', 'bio_ru'],
  },
  workshop_category: {
    table: 'workshop_categories',
    idCol: 'id',
    cols: [
      'name_en', 'name_he', 'name_ar', 'name_ru',
      'description_en', 'description_he', 'description_ar', 'description_ru',
      'intro_en', 'intro_he', 'intro_ar', 'intro_ru',
    ],
  },
  workshop_service: {
    table: 'workshop_services',
    idCol: 'id',
    cols: [
      'name_en', 'name_he', 'name_ar', 'name_ru',
      'description_en', 'description_he', 'description_ar', 'description_ru',
    ],
  },
  concert: {
    table: 'concerts',
    idCol: 'id',
    cols: [
      'name_en', 'name_he', 'name_ar', 'name_ru',
      'venue_en', 'venue_he', 'venue_ar', 'venue_ru',
      'description_en', 'description_he', 'description_ar', 'description_ru',
      'artists_en', 'artists_he', 'artists_ar', 'artists_ru',
    ],
  },
  piano: {
    table: 'pianos',
    idCol: 'id',
    cols: [
      'color_name_en', 'color_name_he', 'color_name_ar', 'color_name_ru',
      'description_en', 'description_he', 'description_ar', 'description_ru',
      'details_en', 'details_he', 'details_ar', 'details_ru',
    ],
  },
};

type FieldValue = string | string[] | null;

// Optional directive from the editor describing how the edit should propagate
// across languages: 'all' makes the entered text canonical and re-translates
// every other language; 'one' fixes only the given language and protects it
// from future auto-translation.
interface SyncDirective {
  base: string;
  from: string;
  scope: 'all' | 'one';
}

export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let body: {
    entity?: string;
    id?: string;
    fields?: Record<string, FieldValue>;
    sync?: SyncDirective;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const def = body.entity ? ENTITIES[body.entity] : undefined;
  if (!def || !body.id || !body.fields) {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }

  const entries = Object.entries(body.fields).filter(([col]) => def.cols.includes(col));
  if (!entries.length) {
    return NextResponse.json({ ok: false, error: 'No writable fields' }, { status: 400 });
  }

  const setClause = entries.map(([col]) => `${col} = ?`).join(', ');
  const values = entries.map(([, value]) =>
    Array.isArray(value) ? JSON.stringify(value) : value === null ? null : String(value),
  );

  const { env } = getCloudflareContext();
  await env.DB.prepare(
    `UPDATE ${def.table} SET ${setClause}, updated_at = datetime('now') WHERE ${def.idCol} = ?`,
  )
    .bind(...values, body.id)
    .run();

  if (body.sync) {
    await applyScopedSync(env, def, body.entity!, body.id, body.sync, body.fields);
  } else {
    await autoTranslate(env, def, body.entity!, body.id, body.fields);
  }

  return NextResponse.json({ ok: true });
}

const LANG_RE = /^(.*)_(en|he|ar|ru)$/;

// Explicit language-scope handling driven by the editor's "All languages" /
// "This language only" toggle.
async function applyScopedSync(
  env: CloudflareEnv,
  def: { table: string; idCol: string; cols: string[] },
  entity: string,
  id: string,
  sync: SyncDirective,
  fields: Record<string, FieldValue>,
) {
  const { base, from, scope } = sync;
  const siblingCols = ALL_LANGS.map((lang) => `${base}_${lang}`).filter((c) => def.cols.includes(c));

  if (scope === 'one') {
    // A translation fix for a single non-source language: protect it so the
    // Hebrew source can never machine-overwrite it. Editing the source itself
    // "this language only" simply leaves the other languages untouched.
    if (from !== SOURCE_LANG) {
      await env.DB.prepare(
        "INSERT OR REPLACE INTO translation_overrides (entity, entity_id, column_name, updated_at) VALUES (?, ?, ?, datetime('now'))",
      )
        .bind(entity, id, `${base}_${from}`)
        .run();
    }
    return;
  }

  // scope === 'all': the entered text is canonical. Clear any prior manual
  // overrides for this field and re-translate every other language from it.
  if (siblingCols.length) {
    await env.DB.prepare(
      `DELETE FROM translation_overrides WHERE entity = ? AND entity_id = ? AND column_name IN (${siblingCols
        .map(() => '?')
        .join(', ')})`,
    )
      .bind(entity, id, ...siblingCols)
      .run();
  }

  const source = fields[`${base}_${from}`];
  if (source == null) return;

  const updates: { col: string; value: string | null }[] = [];
  for (const lang of ALL_LANGS) {
    if (lang === from) continue;
    const targetCol = `${base}_${lang}`;
    if (!def.cols.includes(targetCol)) continue;
    const translated = await translateValue(env, source as string | string[], from, lang);
    updates.push({
      col: targetCol,
      value: Array.isArray(translated) ? JSON.stringify(translated) : translated || null,
    });
  }

  if (updates.length) {
    await env.DB.batch(
      updates.map((u) =>
        env.DB.prepare(`UPDATE ${def.table} SET ${u.col} = ? WHERE ${def.idCol} = ?`).bind(u.value, id),
      ),
    );
  }
}

// Legacy auto-sync for callers that don't send an explicit scope (e.g. the
// piano color-swatch save, which sets both languages at once). Keeps the
// sibling languages in step with the Hebrew source:
//  - A hand-edited non-Hebrew field is recorded as an override and never
//    machine-overwritten afterwards.
//  - Each edited Hebrew field is auto-translated into every target language,
//    skipping any target explicitly provided in the same request or protected
//    by an existing override.
async function autoTranslate(
  env: CloudflareEnv,
  def: { table: string; idCol: string; cols: string[] },
  entity: string,
  id: string,
  fields: Record<string, FieldValue>,
) {
  const present = new Set(Object.keys(fields).filter((c) => def.cols.includes(c)));

  // 1. Record manual overrides for any non-source language edited directly.
  const overrideCols = [...present].filter((col) => {
    const m = LANG_RE.exec(col);
    return m && m[2] !== SOURCE_LANG;
  });
  if (overrideCols.length) {
    await env.DB.batch(
      overrideCols.map((col) =>
        env.DB.prepare(
          'INSERT OR REPLACE INTO translation_overrides (entity, entity_id, column_name, updated_at) VALUES (?, ?, ?, datetime(\'now\'))',
        ).bind(entity, id, col),
      ),
    );
  }

  // 2. Translate edited Hebrew fields into the target languages.
  const heEntries = [...present]
    .map((col) => ({ col, base: LANG_RE.exec(col)?.[1], lang: LANG_RE.exec(col)?.[2] }))
    .filter((e): e is { col: string; base: string; lang: string } => e.base != null && e.lang === SOURCE_LANG);
  if (!heEntries.length) return;

  const { results } = await env.DB.prepare(
    'SELECT column_name FROM translation_overrides WHERE entity = ? AND entity_id = ?',
  )
    .bind(entity, id)
    .all<{ column_name: string }>();
  const overridden = new Set(results.map((r) => r.column_name));

  const updates: { col: string; value: string | null }[] = [];
  for (const { base } of heEntries) {
    const source = fields[`${base}_${SOURCE_LANG}`];
    if (source == null) continue;
    for (const target of TARGET_LANGS) {
      const targetCol = `${base}_${target}`;
      if (!def.cols.includes(targetCol)) continue;
      if (present.has(targetCol)) continue; // explicitly set in this request
      if (overridden.has(targetCol)) continue; // hand-edited previously
      const translated = await translateValue(env, source as string | string[], SOURCE_LANG, target);
      updates.push({
        col: targetCol,
        value: Array.isArray(translated) ? JSON.stringify(translated) : translated || null,
      });
    }
  }

  if (updates.length) {
    await env.DB.batch(
      updates.map((u) =>
        env.DB.prepare(`UPDATE ${def.table} SET ${u.col} = ? WHERE ${def.idCol} = ?`).bind(u.value, id),
      ),
    );
  }
}
