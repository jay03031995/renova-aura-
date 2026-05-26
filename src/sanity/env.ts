/**
 * Sanity environment configuration.
 *
 * `projectId` and `dataset` are intentionally optional — when they're absent
 * the page components fall back to the local TypeScript data so the site keeps
 * building. Set the env vars in `.env.local` once you create your Sanity
 * project to switch the site over to CMS-driven content.
 *
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
 *   NEXT_PUBLIC_SANITY_DATASET=production
 *   SANITY_API_TOKEN=...  (server-only, used by the seed script)
 *   NEXT_PUBLIC_SANITY_STUDIO_URL=/studio
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-11-01";

/** True once a Sanity project has been wired up via env vars. */
export const sanityEnabled = projectId.trim().length > 0;

/**
 * Convenience helper for fail-fast paths (the seed script, write client).
 * The site itself never throws — it falls back to TS data instead.
 */
export function assertSanity(): void {
  if (!sanityEnabled) {
    throw new Error(
      "Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local. See README for setup.",
    );
  }
}
