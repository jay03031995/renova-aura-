"use client";

import { useState } from "react";
import { RESULT_CATS } from "@/data/site";
import type { ResultFetched } from "@/sanity/lib/fetchers";

export default function ResultsGallery({ results }: { results: ResultFetched[] }) {
  const [cat, setCat] = useState("All");
  const filtered =
    cat === "All" ? results : results.filter((r) => r.cat === cat);

  return (
    <>
      <div className="results-filter">
        {RESULT_CATS.map((c) => (
          <button
            key={c}
            type="button"
            className={"filter-chip" + (c === cat ? " active" : "")}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="tp-gallery">
        {filtered.map((r) => (
          <article className="tp-ba-card" key={r.id}>
            <div className="tp-ba-frame">
              <img
                src={r.imageUrl || r.img}
                alt={`${r.name} before and after at Dermaheal`}
              />
              <div className="tp-ba-pill-row">
                <span className="tp-ba-pill">Before</span>
                <span className="tp-ba-pill after">After</span>
              </div>
            </div>
            <div className="tp-ba-body">
              <div className="tp-ba-protocol">{r.cat}</div>
              <div className="tp-ba-title">{r.name}</div>
              <div className="tp-ba-detail">
                {r.patient} · {r.concern} · {r.sessions} · photographed{" "}
                {r.weeks} after start
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="tp-ba-disclaimer">
        Photos shared with patient consent. Individual results vary based on
        skin type, lifestyle and adherence to the prescribed protocol.
      </p>
    </>
  );
}
