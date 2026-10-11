'use client';

import { useLocale } from 'next-intl';
import { CONTACTS } from '@/data/contact';
import { pick } from '@/lib/i18n';

const WHATSAPP = CONTACTS.find((c) => c.icon === 'whatsapp.svg')!;

const LABEL = {
  he: 'וואטסאפ',
  en: 'WhatsApp',
  ar: 'واتساب',
  ru: 'WhatsApp',
};

/**
 * Always-visible chat shortcut. Sits on the inline-start edge — bottom left
 * in English and Russian, bottom right in Hebrew and Arabic — and scales with
 * the viewport so it stays smaller on a phone than on a desktop.
 */
export default function WhatsAppButton() {
  const locale = useLocale();

  return (
    <a
      href={WHATSAPP.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={pick(LABEL, locale)}
      className="fixed z-[110] block transition-transform duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366]"
      style={{
        // env() without a fallback invalidates the whole declaration on desktop,
        // which dropped the offset and pinned the button to the corner.
        bottom: 'calc(clamp(1.25rem, 0.8rem + 1vw, 1.75rem) + env(safe-area-inset-bottom, 0px))',
        insetInlineStart:
          'calc(clamp(1.25rem, 0.8rem + 1vw, 1.75rem) + env(safe-area-inset-inline-start, 0px))',
        width: 'clamp(2.75rem, 2.4rem + 1.1vw, 3.25rem)',
        height: 'clamp(2.75rem, 2.4rem + 1.1vw, 3.25rem)',
      }}
    >
      <img
        src="/assets/icons/whatsapp_painted_logo.webp"
        alt=""
        className="h-full w-full object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.32)]"
      />
    </a>
  );
}
