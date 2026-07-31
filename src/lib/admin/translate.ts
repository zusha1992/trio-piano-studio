// Auto-translation from the Hebrew source into the other site languages, using
// Cloudflare Workers AI (free-tier friendly). Content is authored in Hebrew;
// whenever a Hebrew field is saved we fill in the sibling language columns —
// unless the admin has hand-edited that specific language (tracked in
// `translation_overrides`), in which case we leave it alone.

// The canonical authoring language for content.
export const SOURCE_LANG = 'he';

// Languages we translate the Hebrew source into.
export const TARGET_LANGS = ['en', 'ar', 'ru'] as const;
export type TargetLang = (typeof TARGET_LANGS)[number];

// Every active site locale (source + targets). Used when an edit is applied to
// "all languages" and needs to fan out to each one.
export const ALL_LANGS = [SOURCE_LANG, ...TARGET_LANGS] as const;

const MODEL = '@cf/meta/m2m100-1.2b';

interface TranslateEnv {
  AI: Ai;
}

// Translates a single string between two languages. Empty/whitespace input (or
// a no-op where from === to) short-circuits so we never spend an AI call on
// nothing.
export async function translateText(
  env: TranslateEnv,
  text: string,
  from: string,
  to: string,
): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed || from === to) return trimmed;

  try {
    const res = (await env.AI.run(MODEL as never, {
      text: trimmed,
      source_lang: from,
      target_lang: to,
    } as never)) as { translated_text?: string };
    return res?.translated_text?.trim() || '';
  } catch (err) {
    console.error('translateText failed', { from, to, err });
    return '';
  }
}

// Translates either a plain string or an array of strings (e.g. paragraph
// blocks), preserving the shape so it round-trips through the same JSON storage.
export async function translateValue(
  env: TranslateEnv,
  value: string | string[],
  from: string,
  to: string,
): Promise<string | string[]> {
  if (Array.isArray(value)) {
    return Promise.all(value.map((v) => translateText(env, v, from, to)));
  }
  return translateText(env, value, from, to);
}
