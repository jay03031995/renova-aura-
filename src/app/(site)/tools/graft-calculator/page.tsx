import type { Metadata } from "next";
import Link from "next/link";
import GraftCalculator from "@/components/tools/GraftCalculator";

export const metadata: Metadata = {
  title: "Hair Graft Calculator — Norwood-Based Estimate, Free PDF Report",
  description:
    "Free Hair Graft Calculator from RenovaAura. Norwood-Hamilton + ISHRS density references → personalised graft estimate, recommended procedure, and downloadable PDF report.",
  alternates: { canonical: "/tools/graft-calculator" },
};

export default function GraftCalculatorPage() {
  return (
    <section className="section-tight" style={{ paddingTop: 40 }}>
      <div className="container">
        <div className="tool-logo-header">
          <Link href="/" aria-label="RenovaAura home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
