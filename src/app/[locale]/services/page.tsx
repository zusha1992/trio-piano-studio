import { getWorkshopCategories } from '@/lib/content';
import ServicesGrid from './ServicesGrid';

export const dynamic = 'force-dynamic';

export default async function WorkshopPage() {
  const categories = await getWorkshopCategories();
  return <ServicesGrid categories={categories} />;
}
