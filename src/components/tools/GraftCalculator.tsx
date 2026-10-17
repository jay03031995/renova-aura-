
"use client";

import Image from "next/image";
import { type FormEvent, useMemo, useRef, useState } from "react";

import BookButton from "@/components/BookButton";
import { generateReport } from "@/lib/pdfReport";
import styles from "./GraftCalculator.module.css";

import {
  calculateGrafts,
  estimateByNorwoodStage,
  getZonesForStage,
  GRAFT_ZONES,
  NORWOOD_STAGES,
  type GraftZone,
  type Norwood,
  type Severity,
  type ZoneSelection,
} from "@/lib/graftCalculator";

const severityOptions: {
  value: Severity;
  label: string;
  detail: string;
}[] = [
  {
    value: "mild",
    label: "Low",
    detail: "Mild thinning or a small area",
  },
  {
    value: "moderate",
    label: "Moderate",
    detail: "Noticeable thinning or recession",
  },
  {
    value: "severe",
    label: "Severe",
    detail: "Extensive thinning or advanced loss",
  },
];

const formatNumber = (value: number) =>
  value.toLocaleString("en-IN");

export default function GraftCalculator() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [stage, setStage] = useState<Norwood | null>(null);
  const [zones, setZones] = useState<GraftZone[]>([]);
  const [severities, setSeverities] = useState<
    Partial<Record<GraftZone, Severity>>
  >({});
  const [error, setError] = useState("");
  const [patient, setPatient] = useState({ name: "", phone: "", email: "" });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadError, setLeadError] = useState("");
  const leadSubmittingRef = useRef(false);
  const submissionRef = useRef<{ signature: string; key: string } | null>(null);

  const selections = useMemo<ZoneSelection[]>(
    () =>
      zones.map((zone) => ({
        zone,
        severity: severities[zone] ?? "moderate",
      })),
    [zones, severities]
  );

  /**
   * Detailed zone-by-zone calculation.
   * Used for the breakdown and for manual zone-only estimates.
   */
  const zoneEstimate = useMemo(() => {
    if (zones.length === 0) return null;

    if (zones.some((zone) => !severities[zone])) {
      return null;
    }

    return calculateGrafts(selections);
  }, [zones, severities, selections]);

  /**
   * Main result:
   * - A selected Norwood stage determines the baseline range.
   * - Selected-zone severity adjusts the stage estimate.
   * - If the user skips Norwood, use the zone-based calculation.
   * - Norwood Stage I does not produce a graft estimate.
   */
  const estimate = useMemo(() => {
    if (stage === "1") return null;

    if (stage !== null) {
      if (!zoneEstimate) return null;

      return estimateByNorwoodStage(stage, selections);
    }

    if (!zoneEstimate) return null;

    return {
      low: zoneEstimate.low,
      high: zoneEstimate.high,
    };
  }, [stage, selections, zoneEstimate]);

  const selectStage = (value: Norwood | null) => {
    setStage(value);
    setError("");

    // Skipping the stage allows manual zone selection.
    if (value === null) return;

    const suggested = getZonesForStage(value);

    setZones(suggested);

    setSeverities((current) => {
      const next = { ...current };

      suggested.forEach((zone) => {
        next[zone] ??= "moderate";
      });

      return next;
    });
  };

  const toggleZone = (zone: GraftZone) => {
    setZones((current) => {
      if (current.includes(zone)) {
        return current.filter((item) => item !== zone);
      }

      return [...current, zone].sort((a, b) => a - b);
    });

    setSeverities((current) => {
      const next = { ...current };

      if (zones.includes(zone)) {
        delete next[zone];
      } else {
        next[zone] ??= "moderate";
      }

      return next;
    });

    setError("");
  };

  const selectSeverity = (
    zone: GraftZone,
    severity: Severity
  ) => {
    setSeverities((current) => ({
      ...current,
      [zone]: severity,
    }));

    setError("");
  };

  const next = () => {
    if (step === 1) {
      // Norwood I is handled by the informational result screen.
      if (stage === "1") {
        setError("");
        setStep(3);
        return;
      }

      if (zones.length === 0) {
        setError(
          "Select at least one affected scalp zone to continue."
        );
        return;
      }

      setError("");
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!zoneEstimate) {
        setError(
          "Choose a severity for every selected zone."
        );
        return;
      }

      setError("");
      setStep(3);
    }
  };

  const goToDetails = () => {
    setLeadError("");
    setStep(4);
  };

  const reset = () => {
    setStep(1);
    setStage(null);
    setZones([]);
    setSeverities({});
    setError("");
    setPatient({ name: "", phone: "", email: "" });
    setLeadSubmitting(false);
    setLeadSubmitted(false);
    setLeadError("");
    leadSubmittingRef.current = false;
    submissionRef.current = null;
  };

  const selectedStage = stage
    ? NORWOOD_STAGES.find((item) => item.value === stage)
    : null;

  const downloadReport = async () => {
    const displayRange = estimate
      ? `${formatNumber(estimate.low)}–${formatNumber(estimate.high)}`
      : "Not provided for Norwood Stage I";
    const severityLabel = (severity: Severity) =>
      severityOptions.find((option) => option.value === severity)?.label ?? severity;

    await generateReport({
      title: "Hair Restoration Assessment",
      patient: {
        name: patient.name.trim() || "Patient",
        phone: patient.phone.trim() || undefined,
        email: patient.email.trim() || undefined,
      },
      sections: [
        {
          type: "stat",
          label: "Preliminary estimated graft range",
          value: displayRange,
        },
        { type: "heading", text: "Assessment summary" },
        {
          type: "bullets",
          items: [
            `Norwood stage: ${selectedStage?.label ?? "Not selected"}`,
            `Selected zones: ${zones.length ? zones.map((zone) => `Zone ${zone}`).join(", ") : "None"}`,
          ],
        },
        ...(zoneEstimate?.zones.length
          ? [
              { type: "heading" as const, text: "Zone breakdown" },
              {
                type: "bullets" as const,
                items: zoneEstimate.zones.map(
                  (item) =>
                    `Zone ${item.zone} · ${severityLabel(item.severity)} severity · ${formatNumber(item.low)}–${formatNumber(item.high)} grafts`,
                ),
              },
            ]
          : []),
      ],
      disclaimer:
        "This calculator provides approximate planning estimates, not a diagnosis or treatment plan. Actual graft requirements depend on donor hair availability, hair characteristics, scalp condition, and desired coverage. A qualified clinician must assess your individual needs.",
    });
  };

  const submitLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (leadSubmittingRef.current || leadSubmitted) return;
    if (patient.name.trim().length < 2) {
      setLeadError("Enter your name to send this assessment.");
      return;
    }
    if (!/^\+?[0-9\s-]{10,}$/.test(patient.phone.trim())) {
      setLeadError("Enter a valid phone number so the clinic can follow up.");
      return;
    }
    if (patient.email && !/^\S+@\S+\.\S+$/.test(patient.email.trim())) {
      setLeadError("Enter a valid email address or leave it blank.");
      return;
    }

    const leadPayload = {
      tool: "graft-calculator" as const,
      name: patient.name.trim(),
      phone: patient.phone.trim(),
      email: patient.email.trim() || undefined,
      summary: stage
        ? `Norwood ${selectedStage?.label ?? stage} · ${estimate ? `${formatNumber(estimate.low)}–${formatNumber(estimate.high)} grafts` : "no graft estimate"}`
        : `Zone-based estimate · ${estimate ? `${formatNumber(estimate.low)}–${formatNumber(estimate.high)} grafts` : "not available"}`,
      inputs: {
        stage,
        zones,
        severities: Object.fromEntries(selections.map((selection) => [selection.zone, selection.severity])),
      },
      outputs: {
        estimate,
        zoneBreakdown: zoneEstimate?.zones ?? [],
      },
      source: "/tools/graft-calculator",
    };
    const signature = JSON.stringify(leadPayload);
    if (submissionRef.current?.signature !== signature) {
      submissionRef.current = { signature, key: crypto.randomUUID() };
    }

    leadSubmittingRef.current = true;
    setLeadSubmitting(true);
    setLeadError("");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": submissionRef.current.key,
        },
        body: JSON.stringify(leadPayload),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        persisted?: boolean;
        message?: string;
      };
      if (!response.ok || !payload.ok || payload.persisted !== true) {
        throw new Error(payload.message || "We couldn't save your assessment. Please try again.");
      }
      setLeadSubmitted(true);
    } catch (submitError) {
      setLeadError(
        submitError instanceof Error
          ? submitError.message
          : "We couldn't save your assessment. Please try again or call the clinic.",
      );
    } finally {
      leadSubmittingRef.current = false;
      setLeadSubmitting(false);
    }
  };

  return (
    <div
      className={`tool-shell graft-calculator ${styles.calculatorStyles}`}
    >
      <header className="tool-shell-head">
        <div className="tool-shell-eyebrow">
          Hair restoration planning tool
        </div>

        <h1 className="tool-shell-title">
          Hair Graft Calculator
        </h1>

        <p className="tool-shell-sub">
          Select your Norwood stage, identify affected scalp zones,
          and choose the severity to get a preliminary graft estimate.
        </p>
      </header>

      <div className="graft-wizard">
        <nav
          className="graft-progress"
          aria-label="Calculator steps"
        >
          {(
            [
              "Select zones",
              "Choose severity",
              "Your estimate",
              "Your details",
            ] as const
          ).map((label, index) => {
            const number = (index + 1) as 1 | 2 | 3 | 4;

            return (
              <div
                className={`graft-progress-step${
                  step === number ? " active" : ""
                }${step > number ? " complete" : ""}`}
                key={label}
              >
                <span>{number}</span>
                <strong>{label}</strong>
              </div>
            );
          })}
        </nav>

        {/* STEP 1: NORWOOD STAGE AND ZONES */}
        {step === 1 && (
          <section
            className="graft-wizard-panel"
            aria-labelledby="zones-heading"
          >
            <div className="graft-panel-heading">
              <span className="graft-kicker">
                Step 1 of 4
              </span>

              <h2 id="zones-heading">
                Select your balding zones
              </h2>

              <p>
                Choose your Norwood stage to preselect suggested
                areas, or skip it and select the scalp zones manually.
                You can adjust the selected zones at any time.
              </p>
            </div>

            <div className="graft-zones-visual">
              <Image
                src="/graft_calc.jpg"
                alt="Top and side views showing numbered scalp zones from 1 to 8"
                width={579}
                height={359}
                sizes="(max-width: 700px) 100vw, 580px"
                priority
              />
            </div>

            <div className="graft-stage-picker">
              <div>
                <h3>Know your Norwood stage?</h3>
                <p>
                  Choose a stage to preselect common areas, or select
                  the zones above by number.
                </p>
              </div>

              <div
                className="graft-stage-options"
                role="group"
                aria-label="Norwood stage"
              >
                <button
                  className={`graft-stage-chip${
                    stage === null ? " selected" : ""
                  }`}
                  type="button"
                  onClick={() => selectStage(null)}
                  aria-pressed={stage === null}
                >
                  Skip
                </button>

                {NORWOOD_STAGES.map((item) => (
                  <button
                    className={`graft-stage-chip${
                      stage === item.value ? " selected" : ""
                    }`}
                    type="button"
                    key={item.value}
                    onClick={() => selectStage(item.value)}
                    aria-pressed={stage === item.value}
                    title={item.description}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {stage === "1" && (
              <p className="graft-stage-hint">
                Norwood Stage I generally represents minimal or no
                significant pattern hair loss. This calculator will
                show an informational message instead of a graft count.
              </p>
            )}

            <div
              className="graft-zone-picks"
              role="group"
              aria-label="Affected scalp zones"
            >
              {GRAFT_ZONES.map((zone) => (
                <button
                  key={zone}
                  type="button"
                  className={`graft-zone-pick${
                    zones.includes(zone) ? " selected" : ""
                  }`}
                  onClick={() => toggleZone(zone)}
                  aria-pressed={zones.includes(zone)}
                >
                  <span className="graft-zone-number">
                    {zone}
                  </span>

                  <span>Zone {zone}</span>

                  {zones.includes(zone) && (
                    <span
                      className="graft-zone-check"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>

            {stage && stage !== "1" && (
              <p className="graft-stage-hint">
                Norwood {selectedStage?.label} preselected the
                suggested zones. You can change them above.
              </p>
            )}

            {error && (
              <p className="graft-inline-error" role="alert">
                {error}
              </p>
            )}

            <div className="graft-wizard-actions">
              <span>
                {zones.length}{" "}
                {zones.length === 1 ? "zone" : "zones"} selected
              </span>

              <button
                type="button"
                className="btn btn-primary"
                onClick={next}
              >
                Continue <span aria-hidden="true">→</span>
              </button>
            </div>
          </section>
        )}

        {/* STEP 2: SEVERITY */}
        {step === 2 && (
          <section
            className="graft-wizard-panel"
            aria-labelledby="severity-heading"
          >
            <div className="graft-panel-heading">
              <span className="graft-kicker">
                Step 2 of 4
              </span>

              <h2 id="severity-heading">
                Choose the severity
              </h2>

              <p>
                Select Low, Moderate, or Severe for each affected
                scalp zone.
              </p>
            </div>

            <div className="graft-severity-list">
              {zones.map((zone) => (
                <fieldset
                  className="graft-severity-row"
                  key={zone}
                >
                  <legend>
                    <span className="graft-zone-number">
                      {zone}
                    </span>{" "}
                    Zone {zone}
                  </legend>

                  <div
                    className="graft-severity-options"
                    role="group"
                    aria-label={`Severity for zone ${zone}`}
                  >
                    {severityOptions.map((option) => (
                      <button
                        type="button"
                        className={`graft-severity-card${
                          (severities[zone] ?? "moderate") ===
                          option.value
                            ? " selected"
                            : ""
                        }`}
                        onClick={() =>
                          selectSeverity(zone, option.value)
                        }
                        aria-pressed={
                          (severities[zone] ?? "moderate") ===
                          option.value
                        }
                        key={option.value}
                      >
                        <strong>{option.label}</strong>
                        <span>{option.detail}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>

            {error && (
              <p className="graft-inline-error" role="alert">
                {error}
              </p>
            )}

            <div className="graft-wizard-actions">
              <button
                type="button"
                className="graft-back-button"
                onClick={() => {
                  setStep(1);
                  setError("");
                }}
              >
                ← Back
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={next}
              >
                See estimate{" "}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </section>
        )}

        {/* STEP 3: RESULTS */}
        {step === 3 && (
          <section
            className="graft-wizard-panel graft-estimate-panel"
            aria-labelledby="estimate-heading"
            aria-live="polite"
          >
            <div className="graft-panel-heading">
              <span className="graft-kicker">
                Your preliminary estimate
              </span>

              <h2 id="estimate-heading">
                Estimated grafts needed
              </h2>
            </div>

            {stage === "1" ? (
              <div>
                <p className="graft-estimate-disclaimer">
                  Norwood Stage I typically represents minimal or no
                  significant pattern hair loss. A graft estimate is
                  not provided for this stage. Consult a qualified
                  clinician if you have concerns about hair loss.
                </p>
              </div>
            ) : estimate && zoneEstimate ? (
              <>
                <div className="graft-total-band">
                  <span>
                    {formatNumber(estimate.low)}–
                    {formatNumber(estimate.high)}
                  </span>
                  <small>grafts</small>
                </div>

                {stage && selectedStage && (
                  <div className="graft-estimate-details">
                    <h3>
                      Norwood Stage {selectedStage.label}
                    </h3>

                    <p>{selectedStage.description}</p>
                  </div>
                )}

                <div className="graft-estimate-details">
                  <h3>Your selected zones</h3>

                  {zoneEstimate.zones.map((item) => (
                    <div
                      className="graft-estimate-row"
                      key={item.zone}
                    >
                      <span>
                        Zone {item.zone}
                        <small>
                          {severityOptions.find(
                            (option) =>
                              option.value === item.severity
                          )?.label}{" "}
                          severity
                        </small>
                      </span>

                      <strong>
                        {formatNumber(item.low)}–
                        {formatNumber(item.high)}
                      </strong>
                    </div>
                  ))}
                </div>

                <p className="graft-estimate-disclaimer">
                  {stage
                    ? "The main estimate uses your selected Norwood stage as the baseline and adjusts it using the average severity across your selected zones. The zone figures are a separate breakdown and are not added to the stage estimate."
                    : "This estimate is calculated from the selected scalp zones and their severity levels."}{" "}
                  All figures are approximate planning estimates,
                  not a diagnosis or treatment plan. Actual graft
                  requirements depend on donor hair availability,
                  hair characteristics, scalp condition, and desired
                  coverage. A qualified clinician must assess your
                  individual needs.
                </p>

                <BookButton
                  className="btn btn-primary graft-assessment-button"
                  prefill={{
                    concern: "Hair restoration consultation",
                    source: "graft-calculator",
                  }}
                >
                  Get a professional assessment
                </BookButton>
              </>
            ) : (
              <p className="graft-inline-error" role="alert">
                Your estimate is not available yet. Go back and
                select affected zones and a severity for each zone.
              </p>
            )}

            <div className="graft-wizard-actions">
              <button
                type="button"
                className="graft-back-button"
                onClick={() => setStep(2)}
              >
                ← Edit severity
              </button>
              <button type="button" className="btn btn-primary" onClick={goToDetails}>
                Continue to your details <span aria-hidden="true">→</span>
              </button>
            </div>
          </section>
        )}

        {/* STEP 4: CONTACT DETAILS AND REPORT */}
        {step === 4 && (
          <section className="graft-wizard-panel" aria-labelledby="details-heading">
            <div className="graft-panel-heading">
              <span className="graft-kicker">Step 4 of 4</span>
              <h2 id="details-heading">Your details</h2>
              <p>Share your contact details so the clinic can save your estimate and follow up with you.</p>
            </div>
            <form className={styles.leadForm} onSubmit={submitLead} noValidate>
              <h3>Send your assessment to RenovaAura</h3>
              <p>The care team can follow up about your preliminary estimate.</p>
              <div className={styles.leadFields}>
                <label>
                  Name
                  <input autoComplete="name" value={patient.name} onChange={(event) => setPatient((current) => ({ ...current, name: event.target.value }))} disabled={leadSubmitted || leadSubmitting} required />
                </label>
                <label>
                  Phone
                  <input autoComplete="tel" inputMode="tel" value={patient.phone} onChange={(event) => setPatient((current) => ({ ...current, phone: event.target.value }))} disabled={leadSubmitted || leadSubmitting} required />
                </label>
                <label>
                  Email <span>(optional)</span>
                  <input autoComplete="email" type="email" value={patient.email} onChange={(event) => setPatient((current) => ({ ...current, email: event.target.value }))} disabled={leadSubmitted || leadSubmitting} />
                </label>
              </div>
              {leadError && <p className={styles.leadError} role="alert">{leadError}</p>}
              {leadSubmitted && <p className={styles.leadSuccess} role="status">Assessment saved. Your PDF report is ready to download.</p>}
              <button className="btn btn-primary" type="submit" disabled={leadSubmitting || leadSubmitted}>
                {leadSubmitting ? "Sending…" : leadSubmitted ? "Assessment sent" : "Send assessment"}
              </button>
            </form>
            {leadSubmitted && (
              <button type="button" className="btn btn-ghost" onClick={() => void downloadReport()}>
                Download PDF report
              </button>
            )}
            <div className="graft-wizard-actions">
              <button type="button" className="graft-back-button" onClick={() => setStep(3)} disabled={leadSubmitted}>
                ← Back to estimate
              </button>
              <button type="button" className="graft-back-button" onClick={reset}>
                Start again
              </button>
            </div>
          </section>
        )}
      </div>

      <details className="graft-norwood-reference">
        <summary>View Norwood stage illustrations</summary>

        <Image
          src="/norwood.webp"
          alt="Norwood stages I, II, II A, III, III Vertex, IV, IV A, V, V A, and VI"
          width={1024}
          height={511}
          sizes="(max-width: 800px) 100vw, 900px"
        />
      </details>
    </div>
  );
}
