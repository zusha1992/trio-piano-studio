'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Piano } from '@/data/pianos';

interface Props {
  piano: Piano;
  initial: number;
  onClose: () => void;
}

export default function PianoLightbox({ piano, initial, onClose }: Props) {
  const [current, setCurrent] = useState(initial);
  const locale = useLocale() as 'en' | 'he';
  const isHe = locale === 'he';
  const images = piano.images;

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length);
  const next = () => setCurrent(i => (i + 1) % images.length);

  const waMessage = encodeURIComponent(
    isHe
      ? `שלום, אני מעוניין לשמוע יותר על הפסנתר ${piano.brand} ${piano.model}`
      : `Hello, I'm interested in learning more about the ${piano.brand} ${piano.model}`
  );
  const waHref = `https://wa.me/972543337341?text=${waMessage}`;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [current]);

  const typeLabel = {
    grand: isHe ? 'גרנד' : 'Grand Piano',
    'baby-grand': isHe ? 'גרנד קטן' : 'Baby Grand',
    upright: isHe ? 'פסנתר קיר' : 'Upright Piano',
  }[piano.type];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto"
      style={{ backgroundColor: 'rgba(0,0,0,0.96)' }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-2 z-10"
        aria-label="Close"
      >
        <X size={22} />
      </button>

      {/* Content */}
      <div
        className="flex flex-col lg:flex-row items-center gap-0 lg:gap-12 w-full max-w-6xl px-4 lg:px-12 py-12"
        onClick={e => e.stopPropagation()}
      >

        {/* Image + arrows */}
        <div className="relative w-full lg:flex-1">
          {/* Counter */}
          {images.length > 1 && (
            <p className="text-center text-[10px] tracking-[0.25em] text-white/30 uppercase mb-3">
              {current + 1} / {images.length}
            </p>
          )}

          <div className="relative h-[50vh] lg:h-[65vh]">
            <Image
              key={current}
              src={images[current]}
              alt={`${piano.brand} ${piano.model}`}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>

          {images.length > 1 && (
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={prev}
                className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Details panel */}
        <div
          className="w-full lg:w-72 xl:w-80 flex flex-col gap-5 mt-8 lg:mt-0"
          dir={isHe ? 'rtl' : 'ltr'}
        >
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase mb-2" style={{ color: 'var(--c-accent)' }}>
              {typeLabel}{piano.year && ` · ${piano.year}`}
            </p>
            <h2 className="text-2xl lg:text-3xl font-light text-white leading-tight mb-4">
              {piano.brand}<br />{piano.model}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {piano.description[locale]}
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* WhatsApp CTA */}
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 transition-colors duration-300 self-start"
            style={{ backgroundColor: '#25D366' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#20BD5C')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#25D366')}
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4 shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="text-xs text-white">
              {isHe ? 'שאל על פסנתר זה' : 'Ask about this piano'}
            </span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
