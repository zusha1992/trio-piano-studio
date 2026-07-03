'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { Piano } from '@/data/pianos';
import PianoLightbox from './PianoLightbox';

interface PianoCardProps {
  piano: Piano;
}

export default function PianoCard({ piano }: PianoCardProps) {
  const locale = useLocale() as 'en' | 'he';
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const images = piano.images;
  const hasImages = images.length > 0;

  const typeLabel = {
    grand: 'Grand',
    'baby-grand': 'Baby Grand',
    upright: 'Upright',
  }[piano.type];

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent(i => (i - 1 + images.length) % images.length);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent(i => (i + 1) % images.length);
  };

  return (
    <>
      <div className="group bg-[var(--c-card)] border border-[var(--c-border)] overflow-hidden transition-all duration-500 piano-card-hover">

        {/* Image area */}
        <div
          className="relative h-60 overflow-hidden bg-[var(--c-bg-alt)] cursor-pointer"
          onClick={() => hasImages && setLightboxOpen(true)}
        >
          {hasImages ? (
            <>
              <Image
                src={images[current]}
                alt={`${piano.brand} ${piano.model}`}
                fill
                className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700"
              />

              {/* Prev / Next arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    aria-label="Next image"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              {/* Expand button */}
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
                className="absolute top-2 right-2 bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="View full size"
              >
                <Expand size={14} />
              </button>

              {/* Dot indicators */}
              {images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${i === current ? 'bg-white scale-125' : 'bg-white/40'}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-10">
                <rect x="0" y="6" width="13" height="42" rx="2" fill="currentColor" />
                <rect x="17" y="0" width="13" height="36" rx="2" fill="currentColor" opacity="0.6" />
                <rect x="34" y="10" width="13" height="32" rx="2" fill="currentColor" opacity="0.4" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-6">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--c-accent)] mb-3">
            {piano.brand} · {typeLabel}{piano.year && ` · ${piano.year}`}
          </p>
          <h3 className="text-xl font-light text-[var(--c-text)] mb-4 leading-snug">
            {piano.brand} {piano.model}
          </h3>
          <p className="text-sm text-[var(--c-muted)] leading-relaxed">
            {piano.description[locale]}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <PianoLightbox
            piano={piano}
            initial={current}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
