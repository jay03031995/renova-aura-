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
    "MD-led skin and hair clinic in Dwarka, New Delhi offering advanced dermatology, aesthetics and trichology treatments calibrated for Indian skin.",
  url: "https://dermaheal.co.in",
  telephone: ["+918080910191", "+917379464999"],
  email: CLINIC.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "C-712, Ramphal Chowk, Block D, Sector 7 Dwarka, Palam",
    addressLocality: "Dwarka",
    addressRegion: "New Delhi",
    postalCode: "110075",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: "28.5866", longitude: "77.0336" },
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
  medicalSpecialty: "Dermatology",
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
