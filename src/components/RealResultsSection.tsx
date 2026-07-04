"use client";

import { useState } from "react";
import Lightbox, { type LightboxItem } from "@/components/Lightbox";
import type { RealResult } from "@/sanity/lib/fetchers";

export default function RealResultsSection({
  results,
  heading = "Real Results",
  subheading = "Actual patient outcomes.",
}: {
  results: RealResult[];
  heading?: string;
  subheading?: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  if (!results.length) return null;

  const items: LightboxItem[] = results.map((r) => ({
    kind: "beforeafter",
    before: r.before || r.after || "",
    after: r.after,
    title: r.title,
    caption: r.caption,
  }));

  return (
    <section className="section related-section rr-section">
      <div className="container">
        <div className="eyebrow" style={{ marginBottom: 18 }}>
          {heading}
        </div>
        <h2 style={{ marginBottom: 40 }}>{subheading}</h2>
        <div className="rr-grid">
          {results.map((r, i) => {
            const cover = r.after || r.before;
            return (
              <button
                key={r.id}
                className="rr-card"
                onClick={() => setActive(i)}
                aria-label={`View result: ${r.title}`}
              >
                <div className="rr-card-media">
                  {cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt={r.title} loading="lazy" />
                  )}
                  {r.after && r.before && (
                    <span className="rr-card-badge">Before / After</span>
                  )}
                  <span className="rr-card-zoom" aria-hidden="true">
                    ⤢
                  </span>
                </div>
                <div className="rr-card-body">
                  <h3 className="rr-card-title">{r.title}</h3>
                  {r.caption && <p className="rr-card-caption">{r.caption}</p>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {active !== null && (
        <Lightbox
          item={items[active]}
          onClose={() => setActive(null)}
          hasPrev={active > 0}
          hasNext={active < items.length - 1}
          onPrev={() => setActive((i) => (i ?? 0) - 1)}
          onNext={() => setActive((i) => (i ?? 0) + 1)}
        />
      )}
    </section>
  );
}
