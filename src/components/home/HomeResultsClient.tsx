"use client";

import { useState } from "react";
import Link from "next/link";
import { RESULT_CATS } from "@/data/site";
import { ArrowRight } from "@/components/icons";
import type { ResultFetched } from "@/sanity/lib/fetchers";

export default function HomeResultsClient({ results }: { results: ResultFetched[] }) {
  const [cat, setCat] = useState("All");
  const [idx, setIdx] = useState(0);
  // Reset idx whenever the filter changes — React's "adjust state during render" pattern.
  const [prevCat, setPrevCat] = useState(cat);
  if (cat !== prevCat) {
    setPrevCat(cat);
    setIdx(0);
  }

  const filtered =
    cat === "All" ? results : results.filter((r) => r.cat === cat);

  const r = filtered[idx] ?? filtered[0] ?? results[0];
  if (!r) return null;

  return (
    <section className="section results" id="results">
      <div className="container">
        <div className="section-head reveal" style={{ marginBottom: 30 }}>
          <div className="section-head-copy">
            <div className="eyebrow">Real patients · real results</div>
            <h2>Outcomes you can hold us to.</h2>
          </div>
          <p>
            Every patient story is referenced, dated and accompanied by clinical
            detail. Filter below to see results for a specific concern.
          </p>
        </div>

        <div className="results-filter reveal">
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

        <div className="results-grid">
          <div className="reveal">
            <div className="ba-slider">
              <img
                className="ba-photo"
                src={r.imageUrl || r.img}
                alt={`${r.name} before and after at RenovaAura`}
              />
              <span className="ba-label before">Before</span>
              <span className="ba-label after">After</span>
            </div>
          </div>
          <div className="results-copy reveal">
            <div className="eyebrow" style={{ marginBottom: 16 }}>
              {r.cat}
            </div>
            <h2 style={{ fontSize: 32, marginBottom: 18 }}>{r.name}</h2>
            <div className="results-meta">
              <div className="results-meta-row">
                <span>Patient</span>
                <span>{r.patient}</span>
              </div>
              <div className="results-meta-row">
                <span>Concern</span>
                <span>{r.concern}</span>
              </div>
              <div className="results-meta-row">
                <span>Protocol</span>
                <span>{r.sessions}</span>
              </div>
              <div className="results-meta-row">
                <span>Photographed</span>
                <span>{r.weeks} after start</span>
              </div>
            </div>
            <Link className="btn-text" href="/results">
              See the full result gallery <ArrowRight />
            </Link>
            <div className="results-nav">
              {filtered.map((R, i) => (
                <button
                  key={R.id}
                  type="button"
                  className={"results-thumb-img " + (i === idx ? "active" : "")}
                  onClick={() => setIdx(i)}
                  aria-label={R.name}
                >
                  <img src={R.imageUrl || R.img} alt="" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
