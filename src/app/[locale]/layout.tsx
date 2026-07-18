import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Arimo, Cormorant_Garamond, DM_Sans, Heebo, Rubik } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import Hero from '@/components/layout/Hero';
import { GateProvider } from '@/components/layout/GateContext';
import '../globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  variable: '--font-heebo',
  display: 'swap',
});

const rubik = Rubik({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500'],
  variable: '--font-rubik',
  display: 'swap',
});

const arimo = Arimo({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-arimo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Trio Piano Workshop | Jerusalem',
  description:
    'Expert piano restoration and premium piano sales in Jerusalem, Israel. We import the finest pianos from Japan.',
  keywords: ['piano', 'restoration', 'Jerusalem', 'Israel', 'פסנתר', 'שיקום', 'ירושלים'],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === 'he' ? 'rtl' : 'ltr'}
      className={`${cormorant.variable} ${dmSans.variable} ${heebo.variable} ${rubik.variable} ${arimo.variable}`}
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          <GateProvider>
            <Navbar />
            <main>{children}</main>
            <WhatsAppButton />
            <Hero />
          </GateProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
