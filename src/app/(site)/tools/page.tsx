import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Patient Tools · AI Skin Analysis · Hair Graft Calculator",
  description:
    "Two free, instant tools from RenovaAura: AI Skin Analysis maps your skin type + concerns to a personalised plan, and the Hair Graft Calculator estimates the grafts you'll need using Norwood-based science. Each generates a downloadable PDF report.",
};

export default function ToolsIndexPage() {
  return (
    <>
      <section className="pillar-hero">
        <div className="container">
          <div className="pillar-hero-eyebrow">Patient Tools</div>
          <h1 className="pillar-hero-headline">
            Get a clinical-grade preview, in two minutes.
          </h1>
          <p className="pillar-hero-subtitle">
            Two free interactive tools — built on the same Norwood,
            Fitzpatrick and ISHRS references RenovaAura's consultants use
            during in-clinic assessments. Each generates a personalised
            PDF report you can bring to your consultation.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
              gap: 28,
            }}
          >
            <Link
              href="/tools/skin-analysis"
              className="proc-card"
              style={{ padding: 40 }}
            >
              <span className="proc-card-tag">Skin · Dermatology</span>
              <h3
                className="proc-card-title"
                style={{ fontSize: 26, marginBottom: 14 }}
              >
                AI Skin Analysis
              </h3>
              <p className="proc-card-headline" style={{ fontSize: 15 }}>
                A guided 2-minute assessment that maps your Fitzpatrick
                type, skin concerns and lifestyle factors to a personalised
                care plan. Get a downloadable PDF report with recommended
                procedures, clinical considerations and lifestyle advice.
              </p>
              <span className="proc-card-link">
                Start the analysis <ArrowRight size={14} />
              </span>
            </Link>

            <Link
              href="/tools/graft-calculator"
              className="proc-card"
              style={{ padding: 40 }}
            >
              <span className="proc-card-tag">Hair Transplant</span>
              <h3
                className="proc-card-title"
                style={{ fontSize: 26, marginBottom: 14 }}
              >
                Hair Graft Calculator
              </h3>
              <p className="proc-card-headline" style={{ fontSize: 15 }}>
                Norwood-based science to estimate how many follicular units
                you'll need for natural-looking restoration. Considers donor
                density, hair texture, age and coverage goal. Generates a
                referenced PDF report with a clear graft range.
              </p>
              <span className="proc-card-link">
                Calculate my grafts <ArrowRight size={14} />
              </span>
            </Link>
          </div>

          <div
            style={{
              marginTop: 50,
              padding: 28,
              background: "var(--cream-2)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--line)",
            }}
          >
            <div className="eyebrow" style={{ marginBottom: 12 }}>
              Why we built these
            </div>
            <h3 style={{ fontSize: 22, marginBottom: 10 }}>
              No black boxes. No upselling. Just transparent decision-support.
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.6, maxWidth: 820 }}>
              Both tools are expert systems — deterministic rules from
              published clinical references (Norwood-Hamilton scale,
              Fitzpatrick classification, ISHRS density consensus). We show
              you the math, cite the sources in your PDF, and let our
              consultants confirm the final plan in person. Your report is
              automatically saved to our care team's inbox so they can call
              you within 10 minutes during clinic hours.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
