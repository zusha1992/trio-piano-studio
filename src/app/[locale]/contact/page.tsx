'use client';

import { useState, FormEvent } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
import emailjs from '@emailjs/browser';

// Replace these with your actual EmailJS credentials
const EMAILJS_SERVICE_ID = 'service_52uluqq';
const EMAILJS_TEMPLATE_ID = 'template_nz0v8qu';
const EMAILJS_PUBLIC_KEY = 'FsgqljsX-d4Ea9-Ai';

export default function ContactPage() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const headingFont =
    locale === 'he' ? 'var(--font-heebo), sans-serif' : 'var(--font-cormorant), serif';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          subject: formData.get('subject') as string,
          message: formData.get('message') as string,
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setStatus('success');
      form.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('error');
    }
  };

  const contactInfo = [
    { icon: MapPin, label: t('info_address') },
    { icon: Phone, label: t('info_phone'), href: `tel:+972543337341` },
    { icon: Mail, label: t('info_email'), href: `mailto:trio.piano.studio@gmail.com` },
    { icon: Clock, label: t('info_hours') },
    { icon: FacebookIcon, label: 'trio.piano.studio', href: 'https://www.facebook.com/profile.php?id=61590350696510' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[45vh] flex items-end bg-[#16120E] pt-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(201,168,76,0.04) 0%, transparent 60%)',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-16 w-full">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] tracking-[0.4em] uppercase text-[#A08C7C] mb-4"
          >
            {t('hero_label')}
          </motion.p>
          <div className="gold-divider" />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl lg:text-6xl font-light text-[#F0EAD6] leading-tight mb-4"
            style={{ fontFamily: headingFont }}
          >
            {t('hero_title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base text-[#6A5C4A] max-w-xl"
          >
            {t('hero_subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="section-padding bg-[#16120E] border-t border-[#1F1912]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-3"
            >
              {status === 'success' ? (
                <div className="bg-[#1B1610] border border-[#A08C7C]/30 p-12 text-center">
                  <p className="text-3xl mb-4">✓</p>
                  <p className="text-[#A08C7C] text-lg mb-2">{t('form_success')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6A5C4A] mb-2">
                        {t('form_name')} *
                      </label>
                      <input
                        name="name"
                        required
                        className="w-full bg-[#1B1610] border border-[#2C241A] text-[#F0EAD6] px-4 py-3 text-sm focus:outline-none focus:border-[#A08C7C] transition-colors placeholder-[#4A3C2C]"
                        placeholder={t('form_name')}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6A5C4A] mb-2">
                        {t('form_phone')}
                      </label>
                      <input
                        name="phone"
                        type="tel"
                        className="w-full bg-[#1B1610] border border-[#2C241A] text-[#F0EAD6] px-4 py-3 text-sm focus:outline-none focus:border-[#A08C7C] transition-colors placeholder-[#4A3C2C]"
                        placeholder={t('form_phone')}
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6A5C4A] mb-2">
                      {t('form_email')} *
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full bg-[#1B1610] border border-[#2C241A] text-[#F0EAD6] px-4 py-3 text-sm focus:outline-none focus:border-[#A08C7C] transition-colors placeholder-[#4A3C2C]"
                      placeholder={t('form_email')}
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6A5C4A] mb-2">
                      {t('form_subject')}
                    </label>
                    <input
                      name="subject"
                      className="w-full bg-[#1B1610] border border-[#2C241A] text-[#F0EAD6] px-4 py-3 text-sm focus:outline-none focus:border-[#A08C7C] transition-colors placeholder-[#4A3C2C]"
                      placeholder={t('form_subject')}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6A5C4A] mb-2">
                      {t('form_message')} *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      className="w-full bg-[#1B1610] border border-[#2C241A] text-[#F0EAD6] px-4 py-3 text-sm focus:outline-none focus:border-[#A08C7C] transition-colors resize-none placeholder-[#4A3C2C]"
                      placeholder={t('form_message')}
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-red-400 text-sm">{t('form_error')}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full sm:w-auto bg-[#A08C7C] hover:bg-[#D4B96A] disabled:opacity-60 text-[#16120E] text-xs tracking-[0.2em] uppercase px-10 py-4 transition-all duration-300 cursor-pointer"
                  >
                    {status === 'sending' ? t('form_sending') : t('form_submit')}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >
              {contactInfo.map(({ icon: Icon, label, href }, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-[#2C241A] flex items-center justify-center shrink-0">
                    <Icon size={16} style={{ color: '#A08C7C' }} />
                  </div>
                  {href ? (
                    <a
                      href={href}
                      className="text-sm text-[#796B58] hover:text-[#F0EAD6] transition-colors leading-relaxed mt-2"
                      dir="ltr"
                    >
                      {label}
                    </a>
                  ) : (
                    <p className="text-sm text-[#796B58] leading-relaxed mt-2 whitespace-pre-line">
                      {label}
                    </p>
                  )}
                </div>
              ))}

              {/* WhatsApp link */}
              <a
                href="https://wa.me/972543337341"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 border border-[#25D366]/30 hover:border-[#25D366] p-4 transition-all duration-300 group"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="#25D366"
                  className="w-5 h-5 shrink-0"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span className="text-sm text-[#796B58] group-hover:text-[#25D366] transition-colors">
                  {t('whatsapp')}
                </span>
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
