'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { pianos } from '@/data/pianos';
import PianoCard from '@/components/ui/PianoCard';

export default function HomePage() {
  const locale = useLocale();
  const isHe = locale === 'he';
  const headingFont = isHe ? 'var(--font-heebo), sans-serif' : 'var(--font-cormorant), serif';

  const featuredPianos = pianos.filter((p) => p.featured);

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

  const workshopWork = [
    {
      en: 'String Replacement',
      he: 'החלפת מיתרים',
      descEn: 'Old or broken strings are removed and re-strung by hand — restoring full tonal range and proper tension.',
      descHe: 'מיתרים ישנים או שבורים מוסרים ומותחים מחדש ביד — להחזרת מלוא הטווח הצלילי.',
    },
    {
      en: 'Soundboard Repair',
      he: 'תיקון לוח הקול',
      descEn: "Cracks in the soundboard are sealed and reinforced — the board is the heart of the piano's resonance.",
      descHe: 'סדקים בלוח הקול נסתמים ומחוזקים — לוח הקול הוא לב הרזוננס של הפסנתר.',
    },
    {
      en: 'Action Regulation',
      he: 'כיוון מנגנון הניגון',
      descEn: 'Every hammer, key, and wippen is adjusted so the touch feels even, responsive, and precise.',
      descHe: 'כל פטיש, מפתח וחלק מכני מכוון כך שהמגע יהיה אחיד, רגיש ומדויק.',
      image: '/images/IMG_20260513_133016.jpg',
    },
    {
      en: 'Hammer Voicing',
      he: 'עיצוב קול הפטישים',
      descEn: 'Hammer felt is needled and shaped to balance brightness, warmth, and dynamic range across all registers.',
      descHe: 'לבד הפטישים מעוצב ומחוטט לאיזון בין בהירות, חום וטווח דינמי בכל הרגיסטרים.',
    },
    {
      en: 'Cabinet Refinishing',
      he: 'חידוש הארגז',
      descEn: 'The piano case is stripped, sanded, and re-lacquered — bringing back its original finish and shine.',
      descHe: 'ארגז הפסנתר נשלף, משוייף ומלוכסן מחדש — להחזרת הגימור והברק המקוריים.',
      image: '/images/IMG_20260512_121732.jpg',
    },
    {
      en: 'Pedal & Damper Service',
      he: 'שירות דוושות ובולמי רעד',
      descEn: 'Pedal mechanisms are restored and damper felts replaced for clean, quiet, reliable sustain.',
      descHe: 'מנגנון הדוושות משוקם ולבד בולמי הרעד מוחלף לסוסטיין נקי, שקט ואמין.',
    },
  ];

  const heroNav = [
    {
      en: 'Workshop',
      he: 'בית מלאכה',
      descEn: 'Restoration & Craft',
      descHe: 'שיקום ומלאכה',
      href: '#services',
    },
    {
      en: 'Piano Store',
      he: 'חנות פסנתרים',
      descEn: 'Our Piano Selection',
      descHe: 'המבחר שלנו',
      href: '#store',
    },
    {
      en: 'Concerts',
      he: 'קונצרטים',
      descEn: 'Culture & Events',
      descHe: 'תרבות ואירועים',
      href: '#concerts',
    },
  ];

  return (
    <main>

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section
        id="home"
        className="relative min-h-screen flex flex-col items-center justify-center bg-[var(--c-bg)] overflow-hidden"
      >
        {/* Subtle grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          }}
        />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src="/images/logo.png"
            alt="Trio Piano Workshop"
            width={2199}
            height={734}
            style={{ height: '110px', width: 'auto', filter: 'var(--logo-filter)' }}
            priority
          />
        </motion.div>

        {/* Three floating nav words */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex items-start gap-10 lg:gap-16"
        >
          {heroNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group flex flex-col items-center gap-2 text-center"
            >
              <span
                className="text-xl lg:text-3xl font-light tracking-[0.25em] uppercase text-[var(--c-muted)] group-hover:text-[var(--c-text)] transition-all duration-700 group-hover:scale-110 inline-block"
                style={{ fontFamily: headingFont }}
              >
                {isHe ? item.he : item.en}
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--c-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                {isHe ? item.descHe : item.descEn}
              </span>
            </a>
          ))}
        </motion.div>
      </section>

      {/* ─── WORKSHOP ─────────────────────────────────────── */}
      <section id="services" className="bg-[var(--c-bg)] border-t border-[var(--c-border)] py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <p className="text-[10px] tracking-[0.5em] uppercase text-[var(--c-accent)] mb-5">
              {isHe ? 'הסדנה' : 'Workshop'}
            </p>
            <h2
              className="text-4xl lg:text-6xl font-light text-[var(--c-text)] leading-tight"
              style={{ fontFamily: headingFont }}
            >
              {isHe ? 'מה אנחנו עושים' : 'The Work We Do'}
            </h2>
          </motion.div>

          {/* 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--c-border)]">
            {workshopWork.map((item, i) => (
              <motion.div
                key={item.en}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-[var(--c-bg)] flex flex-col"
              >
                {/* Image */}
                <div className="w-full aspect-[4/3] bg-[var(--c-bg-alt)] relative overflow-hidden border-b border-[var(--c-border)]">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.en}
                      fill
                      className="object-cover opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[9px] tracking-[0.4em] uppercase text-[var(--c-ghost)]">
                        {isHe ? 'תמונה בקרוב' : 'Photo coming soon'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="p-8 lg:p-10 flex-1 flex flex-col">
                  <h3
                    className="text-xl font-light text-[var(--c-text)] mb-4"
                    style={{ fontFamily: headingFont }}
                  >
                    {isHe ? item.he : item.en}
                  </h3>
                  <p className="text-sm text-[var(--c-muted)] leading-relaxed flex-1">
                    {isHe ? item.descHe : item.descEn}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── PIANO STORE ──────────────────────────────────── */}
      <section id="store" className="bg-[var(--c-bg-alt)] border-t border-[var(--c-border)] py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--c-accent)] mb-4">
                {isHe ? 'האוסף שלנו' : 'Our Collection'}
              </p>
              <h2
                className="text-4xl lg:text-5xl font-light text-[var(--c-text)]"
                style={{ fontFamily: headingFont }}
              >
                {isHe ? 'חנות פסנתרים' : 'Piano Store'}
              </h2>
            </div>
            <Link
              href={`/${locale}/store`}
              className="text-[11px] tracking-[0.25em] uppercase text-[var(--c-dim)] hover:text-[var(--c-text)] transition-colors border-b border-[var(--c-dim)] hover:border-[var(--c-text)] pb-0.5 self-start md:self-auto"
            >
              {isHe ? 'כל הפסנתרים ←' : '← All Pianos'}
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPianos.map((piano, i) => (
              <motion.div
                key={piano.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <PianoCard piano={piano} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONCERTS ─────────────────────────────────────── */}
      <section
        id="concerts"
        className="bg-[var(--c-bg)] border-t border-[var(--c-border)] py-24 lg:py-32"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
            dir={isHe ? 'rtl' : 'ltr'}
          >
            <p className="text-[10px] tracking-[0.5em] uppercase text-[var(--c-accent)] mb-6">
              {isHe ? 'תרבות ואמנות' : 'Culture & Art'}
            </p>
            <h2
              className="text-5xl lg:text-6xl font-light text-[var(--c-text)] mb-4 leading-tight"
              style={{ fontFamily: headingFont }}
            >
              {isHe ? 'קונצרטים' : 'Concerts'}
            </h2>
            <p className="text-sm text-[var(--c-muted)] max-w-lg leading-relaxed">
              {isHe
                ? 'ערבי מוזיקה אינטימיים על גרנדים משוקמים בסדנה. עם אחד הנגנים בעולם'
                : 'Intimate music evenings performed on restored grand pianos — up close with world-class musicians.'}
            </p>
          </motion.div>

          {/* Concert grid — 2 large columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {concertsData.map((concert, i) => {
              const waMsg = encodeURIComponent(
                isHe
                  ? `שלום, אני מעוניין/ת לקבל פרטים על הקונצרט "${concert.titleHe}"`
                  : `Hello, I'd like details about the concert "${concert.titleEn}"`
              );
              const waHref = `https://wa.me/972543337341?text=${waMsg}`;
              const WaIcon = () => (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              );
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="group relative overflow-hidden"
                >
                  {/* Poster — large square */}
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={concert.image}
                      alt={isHe ? concert.titleHe : concert.titleEn}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    {/* Hover overlay — slides up from bottom */}
                    <div
                      className="absolute inset-0 flex flex-col justify-end translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.96) 60%, rgba(0,0,0,0.5) 100%)' }}
                      dir={isHe ? 'rtl' : 'ltr'}
                    >
                      <div className="p-6 lg:p-8 flex flex-col gap-4">

                        {/* Date */}
                        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--c-accent)]">
                          {isHe ? concert.dateHe : concert.dateEn}
                        </p>

                        {/* Title */}
                        <h3 className="text-xl lg:text-2xl font-light text-white leading-snug"
                          style={{ fontFamily: headingFont }}>
                          {isHe ? concert.titleHe : concert.titleEn}
                        </h3>

                        {/* Performers */}
                        <div>
                          <p className="text-[9px] tracking-[0.3em] uppercase text-white/40 mb-1.5">
                            {isHe ? 'נגנים' : 'Performers'}
                          </p>
                          <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">
                            {isHe ? concert.performersHe : concert.performersEn}
                          </p>
                        </div>

                        {/* Program */}
                        <div>
                          <p className="text-[9px] tracking-[0.3em] uppercase text-white/40 mb-1.5">
                            {isHe ? 'תוכנית' : 'Program'}
                          </p>
                          <p className="text-sm text-white/80 leading-relaxed">
                            {isHe ? concert.programHe : concert.programEn}
                          </p>
                        </div>

                        {/* Piano */}
                        <div>
                          <p className="text-[9px] tracking-[0.3em] uppercase text-white/40 mb-1.5">
                            {isHe ? 'על הפסנתר' : 'Piano'}
                          </p>
                          <p className="text-sm text-white/80">
                            {isHe ? concert.pianoHe : concert.pianoEn}
                          </p>
                        </div>

                        {/* WhatsApp button */}
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

      {/* ─── CONTACT ──────────────────────────────────────── */}
      <section
        id="contact"
        className="bg-[var(--c-bg-alt)] border-t border-[var(--c-border)] py-24 lg:py-32"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--c-accent)] mb-6">
                {isHe ? 'צור קשר' : 'Contact'}
              </p>
              <h2
                className="text-4xl lg:text-5xl font-light text-[var(--c-text)] mb-10 leading-tight"
                style={{ fontFamily: headingFont }}
              >
                {isHe ? 'בואו לבקר' : 'Come Visit'}
              </h2>
              <div className="space-y-6 text-sm text-[var(--c-dim)]">
                <p>{isHe ? 'יד החרוצים 16, ירושלים' : 'Yad Harutzim 16, Jerusalem'}</p>
                <p>{isHe ? 'א׳–ה׳: 10:00–18:00 | ו׳: 10:00–13:00' : 'Sun–Thu: 10:00–18:00 | Fri: 10:00–13:00'}</p>
                <a href="tel:+972543337341" className="block hover:text-[var(--c-text)] transition-colors">+972-54-333-7341</a>
                <a href="mailto:trio.piano.studio@gmail.com" className="block hover:text-[var(--c-text)] transition-colors">trio.piano.studio@gmail.com</a>
                <a href="https://instagram.com/trio.piano.studio" target="_blank" rel="noopener noreferrer" className="block hover:text-[var(--c-text)] transition-colors">@trio.piano.studio</a>
                <a href="https://www.facebook.com/profile.php?id=61590350696510" target="_blank" rel="noopener noreferrer" className="block hover:text-[var(--c-text)] transition-colors">Facebook</a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col gap-4"
            >
              <Link
                href={`/${locale}/contact`}
                className="group flex items-center justify-between border border-[var(--c-border)] hover:border-[var(--c-accent)] px-8 py-6 transition-all duration-300"
              >
                <span className="text-sm font-light text-[var(--c-text)] tracking-wide">
                  {isHe ? 'שלח הודעה' : 'Send a Message'}
                </span>
                <span className="text-[var(--c-accent)] group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
              <a
                href="https://wa.me/972543337341"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between border border-[var(--c-border)] hover:border-[var(--c-accent)] px-8 py-6 transition-all duration-300"
              >
                <span className="text-sm font-light text-[var(--c-text)] tracking-wide">
                  {isHe ? 'וואטסאפ' : 'WhatsApp'}
                </span>
                <span className="text-[var(--c-accent)] group-hover:translate-x-1 transition-transform duration-300">→</span>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────── */}
      <footer className="bg-[var(--c-bg-alt)] border-t border-[var(--c-border)] py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] tracking-[0.2em] text-[var(--c-ghost)]">
            © {new Date().getFullYear()} Trio Piano Workshop
          </p>
          <p className="text-[10px] tracking-[0.2em] text-[var(--c-ghost)]">
            {isHe ? 'ירושלים, ישראל' : 'Jerusalem, Israel'}
          </p>
        </div>
      </footer>

    </main>
  );
}
