"use client";

/** Questionnaire-led skin concern assessment with optional reference photo. */
import { useMemo, useRef, useState } from "react";
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
import { downscaleDataUrl, readFileAsDataUrl } from "@/lib/imageAnalysis";
import type { ClinicData } from "@/sanity/lib/fetchers";

const FITZ_OPTIONS: { value: Fitzpatrick; label: string; desc: string }[] = [
  { value: "I", label: "Type I", desc: "Very fair — always burns" },
  { value: "II", label: "Type II", desc: "Fair — usually burns" },
  { value: "III", label: "Type III", desc: "Light olive — sometimes burns" },
  { value: "IV", label: "Type IV", desc: "Olive — tans easily" },
  { value: "V", label: "Type V", desc: "Brown — rarely burns" },
  { value: "VI", label: "Type VI", desc: "Dark — never burns" },
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

type ToolClinic = Pick<
  ClinicData,
  "name" | "tagline" | "address" | "phone" | "email" | "shopUrl"
>;

export default function SkinAnalysis({ clinic }: { clinic: ToolClinic }) {
  const [step, setStep] = useState(0);

  // Photo + image analysis
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoCompressed, setPhotoCompressed] = useState<string | null>(null);
  const [preparingPhoto, setPreparingPhoto] = useState(false);

  // Required inputs — start unset
  const [fitzpatrick, setFitzpatrick] = useState<Fitzpatrick | null>(null);
  const [skinType, setSkinType] = useState<SkinType | null>(null);
  const [ageBracket, setAgeBracket] =
    useState<AnalysisInput["ageBracket"] | null>(null);
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
  const submittingRef = useRef(false);
  const submissionRef = useRef<{ signature: string; key: string } | null>(null);

  // Compute analysis only when minimum required inputs are present
  const result = useMemo(() => {
    if (!fitzpatrick || !skinType || !ageBracket) return null;
    const input: AnalysisInput = {
      fitzpatrick,
      skinType,
      ageBracket,
      concerns,
      lifestyle,
    };
    return analyseSkin(input);
  }, [fitzpatrick, skinType, ageBracket, concerns, lifestyle]);

  const completeness = useMemo(() => {
    let pts = 0;
    if (photo) pts += 25;
    if (fitzpatrick) pts += 15;
    if (skinType) pts += 15;
    if (ageBracket) pts += 10;
    if (concerns.length > 0) pts += 20;
    if (lifestyle.length > 0) pts += 15;
    return Math.min(100, pts);
  }, [photo, fitzpatrick, skinType, ageBracket, concerns, lifestyle]);

  const toggleConcern = (c: SkinConcern) =>
    setConcerns((cs) =>
      cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c],
    );

  const toggleLifestyle = (l: LifestyleFactor) =>
    setLifestyle((ls) =>
      ls.includes(l) ? ls.filter((x) => x !== l) : [...ls, l],
    );

  const handlePhoto = async (file: File | null) => {
    if (!file) {
      setPhoto(null);
      setPhotoCompressed(null);
      return;
    }
    setPreparingPhoto(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setPhoto(dataUrl);
      const small = await downscaleDataUrl(dataUrl, 800, 0.8);
      setPhotoCompressed(small);
    } catch {
      // ignore
    } finally {
      setPreparingPhoto(false);
    }
  };

  const canAdvance = () => {
    if (step === 1) return !!fitzpatrick && !!skinType && !!ageBracket;
    if (step === 2) return concerns.length > 0;
    if (step === 4) {
      return (
        patient.name.trim().length >= 2 &&
        /^\+?[0-9\s-]{10,}$/.test(patient.phone)
      );
    }
    return true;
  };

  const handleSubmit = async () => {
    if (submittingRef.current || submitted) return;
    if (!result) {
      setSubmitError("Please complete steps 1–3 before submitting.");
      return;
    }
    if (!canAdvance()) {
      setSubmitError("Please enter your name and a valid phone number.");
      return;
    }
    if (patient.email && !/^\S+@\S+\.\S+$/.test(patient.email.trim())) {
      setSubmitError("Enter a valid email address or leave it blank.");
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const leadPayload = {
        tool: "skin-analysis" as const,
        name: patient.name.trim(),
        phone: patient.phone.trim(),
        email: patient.email.trim() || undefined,
        ageRange: ageBracket ?? undefined,
        summary: result.summary,
        inputs: {
          fitzpatrick,
          skinType,
          ageBracket,
          concerns,
          lifestyle,
          hasPhoto: !!photo,
        },
        outputs: result,
        source: "/tools/skin-analysis",
      };
      const signature = JSON.stringify(leadPayload);
      if (submissionRef.current?.signature !== signature) {
        submissionRef.current = {
          signature,
          key: crypto.randomUUID(),
        };
      }
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": submissionRef.current.key,
        },
        body: JSON.stringify(leadPayload),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        persisted?: boolean;
        message?: string;
      };
      if (!res.ok || !payload.ok || payload.persisted !== true) {
        throw new Error(payload.message || `Lead capture failed (${res.status})`);
      }

      await generateReport({
        title: "Skin Concern Assessment",
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
        patientPhotoDataUrl: photoCompressed ?? photo ?? undefined,
        patientPhotoCaption: "Patient-uploaded reference photo for discussion at consultation.",
        sections: [
          {
            type: "stat",
            label: "Assessment basis",
            value: `${concerns.length} concern${concerns.length === 1 ? "" : "s"} selected`,
            hint: "Self-reported information for consultation planning",
          },
          { type: "spacer", height: 2 },
          { type: "heading", text: "Your skin profile" },
          { type: "paragraph", text: result.skinProfile },
          ...(concerns.length
            ? ([
                {
                  type: "kv",
                  label: "Concerns reported",
                  value: concerns
                    .map((c) => CONCERN_TO_LABEL[c])
                    .join(", "),
                },
              ] as const)
            : []),
          ...(result.riskFactors.length > 0
            ? ([
                { type: "heading", text: "Clinical considerations" },
                { type: "bullets", items: result.riskFactors },
              ] as const)
            : []),
          { type: "heading", text: "Recommended next steps" },
          { type: "bullets", items: result.lifestyleAdvice.slice(0, 4) },
        ],
        disclaimer:
          "This questionnaire is not a diagnosis or treatment recommendation. Bring this report to your consultation so your clinician can assess your skin and discuss appropriate options.",
      });

      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Could not save your details. Please call the clinic.",
      );
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <div className="tool-shell">
      <header className="tool-shell-head">
        <Link href="/tools" className="tool-back">
          <ArrowLeft size={14} /> All Tools
        </Link>
        <div className="tool-shell-eyebrow">Interactive Tool · Self-reported assessment</div>
        <h1 className="tool-shell-title">Skin Concern Assessment</h1>
        <p className="tool-shell-sub">
          Share your skin type, sun response, and concerns to create a useful
          summary for your consultation. A photo is optional and is not analysed.
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
              <h2 className="tool-step-title">Step 1 · Add a reference photo (optional)</h2>
              <p className="tool-step-sub">
                You can include a photo with your report for your clinician to
                review. It does not affect the questionnaire summary.
              </p>
              <PhotoUploader
                photo={photo}
                onChange={handlePhoto}
                helper="Front-facing face photo · JPG / PNG · up to 10MB"
                analysing={preparingPhoto}
              />
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="tool-step-title">
                Step 2 · Your skin baseline
              </h2>
              <p className="tool-step-sub">
                Fitzpatrick type describes how your skin usually reacts to sun exposure. Choose based on that response, not a photo.
              </p>
              <div className="tool-block-label">Fitzpatrick type</div>
              <div className="tool-options two-col">
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

          {step === 2 && (
            <>
              <h2 className="tool-step-title">Step 3 · What&apos;s bothering you?</h2>
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

          {step === 3 && (
            <>
              <h2 className="tool-step-title">Step 4 · Lifestyle factors</h2>
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

        <aside className="tool-result">
          <div className="tool-result-eyebrow">Your assessment</div>
          <div className="tool-result-num">{result ? concerns.length : "—"}</div>
          <div className="tool-result-range">{result ? "concerns selected" : "Complete the questions to begin"}</div>

          <div className="tool-result-progress">
            <div
              className="tool-result-progress-bar"
              style={{ width: `${completeness}%` }}
            />
            <span>{completeness}% complete</span>
          </div>

          <div className="tool-result-sep" />
          <div className="tool-result-meta">
            <div className="tool-result-meta-row">
              <span>Fitzpatrick</span>
              <strong>{fitzpatrick ? `Type ${fitzpatrick}` : "—"}</strong>
            </div>
            <div className="tool-result-meta-row">
              <span>Skin type</span>
              <strong style={{ textTransform: "capitalize" }}>
                {skinType ?? "—"}
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
          {result && result.riskFactors.length > 0 && (
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
            This self-reported summary is not a diagnosis. A clinician can
            assess your skin and discuss suitable options at consultation.
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
  analysing,
}: {
  photo: string | null;
  onChange: (file: File | null) => void;
  helper: string;
  analysing: boolean;
}) {
  return (
    <div className="tool-photo">
      {photo ? (
        <div className="tool-photo-preview">
          <img src={photo} alt="Uploaded face" />
          {analysing && (
            <div className="tool-photo-analysing">
              <div className="tool-photo-spinner" />
              Preparing photo…
            </div>
          )}
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
