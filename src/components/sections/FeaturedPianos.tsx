'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import PianoCard from '@/components/ui/PianoCard';
import Button from '@/components/ui/Button';
import { pianos } from '@/data/pianos';

export default function FeaturedPianos() {
  const t = useTranslations('featured');
  const locale = useLocale();
  const featured = pianos.filter((p) => p.featured).slice(0, 3);

  return (
    <section className="section-padding bg-[#11100C] border-t border-[#1F1912]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[10px] tracking-[0.4em] uppercase text-[#A08C7C] mb-4"
            >
              {t('label')}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl lg:text-5xl font-light text-[#F0EAD6]"
              style={{
                fontFamily:
                  locale === 'he'
                    ? 'var(--font-heebo), sans-serif'
                    : 'var(--font-cormorant), serif',
              }}
            >
              {t('title')}
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-[#6A5C4A] max-w-xs"
          >
            {t('subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((piano, i) => (
            <motion.div
              key={piano.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
            >
              <PianoCard piano={piano} />
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button href={`/${locale}/store`} variant="outline">
            {t('cta')}
          </Button>
        </div>
      </div>
    </section>
  );
}
