"use client";

import { useEffect, useMemo, useState } from "react";
import { useBooking } from "@/components/BookingContext";
import { ArrowRight, Check } from "@/components/icons";

const CONCERN_CHIPS = [
  "Acne or scars",
  "Pigmentation / melasma",
  "Anti-ageing",
  "Hair loss",
  "Laser hair removal",
  "Bridal program",
  "Body / contouring",
  "Something else",
];

const TIMES = ["9:30", "11:00", "12:30", "2:00", "4:30", "6:00", "7:30"];
const DISABLED_SLOTS = ["12:30", "6:00"];

type FormData = {
  concern: string;
  city: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  age: string;
};

const EMPTY: FormData = {
  concern: "",
  city: "",
  date: "",
  time: "",
  name: "",
  phone: "",
  email: "",
  age: "",
};

export default function BookingModal() {
  const { isOpen, close } = useBooking();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reset form when the modal closes — adjusted during render per React docs.
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) {
      setStep(0);
      setErrors({});
      setData(EMPTY);
      setSubmitError(null);
      setSubmitting(false);
    }
  }

  // Body-scroll lock — a DOM side-effect, belongs in useEffect.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const validateStep = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (step === 0) {
      if (!data.concern) e.concern = "Pick what brought you here";
    } else if (step === 1) {
      if (!data.city) e.city = "Pick a city";
      if (!data.date) e.date = "Pick a date";
      if (!data.time) e.time = "Pick a time";
    } else if (step === 2) {
      if (!data.name || data.name.length < 2) e.name = "Full name needed";
      if (!/^\+?[0-9\s-]{10,}$/.test(data.phone)) e.phone = "Valid phone please";
      if (!/^\S+@\S+\.\S+$/.test(data.email)) e.email = "Valid email please";
      if (!data.age) e.age = "Age range required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitBooking = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email,
          age: data.age,
          concern: data.concern,
          city: data.city,
          date: data.date,
          time: data.time,
          source: "website-booking-modal",
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };
      if (!res.ok || !payload.ok) {
        throw new Error(
          payload.message ||
            `Booking failed (${res.status}). Please call the clinic.`,
        );
      }
      setStep(3);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Could not save your booking. Please call the clinic on +91 80809 10191.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const next = () => {
    if (!validateStep()) return;
    if (step === 2) {
      void submitBooking();
      return;
    }
    setStep((s) => Math.min(s + 1, 3));
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const dates = useMemo(() => {
    const arr = [] as { v: string; d: number; wd: string }[];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      arr.push({
        v: d.toISOString().slice(0, 10),
        d: d.getDate(),
        wd: weekdays[d.getDay()],
      });
    }
    return arr;
  }, []);

  return (
    <div
      className={"modal-backdrop" + (isOpen ? " open" : "")}
      onClick={close}
      aria-hidden={!isOpen}
    >
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Book a consultation"
      >
        <button
          className="modal-close"
          onClick={close}
          type="button"
          aria-label="Close booking form"
        >
          ×
        </button>

        <aside className="modal-side">
          <div>
            <div
              className="eyebrow"
              style={{ color: "var(--sand)", marginBottom: 18 }}
            >
              The Dermaheal Consult
            </div>
            <h3>Sit with an MD dermatologist. Walk out with a written plan.</h3>
            <p style={{ marginTop: 14 }}>
              A one-on-one assessment of your skin or hair concern, unhurried, honest,
              calibrated for Indian skin.
            </p>
          </div>
          <div className="modal-perks">
            <div className="modal-perk">
              <span className="modal-perk-check">
                <Check />
              </span>{" "}
              No-obligation, written plan
            </div>
            <div className="modal-perk">
              <span className="modal-perk-check">
                <Check />
              </span>{" "}
              Personalised skin assessment
            </div>
            <div className="modal-perk">
              <span className="modal-perk-check">
                <Check />
              </span>{" "}
              Itemised plan before any treatment
            </div>
            <div className="modal-perk">
              <span className="modal-perk-check">
                <Check />
              </span>{" "}
              WhatsApp confirmation in 10 min
            </div>
          </div>
        </aside>

        <div className="modal-body">
          {step < 3 && (
            <>
              <div className="steps-indicator">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={
                      "step-dot" +
                      (i < step ? " done" : i === step ? " active" : "")
                    }
                  />
                ))}
              </div>
              <div className="step-label">Step {step + 1} of 3</div>
            </>
          )}

          {step === 0 && (
            <>
              <h4>What brings you in today?</h4>
              <div className="chip-grid">
                {CONCERN_CHIPS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={
                      "choice-chip" + (data.concern === c ? " selected" : "")
                    }
                    onClick={() => set("concern", c)}
                  >
                    <span className="choice-chip-dot" /> {c}
                  </button>
                ))}
              </div>
              {errors.concern && (
                <div className="field-error" style={{ marginTop: 8 }}>
                  {errors.concern}
                </div>
              )}
              <div className="modal-actions">
                <span />
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={next}
                >
                  Continue{" "}
                  <span className="arrow">
                    <ArrowRight />
                  </span>
                </button>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h4>Pick a slot that suits you.</h4>
              <div className={"field" + (errors.city ? " error" : "")}>
                <label htmlFor="bk-city">City / Clinic</label>
                <select
                  id="bk-city"
                  value={data.city}
                  onChange={(e) => set("city", e.target.value)}
                >
                  <option value="">Select a clinic…</option>
                  <option>Dwarka · Sector 7, Ramphal Chowk</option>
                </select>
                {errors.city && (
                  <div className="field-error">{errors.city}</div>
                )}
              </div>

              <div className={"field" + (errors.date ? " error" : "")}>
                <label>Date</label>
                <div className="slot-grid">
                  {dates.map((d) => (
                    <button
                      key={d.v}
                      type="button"
                      className={
                        "slot" + (data.date === d.v ? " selected" : "")
                      }
                      onClick={() => set("date", d.v)}
                    >
                      <div style={{ fontSize: 10, opacity: 0.7 }}>{d.wd}</div>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 500,
                          marginTop: 2,
                        }}
                      >
                        {d.d}
                      </div>
                    </button>
                  ))}
                </div>
                {errors.date && (
                  <div className="field-error">{errors.date}</div>
                )}
              </div>

              <div className={"field" + (errors.time ? " error" : "")}>
                <label>Time</label>
                <div
                  className="slot-grid"
                  style={{ gridTemplateColumns: "repeat(7, 1fr)" }}
                >
                  {TIMES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      disabled={DISABLED_SLOTS.includes(t)}
                      className={
                        "slot" + (data.time === t ? " selected" : "")
                      }
                      onClick={() => set("time", t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {errors.time && (
                  <div className="field-error">{errors.time}</div>
                )}
              </div>

              <div className="modal-actions">
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={back}
                >
                  Back
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={next}
                >
                  Continue{" "}
                  <span className="arrow">
                    <ArrowRight />
                  </span>
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h4>A few details to confirm.</h4>
              <div className={"field" + (errors.name ? " error" : "")}>
                <label htmlFor="bk-name">Full name</label>
                <input
                  id="bk-name"
                  value={data.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Priya Sharma"
                />
                {errors.name && (
                  <div className="field-error">{errors.name}</div>
                )}
              </div>
              <div className="field-row">
                <div className={"field" + (errors.phone ? " error" : "")}>
                  <label htmlFor="bk-phone">Phone</label>
                  <input
                    id="bk-phone"
                    value={data.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && (
                    <div className="field-error">{errors.phone}</div>
                  )}
                </div>
                <div className={"field" + (errors.age ? " error" : "")}>
                  <label htmlFor="bk-age">Age range</label>
                  <select
                    id="bk-age"
                    value={data.age}
                    onChange={(e) => set("age", e.target.value)}
                  >
                    <option value="">Select…</option>
                    <option>Under 25</option>
                    <option>25 to 34</option>
                    <option>35 to 44</option>
                    <option>45 to 54</option>
                    <option>55 +</option>
                  </select>
                  {errors.age && (
                    <div className="field-error">{errors.age}</div>
                  )}
                </div>
              </div>
              <div className={"field" + (errors.email ? " error" : "")}>
                <label htmlFor="bk-email">Email</label>
                <input
                  id="bk-email"
                  value={data.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <div className="field-error">{errors.email}</div>
                )}
              </div>
              {submitError && (
                <div
                  className="field-error"
                  role="alert"
                  style={{ marginTop: 12 }}
                >
                  {submitError}
                </div>
              )}
              <div className="modal-actions">
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={back}
                  disabled={submitting}
                >
                  Back
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={next}
                  disabled={submitting}
                  aria-busy={submitting}
                >
                  {submitting ? "Saving…" : "Confirm booking"}{" "}
                  {!submitting && (
                    <span className="arrow">
                      <ArrowRight />
                    </span>
                  )}
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="success-state">
              <div className="success-icon">
                <Check />
              </div>
              <h4>
                You&apos;re on the books,{" "}
                {data.name.split(" ")[0] || "friend"}.
              </h4>
              <p>
                We&apos;ve sent a confirmation to {data.email}. Our care team will
                WhatsApp you within 10 minutes.
              </p>
              <div className="summary-box">
                <div className="summary-row">
                  <span>Concern</span>
                  <span>{data.concern}</span>
                </div>
                <div className="summary-row">
                  <span>Clinic</span>
                  <span>{data.city}</span>
                </div>
                <div className="summary-row">
                  <span>When</span>
                  <span>
                    {data.date} · {data.time}
                  </span>
                </div>
                <div className="summary-row">
                  <span>Includes</span>
                  <span>Skin assessment + written plan</span>
                </div>
              </div>
              <button
                className="btn btn-primary"
                type="button"
                style={{ marginTop: 26 }}
                onClick={close}
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
