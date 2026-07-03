'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';

const testimonials = [
  {
    text: {
      en: 'They transformed my grandmother\'s old upright into something that sounds like a concert piano. I couldn\'t believe the difference. The craftsmanship and care they brought to this instrument was extraordinary.',
      he: 'הם הפכו את פסנתר הקיר הישן של סבתא שלי למשהו שנשמע כמו פסנתר קונצרט. לא האמנתי לאוזניים שלי. המיומנות והטיפול שהביאו לכלי הזה היו יוצאי דופן.',
    },
    author: { en: 'Sarah K.', he: 'שרה כ.' },
    role: { en: 'Music Teacher, Jerusalem', he: 'מורה למוזיקה, ירושלים' },
  },
  {
    text: {
      en: 'Purchased a Yamaha U3 through Trio Piano Workshop. The piano arrived perfectly tuned and regulated. Their knowledge and honesty made the entire process a pleasure.',
      he: 'רכשתי יאמהה U3 דרך סדנת פסנתר טריו. הפסנתר הגיע מכוון ומכורגן בצורה מושלמת. הידע והיושרה שלהם הפכו את כל התהליך לחוויה נעימה.',
    },
    author: { en: 'David M.', he: 'דוד מ.' },
    role: { en: 'Pianist, Tel Aviv', he: 'פסנתרן, תל אביב' },
  },
  {
    text: {
      en: 'The team at Trio found us a rare Steinway from Japan at an incredible price. Their expertise in sourcing international instruments is unmatched in Israel.',
      he: 'הצוות בטריו מצא לנו שטיינווי נדיר מיפן במחיר מדהים. המומחיות שלהם במיון כלים בינלאומיים היא ללא תחרות בישראל.',
    },
    author: { en: 'Rachel S.', he: 'רחל ש.' },
    role: { en: 'Conservatory Director', he: 'מנהלת קונסרבטוריון' },
  },
];

export default function Testimonials() {
  const t = useTranslations('testimonials');
  const locale = useLocale() as 'en' | 'he';

  return (
    <section className="section-padding bg-[#16120E]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#A08C7C] mb-4">
            {t('label')}
          </p>
          <h2
            className="text-4xl lg:text-5xl font-light text-[#F0EAD6]"
            style={{
              fontFamily:
                locale === 'he'
                  ? 'var(--font-heebo), sans-serif'
                  : 'var(--font-cormorant), serif',
            }}
          >
            {t('title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="bg-[#1B1610] border border-[#28201A] p-8"
            >
              <div className="text-3xl text-[#A08C7C] mb-6 font-serif">"</div>
              <p className="text-sm text-[#887A66] leading-relaxed mb-8 italic">
                {item.text[locale]}
              </p>
              <div className="border-t border-[#28201A] pt-6">
                <p className="text-[#F0EAD6] text-sm font-medium">{item.author[locale]}</p>
                <p className="text-[10px] tracking-[0.15em] uppercase text-[#6A5C4A] mt-1">
                  {item.role[locale]}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
