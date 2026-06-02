import { ImageResponse } from "next/og";

/**
 * Default social-share card (Open Graph) — what appears when any RenovaAura
 * link is shared on WhatsApp, LinkedIn, Facebook, iMessage, Slack, etc.
 * Branded sage gradient with the wordmark, specialties and site URL.
 *
 * Next injects og:image / og:image:width / og:image:height automatically from
 * this file; the matching twitter-image.tsx re-exports it for X/Twitter cards.
 */
export const alt =
  "RenovaAura — Hair Transplant & Plastic Surgery Specialists";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #2A3520 0%, #4A5A35 55%, #5A6B3D 100%)",
          color: "#FAFAF6",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#FAFAF6",
              color: "#2A3520",
              fontSize: 40,
              fontWeight: 700,
              borderRadius: 14,
              fontFamily: "serif",
            }}
          >
            R
          </div>
          <span style={{ fontSize: 30, letterSpacing: 6, color: "#A8B88C" }}>
            RENOVAAURA
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>
            Hair Transplant &amp; Plastic Surgery
          </div>
          <div style={{ fontSize: 34, color: "#D8DEC7", maxWidth: 880 }}>
            Board-certified surgeons. FUE · DHI · rhinoplasty · facelift —
            natural-looking, clinically-grounded results.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 26,
            color: "#A8B88C",
          }}
        >
          <span>renovaaura.com</span>
          <span>New Delhi · Anand Vihar</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
