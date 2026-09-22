"use client";

/**
 * Interactive Hair Graft Calculator.
 *
 * 5-step simulator:
 *   1. Scalp photo (optional — patient can upload front + top of scalp)
 *   2. Pattern (Norwood stage selector with SVG diagrams)
 *   3. Hair (texture, donor density)
 *   4. Goals (coverage density, age, add-ons)
 *   5. Patient details (name, phone, email)
 *
 * Live calculation only starts AFTER a Norwood stage is selected — the
 * live result panel shows "—" until then. No fake fixed defaults.
 */
import { useEffect, useMemo, useState } from "react";
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
import {
  downscaleDataUrl,
  readFileAsDataUrl,
} from "@/lib/imageAnalysis";
import type { ClinicData } from "@/sanity/lib/fetchers";
import { NORWOOD_ICONS } from "./NorwoodIcons";

const NORWOOD_OPTIONS: {
  value: Norwood;
  label: string;
  description: string;
}[] = [
  { value: "II", label: "Norwood II", description: "Mild frontal recession" },
  { value: "III", label: "Norwood III", description: "Deeper temples, no vertex" },
  { value: "IIIv", label: "Norwood III Vertex", description: "Frontal + emerging vertex" },
  { value: "IV", label: "Norwood IV", description: "Frontal + vertex, bridge intact" },
  { value: "V", label: "Norwood V", description: "Bridge thinning" },
  { value: "VI", label: "Norwood VI", description: "Bridge gone, large bald area" },
  { value: "VII", label: "Norwood VII", description: "Horseshoe — sides + back only" },
];

const TEXTURE_OPTIONS: { value: HairTexture; label: string; desc: string }[] = [
  { value: "fine", label: "Fine", desc: "Thin, soft strands" },
  { value: "medium", label: "Medium", desc: "Average thickness" },
  { value: "coarse", label: "Coarse", desc: "Thick, wiry strands" },
];

const DONOR_OPTIONS: { value: DonorDensity; label: string; desc: string }[] = [
  { value: "low", label: "Low", desc: "<60 FU/cm²" },
  { value: "average", label: "Average", desc: "60–80 FU/cm²" },
  { value: "high", label: "High", desc: ">80 FU/cm²" },
];

const GOAL_OPTIONS: { value: GoalDensity; label: string; desc: string }[] = [
  { value: "conservative", label: "Conservative", desc: "32 FU/cm²" },
  { value: "natural", label: "Natural", desc: "42 FU/cm² · standard" },
  { value: "dense", label: "Dense", desc: "52 FU/cm² · premium" },
];

const AGE_OPTIONS: { value: AgeBracket; label: string }[] = [
  { value: "u30", label: "Under 30" },
  { value: "30-40", label: "30–40" },
  { value: "40-50", label: "40–50" },
  { value: "50-60", label: "50–60" },
  { value: "o60", label: "Over 60" },
];

type Patient = { name: string; phone: string; email: string };

type ToolClinic = Pick<
  ClinicData,
  "name" | "tagline" | "address" | "phone" | "email" | "shopUrl"
>;

const PROCEDURE_LABEL: Record<string, string> = {
  "fue-hair-transplant": "FUE Hair Transplant",
  "fut-hair-transplant": "FUT Hair Transplant",
  "dhi-hair-transplant": "DHI Hair Transplant",
  "sapphire-fue-hair-transplant": "Sapphire FUE Hair Transplant",
};

export default function GraftCalculator({ clinic }: { clinic: ToolClinic }) {
  const [step, setStep] = useState(0);

  // Photo upload (step 1)
  const [scalpPhoto, setScalpPhoto] = useState<string | null>(null);
  const [photoCompressed, setPhotoCompressed] = useState<string | null>(null);

  // Required inputs — start unset
  const [norwood, setNorwood] = useState<Norwood | null>(null);
  const [texture, setTexture] = useState<HairTexture | null>(null);
  const [donorDensity, setDonorDensity] = useState<DonorDensity | null>(null);
  const [goalDensity, setGoalDensity] = useState<GoalDensity | null>(null);
  const [ageBracket, setAgeBracket] = useState<AgeBracket | null>(null);
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

  // Compute only when minimum inputs (Norwood) are selected
  const result = useMemo(() => {
    if (!norwood) return null;
    const input: CalculatorInput = {
      norwood,
      texture: texture ?? "medium",
      donorDensity: donorDensity ?? "average",
      goalDensity: goalDensity ?? "natural",
      ageBracket: ageBracket ?? "30-40",
      alsoBeard,
      alsoEyebrow,
    };
    return calculateGrafts(input);
  }, [norwood, texture, donorDensity, goalDensity, ageBracket, alsoBeard, alsoEyebrow]);

  // Live "from zero" animated estimate — animate the displayed number
  // from 0 up to the computed estimate so the tool feels responsive
  // and never shows a stale "fake" default value.
  const [displayedEstimate, setDisplayedEstimate] = useState(0);
  useEffect(() => {
    const target = result?.estimateMid ?? 0;
    if (target === displayedEstimate) return;
    const start = displayedEstimate;
    const delta = target - start;
    const duration = 700;
    const startedAt = performance.now();
    let frameId = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - (1 - t) ** 3; // easeOutCubic
      setDisplayedEstimate(Math.round(start + delta * eased));
      if (t < 1) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.estimateMid]);

  // Completeness — drives the secondary progress meter in the result panel
  const completeness = useMemo(() => {
    let pts = 0;
    if (scalpPhoto) pts += 20;
    if (norwood) pts += 25;
    if (texture) pts += 15;
    if (donorDensity) pts += 15;
    if (goalDensity) pts += 15;
    if (ageBracket) pts += 10;
    return Math.min(100, pts);
  }, [scalpPhoto, norwood, texture, donorDensity, goalDensity, ageBracket]);

  const handlePhoto = async (file: File | null) => {
    if (!file) {
      setScalpPhoto(null);
      setPhotoCompressed(null);
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    setScalpPhoto(dataUrl);
    const small = await downscaleDataUrl(dataUrl, 800, 0.78);
    setPhotoCompressed(small);
  };

  const canAdvance = () => {
    if (step === 1) return !!norwood;
    if (step === 2) return !!texture && !!donorDensity;
    if (step === 3) return !!goalDensity && !!ageBracket;
    if (step === 4) {
      return (
        patient.name.trim().length >= 2 &&
        /^\+?[0-9\s-]{10,}$/.test(patient.phone)
      );
    }
    return true; // step 0 (photo) optional
  };

  const handleSubmit = async () => {
    if (!result || !norwood) {
      setSubmitError("Please complete the Norwood stage and your hair details first.");
      return;
    }
    if (!canAdvance()) {
      setSubmitError("Please fill in your name and a valid phone number.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);

    const summary = `Norwood ${norwood} · ${result.estimateMid.toLocaleString()} grafts (${result.estimateLow.toLocaleString()}–${result.estimateHigh.toLocaleString()})`;

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "graft-calculator",
          name: patient.name,
          phone: patient.phone,
          email: patient.email,
          ageRange: ageBracket ?? undefined,
          summary,
          inputs: {
            norwood,
            texture,
            donorDensity,
            goalDensity,
            ageBracket,
            alsoBeard,
            alsoEyebrow,
            hasScalpPhoto: !!scalpPhoto,
          },
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

      await generateReport({
        title: "Personalised Hair Transplant Graft Estimate",
        subtitle: `Prepared for ${patient.name}`,
        clinic: {
          name: clinic.name,
          tagline: clinic.tagline,
          address: clinic.address,
          phone: clinic.phone,
          email: clinic.email,
          web: clinic.shopUrl.replace(/^https?:\/\//, ""),
        },
        patient: {
          name: patient.name,
          phone: patient.phone,
          email: patient.email || undefined,
          ageRange: ageBracket ?? undefined,
        },
        patientPhotoDataUrl: photoCompressed ?? scalpPhoto ?? undefined,
        patientPhotoCaption:
          "Scalp photograph uploaded by patient. Brought to consultation for visual confirmation of pattern, donor and recipient regions.",
        sections: [
          {
            type: "stat",
            label: "Estimated graft count",
            value: result.estimateMid.toLocaleString(),
            hint: `${result.estimateLow.toLocaleString()}–${result.estimateHigh.toLocaleString()} range`,
          },
          { type: "spacer", height: 2 },
          { type: "heading", text: "Your assessment summary" },
          ...result.breakdown.map((b) => ({
            type: "kv" as const,
            label: b.label,
            value: b.value,
          })),
          { type: "spacer", height: 2 },
          { type: "heading", text: "How we arrived at this estimate" },
          ...result.rationale.map((r) => ({
            type: "paragraph" as const,
            text: r,
          })),
          { type: "spacer", height: 2 },
          { type: "heading", text: "Recommended procedure" },
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
          { type: "heading", text: "Clinical references used" },
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
          Tells you, in 90 seconds, how many follicular units you&apos;ll need
          for natural-looking restoration. Built on published clinical
          references (Norwood, Unger, ISHRS) — not a generic estimator.
        </p>
      </header>

      <div className="tool-grid">
        <div className="tool-form">
          <div className="tool-steps">
            {[0, 1, 2, 3, 4].map((i) => (
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
              <h2 className="tool-step-title">Step 1 · Scalp photo (optional)</h2>
              <p className="tool-step-sub">
                Upload a clear photo of your scalp from the top. Helps the
                consultant pre-evaluate before your visit. Included in your
                PDF report.
              </p>
              <PhotoUploader
                photo={scalpPhoto}
                onChange={handlePhoto}
                helper="Front or top-of-head photo · JPG / PNG · up to 10MB"
              />
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="tool-step-title">Step 2 · Your Norwood pattern</h2>
              <p className="tool-step-sub">
                Pick the diagram that most closely matches your current hair
                loss pattern.
              </p>
              <div className="norwood-grid">
                {NORWOOD_OPTIONS.map((o) => {
                  const Icon = NORWOOD_ICONS[o.value];
                  return (
                    <button
                      key={o.value}
                      type="button"
                      className={
                        "norwood-card" +
                        (norwood === o.value ? " selected" : "")
                      }
                      onClick={() => setNorwood(o.value)}
                    >
                      <div className="norwood-card-svg">
                        <Icon />
                      </div>
                      <div className="norwood-card-meta">
                        <span className="norwood-card-title">{o.label}</span>
                        <span className="norwood-card-desc">{o.description}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="tool-step-title">Step 3 · Your hair</h2>
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

          {step === 3 && (
            <>
              <h2 className="tool-step-title">Step 4 · Your goal</h2>
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

          {step === 4 && (
            <>
              <h2 className="tool-step-title">Step 5 · Your details</h2>
              <p className="tool-step-sub">
                We&apos;ll WhatsApp your full report and the care team will
                reach out within 10 minutes during clinic hours.
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
            {!submitted && step < 4 && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep((s) => Math.min(4, s + 1))}
                disabled={!canAdvance() && step !== 0}
              >
                Next <ArrowRight size={14} />
              </button>
            )}
            {!submitted && step === 4 && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={submitting || !canAdvance() || !result}
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
            {result ? displayedEstimate.toLocaleString() : "—"}
          </div>
          <div className="tool-result-range">
            {result ? (
              <>
                grafts ·{" "}
                <strong>
                  {result.estimateLow.toLocaleString()}–
                  {result.estimateHigh.toLocaleString()}
                </strong>{" "}
                range
              </>
            ) : (
              "Pick a Norwood stage to begin"
            )}
          </div>

          {/* Completeness bar */}
          <div className="tool-result-progress">
            <div
              className="tool-result-progress-bar"
              style={{ width: `${completeness}%` }}
            />
            <span>{completeness}% complete</span>
          </div>

          {result && (
            <>
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
                    {result.singleSession ? " (single)" : ""}
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
            </>
          )}

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

// =========================================================================
// Photo uploader subcomponent
// =========================================================================
function PhotoUploader({
  photo,
  onChange,
  helper,
}: {
  photo: string | null;
  onChange: (file: File | null) => void;
  helper: string;
}) {
  return (
    <div className="tool-photo">
      {photo ? (
        <div className="tool-photo-preview">
          <img src={photo} alt="Uploaded scalp" />
          <button
            type="button"
            className="tool-photo-remove"
            onClick={() => onChange(null)}
          >
            ✕ Remove
          </button>
        </div>
      ) : (
        <label className="tool-photo-drop">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              onChange(file);
            }}
            style={{ display: "none" }}
          />
          <div className="tool-photo-icon">📷</div>
          <div className="tool-photo-cta">
            <strong>Click to upload</strong> or drag &amp; drop
          </div>
          <div className="tool-photo-help">{helper}</div>
        </label>
      )}
    </div>
  );
}
