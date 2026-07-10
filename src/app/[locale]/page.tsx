'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const locale = useLocale();
  const isHe = locale === 'he';
  const headingFont = isHe ? 'var(--font-heebo), sans-serif' : 'var(--font-cormorant), serif';

  const heroNav = [
    { en: 'Workshop', he: 'בית מלאכה', href: `/${locale}/services` },
    { en: 'Piano Store', he: 'חנות פסנתרים', href: `/${locale}/store` },
    { en: 'Concerts', he: 'קונצרטים', href: `/${locale}/concerts` },
    { en: 'Contact', he: 'צור קשר', href: `/${locale}/contact` },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center bg-[var(--c-bg)] overflow-hidden"
    >
      {/* Subtle grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        }}
      />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginTop: '-80px' }}
      >
        <Image
          src="/images/logo.png"
          alt="Trio Piano Workshop"
          width={2199}
          height={734}
          style={{ height: '135px', width: 'auto', filter: 'var(--logo-filter)' }}
          priority
        />
      </motion.div>

      {/* Nav words */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6 lg:gap-8"
      >
        {heroNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex flex-col items-center gap-2 text-center"
          >
            <span
              className="text-xl lg:text-3xl font-light tracking-[0.25em] uppercase text-[var(--c-muted)] group-hover:text-[var(--c-text)] transition-all duration-700 group-hover:scale-110 inline-block"
              style={{ fontFamily: headingFont }}
            >
              {isHe ? item.he : item.en}
            </span>
          </Link>
        ))}
      </motion.div>
    </section>
  );
}
