import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Arimo, Cairo, Cormorant_Garamond, DM_Sans, EB_Garamond, Heebo, Rubik } from 'next/font/google';
import { dirOf } from '@/lib/i18n';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/layout/Hero';
import { GateProvider } from '@/components/layout/GateContext';
import { ThemeProvider } from '@/components/layout/ThemeContext';
import AdminProvider from '@/components/admin/AdminProvider';
import AnalyticsTracker from '@/components/admin/AnalyticsTracker';
import '../globals.css';

// Set the theme class before paint so a dark preference doesn't flash light.
// Default: dark on mobile (< lg), light on desktop — an explicit stored choice
// always wins. Kept in sync with the initial read in ThemeProvider.
const THEME_INIT = `(function(){try{var t=localStorage.getItem('heroTheme');var m=window.matchMedia('(max-width:1023px)').matches;if(t==='dark'||(!t&&m)){document.documentElement.classList.add('dark');}}catch(e){}})();`;

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
  subsets: ['hebrew', 'latin', 'cyrillic'],
  weight: ['300', '400', '500'],
  variable: '--font-rubik',
  display: 'swap',
});

// Arabic display/body font — geometric, pairs with Rubik.
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cairo',
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
  // Use the single circular logo (icon.png) everywhere — favicon, apple-touch
  // icon, and the thumbnail shown in shared-link previews on iOS/WhatsApp.
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
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
      dir={dirOf(locale)}
      className={`${cormorant.variable} ${dmSans.variable} ${heebo.variable} ${rubik.variable} ${cairo.variable} ${arimo.variable} ${ebGaramond.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Runs before hydration/paint so a dark preference doesn't flash light.
            Kept in <body> (not a manual <head>) so it doesn't interfere with
            Next's automatic next/font stylesheet injection. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <NextIntlClientProvider messages={messages}>
          <AdminProvider>
            <AnalyticsTracker />
            <ThemeProvider>
              <GateProvider>
                <Navbar />
                <main>{children}</main>
                <Hero />
              </GateProvider>
            </ThemeProvider>
          </AdminProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
