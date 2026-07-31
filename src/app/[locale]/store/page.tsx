import { getPianos, getOrigins } from '@/lib/content';
import { isAuthenticated } from '@/lib/auth';
import StoreGallery from './StoreGallery';

export const dynamic = 'force-dynamic';

export default async function StorePage() {
  // Admins see drafts too, so they can edit/publish unpublished pianos.
  const authed = await isAuthenticated();
  const [pianos, origins] = await Promise.all([getPianos(authed), getOrigins()]);
  return <StoreGallery pianos={pianos} origins={origins} />;
}
