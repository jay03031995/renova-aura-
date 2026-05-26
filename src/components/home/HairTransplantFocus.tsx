import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { HAIR_PROCEDURES } from "@/data/procedures";

/**
 * Homepage section: the primary pillar — hair transplant.
 * Lists the 6 most-relevant hair procedures as cards, with a clear path
 * into the full /procedures/hair-transplant listing.
 */
const FEATURED_SLUGS = [
  "fue-hair-transplant",
  "dhi-hair-transplant",
  "sapphire-fue-hair-transplant",
  "beard-transplant",
  "eyebrow-transplant",
  "prp-hair-treatment",
];

export default function HairTransplantFocus() {
  const featured = FEATURED_SLUGS.map((s) =>
    HAIR_PROCEDURES.find((p) => p.slug === s),
  ).filter((p): p is (typeof HAIR_PROCEDURES)[number] => Boolean(p));

  return (
    <section className="section" id="hair-transplant">
      <div className="container">
        <div style={{ marginBottom: 50, maxWidth: 720 }}>
          <div className="eyebrow" style={{ marginBottom: 20 }}>
            Hair Transplant
          </div>
          <h2>Permanent hair restoration, designed by surgeons.</h2>
          <p style={{ marginTop: 18, fontSize: 17, lineHeight: 1.6 }}>
            Every hair restoration we perform is led by a board-certified
            surgeon and tailored to your hair pattern, donor density, and
            long-term goals. No franchise scripts. No graft inflation. Just
            honest, evidence-based hair restoration.
          </p>
        </div>

        <div className="proc-grid">
          {featured.map((p) => (
            <Link
              key={p.slug}
              href={`/procedures/${p.pillar}/${p.slug}`}
              className="proc-card"
            >
              {p.tag && <span className="proc-card-tag">{p.tag}</span>}
              <h3 className="proc-card-title">{p.name}</h3>
              <p className="proc-card-headline">{p.headline}</p>
              <div className="proc-card-meta">
                <span>⏱ {p.quick.duration}</span>
                <span>↻ {p.quick.sessions}</span>
              </div>
              <span className="proc-card-link">
                Learn more <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 36, textAlign: "center" }}>
          <Link
            href="/procedures/hair-transplant"
            className="btn btn-primary"
          >
            View all 11 hair restoration procedures <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
