import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Clock } from "@/components/icons";
import BookButton from "@/components/BookButton";
import FaqItem from "@/components/FaqItem";
import RelatedContentSections from "@/components/RelatedContentSections";
import { type Procedure } from "@/data/procedures";
import {
  getProcedureBySlug,
  getProcedureSlugs,
} from "@/sanity/lib/fetchers";

export async function generateStaticParams() {
  const slugs = await getProcedureSlugs();
  return slugs.map(({ pillar, slug }) => ({ pillar, slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pillar: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProcedureBySlug(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.headline,
    alternates: { canonical: `/procedures/${p.pillar}/${p.slug}` },
  };
}

export default async function ProcedurePage({
  params,
}: {
  params: Promise<{ pillar: string; slug: string }>;
}) {
  const { pillar, slug } = await params;
  const p = await getProcedureBySlug(slug);
  if (!p || p.pillar !== pillar) return notFound();

  return <ProcedureDetail p={p} />;
}

function ProcedureDetail({ p }: { p: Procedure }) {
  // EEAT — MedicalProcedure JSON-LD with FAQ schema for rich snippets.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalProcedure",
        name: p.name,
        description: p.overview,
        bodyLocation:
          p.pillar === "hair-transplant" ? "Scalp" : "Face and body",
        procedureType: "https://schema.org/PercutaneousProcedure",
        howPerformed: p.process.map((s) => s.t).join("; "),
      },
      {
        "@type": "FAQPage",
        mainEntity: p.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="pillar-hero">
        <div className="container">
          <Link
            href={`/procedures/${p.pillar}`}
            style={{
              fontSize: 13,
              color: "var(--tan)",
              marginBottom: 18,
              display: "inline-block",
            }}
          >
            ← Back to{" "}
            {p.pillar === "hair-transplant"
              ? "Hair Transplant"
              : "Plastic Surgery"}
          </Link>
          <div className="pillar-hero-grid">
            <div className="pillar-hero-text">
              <div className="pillar-hero-eyebrow">{p.name}</div>
              <h1 className="pillar-hero-headline">{p.headline}</h1>
              <p
                className="pillar-hero-subtitle"
                style={{ marginTop: 22 }}
              >
                {p.overview}
              </p>
              <div style={{ marginTop: 28 }}>
                <BookButton>Book a consultation</BookButton>
              </div>
            </div>
            {p.image && (
              <div
                className="pillar-hero-image"
                style={{ backgroundImage: `url(${p.image})` }}
                role="img"
                aria-label={`${p.name} — illustrative photograph`}
              />
            )}
          </div>
        </div>
      </section>

      {/* Quick facts strip */}
      <section
        className="section-tight"
        style={{
          background: "var(--paper)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div className="container dp-quickfacts">
          <QuickFact label="Duration" value={p.quick.duration} />
          <QuickFact label="Sessions" value={p.quick.sessions} />
          <QuickFact label="Downtime" value={p.quick.downtime} />
          {p.quick.anaesthesia && (
            <QuickFact label="Anaesthesia" value={p.quick.anaesthesia} />
          )}
        </div>
      </section>

      {/* Two-column: key points + suitable for */}
      <section className="section">
        <div className="container dp-keypoints">
          <div>
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              Key points
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {p.keyPoints.map((k, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: 12,
                    marginBottom: 16,
                    fontSize: 15,
                    color: "var(--ink)",
                    lineHeight: 1.55,
                  }}
                >
                  <span style={{ color: "var(--sage)", marginTop: 4 }}>
                    <Check size={16} />
                  </span>
                  {k}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              Suitable for
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {p.suitableFor.map((s, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: 12,
                    marginBottom: 16,
                    fontSize: 15,
                    color: "var(--ink)",
                    lineHeight: 1.55,
                  }}
                >
                  <span style={{ color: "var(--sage)", marginTop: 4 }}>
                    ◍
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Process steps */}
      <section className="section" style={{ background: "var(--cream-2)" }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            The Process
          </div>
          <h2 style={{ marginBottom: 40 }}>
            What happens, step by step.
          </h2>
          <div className="dp-cards-grid">
            {p.process.map((s, i) => (
              <div
                key={i}
                style={{
                  background: "var(--paper)",
                  padding: 28,
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--line)",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--tan)",
                    letterSpacing: ".15em",
                    textTransform: "uppercase",
                    marginBottom: 12,
                    fontWeight: 500,
                  }}
                >
                  Step {i + 1}
                </div>
                <h3 style={{ fontSize: 18, marginBottom: 10 }}>{s.t}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section">
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            Benefits
          </div>
          <h2 style={{ marginBottom: 40 }}>Why patients choose this.</h2>
          <div className="dp-cards-grid">
            {p.benefits.map((b, i) => (
              <div
                key={i}
                style={{
                  padding: 28,
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    color: "var(--sage)",
                    marginBottom: 14,
                  }}
                >
                  {b.i}
                </div>
                <h3 style={{ fontSize: 17, marginBottom: 10 }}>{b.t}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6 }}>{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RelatedContentSections
        packages={p.relatedPackages}
        procedures={p.relatedProcedures}
        technologies={p.technologiesUsed}
      />

      {/* FAQs */}
      <section
        className="section"
        style={{ background: "var(--cream-2)" }}
      >
        <div
          className="container"
          style={{ maxWidth: 820, margin: "0 auto" }}
        >
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            Frequently asked
          </div>
          <h2 style={{ marginBottom: 32 }}>
            Patient questions, answered honestly.
          </h2>
          <div>
            {p.faqs.map((f, i) => (
              <FaqItem key={i} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* EEAT — medical review attribution */}
      {(p.medicallyReviewedBy || p.lastReviewed) && (
        <section
          className="section-tight"
          style={{
            background: "var(--paper)",
            borderTop: "1px solid var(--line)",
          }}
        >
          <div
            className="container"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 13,
              color: "var(--muted)",
              flexWrap: "wrap",
            }}
          >
            <Clock size={14} />
            {p.medicallyReviewedBy && (
              <span>
                Medically reviewed by <strong>{p.medicallyReviewedBy}</strong>
              </span>
            )}
            {p.lastReviewed && (
              <span>· Last reviewed {p.lastReviewed}</span>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        className="section"
        style={{ background: "var(--cocoa)", color: "var(--cream)" }}
      >
        <div
          className="container"
          style={{ textAlign: "center", maxWidth: 700, margin: "0 auto" }}
        >
          <h2 style={{ color: "var(--cream)", marginBottom: 18 }}>
            Ready to talk to a specialist?
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,.85)",
              marginBottom: 30,
              fontSize: 16,
            }}
          >
            Book a private consultation. We&apos;ll review your specific case,
            walk you through your options, and give you a written plan — no
            obligation.
          </p>
          <BookButton>Book your consultation</BookButton>
        </div>
      </section>
    </>
  );
}

function QuickFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          color: "var(--tan)",
          letterSpacing: ".2em",
          textTransform: "uppercase",
          fontWeight: 500,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 16, color: "var(--cocoa)", fontWeight: 500 }}>
        {value}
      </div>
    </div>
  );
}
