import { defineField, defineType } from "sanity";

/**
 * Real Result — a before/after (or single) result photo.
 * Shown on treatment pages (via the `treatments` reference) and in the
 * media Gallery. Kept separate from the legacy `result` type so nothing
 * existing breaks.
 */
export const realResultSchema = defineType({
  name: "realResult",
  title: "Real Result (Before / After)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Treatment / procedure name",
      type: "string",
      validation: (r) => r.required(),
      description: 'e.g. "Acne Scar Reduction" or "FUE Hair Transplant".',
    }),
    defineField({
      name: "caption",
      title: "Short caption (optional)",
      type: "string",
      description: "e.g. \"6 sessions · 12 weeks\".",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Hair", value: "Hair" },
          { title: "Skin", value: "Skin" },
          { title: "Plastic Surgery", value: "Plastic Surgery" },
          { title: "Body", value: "Body" },
          { title: "Clinic", value: "Clinic" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "beforeImage",
      title: "Before image (or single result image)",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "afterImage",
      title: "After image (optional — leave empty for a single image)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "treatments",
      title: "Show on these treatment pages",
      type: "array",
      of: [
        {
          type: "reference",
          to: [
            { type: "procedure" },
            { type: "concern" },
            { type: "bodyConcern" },
          ],
        },
      ],
      description:
        "Link the procedures / concerns this result should appear on.",
    }),
    defineField({
      name: "featured",
      title: "Featured in gallery",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "consentOnFile",
      title: "Patient consent on file",
      type: "boolean",
      initialValue: false,
      validation: (r) => r.required(),
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "displayOrder",
      by: [{ field: "displayOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "beforeImage" },
  },
});
