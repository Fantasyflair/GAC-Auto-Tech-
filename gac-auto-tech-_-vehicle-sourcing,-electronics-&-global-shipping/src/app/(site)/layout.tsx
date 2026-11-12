import { SiteShell } from '../../components/SiteShell';
import { getSettings } from '../../lib/content';

// Content comes from MongoDB and the admin can change it at any time, so pages render per request.
export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell settings={await getSettings()}>{children}</SiteShell>;
}
