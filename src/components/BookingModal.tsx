"use client";

import { useEffect, useMemo, useState } from "react";
import { useBooking } from "@/components/BookingContext";
import { ArrowRight, Check } from "@/components/icons";
import {
  getBookings,
  getPatients,
  saveBooking,
  type SavedBooking,
  type SavedPatient,
} from "@/lib/bookingStore";

// RenovaAura services — map to the two surgical pillars + dermatology.
const CONCERN_CHIPS = [
  "Hair Transplant (FUE / DHI)",
  "Plastic Surgery — Face",
  "Plastic Surgery — Body",
  "Rhinoplasty",
  "Facelift / Anti-ageing",
  "Skin concern (acne, pigmentation, etc.)",
  "Laser Hair Reduction",
  "Something else",
];

const TIMES = ["9:30", "11:00", "12:30", "2:00", "4:30", "6:00", "7:30"];
const DISABLED_SLOTS = ["12:30", "6:00"];
// Only surface bookable slots — unavailable ones are hidden, not greyed out.
const AVAILABLE_TIMES = TIMES.filter((t) => !DISABLED_SLOTS.includes(t));

// Single physical location — preselected, not a dropdown choice.
const CLINIC = "RenovaAura · Main Clinic";

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
  city: CLINIC,
  date: "",
  time: "",
  name: "",
  phone: "",
  email: "",
  age: "",
};

export default function BookingModal() {
  const { isOpen, close, prefill } = useBooking();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // On-device memory: saved patients + their booking history (private, no server).
  const [savedPatients, setSavedPatients] = useState<SavedPatient[]>([]);
  const [savedBookings, setSavedBookings] = useState<SavedBooking[]>([]);
  useEffect(() => {
    setSavedPatients(getPatients());
    setSavedBookings(getBookings());
  }, []);

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
    } else {
      // Opening — prefill personal details from the most-recent patient saved
      // on this device, plus any package/doctor concern passed in.
      const patient = savedPatients[savedPatients.length - 1];
      setData({
        ...EMPTY,
        concern: prefill?.concern ?? "",
        name: patient?.name ?? "",
        phone: patient?.phone ?? "",
        email: patient?.email ?? "",
        age: patient?.age ?? "",
      });
      setStep(prefill?.concern ? 1 : 0);
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
          source: prefill?.source ?? "website-booking-modal",
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
      saveBooking({
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        age: data.age || undefined,
        concern: data.concern || undefined,
        clinic: data.city,
        date: data.date || undefined,
        time: data.time || undefined,
      });
      setSavedPatients(getPatients());
      setSavedBookings(getBookings());
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
              The RenovaAura Consult
            </div>
            <h3>
              Sit with a board-certified consultant. Walk out with a written
              plan.
            </h3>
            <p style={{ marginTop: 14 }}>
              A one-on-one assessment for your hair transplant, plastic surgery
              or skin concern — unhurried, honest, never high-pressure.
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
              Personalised assessment + treatment plan
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
          {prefill?.concern && step < 3 && (
            <div className="modal-prefill-note">
              You&apos;re booking: <strong>{prefill.concern}</strong>
            </div>
          )}
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

          {step === 0 && savedBookings.length > 0 && (
            <div className="your-appts">
              <div className="your-appts-title">Your appointments</div>
              {savedBookings.slice(0, 4).map((b) => (
                <div className="your-appt" key={b.id}>
                  <div className="your-appt-main">
                    <strong>{b.name}</strong>
                    {b.concern ? ` · ${b.concern}` : ""}
                  </div>
                  <div className="your-appt-meta">
                    {[b.date, b.time, b.clinic].filter(Boolean).join(" · ")}
                  </div>
                </div>
              ))}
              <div className="your-appts-note">
                Saved on this device. Book another below.
              </div>
            </div>
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
              <div className="field">
                <label>Clinic</label>
                <div className="field-static">{data.city}</div>
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
                  style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
                >
                  {AVAILABLE_TIMES.map((t) => (
                    <button
                      key={t}
                      type="button"
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
              {savedPatients.length > 0 && (
                <div className="patient-picker">
                  <label>Booking for</label>
                  <div className="patient-chip-row">
                    {savedPatients.map((p) => (
                      <button
                        key={`${p.name}|${p.phone}`}
                        type="button"
                        className={
                          "patient-chip" +
                          (data.name === p.name && data.phone === p.phone
                            ? " selected"
                            : "")
                        }
                        onClick={() =>
                          setData((d) => ({
                            ...d,
                            name: p.name,
                            phone: p.phone,
                            email: p.email ?? "",
                            age: p.age ?? "",
                          }))
                        }
                      >
                        {p.name}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="patient-chip patient-chip-add"
                      onClick={() =>
                        setData((d) => ({
                          ...d,
                          name: "",
                          email: "",
                          age: "",
                          // keep phone — a family often shares one number
                        }))
                      }
                    >
                      + Add new patient
                    </button>
                  </div>
                </div>
              )}
              <div className={"field" + (errors.name ? " error" : "")}>
                <label htmlFor="bk-name">Full name</label>
                <input
                  id="bk-name"
                  name="name"
                  autoComplete="name"
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
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
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
                  name="email"
                  type="email"
                  autoComplete="email"
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
