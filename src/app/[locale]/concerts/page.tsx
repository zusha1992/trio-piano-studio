'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import ContactCTA from '@/components/sections/ContactCTA';

export default function ConcertsPage() {
  const locale = useLocale();
  const isHe = locale === 'he';
  const headingFont = isHe ? 'var(--font-heebo), sans-serif' : 'var(--font-cormorant), serif';

  const concertsData = [
    {
      image: '/images/WhatsApp Image 2026-07-03 at 09.09.33.jpeg',
      titleHe: 'עידו חיימוביץ — סולו פסנתר',
      titleEn: 'Ido Heimovitch — Solo Piano',
      dateHe: 'רביעי 21.08 · 20:30',
      dateEn: 'Wed Aug 21 · 20:30',
      performersHe: 'עידו חיימוביץ — פסנתר\nאנסמבל פינאלה',
      performersEn: 'Ido Heimovitch — Piano\nEnsemble Finale',
      programHe: 'תוכנית בקרוב',
      programEn: 'Program to be announced',
      pianoHe: 'שטיינווי & סאנס — משוקם בסדנה',
      pianoEn: 'Steinway & Sons — Restored in our workshop',
    },
    {
      image: '/images/WhatsApp Image 2026-07-03 at 09.09.33 (1).jpeg',
      titleHe: 'אילן בר לביא טריו + אורחים',
      titleEn: 'Ilan Bar Leviya Trio + Guests',
      dateHe: 'רביעי 31.07 · 20:30 · בן סירא 3',
      dateEn: 'Wed Jul 31 · 20:30 · Ben Sira 3',
      performersHe: 'אילן בר לביא — פסנתר\nאסף דהן · עוז יחיאלי — אורחים',
      performersEn: 'Ilan Bar Leviya — Piano\nAsaf Dahan · Oz Yichieli — Guests',
      programHe: 'תוכנית בקרוב',
      programEn: 'Program to be announced',
      pianoHe: 'גרנד משוקם בסדנת טריו',
      pianoEn: 'Restored Grand — Trio Workshop',
    },
    {
      image: '/images/WhatsApp Image 2026-07-03 at 09.09.33 (2).jpeg',
      titleHe: 'Rosa Salamon feat. Peskoffs',
      titleEn: 'Rosa Salamon feat. Peskoffs',
      dateHe: 'רביעי 24.07 · 20:00 · בן סירא 3',
      dateEn: 'Wed Jul 24 · 20:00 · Ben Sira 3',
      performersHe: 'רוזה סלמון — שירה\nאנסמבל פסקופס',
      performersEn: 'Rosa Salamon — Vocals\nThe Peskoffs Ensemble',
      programHe: 'ג\'אז ומוזיקה עולמית',
      programEn: 'Jazz & World Music',
      pianoHe: 'גרנד משוקם בסדנת טריו',
      pianoEn: 'Restored Grand — Trio Workshop',
    },
    {
      image: '/images/WhatsApp Image 2026-07-03 at 09.09.33 (3).jpeg',
      titleHe: 'רועי בן יוסף טריו',
      titleEn: 'Roei Ben Yosef Trio',
      dateHe: 'רביעי 17.07 · 20:30 · בן סירא 3',
      dateEn: 'Wed Jul 17 · 20:30 · Ben Sira 3',
      performersHe: 'רועי בן יוסף — פסנתר\nאלון ביר · גדי שפר',
      performersEn: 'Roei Ben Yosef — Piano\nAlon Bir · Gadi Shafar',
      programHe: 'ג\'אז מקורי',
      programEn: 'Original Jazz',
      pianoHe: 'גרנד משוקם בסדנת טריו',
      pianoEn: 'Restored Grand — Trio Workshop',
    },
    {
      image: '/images/WhatsApp Image 2026-07-03 at 09.09.33 (4).jpeg',
      titleHe: 'רביעיית קסקט',
      titleEn: 'Kasket Quartet',
      dateHe: 'רביעי 14.05 · 20:30 · בן סירא 3',
      dateEn: 'Wed May 14 · 20:30 · Ben Sira 3',
      performersHe: 'עמרי בר אל גיורא — גיטרה\nעוז יחיאלי — קונטרבס\nשי גולן — סקסופון\nדוד דגמי — תופים',
      performersEn: 'Omri Bar El Giora — Guitar\nOz Yichieli — Bass\nShai Golan — Saxophone\nDavid Dagmi — Drums',
      programHe: 'ג\'אז ומוזיקה עכשווית',
      programEn: 'Jazz & Contemporary Music',
      pianoHe: 'גרנד משוקם בסדנת טריו',
      pianoEn: 'Restored Grand — Trio Workshop',
    },
    {
      image: '/images/WhatsApp Image 2026-07-03 at 09.09.34.jpeg',
      titleHe: 'שלישיית טל גמליאלי',
      titleEn: 'Tal Gamlieli Trio',
      dateHe: 'רביעי 05.03 · 20:30 · בן סירא 3',
      dateEn: 'Wed Mar 5 · 20:30 · Ben Sira 3',
      performersHe: 'טל גמליאלי — צ\'לו\nמילסון מיכאלי — פסנתר\nאביב בונה — תופים',
      performersEn: 'Tal Gamlieli — Cello\nMilson Michaeli — Piano\nAviv Bona — Drums',
      programHe: 'מוזיקה חדשה ואימפרוביזציה',
      programEn: 'New Music & Improvisation',
      pianoHe: 'גרנד משוקם בסדנת טריו',
      pianoEn: 'Restored Grand — Trio Workshop',
    },
    {
      image: '/images/WhatsApp Image 2026-07-03 at 09.09.34 (1).jpeg',
      titleHe: 'ערב אופרה',
      titleEn: 'Opera Evening',
      dateHe: 'רביעי 22.01 · 20:30 · בן סירא 3',
      dateEn: 'Wed Jan 22 · 20:30 · Ben Sira 3',
      performersHe: 'דרור שביד — פסנתר\nדניאל צין — כינור\nמוסיקאים מהאקדמיה',
      performersEn: 'Dror Shavid — Piano\nDaniel Zin — Violin\nMusicians from the Academy',
      programHe: 'אריות ומנגינות מהאופרה הגדולה',
      programEn: 'Arias & melodies from the great opera repertoire',
      pianoHe: 'שטיינווי & סאנס — משוקם בסדנה',
      pianoEn: 'Steinway & Sons — Restored in our workshop',
    },
  ];

  const WaIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end bg-[var(--c-bg)] pt-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.04) 0%, transparent 60%)',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-16 w-full" dir={isHe ? 'rtl' : 'ltr'}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] tracking-[0.4em] uppercase text-[var(--c-accent)] mb-4"
          >
            {isHe ? 'תרבות ואמנות' : 'Culture & Art'}
          </motion.p>
          <div className="gold-divider" />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl lg:text-6xl font-light text-[var(--c-text)] leading-tight mb-4"
            style={{ fontFamily: headingFont }}
          >
            {isHe ? 'קונצרטים' : 'Concerts'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base text-[var(--c-muted)] max-w-xl leading-relaxed"
          >
            {isHe
              ? 'ערבי מוזיקה אינטימיים על גרנדים משוקמים בסדנה. עם אחד הנגנים בעולם'
              : 'Intimate music evenings performed on restored grand pianos — up close with world-class musicians.'}
          </motion.p>
        </div>
      </section>

      {/* Concert grid */}
      <section className="section-padding bg-[var(--c-bg)] border-t border-[var(--c-card)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {concertsData.map((concert, i) => {
              const waMsg = encodeURIComponent(
                isHe
                  ? `שלום, אני מעוניין/ת לקבל פרטים על הקונצרט "${concert.titleHe}"`
                  : `Hello, I'd like details about the concert "${concert.titleEn}"`
              );
              const waHref = `https://wa.me/972543337341?text=${waMsg}`;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="group relative overflow-hidden"
                >
                  {/* Poster */}
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={concert.image}
                      alt={isHe ? concert.titleHe : concert.titleEn}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 flex flex-col justify-end translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.96) 60%, rgba(0,0,0,0.5) 100%)' }}
                      dir={isHe ? 'rtl' : 'ltr'}
                    >
                      <div className="p-6 lg:p-8 flex flex-col gap-4">
                        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--c-accent)]">
                          {isHe ? concert.dateHe : concert.dateEn}
                        </p>
                        <h3 className="text-xl lg:text-2xl font-light text-white leading-snug"
                          style={{ fontFamily: headingFont }}>
                          {isHe ? concert.titleHe : concert.titleEn}
                        </h3>
                        <div>
                          <p className="text-[9px] tracking-[0.3em] uppercase text-white/40 mb-1.5">
                            {isHe ? 'נגנים' : 'Performers'}
                          </p>
                          <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">
                            {isHe ? concert.performersHe : concert.performersEn}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] tracking-[0.3em] uppercase text-white/40 mb-1.5">
                            {isHe ? 'תוכנית' : 'Program'}
                          </p>
                          <p className="text-sm text-white/80 leading-relaxed">
                            {isHe ? concert.programHe : concert.programEn}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] tracking-[0.3em] uppercase text-white/40 mb-1.5">
                            {isHe ? 'על הפסנתר' : 'Piano'}
                          </p>
                          <p className="text-sm text-white/80">
                            {isHe ? concert.pianoHe : concert.pianoEn}
                          </p>
                        </div>
                        <a
                          href={waHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 flex items-center gap-2 self-start px-5 py-2.5 text-white text-xs tracking-[0.15em] uppercase transition-colors duration-200"
                          style={{ backgroundColor: '#25D366' }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#20BD5C')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#25D366')}
                        >
                          <WaIcon />
                          {isHe ? 'רוצה להגיע' : 'I want to attend'}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Mobile — always-visible button below poster */}
                  <div className="md:hidden bg-[var(--c-card)] border border-[var(--c-border)] border-t-0 p-4 flex items-center justify-between"
                    dir={isHe ? 'rtl' : 'ltr'}>
                    <div>
                      <p className="text-[9px] tracking-[0.2em] uppercase text-[var(--c-accent)] mb-0.5">
                        {isHe ? concert.dateHe : concert.dateEn}
                      </p>
                      <p className="text-sm font-light text-[var(--c-text)]">
                        {isHe ? concert.titleHe : concert.titleEn}
                      </p>
                    </div>
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-[#25D366] text-white text-[10px] tracking-[0.1em] uppercase px-3 py-2 shrink-0"
                    >
                      <WaIcon />
                      {isHe ? 'להגיע' : 'Attend'}
                    </a>
                  </div>
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
