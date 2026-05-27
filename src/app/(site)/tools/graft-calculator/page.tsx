import type { Metadata } from "next";
import GraftCalculator from "@/components/tools/GraftCalculator";

export const metadata: Metadata = {
  title: "Hair Graft Calculator — Norwood-Based Estimate, Free PDF Report",
  description:
    "Free Hair Graft Calculator from RenovaAura. Norwood-Hamilton + ISHRS density references → personalised graft estimate, recommended procedure, and downloadable PDF report.",
  alternates: { canonical: "/tools/graft-calculator" },
};

export default function GraftCalculatorPage() {
  return (
    <section className="section-tight" style={{ paddingTop: 60 }}>
      <div className="container">
        <GraftCalculator />
      </div>
    </section>
  );
}
