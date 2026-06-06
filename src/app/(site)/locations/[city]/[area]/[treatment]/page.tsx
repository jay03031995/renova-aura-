import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, MapPin } from "@/components/icons";
import BookButton from "@/components/BookButton";
import FaqItem from "@/components/FaqItem";
import { PROCEDURE_BY_SLUG, PROCEDURES } from "@/data/procedures";
import { NCR_AREAS } from "@/data/locations";
import {
  getDoctors,
  getLocationByCityArea,
  type SanityLocation,
} from "@/sanity/lib/fetchers";
import { CLINIC } from "@/data/clinic";

type Params = Promise<{ city: string; area: string; treatment: string }>;

/** Build all static params: every area × every procedure. */
export async function generateStaticParams() {
  const params = [];
  for (const a of NCR_AREAS) {
    for (const p of PROCEDURES) {
      params.push({
        city: a.citySlug,
        area: a.areaSlug,
        treatment: p.slug,
      });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { city, area, treatment } = await params;
  const procedure = PROCEDURE_BY_SLUG[treatment];
  const locationData = await getLocationByCityArea(city, area);

  if (!procedure || !locationData) return {};

  const title =
    locationData.metaTitle ??
    `${procedure.name} near ${locationData.area}, ${locationData.city} — RenovaAura`;
  const description =
    locationData.metaDescription ??
    `Looking for ${procedure.name} near ${locationData.area}? RenovaAura in Anand Vihar, New Delhi offers board-certified ${procedure.name} with natural-looking results. Book a free consultation.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/locations/${city}/${area}/${treatment}`,
    },
    openGraph: {
      title,
      description,
      url: `https://renovaaura.com/locations/${city}/${area}/${treatment}`,
    },
  };
}

export default async function LocationTreatmentPage({ params }: { params: Params }) {
  const { city, area, treatment } = await params;
  const procedure = PROCEDURE_BY_SLUG[treatment];
  const location = await getLocationByCityArea(city, area);

  if (!procedure || !location) return notFound();

  const doctors = await getDoctors();
  const mapsUrl = `https://www.google.com/maps?q=${CLINIC.mapsQuery}`;

  // Auto-generate headline and intro if not set in Sanity
  const headline =
    location.headline ??
    `${procedure.name} near ${location.area} — RenovaAura Clinic`;

  const intro =
    location.intro ??
    `Patients from ${location.area}, ${location.city} travel to RenovaAura at Anand Vihar, New Delhi for ${procedure.name.toLowerCase()}. Our board-certified specialists deliver evidence-based, natural-looking results with full follow-up care. Consultations are honest, unhurried, and written — no high-pressure upselling.`;

  // Schema.org JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "LocalBusiness"],
    name: `RenovaAura — ${procedure.name} near ${location.area}`,
    description: intro,
    url: `https://renovaaura.com/locations/${city}/${area}/${treatment}`,
    image: procedure.image ?? undefined,
    telephone: CLINIC.phone,
    email: CLINIC.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: CLINIC.addressParts.streetAddress,
      addressLocality: CLINIC.addressParts.locality,
      addressRegion: CLINIC.addressParts.region,
      postalCode: CLINIC.addressParts.postalCode,
      addressCountry: CLINIC.addressParts.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: "28.6488", longitude: "77.3025" },
    medicalSpecialty: procedure.pillar === "hair-transplant" ? "HairRestoration" : "PlasticSurgery",
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: { "@type": "GeoCoordinates", latitude: "28.6488", longitude: "77.3025" },
      geoRadius: "30000",
    },
    hasMap: mapsUrl,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
        opens: "10:00",
        closes: "19:30",
      },
    ],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://renovaaura.com" },
        { "@type": "ListItem", position: 2, name: "Locations", item: "https://renovaaura.com/locations" },
        { "@type": "ListItem", position: 3, name: location.city, item: `https://renovaaura.com/locations/${city}` },
        { "@type": "ListItem", position: 4, name: location.area, item: `https://renovaaura.com/locations/${city}/${area}` },
        { "@type": "ListItem", position: 5, name: procedure.name },
      ],
    },
  };

  // Local FAQs merged with procedure FAQs
  const faqs = [
    ...(location.faqs ?? []).map((f) => ({ q: f.question, a: f.answer })),
    ...(procedure.faqs ?? []).slice(0, 3),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="pillar-hero">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="loc-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/locations">Locations</Link>
            <span>/</span>
            <Link href={`/locations/${city}`}>{location.city}</Link>
            <span>/</span>
            <Link href={`/locations/${city}/${area}`}>{location.area}</Link>
            <span>/</span>
            <span>{procedure.name}</span>
          </nav>

          <div className="pillar-hero-grid">
            <div className="pillar-hero-text">
              <div className="eyebrow" style={{ marginBottom: 14 }}>
                <MapPin size={13} /> {location.area} · {location.city}
              </div>
              <h1 className="pillar-hero-headline">{headline}</h1>
              <p className="pillar-hero-subtitle" style={{ marginTop: 20 }}>
                {intro}
              </p>
              <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <BookButton
                  prefill={{
                    concern: procedure.name,
                    source: `location-${area}-${treatment}`,
                  }}
                >
                  Book free consultation
                </BookButton>
                <Link
                  className="btn btn-ghost"
                  href={`/procedures/${procedure.pillar}/${procedure.slug}`}
                >
                  About {procedure.name} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            {procedure.image && (
              <div
                className="pillar-hero-image"
                style={{ backgroundImage: `url(${procedure.image})` }}
                role="img"
                aria-label={`${procedure.name} at RenovaAura`}
              />
            )}
          </div>
        </div>
      </section>

      {/* About this treatment */}
      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>
            About the treatment
          </div>
          <h2 style={{ marginBottom: 24 }}>{procedure.name}</h2>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "var(--muted)", marginBottom: 32 }}>
            {procedure.overview}
          </p>
          {procedure.benefits && procedure.benefits.length > 0 && (
            <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
              {procedure.benefits.map((b, i) => (
                <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 15 }}>
                  <span style={{ color: "var(--sage)", marginTop: 3, flexShrink: 0 }}><Check size={16} /></span>
                  <span>{typeof b === "string" ? b : (b as { t?: string }).t ?? ""}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Doctors */}
      {doctors.length > 0 && (
        <section className="section" style={{ background: "var(--cream-2)" }}>
          <div className="container">
            <div className="eyebrow" style={{ marginBottom: 18 }}>Our specialists</div>
            <h2 style={{ marginBottom: 36 }}>Board-certified team for {procedure.name.toLowerCase()}.</h2>
            <div className="doc-list">
              {doctors.map((d, i) => (
                <div key={d.slug} className={"doc-row" + (i % 2 === 1 ? " reverse" : "")}>
                  <div className="doc-photo-wrap">
                    <div
                      className={"doc-photo " + d.img}
                      style={d.imageUrl ? { backgroundImage: `url(${d.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
                    />
                  </div>
                  <div className="doc-body">
                    <h2>{d.name}</h2>
                    <div className="doc-title">{d.title}</div>
                    <p className="doc-body-bio">{d.listBio}</p>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
                      <Link
                        className="btn btn-primary"
                        href={`/locations/${city}/${area}/${treatment}/${d.slug}`}
                      >
                        Dr. {d.name.split(" ").slice(-1)[0]} for {procedure.name} near {location.area} <ArrowRight size={14} />
                      </Link>
                      <BookButton
                        className="btn btn-ghost"
                        withArrow={false}
                        prefill={{ concern: `${procedure.name} — Dr. ${d.name}`, source: `location-${area}-${treatment}` }}
                      >
                        Book with {d.name.split(" ")[1]}
                      </BookButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How to reach */}
      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Getting here</div>
          <h2 style={{ marginBottom: 22 }}>
            From {location.area} to RenovaAura, Anand Vihar.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--muted)", marginBottom: 24 }}>
            RenovaAura is located at {CLINIC.address}. From {location.area} you can
            reach us by Metro (Blue / Pink line to Anand Vihar), auto-rickshaw or cab — typically under 30 minutes from most NCR locations.
          </p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <MapPin size={15} /> Open in Google Maps
          </a>
        </div>
      </section>

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="section" style={{ background: "var(--cream-2)" }}>
          <div className="container" style={{ maxWidth: 820 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Patient questions</div>
            <h2 style={{ marginBottom: 32 }}>
              {procedure.name} near {location.area} — FAQs.
            </h2>
            {faqs.map((f, i) => (
              <FaqItem key={i} q={f.q} a={f.a} />
            ))}
          </div>
        </section>
      )}

      {/* Internal links: nearby areas */}
      <section className="section">
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 16 }}>Nearby areas</div>
          <h2 style={{ marginBottom: 28 }}>Also serving patients from…</h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {NCR_AREAS
              .filter((a) => a.areaSlug !== area)
              .slice(0, 12)
              .map((a) => (
                <Link
                  key={a.areaSlug}
                  href={`/locations/${a.citySlug}/${a.areaSlug}/${treatment}`}
                  className="filter-chip"
                >
                  {a.area}
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: "var(--cocoa)", color: "var(--cream)" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ color: "var(--cream)", marginBottom: 18 }}>
            Ready to start your journey?
          </h2>
          <p style={{ color: "rgba(255,255,255,.85)", marginBottom: 28, fontSize: 16 }}>
            Book a free, no-pressure consultation at RenovaAura.
            Serving patients from {location.area} and across Delhi NCR.
          </p>
          <BookButton
            prefill={{
              concern: procedure.name,
              source: `location-cta-${area}-${treatment}`,
            }}
          >
            Book free consultation
          </BookButton>
        </div>
      </section>
    </>
  );
}
