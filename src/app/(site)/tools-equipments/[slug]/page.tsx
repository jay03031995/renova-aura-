import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookButton from "@/components/BookButton";
import { ArrowRight } from "@/components/icons";
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
    title: item.seoTitle || item.name,
    description:
      item.seoDescription || item.shortDescription || item.detailedDescription.slice(0, 160),
    alternates: { canonical: `/tools-equipments/${item.slug}` },
  };
}

export default async function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getEquipmentBySlug(slug);
  if (!item) return notFound();

  const related = (await getEquipments())
    .filter((entry) => entry.category === item.category && entry.slug !== item.slug)
    .slice(0, 3);

  return (
    <>
      <section className="pillar-hero">
        <div className="container">
          <Link
            href="/tools-equipments"
            style={{
              fontSize: 13,
              color: "var(--tan)",
              marginBottom: 18,
              display: "inline-block",
            }}
          >
            ← Back to Tools & Equipments
          </Link>
          <div className="pillar-hero-grid">
            <div className="pillar-hero-text">
              <div className="pillar-hero-eyebrow">{item.category}</div>
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

      <section className="section">
        <div className="container equipment-detail-copy">
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            Detailed Description
          </div>
          <p>{item.detailedDescription}</p>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section" style={{ background: "var(--cream-2)" }}>
          <div className="container">
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              Related Technology
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
