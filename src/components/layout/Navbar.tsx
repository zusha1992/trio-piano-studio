'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import ThemeToggle from '@/components/ui/ThemeToggle';

const navItems = [
  { key: 'services', labelEn: 'Workshop', labelHe: 'בית מלאכה' },
  { key: 'store', labelEn: 'Piano Store', labelHe: 'חנות פסנתרים' },
  { key: 'concerts', labelEn: 'Concerts', labelHe: 'קונצרטים' },
  { key: 'contact', labelEn: 'Contact', labelHe: 'צור קשר' },
] as const;

export default function Navbar() {
  const locale = useLocale();
  const pathname = usePathname();
  const isHe = locale === 'he';
  const isHome = pathname === `/${locale}` || pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const otherLocale = isHe ? 'en' : 'he';

  // On subpages the logo is always visible; on home it appears after scrolling past hero
  const showLogo = isHome ? pastHero : true;

  // On home page use bare #anchor for smooth scroll; on subpages navigate back to home
  const navHref = (key: string) => isHome ? `#${key}` : `/${locale}#${key}`;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      setPastHero(window.scrollY > window.innerHeight * 0.85);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled || menuOpen
            ? 'backdrop-blur-md border-b border-[var(--c-border)]'
            : 'bg-transparent'
        }`}
        style={scrolled || menuOpen ? { backgroundColor: 'var(--c-nav-bg)' } : {}}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className={`transition-opacity duration-500 ${showLogo ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <Logo />
          </div>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-10">
            {navItems.map(({ key, labelEn, labelHe }) => (
              <li key={key}>
                <a
                  href={navHref(key)}
                  className="text-[11px] tracking-[0.25em] uppercase text-[var(--c-dim)] hover:text-[var(--c-text)] transition-colors duration-300"
                >
                  {isHe ? labelHe : labelEn}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* Language toggle */}
            <Link
              href={`/${otherLocale}`}
              className="text-[11px] tracking-[0.2em] uppercase text-[var(--c-dim)] hover:text-[var(--c-text)] transition-colors duration-300"
            >
              {otherLocale === 'he' ? 'עב' : 'EN'}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-[var(--c-dim)] hover:text-[var(--c-text)] transition-colors p-1"
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
          className="fixed inset-0 z-40 backdrop-blur-md flex flex-col items-center justify-center gap-10 lg:hidden"
          style={{ backgroundColor: 'var(--c-overlay-bg)' }}
          onClick={() => setMenuOpen(false)}
        >
          {navItems.map(({ key, labelEn, labelHe }) => (
            <a
              key={key}
              href={navHref(key)}
              className="text-2xl font-light tracking-[0.15em] uppercase text-[var(--c-text)] hover:text-[var(--c-accent)] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {isHe ? labelHe : labelEn}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
