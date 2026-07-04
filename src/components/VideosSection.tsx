"use client";

import { useState } from "react";
import Lightbox, {
  type LightboxItem,
  videoPoster,
} from "@/components/Lightbox";
import type { Video } from "@/sanity/lib/fetchers";

function posterFor(v: Video): string | null {
  if (v.thumbnail) return v.thumbnail;
  const url = v.youtubeUrl || v.vimeoUrl || "";
  return videoPoster(v.sourceType, url);
}

function sourceUrl(v: Video): string {
  if (v.sourceType === "youtube") return v.youtubeUrl || "";
  if (v.sourceType === "vimeo") return v.vimeoUrl || "";
  return v.fileUrl || "";
}

export default function VideosSection({
  videos,
  heading = "Videos",
  subheading = "See it in motion.",
}: {
  videos: Video[];
  heading?: string;
  subheading?: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const playable = videos.filter((v) => sourceUrl(v));
  if (!playable.length) return null;

  const items: LightboxItem[] = playable.map((v) => ({
    kind: "video",
    provider: v.sourceType,
    url: sourceUrl(v),
    title: v.title,
  }));

  return (
    <section className="section related-section vid-section">
      <div className="container">
        <div className="eyebrow" style={{ marginBottom: 18 }}>
          {heading}
        </div>
        <h2 style={{ marginBottom: 40 }}>{subheading}</h2>
        <div className="vid-grid">
          {playable.map((v, i) => {
            const poster = posterFor(v);
            return (
              <button
                key={v.id}
                className="vid-card"
                onClick={() => setActive(i)}
                aria-label={`Play video: ${v.title}`}
              >
                <div className="vid-card-media">
                  {poster ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={poster} alt={v.title} loading="lazy" />
                  ) : (
                    <div className="vid-card-placeholder" aria-hidden="true" />
                  )}
                  <span className="vid-play" aria-hidden="true">
                    ▶
                  </span>
                </div>
                <div className="vid-card-body">
                  <h3 className="vid-card-title">{v.title}</h3>
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
