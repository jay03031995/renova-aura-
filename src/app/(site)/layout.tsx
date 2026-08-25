import { BookingProvider } from "@/components/BookingContext";
import Announcement from "@/components/Announcement";
import TopContactBar from "@/components/TopContactBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FabStack from "@/components/FabStack";
import MobileTabBar from "@/components/MobileTabBar";
import BookingModal from "@/components/BookingModal";
import RevealInit from "@/components/RevealInit";
import {
  getBodyConcerns,
  getClinic,
  getConcerns,
  getProceduresByPillar,
} from "@/sanity/lib/fetchers";

/**
 * No-cache / always-fresh: every page under (site)/ is rendered dynamically
 * on each request, so any edit published in Sanity Studio is live immediately
 * with no caching and no manual "Refresh website" step. `force-dynamic` is
 * equivalent to setting every fetch to `{ cache: "no-store" }` (see Next 16
 * "Caching and Revalidating — Previous Model" docs).
 *
 * Tradeoff: pages are server-rendered per visit (no static generation), so
 * each request hits the Sanity API. The /api/revalidate webhook + manual
 * refresh button are kept as harmless no-ops / safety nets.
 */
//export const dynamic = "force-dynamic";
//cache changes
export const revalidate = 3600;


/**
 * Full schema.org @graph — drives Google sitelinks, rich results and brand
 * panel. Four linked nodes:
 *   1. Organization  — brand identity, logo, contacts, social profiles
 *   2. MedicalBusiness — LocalBusiness with medical details
 *   3. WebSite        — SearchAction (Google search-box) + SiteNavigationElement
 *                       (the 6 links that become sitelinks in SERP)
 *   4. ContactPoint   — linked to Organization for click-to-call
 *
 * Priority order for sitelinks:
 *   Treatments → Doctors → Book Appointment → Locations → Take Hair Test → Skin Analysis
 */
const BASE = "https://www.renovaaura.com";
const MAINTENANCE_MODE = false;
const GEO = { "@type": "GeoCoordinates", latitude: "28.6488", longitude: "77.3025" };
const HOURS = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    opens: "10:00", closes: "19:30",
  },
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: "Sunday",
    opens: "10:00", closes: "19:00",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    // ── 1. Organization — brand entity ──────────────────────────────────
    {
      "@type": "Organization",
      "@id": `${BASE}/#organization`,
      name: "RenovaAura",
      alternateName: ["Renova Aura", "RenovaAura Clinic"],
      url: BASE,
      logo: {
        "@type": "ImageObject",
        "@id": `${BASE}/#logo`,
        url: `${BASE}/renovaaura-logo.png`,
        contentUrl: `${BASE}/renovaaura-logo.png`,
        width: 360,
        height: 100,
        caption: "RenovaAura — Hair Transplant & Plastic Surgery Specialists",
      },
      image: { "@id": `${BASE}/#logo` },
      description: "Hair transplant, plastic surgery and dermatology clinic in Anand Vihar, New Delhi. Board-certified consultants delivering FUE, DHI, rhinoplasty, facelift and skin care.",
      telephone: "",
      email: "",
      address: {},
      geo: GEO,
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "",
          contactType: "customer service",
          contactOption: "TollFree",
          areaServed: "IN",
          availableLanguage: ["English", "Hindi"],
        },
        {
          "@type": "ContactPoint",
          telephone: "",
          contactType: "appointment booking",
          areaServed: "IN",
        },
      ],
      sameAs: [
        BASE,
        // Google Maps listing — placeholder query URL replaced below with the
        // real clinic Maps link at runtime. NOTE: this is a maps.google.com
        // search-query URL, not the clinic's actual Google Business Profile
        // share link (the ?cid=... or maps.app.goo.gl/... URL from the GBP
        // dashboard's "Share" button). The GBP link is the stronger signal
        // for local/near-me ranking — swap it in here once available.
      ],
      foundingDate: "2020",
      numberOfEmployees: { "@type": "QuantitativeValue", value: 10 },
      areaServed: [
        { "@type": "City", name: "New Delhi" },
        { "@type": "City", name: "Noida" },
        { "@type": "City", name: "Gurugram" },
        { "@type": "City", name: "Ghaziabad" },
        { "@type": "City", name: "Faridabad" },
      ],
    },

    // ── 2. MedicalBusiness — LocalBusiness with medical details ─────────
    {
      "@type": ["MedicalBusiness", "LocalBusiness"],
      "@id": `${BASE}/#medicalbusiness`,
      name: "RenovaAura",
      url: BASE,
      image: `${BASE}/renovaaura-logo.png`,
      priceRange: "₹₹",
      telephone: "",
      email: "",
      address: {},
      geo: GEO,
      openingHoursSpecification: HOURS,
      medicalSpecialty: [
        "Dermatology",
        "Plastic Surgery",
        "Hair Restoration",
      ],
      hasMap: "",
      sameAs: [],
      parentOrganization: { "@id": `${BASE}/#organization` },
    },

    // ── 3. WebSite — SearchAction + SiteNavigationElement (sitelinks) ───
    {
      "@type": "WebSite",
      "@id": `${BASE}/#website`,
      url: BASE,
      name: "RenovaAura",
      description: "Hair Transplant & Plastic Surgery Specialists — Anand Vihar, New Delhi",
      publisher: { "@id": `${BASE}/#organization` },
      inLanguage: "en-IN",
      // Sitelinks Searchbox — tells Google to show the search box under the result
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE}/procedures?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      // SiteNavigationElement — sitelink candidates in priority order.
      // Reordered against the RenovaAura keyword research (Aug 2026):
      // "dermatologist"/"skin clinic"/"skin specialist"/"skin doctor" searches
      // outnumber every other cluster combined, so Skin Concerns and
      // Locations (the near-me hub) now lead. Previously "Locations" pointed
      // at /locations, which had no page behind it (404) — that page now
      // exists (see src/app/(site)/locations/page.tsx).
      mainEntity: [
        {
          "@type": "SiteNavigationElement",
          name: "Skin Concerns",
          description: "Dermatologist-led treatment for acne, pigmentation, anti-ageing and other skin concerns",
          url: `${BASE}/concerns`,
        },
        {
          "@type": "SiteNavigationElement",
          name: "Locations Near You",
          description: "RenovaAura serves patients from across Delhi NCR — find your nearest area",
          url: `${BASE}/locations`,
        },
        {
          "@type": "SiteNavigationElement",
          name: "Hair Transplant",
          description: "FUE, DHI and FUT hair transplant procedures at RenovaAura",
          url: `${BASE}/procedures/hair-transplant`,
        },
        {
          "@type": "SiteNavigationElement",
          name: "Our Doctors",
          description: "Board-certified dermatology, hair transplant and plastic surgery specialists",
          url: `${BASE}/doctors`,
        },
        {
          "@type": "SiteNavigationElement",
          name: "Book an Appointment",
          description: "Schedule a free consultation at RenovaAura, Anand Vihar, New Delhi",
          url: `${BASE}/#book`,
        },
        {
          "@type": "SiteNavigationElement",
          name: "Plastic Surgery",
          description: "Rhinoplasty, facelift, blepharoplasty and other plastic surgery procedures",
          url: `${BASE}/procedures/plastic-surgery`,
        },
        {
          "@type": "SiteNavigationElement",
          name: "Packages",
          description: "Bundled treatment packages at RenovaAura",
          url: `${BASE}/packages`,
        },
        {
          "@type": "SiteNavigationElement",
          name: "Contact",
          description: "Clinic address, phone, WhatsApp and directions for RenovaAura, Anand Vihar",
          url: `${BASE}/contact`,
        },
      ],
    },

    // ── 4. ItemList — top treatments (helps Google link rich results) ───
    // Rebalanced Aug 2026: keyword research shows "dermatologist"/"skin
    // clinic"/"skin specialist"/"skin doctor" searches (~500+ combined)
    // outweigh hair-transplant terms (~137) by a wide margin, so skin/concern
    // entries now get equal billing with hair, plus a Locations entry for
    // near-me intent.
    {
      "@type": "ItemList",
      "@id": `${BASE}/#treatments`,
      name: "RenovaAura Treatments & Locations",
      url: `${BASE}/procedures`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Acne Treatment",         url: `${BASE}/concerns/acne` },
        { "@type": "ListItem", position: 2, name: "Pigmentation Treatment", url: `${BASE}/concerns/pigmentation-melasma` },
        { "@type": "ListItem", position: 3, name: "FUE Hair Transplant",    url: `${BASE}/procedures/hair-transplant/fue-hair-transplant` },
        { "@type": "ListItem", position: 4, name: "DHI Hair Transplant",   url: `${BASE}/procedures/hair-transplant/dhi-hair-transplant` },
        { "@type": "ListItem", position: 5, name: "Rhinoplasty",           url: `${BASE}/procedures/plastic-surgery/rhinoplasty` },
        { "@type": "ListItem", position: 6, name: "Facelift",              url: `${BASE}/procedures/plastic-surgery/facelift` },
        { "@type": "ListItem", position: 7, name: "All Skin Concerns",     url: `${BASE}/concerns` },
        { "@type": "ListItem", position: 8, name: "Find a Location Near You", url: `${BASE}/locations` },
      ],
    },
  ],
};

function MaintenancePage() {
  return (
    <main className="maintenance-page" aria-labelledby="maintenance-title">
      <section className="maintenance-panel">
        <img
          className="maintenance-logo"
          src="/renovaaura-logo.png"
          alt="RenovaAura"
        />
        <p className="eyebrow">Scheduled maintenance</p>
        <h1 id="maintenance-title">We are refreshing RenovaAura.</h1>
        <p className="maintenance-copy">
          Our website is temporarily under maintenance. We will be back online
          shortly with the same care, services, and support.
        </p>
        <div className="maintenance-actions" aria-label="Contact options">
          <a className="btn btn-primary" href="tel:+919205220070">
            Call clinic
          </a>
          <a className="btn btn-ghost" href="https://wa.me/919205220070">
            WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (MAINTENANCE_MODE) {
    return <MaintenancePage />;
  }

  // Original public site shell is kept intact below. To restore the live site,
  // set MAINTENANCE_MODE to false and this code path will render again.
  // Mirror the Sanity-managed social profiles into the structured-data sameAs,
  // so the JSON-LD stays consistent with the visible social links. Clone the
  // module const (never mutate shared state across requests).
  const [clinic, hairProcedures, plasticProcedures, skinConcerns, bodyConcerns] =
    await Promise.all([
      getClinic(),
      getProceduresByPillar("hair-transplant"),
      getProceduresByPillar("plastic-surgery"),
      getConcerns(),
      getBodyConcerns(),
    ]);
  const logoUrl = clinic.logoUrl ?? `${BASE}/renovaaura-logo.png`;
  const address = {
    "@type": "PostalAddress",
    streetAddress: clinic.addressParts.streetAddress,
    addressLocality: clinic.addressParts.locality,
    addressRegion: clinic.addressParts.region,
    postalCode: clinic.addressParts.postalCode,
    addressCountry: clinic.addressParts.country,
  };
  const ld = structuredClone(jsonLd) as typeof jsonLd & {
    "@graph": Array<Record<string, unknown>>;
  };
  const org = ld["@graph"].find(
    (n) => n["@id"] === `${BASE}/#organization`,
  );
  if (org) {
    org.name = clinic.name;
    org.url = clinic.shopUrl;
    org.logo = {
      "@type": "ImageObject",
      "@id": `${BASE}/#logo`,
      url: logoUrl,
      contentUrl: logoUrl,
      width: 360,
      height: 100,
      caption: `${clinic.name} — Hair Transplant & Plastic Surgery Specialists`,
    };
    org.telephone = clinic.phone;
    org.email = clinic.email;
    org.address = address;
    org.sameAs = [
      clinic.social.instagram,
      clinic.social.youtube,
      clinic.social.linkedin,
      BASE,
      // Real clinic Maps link (from Sanity clinicSettings). Still the
      // generic maps.google.com/?q= search-query form, not the canonical
      // Google Business Profile share URL — replace with the GBP link for
      // a stronger entity match once it's on hand.
      clinic.googleMapsLinkUrl,
    ].filter(Boolean);
    org.contactPoint = [
      {
        "@type": "ContactPoint",
        telephone: clinic.phone,
        contactType: "customer service",
        contactOption: "TollFree",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
      {
        "@type": "ContactPoint",
        telephone: clinic.phone,
        contactType: "appointment booking",
        areaServed: "IN",
      },
    ];
  }
  const medicalBusiness = ld["@graph"].find(
    (n) => n["@id"] === `${BASE}/#medicalbusiness`,
  );
  if (medicalBusiness) {
    medicalBusiness.name = clinic.name;
    medicalBusiness.url = clinic.shopUrl;
    medicalBusiness.image = logoUrl;
    medicalBusiness.telephone = clinic.phone;
    medicalBusiness.email = clinic.email;
    medicalBusiness.address = address;
    medicalBusiness.hasMap = clinic.googleMapsLinkUrl;
    // Same caveat as Organization.sameAs above: this is the generic
    // maps.google.com/?q= link, not the canonical GBP profile share URL.
    medicalBusiness.sameAs = [clinic.googleMapsLinkUrl];
  }
  const website = ld["@graph"].find((n) => n["@id"] === `${BASE}/#website`);
  if (website) {
    website.name = clinic.name;
    website.description = clinic.tagline;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <BookingProvider>
        {/* Sticky site header — announcement bar + contact strip + nav
            all stick together as one unit on both mobile and desktop */}
        <header className="site-header">
          <Announcement />
          <TopContactBar />
          <Navbar
            clinic={clinic}
            hairProcedures={hairProcedures}
            plasticProcedures={plasticProcedures}
            skinConcerns={skinConcerns}
            bodyConcerns={bodyConcerns}
          />
        </header>
        <main>{children}</main>
        <Footer />
        <FabStack clinic={clinic} />
        <MobileTabBar />
        <BookingModal clinicName={clinic.name} />
      </BookingProvider>
      <RevealInit />
    </>
  );
}
