'use client';

import { useCallback, useEffect, useState, type ReactNode, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, Languages, X } from 'lucide-react';
import { AdminContext } from './AdminContext';
import AnalyticsPanel from './AnalyticsPanel';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AdminProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  // Resume an existing session on load so edit mode survives refreshes.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/session')
      .then((r) => r.json() as Promise<{ authed?: boolean }>)
      .then((d) => {
        if (!cancelled && d.authed) {
          setAuthed(true);
          setEditMode(true);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const openLogin = useCallback(() => {
    setAuthed((isAuthed) => {
      if (isAuthed) setEditMode(true);
      else setLoginOpen(true);
      return isAuthed;
    });
  }, []);

  const logout = useCallback(() => {
    fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
    setAuthed(false);
    setEditMode(false);
  }, []);

  const onLoggedIn = useCallback(() => {
    setAuthed(true);
    setEditMode(true);
    setLoginOpen(false);
  }, []);

  return (
    <AdminContext.Provider value={{ authed, editMode, openLogin, setEditMode, logout }}>
      {children}

      <AnimatePresence>
        {loginOpen && <LoginModal key="login" onClose={() => setLoginOpen(false)} onSuccess={onLoggedIn} />}
      </AnimatePresence>

      <AnimatePresence>
        {authed && (
          <EditToolbar
            key="toolbar"
            editMode={editMode}
            onToggle={() => setEditMode(!editMode)}
            onLogout={logout}
            onAnalytics={() => setAnalyticsOpen(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {analyticsOpen && <AnalyticsPanelWrapper key="analytics" onClose={() => setAnalyticsOpen(false)} />}
      </AnimatePresence>
    </AdminContext.Provider>
  );
}

// Thin wrapper so AnimatePresence has a element to key on while the panel
// mounts/unmounts (the panel itself portals to <body>).
function AnalyticsPanelWrapper({ onClose }: { onClose: () => void }) {
  return <AnalyticsPanel onClose={onClose} />;
}

function LoginModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) onSuccess();
      else setError(data.error ?? 'Sign in failed.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setPending(false);
    }
  };

  const field =
    'w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-[15px] text-neutral-900 outline-none transition-colors focus:border-neutral-900';
  const label = 'mb-2 block text-[11px] uppercase tracking-[0.18em] text-neutral-500';

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="relative w-full max-w-sm rounded-2xl bg-white p-8 text-neutral-900 shadow-2xl"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute end-4 top-4 text-neutral-400 transition-colors hover:text-neutral-900"
        >
          <X size={18} />
        </button>

        <div className="mb-7 text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">Trio Piano Studio</p>
          <h2 className="mt-2 text-3xl tracking-tight" style={{ fontFamily: 'var(--font-cormorant), serif', fontWeight: 500 }}>
            Admin
          </h2>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className={label} htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
            />
          </div>
          <div>
            <label className={label} htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={field}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="mt-1 w-full cursor-pointer rounded-lg bg-neutral-900 px-6 py-3 text-[12px] uppercase tracking-[0.25em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function EditToolbar({
  editMode,
  onToggle,
  onLogout,
  onAnalytics,
}: {
  editMode: boolean;
  onToggle: () => void;
  onLogout: () => void;
  onAnalytics: () => void;
}) {
  // Fills missing en/ar/ru translations for existing content by looping the
  // batched backfill endpoint until it reports done.
  const [translating, setTranslating] = useState(false);
  const [translateMsg, setTranslateMsg] = useState<string | null>(null);

  const runTranslate = useCallback(async () => {
    if (translating) return;
    setTranslating(true);
    setTranslateMsg('Translating…');
    let filled = 0;
    try {
      for (let i = 0; i < 100; i += 1) {
        const res = await fetch('/api/admin/translate-all', { method: 'POST' });
        const data = (await res.json()) as {
          ok?: boolean;
          processed?: number;
          remaining?: number;
          done?: boolean;
          error?: string;
        };
        if (!res.ok || !data.ok) {
          setTranslateMsg(data.error ?? 'Failed');
          break;
        }
        filled += data.processed ?? 0;
        if (data.done) {
          setTranslateMsg(filled ? `Filled ${filled}` : 'Up to date');
          break;
        }
        setTranslateMsg(`Translating… ${filled} (${data.remaining} left)`);
      }
    } catch {
      setTranslateMsg('Network error');
    } finally {
      setTranslating(false);
      setTimeout(() => setTranslateMsg(null), 4000);
    }
  }, [translating]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="fixed bottom-5 left-1/2 z-[90] -translate-x-1/2"
    >
      <div className="flex items-center gap-3 rounded-full bg-white px-3 py-2 text-neutral-900 shadow-[0_6px_30px_rgba(0,0,0,0.18)] ring-1 ring-black/10">
        <span className="ps-2 text-[11px] uppercase tracking-[0.2em] text-neutral-500">Admin</span>

        <button
          type="button"
          onClick={onToggle}
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] transition-colors ${
            editMode ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${editMode ? 'bg-green-400' : 'bg-neutral-400'}`} />
          {editMode ? 'Editing' : 'Edit off'}
        </button>

        <button
          type="button"
          onClick={onAnalytics}
          aria-label="Analytics"
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <BarChart3 size={13} />
          Analytics
        </button>

        <button
          type="button"
          onClick={runTranslate}
          disabled={translating}
          aria-label="Fill translations"
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-50"
        >
          <Languages size={13} />
          {translateMsg ?? 'Translate'}
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-neutral-500 transition-colors hover:text-neutral-900"
        >
          Sign out
        </button>
      </div>
    </motion.div>
  );
}
