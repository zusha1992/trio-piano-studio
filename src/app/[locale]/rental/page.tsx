import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { pageMetadata } from '@/lib/seo';
import { getPianos, getOrigins } from '@/lib/content';
import { isAuthenticated } from '@/lib/auth';
import PianoGallery from '@/components/store/PianoGallery';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'meta' });
  return pageMetadata({
    locale: params.locale,
    path: '/rental',
    title: t('rental_title'),
    description: t('rental_description'),
    siteName: t('site_name'),
  });
}

export default async function RentalPage() {
  // Admins see drafts too, so they can edit/publish unpublished pianos.
  const authed = await isAuthenticated();
  const [pianos, origins] = await Promise.all([getPianos(authed, 'rental'), getOrigins()]);
  return <PianoGallery pianos={pianos} origins={origins} variant="rental" />;
}
