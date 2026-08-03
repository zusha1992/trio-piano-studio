import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { pageMetadata } from '@/lib/seo';
import { getAboutSections, getFounders } from '@/lib/content';
import AboutView from './AboutView';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'meta' });
  return pageMetadata({
    locale: params.locale,
    path: '/about',
    title: t('about_title'),
    description: t('about_description'),
    siteName: t('site_name'),
  });
}

export default async function AboutPage() {
  const [sections, founders] = await Promise.all([getAboutSections(), getFounders()]);
  return <AboutView sections={sections} founders={founders} />;
}
