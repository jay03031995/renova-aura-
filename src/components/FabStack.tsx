"use client";

import { CLINIC, telHref, waHref } from "@/data/clinic";
import { Phone } from "@/components/icons";

/**
 * Floating action stack — fixed bottom-right.
 * Call + WhatsApp quick actions. (The "Tools" button was removed — the tools
 * live in the bottom tab bar / Tools section instead.)
 */
export default function FabStack() {
  const wa = waHref();

  return (
    <div className="fab-stack">
      <a
        className="fab fab-call fab-pulse"
        href={telHref()}
        aria-label={`Call ${CLINIC.phone}`}
      >
        <Phone size={20} stroke={2} />
        <span className="fab-tip">Call {CLINIC.phone}</span>
      </a>
      <a
        className="fab fab-wa"
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
      >
        <img src="/whatsapp.svg" alt="" />
        <span className="fab-tip">Chat on WhatsApp</span>
      </a>
    </div>
  );
}
