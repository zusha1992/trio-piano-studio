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
        name: { en: 'Pinblock Replacement', he: 'החלפת פין־בלוק' },
        description: {
          en: 'Replacing the pinblock to improve tuning stability over time.',
          he: 'החלפת הפין־בלוק לשיפור יציבות הכיוון לאורך זמן.',
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
        name: { en: 'Damper Restoration', he: 'שיקום מערכת המשתיקים' },
        description: {
          en: 'Restoring and regulating the damper system for quiet, precise operation.',
          he: 'שיקום וכיוון מערכת המשתיקים לפעולה שקטה ומדויקת.',
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
      {
        id: 'concert-tuning',
        name: { en: 'Concert Tuning', he: 'כיוון לקונצרטים' },
        description: {
          en: 'Precise tuning before performances, recordings and events.',
          he: 'כיוון מדויק לפני הופעות, הקלטות ואירועים.',
        },
      },
      {
        id: 'pitch-raise',
        name: { en: 'Pitch Raise', he: 'הרמת גובה הצליל' },
        description: {
          en: 'Bringing significantly out-of-tune pianos back to standard pitch.',
          he: 'החזרת פסנתרים שיצאו מכיוון משמעותי לגובה הצליל התקני.',
        },
      },
      {
        id: 'concert-preparation',
        name: { en: 'Concert Preparation', he: 'הכנת פסנתר להופעה' },
        description: {
          en: 'Inspection, tuning and final adjustments before a concert or recording.',
          he: 'בדיקה, כיוון והתאמות אחרונות לפני קונצרט או הקלטה.',
        },
      },
      {
        id: 'recording-sessions',
        name: { en: 'Recording Sessions', he: 'כיוון להקלטות' },
        description: {
          en: 'Preparing the piano to meet the demands of professional studio recording.',
          he: 'התאמת הפסנתר לדרישות אולפן והקלטה מקצועית.',
        },
      },
      {
        id: 'emergency-tuning',
        name: { en: 'Emergency Tuning', he: 'כיוון דחוף' },
        description: {
          en: 'Fast tuning service for urgent cases or right before events.',
          he: 'שירות כיוון מהיר במקרים דחופים או לפני אירועים.',
        },
      },
    ],
  },
  {
    id: 'regulation',
    name: { en: 'Regulation & PTD', he: 'איזון מנגנון' },
    description: {
      en: 'Adjusting the action so it delivers a precise, even and comfortable playing feel.',
      he: 'התאמת פעולת המנגנון לקבלת תחושת נגינה מדויקת, אחידה ונוחה.',
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
        name: { en: 'Full Regulation', he: 'איזון מנגנון מלא' },
        description: {
          en: "Recalibrating all of the action's components.",
          he: 'כיוון מחדש של כל מרכיבי המנגנון.',
        },
      },
      {
        id: 'ptd-regulation',
        name: { en: 'PTD Regulation', he: 'איזון מנגנון בשיטת PTD' },
        description: {
          en: 'Regulating and reshaping the action using the Precision Touch Design method.',
          he: 'איזון ועיצוב מחדש של המנגנון בשיטת Precision Touch Design.',
        },
      },
      {
        id: 'key-leveling',
        name: { en: 'Key Leveling', he: 'איזון קלידים' },
        description: {
          en: 'Leveling the keys to a uniform height for a consistent playing feel.',
          he: 'יישור הקלידים לגובה אחיד ולתחושת נגינה עקבית.',
        },
      },
      {
        id: 'touch-weight-balancing',
        name: { en: 'Touch Weight Balancing', he: 'איזון משקל הקלידים' },
        description: {
          en: 'Balancing the touch weight across the entire keyboard.',
          he: 'התאמת משקל הלחיצה לאורך כל המקלדת.',
        },
      },
      {
        id: 'let-off-adjustment',
        name: { en: 'Let-off Adjustment', he: 'כיוון מנגנון השחרור' },
        description: {
          en: 'Adjusting the let-off distance for precise control while playing.',
          he: 'כיוון מרחק השחרור לקבלת שליטה מדויקת בנגינה.',
        },
      },
      {
        id: 'repetition-adjustment',
        name: { en: 'Repetition Adjustment', he: 'כיוון מנגנון החזרה' },
        description: {
          en: 'Improving the speed and precision of hammer repetition.',
          he: 'שיפור מהירות ודיוק החזרת הפטישים.',
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
    services: [
      {
        id: 'hammer-voicing',
        name: { en: 'Hammer Voicing', he: 'Voicing לפטישים' },
        description: {
          en: 'Shaping the tone color by treating the hammers.',
          he: 'עיצוב גוון הצליל באמצעות טיפול בפטישים.',
        },
      },
      {
        id: 'hammer-shaping',
        name: { en: 'Hammer Shaping', he: 'עיצוב פטישים' },
        description: {
          en: 'Reshaping the hammer surface after wear.',
          he: 'עיצוב מחדש של פני הפטיש לאחר שחיקה.',
        },
      },
      {
        id: 'tone-balancing',
        name: { en: 'Tone Balancing', he: 'איזון צליל' },
        description: {
          en: 'Creating evenness across all registers of the keyboard.',
          he: 'יצירת אחידות בין כל תחומי המקלדת.',
        },
      },
      {
        id: 'tone-brightening',
        name: { en: 'Tone Brightening', he: 'הבהרת הצליל' },
        description: {
          en: 'Adjusting the piano toward a more open, brighter tone.',
          he: 'התאמת הפסנתר לצליל פתוח ובהיר יותר.',
        },
      },
      {
        id: 'tone-softening',
        name: { en: 'Tone Softening', he: 'ריכוך הצליל' },
        description: {
          en: 'Creating a warmer, rounder and mellower tone.',
          he: 'יצירת צליל חם, עגול ונעים יותר.',
        },
      },
    ],
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
        id: 'lubrication',
        name: { en: 'Lubrication', he: 'שימון מנגנון' },
        description: {
          en: 'Treating moving parts to reduce wear.',
          he: 'טיפול בחלקים נעים להפחתת שחיקה.',
        },
      },
      {
        id: 'small-repairs',
        name: { en: 'Small Repairs', he: 'תיקונים שוטפים' },
        description: {
          en: 'Handling minor issues before they become major ones.',
          he: 'טיפול בתקלות קטנות לפני שהופכות לגדולות.',
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
        id: 'keyboard-adjustments',
        name: { en: 'Keyboard Adjustments', he: 'כיוון מקלדת' },
        description: {
          en: 'Minor repairs and adjustments to improve the playing feel.',
          he: 'תיקונים וכיוונים קלים לשיפור תחושת הנגינה.',
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
    services: [
      {
        id: 'concert-rental',
        name: { en: 'Concert Rental', he: 'השכרה לקונצרטים' },
        description: {
          en: 'Renting pianos for concerts, recitals and festivals.',
          he: 'השכרת פסנתרים לקונצרטים, רסיטלים ופסטיבלים.',
        },
      },
      {
        id: 'recording-rental',
        name: { en: 'Recording Sessions', he: 'השכרה להקלטות' },
        description: {
          en: 'Renting pianos for recording studios and music productions.',
          he: 'השכרת פסנתרים לאולפני הקלטות ולהפקות מוזיקליות.',
        },
      },
      {
        id: 'event-rental',
        name: { en: 'Event Rental', he: 'השכרה לאירועים' },
        description: {
          en: 'Renting pianos for private, corporate and cultural events.',
          he: 'השכרת פסנתרים לאירועים פרטיים, עסקיים ואירועי תרבות.',
        },
      },
      {
        id: 'long-term-rental',
        name: { en: 'Long-Term Rental', he: 'השכרה לטווח ארוך' },
        description: {
          en: 'Rental solutions for institutions, studios, schools and private clients.',
          he: 'פתרונות השכרה למוסדות, אולפנים, בתי ספר ולקוחות פרטיים.',
        },
      },
      {
        id: 'delivery-installation',
        name: { en: 'Delivery & Installation', he: 'הובלה והתקנה' },
        description: {
          en: 'Professional transport, placement and setup of the piano at the venue.',
          he: 'הובלה מקצועית, הצבת הפסנתר והכנתו לנגינה במקום האירוע.',
        },
      },
      {
        id: 'on-site-tuning',
        name: { en: 'On-Site Tuning', he: 'כיוון באתר' },
        description: {
          en: 'Tuning the piano after delivery and before the event or recording begins.',
          he: 'כיוון הפסנתר לאחר ההובלה ולפני תחילת האירוע או ההקלטה.',
        },
      },
    ],
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
      {
        id: 'dampp-chaser',
        name: { en: 'Dampp-Chaser', he: 'Dampp-Chaser' },
        description: {
          en: 'Installing a Dampp-Chaser system to stabilize humidity conditions.',
          he: 'התקנת מערכת Dampp-Chaser לייצוב תנאי הלחות.',
        },
      },
      {
        id: 'humidity-monitoring',
        name: { en: 'Humidity Monitoring', he: 'ניטור לחות' },
        description: {
          en: 'Checking environmental conditions and tailoring the right solutions.',
          he: 'בדיקת תנאי הסביבה והתאמת פתרונות.',
        },
      },
      {
        id: 'climate-consultation',
        name: { en: 'Climate Consultation', he: 'ייעוץ סביבתי' },
        description: {
          en: 'Recommendations for optimal placement and care of the piano.',
          he: 'המלצות למיקום ולשמירה מיטבית על הפסנתר.',
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
        id: 'pre-purchase-inspection',
        name: { en: 'Pre-purchase Inspection', he: 'בדיקה לפני רכישה' },
        description: {
          en: 'A professional condition assessment before purchasing a piano.',
          he: 'הערכת מצב מקצועית לפני קניית פסנתר.',
        },
      },
      {
        id: 'piano-appraisal',
        name: { en: 'Piano Appraisal', he: 'הערכת שווי' },
        description: {
          en: 'Valuation for sale, insurance or inheritance purposes.',
          he: 'הערכת שווי לצורכי מכירה, ביטוח או ירושה.',
        },
      },
      {
        id: 'restoration-planning',
        name: { en: 'Restoration Planning', he: 'תכנון רסטורציה' },
        description: {
          en: "Building a restoration plan based on the instrument's condition.",
          he: 'בניית תוכנית שיקום בהתאם למצב הכלי.',
        },
      },
      {
        id: 'condition-report',
        name: { en: 'Condition Report', he: 'חוות דעת מקצועית' },
        description: {
          en: "A detailed report on the piano's condition with recommendations for next steps.",
          he: 'דו”ח מפורט על מצב הפסנתר והמלצות להמשך.',
        },
      },
    ],
  },
];
