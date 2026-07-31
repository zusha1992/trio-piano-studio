import { getAboutSections, getFounders } from '@/lib/content';
import AboutView from './AboutView';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const [sections, founders] = await Promise.all([getAboutSections(), getFounders()]);
  return <AboutView sections={sections} founders={founders} />;
}
