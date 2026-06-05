import { BookingProvider } from "@/components/BookingContext";
import Announcement from "@/components/Announcement";
import TopContactBar from "@/components/TopContactBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FabStack from "@/components/FabStack";
import MobileTabBar from "@/components/MobileTabBar";
import BookingModal from "@/components/BookingModal";
import RevealInit from "@/components/RevealInit";
import { CLINIC } from "@/data/clinic";

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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: CLINIC.name,
  description:
    "Hair transplant, plastic surgery and dermatology clinic in Anand Vihar, New Delhi. Board-certified consultants delivering FUE, DHI, rhinoplasty, facelift and skin care — evidence-based, natural-looking results.",
  url: "https://renovaaura.com",
  telephone: [CLINIC.phone, CLINIC.phone2],
  email: CLINIC.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: CLINIC.addressParts.streetAddress,
    addressLocality: CLINIC.addressParts.locality,
    addressRegion: CLINIC.addressParts.region,
    postalCode: CLINIC.addressParts.postalCode,
    addressCountry: CLINIC.addressParts.country,
  },
  // Anand Vihar approx coordinates — refine once verified on Google Maps.
  geo: { "@type": "GeoCoordinates", latitude: "28.6488", longitude: "77.3025" },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "19:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "10:00",
      closes: "19:00",
    },
  ],
  medicalSpecialty: ["Dermatology", "Plastic Surgery"],
  priceRange: "$$",
  sameAs: [CLINIC.social.instagram, CLINIC.social.youtube, CLINIC.social.linkedin],
};

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BookingProvider>
        <Announcement />
        <TopContactBar />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FabStack />
        <MobileTabBar />
        <BookingModal />
      </BookingProvider>
      <RevealInit />
    </>
  );
}
