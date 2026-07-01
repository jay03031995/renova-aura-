import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { getBodyConcerns } from "@/sanity/lib/fetchers";

export const metadata: Metadata = {
  title: "Body Concerns — Personalised Body Aesthetic Care",
  description:
    "Doctor-led body concern protocols at RenovaAura, managed from Sanity and tailored to each patient.",
  alternates: { canonical: "/body-concerns" },
};

export default async function BodyConcernsIndexPage() {
  const concerns = await getBodyConcerns();

  return (
    <>
      <section className="pillar-hero">
        <div className="container">
          <div className="pillar-hero-eyebrow">Body Concerns</div>
          <h1 className="pillar-hero-headline">
            Body protocols planned around your concern.
          </h1>
          <p className="pillar-hero-subtitle">
            Explore body-focused concerns and the packages our specialists may
            recommend after assessment.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="proc-grid">
            {concerns.map((c) => (
              <Link
                key={c.slug}
                href={`/body-concerns/${c.slug}`}
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
