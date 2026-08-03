import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { pageMetadata } from '@/lib/seo';
import { getWorkshopCategories } from '@/lib/content';
import ServicesGrid from './ServicesGrid';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'meta' });
  return pageMetadata({
    locale: params.locale,
    path: '/services',
    title: t('services_title'),
    description: t('services_description'),
    siteName: t('site_name'),
  });
}

export default async function WorkshopPage() {
  const categories = await getWorkshopCategories();
  return <ServicesGrid categories={categories} />;
}
