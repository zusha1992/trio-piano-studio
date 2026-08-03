import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface KeyCount {
  key: string;
  count: number;
}

// Collapse a full path into a general site section, ignoring the locale prefix
// and any deeper segments (e.g. /en/store/piano_x → 'shop').
function sectionOf(path: string): string {
  const stripped = path.replace(/^\/(he|en|ar|ru)(?=\/|$)/, '');
  const seg = stripped.split('/').filter(Boolean)[0] ?? '';
  const map: Record<string, string> = {
    '': 'home',
    home: 'home',
    store: 'shop',
    rental: 'rental',
    services: 'workshop',
    about: 'about',
    contact: 'contact',
    concerts: 'concerts',
  };
  return map[seg] ?? seg;
}

// Aggregated first-party analytics for the admin overview. Auth required.
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { env } = getCloudflareContext();

  const [sessions, pageviews, clicks, registrations, byDay, byMonth, languages, devices, clickNames, topPages] =
    await Promise.all([
      env.DB.prepare('SELECT COUNT(*) AS c FROM analytics_sessions').first<{ c: number }>(),
      env.DB.prepare("SELECT COUNT(*) AS c FROM analytics_events WHERE type = 'pageview'").first<{ c: number }>(),
      env.DB.prepare("SELECT COUNT(*) AS c FROM analytics_events WHERE type = 'click'").first<{ c: number }>(),
      env.DB.prepare('SELECT COUNT(*) AS c FROM registrations').first<{ c: number }>(),
      env.DB.prepare(
        "SELECT day, COUNT(*) AS count FROM analytics_sessions WHERE day >= date('now','-29 days') GROUP BY day ORDER BY day",
      ).all<{ day: string; count: number }>(),
      env.DB.prepare(
        "SELECT substr(day,1,7) AS month, COUNT(*) AS count FROM analytics_sessions WHERE day >= date('now','start of month','-11 months') GROUP BY month ORDER BY month",
      ).all<{ month: string; count: number }>(),
      env.DB.prepare(
        "SELECT COALESCE(last_locale,'?') AS key, COUNT(*) AS count FROM analytics_sessions GROUP BY key ORDER BY count DESC",
      ).all<KeyCount>(),
      env.DB.prepare(
        "SELECT COALESCE(device,'?') AS key, COUNT(*) AS count FROM analytics_sessions GROUP BY key ORDER BY count DESC",
      ).all<KeyCount>(),
      env.DB.prepare(
        "SELECT COALESCE(name,'?') AS key, COUNT(*) AS count FROM analytics_events WHERE type = 'click' GROUP BY key ORDER BY count DESC",
      ).all<KeyCount>(),
      env.DB.prepare(
        "SELECT path, COUNT(*) AS count FROM analytics_events WHERE type = 'pageview' AND path IS NOT NULL GROUP BY path",
      ).all<{ path: string; count: number }>(),
    ]);

  // Roll raw paths up into site sections (shop/workshop/…). 'home' is dropped:
  // it's the landing gate every visit passes through, so counting it says
  // nothing and its share dwarfs the sections we actually want to compare.
  const sectionMap = new Map<string, number>();
  for (const row of topPages.results) {
    const key = sectionOf(row.path);
    if (key === 'home') continue;
    sectionMap.set(key, (sectionMap.get(key) ?? 0) + row.count);
  }
  const pages: KeyCount[] = [...sectionMap.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);

  return NextResponse.json({
    ok: true,
    totals: {
      sessions: sessions?.c ?? 0,
      pageviews: pageviews?.c ?? 0,
      clicks: clicks?.c ?? 0,
      registrations: registrations?.c ?? 0,
    },
    entrancesByDay: byDay.results,
    entrancesByMonth: byMonth.results,
    languages: languages.results,
    devices: devices.results,
    clicks: clickNames.results,
    pages,
  });
}
