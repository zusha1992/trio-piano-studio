import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { SITE_URL, localBusinessJsonLd } from '@/lib/seo';
import { Arimo, Cairo, Cormorant_Garamond, DM_Sans, EB_Garamond, Heebo, Rubik } from 'next/font/google';
import { dirOf } from '@/lib/i18n';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/layout/Hero';
import { GateProvider } from '@/components/layout/GateContext';
import { ThemeProvider } from '@/components/layout/ThemeContext';
import AdminProvider from '@/components/admin/AdminProvider';
import AnalyticsTracker from '@/components/admin/AnalyticsTracker';
import { AccessibilityProvider } from '@/components/a11y/AccessibilityContext';
import { AccessibilityPanel } from '@/components/a11y/AccessibilityMenu';
import SkipLink from '@/components/a11y/SkipLink';
import '../globals.css';

// Set the theme class before paint so a dark preference doesn't flash light.
// Default: dark on mobile (< lg), light on desktop — an explicit stored choice
// always wins. Kept in sync with the initial read in ThemeProvider.
const THEME_INIT = `(function(){try{var t=localStorage.getItem('heroTheme');var m=window.matchMedia('(max-width:1023px)').matches;if(t==='dark'||(!t&&m)){document.documentElement.classList.add('dark');}}catch(e){}})();`;

// Mirrors apply() in AccessibilityContext, but runs before first paint so a
// user who enlarged the text doesn't see the small version flash first.
const A11Y_INIT = `(function(){try{var s=JSON.parse(localStorage.getItem('a11ySettings')||'{}');var r=document.documentElement;if(s.fontScale&&s.fontScale!==1){r.style.setProperty('--a11y-font',String(s.fontScale));r.setAttribute('data-a11y-scaled','');}if(s.contrast&&s.contrast!=='off')r.setAttribute('data-a11y-contrast',s.contrast);if(s.grayscale)r.setAttribute('data-a11y-grayscale','');if(s.highlightLinks)r.setAttribute('data-a11y-links','');if(s.readableFont)r.setAttribute('data-a11y-font-readable','');if(s.stopAnimations)r.setAttribute('data-a11y-no-motion','');if(s.bigCursor)r.setAttribute('data-a11y-cursor','');}catch(e){}})();`;

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

/**
 * Site-wide metadata. Each page supplies its own title and description (see the
 * `generateMetadata` in every page.tsx); this fills in what they share — the
 * "| Trio Piano Studio" suffix, the base URL that makes relative Open Graph
 * images absolute, and the icons.
 */
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'meta' });
  const siteName = t('site_name');

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      template: `%s | ${siteName}`,
      default: `${siteName} | ${t('home_title')}`,
    },
    description: t('home_description'),
    applicationName: siteName,
    // Use the single circular logo (icon.png) everywhere — favicon, apple-touch
    // icon, and the thumbnail shown in shared-link previews on iOS/WhatsApp.
    icons: {
      icon: '/icon.png',
      shortcut: '/icon.png',
      apple: '/icon.png',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'meta' });
  const jsonLd = localBusinessJsonLd({
    locale,
    name: t('site_name'),
    description: t('home_description'),
  });

  return (
    <html
      lang={locale}
      dir={dirOf(locale)}
      className={`${cormorant.variable} ${dmSans.variable} ${heebo.variable} ${rubik.variable} ${cairo.variable} ${arimo.variable} ${ebGaramond.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Runs before hydration/paint so a dark preference doesn't flash light.
            Kept in <body> (not a manual <head>) so it doesn't interfere with
            Next's automatic next/font stylesheet injection. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        {/* Applies saved accessibility preferences before paint, so an enlarged
            or high-contrast page doesn't flash its default styling first. */}
        <script dangerouslySetInnerHTML={{ __html: A11Y_INIT }} />
        <NextIntlClientProvider messages={messages}>
          <AdminProvider>
            <AnalyticsTracker />
            <ThemeProvider>
              <AccessibilityProvider>
                <GateProvider>
                  <SkipLink />
                  <Navbar />
                  <main id="main-content" tabIndex={-1}>
                    {children}
                  </main>
                  <Hero />
                  <AccessibilityPanel />
                </GateProvider>
              </AccessibilityProvider>
            </ThemeProvider>
          </AdminProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
