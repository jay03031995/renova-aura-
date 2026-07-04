"use client";

import { useMemo, useState } from "react";
import Lightbox, {
  type LightboxItem,
  videoPoster,
} from "@/components/Lightbox";
import type {
  GalleryImage,
  RealResult,
  Video,
} from "@/sanity/lib/fetchers";

type GItem = {
  id: string;
  kind: "image" | "video";
  category: string;
  title: string;
  thumb: string;
  featured: boolean;
  order: number;
  lightbox: LightboxItem;
};

const TYPE_FILTERS = ["All", "Images", "Videos"] as const;

function videoSource(v: Video): string {
  if (v.sourceType === "youtube") return v.youtubeUrl || "";
  if (v.sourceType === "vimeo") return v.vimeoUrl || "";
  return v.fileUrl || "";
}

export default function GalleryClient({
  images,
  results,
  videos,
}: {
  images: GalleryImage[];
  results: RealResult[];
  videos: Video[];
}) {
  const items = useMemo<GItem[]>(() => {
    const out: GItem[] = [];
    for (const g of images) {
      if (!g.image) continue;
      out.push({
        id: g.id,
        kind: "image",
        category: g.category,
        title: g.title,
        thumb: g.image,
        featured: g.featured,
        order: g.displayOrder,
        lightbox: { kind: "image", src: g.image, title: g.title, caption: g.description },
      });
    }
    for (const r of results) {
      const cover = r.after || r.before;
      if (!cover) continue;
      out.push({
        id: r.id,
        kind: "image",
        category: r.category,
        title: r.title,
        thumb: cover,
        featured: r.featured,
        order: r.displayOrder,
        lightbox: {
          kind: "beforeafter",
          before: r.before || cover,
          after: r.after,
          title: r.title,
          caption: r.caption,
        },
      });
    }
    for (const v of videos) {
      const url = videoSource(v);
      if (!url) continue;
      const thumb =
        v.thumbnail || videoPoster(v.sourceType, url) || "";
      out.push({
        id: v.id,
        kind: "video",
        category: v.category,
        title: v.title,
        thumb,
        featured: v.featured,
        order: v.displayOrder,
        lightbox: { kind: "video", provider: v.sourceType, url, title: v.title },
      });
    }
    return out.sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order);
  }, [images, results, videos]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.category)))],
    [items],
  );

  const [type, setType] = useState<(typeof TYPE_FILTERS)[number]>("All");
  const [category, setCategory] = useState("All");
  const [active, setActive] = useState<number | null>(null);

  const filtered = items.filter((i) => {
    if (type === "Images" && i.kind !== "image") return false;
    if (type === "Videos" && i.kind !== "video") return false;
    if (category !== "All" && i.category !== category) return false;
    return true;
  });

  return (
    <>
      <div className="gallery-filters">
        <div className="procedure-tabs" role="tablist" aria-label="Media type">
          {TYPE_FILTERS.map((t) => (
            <button
              key={t}
              className={"procedure-tab" + (t === type ? " active" : "")}
              onClick={() => setType(t)}
            >
              {t}
            </button>
          ))}
        </div>
        {categories.length > 2 && (
          <div className="procedure-tabs" role="tablist" aria-label="Category">
            {categories.map((c) => (
              <button
                key={c}
                className={"procedure-tab" + (c === category ? " active" : "")}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="gallery-empty">Nothing here yet — check back soon.</p>
      ) : (
        <div className="gallery-grid">
          {filtered.map((it, i) => (
            <button
              key={it.id}
              className={"gallery-card" + (it.kind === "video" ? " is-video" : "")}
              onClick={() => setActive(i)}
              aria-label={`${it.kind === "video" ? "Play" : "View"}: ${it.title}`}
            >
              <div className="gallery-card-media">
                {it.thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.thumb} alt={it.title} loading="lazy" />
                ) : (
                  <div className="gallery-card-placeholder" aria-hidden="true" />
                )}
                {it.kind === "video" && (
                  <span className="gallery-play" aria-hidden="true">▶</span>
                )}
                <span className="gallery-card-cat">{it.category}</span>
              </div>
              <div className="gallery-card-title">{it.title}</div>
            </button>
          ))}
        </div>
      )}

      {active !== null && filtered[active] && (
        <Lightbox
          item={filtered[active].lightbox}
          onClose={() => setActive(null)}
          hasPrev={active > 0}
          hasNext={active < filtered.length - 1}
          onPrev={() => setActive((i) => (i ?? 0) - 1)}
          onNext={() => setActive((i) => (i ?? 0) + 1)}
        />
      )}
    </>
  );
}
