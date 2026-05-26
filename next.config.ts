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
    // Pull URL redirects from Sanity at build time. Falls back to an empty
    // list when Sanity isn't configured yet.
    try {
      const { sanityEnabled, client } = await import("./src/sanity/lib/client");
      if (!sanityEnabled) return [];
      const docs = await client.fetch<
        { from: string; to: string; permanent?: boolean }[]
      >(`*[_type == "redirect" && defined(from) && defined(to)]{from,to,permanent}`);
      return docs.map((d) => ({
        source: d.from,
        destination: d.to,
        permanent: d.permanent ?? true,
      }));
    } catch {
      return [];
    }
  },
};

export default nextConfig;
