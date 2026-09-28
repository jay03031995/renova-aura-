import type { MetadataRoute } from "next";
import { DOCTORS } from "@/data/doctors";
import { PROCEDURES } from "@/data/procedures";
import { CONCERNS } from "@/data/concerns";
import { BODY_CONCERNS } from "@/data/bodyConcerns";
import { NCR_AREAS } from "@/data/locations";
import { normalizeSiteUrl, SITE_URL } from "@/lib/siteUrl";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import {
  indexableLocationDoctorParams,
  indexableLocationTreatmentParams,
} from "@/lib/ncrLocationStrategy";

const STATIC_LASTMOD = new Date("2026-09-27T00:00:00.000Z");
const EQUIPMENT_SLUGS = [
  "microlift",
  "endymed-pure-2-o",
  "virtuex-laser",
  "hydroderma-2-0-hydrafacial",
  "qlara-pigmentation",
  "vega-comfort-laser-hair-reduction",
];

type SitemapEntry = {
  path: string;
  priority: number;
  lastModified?: Date;
};

async function getBlogSitemapEntries(): Promise<SitemapEntry[]> {
  if (!process.env.SANITY_API_TOKEN) return [];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1_500);
  const query = `*[
    _type == "blogPost" &&
    defined(slug.current) &&
    defined(publishedAt) &&
    publishedAt <= now() &&
    indexable == true &&
    seo.noIndex != true
  ] | order(publishedAt desc) {
    "slug": slug.current,
    _updatedAt
  }`;

  try {
    const response = await fetch(
      `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
        },
        signal: controller.signal,
      },
    );

    if (!response.ok) return [];

    const payload = await response.json() as {
      result?: { slug?: string; _updatedAt?: string }[];
    };

    return (payload.result ?? [])
      .filter((post) => post.slug)
      .map((post) => ({
        path: `/blog/${post.slug}`,
        priority: 0.7,
        lastModified: post._updatedAt ? new Date(post._updatedAt) : STATIC_LASTMOD,
      }));
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = normalizeSiteUrl(SITE_URL);
  const blogPosts = await getBlogSitemapEntries();

  const top: SitemapEntry[] = [
    { path: "", priority: 1 },
    { path: "/procedures", priority: 0.95 },
    { path: "/procedures/hair-transplant", priority: 0.95 },
    { path: "/procedures/plastic-surgery", priority: 0.9 },
    { path: "/concerns", priority: 0.9 },
    { path: "/body-concerns", priority: 0.85 },
    { path: "/tools-equipments", priority: 0.85 },
    { path: "/packages", priority: 0.85 },
    { path: "/tools", priority: 0.9 },
    { path: "/tools/skin-analysis", priority: 0.85 },
    { path: "/tools/graft-calculator", priority: 0.85 },
    { path: "/doctors", priority: 0.85 },
    { path: "/gallery", priority: 0.8 },
    { path: "/contact", priority: 0.8 },
    { path: "/locations", priority: 0.85 },
    { path: "/blog", priority: 0.75 },
    // /results withheld from sitemap until RenovaAura's own before/after
    // gallery replaces the dermaheal-era patient photos.
  ];

  const procedures: SitemapEntry[] = PROCEDURES.map((p) => ({
    path: `/procedures/${p.pillar}/${p.slug}`,
    priority: p.pillar === "hair-transplant" ? 0.85 : 0.8,
  }));

  const concerns: SitemapEntry[] = CONCERNS.map((concern) => ({
    path: `/concerns/${concern.slug}`,
    priority: 0.8,
  }));

  const bodyConcerns: SitemapEntry[] = BODY_CONCERNS.map((concern) => ({
    path: `/body-concerns/${concern.slug}`,
    priority: 0.8,
  }));

  const equipments: SitemapEntry[] = EQUIPMENT_SLUGS.map((slug) => ({
    path: `/tools-equipments/${slug}`,
    priority: 0.75,
  }));

  const doctorPages: SitemapEntry[] = DOCTORS.map((doctor) => ({
    path: `/doctors/${doctor.slug}`,
    priority: 0.7,
  }));

  const locationCityPages = Array.from(
    new Set(NCR_AREAS.map((loc) => loc.citySlug)),
  ).map((citySlug): SitemapEntry => ({
    path: `/locations/${citySlug}`,
    priority: 0.85,
  }));

  const locationAreaPages: SitemapEntry[] = NCR_AREAS.map((loc) => ({
    path: `/locations/${loc.citySlug}/${loc.areaSlug}`,
    priority: 0.9,
  }));
  const locationPages: SitemapEntry[] = indexableLocationTreatmentParams(PROCEDURES).map((param) => {
    const procedure = PROCEDURES.find((item) => item.slug === param.treatment);
    return {
      path: `/locations/${param.city}/${param.area}/${param.treatment}`,
      priority: procedure?.pillar === "hair-transplant" ? 0.85 : 0.8,
    };
  });
  const locationDoctorPages: SitemapEntry[] = indexableLocationDoctorParams(PROCEDURES, DOCTORS).map((param) => ({
    path: `/locations/${param.city}/${param.area}/${param.treatment}/${param.doctor}`,
    priority: 0.75,
  }));

  return [
    ...top,
    ...procedures,
    ...concerns,
    ...bodyConcerns,
    ...equipments,
    ...doctorPages,
    ...locationCityPages,
    ...locationAreaPages,
    ...locationPages,
    ...locationDoctorPages,
    ...blogPosts,
  ].map(
    ({ path, priority, lastModified }) => ({
      url: `${baseUrl}${path}`,
      lastModified: lastModified ?? STATIC_LASTMOD,
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority,
    }),
  );
}
