"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_URL } from "@/lib/siteUrl";

const LABELS: Record<string, string> = {
  blog: "Blog",
  "body-concerns": "Body Concerns",
  concerns: "Skin Concerns",
  contact: "Contact",
  doctors: "Doctors",
  gallery: "Gallery",
  locations: "Locations",
  packages: "Packages",
  "privacy-policy": "Privacy Policy",
  procedures: "Procedures",
  results: "Results",
  tools: "Tools",
  "tools-equipments": "Lasers / Technologies",
  "hair-transplant": "Hair Transplant",
  "plastic-surgery": "Plastic Surgery",
  "new-delhi": "New Delhi",
  noida: "Noida",
  ghaziabad: "Ghaziabad",
  gurugram: "Gurugram",
  faridabad: "Faridabad",
  "anand-vihar": "Anand Vihar",
  "laxmi-nagar": "Laxmi Nagar",
  shahdara: "Shahdara",
  sahibabad: "Sahibabad",
  "fue-hair-transplant": "FUE Hair Transplant",
  "dhi-hair-transplant": "Direct Hair Transplantation (DHT)",
  "female-hair-transplant": "Female Hair Transplant",
  "hairline-lowering": "Hairline Lowering",
  "beard-transplant": "Beard Transplant",
  "eyebrow-transplant": "Eyebrow Transplant",
  "gynecomastia-surgery": "Gynecomastia Surgery",
  "scar-revision": "Scar Revision",
  "keloid-hypertrophic-scar": "Keloid / Hypertrophic Scar",
  "tummy-tuck": "Tummy Tuck",
  liposuction: "Body Contouring (Liposuction)",
  "post-burn-contracture": "Post Burn Contracture",
  "bhawna-bhardwaj": "Dr. Bhawna Bhardwaj",
  "ankur-bhatia": "Dr. Ankur Bhatia",
  "graft-calculator": "Hair Graft Calculator",
  "skin-analysis": "AI Skin Analysis",
};

function labelFor(segment: string) {
  return LABELS[segment] ?? segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function GlobalBreadcrumbs() {
  const pathname = usePathname();
  if (!pathname || pathname === "/" || pathname.startsWith("/studio")) return null;

  const segments = pathname.split("/").filter(Boolean);
  const items = [
    { name: "Home", href: "/" },
    ...segments.map((segment, index) => ({
      name: labelFor(segment),
      href: `/${segments.slice(0, index + 1).join("/")}`,
    })),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.href === "/" ? "" : item.href}`,
    })),
  };

  return (
    <div className="global-breadcrumb-wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="loc-breadcrumb global-breadcrumb container" aria-label="Breadcrumb">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <span key={item.href} className="global-breadcrumb-item">
              {index > 0 && <span aria-hidden="true">›</span>}
              {isLast ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <Link href={item.href}>{item.name}</Link>
              )}
            </span>
          );
        })}
      </nav>
    </div>
  );
}
