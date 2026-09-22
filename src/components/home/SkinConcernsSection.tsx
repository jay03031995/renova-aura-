import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { getConcerns } from "@/sanity/lib/fetchers";

/**
 * Homepage section: the dermatology / skin concerns pillar. Sits between
 * the two surgical pillars to remind visitors RenovaAura also treats
 * everyday dermatology concerns. Sanity-first via getConcerns().
 */
const FEATURED_SLUGS = [
  "acne",
  "pigmentation-melasma",
  "anti-ageing-wrinkles",
  "dark-circles",
  "laser-hair-reduction",
  "scar-reduction",
];

export default async function SkinConcernsSection() {
  const all = await getConcerns();
  const bySlug = new Map(all.map((c) => [c.slug, c]));
  const featured = FEATURED_SLUGS.map((s) => bySlug.get(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .concat(all.filter((c) => !FEATURED_SLUGS.includes(c.slug)))
    .slice(0, 6);

  return (
    <section className="section" id="skin-concerns">
      <div className="container">
        <div style={{ marginBottom: 50, maxWidth: 720 }}>
          <div className="eyebrow" style={{ marginBottom: 20 }}>
            Skin Concerns · Dermatology
          </div>
          <h2>Same clinic. Same surgeons. Everyday skin care too.</h2>
          <p style={{ marginTop: 18, fontSize: 17, lineHeight: 1.6 }}>
            Acne. Pigmentation. Anti-ageing. Dark circles. RenovaAura&apos;s
            dermatology team treats the everyday skin concerns that don&apos;t
            need surgery — using the same evidence-based, calibrated approach
            we bring to our surgical work.
          </p>
        </div>

        <div className="proc-grid">
          {featured.map((c) => (
            <Link
              key={c.slug}
              href={`/concerns/${c.slug}`}
              className="proc-card"
            >
              <div
                className="proc-card-img"
                style={{ backgroundImage: `url(${c.image})` }}
              >
                <div className="proc-card-img-overlay" />
              </div>
              <div className="proc-card-inner">
                <h3 className="proc-card-title">{c.name}</h3>
                <p
                  className="proc-card-headline"
                  style={{ fontSize: 13, color: "var(--tan)" }}
                >
                  {c.cardTagline}
                </p>
                <span className="proc-card-link">
                  Learn more <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 36, textAlign: "center" }}>
          <Link href="/concerns" className="btn btn-primary">
            View all {all.length} skin concerns{" "}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
