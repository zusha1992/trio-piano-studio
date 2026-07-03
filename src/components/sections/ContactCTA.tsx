'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

export default function ContactCTA() {
  const t = useTranslations('cta_banner');
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden bg-[#A08C7C]">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            #16120E,
            #16120E 1px,
            transparent 1px,
            transparent 12px
          )`,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 py-24 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl lg:text-5xl font-light text-[#16120E] mb-6 leading-tight"
          style={{
            fontFamily:
              locale === 'he'
                ? 'var(--font-heebo), sans-serif'
                : 'var(--font-cormorant), serif',
          }}
        >
          {t('title')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-base text-[#16120E]/70 mb-10 max-w-xl mx-auto"
        >
          {t('subtitle')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Button
            href={`/${locale}/contact`}
            className="!bg-[#16120E] !text-[#F0EAD6] hover:!bg-[#28201A]"
            size="lg"
          >
            {t('cta')}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
