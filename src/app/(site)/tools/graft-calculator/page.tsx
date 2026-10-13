import type { Metadata } from "next";
import Link from "next/link";
import GraftCalculator from "@/components/tools/GraftCalculator";

export const metadata: Metadata = {
  title: "Hair Graft Calculator — Preliminary Estimate",
  description:
    "Select scalp zones and hair-loss severity to see a preliminary hair graft estimate. Confirm your plan with a RenovaAura clinician.",
  alternates: { canonical: "/tools/graft-calculator" },
};

export default function GraftCalculatorPage() {
  return (
    <section className="section-tight" style={{ paddingTop: 40 }}>
      <div className="container">
        <div className="tool-logo-header">
          <Link href="/" aria-label="RenovaAura home">
            <img
              src="/renovaaura-logo.png"
              alt="RenovaAura"
              className="tool-logo-img"
            />
          </Link>
        </div>
        <GraftCalculator />
      </div>
    </section>
  );
}
