"use client";

/**
 * Interactive Hair Graft Calculator.
 *
 * 4-step simulator:
 *   1. Pattern (Norwood stage selector with visual diagram)
 *   2. Hair (texture, donor density)
 *   3. Goals (coverage density, age, add-ons)
 *   4. Patient details (name, phone, email)
 *
 * Live calculation updates as the patient changes inputs. Final step
 * submits the lead to /api/leads and offers a PDF download.
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "@/components/icons";
import {
  type AgeBracket,
  type CalculatorInput,
  type DonorDensity,
  type GoalDensity,
  type HairTexture,
  type Norwood,
  calculateGrafts,
} from "@/lib/graftCalculator";
import { generateReport } from "@/lib/pdfReport";

const NORWOOD_OPTIONS: {
  value: Norwood;
  label: string;
  description: string;
}[] = [
  { value: "II", label: "Norwood II", description: "Mild frontal recession" },
  {
    value: "III",
    label: "Norwood III",
    description: "Deeper temples, no vertex involvement",
  },
  {
    value: "IIIv",
    label: "Norwood III Vertex",
    description: "Frontal + emerging vertex thinning",
  },
  {
    value: "IV",
    label: "Norwood IV",
    description: "Frontal + clear vertex baldness, bridge intact",
  },
  {
    value: "V",
    label: "Norwood V",
    description: "Bridge thinning between frontal and vertex",
  },
  {
    value: "VI",
    label: "Norwood VI",
    description: "Bridge gone, large connected bald area",
  },
  {
    value: "VII",
    label: "Norwood VII",
    description: "Horseshoe pattern, only sides + back",
  },
];

const TEXTURE_OPTIONS: { value: HairTexture; label: string; desc: string }[] = [
  { value: "fine", label: "Fine", desc: "Each strand is thin, soft" },
  { value: "medium", label: "Medium", desc: "Average thickness" },
  { value: "coarse", label: "Coarse", desc: "Thick, wiry strands" },
];

const DONOR_OPTIONS: { value: DonorDensity; label: string; desc: string }[] = [
  { value: "low", label: "Low", desc: "<60 FU/cm² · sparse donor" },
  { value: "average", label: "Average", desc: "60–80 FU/cm²" },
  { value: "high", label: "High", desc: ">80 FU/cm² · dense donor" },
];

const GOAL_OPTIONS: { value: GoalDensity; label: string; desc: string }[] = [
  {
    value: "conservative",
    label: "Conservative",
    desc: "32 FU/cm² · natural look at normal distance",
  },
  {
    value: "natural",
    label: "Natural",
    desc: "42 FU/cm² · modern standard",
  },
  {
    value: "dense",
    label: "Dense",
    desc: "52 FU/cm² · premium Sapphire FUE / DHI",
  },
];

const AGE_OPTIONS: { value: AgeBracket; label: string }[] = [
  { value: "u30", label: "Under 30" },
  { value: "30-40", label: "30–40" },
  { value: "40-50", label: "40–50" },
  { value: "50-60", label: "50–60" },
  { value: "o60", label: "Over 60" },
];

type Patient = { name: string; phone: string; email: string };

const PROCEDURE_LABEL: Record<string, string> = {
  "fue-hair-transplant": "FUE Hair Transplant",
  "fut-hair-transplant": "FUT Hair Transplant",
  "dhi-hair-transplant": "DHI Hair Transplant",
  "sapphire-fue-hair-transplant": "Sapphire FUE Hair Transplant",
};

export default function GraftCalculator() {
  const [step, setStep] = useState(0);
  const [norwood, setNorwood] = useState<Norwood>("III");
  const [texture, setTexture] = useState<HairTexture>("medium");
  const [donorDensity, setDonorDensity] = useState<DonorDensity>("average");
  const [goalDensity, setGoalDensity] = useState<GoalDensity>("natural");
  const [ageBracket, setAgeBracket] = useState<AgeBracket>("30-40");
  const [alsoBeard, setAlsoBeard] = useState(false);
  const [alsoEyebrow, setAlsoEyebrow] = useState(false);
  const [patient, setPatient] = useState<Patient>({
    name: "",
    phone: "",
    email: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const input: CalculatorInput = useMemo(
    () => ({
      norwood,
      texture,
      donorDensity,
      goalDensity,
      ageBracket,
      alsoBeard,
      alsoEyebrow,
    }),
    [norwood, texture, donorDensity, goalDensity, ageBracket, alsoBeard, alsoEyebrow],
  );

  const result = useMemo(() => calculateGrafts(input), [input]);

  const canAdvance = () => {
    if (step === 3) {
      return (
        patient.name.trim().length >= 2 &&
        /^\+?[0-9\s-]{10,}$/.test(patient.phone)
      );
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!canAdvance()) {
      setSubmitError("Please fill in your name and a valid phone number.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);

    const summary = `Norwood ${norwood} · ${result.estimateMid.toLocaleString()} grafts (${result.estimateLow.toLocaleString()}–${result.estimateHigh.toLocaleString()})`;

    try {
      // Persist lead (Sanity-or-no-op)
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "graft-calculator",
          name: patient.name,
          phone: patient.phone,
          email: patient.email,
          ageRange: ageBracket,
          summary,
          inputs: input,
          outputs: result,
          source: "/tools/graft-calculator",
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };
      if (!res.ok || !payload.ok) {
        throw new Error(payload.message || `Lead capture failed (${res.status})`);
      }

      // Generate PDF
      generateReport({
        title: "Personalised Hair Transplant Graft Estimate",
        subtitle: `Prepared for ${patient.name}`,
        patient: {
          name: patient.name,
          phone: patient.phone,
          email: patient.email || undefined,
          ageRange: ageBracket,
        },
        sections: [
          {
            type: "stat",
            label: "Estimated graft count",
            value: result.estimateMid.toLocaleString(),
            hint: `${result.estimateLow.toLocaleString()}–${result.estimateHigh.toLocaleString()} range`,
          },
          { type: "spacer", height: 2 },
          {
            type: "heading",
            text: "Your assessment summary",
          },
          ...result.breakdown.map((b) => ({
            type: "kv" as const,
            label: b.label,
            value: b.value,
          })),
          { type: "spacer", height: 2 },
          {
            type: "heading",
            text: "How we arrived at this estimate",
          },
          ...result.rationale.map((r) => ({
            type: "paragraph" as const,
            text: r,
          })),
          { type: "spacer", height: 2 },
          {
            type: "heading",
            text: "Recommended procedure",
          },
          {
            type: "paragraph",
            text: `Based on your inputs, RenovaAura's senior consultant is most likely to recommend ${
              PROCEDURE_LABEL[result.recommendedProcedure] ||
              result.recommendedProcedure
            }${
              result.singleSession
                ? " in a single sitting"
                : ` across ${result.sessions} sessions, 9–12 months apart`
            }.`,
          },
          {
            type: "paragraph",
            text: "Bring this report to your consultation. We'll confirm the exact count with trichoscopy and donor evaluation, and walk you through the full plan + costs in person.",
          },
          {
            type: "heading",
            text: "Clinical references used",
          },
          {
            type: "bullets",
            items: [
              "Norwood OT. Male pattern baldness: classification and incidence. South Med J. 1975.",
              "Unger WP et al. Hair Transplantation, 5th ed. 2010.",
              "Avram MR. Hair Transplantation for Men and Women. Dermatologic Clinics 2005.",
              "ISHRS recipient density consensus, 2018.",
            ],
          },
        ],
      });

      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Could not save your details. Please call the clinic.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="tool-shell">
      <header className="tool-shell-head">
        <Link href="/tools" className="tool-back">
          <ArrowLeft size={14} /> All Tools
        </Link>
        <div className="tool-shell-eyebrow">
          Interactive Tool · Norwood-based science
        </div>
        <h1 className="tool-shell-title">Hair Graft Calculator</h1>
        <p className="tool-shell-sub">
          Tells you, in 90 seconds, how many follicular units you'll need for
          natural-looking restoration. Built on published clinical references
          (Norwood, Unger, ISHRS) — not a generic estimator.
        </p>
      </header>

      <div className="tool-grid">
        {/* Left: the form steps */}
        <div className="tool-form">
          <div className="tool-steps">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={
                  "tool-step-dot" +
                  (i < step ? " done" : i === step ? " active" : "")
                }
              />
            ))}
          </div>

          {step === 0 && (
            <>
              <h2 className="tool-step-title">Step 1 · Your pattern</h2>
              <p className="tool-step-sub">
                Pick the Norwood stage that best matches your current hair loss.
              </p>
              <div className="tool-options">
                {NORWOOD_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    className={
                      "tool-option" + (norwood === o.value ? " selected" : "")
                    }
                    onClick={() => setNorwood(o.value)}
                  >
                    <span className="tool-option-title">{o.label}</span>
                    <span className="tool-option-desc">{o.description}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="tool-step-title">Step 2 · Your hair</h2>
              <p className="tool-step-sub">
                Hair texture and donor density both shape the final number.
              </p>
              <div className="tool-block-label">Hair texture</div>
              <div className="tool-row">
                {TEXTURE_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    className={
                      "tool-chip" + (texture === o.value ? " selected" : "")
                    }
                    onClick={() => setTexture(o.value)}
                  >
                    <span className="tool-chip-title">{o.label}</span>
                    <span className="tool-chip-desc">{o.desc}</span>
                  </button>
                ))}
              </div>
              <div className="tool-block-label">Donor density</div>
              <div className="tool-row">
                {DONOR_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    className={
                      "tool-chip" +
                      (donorDensity === o.value ? " selected" : "")
                    }
                    onClick={() => setDonorDensity(o.value)}
                  >
                    <span className="tool-chip-title">{o.label}</span>
                    <span className="tool-chip-desc">{o.desc}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="tool-step-title">Step 3 · Your goal</h2>
              <p className="tool-step-sub">
                Coverage goal and age inform a future-proof plan.
              </p>
              <div className="tool-block-label">Coverage goal</div>
              <div className="tool-row">
                {GOAL_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    className={
                      "tool-chip" +
                      (goalDensity === o.value ? " selected" : "")
                    }
                    onClick={() => setGoalDensity(o.value)}
                  >
                    <span className="tool-chip-title">{o.label}</span>
                    <span className="tool-chip-desc">{o.desc}</span>
                  </button>
                ))}
              </div>
              <div className="tool-block-label">Age bracket</div>
              <div className="tool-row">
                {AGE_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    className={
                      "tool-chip" +
                      (ageBracket === o.value ? " selected" : "")
                    }
                    onClick={() => setAgeBracket(o.value)}
                  >
                    <span className="tool-chip-title">{o.label}</span>
                  </button>
                ))}
              </div>
              <div className="tool-block-label">Add-ons</div>
              <label className="tool-toggle">
                <input
                  type="checkbox"
                  checked={alsoBeard}
                  onChange={(e) => setAlsoBeard(e.target.checked)}
                />
                <span>Also include beard restoration (+1,500–2,500 grafts)</span>
              </label>
              <label className="tool-toggle">
                <input
                  type="checkbox"
                  checked={alsoEyebrow}
                  onChange={(e) => setAlsoEyebrow(e.target.checked)}
                />
                <span>Also include eyebrow restoration (+250–400 grafts)</span>
              </label>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="tool-step-title">Step 4 · Your details</h2>
              <p className="tool-step-sub">
                We'll WhatsApp your full report and call you within 10 minutes
                during clinic hours.
              </p>
              <div className="tool-field">
                <label>Full name</label>
                <input
                  value={patient.name}
                  onChange={(e) =>
                    setPatient((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. Rohan Mehta"
                />
              </div>
              <div className="tool-field">
                <label>Phone</label>
                <input
                  value={patient.phone}
                  onChange={(e) =>
                    setPatient((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="tool-field">
                <label>Email (optional)</label>
                <input
                  value={patient.email}
                  onChange={(e) =>
                    setPatient((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="you@example.com"
                  type="email"
                />
              </div>
              {submitError && (
                <div className="tool-error" role="alert">
                  {submitError}
                </div>
              )}
            </>
          )}

          <div className="tool-actions">
            {step > 0 && !submitted && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={submitting}
              >
                Back
              </button>
            )}
            <span style={{ flex: 1 }} />
            {!submitted && step < 3 && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep((s) => Math.min(3, s + 1))}
              >
                Next <ArrowRight size={14} />
              </button>
            )}
            {!submitted && step === 3 && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={submitting || !canAdvance()}
              >
                {submitting ? "Generating…" : "Get my full PDF report"}{" "}
                {!submitting && <ArrowRight size={14} />}
              </button>
            )}
          </div>

          {submitted && (
            <div className="tool-success">
              <div className="tool-success-icon">
                <Check size={20} />
              </div>
              <h3>Your report is downloading.</h3>
              <p>
                Our care team will reach out on WhatsApp within 10 minutes
                during clinic hours. Bring the PDF to your consultation.
              </p>
              <Link
                href="/procedures/hair-transplant"
                className="btn btn-primary"
                style={{ marginTop: 12 }}
              >
                See hair transplant procedures <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

        {/* Right: live result panel */}
        <aside className="tool-result">
          <div className="tool-result-eyebrow">Live estimate</div>
          <div className="tool-result-num">
            {result.estimateMid.toLocaleString()}
          </div>
          <div className="tool-result-range">
            grafts ·{" "}
            <strong>
              {result.estimateLow.toLocaleString()}–
              {result.estimateHigh.toLocaleString()}
            </strong>{" "}
            range
          </div>
          <div className="tool-result-sep" />
          <div className="tool-result-meta">
            <div className="tool-result-meta-row">
              <span>Recipient area</span>
              <strong>{result.recipientAreaCm2} cm²</strong>
            </div>
            <div className="tool-result-meta-row">
              <span>Target density</span>
              <strong>{result.targetDensity} FU/cm²</strong>
            </div>
            <div className="tool-result-meta-row">
              <span>Sessions</span>
              <strong>
                {result.sessions}
                {result.singleSession ? " (single sitting)" : ""}
              </strong>
            </div>
            <div className="tool-result-meta-row">
              <span>Suggested procedure</span>
              <strong>
                {PROCEDURE_LABEL[result.recommendedProcedure] ||
                  result.recommendedProcedure}
              </strong>
            </div>
          </div>
          <div className="tool-result-sep" />
          <div className="tool-result-note">
            Estimates use Norwood-Hamilton recipient-area tables and ISHRS
            density consensus. Final count is confirmed by your RenovaAura
            consultant with trichoscopy at the in-clinic evaluation.
          </div>
        </aside>
      </div>
    </div>
  );
}
