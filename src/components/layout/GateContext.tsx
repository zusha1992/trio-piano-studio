'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface GateContextValue {
  /** True while the curtain should be closing over the current page before going home. */
  homeClosing: boolean;
  /** Ask the gate to close the curtain, then navigate home (called by the logo). */
  requestCloseHome: () => void;
  /** Clear the closing request once we've arrived home. */
  clearCloseHome: () => void;
}

const GateContext = createContext<GateContextValue | null>(null);

export function GateProvider({ children }: { children: ReactNode }) {
  const [homeClosing, setHomeClosing] = useState(false);

  const requestCloseHome = useCallback(() => setHomeClosing(true), []);
  const clearCloseHome = useCallback(() => setHomeClosing(false), []);

  const value = useMemo(
    () => ({ homeClosing, requestCloseHome, clearCloseHome }),
    [homeClosing, requestCloseHome, clearCloseHome],
  );

  return <GateContext.Provider value={value}>{children}</GateContext.Provider>;
}

export function useGate() {
  return useContext(GateContext);
}
