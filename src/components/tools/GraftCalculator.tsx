"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import BookButton from "@/components/BookButton";
import styles from "./GraftCalculator.module.css";
import {
  calculateGrafts,
  GRAFT_ZONES,
  NORWOOD_STAGES,
  type GraftZone,
  type Norwood,
  type Severity,
} from "@/lib/graftCalculator";

const severityOptions: { value: Severity; label: string; detail: string }[] = [
  { value: "mild", label: "Minimal", detail: "A small or early area" },
  { value: "moderate", label: "Moderate", detail: "Noticeable thinning or recession" },
  { value: "severe", label: "Severe", detail: "A larger area with advanced loss" },
];

export default function GraftCalculator() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [stage, setStage] = useState<Norwood | null>(null);
  const [zones, setZones] = useState<GraftZone[]>([]);
  const [severities, setSeverities] = useState<Partial<Record<GraftZone, Severity>>>({});
  const [error, setError] = useState("");

  const estimate = useMemo(() => {
    if (!zones.length || zones.some((zone) => !severities[zone])) return null;
    return calculateGrafts(
      zones.map((zone) => ({ zone, severity: severities[zone] as Severity })),
    );
  }, [zones, severities]);

  const selectStage = (value: Norwood | null) => {
    setStage(value);
    if (value === null) {
      setError("");
      return;
    }
    const suggested = value
      ? NORWOOD_STAGES.find((item) => item.value === value)?.zones ?? []
      : [];
    setZones([...suggested]);
    setSeverities({});
    setError("");
  };

  const toggleZone = (zone: GraftZone) => {
    setZones((current) => {
      if (current.includes(zone)) return current.filter((item) => item !== zone);
      return [...current, zone].sort((a, b) => a - b);
    });
    setSeverities((current) => {
      const next = { ...current };
      if (zones.includes(zone)) delete next[zone];
      return next;
    });
    setError("");
  };

  const next = () => {
    if (step === 1 && !zones.length) {
      setError("Select at least one affected scalp zone to continue.");
      return;
    }
    if (step === 2 && !estimate) {
      setError("Choose a severity for every selected zone.");
      return;
    }
    setError("");
    setStep((current) => Math.min(3, current + 1) as 1 | 2 | 3);
  };

  const reset = () => {
    setStep(1);
    setStage(null);
    setZones([]);
    setSeverities({});
    setError("");
  };

  return (
    <div className={`tool-shell graft-calculator ${styles.calculatorStyles}`}>
      <header className="tool-shell-head">
        <div className="tool-shell-eyebrow">Hair restoration planning tool</div>
        <h1 className="tool-shell-title">Hair Graft Calculator</h1>
        <p className="tool-shell-sub">
          Select the areas you want assessed, choose how much hair loss you see, and get a quick planning estimate.
        </p>
      </header>

      <div className="graft-wizard">
        <nav className="graft-progress" aria-label="Calculator steps">
          {(["Select zones", "Choose severity", "Your estimate"] as const).map((label, index) => {
            const number = (index + 1) as 1 | 2 | 3;
            return (
              <div className={`graft-progress-step${step === number ? " active" : ""}${step > number ? " complete" : ""}`} key={label}>
                <span>{number}</span><strong>{label}</strong>
              </div>
            );
          })}
        </nav>

        {step === 1 && (
          <section className="graft-wizard-panel" aria-labelledby="zones-heading">
            <div className="graft-panel-heading">
              <span className="graft-kicker">Step 1 of 3</span>
              <h2 id="zones-heading">Select your balding zones</h2>
              <p>Tap the numbered zones that best match the areas you would like assessed.</p>
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
                <p>Choose one to preselect common areas, or select zones above by number.</p>
              </div>
              <div className="graft-stage-options" role="group" aria-label="Norwood stage">
                <button className={`graft-stage-chip${stage === null ? " selected" : ""}`} type="button" onClick={() => selectStage(null)} aria-pressed={stage === null}>Skip</button>
                {NORWOOD_STAGES.map((item) => (
                  <button
                    className={`graft-stage-chip${stage === item.value ? " selected" : ""}`}
                    type="button"
                    key={item.value}
                    onClick={() => selectStage(item.value)}
                    aria-pressed={stage === item.value}
                    title={item.description}
                  >{item.label}</button>
                ))}
              </div>
            </div>

            <div className="graft-zone-picks" role="group" aria-label="Affected scalp zones">
              {GRAFT_ZONES.map((zone) => (
                <button
                  key={zone}
                  type="button"
                  className={`graft-zone-pick${zones.includes(zone) ? " selected" : ""}`}
                  onClick={() => toggleZone(zone)}
                  aria-pressed={zones.includes(zone)}
                >
                  <span className="graft-zone-number">{zone}</span>
                  <span>Zone {zone}</span>
                  {zones.includes(zone) && <span className="graft-zone-check" aria-hidden="true">✓</span>}
                </button>
              ))}
            </div>

            {stage && <p className="graft-stage-hint">Norwood {NORWOOD_STAGES.find((item) => item.value === stage)?.label} preselected the suggested zones. You can change them above.</p>}
            {error && <p className="graft-inline-error" role="alert">{error}</p>}
            <div className="graft-wizard-actions">
              <span>{zones.length} {zones.length === 1 ? "zone" : "zones"} selected</span>
              <button type="button" className="btn btn-primary" onClick={next}>Continue <span aria-hidden="true">→</span></button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="graft-wizard-panel" aria-labelledby="severity-heading">
            <div className="graft-panel-heading">
              <span className="graft-kicker">Step 2 of 3</span>
              <h2 id="severity-heading">Choose the severity</h2>
              <p>Select the closest description for each zone you selected.</p>
            </div>
            <div className="graft-severity-list">
              {zones.map((zone) => (
                <fieldset className="graft-severity-row" key={zone}>
                  <legend><span className="graft-zone-number">{zone}</span> Zone {zone}</legend>
                  <div className="graft-severity-options" role="group" aria-label={`Severity for zone ${zone}`}>
                    {severityOptions.map((option) => (
                      <button
                        type="button"
                        className={`graft-severity-card${severities[zone] === option.value ? " selected" : ""}`}
                        onClick={() => setSeverities((current) => ({ ...current, [zone]: option.value }))}
                        aria-pressed={severities[zone] === option.value}
                        key={option.value}
                      >
                        <strong>{option.label}</strong><span>{option.detail}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
            {error && <p className="graft-inline-error" role="alert">{error}</p>}
            <div className="graft-wizard-actions">
              <button type="button" className="graft-back-button" onClick={() => { setStep(1); setError(""); }}>← Back</button>
              <button type="button" className="btn btn-primary" onClick={next}>See estimate <span aria-hidden="true">→</span></button>
            </div>
          </section>
        )}

        {step === 3 && estimate && (
          <section className="graft-wizard-panel graft-estimate-panel" aria-labelledby="estimate-heading" aria-live="polite">
            <div className="graft-panel-heading">
              <span className="graft-kicker">Your preliminary estimate</span>
              <h2 id="estimate-heading">Estimated grafts needed</h2>
            </div>
            <div className="graft-total-band">
              <span>{estimate.low.toLocaleString()}–{estimate.high.toLocaleString()}</span>
              <small>grafts</small>
            </div>
            <div className="graft-estimate-details">
              <h3>Your selections</h3>
              {estimate.zones.map((item) => (
                <div className="graft-estimate-row" key={item.zone}>
                  <span>Zone {item.zone}<small>{severityOptions.find((option) => option.value === item.severity)?.label} severity</small></span>
                  <strong>{item.low.toLocaleString()}–{item.high.toLocaleString()}</strong>
                </div>
              ))}
              <div className="graft-estimate-row graft-estimate-sum"><span>Combined estimate</span><strong>{estimate.low.toLocaleString()}–{estimate.high.toLocaleString()}</strong></div>
            </div>
            <p className="graft-estimate-disclaimer">
              This is a rough planning estimate based on broad zone and severity bands. It is not a diagnosis or treatment plan. A clinician must assess your scalp, hair characteristics, donor area, and goals to recommend a graft count.
            </p>
            <BookButton className="btn btn-primary graft-assessment-button" prefill={{ concern: "Hair restoration consultation", source: "graft-calculator" }}>
              Get a professional assessment
            </BookButton>
            <div className="graft-wizard-actions">
              <button type="button" className="graft-back-button" onClick={() => setStep(2)}>← Edit severity</button>
              <button type="button" className="graft-back-button" onClick={reset}>Start again</button>
            </div>
          </section>
        )}
      </div>
      <details className="graft-norwood-reference">
        <summary>View Norwood stage illustrations</summary>
        <Image src="/norwood.webp" alt="Norwood stages I, II, II A, III, III Vertex, IV, IV A, V, V A, and VI" width={1024} height={511} sizes="(max-width: 800px) 100vw, 900px" />
      </details>
    </div>
  );
}
