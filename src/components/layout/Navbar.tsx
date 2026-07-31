'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Menu, Moon, Sun, X } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import LanguageToggle from '@/components/layout/LanguageToggle';
import { CATEGORIES } from '@/components/layout/heroShared';
import { useTheme } from '@/components/layout/ThemeContext';
import { pick } from '@/lib/i18n';
import { displayFont } from '@/lib/fonts';

// The landing page surfaces contact details in its footer; the subpages don't,
// so the toolbar carries a dedicated contact link after the categories.
const CONTACT_ITEM = {
  key: 'contact',
  href: 'contact',
  label: { he: 'צור קשר', en: 'Contact', ar: 'اتصل بنا', ru: 'Контакты' },
};
// Explicit toolbar order (reads left→right in LTR, mirrored in RTL):
// About · The Store · The Workshop · Concerts · Contact.
const NAV_ORDER = ['about', 'store', 'services', 'concerts'];
const NAV_ITEMS = [
  ...NAV_ORDER.map((k) => CATEGORIES.find((c) => c.key === k)!),
  CONTACT_ITEM,
];

export default function Navbar() {
  const locale = useLocale();
  const pathname = usePathname();
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { negative, toggle: toggleTheme } = useTheme();

  const navHref = (key: string) => `/${locale}/${key}`;

  // Same typeface as the home-screen category headers.
  const headingFont = displayFont(locale);

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
          scrolled ? 'border-[var(--c-border)] shadow-sm' : 'border-transparent'
        }`}
        style={{ backgroundColor: 'var(--c-bg)' }}
      >
        <nav className="mx-auto flex h-16 max-w-[100rem] items-center justify-between px-6 sm:px-10 lg:px-16">
          {/* Logo */}
          <Logo />

          {/* Everything else sits together on the reading-end side */}
          <div className="flex items-center gap-12">
            {/* Desktop links — same categories, labels and order as the home screen */}
            <ul className="hidden items-center gap-8 lg:flex">
              {NAV_ITEMS.map((c) => {
                const active = pathname === navHref(c.href);
                return (
                  <li key={c.key}>
                    <Link
                      href={navHref(c.href)}
                      className={`text-[15px] tracking-tight transition-colors duration-300 ${
                        active
                          ? 'text-[color:var(--c-cat-active)]'
                          : 'text-[color:var(--c-cat)] hover:text-[color:var(--c-cat-active)]'
                      }`}
                      style={{ fontFamily: headingFont, fontWeight: 400 }}
                    >
                      {pick(c.label, locale)}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-4">
            {/* Language toggle */}
            <LanguageToggle triggerClassName="text-[color:var(--c-cat)] hover:text-[color:var(--c-cat-active)]" />

            {/* Theme toggle — shares the home screen's persisted preference */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="text-[color:var(--c-cat)] transition-colors duration-300 hover:text-[color:var(--c-cat-active)]"
            >
              {negative ? <Sun size={15} strokeWidth={1.5} /> : <Moon size={15} strokeWidth={1.5} />}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 text-[color:var(--c-cat)] transition-colors hover:text-[color:var(--c-cat-active)] lg:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 backdrop-blur-md lg:hidden"
          style={{ backgroundColor: 'var(--c-overlay-bg)' }}
          onClick={() => setMenuOpen(false)}
        >
          {NAV_ITEMS.map((c) => {
            const active = pathname === navHref(c.href);
            return (
              <Link
                key={c.key}
                href={navHref(c.href)}
                onClick={() => setMenuOpen(false)}
                className={`text-4xl tracking-tight transition-colors duration-300 ${
                  active
                    ? 'text-[color:var(--c-cat-active)]'
                    : 'text-[color:var(--c-cat)] hover:text-[color:var(--c-cat-active)]'
                }`}
                style={{ fontFamily: headingFont, fontWeight: 400 }}
              >
                {pick(c.label, locale)}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
