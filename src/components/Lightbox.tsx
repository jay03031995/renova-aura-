"use client";

import { useCallback, useEffect } from "react";

export type LightboxItem =
  | { kind: "image"; src: string; title?: string; caption?: string }
  | {
      kind: "beforeafter";
      before: string;
      after?: string;
      title?: string;
      caption?: string;
    }
  | {
      kind: "video";
      provider: string; // "youtube" | "vimeo" | "upload"
      url: string;
      title?: string;
    };

function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/,
  );
  return m ? m[1] : null;
}
function vimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

export function videoEmbedUrl(provider: string, url: string): string | null {
  if (provider === "youtube") {
    const id = youtubeId(url);
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
  }
  if (provider === "vimeo") {
    const id = vimeoId(url);
    return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
  }
  return url; // uploaded file
}

/** YouTube/Vimeo poster thumbnail derived from the URL (fallback). */
export function videoPoster(provider: string, url: string): string | null {
  if (provider === "youtube") {
    const id = youtubeId(url);
    return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
  }
  return null;
}

export default function Lightbox({
  item,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  item: LightboxItem;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev?.();
      if (e.key === "ArrowRight" && hasNext) onNext?.();
    },
    [onClose, onPrev, onNext, hasPrev, hasNext],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  return (
    <div
      className="lb-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={item.title || "Media viewer"}
      onClick={onClose}
    >
      <button className="lb-close" aria-label="Close" onClick={onClose}>
        ×
      </button>
      {hasPrev && (
        <button
          className="lb-nav lb-prev"
          aria-label="Previous"
          onClick={(e) => {
            e.stopPropagation();
            onPrev?.();
          }}
        >
          ‹
        </button>
      )}
      {hasNext && (
        <button
          className="lb-nav lb-next"
          aria-label="Next"
          onClick={(e) => {
            e.stopPropagation();
            onNext?.();
          }}
        >
          ›
        </button>
      )}

      <div className="lb-content" onClick={(e) => e.stopPropagation()}>
        {item.kind === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="lb-image" src={item.src} alt={item.title || ""} />
        )}

        {item.kind === "beforeafter" && (
          <div className="lb-ba">
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.before} alt={`${item.title || "Result"} — before`} />
              {item.after && <figcaption>Before</figcaption>}
            </figure>
            {item.after && (
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.after} alt={`${item.title || "Result"} — after`} />
                <figcaption>After</figcaption>
              </figure>
            )}
          </div>
        )}

        {item.kind === "video" &&
          (item.provider === "upload" ? (
            <video className="lb-video" src={item.url} controls autoPlay />
          ) : (
            <div className="lb-video-frame">
              <iframe
                src={videoEmbedUrl(item.provider, item.url) || item.url}
                title={item.title || "Video"}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          ))}

        {(item.title || (item.kind !== "video" && item.caption)) && (
          <div className="lb-caption">
            {item.title && <strong>{item.title}</strong>}
            {item.kind !== "video" && item.caption ? ` · ${item.caption}` : ""}
          </div>
        )}
      </div>
    </div>
  );
}
