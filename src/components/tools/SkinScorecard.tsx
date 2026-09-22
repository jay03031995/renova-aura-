"use client";

import type { SkinMetric } from "@/lib/skinAnalysis";

/**
 * Heat-map style scorecard: the patient's uploaded photo framed, with
 * per-attribute score rings arranged around it (left / right columns on
 * desktop, a 2-up grid below the photo on phone).
 */
export default function SkinScorecard({
  photo,
  metrics,
}: {
  photo?: string;
  metrics: SkinMetric[];
}) {
  if (!metrics.length) return null;
  const half = Math.ceil(metrics.length / 2);
  const left = metrics.slice(0, half);
  const right = metrics.slice(half);

  return (
    <div className="scorecard">
      <div className="scorecard-col scorecard-col-left">
        {left.map((m) => (
          <Ring key={m.key} m={m} />
        ))}
      </div>

      <div className="scorecard-photo-wrap">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="Your uploaded skin photo" className="scorecard-photo" />
        ) : (
          <div className="scorecard-photo scorecard-photo-empty">
            Upload a photo to see your skin map
          </div>
        )}
        <div className="scorecard-photo-glow" aria-hidden="true" />
      </div>

      <div className="scorecard-col scorecard-col-right">
        {right.map((m) => (
          <Ring key={m.key} m={m} />
        ))}
      </div>
    </div>
  );
}

function Ring({ m }: { m: SkinMetric }) {
  return (
    <div className={"scorecard-ring tone-" + m.tone}>
      <div className="scorecard-ring-circle">
        <span>{m.score}</span>
      </div>
      <div className="scorecard-ring-label">{m.label}</div>
    </div>
  );
}
