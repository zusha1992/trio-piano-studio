'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export const ADS_ID = 'AW-18260779557';
/** Primary lead conversion — form submit, WhatsApp, or phone. */
export const FORM_CONVERSION = 'AW-18260779557/NSdRCL7QzuEcEKXEtYNE';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function reportFormConversion() {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', 'conversion', { send_to: FORM_CONVERSION });
}

function isLeadClick(href: string): boolean {
  const h = href.toLowerCase();
  return (
    h.includes('wa.me') ||
    h.includes('whatsapp') ||
    h.includes('api.whatsapp') ||
    h.startsWith('tel:')
  );
}

export default function GoogleAdsTag() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest('a');
      const href = anchor?.getAttribute('href');
      if (!href || !isLeadClick(href)) return;
      reportFormConversion();
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-gtag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${ADS_ID}');
        `}
      </Script>
    </>
  );
}
