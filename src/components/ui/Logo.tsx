'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useGate } from '@/components/layout/GateContext';
import { useIsMobile } from '@/hooks/useIsMobile';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export default function Logo({ className = '' }: LogoProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const gate = useGate();
  const isMobile = useIsMobile();
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  const handleClick = (e: React.MouseEvent) => {
    // From a subpage on desktop, close the curtain over the current page first;
    // the HeroGate performs the actual navigation once the animation finishes.
    // On mobile there is no gate, so let the link navigate home normally.
    if (!isHome && !isMobile && gate) {
      e.preventDefault();
      gate.requestCloseHome();
    }
  };

  return (
    <Link
      href={`/${locale}`}
      onClick={handleClick}
      className={`inline-flex items-center ${className}`}
    >
      <Image
        src="/images/logo-toolbar.png"
        alt="Trio Piano Workshop"
        width={1933}
        height={544}
        style={{
          height: '30px',
          width: 'auto',
          filter: 'var(--logo-filter)',
        }}
        priority
      />
    </Link>
  );
}
