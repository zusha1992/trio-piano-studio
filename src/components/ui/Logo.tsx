'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useGate } from '@/components/layout/GateContext';
import { useAdmin } from '@/components/admin/AdminContext';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

// Hold the logo this long to reveal the hidden admin entry.
const LONG_PRESS_MS = 1500;

export default function Logo({ className = '' }: LogoProps) {
  const locale = useLocale();
  const t = useTranslations('meta');
  const pathname = usePathname();
  const gate = useGate();
  const admin = useAdmin();
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  // A completed long-press opens the admin modal and must suppress the click
  // (which would otherwise navigate home).
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressed = useRef(false);

  const startPress = () => {
    longPressed.current = false;
    timer.current = setTimeout(() => {
      longPressed.current = true;
      admin.openLogin();
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
    }, LONG_PRESS_MS);
  };
  const cancelPress = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (longPressed.current) {
      // The press was a long-press (admin entry), not a navigation tap.
      e.preventDefault();
      longPressed.current = false;
      return;
    }
    // From a subpage, close the curtain over the current page first; the hero
    // (desktop gate or mobile vertical gate) performs the actual navigation
    // home once the closing animation finishes.
    if (!isHome && gate) {
      e.preventDefault();
      gate.requestCloseHome();
    }
  };

  return (
    <Link
      href={`/${locale}`}
      onClick={handleClick}
      onPointerDown={startPress}
      onPointerUp={cancelPress}
      onPointerLeave={cancelPress}
      onPointerCancel={cancelPress}
      onContextMenu={(e) => e.preventDefault()}
      className={`inline-flex items-center ${className}`}
      style={{ touchAction: 'manipulation' }}
    >
      <Image
        src="/images/logo-toolbar.png"
        alt={t('site_name')}
        width={1933}
        height={544}
        draggable={false}
        style={{
          height: '30px',
          width: 'auto',
          filter: 'var(--logo-filter)',
          userSelect: 'none',
        }}
        priority
      />
    </Link>
  );
}
