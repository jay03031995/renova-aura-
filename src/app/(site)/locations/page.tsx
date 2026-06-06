import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { NCR_AREAS, CITY_SLUGS } from "@/data/locations";
import { PROCEDURES } from "@/data/procedures";

export const metadata: Metadata = {
  title: "RenovaAura — Hair Transplant & Skin Clinics Near You in NCR",
  description:
    "Find RenovaAura hair transplant, plastic surgery and dermatology services near your location across Delhi NCR — Noida, Gurugram, Ghaziabad, Faridabad and all Delhi neighbourhoods.",
  alternates: { canonical: "/locations" },
};

const CITY_LABELS: Record<string, string> = {
  "new-delhi": "New Delhi",
  noida: "Noida",
  gurugram: "Gurugram",
  ghaziabad: "Ghaziabad",
  faridabad: "Faridabad",
};

const TOP_TREATMENTS = PROCEDURES.filter((p) =>
  ["fue-hair-transplant", "dhi-hair-transplant", "renova-follicle-boost",
   "rhinoplasty", "botox", "acne-scar-treatment"].includes(p.slug),
).slice(0, 6);

export default function LocationsPage() {
  const cities = CITY_SLUGS.map((slug) => ({
    slug,
    label: CITY_LABELS[slug] ?? slug,
    areas: NCR_AREAS.filter((a) => a.citySlug === slug),
  }));

  return (
    <>
      <section className="pillar-hero">
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 16 }}>
            Serving NCR
          </div>
          <h1 className="pillar-hero-headline">
            RenovaAura near you — across Delhi NCR.
          </h1>
          <p className="pillar-hero-subtitle">
            Hair transplant, plastic surgery and dermatology specialists.
            Anand Vihar clinic, serving patients from across Delhi, Noida,
            Gurugram, Ghaziabad and Faridabad.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {cities.map((city) => (
            <div key={city.slug} className="location-city-group">
              <h2 className="location-city-heading">{city.label}</h2>
              <div className="location-area-grid">
                {city.areas.map((area) => (
                  <div key={area.areaSlug} className="location-area-card">
                    <div className="location-area-name">{area.area}</div>
                    <ul className="location-area-links">
                      {TOP_TREATMENTS.map((t) => (
                        <li key={t.slug}>
                          <Link
                            href={`/locations/${area.citySlug}/${area.areaSlug}/${t.slug}`}
                          >
                            {t.name} <ArrowRight size={12} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
