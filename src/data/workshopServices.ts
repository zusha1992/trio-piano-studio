// Workshop services.
//
// Bilingual data source for the workshop page. Each category has an image, a
// general description and a list of the fixes we offer. Kept as a plain, typed
// array so it can later be replaced by a CMS / database source without touching
// the page layout. To add a category or service, append an object with a
// unique id. The category `id` also serves as the slug for its future detail
// page.

export interface LocalizedText {
  en: string;
  he: string;
}

export interface WorkshopService {
  id: string;
  name: LocalizedText;
  /** One-line description of the fix. */
  description: LocalizedText;
}

export interface WorkshopCategory {
  id: string;
  name: LocalizedText;
  /** General description of the category. */
  description: LocalizedText;
  /** Primary image (tile + gallery fallback). */
  image: string;
  /** Optional extra images for the detail-page gallery/carousel. */
  images?: string[];
  services: WorkshopService[];
}

export const workshopCategories: WorkshopCategory[] = [
  {
    id: 'restoration',
    name: { en: 'Restoration', he: 'רסטורציה' },
    description: {
      en: "Comprehensive restoration of the piano, inside and out, preserving its original character while restoring the quality of its tone and action.",
      he: 'שיקום מקיף של הפסנתר, מבפנים ומבחוץ, תוך שמירה על אופיו המקורי והחזרת איכות הצליל והמנגנון.',
    },
    image: '/images/workshop/restoration.webp',
    images: [
      '/images/workshop/restoration.webp',
      '/images/workshop/regulation.webp',
      '/images/workshop/voicing.webp',
    ],
    services: [
      {
        id: 'bridge-restoration',
        name: { en: 'Bridge Restoration', he: 'תיקון גשרים' },
        description: {
          en: "Repair and restoration of the piano's bridges to improve sound transmission and instrument stability.",
          he: 'תיקון ושיקום גשרי הפסנתר לשיפור העברת הצליל ויציבות הכלי.',
        },
      },
      {
        id: 'soundboard-restoration',
        name: { en: 'Soundboard Restoration', he: 'שיקום לוח תהודה' },
        description: {
          en: 'Repairing cracks and restoring the soundboard to preserve sound quality.',
          he: 'תיקון סדקים ושיקום לוח התהודה לשימור איכות הצליל.',
        },
      },
      {
        id: 'restringing',
        name: { en: 'Restringing', he: 'החלפת מיתרים' },
        description: {
          en: "Complete replacement of the piano's strings to improve tone quality and performance.",
          he: 'החלפה מלאה של מיתרי הפסנתר לשיפור איכות הצליל והביצועים.',
        },
      },
      {
        id: 'pinblock-replacement',
        name: { en: 'Pinblock Replacement', he: 'החלפת לוח ברגי כיוון' },
        description: {
          en: 'Replacing the pinblock to improve tuning stability over time.',
          he: 'החלפת הפינבלוק לשיפור יציבות הכיוון לאורך זמן.',
        },
      },
      {
        id: 'tuning-pin-replacement',
        name: { en: 'Tuning Pin Replacement', he: 'החלפת ברגי כיוון' },
        description: {
          en: 'Replacing the tuning pins to improve string grip and tuning stability.',
          he: 'החלפת ברגי הכיוון לשיפור אחיזת המיתרים ויציבות הכיוון.',
        },
      },
      {
        id: 'hammer-restoration',
        name: { en: 'Hammer Restoration & Replacement', he: 'שיקום והחלפת פטישים' },
        description: {
          en: 'Restoring, shaping or replacing hammers for a balanced, rich tone.',
          he: 'שיקום, עיצוב או החלפת פטישים לקבלת צליל מאוזן ועשיר.',
        },
      },
      {
        id: 'keyboard-restoration',
        name: { en: 'Keyboard Restoration', he: 'תיקוני מקלדת' },
        description: {
          en: 'Replacing key coverings, polishing ivory and restoring the look and feel of the keyboard.',
          he: 'החלפת ציפויי קלידים, פוליש שנהב ושיקום מראה ותחושת הנגינה.',
        },
      },
      {
        id: 'damper-restoration',
        name: { en: 'Damper Restoration', he: 'שיקום מערכת האוטמים' },
        description: {
          en: 'Restoring and regulating the damper system for quiet, precise operation.',
          he: 'שיקום וכיוון מערכת האוטמים לפעולה שקטה ומדויקת.',
        },
      },
      {
        id: 'pedal-restoration',
        name: { en: 'Pedal Restoration', he: 'שיקום מנגנון הדוושות' },
        description: {
          en: 'Repairing and regulating the pedal mechanism to restore smooth, precise operation.',
          he: 'תיקון וכיוון מנגנון הדוושות להחזרת פעולה חלקה ומדויקת.',
        },
      },
      {
        id: 'cabinet-restoration',
        name: { en: 'Cabinet Restoration', he: 'שיקום וגימור גוף הפסנתר' },
        description: {
          en: "Veneer, paint and French-polish work to restore the piano's original appearance.",
          he: 'תיקוני פורניר, צבע ופוליטורה להחזרת מראהו המקורי של הפסנתר.',
        },
      },
    ],
  },
  {
    id: 'tuning',
    name: { en: 'Tuning & Concert Service', he: 'כיוון פסנתרים' },
    description: {
      en: 'Professional tuning for private pianos, institutions, concert halls and events.',
      he: 'כיוון מקצועי לפסנתרים פרטיים, מוסדות, אולמות קונצרטים ואירועים.',
    },
    image: '/images/workshop/tuning.webp',
    images: [
      '/images/workshop/tuning.webp',
      '/images/workshop/consultation.webp',
      '/images/workshop/care.webp',
    ],
    services: [
      {
        id: 'periodic-tuning',
        name: { en: 'Periodic Tuning', he: 'כיוון תקופתי' },
        description: {
          en: 'Maintaining tuning stability and sound quality over time.',
          he: 'שמירה על יציבות הכיוון ואיכות הצליל לאורך זמן.',
        },
      },
    ],
  },
  {
    id: 'regulation',
    name: { en: 'PTD', he: 'איזון מנגנון בשיטת PTD' },
    description: {
      en: 'Balancing and reshaping the action using the Precision Touch Design method.',
      he: 'איזון ועיצוב מחדש של המנגנון בשיטת Precision Touch Design.',
    },
    image: '/images/workshop/regulation.webp',
    images: [
      '/images/workshop/regulation.webp',
      '/images/workshop/restoration.webp',
      '/images/workshop/voicing.webp',
    ],
    services: [
      {
        id: 'full-regulation',
        name: { en: 'Full Regulation', he: 'איזון מנגנון מלא (רגולציה)' },
        description: {
          en: "Recalibrating all of the action's components for a precise, even and comfortable playing feel.",
          he: 'כיוון מחדש של כל מרכיבי המנגנון לקבלת תחושת נגינה מדויקת, אחידה ונוחה.',
        },
      },
    ],
  },
  {
    id: 'voicing',
    name: { en: 'Voicing', he: 'עיצוב צליל' },
    description: {
      en: "Tailoring the tone color to the piano's character and the player's style.",
      he: 'התאמת גוון הצליל לאופי הפסנתר ולסגנון הנגינה.',
    },
    image: '/images/workshop/voicing.webp',
    images: [
      '/images/workshop/voicing.webp',
      '/images/workshop/tuning.webp',
      '/images/workshop/restoration.webp',
    ],
    services: [],
  },
  {
    id: 'care',
    name: { en: 'Care & Maintenance', he: 'טיפול ותחזוקה' },
    description: {
      en: 'Routine maintenance to keep the piano in good working order for years to come.',
      he: 'תחזוקה שוטפת לשמירה על תקינות הפסנתר לאורך שנים.',
    },
    image: '/images/workshop/care.webp',
    images: [
      '/images/workshop/care.webp',
      '/images/workshop/climate.webp',
      '/images/workshop/tuning.webp',
    ],
    services: [
      {
        id: 'cleaning',
        name: { en: 'Cleaning', he: 'ניקוי יסודי' },
        description: {
          en: "Interior and exterior cleaning of the piano's parts.",
          he: 'ניקוי פנימי וחיצוני של חלקי הפסנתר.',
        },
      },
      {
        id: 'wheel-replacement',
        name: { en: 'Wheel Replacement', he: 'החלפת גלגלים' },
        description: {
          en: 'Replacing worn casters to improve stability and mobility.',
          he: 'החלפת גלגלים שחוקים לשיפור היציבות והניידות.',
        },
      },
      {
        id: 'general-inspection',
        name: { en: 'General Inspection', he: 'בדיקה תקופתית' },
        description: {
          en: "A general assessment of the piano's condition with recommendations for further care.",
          he: 'בדיקה כללית של מצב הפסנתר והמלצות להמשך טיפול.',
        },
      },
    ],
  },
  {
    id: 'rental',
    name: { en: 'Piano Rental', he: 'השכרת פסנתרים' },
    description: {
      en: "Piano rental for events, concerts, recordings and productions, fully tailored to the client's needs.",
      he: 'השכרת פסנתרים לאירועים, קונצרטים, הקלטות והפקות, עם התאמה מלאה לצורכי הלקוח.',
    },
    image: '/images/workshop/rental.webp',
    images: [
      '/images/workshop/rental.webp',
      '/images/workshop/consultation.webp',
      '/images/workshop/climate.webp',
    ],
    services: [],
  },
  {
    id: 'climate',
    name: { en: 'Climate Control', he: 'בקרת אקלים' },
    description: {
      en: 'Keeping the piano stable by protecting it from changes in humidity and temperature.',
      he: 'שמירה על יציבות הפסנתר באמצעות הגנה מפני שינויי לחות וטמפרטורה.',
    },
    image: '/images/workshop/climate.webp',
    images: [
      '/images/workshop/climate.webp',
      '/images/workshop/care.webp',
      '/images/workshop/rental.webp',
    ],
    services: [
      {
        id: 'piano-life-saver',
        name: { en: 'Piano Life Saver', he: 'Piano Life Saver' },
        description: {
          en: 'Installing a Piano Life Saver system to protect the piano.',
          he: 'התקנת מערכת Piano Life Saver להגנה על הפסנתר.',
        },
      },
    ],
  },
  {
    id: 'consultation',
    name: { en: 'Consultation & Appraisal', he: 'ייעוץ והערכת פסנתרים' },
    description: {
      en: 'Professional guidance before buying, selling or restoring a piano.',
      he: 'ליווי מקצועי לפני רכישה, מכירה או שיקום של פסנתר.',
    },
    image: '/images/workshop/consultation.webp',
    images: [
      '/images/workshop/consultation.webp',
      '/images/workshop/tuning.webp',
      '/images/workshop/restoration.webp',
    ],
    services: [
      {
        id: 'piano-appraisal',
        name: { en: 'Piano Appraisal', he: 'הערכת שווי' },
        description: {
          en: 'Valuation for sale, insurance or inheritance purposes.',
          he: 'הערכת שווי לצורכי מכירה, ביטוח או ירושה.',
        },
      },
    ],
  },
];
