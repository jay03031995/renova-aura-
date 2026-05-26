import { BookingProvider } from "@/components/BookingContext";
import Announcement from "@/components/Announcement";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FabStack from "@/components/FabStack";
import BookingModal from "@/components/BookingModal";
import RevealInit from "@/components/RevealInit";
import { CLINIC } from "@/data/clinic";

/**
 * Safety-net revalidation: every page under (site)/ re-renders at most once
 * per 60 seconds, picking up Sanity edits automatically. For instant updates,
 * Sanity's webhook hits /api/revalidate which calls revalidateTag("sanity").
 */
export const revalidate = 60;

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
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FabStack />
        <BookingModal />
      </BookingProvider>
      <RevealInit />
    </>
  );
}
