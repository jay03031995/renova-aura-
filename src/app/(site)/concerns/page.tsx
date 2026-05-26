import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { CONCERNS } from "@/data/concerns";

export const metadata: Metadata = {
  title: "Skin Concerns — Personalised Dermatology Care",
  description:
    "Acne, pigmentation, anti-ageing, sensitive skin, dark circles and more. RenovaAura's dermatology team treats skin concerns with calibrated protocols — never generic.",
};

export default function ConcernsIndexPage() {
  return (
    <>
      <section className="pillar-hero">
        <div className="container">
          <div className="pillar-hero-eyebrow">Skin Concerns</div>
          <h1 className="pillar-hero-headline">
            Treated by the problem, not the procedure.
          </h1>
          <p className="pillar-hero-subtitle">
            Tell us what&apos;s troubling you and we&apos;ll match it to the
            right protocol — not the most-marketed treatment of the month.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="proc-grid">
            {CONCERNS.map((c) => (
              <Link
                key={c.slug}
                href={`/concerns/${c.slug}`}
                className="proc-card"
              >
                <div
                  className="proc-card-img"
                  style={{ backgroundImage: `url(${c.image})` }}
                >
                  <div className="proc-card-img-overlay" />
                </div>
                <div className="proc-card-inner">
                  <h3 className="proc-card-title">{c.name}</h3>
                  <p
                    className="proc-card-headline"
                    style={{ fontSize: 13, color: "var(--tan)" }}
                  >
                    {c.cardTagline}
                  </p>
                  <span className="proc-card-link">
                    Learn more <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
