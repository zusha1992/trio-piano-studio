import { notFound } from 'next/navigation';
import { getWorkshopCategories } from '@/lib/content';
import CategoryView from './CategoryView';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const categories = await getWorkshopCategories();
  const index = categories.findIndex((c) => c.id === params.category);
  if (index === -1) notFound();

  const cat = categories[index];
  const prev = categories[(index - 1 + categories.length) % categories.length];
  const next = categories[(index + 1) % categories.length];

  return <CategoryView cat={cat} prev={prev} next={next} />;
}
