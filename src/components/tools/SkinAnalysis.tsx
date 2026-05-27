"use client";

/**
 * Interactive AI Skin Analysis tool.
 *
 * 4-step guided questionnaire — Fitzpatrick + skin type → concerns →
 * lifestyle → patient details. Live "skin health score" updates as the
 * user answers, with a soft visual band (red → yellow → green) so the
 * tool feels simulative rather than form-y.
 *
 * The "AI" here is a transparent expert system (src/lib/skinAnalysis.ts) —
 * deterministic rules from standard dermatology practice. We don't claim
 * black-box ML.
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "@/components/icons";
import {
  type AnalysisInput,
  type Fitzpatrick,
  type LifestyleFactor,
  type SkinConcern,
  type SkinType,
  analyseSkin,
} from "@/lib/skinAnalysis";
import { generateReport } from "@/lib/pdfReport";

const FITZ_OPTIONS: { value: Fitzpatrick; label: string; desc: string }[] = [
  { value: "I", label: "Type I", desc: "Very fair — always burns, never tans" },
  { value: "II", label: "Type II", desc: "Fair — usually burns, tans minimally" },
  { value: "III", label: "Type III", desc: "Light olive — sometimes burns" },
  { value: "IV", label: "Type IV", desc: "Olive — burns minimally, tans easily" },
  { value: "V", label: "Type V", desc: "Brown — rarely burns, tans well" },
  { value: "VI", label: "Type VI", desc: "Dark brown / black — never burns" },
];

const SKIN_TYPE_OPTIONS: { value: SkinType; label: string }[] = [
  { value: "oily", label: "Oily" },
  { value: "dry", label: "Dry" },
  { value: "combination", label: "Combination" },
  { value: "normal", label: "Normal" },
  { value: "sensitive", label: "Sensitive" },
];

const AGE_OPTIONS: { value: AnalysisInput["ageBracket"]; label: string }[] = [
  { value: "u25", label: "Under 25" },
  { value: "25-34", label: "25–34" },
  { value: "35-44", label: "35–44" },
  { value: "45-54", label: "45–54" },
  { value: "o55", label: "55+" },
];

const CONCERN_OPTIONS: { value: SkinConcern; label: string }[] = [
  { value: "acne", label: "Acne / breakouts" },
  { value: "pigmentation", label: "Pigmentation / melasma" },
  { value: "anti-ageing", label: "Anti-ageing / wrinkles" },
  { value: "dark-circles", label: "Dark circles" },
  { value: "dull-skin", label: "Dull skin / uneven tone" },
  { value: "open-pores", label: "Open pores" },
  { value: "rosacea", label: "Rosacea / redness" },
  { value: "scars", label: "Scars / texture" },
  { value: "unwanted-hair", label: "Unwanted hair" },
  { value: "stretch-marks", label: "Stretch marks" },
];

const LIFESTYLE_OPTIONS: { value: LifestyleFactor; label: string }[] = [
  { value: "smoker", label: "I smoke" },
  { value: "high-stress", label: "Often high stress" },
  { value: "low-sleep", label: "Less than 6 hr sleep" },
  { value: "high-sun-exposure", label: "Lots of sun exposure" },
  { value: "screen-heavy", label: "8+ hr screen time" },
  { value: "alcohol", label: "Regular alcohol" },
];

const CONCERN_TO_LABEL = Object.fromEntries(
  CONCERN_OPTIONS.map((c) => [c.value, c.label]),
) as Record<SkinConcern, string>;

type Patient = { name: string; phone: string; email: string };

export default function SkinAnalysis() {
  const [step, setStep] = useState(0);
  const [fitzpatrick, setFitzpatrick] = useState<Fitzpatrick>("IV");
  const [skinType, setSkinType] = useState<SkinType>("combination");
  const [ageBracket, setAgeBracket] =
    useState<AnalysisInput["ageBracket"]>("25-34");
  const [concerns, setConcerns] = useState<SkinConcern[]>([]);
  const [lifestyle, setLifestyle] = useState<LifestyleFactor[]>([]);
  const [patient, setPatient] = useState<Patient>({
    name: "",
    phone: "",
    email: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const input: AnalysisInput = useMemo(
    () => ({ fitzpatrick, skinType, ageBracket, concerns, lifestyle }),
    [fitzpatrick, skinType, ageBracket, concerns, lifestyle],
  );

  const result = useMemo(() => analyseSkin(input), [input]);

  // Health score → green/yellow/red band
  const scoreBand =
    result.healthScore >= 75
      ? "good"
      : result.healthScore >= 55
      ? "moderate"
      : "needs-care";

  const toggleConcern = (c: SkinConcern) =>
    setConcerns((cs) =>
      cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c],
    );

  const toggleLifestyle = (l: LifestyleFactor) =>
    setLifestyle((ls) =>
      ls.includes(l) ? ls.filter((x) => x !== l) : [...ls, l],
    );

  const canAdvance = () => {
    if (step === 1 && concerns.length === 0) return false;
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

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "skin-analysis",
          name: patient.name,
          phone: patient.phone,
          email: patient.email,
          ageRange: ageBracket,
          summary: result.summary,
          inputs: input,
          outputs: result,
          source: "/tools/skin-analysis",
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };
      if (!res.ok || !payload.ok) {
        throw new Error(payload.message || `Lead capture failed (${res.status})`);
      }

      generateReport({
        title: "Personalised AI Skin Analysis",
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
            label: "Skin health snapshot",
            value: `${result.healthScore} / 100`,
            hint:
              scoreBand === "good"
                ? "Healthy baseline — protect it"
                : scoreBand === "moderate"
                ? "Room to improve"
                : "Active care recommended",
          },
          { type: "spacer", height: 2 },
          { type: "heading", text: "Your skin profile" },
          { type: "paragraph", text: result.skinProfile },
          ...(concerns.length
            ? ([
                { type: "kv", label: "Concerns reported", value: concerns.map((c) => CONCERN_TO_LABEL[c]).join(", ") },
              ] as const)
            : []),
          { type: "spacer", height: 2 },
          ...(result.riskFactors.length > 0
            ? ([
                { type: "heading", text: "Clinical considerations" },
                { type: "bullets", items: result.riskFactors },
              ] as const)
            : []),
          { type: "heading", text: "Recommended next steps" },
          { type: "bullets", items: result.lifestyleAdvice },
          ...(result.recommendedProcedureSlugs.length > 0
            ? ([
                { type: "heading", text: "Procedures worth discussing" },
                {
                  type: "bullets",
                  items: result.recommendedProcedureSlugs.map(
                    (s) =>
                      `${s
                        .split("-")
                        .map((w) => w[0].toUpperCase() + w.slice(1))
                        .join(" ")} — see /procedures for full details`,
                  ),
                },
              ] as const)
            : []),
          { type: "spacer", height: 2 },
          {
            type: "paragraph",
            text: "Bring this report to your in-clinic consultation. Our consultant will examine your skin in detail, confirm the analysis, and walk you through any of the recommended procedures or protocols.",
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
          Interactive Tool · Evidence-based rules
        </div>
        <h1 className="tool-shell-title">AI Skin Analysis</h1>
        <p className="tool-shell-sub">
          A 2-minute guided assessment that maps your skin type, concerns and
          lifestyle to a personalised set of recommendations — and a PDF you
          can bring to your consultation.
        </p>
      </header>

      <div className="tool-grid">
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
              <h2 className="tool-step-title">Step 1 · Your skin baseline</h2>
              <p className="tool-step-sub">
                Fitzpatrick skin type tells us how your skin responds to
                sunlight — it's the single most important factor for safe
                treatment selection.
              </p>
              <div className="tool-block-label">Fitzpatrick type</div>
              <div className="tool-options">
                {FITZ_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    className={
                      "tool-option" +
                      (fitzpatrick === o.value ? " selected" : "")
                    }
                    onClick={() => setFitzpatrick(o.value)}
                  >
                    <span className="tool-option-title">{o.label}</span>
                    <span className="tool-option-desc">{o.desc}</span>
                  </button>
                ))}
              </div>
              <div className="tool-block-label">Skin type</div>
              <div className="tool-row">
                {SKIN_TYPE_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    className={
                      "tool-chip" + (skinType === o.value ? " selected" : "")
                    }
                    onClick={() => setSkinType(o.value)}
                  >
                    <span className="tool-chip-title">{o.label}</span>
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
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="tool-step-title">Step 2 · What's bothering you?</h2>
              <p className="tool-step-sub">
                Tick everything that applies — multi-select.
              </p>
              <div className="tool-options two-col">
                {CONCERN_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    className={
                      "tool-option" +
                      (concerns.includes(o.value) ? " selected" : "")
                    }
                    onClick={() => toggleConcern(o.value)}
                  >
                    <span className="tool-option-title">{o.label}</span>
                  </button>
                ))}
              </div>
              {concerns.length === 0 && (
                <div className="tool-hint">Pick at least one to continue.</div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="tool-step-title">Step 3 · Lifestyle factors</h2>
              <p className="tool-step-sub">
                Cortisol, UV, smoking and sleep all directly affect your skin.
              </p>
              <div className="tool-options two-col">
                {LIFESTYLE_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    className={
                      "tool-option" +
                      (lifestyle.includes(o.value) ? " selected" : "")
                    }
                    onClick={() => toggleLifestyle(o.value)}
                  >
                    <span className="tool-option-title">{o.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="tool-step-title">Step 4 · Your details</h2>
              <p className="tool-step-sub">
                We'll WhatsApp your full report and the care team will reach
                out within 10 minutes during clinic hours.
              </p>
              <div className="tool-field">
                <label>Full name</label>
                <input
                  value={patient.name}
                  onChange={(e) =>
                    setPatient((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. Priya Sharma"
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
                disabled={!canAdvance()}
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
                Our care team will reach out on WhatsApp within 10 minutes.
                Bring the PDF to your consultation.
              </p>
              <Link
                href="/concerns"
                className="btn btn-primary"
                style={{ marginTop: 12 }}
              >
                Browse skin concerns <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

        <aside className={"tool-result tool-result-" + scoreBand}>
          <div className="tool-result-eyebrow">Live skin score</div>
          <div className="tool-result-num">{result.healthScore}</div>
          <div className="tool-result-range">
            out of 100 ·{" "}
            <strong>
              {scoreBand === "good"
                ? "Strong baseline"
                : scoreBand === "moderate"
                ? "Room to improve"
                : "Active care advised"}
            </strong>
          </div>
          <div className="tool-result-sep" />
          <div className="tool-result-meta">
            <div className="tool-result-meta-row">
              <span>Fitzpatrick</span>
              <strong>Type {fitzpatrick}</strong>
            </div>
            <div className="tool-result-meta-row">
              <span>Skin type</span>
              <strong style={{ textTransform: "capitalize" }}>
                {skinType}
              </strong>
            </div>
            <div className="tool-result-meta-row">
              <span>Concerns</span>
              <strong>{concerns.length}</strong>
            </div>
            <div className="tool-result-meta-row">
              <span>Lifestyle flags</span>
              <strong>{lifestyle.length}</strong>
            </div>
          </div>
          {result.riskFactors.length > 0 && (
            <>
              <div className="tool-result-sep" />
              <div className="tool-result-flag-title">
                Clinical considerations
              </div>
              <ul className="tool-result-flags">
                {result.riskFactors.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </>
          )}
          <div className="tool-result-sep" />
          <div className="tool-result-note">
            This expert-system analysis isn't a medical diagnosis. Final
            recommendations are confirmed at consultation with a board-
            certified RenovaAura consultant.
          </div>
        </aside>
      </div>
    </div>
  );
}
