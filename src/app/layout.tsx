import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getClinic, getSiteSettings } from "@/sanity/lib/fetchers";

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

const FALLBACK_SITE_URL = "https://renovaaura.com";
const FALLBACK_TITLE = "RenovaAura — Hair Transplant & Plastic Surgery Specialists";
const FALLBACK_DESCRIPTION =
  "RenovaAura — board-certified hair transplant surgeons and plastic surgery specialists. FUE, DHI, FUT, rhinoplasty, blepharoplasty, facelift and more. Natural-looking, clinically-grounded results.";
const FALLBACK_OG_IMAGE = "/og.jpg";

const absoluteUrl = (url: string | undefined, base: string) => {
  if (!url) return undefined;
  return new URL(url, base).toString();
};

export async function generateMetadata(): Promise<Metadata> {
  const [clinic, settings] = await Promise.all([getClinic(), getSiteSettings()]);
  const siteUrl = settings.siteUrl ?? FALLBACK_SITE_URL;
  const canonicalUrl = settings.canonicalUrl ?? siteUrl;
  const title = settings.defaultSeoTitle ?? FALLBACK_TITLE;
  const description = settings.defaultSeoDescription ?? FALLBACK_DESCRIPTION;
  const ogImage = absoluteUrl(
    settings.openGraphImageUrl ?? FALLBACK_OG_IMAGE,
    siteUrl,
  );
  const twitterImage = absoluteUrl(
    settings.twitterImageUrl ?? settings.openGraphImageUrl ?? FALLBACK_OG_IMAGE,
    siteUrl,
  );
  const favicon = absoluteUrl(settings.faviconUrl, siteUrl) ?? "/fav.png";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: settings.titleTemplate ?? `%s — ${clinic.name}`,
    },
    description,
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
    authors: [{ name: clinic.name, url: siteUrl }],
    creator: clinic.name,
    publisher: clinic.name,
  // Tells Google this is one word, not two — helps correct "renova aura" split
    applicationName: clinic.name,
    alternates: { canonical: canonicalUrl },
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: canonicalUrl,
      siteName: clinic.name,
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: twitterImage ? [twitterImage] : undefined,
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
}

// Root-level WebSite schema — placed at the very top level so Google sees it
// on every page crawl. Enables sitelinks search box + brand entity recognition.
const rootJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://renovaaura.com/#website",
  url: "https://renovaaura.com",
  name: "RenovaAura",
  alternateName: "RenovaAura Clinic",
  description: FALLBACK_DESCRIPTION,
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

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Keep the WebSite publisher.sameAs in sync with the Sanity-managed social
  // profiles (clone the const — never mutate shared state across requests).
  const [clinic, settings] = await Promise.all([getClinic(), getSiteSettings()]);
  const siteUrl = settings.siteUrl ?? FALLBACK_SITE_URL;
  const ld = structuredClone(rootJsonLd) as typeof rootJsonLd & {
    url: string;
    name: string;
    description: string;
    publisher: {
      name: string;
      url: string;
      logo: { url: string };
      sameAs?: string[];
    };
    potentialAction: { target: { urlTemplate: string } };
  };
  ld.url = siteUrl;
  ld.name = clinic.name;
  ld.description = settings.defaultSeoDescription ?? clinic.tagline;
  ld.publisher.name = clinic.name;
  ld.publisher.url = siteUrl;
  ld.publisher.logo.url = absoluteUrl(clinic.logoUrl, siteUrl) ?? `${siteUrl}/renovaaura-logo.png`;
  ld.publisher.sameAs = [clinic.social.instagram, clinic.social.youtube, clinic.social.linkedin];
  ld.potentialAction.target.urlTemplate = `${siteUrl}/procedures?q={search_term_string}`;

  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
        {children}
      </body>
    </html>
  );
}
