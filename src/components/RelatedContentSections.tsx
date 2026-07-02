import Link from "next/link";
import BookButton from "@/components/BookButton";
import { ArrowRight } from "@/components/icons";
import type {
  Equipment,
  RelatedTreatmentCard,
} from "@/sanity/lib/fetchers";
import type { TreatmentPackage } from "@/data/packages";

type RelatedContentSectionsProps = {
  packages?: TreatmentPackage[];
  procedures?: RelatedTreatmentCard[];
  technologies?: Equipment[];
};

export default function RelatedContentSections({
  packages = [],
  procedures = [],
  technologies = [],
}: RelatedContentSectionsProps) {
  if (!packages.length && !procedures.length && !technologies.length) {
    return null;
  }

  return (
    <>
      {packages.length > 0 && (
        <section className="section related-section related-section-packages">
          <div className="container">
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              Related Packages
            </div>
            <h2 style={{ marginBottom: 40 }}>We may recommend.</h2>
            <div className="pkg-grid">
              {packages.map((p) => (
                <PackageCard key={p.slug} p={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {procedures.length > 0 && (
        <section className="section related-section">
          <div className="container">
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              Related Procedures
            </div>
            <h2 style={{ marginBottom: 40 }}>We may recommend.</h2>
            <div className="related-treatment-grid">
              {procedures.map((p) => (
                <Link key={`${p.href}-${p.slug}`} href={p.href} className="related-treatment-card">
                  {p.image && (
                    <div
                      className="related-treatment-media"
                      style={{ backgroundImage: `url(${p.image})` }}
                      aria-hidden="true"
                    />
                  )}
                  <div className="related-treatment-body">
                    <div className="related-treatment-meta">
                      {p.tag || p.category}
                    </div>
                    <h3 className="related-treatment-title">{p.name}</h3>
                    {p.description && (
                      <p className="related-treatment-copy">{p.description}</p>
                    )}
                    <span className="related-treatment-link">
                      View details <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {technologies.length > 0 && (
        <section className="section related-section related-section-tech">
          <div className="container">
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              Technologies Used
            </div>
            <h2 style={{ marginBottom: 40 }}>Clinical technology behind the plan.</h2>
            <div className="technology-grid">
              {technologies.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tools-equipments/${t.slug}`}
                  className="technology-card"
                >
                  {t.image && (
                    <div
                      className="technology-card-media"
                      style={{ backgroundImage: `url(${t.image})` }}
                      aria-hidden="true"
                    />
                  )}
                  <div className="technology-card-body">
                    <div className="technology-card-category">{t.category}</div>
                    <h3 className="technology-card-title">{t.name}</h3>
                    <p className="technology-card-copy">
                      {t.shortDescription || t.detailedDescription}
                    </p>
                    <span className="technology-card-link">
                      Explore technology <ArrowRight size={14} />
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

export function PackageCard({ p }: { p: TreatmentPackage }) {
  return (
    <div className="pkg-card">
      <div
        className="pkg-card-media"
        style={p.image ? { backgroundImage: `url(${p.image})` } : undefined}
        aria-hidden="true"
      />
      <div className="pkg-card-top">
        <h3 className="pkg-card-name">{p.name}</h3>
        {p.includes && <p className="pkg-card-includes">{p.includes}</p>}
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
          Book package
        </BookButton>
      </div>
      {p.concernSlug && (
        <Link className="pkg-card-link" href={`/concerns/${p.concernSlug}`}>
          About this concern <ArrowRight size={13} />
        </Link>
      )}
    </div>
  );
}
