'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';

const featureKeys = ['restoration', 'sales', 'imports'] as const;
const featureIcons = {
  restoration: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M4 28V16L16 4L28 16V28H20V20H12V28H4Z" stroke="#A08C7C" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <circle cx="16" cy="13" r="2" stroke="#A08C7C" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  sales: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="4" y="8" width="6" height="20" rx="1" stroke="#A08C7C" strokeWidth="1.5" fill="none" />
      <rect x="13" y="4" width="6" height="24" rx="1" stroke="#A08C7C" strokeWidth="1.5" fill="none" />
      <rect x="22" y="12" width="6" height="16" rx="1" stroke="#A08C7C" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  imports: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="11" stroke="#A08C7C" strokeWidth="1.5" fill="none" />
      <path d="M16 5C16 5 10 10 10 16C10 22 16 27 16 27" stroke="#A08C7C" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 5C16 5 22 10 22 16C22 22 16 27 16 27" stroke="#A08C7C" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5" y1="16" x2="27" y2="16" stroke="#A08C7C" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

const featurePaths = {
  restoration: '/services',
  sales: '/store',
  imports: '/services',
};

export default function Features() {
  const t = useTranslations('features');
  const locale = useLocale();

  return (
    <section className="bg-[#16120E] border-t border-[#28201A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#28201A]">
          {featureKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <Link
                href={`/${locale}${featurePaths[key]}`}
                className="group block p-10 lg:p-14 hover:bg-[#1B1610] transition-colors duration-300"
              >
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300 origin-left">
                  {featureIcons[key]}
                </div>
                <h3 className="text-xl font-light text-[#F0EAD6] mb-4 tracking-wide">
                  {t(`${key}.title`)}
                </h3>
                <p className="text-sm text-[#6A5C4A] leading-relaxed">
                  {t(`${key}.desc`)}
                </p>
                <div className="mt-6 flex items-center gap-2 text-[#A08C7C] text-xs tracking-[0.2em] uppercase group-hover:gap-4 transition-all duration-300">
                  <span>→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
