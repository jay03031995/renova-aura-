import type { Metadata } from "next";
import { PackageCard } from "@/components/RelatedContentSections";
import { getPackages } from "@/sanity/lib/fetchers";
import { PACKAGE_CATEGORIES } from "@/data/packages";

export const metadata: Metadata = {
  title: "Treatment Packages — Acne, Pigmentation, Hair & Anti-Ageing",
  description:
    "RenovaAura's curated treatment packages — acne, acne scars, pigmentation, hair loss and anti-ageing. Multi-session protocols combining peels, lasers, GFC, PRP and more.",
  alternates: { canonical: "/packages" },
};

export default async function PackagesPage() {
  const packages = await getPackages();
  const categories = PACKAGE_CATEGORIES.filter((cat) =>
    packages.some((p) => p.category === cat.slug),
  );

  return (
    <>
      <section className="pillar-hero">
        <div className="container">
          <div className="pillar-hero-eyebrow">Treatment Packages</div>
          <h1 className="pillar-hero-headline">
            Curated protocols, not one-off sessions.
          </h1>
          <p className="pillar-hero-subtitle">
            Each package bundles the right sequence of treatments for a real
            result — combining peels, lasers, GFC, PRP and aesthetic injectables
            calibrated by our specialists.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {categories.map((cat) => (
            <div key={cat.slug} id={cat.slug} className="pkg-cat">
              <h2 className="pkg-cat-title">{cat.label}</h2>
              <div className="pkg-grid">
                {packages
                  .filter((p) => p.category === cat.slug)
                  .map((p) => (
                    <PackageCard key={p.slug} p={p} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
