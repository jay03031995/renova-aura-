import { createClient, type ClientConfig } from "next-sanity";
import { apiVersion, dataset, projectId, sanityEnabled } from "../env";

const baseConfig: ClientConfig = {
  projectId: projectId || "missing",
  dataset,
  apiVersion,
  // useCdn must be false so the server always receives fresh content when
  // Next.js does revalidate. Next.js handles caching above this layer via
  // page-level `revalidate` and on-demand `revalidateTag('sanity')`.
  useCdn: false,
  perspective: "published",
  stega: false,
  // The dataset is private (it also holds appointment/lead PII), so public
  // reads return nothing without auth. All site fetches run server-side, so
  // we attach the server-only token here. It is NOT bundled to the browser —
  // non-NEXT_PUBLIC env vars resolve to undefined client-side — so the
  // dataset stays private and the token never leaks. Requires
  // SANITY_API_TOKEN to be set on the host (e.g. Vercel) in production.
  token: process.env.SANITY_API_TOKEN,
};

/**
 * Read-only client for fetching content into the public site.
 * Safe to call even when Sanity isn't configured — callers should check
 * `sanityEnabled` before issuing requests.
 */
export const client = createClient(baseConfig);

/**
 * Write client used by the seed migration script. Requires
 * `SANITY_API_TOKEN` with editor permissions.
 */
export function writeClient(token: string) {
  return createClient({
    ...baseConfig,
    token,
    useCdn: false,
  });
}

export { sanityEnabled };
