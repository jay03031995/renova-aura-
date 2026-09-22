"use client";

import { useBooking, type BookingPrefill } from "@/components/BookingContext";
import { ArrowRight } from "@/components/icons";
import { trackEvent } from "@/lib/analytics";

type Props = {
  className?: string;
  children: React.ReactNode;
  withArrow?: boolean;
  /** Pre-fill the booking form (e.g. the package name) when opening. */
  prefill?: BookingPrefill;
};

export default function BookButton({
  className = "btn btn-primary",
  children,
  withArrow = true,
  prefill,
}: Props) {
  const { open } = useBooking();
  return (
    <button className={className} onClick={() => { trackEvent({ event: "appointment_start", label: prefill?.source }); open(prefill); }} type="button">
      {children}
      {withArrow && (
        <span className="arrow">
          <ArrowRight />
        </span>
      )}
    </button>
  );
}
