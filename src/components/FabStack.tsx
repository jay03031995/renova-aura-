"use client";

import { useState } from "react";
import Link from "next/link";
import { CLINIC, telHref, waHref } from "@/data/clinic";
import { Phone, Sparkle } from "@/components/icons";

/**
 * Floating action stack — fixed bottom-right.
 *
 * Replaced the old "Shop" button with a "Tools" feature button that opens
 * a small menu of patient tools (AI Skin Analysis + Hair Graft Calculator).
 * Phone + WhatsApp buttons retained.
 */
export default function FabStack() {
  const wa = waHref("Hi RenovaAura, I'd like to book a consultation.");
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <div className="fab-stack">
      <div className={"fab-tools-wrap" + (toolsOpen ? " open" : "")}>
        <button
          type="button"
          className="fab fab-tools"
          onClick={() => setToolsOpen((v) => !v)}
          aria-expanded={toolsOpen}
          aria-label="Patient tools"
        >
          <Sparkle />
          <span>Tools</span>
        </button>
        {toolsOpen && (
          <div className="fab-tools-menu" role="menu">
            <Link
              href="/tools/skin-analysis"
              className="fab-tools-item"
              role="menuitem"
              onClick={() => setToolsOpen(false)}
            >
              <span className="fab-tools-item-icon">✦</span>
              <span>
                <strong>AI Skin Analysis</strong>
                <small>2-min · free PDF</small>
              </span>
            </Link>
            <Link
              href="/tools/graft-calculator"
              className="fab-tools-item"
              role="menuitem"
              onClick={() => setToolsOpen(false)}
            >
              <span className="fab-tools-item-icon">◍</span>
              <span>
                <strong>Hair Graft Calculator</strong>
                <small>Norwood-based · free PDF</small>
              </span>
            </Link>
            <Link
              href="/tools"
              className="fab-tools-item fab-tools-all"
              role="menuitem"
              onClick={() => setToolsOpen(false)}
            >
              All patient tools →
            </Link>
          </div>
        )}
      </div>
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
        <img src="/whatsapp-icon.png" alt="" />
        <span className="fab-tip">Chat on WhatsApp</span>
      </a>
    </div>
  );
}
