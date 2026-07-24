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
}

const VENUE: LocalizedText = {
  en: 'Yad Harutzim 16, Jerusalem',
  he: 'יד חרוצים 16, ירושלים',
};

export const concerts: Concert[] = [
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
