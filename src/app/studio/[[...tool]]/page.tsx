/**
 * Sanity Studio mount.
 *
 * The Studio is a fully client-side React tree — auth, image uploads and
 * content editing all happen client-side against the Sanity API. We avoid
 * server-side evaluation entirely by dynamically importing the Studio
 * component with `ssr: false` from this client page.
 */

"use client";

import dynamic from "next/dynamic";

const Studio = dynamic(() => import("./Studio"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        padding: "60px 40px",
        fontFamily: "system-ui, sans-serif",
        color: "#42301f",
      }}
    >
      Loading Dermaheal admin…
    </div>
  ),
});

export default function StudioPage() {
  return <Studio />;
}
