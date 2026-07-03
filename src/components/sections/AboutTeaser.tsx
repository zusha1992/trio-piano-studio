'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

export default function AboutTeaser() {
  const t = useTranslations('about_teaser');
  const locale = useLocale();

  return (
    <section className="section-padding bg-[#16120E]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Visual side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative h-[480px] bg-[#1F1912] border border-[#2C241A]">
              {/* Piano keys decorative element */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex gap-2">
                  {[80, 120, 100, 90, 110, 95, 105].map((h, i) => (
                    <div
                      key={i}
                      className="w-10 bg-[#F0EAD6] rounded-b-sm opacity-5"
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
              </div>
              {/* Number accent */}
              <div className="absolute bottom-8 start-8">
                <p className="text-[80px] leading-none font-light text-[#28201A]"
                  style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                  3
                </p>
              </div>
              {/* Gold accent line */}
              <div className="absolute top-0 start-0 w-1 h-24 bg-[#A08C7C]" />
            </div>

            {/* Stats overlay */}
            <div className="absolute -bottom-6 -end-6 bg-[#A08C7C] p-8 hidden md:block">
              <p className="text-4xl font-light text-[#16120E]"
                style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                100+
              </p>
              <p className="text-xs tracking-[0.2em] uppercase text-[#16120E]/70 mt-1">
                {locale === 'he' ? 'פסנתרים שוקמו' : 'Pianos Restored'}
              </p>
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#A08C7C] mb-6">
              {t('label')}
            </p>
            <div className="gold-divider" />
            <h2
              className="text-4xl lg:text-5xl font-light text-[#F0EAD6] leading-tight mb-8"
              style={{
                fontFamily:
                  locale === 'he'
                    ? 'var(--font-heebo), sans-serif'
                    : 'var(--font-cormorant), serif',
              }}
            >
              {t('title')}
            </h2>
            <p className="text-base text-[#796B58] leading-relaxed mb-10">
              {t('body')}
            </p>
            <Button href={`/${locale}/about`} variant="outline">
              {t('cta')}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
