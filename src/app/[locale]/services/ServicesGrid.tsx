'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { WorkshopCategory } from '@/data/workshopServices';
import ContactCTA from '@/components/sections/ContactCTA';
import EditableText from '@/components/admin/EditableText';
import { useAdmin } from '@/components/admin/AdminContext';
import { EASE } from '@/lib/motion';
import { displayFont } from '@/lib/fonts';
import { pick, isRtl, LOCALES, type Locale, type Localized } from '@/lib/i18n';

const MotionLink = motion(Link);

const norm = (s: string) => s.toLowerCase().trim();

export default function ServicesGrid({ categories }: { categories: WorkshopCategory[] }) {
  const t = useTranslations('services');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const titleFont = displayFont(locale);
  const rtl = isRtl(locale);
  const { editMode } = useAdmin();

  // Free-text search over the individual fixes (both languages), narrowing the
  // grid to the categories that contain a matching fix.
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  // Match on fix names only (in either language) so the filtered categories
  // stay in sync with the autocomplete suggestions below.
  const nameMatches = (s: { name: Localized }, q: string) =>
    LOCALES.some((l) => norm(s.name[l] ?? '').includes(q));

  const visible = useMemo(() => {
    const q = norm(query);
    if (!q) return categories;
    return categories.filter((c) => c.services.some((s) => nameMatches(s, q)));
  }, [categories, query]);

  // Autocomplete: matching fixes (in either language, displayed in the current
  // locale), each carrying its category so a selection navigates straight there.
  // A fix name that appears in more than one category is disambiguated by
  // appending the category name.
  const suggestions = useMemo(() => {
    const q = norm(query);
    if (!q) return [] as { key: string; label: string; catId: string }[];
    const matches: { name: string; catId: string; catName: string }[] = [];
    const seen = new Set<string>();
    for (const c of categories) {
      for (const s of c.services) {
        const key = `${pick(s.name, locale)}|${c.id}`;
        if (nameMatches(s, q) && !seen.has(key)) {
          seen.add(key);
          matches.push({ name: pick(s.name, locale), catId: c.id, catName: pick(c.name, locale) });
        }
      }
    }
    const nameCount = matches.reduce<Record<string, number>>((a, m) => {
      a[m.name] = (a[m.name] || 0) + 1;
      return a;
    }, {});
    return matches.slice(0, 6).map((m) => ({
      key: `${m.name}|${m.catId}`,
      label: nameCount[m.name] > 1 ? `${m.name} · ${m.catName}` : m.name,
      catId: m.catId,
    }));
  }, [categories, query, locale]);

  const goToCategory = (catId: string) => {
    setOpen(false);
    router.push(`/${locale}/services/${catId}`);
  };

  return (
    <>
      <section className="mx-auto max-w-[100rem] px-6 pb-24 pt-32 sm:px-10 md:pt-44 lg:px-16 lg:pt-52">
        {/* Title row — heading left, search bottom-aligned at the end of the
            line (same slot the store uses for its filters). */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
            className="ms-4 text-6xl leading-[0.95] tracking-tight text-[var(--c-text)] sm:ms-8 sm:text-7xl md:ms-14 lg:ms-24 lg:text-8xl"
            style={{ fontFamily: titleFont, fontWeight: 500 }}
          >
            {t('hero_title')}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="relative w-full md:w-80 md:pb-3"
          >
            <div className="flex items-center gap-2.5 rounded-full border border-[var(--c-text)] px-4 py-2.5">
              <Search size={16} className="shrink-0 text-[var(--c-text)]" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 120)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && suggestions[0]) {
                    e.preventDefault();
                    goToCategory(suggestions[0].catId);
                  }
                }}
                placeholder={t('search_placeholder')}
                className="w-full bg-transparent text-sm text-[var(--c-text)] placeholder:text-[var(--c-ultra-dim)] focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear"
                  onClick={() => {
                    setQuery('');
                    setOpen(false);
                  }}
                  className="shrink-0 text-[var(--c-dim)] transition-colors hover:text-[var(--c-text)]"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {open && suggestions.length > 0 && (
              <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-[var(--c-border)] bg-[var(--c-bg)] py-1 shadow-lg">
                {suggestions.map((s) => (
                  <li key={s.key}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        goToCategory(s.catId);
                      }}
                      className="block w-full px-4 py-2 text-start text-sm text-[var(--c-dim)] transition-colors hover:bg-[var(--c-bg-alt)] hover:text-[var(--c-text)]"
                    >
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>

        {/* 3×2 grid of category tiles — square image + title, description
            revealed on hover. Clicking will open a full category page later. */}
        <div className="mt-16 grid grid-cols-2 gap-3 sm:gap-4 md:mt-24 md:grid-cols-3">
          {visible.map((cat) => {
            const tileBody = (
              <>
                <Image
                  src={cat.image}
                  alt={pick(cat.name, locale)}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover object-center"
                />

                {/* Base scrim keeps the title readable. A second bottom gradient
                    fades in on hover (desktop only) to cover the revealed text —
                    only the lower area, not the whole square. */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                {!editMode && (
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent opacity-0 transition-opacity duration-500 lg:group-hover:opacity-100" />
                )}

                {/* In edit mode the tile itself isn't a link (the pencils have
                    to be clickable), so navigation gets its own affordance. */}
                {editMode && (
                  <Link
                    href={`/${locale}/services/${cat.id}`}
                    className="absolute end-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-black shadow transition-opacity hover:opacity-90"
                  >
                    Open
                    <ArrowRight size={12} className={rtl ? 'rotate-180' : undefined} />
                  </Link>
                )}

                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <EditableText
                    entity="workshop_category"
                    id={cat.id}
                    column="name"
                    value={cat.name[locale] ?? ''}
                    label="Category name"
                    wrapAs="div"
                  >
                    <h3
                      className="text-xl leading-tight tracking-tight text-white sm:text-2xl"
                      style={{ fontFamily: titleFont, fontWeight: 400 }}
                    >
                      {pick(cat.name, locale)}
                    </h3>
                  </EditableText>

                  {editMode ? (
                    // In edit mode the tagline is always shown (and editable);
                    // the tile is not a link, so the pencils are clickable.
                    <EditableText
                      entity="workshop_category"
                      id={cat.id}
                      column="description"
                      value={cat.description[locale] ?? ''}
                      multiline
                      label="Category tagline"
                      wrapAs="div"
                      className="mt-2"
                    >
                      <p className="text-sm leading-relaxed text-white/85">
                        {pick(cat.description, locale) || 'Add a tagline…'}
                      </p>
                    </EditableText>
                  ) : (
                    // Desktop only (lg+, the same line `useIsMobile` draws):
                    // tagline + Learn More revealed on hover. Phones and
                    // portrait tablets show just the title — no hover there,
                    // and the tile is too small for a second line of text.
                    <div className="hidden max-h-0 overflow-hidden opacity-0 transition-all duration-500 ease-out lg:block lg:group-hover:mt-3 lg:group-hover:max-h-60 lg:group-hover:opacity-100">
                      <p className="text-sm leading-relaxed text-white/85">{pick(cat.description, locale)}</p>
                      <span
                        className="mt-4 inline-block bg-white px-5 py-2 text-[10px] uppercase tracking-[0.25em] text-black"
                        style={{ fontFamily: titleFont, fontWeight: 400 }}
                      >
                        {t('learn_more')}
                      </span>
                    </div>
                  )}
                </div>
              </>
            );

            return editMode ? (
              <div
                key={cat.id}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-[var(--c-bg-alt)] text-start"
              >
                {tileBody}
              </div>
            ) : (
              <MotionLink
                key={cat.id}
                href={`/${locale}/services/${cat.id}`}
                initial={false}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl bg-[var(--c-bg-alt)] text-start"
              >
                {tileBody}
              </MotionLink>
            );
          })}
        </div>

        {visible.length === 0 && (
          <p className="py-20 text-center text-sm text-[var(--c-ultra-dim)]">{t('empty')}</p>
        )}
      </section>

      <ContactCTA />
    </>
  );
}
