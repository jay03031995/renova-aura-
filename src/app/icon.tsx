import { ImageResponse } from "next/og";

/**
 * Branded browser-tab favicon — replaces the default Next.js icon.
 * A sage-green rounded tile with a cream "R" monogram, derived from the
 * RenovaAura logo palette (see globals.css :root).
 */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #5A6B3D 0%, #2A3520 100%)",
          color: "#FAFAF6",
          fontSize: 22,
          fontWeight: 700,
          borderRadius: 7,
          fontFamily: "serif",
        }}
      >
        R
      </div>
    ),
    { ...size },
  );
}
