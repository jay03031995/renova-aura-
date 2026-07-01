import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookButton from "@/components/BookButton";
import FaqItem from "@/components/FaqItem";
import { ArrowRight, Check } from "@/components/icons";
import {
  getBodyConcernBySlug,
  getBodyConcernSlugs,
} from "@/sanity/lib/fetchers";

export async function generateStaticParams() {
  const slugs = await getBodyConcernSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = await getBodyConcernBySlug(slug);
  if (!c) return {};
  return {
    title: c.name,
    description: c.summary.slice(0, 160),
    alternates: { canonical: `/body-concerns/${c.slug}` },
  };
}

export default async function BodyConcernPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = await getBodyConcernBySlug(slug);
  if (!c) return notFound();

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
            href="/body-concerns"
            style={{
              fontSize: 13,
              color: "var(--tan)",
              marginBottom: 18,
              display: "inline-block",
            }}
          >
            ← Back to Body Concerns
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
              <p className="pillar-hero-subtitle" style={{ marginTop: 22 }}>
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

      <section className="section">
        <div className="concern-two-col container">
          <div>
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              What you might notice
            </div>
            <h2 style={{ fontSize: 28, marginBottom: 24 }}>Symptoms</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {c.symptoms.map((s, i) => (
                <li key={i} className="concern-list-item">
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
                <li key={i} className="concern-list-item">
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

      <section className="section" style={{ background: "var(--cream-2)" }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            How RenovaAura treats this
          </div>
          <h2 style={{ marginBottom: 40 }}>Our approach.</h2>
          <ol className="approach-list">
            {c.approach.map((step, i) => (
              <li key={i} className="approach-list-item">
                <span className="approach-list-number">{i + 1}</span>
                <span style={{ fontSize: 15, lineHeight: 1.6 }}>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {c.relatedPackages.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              Procedures used for this concern
            </div>
            <h2 style={{ marginBottom: 40 }}>What we may recommend.</h2>
            <div className="pkg-grid">
              {c.relatedPackages.map((p) => (
                <div
                  key={p.slug}
                  className="pkg-card"
                  style={
                    p.image
                      ? ({
                          "--pkg-image": `url(${p.image})`,
                        } as CSSProperties)
                      : undefined
                  }
                >
                  <div className="pkg-card-top">
                    <h3 className="pkg-card-name">{p.name}</h3>
                    {p.includes && (
                      <p className="pkg-card-includes">{p.includes}</p>
                    )}
                  </div>
                  <div className="pkg-card-foot">
                    {p.price ? (
                      <span className="pkg-card-price">{p.price}</span>
                    ) : (
                      <span className="pkg-card-price pkg-card-price-muted">
                        Price on consult
                      </span>
                    )}
                    <BookButton
                      className="btn btn-primary btn-sm"
                      withArrow={false}
                      prefill={{
                        concern: `Package: ${p.name}`,
                        source: "website-package",
                      }}
                    >
                      Book this package
                    </BookButton>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 28 }}>
              <Link className="proc-card-link" href="/packages">
                See all packages <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="section" style={{ background: "var(--cream-2)" }}>
        <div className="container" style={{ maxWidth: 820, margin: "0 auto" }}>
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            Patient questions
          </div>
          <h2 style={{ marginBottom: 32 }}>What people usually ask.</h2>
          {c.faqs.map((f, i) => (
            <FaqItem key={i} q={f.q} a={f.a} />
          ))}
        </div>
      </section>
    </>
  );
}
