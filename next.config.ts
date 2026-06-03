import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sanity image CDN — used everywhere content has been uploaded into the CMS.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      // Hero carousel uses Unsplash placeholder images until the clinic
      // uploads its own photography into Sanity. Safe to remove once
      // every hero slide pulls from cdn.sanity.io.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async redirects() {
    // Permanent procedure renames (branded names). Kept static so they apply
    // reliably regardless of whether the build-time Sanity fetch below
    // succeeds — these URLs changed for good.
    const STATIC_REDIRECTS = [
      {
        source: "/procedures/hair-transplant/prp-hair-treatment",
        destination: "/procedures/hair-transplant/renova-follicle-boost",
        permanent: true,
      },
      {
        source: "/procedures/hair-transplant/gfc-hair-therapy",
        destination: "/procedures/hair-transplant/aura-pure-gfc",
        permanent: true,
      },
      {
        source: "/procedures/hair-transplant/mesotherapy-for-hair",
        destination: "/procedures/hair-transplant/aura-meso-infusion",
        permanent: true,
      },
    ];

    // Also pull editor-managed redirects from Sanity at build time. Falls back
    // to just the static list when Sanity isn't configured / reachable.
    try {
      const { sanityEnabled, client } = await import("./src/sanity/lib/client");
      if (!sanityEnabled) return STATIC_REDIRECTS;
      const docs = await client.fetch<
        { from: string; to: string; permanent?: boolean }[]
      >(`*[_type == "redirect" && defined(from) && defined(to)]{from,to,permanent}`);
      const seen = new Set(STATIC_REDIRECTS.map((r) => r.source));
      const fromSanity = docs
        .filter((d) => !seen.has(d.from))
        .map((d) => ({
          source: d.from,
          destination: d.to,
          permanent: d.permanent ?? true,
        }));
      return [...STATIC_REDIRECTS, ...fromSanity];
    } catch {
      return STATIC_REDIRECTS;
    }
  },
};

export default nextConfig;
