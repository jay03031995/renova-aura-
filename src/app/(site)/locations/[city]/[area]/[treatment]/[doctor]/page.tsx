import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin, Check } from "@/components/icons";
import BookButton from "@/components/BookButton";
import { NCR_AREAS } from "@/data/locations";
import {
  getDoctors,
  getDoctorBySlug,
  getClinic,
  getLocationByCityArea,
  getProcedureBySlug,
  getProcedures,
} from "@/sanity/lib/fetchers";

type Params = Promise<{
  city: string;
  area: string;
  treatment: string;
  doctor: string;
}>;

/** Build all static params: area × treatment × doctor. */
export async function generateStaticParams() {
  const [doctors, procedures] = await Promise.all([
    getDoctors(),
    getProcedures(),
  ]);
  const params = [];
  for (const a of NCR_AREAS) {
    for (const p of procedures) {
      for (const d of doctors) {
        params.push({
          city: a.citySlug,
          area: a.areaSlug,
          treatment: p.slug,
          doctor: d.slug,
        });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { city, area, treatment, doctor } = await params;
  const [procedure, location, doctorData] = await Promise.all([
    getProcedureBySlug(treatment),
    getLocationByCityArea(city, area),
    getDoctorBySlug(doctor),
  ]);

  if (!procedure || !location || !doctorData) return {};

  const title = `${doctorData.name} — ${procedure.name} near ${location.area}, ${location.city} | RenovaAura`;
  const description = `Book ${procedure.name} with ${doctorData.name} at RenovaAura. Serving patients from ${location.area}, ${location.city}. Board-certified specialist. Free written consultation plan.`;

  return {
    title,
    description,
    alternates: { canonical: `/locations/${city}/${area}/${treatment}/${doctor}` },
    openGraph: { title, description },
  };
}

export default async function LocationDoctorPage({ params }: { params: Params }) {
  const { city, area, treatment, doctor } = await params;

  const [procedure, location, doctorData, clinic] = await Promise.all([
    getProcedureBySlug(treatment),
    getLocationByCityArea(city, area),
    getDoctorBySlug(doctor),
    getClinic(),
  ]);

  if (!procedure || !location || !doctorData) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctorData.name,
    jobTitle: doctorData.title,
    description: doctorData.listBio,
    image: doctorData.imageUrl,
    url: `https://renovaaura.com/locations/${city}/${area}/${treatment}/${doctor}`,
    telephone: clinic.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: clinic.addressParts.streetAddress,
      addressLocality: clinic.addressParts.locality,
      addressRegion: clinic.addressParts.region,
      postalCode: clinic.addressParts.postalCode,
      addressCountry: clinic.addressParts.country,
    },
    worksFor: {
      "@type": "MedicalBusiness",
      name: clinic.name,
      url: clinic.shopUrl,
    },
    medicalSpecialty: doctorData.specialty,
    hasMap: clinic.googleMapsLinkUrl,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://renovaaura.com" },
        { "@type": "ListItem", position: 2, name: "Locations", item: "https://renovaaura.com/locations" },
        { "@type": "ListItem", position: 3, name: location.city, item: `https://renovaaura.com/locations/${city}` },
        { "@type": "ListItem", position: 4, name: location.area, item: `https://renovaaura.com/locations/${city}/${area}` },
        { "@type": "ListItem", position: 5, name: procedure.name, item: `https://renovaaura.com/locations/${city}/${area}/${treatment}` },
        { "@type": "ListItem", position: 6, name: doctorData.name },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="pillar-hero">
        <div className="container">
          <nav className="loc-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Locations</span>
            <span>/</span>
            <Link href={`/locations/${city}/${area}/${treatment}`}>
              {procedure.name} near {location.area}
            </Link>
            <span>/</span>
            <span>{doctorData.name}</span>
          </nav>

          <div className="pillar-hero-grid" style={{ marginTop: 28 }}>
            <div className="pillar-hero-text">
              <div className="eyebrow" style={{ marginBottom: 14 }}>
                <MapPin size={13} /> {location.area} · {location.city}
              </div>
              <h1 className="pillar-hero-headline">
                {doctorData.name} — {procedure.name} near {location.area}.
              </h1>
              <p className="pillar-hero-subtitle" style={{ marginTop: 20 }}>
                {doctorData.listBio}
              </p>
              <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <BookButton
                  prefill={{
                    concern: `${procedure.name} — ${doctorData.name}`,
                    source: `location-dr-${area}-${treatment}-${doctor}`,
                  }}
                >
                  Book with {doctorData.name.split(" ")[1]}
                </BookButton>
                <Link
                  className="btn btn-ghost"
                  href={`/doctors/${doctorData.slug}`}
                >
                  Full profile <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            {doctorData.imageUrl && (
              <div
                className="pillar-hero-image"
                style={{ backgroundImage: `url(${doctorData.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
                role="img"
                aria-label={`Dr. ${doctorData.name}`}
              />
            )}
          </div>
        </div>
      </section>

      {/* Doctor credentials */}
      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="doc-creds">
            {doctorData.statCreds.map((c, i) => (
              <div key={i} className="doc-cred">
                <div className="doc-cred-num">
                  {c.n}
                  {c.sup && <sup>{c.sup}</sup>}
                </div>
                <div className="doc-cred-label">{c.l}</div>
              </div>
            ))}
          </div>
          <h2 style={{ marginTop: 40, marginBottom: 20 }}>
            {procedure.name} with {doctorData.name}
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "var(--muted)" }}>
            {procedure.overview}
          </p>
          {procedure.benefits && procedure.benefits.length > 0 && (
            <ul style={{ listStyle: "none", padding: 0, marginTop: 24, display: "grid", gap: 12 }}>
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

      {/* Getting here */}
      <section className="section" style={{ background: "var(--cream-2)" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Getting here from {location.area}</div>
          <h2 style={{ marginBottom: 20 }}>Clinic address.</h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--muted)", marginBottom: 22 }}>
            {clinic.address} · {clinic.hours}
          </p>
          <a href={clinic.googleMapsLinkUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <MapPin size={15} /> Directions from {location.area}
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: "var(--cocoa)", color: "var(--cream)" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ color: "var(--cream)", marginBottom: 18 }}>
            Book a consultation with {doctorData.name}.
          </h2>
          <p style={{ color: "rgba(255,255,255,.85)", marginBottom: 28 }}>
            Serving patients from {location.area}, {location.city} and across NCR.
          </p>
          <BookButton
            prefill={{
              concern: `${procedure.name} — ${doctorData.name}`,
              source: `location-dr-cta-${area}`,
            }}
          >
            Book free consultation
          </BookButton>
        </div>
      </section>
    </>
  );
}
