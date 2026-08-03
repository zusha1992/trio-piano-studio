import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { pageMetadata } from '@/lib/seo';
import ContactView from './ContactView';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'meta' });
  return pageMetadata({
    locale: params.locale,
    path: '/contact',
    title: t('contact_title'),
    description: t('contact_description'),
    siteName: t('site_name'),
  });
}

// The form itself is interactive (EmailJS + local state), so it lives in a
// client component; this server page exists to carry the page metadata.
export default function ContactPage() {
  return <ContactView />;
}
