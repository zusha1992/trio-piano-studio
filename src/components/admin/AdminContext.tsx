'use client';

import { createContext, useContext } from 'react';

export interface AdminValue {
  /** A valid admin session exists. */
  authed: boolean;
  /** Inline editing affordances are shown. */
  editMode: boolean;
  /** Open the login modal (or, if already authed, just enable edit mode). */
  openLogin: () => void;
  setEditMode: (on: boolean) => void;
  logout: () => void;
}

// Safe no-op default so consumers (e.g. the Logo) never crash if rendered
// outside the provider.
export const AdminContext = createContext<AdminValue>({
  authed: false,
  editMode: false,
  openLogin: () => {},
  setEditMode: () => {},
  logout: () => {},
});

export function useAdmin(): AdminValue {
  return useContext(AdminContext);
}
