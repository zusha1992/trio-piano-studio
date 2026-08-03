import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getWorkshopCategories } from '@/lib/content';
import { clamp, pageMetadata, SITE_URL } from '@/lib/seo';
import { pick, type Locale } from '@/lib/i18n';
import CategoryView from './CategoryView';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; category: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  const [categories, t] = await Promise.all([
    getWorkshopCategories(),
    getTranslations({ locale, namespace: 'meta' }),
  ]);
  const cat = categories.find((c) => c.id === params.category);
  if (!cat) return {};

  const name = pick(cat.name, locale);
  // Prefer the category's own words — the intro paragraph, else the tagline.
  const own = pick(cat.intro, locale) || pick(cat.description, locale);

  return pageMetadata({
    locale,
    path: `/services/${cat.id}`,
    title: t('category_title', { name }),
    description: own ? clamp(own) : t('category_description', { name }),
    siteName: t('site_name'),
    image: cat.image ? `${SITE_URL}${cat.image}` : undefined,
    type: 'article',
  });
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const categories = await getWorkshopCategories();
  const index = categories.findIndex((c) => c.id === params.category);
  if (index === -1) notFound();

  const cat = categories[index];
  const prev = categories[(index - 1 + categories.length) % categories.length];
  const next = categories[(index + 1) % categories.length];

  return <CategoryView cat={cat} prev={prev} next={next} />;
}
