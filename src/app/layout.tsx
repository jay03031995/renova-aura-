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
    "hair transplant",
    "FUE hair transplant",
    "DHI hair transplant",
    "beard transplant",
    "eyebrow transplant",
    "PRP hair treatment",
    "plastic surgery",
    "rhinoplasty",
    "blepharoplasty",
    "facelift",
    "RenovaAura clinic",
  ],
  authors: [{ name: CLINIC.name }],
  creator: CLINIC.name,
  publisher: CLINIC.name,
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
