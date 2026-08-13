import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookButton from "@/components/BookButton";
import { ArrowRight, Check } from "@/components/icons";
import {
  getEquipmentBySlug,
  getEquipmentSlugs,
  getEquipments,
} from "@/sanity/lib/fetchers";

export async function generateStaticParams() {
  const slugs = await getEquipmentSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getEquipmentBySlug(slug);
  if (!item) return {};
  return {
    title: item.seoTitle || `${item.name} — ${item.category} at RenovaAura`,
    description:
      item.seoDescription ||
      item.shortDescription ||
      item.detailedDescription.slice(0, 160),
    alternates: { canonical: `/tools-equipments/${item.slug}` },
  };
}

export default async function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [item, all] = await Promise.all([
    getEquipmentBySlug(slug),
    getEquipments(),
  ]);
  if (!item) return notFound();

  const related = all
    .filter((e) => e.category === item.category && e.slug !== item.slug)
    .slice(0, 3);

  // FAQ structured data helps these pages win rich results / AI citations.
  const faqJsonLd =
    item.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: item.faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <>
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <section className="pillar-hero">
        <div className="container">
          <Link href="/tools-equipments" className="equipment-back">
            ← Back to Lasers / Technologies
          </Link>

          {/* Section switcher — each pill is its own URL, so clicking one
              navigates to that machine's page (the URL changes). */}
          {all.length > 1 && (
            <div
              className="procedure-tabs equipment-switcher"
              role="tablist"
              aria-label="Technologies"
            >
              {all.map((e) => (
                <Link
                  key={e.slug}
                  href={`/tools-equipments/${e.slug}`}
                  className={
                    "procedure-tab" + (e.slug === item.slug ? " active" : "")
                  }
                  aria-selected={e.slug === item.slug}
                  role="tab"
                >
                  {e.treatmentName || e.name}
                </Link>
              ))}
            </div>
          )}

          <div className="pillar-hero-grid">
            <div className="pillar-hero-text">
              <div className="pillar-hero-eyebrow">
                {item.category}
                {item.technologyPartner
                  ? ` · ${item.technologyPartner} technology partner`
                  : ""}
              </div>
              <h1 className="pillar-hero-headline">{item.name}</h1>
              <p className="pillar-hero-subtitle" style={{ marginTop: 22 }}>
                {item.shortDescription}
              </p>
              <div style={{ marginTop: 28 }}>
                <BookButton>Ask about this technology</BookButton>
              </div>
            </div>
            {item.image && (
              <div
                className="pillar-hero-image"
                style={{ backgroundImage: `url(${item.image})` }}
                role="img"
                aria-label={item.name}
              />
            )}
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="section" id="overview">
        <div className="container equipment-detail-copy">
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            Overview
          </div>
          {item.detailedDescription.split("\n").filter(Boolean).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Technology / specifications */}
      {item.specifications.length > 0 && (
        <section
          className="section"
          id="technology"
          style={{ background: "var(--cream-2)" }}
        >
          <div className="container">
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              The technology
            </div>
            <h2 style={{ marginBottom: 28 }}>How {item.name} works.</h2>
            <div className="equipment-spec-grid">
              {item.specifications.map((s, i) => (
                <div key={i} className="equipment-spec">
                  <div className="equipment-spec-label">{s.label}</div>
                  <div className="equipment-spec-value">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Key benefits */}
      {item.keyBenefits.length > 0 && (
        <section className="section" id="benefits">
          <div className="container">
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              Key benefits
            </div>
            <ul className="equipment-benefits">
              {item.keyBenefits.map((b, i) => (
                <li key={i}>
                  <Check size={16} /> {b}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Treatment areas / indications */}
      {item.treatmentAreas.length > 0 && (
        <section
          className="section"
          id="areas"
          style={{ background: "var(--cream-2)" }}
        >
          <div className="container">
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              Treatment areas &amp; indications
            </div>
            <div className="equipment-areas">
              {item.treatmentAreas.map((a, i) => (
                <span key={i} className="equipment-area-chip">
                  {a}
                </span>
              ))}
            </div>
            {item.idealFor && (
              <p className="equipment-ideal">{item.idealFor}</p>
            )}
          </div>
        </section>
      )}

      {/* FAQs */}
      {item.faqs.length > 0 && (
        <section className="section" id="faqs">
          <div className="container">
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              Frequently asked
            </div>
            <div className="equipment-faqs">
              {item.faqs.map((f, i) => (
                <div key={i} className="equipment-faq">
                  <h3 className="equipment-faq-q">{f.question}</h3>
                  <p className="equipment-faq-a">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="section" style={{ background: "var(--cream-2)" }}>
          <div className="container">
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              Related technology
            </div>
            <h2 style={{ marginBottom: 32 }}>More in {item.category}.</h2>
            <div className="equipment-grid">
              {related.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/tools-equipments/${entry.slug}`}
                  className="equipment-card"
                >
                  {entry.image && (
                    <div
                      className="equipment-card-image"
                      style={{ backgroundImage: `url(${entry.image})` }}
                    />
                  )}
                  <div className="equipment-card-body">
                    <h3 className="equipment-card-title">{entry.name}</h3>
                    <p className="equipment-card-copy">
                      {entry.shortDescription}
                    </p>
                    <span className="proc-card-link">
                      View details <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
