import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { type ProcedurePillar } from "@/data/procedures";
import { getProceduresByPillar } from "@/sanity/lib/fetchers";
import ProcedureCategoryTabs, {
  ProcedureGrid,
} from "@/components/ProcedureCategoryTabs";

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
          {pillar === "plastic-surgery" ? (
            <ProcedureCategoryTabs procedures={procedures} pillar={pillar} />
          ) : (
            <ProcedureGrid procedures={procedures} pillar={pillar} />
          )}
        </div>
      </section>
    </>
  );
}
