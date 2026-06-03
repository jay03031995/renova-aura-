"use client";

import { createContext, useCallback, useContext, useState } from "react";

/** Optional context to pre-fill the booking form (e.g. from a package card). */
export type BookingPrefill = { concern?: string; source?: string };

type BookingContextValue = {
  isOpen: boolean;
  prefill: BookingPrefill | null;
  open: (prefill?: BookingPrefill) => void;
  close: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefill, setPrefill] = useState<BookingPrefill | null>(null);
  const open = useCallback((p?: BookingPrefill) => {
    setPrefill(p ?? null);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <BookingContext.Provider value={{ isOpen, prefill, open, close }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within a BookingProvider");
  return ctx;
}
