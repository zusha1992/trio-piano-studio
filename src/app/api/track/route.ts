import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const dynamic = 'force-dynamic';

// Public, first-party analytics collector. Records a pageview or a click and
// keeps a per-session row whose last_locale reflects the exit language. Device
// is derived from the user-agent server-side. Fails soft — analytics must never
// break a visit.
function deviceFromUA(ua: string): 'mobile' | 'desktop' {
  return /Mobi|Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(ua) ? 'mobile' : 'desktop';
}

export async function POST(request: Request) {
  let body: { sid?: string; type?: string; name?: string; path?: string; locale?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const sid = (body.sid ?? '').slice(0, 64);
  const type = body.type === 'click' ? 'click' : 'pageview';
  if (!sid) return NextResponse.json({ ok: false }, { status: 400 });

  const name = body.name ? String(body.name).slice(0, 64) : null;
  const path = body.path ? String(body.path).slice(0, 256) : null;
  const locale = body.locale ? String(body.locale).slice(0, 8) : null;
  const device = deviceFromUA(request.headers.get('user-agent') ?? '');

  try {
    const { env } = getCloudflareContext();
    await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO analytics_sessions (id, day, device, entry_path, last_locale)
         VALUES (?, date('now'), ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET last_seen = datetime('now'), last_locale = excluded.last_locale`,
      ).bind(sid, device, path, locale),
      env.DB.prepare(
        `INSERT INTO analytics_events (session_id, day, type, name, path, locale)
         VALUES (?, date('now'), ?, ?, ?, ?)`,
      ).bind(sid, type, name, path, locale),
    ]);
  } catch {
    // Swallow — never surface analytics errors to visitors.
  }

  return NextResponse.json({ ok: true });
}
