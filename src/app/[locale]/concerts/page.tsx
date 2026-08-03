import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { pageMetadata } from '@/lib/seo';
import { getConcerts, getConcertGallery } from '@/lib/content';
import { isAuthenticated } from '@/lib/auth';
import ConcertsView from './ConcertsView';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'meta' });
  return pageMetadata({
    locale: params.locale,
    path: '/concerts',
    title: t('concerts_title'),
    description: t('concerts_description'),
    siteName: t('site_name'),
  });
}

export default async function ConcertsPage() {
  // Admins get drafts too, so they can edit/publish unpublished concerts in place.
  const authed = await isAuthenticated();
  const [concerts, gallery] = await Promise.all([getConcerts(authed), getConcertGallery()]);

  return <ConcertsView concerts={concerts} galleryImages={gallery} />;
}
