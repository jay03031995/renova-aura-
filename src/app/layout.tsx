import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CLINIC } from "@/data/clinic";

/**
 * Inter is the Google Fonts equivalent of Apple's SF Pro family.
 * (Apple's own SF Pro isn't licensed for web use outside Apple sites,
 * and Inter was designed specifically to match its metrics.)
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://renovaaura.com"),
  title: {
    default:
      "RenovaAura — Hair Transplant & Plastic Surgery Specialists",
    template: "%s — RenovaAura",
  },
  description:
    "RenovaAura — board-certified hair transplant surgeons and plastic surgery specialists. FUE, DHI, FUT, rhinoplasty, blepharoplasty, facelift and more. Natural-looking, clinically-grounded results.",
  keywords: [
    "RenovaAura",
    "RenovaAura clinic",
    "hair transplant Delhi",
    "FUE hair transplant",
    "DHI hair transplant",
    "beard transplant",
    "eyebrow transplant",
    "PRP hair treatment",
    "plastic surgery Delhi",
    "rhinoplasty",
    "blepharoplasty",
    "facelift",
    "dermatology Anand Vihar",
    "hair transplant Anand Vihar",
  ],
  authors: [{ name: "RenovaAura", url: "https://renovaaura.com" }],
  creator: "RenovaAura",
  publisher: "RenovaAura",
  // Tells Google this is one word, not two — helps correct "renova aura" split
  applicationName: "RenovaAura",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://renovaaura.com",
    siteName: CLINIC.name,
    title: "RenovaAura — Hair Transplant & Plastic Surgery Specialists",
    description:
      "Board-certified hair transplant and plastic surgery in a single, modern clinic. FUE • DHI • rhinoplasty • facelift • PRP.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RenovaAura — Hair Transplant & Plastic Surgery",
    description:
      "Board-certified hair transplant and plastic surgery. FUE • DHI • rhinoplasty • facelift.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Root-level WebSite schema — placed at the very top level so Google sees it
// on every page crawl. Enables sitelinks search box + brand entity recognition.
const rootJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://renovaaura.com/#website",
  url: "https://renovaaura.com",
  name: "RenovaAura",
  alternateName: "RenovaAura Clinic",
  description: "Hair Transplant & Plastic Surgery Specialists — Anand Vihar, New Delhi",
  inLanguage: "en-IN",
  publisher: {
    "@type": "Organization",
    "@id": "https://renovaaura.com/#organization",
    name: "RenovaAura",
    url: "https://renovaaura.com",
    logo: {
      "@type": "ImageObject",
      url: "https://renovaaura.com/renovaaura-logo.png",
      width: 360,
      height: 100,
    },
    sameAs: [
      "https://instagram.com/renovaaura",
      "https://youtube.com/@renovaaura",
      "https://linkedin.com/company/renovaaura",
    ],
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://renovaaura.com/procedures?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
