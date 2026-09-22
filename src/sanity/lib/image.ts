import createImageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({
  projectId: projectId || "missing",
  dataset,
});

/**
 * Build a Sanity CDN URL for an image reference, with chainable transforms.
 * Accepts the full range of Sanity image inputs (image asset, hotspot object,
 * raw asset reference, etc.) — typing kept loose to avoid pulling deep type
 * paths from the image-url package that aren't part of its public API.
 */
export const urlFor = (source: unknown) =>
  builder.image(source as Parameters<typeof builder.image>[0]);

/** Convenience: fixed-width URL with auto format. */
export const urlForWidth = (source: unknown, w: number) =>
  urlFor(source).width(w).auto("format").url();
