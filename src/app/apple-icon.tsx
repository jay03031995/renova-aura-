import { ImageResponse } from "next/og";

/**
 * Apple touch icon (home-screen / bookmark). Same sage monogram as icon.tsx,
 * sized 180×180 with a touch more padding so it reads well on iOS.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 112,
          fontWeight: 700,
          fontFamily: "serif",
        }}
      >
        R
      </div>
    ),
    { ...size },
  );
}
