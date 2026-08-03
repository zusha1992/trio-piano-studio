import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'meta' });
  // The layout's "%s | site name" template doesn't apply to its own segment,
  // so the home page carries the brand itself — and leads with it.
  return pageMetadata({
    locale: params.locale,
    path: '',
    title: `${t('site_name')} | ${t('home_title')}`,
    description: t('home_description'),
    siteName: t('site_name'),
  });
}

// The home experience is rendered by the persistent HeroGate overlay
// (src/components/layout/HeroGate.tsx). This placeholder simply fills the
// screen behind it so there is never a flash of empty background.
export default async function HomePage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'meta' });
  return (
    <div className="min-h-screen bg-[var(--c-bg)]">
      {/* The landing is the HeroGate overlay, which is all images and buttons.
          Every page needs one top-level heading, so it lives here — read by
          screen readers and crawlers, invisible on screen. */}
      <h1 className="sr-only">{`${t('site_name')} — ${t('home_title')}`}</h1>
    </div>
  );
}
