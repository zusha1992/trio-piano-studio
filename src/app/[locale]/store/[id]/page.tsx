import { notFound } from 'next/navigation';
import { getPianos, getBrands, getOrigins, getColors } from '@/lib/content';
import { isAuthenticated } from '@/lib/auth';
import PianoDetail from './PianoDetail';

export const dynamic = 'force-dynamic';

export default async function PianoPage({ params }: { params: { id: string } }) {
  const authed = await isAuthenticated();
  const [pianos, brands, origins, colors] = await Promise.all([
    getPianos(authed),
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
    <PianoDetail item={item} prev={prev} next={next} brands={brands} origins={origins} colors={colors} />
  );
}
