// Shop inventory.
//
// This is intentionally a plain, flat array so it can later be replaced by a
// CMS / database source without touching the gallery/detail layouts: the store
// renders whatever items live here (any amount). To add an item, append an
// object with a unique id.
//
// Each piano's photos live in /public/images/shop/<id>/ and are named
// <id>-0.webp … <id>-N.webp. `-0` is the representative tile shown in the main
// gallery; the whole set is shown in the per-piano carousel.

export type ShopType = 'grand' | 'upright';
export type ShopRegion = 'japan' | 'europe' | 'usa';

export interface LocalizedText {
  en: string;
  he: string;
}

export interface ShopColor {
  /** Swatch color. */
  hex: string;
  name: LocalizedText;
}

/** Physical dimensions in centimeters, used for the size illustration. */
export interface ShopDimensions {
  width: number;
  height: number;
  /** Depth for uprights / overall length for grands. */
  depth: number;
}

export interface ShopItem {
  id: string;
  brand: string;
  /** Model designation (e.g. U1, U3, CX-21). Empty for grands with no model. */
  model: string;
  type: ShopType;
  /** Manufacturer serial number, when known. Shown as the gallery subheader. */
  serial?: string;
  /** Origin region, used as a store filter facet + shown on the detail page. */
  region: ShopRegion;
  /** Height for uprights / length for grands, shown next to the model. */
  size: string;
  /** ILS price, or 'contact' when priced on request. */
  price: number | 'contact';
  color: ShopColor;
  dimensions: ShopDimensions;
  /** Primary image (tile + detail gallery fallback). */
  image: string;
  /** Optional extra images for the detail-page gallery/carousel. */
  images?: string[];
  /** Optional per-item description; falls back to a generated line. */
  description?: LocalizedText;
  /** True while the piano is still being restored and is not yet for sale. */
  wip?: boolean;
}

// Shared finishes. All pianos are ebony except the Érard (mahogany).
const EBONY: ShopColor = { hex: '#1b1b1d', name: { en: 'Ebony Black', he: 'שחור' } };
const MAHOGANY: ShopColor = { hex: '#5b2a14', name: { en: 'Mahogany', he: 'מהגוני' } };

// Build the ordered image list for a piano from its folder + frame count.
const imgs = (id: string, count: number): string[] =>
  Array.from({ length: count }, (_, i) => `/images/shop/${id}/${id}-${i}.webp`);

// ── Descriptions (one per model, reused across identical models) ────────────
const DESC_U1: LocalizedText = {
  en: "The Yamaha U1 is the world's most trusted professional upright — a 121 cm instrument prized for its even touch, clear projection, and remarkable reliability. Built in Japan, this example has been fully inspected, regulated, and voiced in our Jerusalem workshop so it plays with the focused, singing tone Yamaha uprights are loved for. Compact enough for the home yet powerful enough for the studio, the U1 is an ideal choice for students and serious players alike.",
  he: 'ה-U1 של ימאהה הוא הפסנתר הזקוף המקצועי המוכר בעולם — כלי בגובה 121 ס"מ המוערך על נגיעה אחידה, הקרנה צלולה ואמינות יוצאת דופן. הכלי, מתוצרת יפן, עבר בדיקה, כיוונון ווויסות מלאים בסדנה שלנו בירושלים, כך שהוא מנגן בצליל הממוקד והשר שבזכותו נאהבים הפסנתרים הזקופים של ימאהה. קומפקטי מספיק לבית אך עוצמתי מספיק לאולפן — ה-U1 הוא בחירה אידיאלית לתלמידים ולנגנים רציניים כאחד.',
};
const DESC_U3: LocalizedText = {
  en: 'The Yamaha U3 is the taller, fuller-voiced sibling of the U1 — at 131 cm its longer strings and larger soundboard give a deeper bass and richer sustain. A favourite of teachers, conservatories, and advanced pianists, this Japanese-made instrument has been meticulously restored and regulated in our workshop. It offers close to grand-piano presence in an upright footprint, ready for years of demanding daily playing.',
  he: 'ה-U3 של ימאהה הוא האח הגבוה ובעל הצליל המלא יותר של ה-U1 — בגובה 131 ס"מ, המיתרים הארוכים והלוח הגדול יותר מעניקים בס עמוק וסאסטיין עשיר יותר. מועדף על מורים, קונסרבטוריונים ופסנתרנים מתקדמים, הכלי מתוצרת יפן שוקם וכוונן בקפידה בסדנה שלנו. הוא מציע נוכחות הקרובה לזו של פסנתר כנף במידות של פסנתר זקוף, ומוכן לשנים של נגינה יומית תובענית.',
};
const DESC_UX: LocalizedText = {
  en: "The Yamaha UX is the professional flagship of Yamaha's upright line, recognised by its distinctive X-braced back and grand-piano-grade action and soundboard materials. Made in Japan and standing 131 cm tall, it delivers longer bass strings and superior tuning stability, producing a powerful, resonant tone sought after by concert-level players. Fully serviced in our Jerusalem workshop, this UX is a rare and rewarding instrument for the discerning musician.",
  he: 'ה-UX של ימאהה הוא דגל הדגם המקצועי בסדרת הפסנתרים הזקופים של ימאהה, המזוהה בגב מחוזק ה-X ובחומרי מכניקה ולוח תהודה ברמת פסנתר כנף. מתוצרת יפן ובגובה 131 ס"מ, הוא מספק מיתרי בס ארוכים יותר ויציבות כיוונון מעולה, ומפיק צליל עוצמתי ומהדהד המבוקש על ידי נגנים ברמת קונצרט. לאחר טיפול מלא בסדנה שלנו בירושלים, ה-UX הוא כלי נדיר ומתגמל למוזיקאי הבררן.',
};
const DESC_CX21: LocalizedText = {
  en: 'The Kawai CX-21 is a professional 121 cm Japanese upright celebrated for its warm, round tone and responsive action — an excellent alternative to the Yamaha U-series for players who prefer a mellower voice. This example has been carefully reconditioned, regulated, and tuned in our workshop. Solidly built and dependable, it is well suited to the home, the teaching studio, or the practice room.',
  he: 'ה-CX-21 של קאוואי הוא פסנתר זקוף מקצועי יפני בגובה 121 ס"מ, הנודע בצליל החם והעגול ובמכניקה הרספונסיבית שלו — חלופה מצוינת לסדרת ה-U של ימאהה עבור מי שמעדיף צליל רך יותר. הכלי שוקם, כוונן וכויּן בקפידה בסדנה שלנו. בנוי היטב ואמין, הוא מתאים לבית, לסטודיו להוראה או לחדר התרגול.',
};
const DESC_NS35: LocalizedText = {
  en: "The Kawai NS-35 sits at the top of Kawai's acclaimed NS series — a professional 132 cm upright built with premium materials for a rich, dynamic tone and generous bass. Made in Japan and finished in polished ebony, this instrument has been fully restored and regulated in our Jerusalem workshop. Tall, powerful, and beautifully balanced, it rewards advanced players who want an upright with real depth.",
  he: 'ה-NS-35 של קאוואי ניצב בראש סדרת ה-NS המהוללת — פסנתר זקוף מקצועי בגובה 132 ס"מ, הבנוי מחומרים מובחרים לצליל עשיר ודינמי ובס נדיב. מתוצרת יפן ובגימור אבונית מלוטשת, הכלי שוקם וכוונן במלואו בסדנה שלנו בירושלים. גבוה, עוצמתי ומאוזן להפליא, הוא מתגמל נגנים מתקדמים המחפשים פסנתר זקוף בעל עומק אמיתי.',
};
const DESC_ERARD: LocalizedText = {
  en: 'This Érard is a rare French grand from around 1923, built by the storied Paris house that invented the double-escapement action still found in every modern piano. On its elegant 180 cm case it offers the deep basses and sparkling treble that make it ideal for the French repertoire — Chopin, Debussy, Ravel, and Poulenc. A genuine piece of musical history, it is currently being lovingly restored in our workshop and is not yet available for sale.',
  he: 'הארר הזה הוא פסנתר כנף צרפתי נדיר משנת 1923 לערך, מתוצרת בית המלאכה הפריזאי האגדי שהמציא את מנגנון הבריחה הכפולה המצוי עד היום בכל פסנתר מודרני. בגוף אלגנטי באורך 180 ס"מ הוא מציע את הבסים העמוקים והטרבל הנוצץ ההופכים אותו למושלם לרפרטואר הצרפתי — שופן, דביסי, ראוול ופולנק. פיסת היסטוריה מוזיקלית אמיתית, הנמצאת כעת בתהליך שיקום מוקפד בסדנה שלנו ואינה מוצעת עדיין למכירה.',
};
const DESC_STEINWAY: LocalizedText = {
  en: "A Steinway & Sons grand is the benchmark by which all other pianos are measured — hand-built with the tone, power, and touch that have made it the choice of the world's great concert halls. This example has been carefully restored in our Jerusalem workshop, preserving its singing sustain and wide dynamic range. An instrument of a lifetime for the pianist who wants the very best.",
  he: 'פסנתר כנף של סטיינווי אנד סאנס הוא אמת המידה שלפיה נמדדים כל שאר הפסנתרים — בנוי בעבודת יד עם הצליל, העוצמה והנגיעה שהפכו אותו לבחירתם של אולמות הקונצרטים הגדולים בעולם. הכלי שוקם בקפידה בסדנה שלנו בירושלים, תוך שמירה על הסאסטיין השר והטווח הדינמי הרחב שלו. כלי של פעם בחיים לפסנתרן המבקש את המיטב שבמיטב.',
};
const DESC_YAMAHA_GRAND: LocalizedText = {
  en: 'The Yamaha C3 is a 186 cm conservatory grand and one of the most popular instruments of its size in the world — the go-to choice of studios, schools, and serious homes for its powerful, focused sound, dependable mechanics, and excellent tuning stability. Japanese-built and fully serviced in our workshop, it offers a clear tone and an even, responsive action across the whole keyboard. A versatile grand equally at home in classical, jazz, and contemporary playing.',
  he: 'ה-C3 של ימאהה הוא פסנתר כנף קונצרטי באורך 186 ס"מ ואחד הכלים הפופולריים ביותר בגודלו בעולם — הבחירה המועדפת של אולפנים, בתי ספר ובתים רציניים בזכות הצליל העוצמתי והממוקד, המכניקה האמינה ויציבות הכיוונון המצוינת. מתוצרת יפן ולאחר טיפול מלא בסדנה שלנו, הוא מציע צליל צלול ומכניקה אחידה ורספונסיבית לאורך כל הקלידים. פסנתר כנף רב-תכליתי, בבית באותה מידה בנגינה קלאסית, ג׳אז ומוזיקה עכשווית.',
};
const DESC_BLUTHNER: LocalizedText = {
  en: 'This Blüthner Model 6 grand was built in Leipzig around 1920, in the golden age of the celebrated German house founded in 1853. At 190 cm it delivers a warm, singing tone with clarity across every register and the light, responsive touch Blüthner is famed for, owed in part to its patented Aliquot stringing. Equally suited to delicate passages and powerful climaxes, it is a distinguished European instrument currently undergoing full restoration in our workshop and is not yet available for sale.',
  he: 'פסנתר הכנף הזה, בלוטנר דגם 6, נבנה בלייפציג סביב שנת 1920, בתור הזהב של בית המלאכה הגרמני הנודע שנוסד ב-1853. באורך 190 ס"מ הוא מפיק צליל חם ושר עם צלילות בכל הרגיסטרים ונגיעה קלה ורספונסיבית שבלוטנר מפורסמת בה, בין היתר בזכות מיתור ה-Aliquot הפטנטי. מתאים באותה מידה לקטעים עדינים ולשיאים עוצמתיים, זהו כלי אירופי מכובד הנמצא כעת בשיקום מלא בסדנה שלנו ואינו מוצע עדיין למכירה.',
};

export const shopItems: ShopItem[] = [
  // ── Grands ────────────────────────────────────────────────────────────────
  {
    // Model unknown from the folder; dimensions are those of the Steinway
    // Model A (6'2"), the most common studio-size Steinway grand — adjust if
    // this is actually an O (180 cm) or B (211 cm).
    id: 'steinway',
    brand: 'Steinway & Sons',
    model: '',
    type: 'grand',
    region: 'europe',
    size: `6' 2"`,
    price: 'contact',
    color: EBONY,
    dimensions: { width: 147, height: 100, depth: 188 },
    image: '/images/shop/steinway/steinway-0.webp',
    images: imgs('steinway', 11),
    description: DESC_STEINWAY,
  },
  {
    id: 'bluthner',
    brand: 'Blüthner',
    model: 'Model 6',
    type: 'grand',
    region: 'europe',
    size: `6' 3"`,
    price: 'contact',
    color: EBONY,
    dimensions: { width: 147, height: 100, depth: 190 },
    image: '/images/shop/bluthner/bluthner-0.webp',
    images: imgs('bluthner', 14),
    description: DESC_BLUTHNER,
    wip: true,
  },
  {
    id: 'erard',
    brand: 'Érard',
    model: '180',
    type: 'grand',
    region: 'europe',
    size: `5' 11"`,
    price: 'contact',
    color: MAHOGANY,
    dimensions: { width: 150, height: 100, depth: 180 },
    image: '/images/shop/erard/erard-0.webp',
    images: imgs('erard', 17),
    description: DESC_ERARD,
    wip: true,
  },
  {
    id: 'yamaha-grand',
    brand: 'Yamaha',
    model: 'C3',
    type: 'grand',
    region: 'japan',
    size: `6' 1"`,
    price: 'contact',
    color: EBONY,
    dimensions: { width: 148, height: 101, depth: 186 },
    image: '/images/shop/yamaha-grand/yamaha-grand-0.webp',
    images: imgs('yamaha-grand', 14),
    description: DESC_YAMAHA_GRAND,
  },

  // ── Uprights ──────────────────────────────────────────────────────────────
  {
    id: 'yamaha-ux',
    brand: 'Yamaha',
    model: 'UX',
    type: 'upright',
    region: 'japan',
    size: `52"`,
    price: 32000,
    color: EBONY,
    dimensions: { width: 154, height: 131, depth: 65 },
    image: '/images/shop/yamaha-ux/yamaha-ux-0.webp',
    images: imgs('yamaha-ux', 8),
    description: DESC_UX,
  },
  {
    id: 'kawai-ns35',
    brand: 'Kawai',
    model: 'NS-35',
    type: 'upright',
    region: 'japan',
    serial: '1642672',
    size: `52"`,
    price: 22000,
    color: EBONY,
    dimensions: { width: 153, height: 132, depth: 61 },
    image: '/images/shop/kawai-ns35/kawai-ns35-0.webp',
    images: imgs('kawai-ns35', 6),
    description: DESC_NS35,
  },
  {
    id: 'kawai-cx21',
    brand: 'Kawai',
    model: 'CX-21',
    type: 'upright',
    region: 'japan',
    serial: '2318158',
    size: `48"`,
    price: 18000,
    color: EBONY,
    dimensions: { width: 152, height: 121, depth: 60 },
    image: '/images/shop/kawai-cx21/kawai-cx21-0.webp',
    images: imgs('kawai-cx21', 6),
    description: DESC_CX21,
  },
  {
    id: 'yamaha-u3-3091140',
    brand: 'Yamaha',
    model: 'U3',
    type: 'upright',
    region: 'japan',
    serial: '3091140',
    size: `52"`,
    price: 27000,
    color: EBONY,
    dimensions: { width: 153, height: 131, depth: 65 },
    image: '/images/shop/yamaha-u3-3091140/yamaha-u3-3091140-0.webp',
    images: imgs('yamaha-u3-3091140', 6),
    description: DESC_U3,
  },
  {
    id: 'yamaha-u3-3247416',
    brand: 'Yamaha',
    model: 'U3',
    type: 'upright',
    region: 'japan',
    serial: '3247416',
    size: `52"`,
    price: 27000,
    color: EBONY,
    dimensions: { width: 153, height: 131, depth: 65 },
    image: '/images/shop/yamaha-u3-3247416/yamaha-u3-3247416-0.webp',
    images: imgs('yamaha-u3-3247416', 6),
    description: DESC_U3,
  },
  {
    id: 'yamaha-u3-3493455',
    brand: 'Yamaha',
    model: 'U3',
    type: 'upright',
    region: 'japan',
    serial: '3493455',
    size: `52"`,
    price: 27000,
    color: EBONY,
    dimensions: { width: 153, height: 131, depth: 65 },
    image: '/images/shop/yamaha-u3-3493455/yamaha-u3-3493455-0.webp',
    images: imgs('yamaha-u3-3493455', 8),
    description: DESC_U3,
  },
  {
    id: 'yamaha-u1-2262061',
    brand: 'Yamaha',
    model: 'U1',
    type: 'upright',
    region: 'japan',
    serial: '2262061',
    size: `48"`,
    price: 20000,
    color: EBONY,
    dimensions: { width: 153, height: 121, depth: 61 },
    image: '/images/shop/yamaha-u1-2262061/yamaha-u1-2262061-0.webp',
    images: imgs('yamaha-u1-2262061', 5),
    description: DESC_U1,
  },
  {
    id: 'yamaha-u1-3576901',
    brand: 'Yamaha',
    model: 'U1',
    type: 'upright',
    region: 'japan',
    serial: '3576901',
    size: `48"`,
    price: 20000,
    color: EBONY,
    dimensions: { width: 153, height: 121, depth: 61 },
    image: '/images/shop/yamaha-u1-3576901/yamaha-u1-3576901-0.webp',
    images: imgs('yamaha-u1-3576901', 6),
    description: DESC_U1,
  },
  {
    id: 'yamaha-u1-3579760',
    brand: 'Yamaha',
    model: 'U1',
    type: 'upright',
    region: 'japan',
    serial: '3579760',
    size: `48"`,
    price: 20000,
    color: EBONY,
    dimensions: { width: 153, height: 121, depth: 61 },
    image: '/images/shop/yamaha-u1-3579760/yamaha-u1-3579760-0.webp',
    images: imgs('yamaha-u1-3579760', 7),
    description: DESC_U1,
  },
  {
    id: 'yamaha-u1-3688607',
    brand: 'Yamaha',
    model: 'U1',
    type: 'upright',
    region: 'japan',
    serial: '3688607',
    size: `48"`,
    price: 20000,
    color: EBONY,
    dimensions: { width: 153, height: 121, depth: 61 },
    image: '/images/shop/yamaha-u1-3688607/yamaha-u1-3688607-0.webp',
    images: imgs('yamaha-u1-3688607', 7),
    description: DESC_U1,
  },
];
