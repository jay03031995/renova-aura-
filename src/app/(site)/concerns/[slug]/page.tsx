import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "@/components/icons";
import BookButton from "@/components/BookButton";
import FaqItem from "@/components/FaqItem";
import { type Concern } from "@/data/concerns";
import { PROCEDURE_BY_SLUG, type Procedure } from "@/data/procedures";
import {
  getConcernBySlug,
  getConcernSlugs,
  getProcedureBySlug,
} from "@/sanity/lib/fetchers";

export async function generateStaticParams() {
  const slugs = await getConcernSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = await getConcernBySlug(slug);
  if (!c) return {};
  return {
    title: c.name,
    description: c.summary.slice(0, 160),
    alternates: { canonical: `/concerns/${c.slug}` },
  };
}

export default async function ConcernPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = await getConcernBySlug(slug);
  if (!c) return notFound();

  // Resolve related procedures via the fetcher (Sanity-first, static-fallback)
  // so that a procedure being edited in Studio reflects on the concern page too.
  const relatedProcedures: Procedure[] = [];
  for (const procSlug of c.relatedProcedureSlugs) {
    // Try Sanity first; fall back to local PROCEDURE_BY_SLUG map.
    const resolved =
      (await getProcedureBySlug(procSlug)) ?? PROCEDURE_BY_SLUG[procSlug];
    if (resolved) relatedProcedures.push(resolved);
  }

  return <ConcernDetail c={c} relatedProcedures={relatedProcedures} />;
}

function ConcernDetail({
  c,
  relatedProcedures,
}: {
  c: Concern;
  relatedProcedures: Procedure[];
}) {
  // FAQPage JSON-LD for Google rich snippets (EEAT).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
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
            href="/concerns"
            style={{
              fontSize: 13,
              color: "var(--tan)",
              marginBottom: 18,
              display: "inline-block",
            }}
          >
            ← Back to Skin Concerns
          </Link>
          <div className="pillar-hero-grid">
            <div className="pillar-hero-text">
              <div
                style={{
                  fontSize: 40,
                  color: "var(--sage)",
                  marginBottom: 8,
                  lineHeight: 1,
                }}
              >
                {c.icon}
              </div>
              <div className="pillar-hero-eyebrow">{c.name}</div>
              <h1 className="pillar-hero-headline">{c.headline}</h1>
              <p
                className="pillar-hero-subtitle"
                style={{ marginTop: 22 }}
              >
                {c.summary}
              </p>
              <div style={{ marginTop: 28 }}>
                <BookButton>Book a consultation</BookButton>
              </div>
            </div>
            {c.image && (
              <div
                className="pillar-hero-image"
                style={{ backgroundImage: `url(${c.image})` }}
                role="img"
                aria-label={`${c.name} — illustrative photograph`}
              />
            )}
          </div>
        </div>
      </section>

      {/* Symptoms + Causes */}
      <section className="section">
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
          }}
        >
          <div>
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              What you might notice
            </div>
            <h2 style={{ fontSize: 28, marginBottom: 24 }}>Symptoms</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {c.symptoms.map((s, i) => (
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
                  <span style={{ color: "var(--sage)", marginTop: 4 }}>◍</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              What&apos;s actually happening
            </div>
            <h2 style={{ fontSize: 28, marginBottom: 24 }}>Common causes</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {c.causes.map((cause, i) => (
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
                  {cause}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* RenovaAura Approach */}
      <section
        className="section"
        style={{ background: "var(--cream-2)" }}
      >
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            How RenovaAura treats this
          </div>
          <h2 style={{ marginBottom: 40 }}>Our approach.</h2>
          <ol
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              counterReset: "approach",
              display: "grid",
              gap: 18,
              maxWidth: 880,
            }}
          >
            {c.approach.map((step, i) => (
              <li
                key={i}
                style={{
                  background: "var(--paper)",
                  padding: "22px 26px",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--line)",
                  display: "flex",
                  gap: 18,
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    background: "var(--sage)",
                    color: "var(--cream)",
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ fontSize: 15, lineHeight: 1.6 }}>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Related Procedures */}
      {relatedProcedures.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              Procedures used for this concern
            </div>
            <h2 style={{ marginBottom: 40 }}>
              What we may recommend.
            </h2>
            <div className="proc-grid">
              {relatedProcedures.map((p) => (
                <Link
                  key={p.slug}
                  href={`/procedures/${p.pillar}/${p.slug}`}
                  className="proc-card"
                >
                  {p.tag && <span className="proc-card-tag">{p.tag}</span>}
                  <h3 className="proc-card-title">{p.name}</h3>
                  <p className="proc-card-headline">{p.headline}</p>
                  <span className="proc-card-link">
                    Procedure details <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
            Patient questions
          </div>
          <h2 style={{ marginBottom: 32 }}>What people usually ask.</h2>
          {c.faqs.map((f, i) => (
            <FaqItem key={i} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        className="section"
        style={{ background: "var(--cocoa)", color: "var(--cream)" }}
      >
        <div
          className="container"
          style={{
            textAlign: "center",
            maxWidth: 700,
            margin: "0 auto",
          }}
        >
          <h2 style={{ color: "var(--cream)", marginBottom: 18 }}>
            Not sure where to start?
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,.85)",
              marginBottom: 30,
              fontSize: 16,
            }}
          >
            Book a private consultation. We&apos;ll examine your skin, identify
            the cause, and give you a written plan with realistic timelines
            and costs — no obligation.
          </p>
          <BookButton>Book your consultation</BookButton>
        </div>
      </section>
    </>
  );
}
