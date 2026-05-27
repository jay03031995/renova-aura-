"use client";

/**
 * AI Skin Analysis — photo-first interactive tool.
 *
 * Flow:
 *   1. Upload a face photo. Computer vision (canvas pixel sampling, not
 *      ML) extracts Fitzpatrick + skin type + redness/texture flags.
 *      Patient can confirm or adjust.
 *   2. Concerns multi-select.
 *   3. Lifestyle factors.
 *   4. Patient details.
 *
 * Live score starts at 0 and animates up only as the questionnaire is
 * answered — no pre-filled fake defaults.
 */
import { useEffect, useMemo, useState } from "react";
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
import {
  analyseImage,
  downscaleDataUrl,
  readFileAsDataUrl,
  type ImageAnalysisResult,
} from "@/lib/imageAnalysis";

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

export default function SkinAnalysis() {
  const [step, setStep] = useState(0);

  // Photo + image analysis
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoCompressed, setPhotoCompressed] = useState<string | null>(null);
  const [imageAnalysis, setImageAnalysis] =
    useState<ImageAnalysisResult | null>(null);
  const [analysing, setAnalysing] = useState(false);

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

  // Live "from zero" animated score
  const [displayedScore, setDisplayedScore] = useState(0);
  useEffect(() => {
    const target = result?.healthScore ?? 0;
    if (target === displayedScore) return;
    const start = displayedScore;
    const delta = target - start;
    const duration = 800;
    const startedAt = performance.now();
    let frameId = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - (1 - t) ** 3;
      setDisplayedScore(Math.round(start + delta * eased));
      if (t < 1) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.healthScore]);

  const scoreBand =
    !result || result.healthScore === 0
      ? "empty"
      : result.healthScore >= 75
      ? "good"
      : result.healthScore >= 55
      ? "moderate"
      : "needs-care";

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
      setImageAnalysis(null);
      return;
    }
    setAnalysing(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setPhoto(dataUrl);
      const small = await downscaleDataUrl(dataUrl, 800, 0.8);
      setPhotoCompressed(small);
      const analysis = await analyseImage(dataUrl);
      setImageAnalysis(analysis);
      // Pre-fill the form with what we extracted — patient can override
      setFitzpatrick(analysis.fitzpatrick);
      setSkinType(analysis.skinType);
    } catch {
      // ignore
    } finally {
      setAnalysing(false);
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
    if (!result) {
      setSubmitError("Please complete steps 1–3 before submitting.");
      return;
    }
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
          ageRange: ageBracket ?? undefined,
          summary: result.summary,
          inputs: {
            fitzpatrick,
            skinType,
            ageBracket,
            concerns,
            lifestyle,
            imageAnalysis,
            hasPhoto: !!photo,
          },
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

      await generateReport({
        title: "Personalised AI Skin Analysis",
        subtitle: `Prepared for ${patient.name}`,
        patient: {
          name: patient.name,
          phone: patient.phone,
          email: patient.email || undefined,
          ageRange: ageBracket ?? undefined,
        },
        patientPhotoDataUrl: photoCompressed ?? photo ?? undefined,
        patientPhotoCaption:
          "Patient-uploaded face photograph. Computer-vision pixel sampling used to estimate Fitzpatrick type and skin characteristics — patient-confirmed at submission.",
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
          ...(imageAnalysis
            ? ([
                {
                  type: "kv",
                  label: "Pixel-derived lightness",
                  value: `${imageAnalysis.lightness}/255`,
                },
                {
                  type: "kv",
                  label: "Redness index",
                  value: `${imageAnalysis.redness}`,
                },
                {
                  type: "kv",
                  label: "Texture variance",
                  value: `${imageAnalysis.textureVariance}`,
                },
              ] as const)
            : []),
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
          Interactive Tool · Computer-vision assisted
        </div>
        <h1 className="tool-shell-title">AI Skin Analysis</h1>
        <p className="tool-shell-sub">
          Upload a clear face photo and our pixel-sampling algorithm
          estimates your Fitzpatrick type, redness and texture indicators —
          then maps your concerns + lifestyle to a personalised plan with
          a downloadable PDF report.
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
              <h2 className="tool-step-title">Step 1 · Upload your photo</h2>
              <p className="tool-step-sub">
                A clear front-facing photo in natural daylight gives the
                most accurate read. Photos never leave your browser unless
                you submit the form.
              </p>
              <PhotoUploader
                photo={photo}
                onChange={handlePhoto}
                helper="Front-facing face photo · JPG / PNG · up to 10MB"
                analysing={analysing}
              />
              {imageAnalysis && (
                <div className="tool-photo-result">
                  <div className="tool-photo-result-eyebrow">
                    Detected from your photo
                  </div>
                  <div className="tool-photo-result-grid">
                    <div>
                      <small>Fitzpatrick</small>
                      <strong>Type {imageAnalysis.fitzpatrick}</strong>
                    </div>
                    <div>
                      <small>Skin type guess</small>
                      <strong style={{ textTransform: "capitalize" }}>
                        {imageAnalysis.skinType}
                      </strong>
                    </div>
                    <div>
                      <small>Lightness</small>
                      <strong>{imageAnalysis.lightness}/255</strong>
                    </div>
                    <div>
                      <small>Redness index</small>
                      <strong>{imageAnalysis.redness}</strong>
                    </div>
                  </div>
                  {(imageAnalysis.rednessFlag ||
                    imageAnalysis.textureFlag) && (
                    <ul className="tool-photo-flags">
                      {imageAnalysis.rednessFlag && (
                        <li>Elevated redness detected — possible rosacea or inflammation</li>
                      )}
                      {imageAnalysis.textureFlag && (
                        <li>Uneven texture detected — possible acne, scarring or pigmentation</li>
                      )}
                    </ul>
                  )}
                  <p className="tool-photo-hint">
                    These are smart defaults. You&apos;ll confirm or adjust
                    them on the next step.
                  </p>
                </div>
              )}
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="tool-step-title">
                Step 2 · {imageAnalysis ? "Confirm your skin baseline" : "Your skin baseline"}
              </h2>
              <p className="tool-step-sub">
                {imageAnalysis
                  ? "We pre-filled this from your photo. Tap to change anything."
                  : "Fitzpatrick skin type — how your skin responds to sunlight."}
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

        <aside
          className={
            "tool-result" + (scoreBand !== "empty" ? " tool-result-" + scoreBand : "")
          }
        >
          <div className="tool-result-eyebrow">Live skin score</div>
          <div className="tool-result-num">
            {result ? displayedScore : "—"}
          </div>
          <div className="tool-result-range">
            {result ? (
              <>
                out of 100 ·{" "}
                <strong>
                  {scoreBand === "good"
                    ? "Strong baseline"
                    : scoreBand === "moderate"
                    ? "Room to improve"
                    : "Active care advised"}
                </strong>
              </>
            ) : (
              "Upload a photo or fill the questions to begin"
            )}
          </div>

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
            This expert-system analysis isn&apos;t a medical diagnosis.
            Final recommendations are confirmed at consultation with a
            board-certified RenovaAura consultant.
          </div>
        </aside>
      </div>
    </div>
  );
}

// =========================================================================
// Photo uploader subcomponent (with analysing state)
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
              Analysing pixels…
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
