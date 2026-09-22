"use client";

import { useBooking } from "@/components/BookingContext";

type Card = {
  cls: string;
  when: string;
  doctor: string;
  sub: string;
  pill: string;
  pillCls?: string;
  /** Pre-fill the booking form when this card is clicked. */
  concern: string;
};

const CARDS: Card[] = [
  {
    cls: "c1",
    when: "Today · 4:30 PM",
    doctor: "Dr. Bhawna Bhardwaj",
    sub: "Dermatology · Hair Transplant Consult",
    pill: "2 slots left",
    concern: "Consult — Dr. Bhawna Bhardwaj (Dermatology)",
  },
  {
    cls: "c2",
    when: "Tomorrow · 11:00 AM",
    doctor: "Dr. Ankur Bhatia",
    sub: "Plastic Surgery · Rhinoplasty Review",
    pill: "Open",
    pillCls: "cocoa",
    concern: "Consult — Dr. Ankur Bhatia (Plastic Surgery)",
  },
];

export default function SimpleBookCards() {
  const { open } = useBooking();
  return (
    <div className="simple-book-visual reveal">
      <div className="sbv-orbit" />
      {CARDS.map((card) => (
        <button
          key={card.cls}
          type="button"
          className={`sbv-card ${card.cls} sbv-card-clickable`}
          onClick={() =>
            open({ concern: card.concern, source: "website-simplebook" })
          }
          aria-label={`Book a consultation with ${card.doctor}`}
        >
          <div className="sbv-hd">{card.when}</div>
          <div className="sbv-title">{card.doctor}</div>
          <div className="sbv-sub">{card.sub}</div>
          <div className="sbv-row">
            <span style={{ color: "var(--muted)" }}>Availability</span>
            <span className={"pill" + (card.pillCls ? " " + card.pillCls : "")}>
              {card.pill}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
