"use client";

import { telHref, waHref } from "@/data/clinic";
import type { ClinicData } from "@/sanity/lib/fetchers";
import { Phone } from "@/components/icons";

/**
 * Floating action stack — fixed bottom-right.
 * Call + WhatsApp quick actions. (The "Tools" button was removed — the tools
 * live in the bottom tab bar / Tools section instead.)
 */
export default function FabStack({ clinic }: { clinic: ClinicData }) {
  const wa = waHref(undefined, clinic.phone);

  return (
    <div className="fab-stack">
      <a
        className="fab fab-call fab-pulse"
        href={telHref(clinic.phone)}
        aria-label={`Call ${clinic.phone}`}
      >
        <Phone size={20} stroke={2} />
        <span className="fab-tip">Call {clinic.phone}</span>
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
