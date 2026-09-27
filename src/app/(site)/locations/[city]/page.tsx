import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { areasForCity, CITY_SLUGS, NCR_AREAS } from "@/data/locations";

type Params = Promise<{ city: string }>;

const cityNames = new Map(NCR_AREAS.map((area) => [area.citySlug, area.city]));

export function generateStaticParams() {
  return CITY_SLUGS.map((city) => ({ city }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { city } = await params;
  const name = cityNames.get(city);
  if (!name) return {};
  return {
    title: `RenovaAura Locations in ${name} | Anand Vihar Clinic`,
    description: `RenovaAura serves patients from ${name} localities through its confirmed Anand Vihar clinic. View locality pages, treatments and booking options.`,
    alternates: { canonical: `/locations/${city}` },
  };
}

export default async function CityLocationsPage({ params }: { params: Params }) {
  const { city } = await params;
  const name = cityNames.get(city);
  if (!name) return notFound();
  const areas = areasForCity(city);

  return (
    <section className="section location-index">
      <div className="container">
        <nav className="loc-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/locations">Locations</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{name}</span>
        </nav>
        <div className="section-head">
          <div className="eyebrow">RENOVAAURA · ANAND VIHAR</div>
          <h1>RenovaAura Serving {name}</h1>
          <p>
            These pages are for patients travelling from {name}. RenovaAura&apos;s
            verified clinic remains C-3, 1st floor, Anand Vihar, New Delhi 110092.
          </p>
        </div>
        <div className="location-area-grid">
          {areas.map((area) => (
            <Link
              className="filter-chip"
              href={`/locations/${area.citySlug}/${area.areaSlug}`}
              key={`${area.citySlug}-${area.areaSlug}`}
            >
              {area.area}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
