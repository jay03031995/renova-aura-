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

type Params = Promise<{ city: string; area: string; treatment: string }>;

export async function generateStaticParams() {
  const procedures = await getProcedures();
  return NCR_AREAS.flatMap((a) =>
    procedures.map((p) => ({
      city: a.citySlug,
      area: a.areaSlug,
      treatment: p.slug,
    })),
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { city, area, treatment } = await params;
  const [procedure, location] = await Promise.all([
    getProcedureBySlug(treatment),
    getLocationByCityArea(city, area),
  ]);
  if (!procedure || !location) return {};

  const title =
    location.metaTitle ??
    `${procedure.name} near ${location.area}, ${location.city} | RenovaAura`;
  const description =
    location.metaDescription ??
    `Looking for ${procedure.name} near ${location.area}? RenovaAura's board-certified specialists offer ${procedure.name.toLowerCase()} with natural-looking results. Book a free consultation in Anand Vihar, New Delhi.`;

  return {
    title,
    description,
    alternates: { canonical: `/locations/${city}/${area}/${treatment}` },
    openGraph: { title, description, url: `https://renovaaura.com/locations/${city}/${area}/${treatment}` },
  };
}

export default async function LocationTreatmentPage({ params }: { params: Params }) {
  const { city, area, treatment } = await params;
  const [procedure, location] = await Promise.all([
    getProcedureBySlug(treatment),
    getLocationByCityArea(city, area),
  ]);

  if (!procedure || !location) return notFound();

  const [doctors, clinic] = await Promise.all([getDoctors(), getClinic()]);

  const headline =
    location.headline ??
    `Best ${procedure.name} near ${location.area}, ${location.city}`;

  const intro =
    location.intro ??
    `Patients from ${location.area}, ${location.city} trust RenovaAura at Anand Vihar for ${procedure.name.toLowerCase()}. Our board-certified specialists provide evidence-based, natural-looking results with full aftercare — serving patients from across NCR including ${location.area}.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "LocalBusiness"],
    name: `RenovaAura — ${procedure.name} near ${location.area}`,
    description: intro,
    url: `https://renovaaura.com/locations/${city}/${area}/${treatment}`,
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
        { "@type": "ListItem", position: 1, name: "Home", item: "https://renovaaura.com" },
        { "@type": "ListItem", position: 2, name: "Locations", item: "https://renovaaura.com/locations" },
        { "@type": "ListItem", position: 3, name: location.city },
        { "@type": "ListItem", position: 4, name: location.area },
        { "@type": "ListItem", position: 5, name: procedure.name },
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
            <Link href="/">Home</Link><span>/</span>
            <span>Locations</span><span>/</span>
            <span>{location.city}</span><span>/</span>
            <span>{location.area}</span><span>/</span>
            <span>{procedure.name}</span>
          </nav>
          <h1 className="loc-hero-title">{headline}</h1>
          <p className="loc-hero-sub">{intro}</p>
          <div className="loc-hero-ctas">
            <BookButton
              className="btn loc-btn-primary"
              prefill={{ concern: procedure.name, source: `location-${area}-${treatment}` }}
              withArrow={false}
            >
              Book Free Consultation
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
          <div className="loc-trust-item"><span className="loc-trust-num">MD</span><span className="loc-trust-lbl">Board-Certified</span></div>
          <div className="loc-trust-item"><span className="loc-trust-num">4.9★</span><span className="loc-trust-lbl">Patient Rating</span></div>
          <div className="loc-trust-item"><span className="loc-trust-num">FUE·DHI·FUT</span><span className="loc-trust-lbl">All Techniques</span></div>
          <div className="loc-trust-item"><span className="loc-trust-num">Free</span><span className="loc-trust-lbl">Written Plan</span></div>
          <div className="loc-trust-item"><span className="loc-trust-num">6-mo</span><span className="loc-trust-lbl">Follow-up</span></div>
        </div>
      </div>

      {/* ─── About this treatment ─── */}
      <section className="section">
        <div className="container loc-two-col">
          <div className="loc-main">
            <div className="eyebrow" style={{ marginBottom: 12 }}>About the treatment</div>
            <h2 style={{ marginBottom: 18 }}>{procedure.name} in {location.area}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--muted)", marginBottom: 28 }}>
              {procedure.overview}
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
                Free, written plan. No pressure. Serving patients from {location.area}.
              </p>
              <BookButton
                className="btn btn-primary"
                prefill={{ concern: procedure.name, source: `location-sidebar-${area}` }}
                withArrow={false}
              >
                Book Free Consultation
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
      {doctors.length > 0 && (
        <section className="section" style={{ background: "var(--cream-2)" }}>
          <div className="container">
            <div className="eyebrow" style={{ marginBottom: 14 }}>Our specialists</div>
            <h2 style={{ marginBottom: 32 }}>
              {procedure.name} performed by board-certified specialists.
            </h2>
            <div className="loc-doctor-grid">
              {doctors.map((d) => (
                <div key={d.slug} className="loc-doctor-card">
                  <div
                    className={"loc-doctor-img " + d.img}
                    style={d.imageUrl ? { backgroundImage: `url(${d.imageUrl})` } : undefined}
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
                RenovaAura is at <strong>{clinic.address}</strong>. From {location.area} you can reach us via Metro (Blue / Pink line to Anand Vihar ISBT or Kaushambi), cab or auto — typically under 30–40 minutes from most NCR locations.
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
            Also serving patients for {procedure.name.toLowerCase()} from:
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
            Book a free, no-pressure consultation at RenovaAura. Serving patients from {location.area} and across Delhi NCR.
          </p>
          <BookButton prefill={{ concern: procedure.name, source: `location-cta-${area}` }}>
            Book free consultation
          </BookButton>
        </div>
      </section>
    </>
  );
}
