import type { Metadata } from "next";
import Link from "next/link";
import { areasForCity, CITY_SLUGS, NCR_AREAS } from "@/data/locations";

const cityNames = new Map(NCR_AREAS.map((area) => [area.citySlug, area.city]));

export const metadata: Metadata = {
  title: "Locations Served in Delhi NCR | RenovaAura",
  description:
    "RenovaAura serves patients across Delhi NCR from its confirmed Anand Vihar clinic. Find locality pages for New Delhi, Noida, Ghaziabad, Gurugram and Faridabad.",
  alternates: { canonical: "/locations" },
};

export default function LocationsPage() {
  return (
    <section className="section location-index">
      <div className="container">
        <nav className="loc-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Locations</span>
        </nav>
        <div className="section-head">
          <div className="eyebrow">RENOVAAURA · ANAND VIHAR</div>
          <h1>Locations Served from Anand Vihar</h1>
          <p>
            RenovaAura has one confirmed clinic in Anand Vihar and welcomes
            patients travelling from these Delhi NCR areas.
          </p>
        </div>
        {CITY_SLUGS.map((citySlug) => (
          <section className="location-city-group" key={citySlug}>
            <h2 className="location-city-heading">
              <Link href={`/locations/${citySlug}`}>{cityNames.get(citySlug)}</Link>
            </h2>
            <div className="location-area-grid">
              {areasForCity(citySlug).map((area) => (
                <Link
                  className="filter-chip"
                  href={`/locations/${area.citySlug}/${area.areaSlug}`}
                  key={`${area.citySlug}-${area.areaSlug}`}
                >
                  {area.area}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
