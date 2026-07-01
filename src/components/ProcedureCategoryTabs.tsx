"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import type { Procedure } from "@/data/procedures";

type ProcedureCategory = NonNullable<Procedure["plasticSurgeryCategory"]>;

export default function ProcedureCategoryTabs({
  procedures,
  pillar,
}: {
  procedures: Procedure[];
  pillar: string;
}) {
  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          procedures
            .map((p) => p.plasticSurgeryCategory)
            .filter(
              (category): category is ProcedureCategory => Boolean(category),
            ),
        ),
      ),
    [procedures],
  );
  const [activeCategory, setActiveCategory] = useState<ProcedureCategory | "">(
    categories[0] ?? "",
  );

  if (categories.length === 0) {
    return <ProcedureGrid procedures={procedures} pillar={pillar} />;
  }

  const visible = procedures.filter(
    (p) => p.plasticSurgeryCategory === activeCategory,
  );

  return (
    <div>
      <div className="procedure-tabs" role="tablist" aria-label="Procedure category">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={
              "procedure-tab" + (category === activeCategory ? " active" : "")
            }
            onClick={() => setActiveCategory(category)}
            role="tab"
            aria-selected={category === activeCategory}
          >
            {category}
          </button>
        ))}
      </div>
      <ProcedureGrid procedures={visible} pillar={pillar} />
    </div>
  );
}

export function ProcedureGrid({
  procedures,
  pillar,
}: {
  procedures: Procedure[];
  pillar: string;
}) {
  return (
    <div className="proc-grid proc-grid-static">
      {procedures.map((p) => (
        <Link
          key={p.slug}
          href={`/procedures/${pillar}/${p.slug}`}
          className="proc-card"
        >
          <div
            className="proc-card-img"
            style={{ backgroundImage: `url(${p.image})` }}
          >
            <div className="proc-card-img-overlay" />
          </div>
          <div className="proc-card-inner">
            {p.tag && <span className="proc-card-tag">{p.tag}</span>}
            <h3 className="proc-card-title">{p.name}</h3>
            <p className="proc-card-headline">{p.headline}</p>
            <div className="proc-card-meta">
              <span>{p.quick.duration}</span>
              <span>{p.quick.sessions}</span>
            </div>
            <span className="proc-card-link">
              Learn more <ArrowRight size={14} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
