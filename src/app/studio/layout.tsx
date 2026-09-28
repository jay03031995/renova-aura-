import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "RenovaAura Admin",
  description: "Private RenovaAura Sanity Studio for managing website content.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
