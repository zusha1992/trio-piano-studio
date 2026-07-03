'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export default function Logo({ className = '', variant = 'light' }: LogoProps) {
  const locale = useLocale();

  return (
    <Link href={`/${locale}`} className={`inline-flex items-center ${className}`}>
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
