'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import ContactCTA from '@/components/sections/ContactCTA';
import { EASE } from '@/lib/motion';
import { displayFont } from '@/lib/fonts';

// Each founder's photo is bound to their id (not a positional index), so the
// name, bio and image can never drift apart regardless of order or locale.
const FOUNDERS = [
  { id: 'gadi', image: '/images/About/Gadi.jpg' },
  { id: 'nethanel', image: '/images/About/Fastman.jpg' },
  { id: 'noam', image: '/images/About/Noam.jpg' },
] as const;

// Bottom scrim so overlaid text stays readable on the mobile banners.
const SCRIM =
  'pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent md:hidden';

export default function AboutPage() {
  const t = useTranslations('about');
  const locale = useLocale() as 'en' | 'he';
  const isHe = locale === 'he';
  const titleFont = displayFont(isHe);

  const aboutBody = t.raw('about_trio_body') as string[];
  const whoBody = t.raw('who_body') as string[];

  // Page entrance is handled once by the route template; in-page elements stay
  // static so they don't re-animate ("slide up") while scrolling.
  const reveal = { initial: false as const };

  const heading = 'text-3xl tracking-tight text-[var(--c-text)] sm:text-4xl';
  const paragraph = 'max-w-md text-[15px] leading-relaxed text-[var(--c-text)]';
  // Rounded square card on mobile (matching the founder images), taller
  // portrait card sitting inside the grid column on desktop.
  const banner =
    'relative aspect-square overflow-hidden rounded-2xl bg-[var(--c-bg-alt)] md:aspect-[12/13]';
  const bannerTitle =
    'absolute bottom-0 start-0 p-5 text-3xl tracking-tight text-white drop-shadow md:hidden';

  return (
    <>
      <section className="mx-auto max-w-6xl px-8 pb-24 pt-32 sm:px-10 md:pt-44 lg:px-12 lg:pt-52">
        {/* Page title — same treatment as the store */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
          className="ms-4 text-6xl leading-[0.95] tracking-tight text-[var(--c-text)] sm:ms-8 sm:text-7xl md:ms-14 lg:ms-20 lg:text-8xl"
          style={{ fontFamily: titleFont, fontWeight: 500 }}
        >
          {t('hero_title')}
        </motion.h1>

        {/* Section 1 — The Studio / Who We Are.
            Desktop: alternating text + image. Mobile: full-width image banners
            with the title overlaid, followed by the paragraphs. */}
        <div className="mt-16 grid grid-cols-1 gap-x-12 gap-y-10 md:mt-24 md:grid-cols-2 md:items-center md:gap-y-24">
          {/* The Studio — text */}
          <motion.div {...reveal} className="order-2 md:order-1">
            <h2 className={`hidden md:block ${heading}`} style={{ fontFamily: titleFont, fontWeight: 400 }}>
              {t('about_trio_title')}
            </h2>
            <div className="space-y-4 md:mt-6">
              {aboutBody.map((p, i) => (
                <p key={i} className={paragraph}>
                  {p}
                </p>
              ))}
            </div>
          </motion.div>

          {/* The Studio — image / mobile banner */}
          <motion.div {...reveal} className={`order-1 md:order-2 ${banner}`}>
            <Image
              src="/images/About/about-trio.jpg"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
            <div className={SCRIM} />
            <h2 className={bannerTitle} style={{ fontFamily: titleFont, fontWeight: 400 }}>
              {t('about_trio_title')}
            </h2>
          </motion.div>

          {/* Who We Are — image / mobile banner (left on desktop) */}
          <motion.div {...reveal} className={`order-3 ${banner}`}>
            <Image
              src="/images/About/who-we-are.jpeg"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
            <div className={SCRIM} />
            <h2 className={bannerTitle} style={{ fontFamily: titleFont, fontWeight: 400 }}>
              {t('who_title')}
            </h2>
          </motion.div>

          {/* Who We Are — text (right on desktop) */}
          <motion.div {...reveal} className="order-4">
            <h2 className={`hidden md:block ${heading}`} style={{ fontFamily: titleFont, fontWeight: 400 }}>
              {t('who_title')}
            </h2>
            <div className="space-y-4 md:mt-6">
              {whoBody.map((p, i) => (
                <p key={i} className={paragraph}>
                  {p}
                </p>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Section 2 — Founders */}
        <div className="mt-24 md:mt-40">
          <motion.h2
            {...reveal}
            className={`text-center ${heading}`}
            style={{ fontFamily: titleFont, fontWeight: 400 }}
          >
            {t('founders_title')}
          </motion.h2>

          <div className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-x-10 sm:gap-y-14 lg:gap-x-16">
            {FOUNDERS.map((f) => {
              const name = t(`founders.${f.id}.name`);
              const bio = t(`founders.${f.id}.bio`);
              return (
                <motion.div
                  key={f.id}
                  initial={false}
                  className="flex w-full flex-col text-start sm:mx-auto sm:max-w-[18rem]"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--c-bg-alt)]">
                    <Image
                      src={f.image}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 30vw"
                    />
                    <div className={SCRIM} />
                    <h3
                      className="absolute bottom-0 start-0 p-4 text-2xl tracking-tight text-white drop-shadow md:hidden"
                      style={{ fontFamily: titleFont, fontWeight: 500 }}
                    >
                      {name}
                    </h3>
                  </div>
                  <h3
                    className="mt-5 hidden text-xl tracking-tight text-[var(--c-text)] md:block"
                    style={{ fontFamily: titleFont, fontWeight: 500 }}
                  >
                    {name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--c-text)] md:mt-2">{bio}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
