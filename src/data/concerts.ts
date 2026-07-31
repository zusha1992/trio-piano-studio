// Upcoming concerts (placeholder data).
//
// Kept as a plain array so it can later be replaced by a CMS/DB source. The
// concerts page sorts by `date` ascending (soonest first) and shows the nearest
// poster by default. Posters live in /public/images/Concerts.

export interface LocalizedText {
  en: string;
  he: string;
}

export interface Concert {
  id: string;
  name: LocalizedText;
  poster: string;
  /** ISO date (yyyy-mm-dd), used for sorting and display. */
  date: string;
  /** Start time, e.g. "20:30". */
  time: string;
  venue: LocalizedText;
  /** Ticket price in ILS. */
  price: number;
  /** Short, tempting blurb about the artist and the performance. */
  description?: LocalizedText;
  /** Optional performer list (free text per language). */
  artists?: LocalizedText;
  /** DB id of the poster image (admin edit). */
  posterId?: number;
  /** Draft flag — hidden from the public list when false. */
  published?: boolean;
}

const VENUE: LocalizedText = {
  en: 'Yad Harutzim 16, Jerusalem',
  he: 'יד חרוצים 16, ירושלים',
};

export const concerts: Concert[] = [
  {
    id: 'misha-zartsekel',
    name: { en: 'Michael Zartsekel', he: 'מישה זרצקל' },
    poster: '/images/Concerts/misha-zartsekel.png',
    date: '2026-12-14',
    time: '20:00',
    venue: { en: 'Ben Sira 3, Jerusalem', he: 'בן סירא 3, ירושלים' },
    price: 90,
    description: {
      en: "Michael (Misha) Zartsekel is one of the leading Israeli pianists of his generation, born in Rostov, Russia, and immigrating to Israel on his own at a young age. He began playing at the age of seven and, by ten, had been admitted to Moscow's prestigious Tchaikovsky school for gifted young musicians. He has won a string of international prizes, among them first prize at the Scriabin Competition in Moscow and at the piano competition of the Jerusalem Academy of Music. Zartsekel performs as a soloist with Israel's foremost symphony orchestras and appears frequently in recitals and festivals both in Israel and abroad. In this intimate recital he brings a sweeping classical program — a rare evening of virtuosity and feeling, up close.",
      he: 'מיכאל (מישה) זַרְצֶקֶל הוא מן הפסנתרנים הישראלים המובילים בדורו, יליד רוסטוב שברוסיה שעלה לישראל בגפו בגיל צעיר. את נגינתו החל בגיל שבע, וכבר בגיל עשר התקבל לבית הספר היוקרתי למחוננים על שם צ׳ייקובסקי במוסקבה. הוא זכה בשורה של תחרויות בין-לאומיות, ובהן הפרס הראשון בתחרות על שם סקריאבין במוסקבה ובתחרות הפסנתר של האקדמיה למוסיקה בירושלים. זרצקל מופיע כסולן עם התזמורות הסימפוניות המובילות בישראל ומרבה לנגן ברסיטלים ובפסטיבלים בארץ ובעולם. ברסיטל אינטימי זה יביא זרצקל תוכנית קלאסית סוחפת — ערב נדיר של וירטואוזיות ורגש, במרחק נגיעה.',
    },
  },
  {
    id: 'aviv-peck',
    name: { en: 'Aviv Peck', he: 'אביב פק' },
    poster: '/images/Concerts/aviv-peck.jpg',
    date: '2026-12-17',
    time: '20:30',
    venue: VENUE,
    price: 90,
  },
  {
    id: 'lian-hanon',
    name: { en: 'Lian Hanon', he: 'ליאן חנון' },
    poster: '/images/Concerts/lian-hanon.jpg',
    date: '2027-02-18',
    time: '20:30',
    venue: VENUE,
    price: 90,
  },
  {
    id: 'hen-levi',
    name: { en: 'Hen Levi', he: 'חן לוי' },
    poster: '/images/Concerts/hen-levi.jpg',
    date: '2027-05-15',
    time: '20:30',
    venue: VENUE,
    price: 100,
  },
  {
    id: 'bar-geva',
    name: { en: 'Bar Geva', he: 'בר גבע' },
    poster: '/images/Concerts/bar-geva.jpg',
    date: '2027-06-12',
    time: '20:30',
    venue: VENUE,
    price: 90,
  },
].sort((a, b) => a.date.localeCompare(b.date));

// Photos from past concerts, used for the browsing gallery/carousel.
export const concertGallery = [
  '/images/Concerts/gallery-1.jpg',
  '/images/Concerts/gallery-2.jpg',
  '/images/Concerts/gallery-3.jpg',
  '/images/Concerts/gallery-4.jpg',
  '/images/Concerts/gallery-5.jpg',
  '/images/Concerts/gallery-6.jpg',
  '/images/Concerts/gallery-7.jpg',
];
