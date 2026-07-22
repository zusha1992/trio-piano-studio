import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Arimo, Cormorant_Garamond, DM_Sans, EB_Garamond, Heebo, Rubik } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/layout/Hero';
import { GateProvider } from '@/components/layout/GateContext';
import { ThemeProvider } from '@/components/layout/ThemeContext';
import '../globals.css';

// Set the theme class before paint so a dark preference doesn't flash light.
const THEME_INIT = `(function(){try{if(localStorage.getItem('heroTheme')==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

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

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-eb-garamond',
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
      className={`${cormorant.variable} ${dmSans.variable} ${heebo.variable} ${rubik.variable} ${arimo.variable} ${ebGaramond.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Runs before hydration/paint so a dark preference doesn't flash light.
            Kept in <body> (not a manual <head>) so it doesn't interfere with
            Next's automatic next/font stylesheet injection. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <GateProvider>
              <Navbar />
              <main>{children}</main>
              <Hero />
            </GateProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
