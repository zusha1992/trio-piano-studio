import { getConcerts, getConcertGallery } from '@/lib/content';
import { isAuthenticated } from '@/lib/auth';
import ConcertsView from './ConcertsView';

export const dynamic = 'force-dynamic';

export default async function ConcertsPage() {
  // Admins get drafts too, so they can edit/publish unpublished concerts in place.
  const authed = await isAuthenticated();
  const [concerts, gallery] = await Promise.all([getConcerts(authed), getConcertGallery()]);

  return <ConcertsView concerts={concerts} galleryImages={gallery} />;
}
