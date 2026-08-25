import type { Metadata } from "next";
import Link from "next/link";
import BookButton from "@/components/BookButton";
import { MapPin } from "@/components/icons";
import { getAllLocations, getClinic } from "@/sanity/lib/fetchers";
import { SITE_URL } from "@/lib/siteUrl";

export const metadata: Metadata = {
  title: "Skin, Hair & Cosmetic Clinic Near You — RenovaAura Locations",
  description:
    "RenovaAura is a dermatologist-led clinic in Anand Vihar, New Delhi, welcoming patients from across Delhi NCR — New Delhi, Noida, Gurugram, Ghaziabad and Faridabad. Find the page for your area.",
  alternates: { canonical: "/locations" },
};

/**
 * Locations index — the hub page that was missing entirely. Every
 * /locations/{city}/{area} page (41 of them) previously had no parent page
 * linking to it from primary navigation or an index, and the homepage
 * schema's "Locations" sitelink pointed at this exact URL while it 404'd.
 * This page fixes both: it's a real destination, and it's the one place
 * that links out to every area page, so they're no longer orphaned.
 */
export default async function LocationsIndexPage() {
  const [locations, clinic] = await Promise.all([getAllLocations(), getClinic()]);

  const byCity = new Map<string, { city: string; areas: typeof locations }>();
  for (const loc of locations) {
    const entry = byCity.get(loc.citySlug) ?? { city: loc.city, areas: [] };
    entry.areas.push(loc);
    byCity.set(loc.citySlug, entry);
  }
  // Delhi first (where the clinic physically is), then alphabetical.
  const cityOrder = Array.from(byCity.entries()).sort(([aSlug, a], [bSlug, b]) => {
    if (aSlug === "new-delhi") return -1;
    if (bSlug === "new-delhi") return 1;
    return a.city.localeCompare(b.city);
  });

  const pageUrl = `${SITE_URL}/locations`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${pageUrl}#areas`,
      name: "RenovaAura service areas across Delhi NCR",
      url: pageUrl,
      numberOfItems: locations.length,
      itemListElement: locations.map((loc, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${loc.area}, ${loc.city}`,
        url: `${SITE_URL}/locations/${loc.citySlug}/${loc.areaSlug}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Locations", item: pageUrl },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="pillar-hero">
        <div className="container">
          <nav className="loc-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>›</span>
            <span>Locations</span>
          </nav>
          <div className="pillar-hero-eyebrow">Locations</div>
          <h1 className="pillar-hero-headline">
            Find RenovaAura near you.
          </h1>
          <p className="pillar-hero-subtitle">
            RenovaAura has one confirmed clinic at {clinic.address}. We
            welcome patients travelling from across Delhi NCR — pick your
            area below for directions, nearby-area context and a tailored
            consultation.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {cityOrder.map(([citySlug, { city, areas }]) => (
            <div key={citySlug} className="location-city-group">
              <h2 className="location-city-heading">{city}</h2>
              <div className="location-area-grid">
                {areas
                  .slice()
                  .sort((a, b) => a.area.localeCompare(b.area))
                  .map((loc) => (
                    <div key={`${loc.citySlug}-${loc.areaSlug}`} className="location-area-card">
                      <div className="location-area-name">{loc.area}</div>
                      <ul className="location-area-links">
                        <li>
                          <Link href={`/locations/${loc.citySlug}/${loc.areaSlug}`}>
                            <MapPin size={13} /> Clinic info near {loc.area}
                          </Link>
                        </li>
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="area-closing">
        <div className="container">
          <div>
            <h2>Don&apos;t see your area?</h2>
            <p>
              RenovaAura welcomes patients from anywhere in Delhi NCR — reach
              out and we&apos;ll confirm the best way to plan your visit.
            </p>
          </div>
          <BookButton prefill={{ source: "locations-index-footer" }} withArrow={false}>
            Book Appointment
          </BookButton>
        </div>
      </section>
    </>
  );
}
