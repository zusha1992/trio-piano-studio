'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { CONTACTS, ContactIcon } from '@/components/layout/heroShared';
import { EASE } from '@/lib/motion';
import { displayFont } from '@/lib/fonts';
import { pick, isRtl } from '@/lib/i18n';

const EMAILJS_SERVICE_ID = 'service_52uluqq';
const EMAILJS_TEMPLATE_ID = 'template_8ozp076';
const EMAILJS_PUBLIC_KEY = 'FsgqljsX-d4Ea9-Ai';

// Values that should always read left-to-right, even in Hebrew.
const LTR_ICONS = [
  'whatsapp.svg',
  'envelope-solid-full.svg',
  'instagram-logo-fill-svgrepo-com.svg',
];

export default function ContactView() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const rtl = isRtl(locale);
  const titleFont = displayFont(locale);

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  // Which contact icon is hovered/focused — drives the reveal text to its side.
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        title: formData.get('subject') as string,
        subject: formData.get('subject') as string,
        message: formData.get('message') as string,
      });
      setStatus('success');
      form.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('error');
    }
  };

  const label = 'mb-2.5 block text-[11px] uppercase tracking-[0.18em] text-[var(--c-text)]';
  const field =
    'w-full rounded-lg border border-[var(--c-border)] bg-transparent px-4 py-3.5 text-[15px] text-[var(--c-text)] transition-colors focus:border-[var(--c-cat)] focus:outline-none';

  // Same details/icons/actions as the home-page footer, plus opening hours.
  // Hours collapse to one line for the inline reveal.
  const details = [
    ...CONTACTS.map((c) => ({
      icon: c.icon,
      text: pick(c.label, locale),
      href: c.href,
      external: c.external ?? false,
    })),
    {
      icon: 'clock.svg',
      text: t('info_hours').replace(/\n/g, '  ·  '),
      href: '',
      external: false,
    },
  ];

  return (
    <section className="mx-auto max-w-[100rem] px-6 pb-24 pt-32 sm:px-10 md:pt-44 lg:px-16 lg:pt-52">
      {/* Title row — big heading (left) with the contact icons bottom-aligned
          at the end of the line, exactly like the store's title + filters. */}
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
          className="ms-4 text-6xl leading-[0.95] tracking-tight text-[var(--c-text)] sm:ms-8 sm:text-7xl md:ms-14 lg:ms-24 lg:text-8xl"
          style={{ fontFamily: titleFont, fontWeight: 500 }}
        >
          {t('hero_title')}
        </motion.h1>

        {/* Mobile only: opening hours shown between the title and the icons
            (there's no hover to reveal them from the clock on touch). */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
          className="ms-4 text-sm leading-relaxed text-[var(--c-dim)] sm:ms-8 md:hidden"
        >
          {t('info_hours').replace(/\n/g, '  ·  ')}
        </motion.p>

        {/* Icons sit at the end of the line; hovering one reveals its detail
            inline, emerging from the icons' side — from the right in English,
            from the left in Hebrew. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: EASE }}
          className="flex items-center gap-5 sm:gap-6 md:pb-2"
          onMouseLeave={() => setActive(null)}
        >
          {/* Reveal area — inline next to the icons (desktop only) */}
          <div className="relative hidden h-7 w-[min(60vw,26rem)] overflow-hidden md:block">
            <AnimatePresence mode="wait">
              {active && (
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: rtl ? -24 : 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: rtl ? -24 : 24 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="absolute inset-0 flex items-center justify-end whitespace-nowrap text-lg text-[var(--c-text)]"
                >
                  {LTR_ICONS.includes(active) ? (
                    <span dir="ltr">{details.find((d) => d.icon === active)?.text}</span>
                  ) : (
                    details.find((d) => d.icon === active)?.text
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-5 sm:gap-6">
            {details.map((c) => {
              const inner = (
                <ContactIcon src={`/assets/icons/${c.icon}`} size={c.icon === 'clock.svg' ? 24 : 30} />
              );
              const common =
                'flex items-center text-[color:var(--c-cat)] transition-colors duration-300 hover:text-[color:var(--c-cat-active)]';
              const on = () => setActive(c.icon);
              return c.href ? (
                <a
                  key={c.icon}
                  href={c.href}
                  target={c.external ? '_blank' : undefined}
                  rel={c.external ? 'noopener noreferrer' : undefined}
                  aria-label={c.text}
                  className={common}
                  onMouseEnter={on}
                  onFocus={on}
                >
                  {inner}
                </a>
              ) : (
                // Clock/hours — hidden on mobile (shown as text above instead).
                <span
                  key={c.icon}
                  aria-label={c.text}
                  className={`${common} hidden cursor-default md:flex`}
                  onMouseEnter={on}
                  onFocus={on}
                  tabIndex={0}
                >
                  {inner}
                </span>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Full-width message form */}
      <motion.div
        initial={false}
        className="mt-12 md:mt-16"
      >
        {status === 'success' ? (
          <p role="status" className="text-[15px] leading-relaxed text-[var(--c-dim)]">
            {t('form_success')}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-12">
              {/* Left column (1/3): name, phone, email stacked */}
              <div className="space-y-5">
                <div>
                  <label htmlFor="contact-name" className={label}>{t('form_name')} *</label>
                  <input id="contact-name" name="name" required aria-required="true" className={field} />
                </div>
                <div>
                  <label htmlFor="contact-phone" className={label}>{t('form_phone')}</label>
                  <input id="contact-phone" name="phone" type="tel" dir="ltr" className={field} />
                </div>
                <div>
                  <label htmlFor="contact-email" className={label}>{t('form_email')} *</label>
                  <input id="contact-email" name="email" type="email" required aria-required="true" dir="ltr" className={field} />
                </div>
              </div>

              {/* Right column (2/3): subject + message, message fills height */}
              <div className="flex flex-col gap-5 md:col-span-2">
                <div>
                  <label htmlFor="contact-subject" className={label}>{t('form_subject')}</label>
                  <input id="contact-subject" name="subject" className={field} />
                </div>
                <div className="flex flex-1 flex-col">
                  <label htmlFor="contact-message" className={label}>{t('form_message')} *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    aria-required="true"
                    className={`${field} min-h-[9rem] flex-1 resize-none`}
                  />
                </div>
              </div>
            </div>

            {status === 'error' && (
              <p role="alert" className="text-sm text-red-500">
                {t('form_error')}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="inline-block rounded-full bg-[color:var(--c-cat)] px-8 py-3 text-[11px] uppercase tracking-[0.25em] text-[var(--c-bg)] transition-colors duration-300 hover:bg-[color:var(--c-cat-active)] disabled:opacity-60"
              style={{ fontFamily: titleFont, fontWeight: 400 }}
            >
              {status === 'sending' ? t('form_sending') : t('form_submit')}
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
