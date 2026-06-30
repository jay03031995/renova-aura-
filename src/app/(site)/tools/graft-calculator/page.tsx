import type { Metadata } from "next";
import Link from "next/link";
import GraftCalculator from "@/components/tools/GraftCalculator";
import { getClinic } from "@/sanity/lib/fetchers";

export const metadata: Metadata = {
  title: "Hair Graft Calculator — Norwood-Based Estimate, Free PDF Report",
  description:
    "Free Hair Graft Calculator from RenovaAura. Norwood-Hamilton + ISHRS density references → personalised graft estimate, recommended procedure, and downloadable PDF report.",
  alternates: { canonical: "/tools/graft-calculator" },
};

export default async function GraftCalculatorPage() {
  const clinic = await getClinic();

  return (
    <section className="section-tight" style={{ paddingTop: 40 }}>
      <div className="container">
        <div className="tool-logo-header">
          <Link href="/" aria-label="RenovaAura home">
            <img
              src={clinic.logoUrl ?? "/renovaaura-logo.png"}
              alt={clinic.name}
              className="tool-logo-img"
            />
          </Link>
        </div>
        <GraftCalculator clinic={clinic} />
      </div>
    </section>
  );
}
