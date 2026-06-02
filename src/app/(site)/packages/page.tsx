import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import BookButton from "@/components/BookButton";
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
                    <div key={p.slug} className="pkg-card">
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
                          className="btn btn-ghost btn-sm"
                          withArrow={false}
                        >
                          Enquire
                        </BookButton>
                      </div>
                      {p.concernSlug && (
                        <Link
                          className="pkg-card-link"
                          href={`/concerns/${p.concernSlug}`}
                        >
                          About this concern <ArrowRight size={13} />
                        </Link>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
