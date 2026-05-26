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
