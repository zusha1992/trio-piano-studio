export type PianoType = 'grand' | 'baby-grand' | 'upright';
export type PianoCondition = 'restored' | 'imported' | 'new';

export interface Piano {
  id: string;
  brand: string;
  model: string;
  type: PianoType;
  condition: PianoCondition;
  year?: number;
  price: number | 'contact';
  description: { en: string; he: string };
  images: string[];
  featured: boolean;
  specs?: { en: string; he: string }[];
}

export const pianos: Piano[] = [
  {
    id: 'yamaha-u3-1985',
    brand: 'Yamaha',
    model: 'U3',
    type: 'upright',
    condition: 'restored',
    year: 1985,
    price: 28000,
    description: {
      en: 'One of the most celebrated upright pianos ever made. This U3 has been fully restored: new strings, regulation, and a rich concert voicing. A benchmark instrument at an exceptional price.',
      he: 'אחד מפסנתרי הקיר המוערכים ביותר שנוצרו. ה-U3 הזה שוקם לחלוטין: מיתרים חדשים, כוונון מנגנון ועיצוב צליל עשיר. כלי מדד במחיר יוצא דופן.',
    },
    images: [],
    featured: true,
    specs: [
      { en: 'Height: 131 cm', he: 'גובה: 131 ס"מ' },
      { en: 'Width: 153 cm', he: 'רוחב: 153 ס"מ' },
      { en: 'Weight: 247 kg', he: 'משקל: 247 ק"ג' },
      { en: 'Keys: 88', he: 'מקשים: 88' },
    ],
  },
  {
    id: 'kawai-k3-1990',
    brand: 'Kawai',
    model: 'K-3',
    type: 'upright',
    condition: 'imported',
    year: 1990,
    price: 22000,
    description: {
      en: 'Imported directly from Japan in exceptional condition. The Kawai K-3 is beloved for its even tone and responsive action. Minimal wear, tuned and ready to play.',
      he: 'מיובא ישירות מיפן במצב יוצא דופן. קוואי K-3 אהוב בזכות צלילו האחיד ומנגנונו הרגיש. בלאי מינימלי, מכוון ומוכן לנגינה.',
    },
    images: [],
    featured: true,
    specs: [
      { en: 'Height: 122 cm', he: 'גובה: 122 ס"מ' },
      { en: 'Width: 149 cm', he: 'רוחב: 149 ס"מ' },
      { en: 'Weight: 220 kg', he: 'משקל: 220 ק"ג' },
      { en: 'Keys: 88', he: 'מקשים: 88' },
    ],
  },
  {
    id: 'yamaha-g2-1978',
    brand: 'Yamaha',
    model: 'G2',
    type: 'baby-grand',
    condition: 'restored',
    year: 1978,
    price: 'contact',
    description: {
      en: 'A stunning Yamaha baby grand from the golden era of Japanese piano making. Fully restored over 6 months — soundboard, strings, action, and cabinet. A rare find.',
      he: 'גרנד קטן מרהיב של יאמהה מתור הזהב של ייצור פסנתרים יפני. שוקם לחלוטין במשך 6 חודשים — לוח קול, מיתרים, מנגנון וארון. מציאה נדירה.',
    },
    images: [],
    featured: true,
    specs: [
      { en: 'Length: 170 cm', he: 'אורך: 170 ס"מ' },
      { en: 'Width: 149 cm', he: 'רוחב: 149 ס"מ' },
      { en: 'Weight: 280 kg', he: 'משקל: 280 ק"ג' },
      { en: 'Keys: 88', he: 'מקשים: 88' },
    ],
  },
  {
    id: 'kawai-rx2-2001',
    brand: 'Kawai',
    model: 'RX-2',
    type: 'baby-grand',
    condition: 'imported',
    year: 2001,
    price: 45000,
    description: {
      en: 'The Kawai RX-2 is a professional-grade baby grand renowned for its ABS Styran action and brilliant tone. Sourced from a private collection in Osaka.',
      he: 'קוואי RX-2 הוא גרנד קטן ברמה מקצועית, מוכר בזכות מנגנון ABS Styran והצליל הבריק שלו. הגיע מאוסף פרטי באוסקה.',
    },
    images: [],
    featured: false,
    specs: [
      { en: 'Length: 180 cm', he: 'אורך: 180 ס"מ' },
      { en: 'Width: 149 cm', he: 'רוחב: 149 ס"מ' },
      { en: 'Weight: 295 kg', he: 'משקל: 295 ק"ג' },
      { en: 'Keys: 88', he: 'מקשים: 88' },
    ],
  },
  {
    id: 'yamaha-u1-1995',
    brand: 'Yamaha',
    model: 'U1',
    type: 'upright',
    condition: 'imported',
    year: 1995,
    price: 18500,
    description: {
      en: 'The Yamaha U1 is the world\'s best-selling upright piano — and for good reason. This example from Japan is in excellent original condition, requiring only tuning.',
      he: 'יאמהה U1 הוא פסנתר הקיר הנמכר ביותר בעולם — ובצדק. הדגם הזה מיפן נמצא במצב מקורי מעולה ודורש רק כיוון.',
    },
    images: [],
    featured: false,
    specs: [
      { en: 'Height: 121 cm', he: 'גובה: 121 ס"מ' },
      { en: 'Width: 152 cm', he: 'רוחב: 152 ס"מ' },
      { en: 'Weight: 210 kg', he: 'משקל: 210 ק"ג' },
      { en: 'Keys: 88', he: 'מקשים: 88' },
    ],
  },
  {
    id: 'steinway-b-1962',
    brand: 'Steinway & Sons',
    model: 'Model B',
    type: 'grand',
    condition: 'restored',
    year: 1962,
    price: 'contact',
    description: {
      en: 'A magnificent vintage Steinway B, restored to full concert condition. This instrument was professionally rebuilt over 18 months and represents the pinnacle of our restoration work.',
      he: 'שטיינווי B וינטג׳ מרהיב, משוחזר למצב קונצרט מלא. הכלי נבנה מחדש מקצועית במשך 18 חודשים ומייצג את שיא עבודת השיקום שלנו.',
    },
    images: [
      '/images/WhatsApp Image 2026-07-03 at 08.50.47.jpeg',
      '/images/WhatsApp Image 2026-07-03 at 08.50.47 (1).jpeg',
      '/images/WhatsApp Image 2026-07-03 at 08.50.47 (2).jpeg',
      '/images/WhatsApp Image 2026-07-03 at 08.50.47 (3).jpeg',
      '/images/WhatsApp Image 2026-07-03 at 08.50.47 (4).jpeg',
      '/images/WhatsApp Image 2026-07-03 at 08.50.47 (5).jpeg',
    ],
    featured: true,
    specs: [
      { en: 'Length: 211 cm', he: 'אורך: 211 ס"מ' },
      { en: 'Width: 149 cm', he: 'רוחב: 149 ס"מ' },
      { en: 'Weight: 390 kg', he: 'משקל: 390 ק"ג' },
      { en: 'Keys: 88', he: 'מקשים: 88' },
    ],
  },
  {
    id: 'bechstein-grand',
    brand: 'C. Bechstein',
    model: 'Grand',
    type: 'grand',
    condition: 'restored',
    price: 'contact',
    description: {
      en: 'A magnificent C. Bechstein concert grand currently undergoing full restoration in our workshop. One of the most prestigious European piano makers — this instrument will be returned to its full concert glory.',
      he: 'גרנד קונצרט מרהיב של C. Bechstein הנמצא כעת בשיקום מלא בבית המלאכה שלנו. אחד מיצרני הפסנתרים האירופאים היוקרתיים ביותר — כלי זה יוחזר לתפארתו המלאה.',
    },
    images: [
      '/images/WhatsApp Image 2026-07-03 at 08.50.48.jpeg',
      '/images/WhatsApp Image 2026-07-03 at 08.50.48 (1).jpeg',
      '/images/WhatsApp Image 2026-07-03 at 08.50.48 (2).jpeg',
    ],
    featured: true,
  },
  {
    id: 'mason-hamlin-grand',
    brand: 'Mason & Hamlin',
    model: 'Model A',
    type: 'grand',
    condition: 'imported',
    price: 'contact',
    description: {
      en: 'A rare Mason & Hamlin grand — one of America\'s finest piano makers. Known for their patented tension resonator and exceptional tonal richness. A collector\'s instrument in beautiful condition.',
      he: 'גרנד נדיר של Mason & Hamlin — אחד מיצרני הפסנתרים האמריקאיים המשובחים ביותר. ידוע בטכנולוגיית tension resonator הפטנטית ועושר הצליל היוצא דופן שלו. כלי אספנות במצב נפלא.',
    },
    images: [
      '/images/WhatsApp Image 2026-07-03 at 08.50.48 (3).jpeg',
      '/images/WhatsApp Image 2026-07-03 at 08.50.48 (4).jpeg',
      '/images/WhatsApp Image 2026-07-03 at 08.50.48 (5).jpeg',
    ],
    featured: true,
  },
];
