-- Add an optional longer "Description" paragraph to workshop categories.
-- The existing `description` column stays as the short tagline under the title;
-- `intro` is the introductory paragraph shown above the fixes list.
ALTER TABLE workshop_categories ADD COLUMN intro_en TEXT;
ALTER TABLE workshop_categories ADD COLUMN intro_he TEXT;
ALTER TABLE workshop_categories ADD COLUMN intro_ar TEXT;
ALTER TABLE workshop_categories ADD COLUMN intro_ru TEXT;

-- Starter copy (Hebrew source + English). Arabic/Russian are left empty and
-- fall back to English until the admin "Translate" backfill runs.
UPDATE workshop_categories SET
  intro_he = 'רסטורציה מקיפה לפסנתר, מבפנים ומבחוץ — תוך שמירה על אופיו המקורי והחזרת איכות הצליל והנגיעה. מלוח התהודה והגשרים ועד למיתרים, המנגנון וגוף הפסנתר, כל רכיב נבדק ומוחזר לחיים בקפידה הראויה לכלי בעל ערך.',
  intro_en = 'Comprehensive restoration of the piano, inside and out — preserving its original character while restoring the quality of its tone and touch. From the soundboard and bridges to the strings, action and cabinet, every component is examined and brought back to life with the care an instrument of value deserves.'
WHERE id = 'restoration';

UPDATE workshop_categories SET
  intro_he = 'כיוון ותחזוקה סדירים שומרים על הצליל המיטבי של הפסנתר ומגנים עליו לאורך שנים. אנו מכווננים לגובה צליל תקני ומבצעים את הטיפול התקופתי — ניקוי, בדיקה וכוונונים קטנים — שכל כלי איכותי זקוק לו כדי להישאר יציב, מגיב ומכוון.',
  intro_en = 'Regular tuning and maintenance keep your piano sounding its best and protect it for years to come. We tune to concert-standard pitch and carry out the periodic care — cleaning, inspection and small adjustments — that every fine instrument needs to stay stable, responsive and in tune.'
WHERE id = 'tuning';

UPDATE workshop_categories SET
  intro_he = 'PTD (Precision Touch Design) היא שיטה שיטתית לאיזון המנגנון, כך שהמגע, המשקל והתגובה מאוזנים לאורך כל המקלדת. באמצעות מדידה וכוונון של גאומטריית המנגנון אנו מעניקים לפסנתרן מגע אחיד וצפוי, ההופך את הנגינה לקלה ומדויקת.',
  intro_en = 'PTD (Precision Touch Design) is a systematic method for regulating the action so that touch, weight and response are balanced across the entire keyboard. By measuring and adjusting the geometry of the action, we give the pianist an even, predictable touch that makes playing effortless and expressive.'
WHERE id = 'regulation';

UPDATE workshop_categories SET
  intro_he = 'עיצוב צליל מעצב את אופיו של הצליל עצמו. באמצעות עבודה עדינה על לבד הפטישים אנו מעדנים את גוון הצליל לאורך כל הטווח — ריכוך חדות או הוספת ברק — כך שהפסנתר מדבר באחידות מהלחישה הרכה ועד לפורטיסימו המלא, בהתאמה לכלי ולחלל.',
  intro_en = 'Voicing shapes the very character of the sound. By carefully working the hammer felt, we refine the tone across the range — softening harshness or adding brilliance — so the piano speaks evenly from the softest whisper to the fullest fortissimo, matched to the instrument and the room.'
WHERE id = 'voicing';

UPDATE workshop_categories SET
  intro_he = 'מתוך שנים של ניסיון מעשי, אנו מסייעים לכם לקבל את ההחלטות הנכונות לגבי פסנתר — הערכת מצבו, ייעוץ לגבי תחזוקה וחוות דעת כנה על שוויו. כמו כן אנו מציעים מגוון פסנתרים להשכרה; מחיר ההשכרה כולל הובלה וכיוון במקום, כך שהכלי מוכן לנגינה מרגע הגעתו.',
  intro_en = 'Drawing on years of hands-on experience, we help you make the right decisions about a piano — assessing its condition, advising on maintenance and giving an honest opinion on its value. We also offer a variety of pianos for rent; every rental price includes delivery and on-site tuning, so the instrument is ready to play the moment it arrives.'
WHERE id = 'rental';

UPDATE workshop_categories SET
  intro_he = 'הפסנתר רגיש מאוד לשינויי לחות — תנודות שגורמות לסדקים בלוח התהודה, לאובדן כיוון ולבלאי מוקדם של המנגנון. מערכת Piano Life Saver שומרת על לחות יציבה בתוך הכלי לאורך כל השנה, מגנה על ההשקעה שלכם ושומרת על הכיוון לאורך זמן רב יותר בין ביקורים.',
  intro_en = 'A piano is highly sensitive to changes in humidity — swings that crack soundboards, loosen tuning and wear the action prematurely. The Piano Life Saver system keeps humidity stable inside the instrument all year round, protecting your investment and keeping it in tune far longer between visits.'
WHERE id = 'climate';
