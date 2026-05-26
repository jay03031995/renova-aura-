"use client";

import { useBooking } from "@/components/BookingContext";
import { ArrowRight } from "@/components/icons";

type Props = {
  className?: string;
  children: React.ReactNode;
  withArrow?: boolean;
};

export default function BookButton({
  className = "btn btn-primary",
  children,
  withArrow = true,
}: Props) {
  const { open } = useBooking();
  return (
    <button className={className} onClick={open} type="button">
      {children}
      {withArrow && (
        <span className="arrow">
          <ArrowRight />
        </span>
      )}
    </button>
  );
}
