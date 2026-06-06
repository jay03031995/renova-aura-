import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@/components/icons";
import { type ProcedurePillar } from "@/data/procedures";
import { getProceduresByPillar } from "@/sanity/lib/fetchers";

type PillarMeta = {
  eyebrow: string;
  title: string;
  headline: string;
  subtitle: string;
};

const PILLARS: Record<ProcedurePillar, PillarMeta> = {
  "hair-transplant": {
    eyebrow: "Hair Restoration",
    title: "Hair Transplant Procedures",
    headline: "Permanent hair restoration, designed by surgeons.",
    subtitle:
      "From FUE to DHI, beard restoration to eyebrow transplants — every hair procedure we perform is led by a board-certified surgeon and tailored to your hair pattern.",
  },
  "plastic-surgery": {
    eyebrow: "Plastic Surgery & Aesthetics",
    title: "Plastic Surgery Procedures",
    headline: "Refined, never overdone.",
    subtitle:
      "Rhinoplasty, facelift, blepharoplasty and a full range of body contouring — delivered with the conservative aesthetic judgement that makes results look natural, not 'done'.",
  },
};

export function generateStaticParams() {
  return Object.keys(PILLARS).map((pillar) => ({ pillar }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pillar: string }>;
}): Promise<Metadata> {
  const { pillar } = await params;
  const meta = PILLARS[pillar as ProcedurePillar];
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.subtitle,
  };
}

export default async function PillarPage({
  params,
}: {
  params: Promise<{ pillar: string }>;
}) {
  const { pillar } = await params;
  const meta = PILLARS[pillar as ProcedurePillar];
  if (!meta) return notFound();

  const procedures = await getProceduresByPillar(pillar as ProcedurePillar);

  return (
    <>
      <section className="pillar-hero">
        <div className="container">
          <div className="pillar-hero-eyebrow">{meta.eyebrow}</div>
          <h1 className="pillar-hero-headline">{meta.headline}</h1>
          <p className="pillar-hero-subtitle">{meta.subtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* proc-grid-static overrides the homepage swipe-shelf on mobile
              to give a proper 2×2 grid on the "view all treatments" page */}
          <div className="proc-grid proc-grid-static">
            {procedures.map((p) => (
              <Link
                key={p.slug}
                href={`/procedures/${pillar}/${p.slug}`}
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
        </div>
      </section>
    </>
  );
}
