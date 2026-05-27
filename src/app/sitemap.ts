import type { MetadataRoute } from "next";
import { getDoctorSlugs } from "@/sanity/lib/fetchers";
import { PROCEDURES } from "@/data/procedures";
import { CONCERNS } from "@/data/concerns";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://renovaaura.com";
  const lastModified = new Date();

  const doctorSlugs = await getDoctorSlugs();

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

  return [...top, ...procedures, ...concerns, ...doctors].map(
    ({ path, priority }) => ({
      url: `${baseUrl}${path}`,
      lastModified,
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority,
    }),
  );
}
