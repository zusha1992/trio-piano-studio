'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import emailjs from '@emailjs/browser';
import QRCode from 'qrcode';
import { concerts, concertGallery } from '@/data/concerts';

const EMAILJS_SERVICE_ID = 'service_52uluqq';
const EMAILJS_TEMPLATE_ID = 'template_8ozp076';
const EMAILJS_PUBLIC_KEY = 'FsgqljsX-d4Ea9-Ai';

const EASE = [0.16, 1, 0.3, 1] as const;

// We assume a single upcoming concert at a time — show the soonest.
const concert = concerts[0];

export default function ConcertsPage() {
  const t = useTranslations('concerts');
  const locale = useLocale() as 'en' | 'he';
  const isHe = locale === 'he';
  const titleFont = isHe ? 'var(--font-rubik), sans-serif' : 'var(--font-arimo), sans-serif';

  // Gallery carousel + fullscreen viewer (works for gallery and the poster).
  const [[slide, dir], setSlide] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [fsImages, setFsImages] = useState<string[]>([]);
  const [fsIndex, setFsIndex] = useState(0);

  const paginate = (d: number) => {
    setPaused(true);
    setSlide(([s]) => [(s + d + concertGallery.length) % concertGallery.length, d]);
  };
  const goTo = (i: number) => {
    setPaused(true);
    setSlide(([s]) => [i, i > s ? 1 : -1]);
  };
  const openFullscreen = (images: string[], index: number) => {
    setFsImages(images);
    setFsIndex(index);
    setFullscreen(true);
  };
  const fsPaginate = (d: number) =>
    setFsIndex((i) => (fsImages.length ? (i + d + fsImages.length) % fsImages.length : 0));

  useEffect(() => {
    if (paused || fullscreen || concertGallery.length <= 1) return;
    const id = setInterval(() => setSlide(([s]) => [(s + 1) % concertGallery.length, 1]), 5000);
    return () => clearInterval(id);
  }, [paused, fullscreen]);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false);
      if (e.key === 'ArrowRight') fsPaginate(isHe ? -1 : 1);
      if (e.key === 'ArrowLeft') fsPaginate(isHe ? 1 : -1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullscreen, isHe, fsImages.length]);

  // ── Registration ───────────────────────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [spots, setSpots] = useState(1);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [ticketId, setTicketId] = useState('');
  const qrRef = useRef<HTMLCanvasElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const phoneOk = /^[\d+\-()\s]{7,20}$/.test(phone);
  const formValid = name.trim().length >= 2 && phoneOk && emailOk;

  useEffect(() => {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }, []);

  useEffect(() => {
    if (status !== 'success' || !ticketId || !qrRef.current) return;
    QRCode.toCanvas(qrRef.current, ticketId, {
      width: 210,
      margin: 2,
      color: { dark: '#111111', light: '#ffffff' },
    }).catch(() => {});
  }, [status, ticketId]);

  const revealForm = () => {
    setShowForm(true);
    setStatus('idle');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formValid) return;
    setStatus('sending');
    const id = (
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
    )
      .replace(/-/g, '')
      .slice(0, 12)
      .toUpperCase();
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        name,
        email,
        phone,
        title: `הרשמה לקונצרט: ${concert.name.he}`,
        subject: `Concert registration — ${concert.name.en}`,
        message: [
          `Concert: ${concert.name.en} / ${concert.name.he}`,
          `Date: ${concert.date} · ${concert.time}`,
          `Seats: ${spots}`,
          `Total: ${spots * concert.price} ILS`,
          `Ticket ID: ${id}`,
          `Name: ${name}`,
          `Phone: ${phone}`,
          `Email: ${email}`,
        ].join('\n'),
      });
      setTicketId(id);
      setStatus('success');
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('error');
    }
  };

  // Build a printable ticket card (event details + registration summary + QR)
  // rather than downloading a bare QR image.
  const downloadTicket = async () => {
    const S = 2;
    const W = 720;
    const H = 1040;
    const cx = W / 2;
    const cv = document.createElement('canvas');
    cv.width = W * S;
    cv.height = H * S;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    ctx.scale(S, S);

    // High-resolution QR for crisp printing.
    const qrCv = document.createElement('canvas');
    try {
      await QRCode.toCanvas(qrCv, ticketId, {
        width: 600,
        margin: 1,
        color: { dark: '#111111', light: '#ffffff' },
      });
    } catch {
      return;
    }

    // Header logo.
    const logo = new window.Image();
    logo.src = '/images/ticket-logo.png';
    await new Promise<void>((res) => {
      logo.onload = () => res();
      logo.onerror = () => res();
    });

    // Card background + frame.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#e2e2e2';
    ctx.lineWidth = 2;
    ctx.strokeRect(22, 22, W - 44, H - 44);

    ctx.textAlign = 'center';
    ctx.direction = isHe ? 'rtl' : 'ltr';

    // Logo (preserve aspect ratio).
    if (logo.width) {
      const lw = 260;
      const lh = lw * (logo.height / logo.width);
      ctx.drawImage(logo, cx - lw / 2, 70, lw, lh);
    }

    ctx.fillStyle = '#111111';
    ctx.font = '600 42px Arial';
    ctx.fillText(concert.name[locale], cx, 232);

    ctx.fillStyle = '#3a3a3c';
    ctx.font = '400 19px Arial';
    ctx.direction = 'ltr';
    ctx.fillText(`${fmtDate(concert.date)}  ·  ${concert.time}`, cx, 272);
    ctx.direction = isHe ? 'rtl' : 'ltr';
    ctx.fillText(concert.venue[locale], cx, 302);

    // QR
    const qrSize = 300;
    ctx.drawImage(qrCv, cx - qrSize / 2, 340, qrSize, qrSize);

    // Reference id
    ctx.fillStyle = '#111111';
    ctx.font = '500 20px monospace';
    ctx.direction = 'ltr';
    ctx.fillText(ticketId, cx, 340 + qrSize + 44);
    ctx.direction = isHe ? 'rtl' : 'ltr';

    // Divider
    ctx.strokeStyle = '#ededed';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(96, 758);
    ctx.lineTo(W - 96, 758);
    ctx.stroke();

    // Registration summary
    ctx.fillStyle = '#111111';
    ctx.font = '400 21px Arial';
    let y = 802;
    [`${t('form_name')}: ${name}`, `${t('form_spots')}: ${spots}`].forEach((line) => {
      ctx.fillText(line, cx, y);
      y += 34;
    });

    // Footer note
    ctx.fillStyle = '#8a8a8f';
    ctx.font = '400 16px Arial';
    ctx.fillText(t('done_desc'), cx, H - 78);

    const a = document.createElement('a');
    a.href = cv.toDataURL('image/png');
    a.download = `trio-${concert.id}-ticket.png`;
    a.click();
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%' }),
    center: { x: '0%' },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%' }),
  };
  // Page entrance is handled once by the route template; in-page elements stay
  // static so they don't re-animate ("slide up") while scrolling.
  const reveal = { initial: false } as const;

  const BackArrow = isHe ? ChevronRight : ChevronLeft;
  const FwdArrow = isHe ? ChevronLeft : ChevronRight;

  const fmtDate = (iso: string) =>
    new Intl.DateTimeFormat(isHe ? 'he-IL' : 'en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(iso));

  const label = 'mb-2 block text-[11px] uppercase tracking-[0.18em] text-[var(--c-text)]';
  const field =
    'w-full rounded-lg border border-[var(--c-border)] bg-transparent px-4 py-3 text-[15px] text-[var(--c-text)] transition-colors focus:border-[var(--c-cat)] focus:outline-none';

  return (
    <>
      <section className="mx-auto max-w-[100rem] px-6 pb-24 pt-32 sm:px-10 md:pt-44 lg:px-16 lg:pt-52">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
          className="ms-4 text-6xl leading-[0.95] tracking-tight text-[var(--c-text)] sm:ms-8 sm:text-7xl md:ms-14 lg:ms-24 lg:text-8xl"
          style={{ fontFamily: titleFont, fontWeight: 500 }}
        >
          {t('hero_title')}
        </motion.h1>

        {/* Top split: concert + poster | gallery */}
        <div className="mt-16 grid grid-cols-1 gap-x-14 gap-y-12 md:mt-20 md:grid-cols-2">
          {/* Left — the single upcoming concert + its poster */}
          <motion.div {...reveal} className="order-1">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--c-text)]">
                  {fmtDate(concert.date)} · {concert.time}
                </p>
                <h2
                  className="mt-1.5 text-3xl tracking-tight text-[var(--c-text)] sm:text-4xl"
                  style={{ fontFamily: titleFont, fontWeight: 400 }}
                >
                  {concert.name[locale]}
                </h2>
              </div>
              <button
                onClick={revealForm}
                className="shrink-0 cursor-pointer rounded-full bg-[color:var(--c-cat)] px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] text-[var(--c-bg)] transition-colors duration-300 hover:bg-[color:var(--c-cat-active)]"
                style={{ fontFamily: titleFont, fontWeight: 400 }}
              >
                {t('register')}
              </button>
            </div>

            {/* Poster (square) */}
            <div
              className="group relative mt-8 aspect-square w-full cursor-pointer overflow-hidden rounded-2xl bg-[var(--c-bg-alt)]"
              onClick={() => openFullscreen([concert.poster], 0)}
            >
              <Image
                src={concert.poster}
                alt={concert.name[locale]}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </div>
          </motion.div>

          {/* Right — photo gallery (matches the left column's height) */}
          <motion.div {...reveal} className="order-2 md:h-full">
            <div
              className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl bg-[var(--c-bg-alt)] md:aspect-auto md:h-full"
              onClick={() => openFullscreen(concertGallery, slide)}
            >
              <AnimatePresence initial={false} custom={dir}>
                <motion.div
                  key={slide}
                  custom={dir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: EASE }}
                  className="absolute inset-0"
                >
                  <Image
                    src={concertGallery[slide]}
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 45vw"
                  />
                </motion.div>
              </AnimatePresence>

              {concertGallery.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous"
                    onClick={(e) => {
                      e.stopPropagation();
                      paginate(-1);
                    }}
                    className="absolute start-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                  >
                    <BackArrow size={20} />
                  </button>
                  <button
                    type="button"
                    aria-label="Next"
                    onClick={(e) => {
                      e.stopPropagation();
                      paginate(1);
                    }}
                    className="absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                  >
                    <FwdArrow size={20} />
                  </button>
                  <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                    {concertGallery.map((img, i) => (
                      <button
                        key={img}
                        type="button"
                        aria-label={`Go to image ${i + 1}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          goTo(i);
                        }}
                        className={`h-1.5 cursor-pointer rounded-full transition-all ${
                          i === slide ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Registration — revealed below on demand */}
        <AnimatePresence initial={false}>
          {showForm && (
            <motion.div
              ref={formRef}
              key="register"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              onAnimationComplete={() =>
                showForm && formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
              className="overflow-hidden"
            >
              <div className="mt-12 md:mt-16">
                {status === 'success' ? (
                  /* Confirmation + barcode */
                  <div className="flex flex-col items-center text-center">
                    <h2
                      className="text-3xl tracking-tight text-[var(--c-text)] sm:text-4xl"
                      style={{ fontFamily: titleFont, fontWeight: 400 }}
                    >
                      {t('done_title')}
                    </h2>
                    <p
                      className="mt-3 max-w-md text-[15px] leading-relaxed text-[var(--c-text)]"
                      style={{ fontFamily: titleFont, fontWeight: 400 }}
                    >
                      {t('done_desc')}
                    </p>
                    <div className="mt-8 inline-block rounded-2xl bg-white p-4 shadow-sm">
                      <canvas ref={qrRef} className="block h-[210px] w-[210px]" />
                    </div>
                    <p
                      className="mt-5 text-[15px] text-[var(--c-text)]"
                      style={{ fontFamily: titleFont, fontWeight: 400 }}
                    >
                      {t('done_email')} <span dir="ltr">{email}</span>
                    </p>
                    <button
                      onClick={downloadTicket}
                      className="mt-6 inline-block cursor-pointer rounded-full bg-[color:var(--c-cat)] px-7 py-3 text-[11px] uppercase tracking-[0.25em] text-[var(--c-bg)] transition-colors duration-300 hover:bg-[color:var(--c-cat-active)]"
                      style={{ fontFamily: titleFont, fontWeight: 400 }}
                    >
                      {t('download')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-2">
                      {/* Details */}
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                          <div>
                            <label className={label}>{t('form_name')} *</label>
                            <input
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className={field}
                            />
                          </div>
                          <div>
                            <label className={label}>{t('form_phone')} *</label>
                            <input
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              type="tel"
                              dir="ltr"
                              className={field}
                            />
                          </div>
                          <div>
                            <label className={label}>{t('form_email')} *</label>
                            <input
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              type="email"
                              dir="ltr"
                              className={field}
                            />
                          </div>
                          <div>
                            <label className={label}>{t('form_spots')}</label>
                            <div className="flex flex-wrap gap-2.5">
                              {[1, 2, 3, 4].map((n) => (
                                <button
                                  type="button"
                                  key={n}
                                  onClick={() => setSpots(n)}
                                  className={`h-11 w-11 cursor-pointer rounded-full border text-sm transition-colors ${
                                    spots === n
                                    ? 'border-[var(--c-text)] bg-[var(--c-text)] text-[var(--c-bg)]'
                                    : 'border-[var(--c-border)] text-[var(--c-text)] hover:border-[var(--c-text)]'
                                  }`}
                                >
                                  {n}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-baseline justify-between border-t border-[var(--c-border-lt)] pt-5">
                          <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--c-text)]">
                            {t('form_total')}
                          </span>
                          <span
                            className="text-xl text-[var(--c-text)]"
                            style={{ fontFamily: titleFont, fontWeight: 400 }}
                            dir="ltr"
                          >
                            {spots * concert.price} ₪
                          </span>
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="rounded-2xl border border-[var(--c-border)] p-6">
                        <h3
                          className="mb-3 text-[15px] font-semibold text-[var(--c-text)]"
                          style={{ fontFamily: 'var(--font-dm-sans), var(--font-heebo), sans-serif' }}
                        >
                          {t('how_title')}
                        </h3>
                        <ul className="space-y-2.5 text-sm leading-relaxed text-[var(--c-text)]">
                          {[t('note1'), t('note2', { price: concert.price }), t('note3')].map(
                            (n, i) => (
                              <li key={i} className="ps-5 -indent-5">
                                <span className="me-2 text-[color:var(--c-cat)]">✦</span>
                                {n}
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    </div>

                    {status === 'error' && (
                      <p className="mt-6 text-center text-sm text-red-500">{t('err_general')}</p>
                    )}

                    {/* One register button, enabled only when the form is complete */}
                    <div className="mt-10 flex justify-center">
                      <button
                        type="submit"
                        disabled={!formValid || status === 'sending'}
                        className="inline-block cursor-pointer rounded-full bg-[color:var(--c-cat)] px-10 py-3.5 text-[11px] uppercase tracking-[0.25em] text-[var(--c-bg)] transition-colors duration-300 hover:bg-[color:var(--c-cat-active)] disabled:cursor-not-allowed disabled:opacity-40"
                        style={{ fontFamily: titleFont, fontWeight: 400 }}
                      >
                        {status === 'sending' ? t('form_sending') : t('form_submit')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Fullscreen image viewer */}
      <AnimatePresence>
        {fullscreen && fsImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
            onClick={() => setFullscreen(false)}
          >
            <button
              onClick={() => setFullscreen(false)}
              aria-label="Close"
              className="absolute right-5 top-5 z-10 cursor-pointer text-white/70 transition-colors hover:text-white"
            >
              <X size={28} strokeWidth={1.5} />
            </button>

            {fsImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    fsPaginate(isHe ? 1 : -1);
                  }}
                  aria-label="Previous"
                  className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer text-white/60 transition-colors hover:text-white"
                >
                  <ChevronLeft size={38} strokeWidth={1.5} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    fsPaginate(isHe ? -1 : 1);
                  }}
                  aria-label="Next"
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-white/60 transition-colors hover:text-white"
                >
                  <ChevronRight size={38} strokeWidth={1.5} />
                </button>
              </>
            )}

            <motion.div
              key={fsIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) fsPaginate(1);
                else if (info.offset.x > 60) fsPaginate(-1);
              }}
              className="relative h-[85vh] w-full max-w-5xl touch-pan-y"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={fsImages[fsIndex]}
                alt=""
                fill
                sizes="90vw"
                draggable={false}
                className="pointer-events-none object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
