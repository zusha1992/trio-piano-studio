'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/ui/Logo';

const navItems = [
  { key: 'about', labelEn: 'About', labelHe: 'על הסטודיו' },
  { key: 'services', labelEn: 'Workshop', labelHe: 'בית מלאכה' },
  { key: 'store', labelEn: 'Piano Store', labelHe: 'חנות פסנתרים' },
  { key: 'concerts', labelEn: 'Concerts', labelHe: 'קונצרטים' },
  { key: 'contact', labelEn: 'Contact', labelHe: 'צור קשר' },
] as const;

export default function Navbar() {
  const locale = useLocale();
  const isHe = locale === 'he';
  const pathname = usePathname();
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const otherLocale = isHe ? 'en' : 'he';
  const navHref = (key: string) => `/${locale}/${key}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // On the landing page the split-screen categories are the navigation, so the
  // top toolbar only appears once you're inside one of the pages.
  if (isHome) return null;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-shadow duration-300 ${
          scrolled ? 'border-[var(--c-border)] shadow-sm' : 'border-[var(--c-border-lt)]'
        }`}
        style={{ backgroundColor: 'var(--c-nav-bg)', backdropFilter: 'blur(8px)' }}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          {/* Logo */}
          <Logo />

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 lg:flex">
            {navItems.map(({ key, labelEn, labelHe }) => (
              <li key={key}>
                <Link
                  href={navHref(key)}
                  className="text-[11px] uppercase tracking-[0.25em] text-[var(--c-dim)] transition-colors duration-300 hover:text-[var(--c-text)]"
                >
                  {isHe ? labelHe : labelEn}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            {/* Language toggle */}
            <Link
              href={`/${otherLocale}`}
              className="text-[11px] uppercase tracking-[0.2em] text-[var(--c-dim)] transition-colors duration-300 hover:text-[var(--c-text)]"
            >
              {otherLocale === 'he' ? 'עב' : 'EN'}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 text-[var(--c-dim)] transition-colors hover:text-[var(--c-text)] lg:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-10 backdrop-blur-md lg:hidden"
          style={{ backgroundColor: 'var(--c-overlay-bg)' }}
          onClick={() => setMenuOpen(false)}
        >
          {navItems.map(({ key, labelEn, labelHe }) => (
            <Link
              key={key}
              href={navHref(key)}
              className="text-2xl font-light uppercase tracking-[0.15em] text-[var(--c-text)] transition-colors hover:text-[var(--c-accent)]"
              onClick={() => setMenuOpen(false)}
            >
              {isHe ? labelHe : labelEn}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
