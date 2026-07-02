import { defineType, defineField } from "sanity";

/**
 * Concern document — RenovaAura's skin/dermatology landing pages
 * (Acne, Pigmentation, Anti-Ageing, etc.). One document per concern.
 *
 * Mirrors the shape of src/data/concerns.ts. Related packages, treatments,
 * and technologies let editors curate the recommendation sections.
 */
export const concernSchema = defineType({
  name: "concern",
  title: "Skin Concern",
  type: "document",
  groups: [
    { name: "summary", title: "Summary" },
    { name: "detail", title: "Detail content" },
    { name: "linking", title: "Related content" },
    { name: "faqs", title: "FAQs" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Concern name",
      type: "string",
      group: "summary",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      group: "summary",
      options: { source: "name", maxLength: 80 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon glyph",
      type: "string",
      group: "summary",
      description: "Single character used in headers (e.g. ◉, ◐, ◑)",
    }),
    defineField({
      name: "image",
      title: "Card / hero image",
      type: "image",
      group: "summary",
      options: { hotspot: true },
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      group: "summary",
      description: "Lower numbers appear first.",
    }),
    defineField({
      name: "cardTagline",
      title: "Card tagline (short)",
      type: "string",
      group: "summary",
      description: "Shown under the name on listing cards.",
    }),
    defineField({
      name: "headline",
      title: "Detail-page headline",
      type: "text",
      rows: 2,
      group: "summary",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary paragraph",
      type: "text",
      rows: 6,
      group: "summary",
      validation: (r) => r.required(),
    }),
    // ---- Detail content ----
    defineField({
      name: "symptoms",
      title: "Symptoms (what patients notice)",
      type: "array",
      of: [{ type: "string" }],
      group: "detail",
    }),
    defineField({
      name: "causes",
      title: "Common causes",
      type: "array",
      of: [{ type: "string" }],
      group: "detail",
    }),
    defineField({
      name: "approach",
      title: "RenovaAura's approach (numbered steps)",
      type: "array",
      of: [{ type: "string" }],
      group: "detail",
    }),
    // ---- Linking ----
    defineField({
      name: "relatedPackages",
      title: "Related Packages",
      type: "array",
      group: "linking",
      of: [
        {
          type: "reference",
          to: [{ type: "package" }],
          options: { filter: "enabled != false" },
        },
      ],
      description:
        "Package cards shown in the We May Recommend section.",
    }),
    defineField({
      name: "relatedProcedures",
      title: "Related Procedures",
      type: "array",
      group: "linking",
      of: [
        {
          type: "reference",
          to: [
            { type: "concern" },
            { type: "procedure" },
            { type: "bodyConcern" },
          ],
        },
      ],
      description:
        "Treatment cards from Skin Concerns, Hair Transplant, Plastic Surgery, and Body Concerns.",
    }),
    defineField({
      name: "technologiesUsed",
      title: "Technologies Used",
      type: "array",
      group: "linking",
      of: [{ type: "reference", to: [{ type: "equipment" }] }],
      description:
        "Technology cards shown below the related procedures section.",
    }),
    // ---- FAQs ----
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [{ type: "faqItem" }],
      group: "faqs",
    }),
  ],
  preview: {
    select: {
      name: "name",
      tagline: "cardTagline",
      media: "image",
    },
    prepare({ name, tagline, media }) {
      return {
        title: name ?? "Untitled concern",
        subtitle: tagline,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Display order",
      name: "displayOrder",
      by: [
        { field: "order", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
  ],
});
