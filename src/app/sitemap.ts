import type { MetadataRoute } from "next";
import { getDoctorSlugs, getAllLocations } from "@/sanity/lib/fetchers";
import { PROCEDURES } from "@/data/procedures";
import { CONCERNS } from "@/data/concerns";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://renovaaura.com";
  const lastModified = new Date();

  const [doctorSlugs, locations] = await Promise.all([
    getDoctorSlugs(),
    getAllLocations(),
  ]);

  const top = [
    { path: "", priority: 1 },
    { path: "/procedures", priority: 0.95 },
    { path: "/procedures/hair-transplant", priority: 0.95 },
    { path: "/procedures/plastic-surgery", priority: 0.9 },
    { path: "/concerns", priority: 0.9 },
    { path: "/tools", priority: 0.9 },
    { path: "/tools/skin-analysis", priority: 0.85 },
    { path: "/tools/graft-calculator", priority: 0.85 },
    { path: "/doctors", priority: 0.85 },
    // /results withheld from sitemap until RenovaAura's own before/after
    // gallery replaces the dermaheal-era patient photos.
  ];

  const procedures = PROCEDURES.map((p) => ({
    path: `/procedures/${p.pillar}/${p.slug}`,
    priority: p.pillar === "hair-transplant" ? 0.85 : 0.8,
  }));

  const concerns = CONCERNS.map((c) => ({
    path: `/concerns/${c.slug}`,
    priority: 0.8,
  }));

  const doctors = doctorSlugs.map((slug) => ({
    path: `/doctors/${slug}`,
    priority: 0.7,
  }));

  // Location SEO pages: all area × treatment combinations.
  // The browsable /locations directory hub is intentionally NOT part of the
  // public site (no nav link, no index page) — only these deep landing pages
  // are exposed to search engines via the sitemap.
  // Priority: 0.85 for hair transplant (main pillar), 0.8 for others.
  const locationPages = locations.flatMap((loc) =>
    PROCEDURES.map((p) => ({
      path: `/locations/${loc.citySlug}/${loc.areaSlug}/${p.slug}`,
      priority: p.pillar === "hair-transplant" ? 0.85 : 0.8,
    })),
  );
  // Doctor-in-location pages
  const locationDoctorPages = locations.flatMap((loc) =>
    PROCEDURES.flatMap((p) =>
      doctorSlugs.map((dSlug) => ({
        path: `/locations/${loc.citySlug}/${loc.areaSlug}/${p.slug}/${dSlug}`,
        priority: 0.75,
      })),
    ),
  );

  return [
    ...top,
    ...procedures,
    ...concerns,
    ...doctors,
    ...locationPages,
    ...locationDoctorPages,
  ].map(
    ({ path, priority }) => ({
      url: `${baseUrl}${path}`,
      lastModified,
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority,
    }),
  );
}
