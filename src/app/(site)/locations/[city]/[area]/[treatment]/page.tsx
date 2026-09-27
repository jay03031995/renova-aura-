import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, MapPin, Phone, Clock } from "@/components/icons";
import BookButton from "@/components/BookButton";
import FaqItem from "@/components/FaqItem";
import { NCR_AREAS } from "@/data/locations";
import {
  getDoctors,
  getClinic,
  getLocationByCityArea,
  getProcedureBySlug,
  getProcedures,
} from "@/sanity/lib/fetchers";
import { telHref, waHref } from "@/data/clinic";
import { WhatsappLogo } from "@/components/icons";
import { SITE_URL } from "@/lib/siteUrl";
import { indexableRobots, locationSeoKeywords } from "@/lib/locationSeo";
import { doctorPortrait, doctorPortraitPosition } from "@/lib/doctorPortrait";
import {
  formatBreadcrumb,
  shouldPublishLocationTreatment,
  strategicLocationTreatmentParams,
  treatmentLocationMeta,
  treatmentSpecialist,
} from "@/lib/ncrLocationStrategy";

type Params = Promise<{ city: string; area: string; treatment: string }>;

export async function generateStaticParams() {
  const procedures = await getProcedures();
  return strategicLocationTreatmentParams(procedures);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { city, area, treatment } = await params;
  const [procedure, location] = await Promise.all([
    getProcedureBySlug(treatment),
    getLocationByCityArea(city, area),
  ]);
  if (!procedure || !location) return {};

  const meta = treatmentLocationMeta(procedure, location.area);
  const title = meta.title;
  const description = meta.description;

  return {
    title,
    description,
    keywords: locationSeoKeywords({ area: location.area, city: location.city, treatment: procedure.name, customKeywords: location.metaKeywords }),
    robots: indexableRobots,
    alternates: { canonical: `/locations/${city}/${area}/${treatment}` },
    openGraph: { title, description, url: `${SITE_URL}/locations/${city}/${area}/${treatment}` },
  };
}

export default async function LocationTreatmentPage({ params }: { params: Params }) {
  const { city, area, treatment } = await params;
  const [procedure, location] = await Promise.all([
    getProcedureBySlug(treatment),
    getLocationByCityArea(city, area),
  ]);

  if (!procedure || !location) return notFound();
  if (!shouldPublishLocationTreatment(area, treatment)) return notFound();

  const [doctors, clinic] = await Promise.all([getDoctors(), getClinic()]);
  const specialist = treatmentSpecialist(procedure, doctors);
  const meta = treatmentLocationMeta(procedure, location.area);
  const selectedDoctors = specialist
    ? [specialist]
    : doctors.filter((doctor) => procedure.pillar === "plastic-surgery" ? doctor.slug === "ankur-bhatia" : doctor.slug === "bhawna-bhardwaj");

  const headline = location.headline ?? meta.h1;

  const intro =
    location.intro ??
    (location.area === "Anand Vihar"
      ? `${procedure.name} consultations are available at RenovaAura's confirmed Anand Vihar clinic. The care plan is based on specialist assessment, medical history, goals and suitability.`
      : `Patients from ${location.area}, ${location.city} can visit RenovaAura's confirmed Anand Vihar clinic for ${procedure.name.toLowerCase()} consultation. This page explains access for patients from ${location.area}; it does not represent a separate branch.`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "LocalBusiness"],
    name: `RenovaAura — ${procedure.name} near ${location.area}`,
    description: intro,
    url: `${SITE_URL}/locations/${city}/${area}/${treatment}`,
    telephone: clinic.phone,
    email: clinic.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: clinic.addressParts.streetAddress,
      addressLocality: clinic.addressParts.locality,
      addressRegion: clinic.addressParts.region,
      postalCode: clinic.addressParts.postalCode,
      addressCountry: clinic.addressParts.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: "28.6488", longitude: "77.3025" },
    hasMap: clinic.googleMapsLinkUrl,
    openingHoursSpecification: [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
      opens: "10:00", closes: "19:30",
    }],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Locations", item: `${SITE_URL}/locations` },
        { "@type": "ListItem", position: 3, name: location.city, item: `${SITE_URL}/locations/${city}` },
        { "@type": "ListItem", position: 4, name: location.area, item: `${SITE_URL}/locations/${city}/${area}` },
        { "@type": "ListItem", position: 5, name: procedure.name, item: `${SITE_URL}/locations/${city}/${area}/${treatment}` },
      ],
    },
  };

  const faqs = [
    ...(location.faqs ?? []).map((f) => ({ q: f.question, a: f.answer })),
    ...(procedure.faqs ?? []).slice(0, 4),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ─── Hero banner (DHI-style: full-width, clinic image, breadcrumb on it) ─── */}
      <div className="loc-hero" style={procedure.image ? { backgroundImage: `url(${procedure.image})` } : undefined}>
        <div className="loc-hero-overlay" />
        <div className="container loc-hero-body">
          <nav className="loc-breadcrumb loc-breadcrumb-light" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">›</span>
            <Link href="/locations">Locations</Link><span aria-hidden="true">›</span>
            <Link href={`/locations/${city}`}>{location.city}</Link><span aria-hidden="true">›</span>
            <Link href={`/locations/${city}/${area}`}>{location.area}</Link><span aria-hidden="true">›</span>
            <span aria-current="page">{procedure.name}</span>
          </nav>
          <h1 className="loc-hero-title">{headline}</h1>
          <p className="loc-hero-sub">{intro}</p>
          <div className="loc-hero-ctas">
            <BookButton
              className="btn loc-btn-primary"
              prefill={{ concern: procedure.name, source: `location-${area}-${treatment}` }}
              withArrow={false}
            >
              Book Consultation
            </BookButton>
            <a className="btn loc-btn-ghost" href={telHref(clinic.phone)}>
              <Phone size={15} /> {clinic.phone}
            </a>
          </div>
        </div>
      </div>

      {/* ─── Trust strip ─── */}
      <div className="loc-trust-strip">
        <div className="container loc-trust-inner">
          <div className="loc-trust-item"><span className="loc-trust-num">Anand Vihar</span><span className="loc-trust-lbl">Confirmed clinic</span></div>
          <div className="loc-trust-item"><span className="loc-trust-num">{specialist?.years ?? 15}+</span><span className="loc-trust-lbl">Years of practice</span></div>
          <div className="loc-trust-item"><span className="loc-trust-num">{procedure.quick.duration}</span><span className="loc-trust-lbl">Typical duration</span></div>
          <div className="loc-trust-item"><span className="loc-trust-num">{procedure.quick.sessions}</span><span className="loc-trust-lbl">Sessions</span></div>
          <div className="loc-trust-item"><span className="loc-trust-num">Plan</span><span className="loc-trust-lbl">After assessment</span></div>
        </div>
      </div>

      {/* ─── About this treatment ─── */}
      <section className="section">
        <div className="container loc-two-col">
          <div className="loc-main">
            <div className="eyebrow" style={{ marginBottom: 12 }}>About the treatment</div>
            <h2 style={{ marginBottom: 18 }}>{procedure.name} {location.area === "Anand Vihar" ? "in" : "for patients from"} {location.area}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--muted)", marginBottom: 28 }}>
              {procedure.overview}
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--muted)", marginBottom: 24 }}>
              <strong>Clinic location:</strong> {clinic.address}. <strong>Breadcrumb:</strong> {formatBreadcrumb(location.city, location.area, procedure.name)}.
            </p>
            {procedure.benefits && procedure.benefits.length > 0 && (
              <ul className="loc-benefit-list">
                {procedure.benefits.map((b, i) => (
                  <li key={i}>
                    <span className="loc-check"><Check size={15} /></span>
                    <span>{typeof b === "string" ? b : (b as { t?: string }).t ?? ""}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <aside className="loc-sidebar">
            <div className="loc-sidebar-card">
              <div className="loc-sidebar-title">Book a Consultation</div>
              <p style={{ fontSize: 13.5, color: "var(--muted)", marginBottom: 18, lineHeight: 1.6 }}>
                Personalised assessment at the Anand Vihar clinic. Serving patients from {location.area}.
              </p>
              <BookButton
                className="btn btn-primary"
                prefill={{ concern: procedure.name, source: `location-sidebar-${area}` }}
                withArrow={false}
              >
                Book Consultation
              </BookButton>
              <div className="loc-sidebar-meta">
                <span><Clock size={13} /> {clinic.hours}</span>
                <a href={telHref(clinic.phone)}><Phone size={13} /> {clinic.phone}</a>
                <a href={waHref(undefined, clinic.phone)} target="_blank" rel="noopener noreferrer">
                  <WhatsappLogo size={14} /> WhatsApp
                </a>
                <a href={clinic.googleMapsLinkUrl} target="_blank" rel="noopener noreferrer">
                  <MapPin size={13} /> Get Directions
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ─── Doctors ─── */}
      {selectedDoctors.length > 0 && (
        <section className="section" style={{ background: "var(--cream-2)" }}>
          <div className="container">
            <div className="eyebrow" style={{ marginBottom: 14 }}>Our specialists</div>
            <h2 style={{ marginBottom: 32 }}>
              {procedure.name} specialist for this page
            </h2>
            <div className="loc-doctor-grid">
              {selectedDoctors.map((d) => (
                <div key={d.slug} className="loc-doctor-card">
                  <div
                    className={"loc-doctor-img " + d.img}
                    style={{
                      backgroundImage: `url(${doctorPortrait(d.slug, d.imageUrl)})`,
                      backgroundPosition: doctorPortraitPosition(d.slug),
                    }}
                    role="img"
                    aria-label={`${d.name}, ${d.specialty || d.title}`}
                  />
                  <div className="loc-doctor-body">
                    <div className="loc-doctor-name">{d.name}</div>
                    <div className="loc-doctor-title">{d.specialty || d.title}</div>
                    <p className="loc-doctor-bio">{d.homeBio}</p>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
                      <Link href={`/doctors/${d.slug}`} className="btn btn-ghost" style={{ fontSize: 13 }}>
                        View profile <ArrowRight size={13} />
                      </Link>
                      <BookButton
                        className="btn btn-primary"
                        withArrow={false}
                        prefill={{ concern: `${procedure.name} — ${d.name}`, source: `location-dr-${area}` }}
                      >
                        Book
                      </BookButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── How to reach ─── */}
      <section className="section">
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 12 }}>Getting here</div>
          <h2 style={{ marginBottom: 20 }}>RenovaAura Clinic — Anand Vihar, New Delhi</h2>
          <div className="loc-reach-grid">
            <div>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--muted)", marginBottom: 20 }}>
                RenovaAura is at <strong>{clinic.address}</strong>. Use the directions link below for the current route from {location.area}; travel time can vary by traffic and metro service.
              </p>
              <p style={{ fontSize: 15, color: "var(--muted)", marginBottom: 22, lineHeight: 1.7 }}>
                <strong>Hours:</strong> {clinic.hours}
              </p>
              <a href={clinic.googleMapsLinkUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <MapPin size={15} /> Directions from {location.area}
              </a>
            </div>
            <div className="loc-reach-map">
              <iframe
                src={clinic.googleMapsEmbedUrl}
                width="100%"
                height="280"
                style={{ border: 0, borderRadius: 16 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="RenovaAura Clinic Map"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Nearby areas (internal links) ─── */}
      <section style={{ background: "var(--cream-2)", padding: "40px 0" }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 14 }}>Serving NCR</div>
          <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 16 }}>
            Also serving patients for {procedure.name.toLowerCase()} from selected high-intent NCR areas:
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {NCR_AREAS.filter((a) => a.areaSlug !== area).slice(0, 14).map((a) => (
              <Link key={a.areaSlug} href={`/locations/${a.citySlug}/${a.areaSlug}/${treatment}`} className="filter-chip">
                {a.area}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQs ─── */}
      {faqs.length > 0 && (
        <section className="section">
          <div className="container" style={{ maxWidth: 840 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Patient questions</div>
            <h2 style={{ marginBottom: 28 }}>{procedure.name} near {location.area} — FAQs</h2>
            {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
          </div>
        </section>
      )}

      {/* ─── Closing CTA ─── */}
      <section className="section" style={{ background: "var(--cocoa)", color: "var(--cream)" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ color: "var(--cream)", marginBottom: 16 }}>
            Ready to regain your confidence?
          </h2>
          <p style={{ color: "rgba(255,255,255,.82)", marginBottom: 26, fontSize: 16 }}>
            Book a personalised consultation at RenovaAura&apos;s Anand Vihar clinic. Serving patients from {location.area} and across Delhi NCR.
          </p>
          <BookButton prefill={{ concern: procedure.name, source: `location-cta-${area}` }}>
            Book consultation
          </BookButton>
        </div>
      </section>
    </>
  );
}
