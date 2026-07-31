'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useAdmin } from './AdminContext';

const SID_KEY = 'trio_sid';

function sessionId(): string {
  try {
    let id = localStorage.getItem(SID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(SID_KEY, id);
    }
    return id;
  } catch {
    return 'anon';
  }
}

// Maps an anchor href to a named contact click we care about; null = not tracked.
function clickName(href: string): string | null {
  const h = href.toLowerCase();
  if (h.includes('wa.me') || h.includes('whatsapp') || h.includes('api.whatsapp')) return 'whatsapp';
  if (h.startsWith('mailto:')) return 'email';
  if (h.includes('instagram.com')) return 'instagram';
  if (h.startsWith('tel:')) return 'phone';
  if (h.includes('waze.com') || h.includes('maps.google') || h.includes('goo.gl/maps') || h.includes('maps.app'))
    return 'directions';
  return null;
}

// First-party pageview + contact-click tracking. Renders nothing. Skips the
// logged-in admin so their own browsing doesn't pollute the numbers.
export default function AnalyticsTracker() {
  const pathname = usePathname();
  const locale = useLocale();
  const { authed } = useAdmin();

  // Pageview on every route change.
  useEffect(() => {
    if (authed) return;
    const sid = sessionId();
    void fetch('/api/track', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({ sid, type: 'pageview', path: pathname, locale }),
    }).catch(() => {});
  }, [pathname, locale, authed]);

  // Delegated contact-link click tracking (keepalive so it survives navigation).
  useEffect(() => {
    if (authed) return;
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest('a');
      const href = anchor?.getAttribute('href');
      if (!href) return;
      const name = clickName(href);
      if (!name) return;
      void fetch('/api/track', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({ sid: sessionId(), type: 'click', name, path: pathname, locale }),
      }).catch(() => {});
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, [pathname, locale, authed]);

  return null;
}
