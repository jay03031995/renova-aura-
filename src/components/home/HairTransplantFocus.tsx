import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { getProceduresByPillar } from "@/sanity/lib/fetchers";

/**
 * Homepage section: the primary pillar — hair transplant.
 * Fetches the 6 most-relevant hair procedures from Sanity (with the
 * static fallback in place via fetchers.ts).
 */
const FEATURED_SLUGS = [
  "fue-hair-transplant",
  "dhi-hair-transplant",
  "sapphire-fue-hair-transplant",
  "beard-transplant",
  "eyebrow-transplant",
  "renova-follicle-boost",
];

export default async function HairTransplantFocus() {
  const all = await getProceduresByPillar("hair-transplant");
  // Prefer the featured slugs in order; fall back to the first 6 if any
  // featured slug isn't present (e.g. clinic renamed one in Studio).
  const bySlug = new Map(all.map((p) => [p.slug, p]));
  const featured = FEATURED_SLUGS.map((s) => bySlug.get(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .concat(all.filter((p) => !FEATURED_SLUGS.includes(p.slug)))
    .slice(0, 6);

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
              <div
                className="proc-card-img"
                style={{ backgroundImage: `url(${p.image})` }}
              >
                <div className="proc-card-img-overlay" />
              </div>
              <div className="proc-card-inner">
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
              </div>
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
