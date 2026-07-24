'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import emailjs from '@emailjs/browser';
import QRCode from 'qrcode';
import { concerts, concertGallery } from '@/data/concerts';
import ContactCTA from '@/components/sections/ContactCTA';

const EMAILJS_SERVICE_ID = 'service_52uluqq';
const EMAILJS_TEMPLATE_ID = 'template_8ozp076';
const EMAILJS_PUBLIC_KEY = 'FsgqljsX-d4Ea9-Ai';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ConcertsPage() {
  const t = useTranslations('concerts');
  const locale = useLocale() as 'en' | 'he';
  const isHe = locale === 'he';
  const titleFont = isHe ? 'var(--font-rubik), sans-serif' : 'var(--font-arimo), sans-serif';

  // Browse vs. register: `selected` is the concert index being registered for.
  const [selected, setSelected] = useState<number | null>(null);
  const concert = selected !== null ? concerts[selected] : null;

  // Poster shown in the browse view (defaults to the soonest concert).
  const [hovered, setHovered] = useState<string | null>(null);
  const posterConcert = concerts.find((c) => c.id === hovered) ?? concerts[0];

  // Gallery carousel (browse) + shared fullscreen viewer.
  const [[slide, dir], setSlide] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [fsIndex, setFsIndex] = useState(0);

  // In register mode the right side shows the single poster; otherwise gallery.
  const rightImages = selected === null ? concertGallery : concert ? [concert.poster] : [];

  const paginate = (d: number) => {
    setPaused(true);
    setSlide(([s]) => [(s + d + concertGallery.length) % concertGallery.length, d]);
  };
  const goTo = (i: number) => {
    setPaused(true);
    setSlide(([s]) => [i, i > s ? 1 : -1]);
  };
  const fsPaginate = (d: number) =>
    setFsIndex((i) => (rightImages.length ? (i + d + rightImages.length) % rightImages.length : 0));

  useEffect(() => {
    if (selected !== null || paused || fullscreen || concertGallery.length <= 1) return;
    const id = setInterval(() => setSlide(([s]) => [(s + 1) % concertGallery.length, 1]), 5000);
    return () => clearInterval(id);
  }, [selected, paused, fullscreen]);

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
  }, [fullscreen, isHe, rightImages.length]);

  // ── Registration form ──────────────────────────────────────────────
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [spots, setSpots] = useState(1);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [ticketId, setTicketId] = useState('');
  const qrRef = useRef<HTMLCanvasElement>(null);

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

  const openRegister = (i: number) => {
    setSelected(i);
    setStatus('idle');
    setErrors({});
  };
  const backToBrowse = () => {
    setSelected(null);
    setStatus('idle');
  };
  const gotoConcert = (d: number) => {
    if (selected === null) return;
    setSelected((selected + d + concerts.length) % concerts.length);
    setStatus('idle');
    setErrors({});
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!concert) return;
    const errs: typeof errors = {};
    if (name.trim().length < 2) errs.name = t('err_required');
    if (!phone.trim()) errs.phone = t('err_required');
    else if (!/^[\d+\-()\s]{7,20}$/.test(phone)) errs.phone = t('err_phone');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errs.email = t('err_email');
    setErrors(errs);
    if (Object.keys(errs).length) return;

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

  const downloadTicket = () => {
    const c = qrRef.current;
    if (!c) return;
    const a = document.createElement('a');
    a.href = c.toDataURL('image/png');
    a.download = `trio-${concert?.id ?? 'ticket'}.png`;
    a.click();
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%' }),
    center: { x: '0%' },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%' }),
  };
  const reveal = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.7, ease: EASE },
  } as const;

  const BackArrow = isHe ? ChevronRight : ChevronLeft;
  const FwdArrow = isHe ? ChevronLeft : ChevronRight;

  const fmtDate = (iso: string) =>
    new Intl.DateTimeFormat(isHe ? 'he-IL' : 'en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(iso));

  const label = 'mb-2 block text-[11px] uppercase tracking-[0.18em] text-[var(--c-muted)]';
  const field =
    'w-full rounded-lg border border-[var(--c-border)] bg-transparent px-4 py-3 text-[15px] text-[var(--c-text)] transition-colors focus:border-[var(--c-cat)] focus:outline-none';

  return (
    <>
      <section className="mx-auto max-w-[100rem] px-6 pb-24 pt-32 sm:px-10 md:pt-44 lg:px-16 lg:pt-52">
        {/* Kicker (register mode only) */}
        {concert && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            onClick={backToBrowse}
            className="ms-4 flex cursor-pointer items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-[color:var(--c-cat)] transition-colors hover:text-[color:var(--c-cat-active)] sm:ms-8 md:ms-14 lg:ms-24"
          >
            <BackArrow size={15} />
            {t('back')}
          </motion.button>
        )}

        {/* Title */}
        <motion.h1
          key={concert ? concert.id : 'browse'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: concert ? 0.05 : 0.1, duration: 0.7, ease: EASE }}
          className="ms-4 mt-2 text-6xl leading-[0.95] tracking-tight text-[var(--c-text)] sm:ms-8 sm:text-7xl md:ms-14 lg:ms-24 lg:text-8xl"
          style={{ fontFamily: titleFont, fontWeight: 500 }}
        >
          {concert ? concert.name[locale] : t('hero_title')}
        </motion.h1>

        {/* Main split */}
        <div className="mt-16 grid grid-cols-1 gap-x-14 gap-y-12 md:mt-20 md:grid-cols-2">
          {/* Left — list + poster (browse) or form/confirmation (register) */}
          <motion.div {...reveal} className="order-2 md:order-1">
            {selected === null ? (
              <>
                {/* Concert list */}
                <ul onMouseLeave={() => setHovered(null)}>
                  {concerts.map((c, i) => (
                    <li key={c.id}>
                      <button
                        onMouseEnter={() => setHovered(c.id)}
                        onClick={() => openRegister(i)}
                        className="group flex w-full cursor-pointer items-center justify-between gap-4 border-b border-[var(--c-border-lt)] py-5 text-start"
                      >
                        <span className="block">
                          <span className="block text-[11px] uppercase tracking-[0.25em] text-[var(--c-ultra-dim)]">
                            {fmtDate(c.date)} · {c.time}
                          </span>
                          <span
                            className="mt-1 block text-2xl tracking-tight text-[var(--c-text)] sm:text-3xl"
                            style={{ fontFamily: titleFont, fontWeight: 400 }}
                          >
                            {c.name[locale]}
                          </span>
                        </span>
                        <span
                          className="shrink-0 rounded-full bg-[color:var(--c-cat)] px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-[var(--c-bg)] transition-colors duration-300 group-hover:bg-[color:var(--c-cat-active)]"
                          style={{ fontFamily: titleFont, fontWeight: 400 }}
                        >
                          {t('register')}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Poster — one at a time, switches with the hovered concert */}
                <div className="relative mt-10 aspect-[3/4] w-full max-w-[18rem] overflow-hidden rounded-2xl bg-[var(--c-bg-alt)]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={posterConcert.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={posterConcert.poster}
                        alt={posterConcert.name[locale]}
                        fill
                        className="object-contain"
                        sizes="18rem"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </>
            ) : status === 'success' ? (
              /* Confirmation + barcode */
              <div>
                <h2
                  className="text-2xl tracking-tight text-[var(--c-text)] sm:text-3xl"
                  style={{ fontFamily: titleFont, fontWeight: 400 }}
                >
                  {t('done_title')}
                </h2>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[var(--c-dim)]">
                  {t('done_desc')}
                </p>
                <div className="mt-8 inline-block rounded-2xl bg-white p-4 shadow-sm">
                  <canvas ref={qrRef} className="block h-[210px] w-[210px]" />
                </div>
                <p className="mt-5 text-sm text-[var(--c-dim)]">
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
              /* Registration form */
              <div>
                {/* How it works */}
                <div className="mb-8 rounded-2xl border border-[var(--c-border)] p-6">
                  <h2
                    className="mb-4 text-sm uppercase tracking-[0.2em] text-[var(--c-text)]"
                    style={{ fontFamily: titleFont, fontWeight: 400 }}
                  >
                    {t('how_title')}
                  </h2>
                  <ul className="space-y-2.5 text-sm leading-relaxed text-[var(--c-dim)]">
                    {[t('note1'), t('note2', { price: concert!.price }), t('note3')].map((n, i) => (
                      <li key={i} className="flex gap-2.5">
                        <span className="mt-1 text-[color:var(--c-cat)]">✦</span>
                        <span>{n}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div>
                    <label className={label}>{t('form_name')} *</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className={field} />
                    {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className={label}>{t('form_phone')} *</label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        type="tel"
                        dir="ltr"
                        className={field}
                      />
                      {errors.phone && <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p>}
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
                      {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Seats */}
                  <div>
                    <label className={label}>
                      {t('form_spots')}
                      <span className="ms-2 lowercase tracking-normal text-[var(--c-ultra-dim)]">
                        · {t('form_spots_hint')}
                      </span>
                    </label>
                    <div className="flex gap-3">
                      {[1, 2, 3, 4].map((n) => (
                        <button
                          type="button"
                          key={n}
                          onClick={() => setSpots(n)}
                          className={`h-11 w-11 cursor-pointer rounded-full border text-sm transition-colors ${
                            spots === n
                              ? 'border-[var(--c-text)] bg-[var(--c-text)] text-[var(--c-bg)]'
                              : 'border-[var(--c-border)] text-[var(--c-dim)] hover:border-[var(--c-text)]'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-baseline justify-between border-t border-[var(--c-border-lt)] pt-5">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--c-muted)]">
                      {t('form_total')}
                    </span>
                    <span
                      className="text-xl text-[var(--c-text)]"
                      style={{ fontFamily: titleFont, fontWeight: 400 }}
                      dir="ltr"
                    >
                      {spots * concert!.price} ₪
                    </span>
                  </div>

                  {status === 'error' && (
                    <p className="text-sm text-red-500">{t('err_general')}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="inline-block cursor-pointer rounded-full bg-[color:var(--c-cat)] px-8 py-3 text-[11px] uppercase tracking-[0.25em] text-[var(--c-bg)] transition-colors duration-300 hover:bg-[color:var(--c-cat-active)] disabled:opacity-60"
                    style={{ fontFamily: titleFont, fontWeight: 400 }}
                  >
                    {status === 'sending' ? t('form_sending') : t('form_submit')}
                  </button>
                </form>
              </div>
            )}
          </motion.div>

          {/* Right — gallery (browse) or poster (register) */}
          <motion.div {...reveal} className="order-1 md:order-2">
            {selected === null ? (
              <div
                className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl bg-[var(--c-bg-alt)] md:aspect-square"
                onClick={() => {
                  setFsIndex(slide);
                  setFullscreen(true);
                }}
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
            ) : (
              <div
                className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl bg-[var(--c-bg-alt)] md:aspect-[4/5]"
                onClick={() => {
                  setFsIndex(0);
                  setFullscreen(true);
                }}
              >
                <Image
                  src={concert!.poster}
                  alt={concert!.name[locale]}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </div>
            )}
          </motion.div>
        </div>

        {/* Prev / next concert (register mode) */}
        {concert && (
          <div className="mt-20 flex items-stretch justify-between gap-4 md:mt-24">
            <button
              onClick={() => gotoConcert(-1)}
              className="group flex cursor-pointer items-center gap-2 text-[color:var(--c-cat)] transition-colors hover:text-[color:var(--c-cat-active)]"
            >
              <BackArrow size={18} className="shrink-0" />
              <span
                className="text-sm tracking-tight sm:text-base"
                style={{ fontFamily: titleFont, fontWeight: 400 }}
              >
                {concerts[(selected! - 1 + concerts.length) % concerts.length].name[locale]}
              </span>
            </button>
            <button
              onClick={() => gotoConcert(1)}
              className="group flex cursor-pointer items-center gap-2 text-end text-[color:var(--c-cat)] transition-colors hover:text-[color:var(--c-cat-active)]"
            >
              <span
                className="text-sm tracking-tight sm:text-base"
                style={{ fontFamily: titleFont, fontWeight: 400 }}
              >
                {concerts[(selected! + 1) % concerts.length].name[locale]}
              </span>
              <FwdArrow size={18} className="shrink-0" />
            </button>
          </div>
        )}
      </section>

      {/* Fullscreen image viewer */}
      <AnimatePresence>
        {fullscreen && rightImages.length > 0 && (
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

            {rightImages.length > 1 && (
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
              className="relative h-[85vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={rightImages[fsIndex]}
                alt=""
                fill
                sizes="90vw"
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ContactCTA />
    </>
  );
}
