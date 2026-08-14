import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getPianos, getBrands, getOrigins, getColors } from '@/lib/content';
import { isAuthenticated } from '@/lib/auth';
import { clamp, pageMetadata, pianoJsonLd, SITE_URL } from '@/lib/seo';
import { pick, type Locale } from '@/lib/i18n';
import PianoDetail from '@/components/store/PianoDetail';
import JsonLd from '@/components/seo/JsonLd';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; id: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  const [pianos, t] = await Promise.all([
    getPianos(),
    getTranslations({ locale, namespace: 'meta' }),
  ]);
  const item = pianos.find((p) => p.id === params.id);
  if (!item) return {};

  const name = `${item.brand} ${item.model}`.trim();
  const type = t(item.type === 'grand' ? 'type_grand' : 'type_upright');
  // The piano's own copy makes the better description; the template is the
  // fallback for instruments that haven't been written up yet.
  const own = item.description ? pick(item.description, locale) : '';
  const description = own ? clamp(own) : t('piano_description', { name, type });

  return pageMetadata({
    locale,
    path: `/store/${item.id}`,
    title: t('piano_title', { name, type }),
    description,
    siteName: t('site_name'),
    image: item.image ? `${SITE_URL}${item.image}` : undefined,
    type: 'article',
  });
}

export default async function PianoPage({ params }: { params: { locale: string; id: string } }) {
  const authed = await isAuthenticated();
  const locale = params.locale as Locale;
  const [pianos, brands, origins, colors, t] = await Promise.all([
    getPianos(authed),
    getBrands(),
    getOrigins(),
    getColors(),
    getTranslations({ locale, namespace: 'meta' }),
  ]);
  const index = pianos.findIndex((p) => p.id === params.id);
  if (index === -1) notFound();

  const item = pianos[index];
  const prev = pianos[(index - 1 + pianos.length) % pianos.length];
  const next = pianos[(index + 1) % pianos.length];
  const name = `${item.brand} ${item.model}`.trim();
  const type = t(item.type === 'grand' ? 'type_grand' : 'type_upright');
  const own = item.description ? pick(item.description, locale) : '';
  const description = own ? clamp(own) : t('piano_description', { name, type });

  return (
    <>
      <JsonLd
        data={pianoJsonLd({
          locale,
          path: `/store/${item.id}`,
          name,
          description,
          image: item.image,
          brand: item.brand,
          sku: item.serial,
          price: item.price,
          wip: item.wip,
        })}
      />
      <PianoDetail item={item} prev={prev} next={next} brands={brands} origins={origins} colors={colors} />
    </>
  );
}
