import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getPianos, getBrands, getOrigins, getColors } from '@/lib/content';
import { isAuthenticated } from '@/lib/auth';
import { pageMetadata, SITE_URL } from '@/lib/seo';
import { type Locale } from '@/lib/i18n';
import PianoDetail from '@/components/store/PianoDetail';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; id: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  const [pianos, t] = await Promise.all([
    getPianos(false, 'rental'),
    getTranslations({ locale, namespace: 'meta' }),
  ]);
  const item = pianos.find((p) => p.id === params.id);
  if (!item) return {};

  const name = `${item.brand} ${item.model}`.trim();
  const type = t(item.type === 'grand' ? 'type_grand' : 'type_upright');

  // Unlike the shop, the rental description stays on the rental terms rather
  // than the instrument's own write-up — that's what the searcher is after.
  return pageMetadata({
    locale,
    path: `/rental/${item.id}`,
    title: t('rental_piano_title', { name, type }),
    description: t('rental_piano_description', { name, type }),
    siteName: t('site_name'),
    image: item.image ? `${SITE_URL}${item.image}` : undefined,
    type: 'article',
  });
}

export default async function RentalPianoPage({ params }: { params: { id: string } }) {
  const authed = await isAuthenticated();
  const [pianos, brands, origins, colors] = await Promise.all([
    getPianos(authed, 'rental'),
    getBrands(),
    getOrigins(),
    getColors(),
  ]);
  const index = pianos.findIndex((p) => p.id === params.id);
  if (index === -1) notFound();

  const item = pianos[index];
  const prev = pianos[(index - 1 + pianos.length) % pianos.length];
  const next = pianos[(index + 1) % pianos.length];

  return (
    <PianoDetail
      item={item}
      prev={prev}
      next={next}
      brands={brands}
      origins={origins}
      colors={colors}
      variant="rental"
    />
  );
}
