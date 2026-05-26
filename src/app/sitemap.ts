import type { MetadataRoute } from "next";
import { getDoctorSlugs } from "@/sanity/lib/fetchers";
import { PROCEDURES } from "@/data/procedures";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://renovaaura.com";
  const lastModified = new Date();

  const doctorSlugs = await getDoctorSlugs();

  const top = [
    { path: "", priority: 1 },
    { path: "/procedures", priority: 0.95 },
    { path: "/procedures/hair-transplant", priority: 0.95 },
    { path: "/procedures/plastic-surgery", priority: 0.9 },
    { path: "/doctors", priority: 0.85 },
    { path: "/results", priority: 0.8 },
  ];

  const procedures = PROCEDURES.map((p) => ({
    path: `/procedures/${p.pillar}/${p.slug}`,
    priority: p.pillar === "hair-transplant" ? 0.85 : 0.8,
  }));

  const doctors = doctorSlugs.map((slug) => ({
    path: `/doctors/${slug}`,
    priority: 0.7,
  }));

  return [...top, ...procedures, ...doctors].map(({ path, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority,
  }));
}
