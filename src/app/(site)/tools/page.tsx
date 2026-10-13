import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Patient Tools · Skin Concern Assessment · Hair Graft Calculator",
  description:
    "Prepare for a RenovaAura consultation with a self-reported skin concern summary or a preliminary hair graft estimate.",
  alternates: { canonical: "/tools" },
};

export default function ToolsIndexPage() {
  return (
    <>
      <section className="pillar-hero">
        <div className="container">
          <div className="pillar-hero-eyebrow">Patient Tools</div>
          <h1 className="pillar-hero-headline">
            Prepare for your consultation.
          </h1>
          <p className="pillar-hero-subtitle">
              Use a self-reported skin concern questionnaire or a preliminary
              hair graft estimate, then bring your summary to a clinician.
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
                Skin Concern Assessment
              </h3>
              <p className="proc-card-headline" style={{ fontSize: 15 }}>
                A guided questionnaire turns your skin type, sun response and
                selected concerns into a summary and general discussion points.
                It does not diagnose or recommend procedures.
              </p>
              <span className="proc-card-link">
                Start assessment <ArrowRight size={14} />
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
                you&apos;ll need for natural-looking restoration. Considers donor
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
              The skin questionnaire summarizes your self-reported answers.
              The graft calculator provides an approximate planning range.
              Neither tool diagnoses a condition or replaces an in-person
              clinical assessment. Your report is
              automatically saved to our care team&apos;s inbox so they can call
              you within 10 minutes during clinic hours.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
