'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Mail, Phone, MapPin } from 'lucide-react';
import Logo from '@/components/ui/Logo';

const navLinks = ['about', 'services', 'store', 'gallery', 'contact'] as const;
const navPaths: Record<string, string> = {
  about: '/about',
  services: '/services',
  store: '/store',
  gallery: '/gallery',
  contact: '/contact',
};

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tContact = useTranslations('contact');
  const locale = useLocale();

  return (
    <footer className="border-t border-[#2C241A] bg-[#11100C]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Logo className="mb-4" />
            <p className="text-sm text-[#6A5C4A] leading-relaxed mt-4 max-w-xs">
              {t('tagline')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#A08C7C] mb-6">
              {t('nav_title')}
            </h4>
            <ul className="space-y-3">
              {navLinks.map((key) => (
                <li key={key}>
                  <Link
                    href={`/${locale}${navPaths[key]}`}
                    className="text-sm text-[#6A5C4A] hover:text-[#F0EAD6] transition-colors"
                  >
                    {tNav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#A08C7C] mb-6">
              {t('contact_title')}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: '#A08C7C' }} />
                <span className="text-sm text-[#6A5C4A]">{tContact('info_address')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={14} style={{ color: '#A08C7C' }} />
                <a
                  href={`tel:${tContact('info_phone')}`}
                  className="text-sm text-[#6A5C4A] hover:text-[#F0EAD6] transition-colors"
                  dir="ltr"
                >
                  {tContact('info_phone')}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={14} style={{ color: '#A08C7C' }} />
                <a
                  href={`mailto:${tContact('info_email')}`}
                  className="text-sm text-[#6A5C4A] hover:text-[#F0EAD6] transition-colors"
                >
                  {tContact('info_email')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#28201A] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#4A3C2C]">
            © {new Date().getFullYear()} Trio Piano Workshop. {t('rights')}
          </p>
          <p className="text-xs text-[#4A3C2C]">{t('address')}</p>
        </div>
      </div>
    </footer>
  );
}
