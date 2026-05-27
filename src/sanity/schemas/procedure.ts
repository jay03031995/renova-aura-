import { defineType, defineField } from "sanity";

/**
 * Procedure document — RenovaAura's hair transplant + plastic surgery
 * service pages. One document per procedure (FUE, DHI, Rhinoplasty, etc.).
 *
 * Mirrors the shape of src/data/procedures.ts so the fetcher can return
 * either a Sanity-managed entry or the static fallback transparently.
 */
export const procedureSchema = defineType({
  name: "procedure",
  title: "Procedure",
  type: "document",
  groups: [
    { name: "summary", title: "Summary" },
    { name: "quick", title: "Quick facts" },
    { name: "content", title: "Detail content" },
    { name: "faqs", title: "FAQs" },
    { name: "eeat", title: "EEAT signals" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Procedure name",
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
      name: "pillar",
      title: "Service pillar",
      type: "string",
      group: "summary",
      options: {
        list: [
          { title: "Hair Transplant", value: "hair-transplant" },
          { title: "Plastic Surgery", value: "plastic-surgery" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tag",
      title: "Tag (e.g. Most popular, Premium)",
      type: "string",
      group: "summary",
    }),
    defineField({
      name: "order",
      title: "Display order within pillar",
      type: "number",
      group: "summary",
      description: "Lower numbers appear first in listings.",
    }),
    defineField({
      name: "headline",
      title: "Short headline",
      type: "text",
      rows: 2,
      group: "summary",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "overview",
      title: "Overview paragraph",
      type: "text",
      rows: 6,
      group: "summary",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Card / hero image",
      type: "image",
      group: "summary",
      options: { hotspot: true },
    }),
    // ---- Quick facts ----
    defineField({
      name: "quickDuration",
      title: "Duration",
      type: "string",
      group: "quick",
    }),
    defineField({
      name: "quickSessions",
      title: "Sessions",
      type: "string",
      group: "quick",
    }),
    defineField({
      name: "quickDowntime",
      title: "Downtime",
      type: "string",
      group: "quick",
    }),
    defineField({
      name: "quickAnaesthesia",
      title: "Anaesthesia",
      type: "string",
      group: "quick",
    }),
    // ---- Detail content ----
    defineField({
      name: "keyPoints",
      title: "Key points",
      type: "array",
      of: [{ type: "string" }],
      group: "content",
    }),
    defineField({
      name: "suitableFor",
      title: "Suitable for",
      type: "array",
      of: [{ type: "string" }],
      group: "content",
    }),
    defineField({
      name: "process",
      title: "Process steps",
      type: "array",
      of: [{ type: "processStep" }],
      group: "content",
    }),
    defineField({
      name: "benefits",
      title: "Benefits",
      type: "array",
      of: [{ type: "benefit" }],
      group: "content",
    }),
    // ---- FAQs ----
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [{ type: "faqItem" }],
      group: "faqs",
    }),
    // ---- EEAT ----
    defineField({
      name: "medicallyReviewedBy",
      title: "Medically reviewed by",
      type: "string",
      group: "eeat",
      description: 'e.g. "Dr. Ankur Bhatia, M.Ch Plastic Surgery"',
    }),
    defineField({
      name: "lastReviewed",
      title: "Last clinically reviewed",
      type: "date",
      group: "eeat",
    }),
  ],
  preview: {
    select: {
      name: "name",
      pillar: "pillar",
      tag: "tag",
      media: "image",
    },
    prepare({ name, pillar, tag, media }) {
      const pillarLabel =
        pillar === "hair-transplant" ? "Hair Transplant" : "Plastic Surgery";
      return {
        title: name ?? "Untitled procedure",
        subtitle: [pillarLabel, tag].filter(Boolean).join(" · "),
        media,
      };
    },
  },
  orderings: [
    {
      title: "Order within pillar",
      name: "pillarOrder",
      by: [
        { field: "pillar", direction: "asc" },
        { field: "order", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
    {
      title: "Name (A → Z)",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
});
