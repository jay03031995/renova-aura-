import { BookingProvider } from "@/components/BookingContext";
import Announcement from "@/components/Announcement";
import TopContactBar from "@/components/TopContactBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FabStack from "@/components/FabStack";
import MobileTabBar from "@/components/MobileTabBar";
import BookingModal from "@/components/BookingModal";
import RevealInit from "@/components/RevealInit";
import { getClinic } from "@/sanity/lib/fetchers";

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
export const dynamic = "force-dynamic";

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
const BASE = "https://renovaaura.com";
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
      // SiteNavigationElement — the exact 6 links you want as sitelinks,
      // in priority order: Treatments, Doctors, Book, Locations, Hair Test, Skin Analysis
      mainEntity: [
        {
          "@type": "SiteNavigationElement",
          name: "Treatments",
          description: "Hair transplant, plastic surgery and skin concern procedures at RenovaAura",
          url: `${BASE}/procedures`,
        },
        {
          "@type": "SiteNavigationElement",
          name: "Our Doctors",
          description: "Board-certified hair transplant and plastic surgery specialists",
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
          name: "Locations",
          description: "RenovaAura serves patients from across Delhi NCR — find your nearest area",
          url: `${BASE}/locations`,
        },
        {
          "@type": "SiteNavigationElement",
          name: "Take Hair Test",
          description: "Free Norwood-based hair graft calculator — get your personalised PDF",
          url: `${BASE}/tools/graft-calculator`,
        },
        {
          "@type": "SiteNavigationElement",
          name: "AI Skin Analysis",
          description: "Free AI skin analysis — map your skin type and get a personalised care plan",
          url: `${BASE}/tools/skin-analysis`,
        },
      ],
    },

    // ── 4. ItemList — top treatments (helps Google link rich results) ───
    {
      "@type": "ItemList",
      "@id": `${BASE}/#treatments`,
      name: "RenovaAura Treatments",
      url: `${BASE}/procedures`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "FUE Hair Transplant",   url: `${BASE}/procedures/hair-transplant/fue-hair-transplant` },
        { "@type": "ListItem", position: 2, name: "DHI Hair Transplant",   url: `${BASE}/procedures/hair-transplant/dhi-hair-transplant` },
        { "@type": "ListItem", position: 3, name: "Rhinoplasty",           url: `${BASE}/procedures/plastic-surgery/rhinoplasty` },
        { "@type": "ListItem", position: 4, name: "Facelift",              url: `${BASE}/procedures/plastic-surgery/facelift` },
        { "@type": "ListItem", position: 5, name: "Acne Treatment",        url: `${BASE}/concerns/acne` },
        { "@type": "ListItem", position: 6, name: "Pigmentation Treatment",url: `${BASE}/concerns/pigmentation-melasma` },
      ],
    },
  ],
};

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Mirror the Sanity-managed social profiles into the structured-data sameAs,
  // so the JSON-LD stays consistent with the visible social links. Clone the
  // module const (never mutate shared state across requests).
  const clinic = await getClinic();
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
    org.sameAs = [clinic.social.instagram, clinic.social.youtube, clinic.social.linkedin, BASE];
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
          <Navbar clinic={clinic} />
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
