import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { getProceduresByPillar } from "@/sanity/lib/fetchers";

/**
 * Secondary pillar on the homepage — plastic surgery & aesthetics.
 * Sanity-first via getProceduresByPillar with static fallback.
 */
const FEATURED_SLUGS = [
  "rhinoplasty",
  "blepharoplasty",
  "facelift",
  "liposuction",
  "lip-fillers",
  "botox",
];

export default async function PlasticSurgeryFocus() {
  const all = await getProceduresByPillar("plastic-surgery");
  const bySlug = new Map(all.map((p) => [p.slug, p]));
  const featured = FEATURED_SLUGS.map((s) => bySlug.get(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .concat(all.filter((p) => !FEATURED_SLUGS.includes(p.slug)))
    .slice(0, 6);

  return (
    <section
      className="section"
      id="plastic-surgery"
      style={{ background: "var(--cream-2)" }}
    >
      <div className="container">
        <div style={{ marginBottom: 50, maxWidth: 720 }}>
          <div className="eyebrow" style={{ marginBottom: 20 }}>
            Plastic Surgery & Aesthetics
          </div>
          <h2>Refined, never overdone.</h2>
          <p style={{ marginTop: 18, fontSize: 17, lineHeight: 1.6 }}>
            From rhinoplasty to non-surgical lip enhancement, every plastic
            surgery and aesthetic procedure at RenovaAura is delivered with
            conservative aesthetic judgement — the goal is always that you
            look like a refreshed, more confident version of yourself.
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
            href="/procedures/plastic-surgery"
            className="btn btn-primary"
          >
            View all 10 plastic surgery procedures <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
