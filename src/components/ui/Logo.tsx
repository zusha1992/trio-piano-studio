'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useGate } from '@/components/layout/GateContext';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export default function Logo({ className = '' }: LogoProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const gate = useGate();
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  const handleClick = (e: React.MouseEvent) => {
    // From a subpage, close the curtain over the current page first; the
    // HeroGate performs the actual navigation once the animation finishes.
    if (!isHome && gate) {
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
        src="/images/logo.png"
        alt="Trio Piano Workshop"
        width={2199}
        height={734}
        style={{
          height: '32px',
          width: 'auto',
          filter: 'var(--logo-filter)',
        }}
        priority
      />
    </Link>
  );
}
