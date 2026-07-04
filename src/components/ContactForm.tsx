"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
      email: String(data.get("email") || ""),
      concern: String(data.get("message") || ""),
      source: "website-contact",
    };
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || "Something went wrong.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="contact-form-success">
        <div className="contact-form-success-icon">✓</div>
        <h3>Thank you — we&apos;ve got your message.</h3>
        <p>Our care team will call you back within clinic hours.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <div className="contact-form-row">
        <label>
          <span>Full name *</span>
          <input name="name" type="text" required minLength={2} autoComplete="name" />
        </label>
        <label>
          <span>Phone *</span>
          <input name="phone" type="tel" required autoComplete="tel" />
        </label>
      </div>
      <label>
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" />
      </label>
      <label>
        <span>How can we help?</span>
        <textarea name="message" rows={4} placeholder="Tell us about your concern or the treatment you're interested in." />
      </label>
      {status === "error" && <p className="contact-form-error">{error}</p>}
      <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
