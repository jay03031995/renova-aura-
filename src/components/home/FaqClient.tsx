"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export default function FaqClient({
  faqs,
}: {
  faqs: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState(0);

  return (
    <section className="section faq" id="faq">
      <div className="container">
        <div className="faq-grid">
          <div className="reveal">
            <div className="eyebrow" style={{ marginBottom: 16 }}>
              Frequently asked
            </div>
            <h2 style={{ marginBottom: 20 }}>
              Honest answers to the questions you&apos;d ask first.
            </h2>
            <p style={{ marginBottom: 28 }}>
              Can&apos;t find what you&apos;re looking for? Our care team replies
              within 10 minutes on WhatsApp.
            </p>
            <Link className="btn btn-sage" href="/#book">
              Message us on WhatsApp{" "}
              <span className="arrow">
                <ArrowRight />
              </span>
            </Link>
          </div>
          <div className="faq-list reveal">
            {faqs.map((f, i) => (
              <div
                className={"faq-item" + (i === open ? " open" : "")}
                key={i}
              >
                <button
                  className="faq-q"
                  type="button"
                  onClick={() => setOpen(i === open ? -1 : i)}
                  aria-expanded={i === open}
                >
                  <span>{f.q}</span>
                  <span className="faq-toggle">+</span>
                </button>
                <div className="faq-a">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
