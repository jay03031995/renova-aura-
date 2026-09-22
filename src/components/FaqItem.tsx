"use client";

import { useState } from "react";

export default function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={"faq-item" + (open ? " open" : "")}>
      <button
        className="faq-q"
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className="faq-toggle">+</span>
      </button>
      <div className="faq-a">{a}</div>
    </div>
  );
}
