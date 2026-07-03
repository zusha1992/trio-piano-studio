'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#16120E]">
      {/* Subtle vertical lines */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.04]">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px bg-[#F0EAD6]"
            style={{ left: `${(i + 1) * 11.11}%` }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl sm:text-7xl lg:text-9xl font-light text-[#F0EAD6] leading-[1.0] mb-8"
          style={{
            fontFamily:
              locale === 'he'
                ? 'var(--font-heebo), sans-serif'
                : 'var(--font-cormorant), serif',
          }}
        >
          {t('title')
            .split('\n')
            .map((line, i) => (
              <span key={i} className="block">
                {i === 1 ? (
                  <em style={{ color: '#A08C7C', fontStyle: 'normal' }}>{line}</em>
                ) : (
                  line
                )}
              </span>
            ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xs tracking-[0.4em] uppercase text-[#6A5C4A] mb-12"
        >
          {t('subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button href={`/${locale}/store`} size="lg">
            {t('cta_store')}
          </Button>
          <Button href={`/${locale}/services`} variant="outline" size="lg">
            {t('cta_services')}
          </Button>
        </motion.div>
      </div>

      {/* Scroll line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-px h-16 bg-gradient-to-b from-transparent to-[#A08C7C]/60" />
      </motion.div>
    </section>
  );
}
