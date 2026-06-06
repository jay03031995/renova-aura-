import { defineField, defineType } from "sanity";

/**
 * Location (NCR area) document.
 *
 * Each area generates SEO landing pages at:
 *   /locations/{citySlug}/{areaSlug}/{treatmentSlug}/
 *   /locations/{citySlug}/{areaSlug}/{treatmentSlug}/{doctorSlug}/
 *
 * Content: use the override fields to add unique, area-specific copy so
 * Google doesn't treat the pages as thin content. The system auto-generates
 * sensible defaults from templates when overrides are empty.
 */
export const locationSchema = defineType({
  name: "location",
  title: "NCR Location",
  type: "document",
  groups: [
    { name: "main",     title: "Location",  default: true },
    { name: "content",  title: "SEO content" },
    { name: "seo",      title: "SEO overrides" },
  ],
  fields: [
    // ── Core identity ──────────────────────────────────────────────────
    defineField({
      name: "area",
      title: "Area / Neighbourhood",
      type: "string",
      group: "main",
      validation: (r) => r.required(),
      description: 'e.g. "Anand Vihar"',
    }),
    defineField({
      name: "areaSlug",
      title: "Area slug",
      type: "slug",
      group: "main",
      options: { source: "area" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      group: "main",
      validation: (r) => r.required(),
      options: {
        list: [
          { title: "New Delhi", value: "New Delhi" },
          { title: "Noida",     value: "Noida" },
          { title: "Gurugram",  value: "Gurugram" },
          { title: "Ghaziabad", value: "Ghaziabad" },
          { title: "Faridabad", value: "Faridabad" },
        ],
      },
    }),
    defineField({
      name: "citySlug",
      title: "City slug",
      type: "string",
      group: "main",
      options: {
        list: [
          { title: "new-delhi",  value: "new-delhi" },
          { title: "noida",      value: "noida" },
          { title: "gurugram",   value: "gurugram" },
          { title: "ghaziabad",  value: "ghaziabad" },
          { title: "faridabad",  value: "faridabad" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "pincode",
      title: "PIN code",
      type: "string",
      group: "main",
    }),
    defineField({
      name: "enabled",
      title: "Enable pages for this location",
      type: "boolean",
      group: "main",
      initialValue: true,
      description: "When off, all pages for this location return 404.",
    }),

    // ── Optional unique SEO copy ───────────────────────────────────────
    defineField({
      name: "headline",
      title: "Local headline override",
      type: "string",
      group: "content",
      description:
        'e.g. "RenovaAura — Hair Transplant Near Indirapuram". Leave blank to use the auto-generated template.',
    }),
    defineField({
      name: "intro",
      title: "Intro paragraph (unique copy)",
      type: "text",
      rows: 4,
      group: "content",
      description:
        "A short unique paragraph about serving patients from this area. 2–4 sentences. Improves thin-content score.",
    }),
    defineField({
      name: "faqs",
      title: "Local FAQs",
      type: "array",
      of: [{ type: "faqItem" }],
      group: "content",
      description: "1–3 area-specific FAQs improve E-E-A-T for this location.",
    }),

    // ── SEO overrides ──────────────────────────────────────────────────
    defineField({
      name: "metaTitle",
      title: "Meta title override",
      type: "string",
      group: "seo",
      description: "Overrides the auto-generated title. Max 60 chars.",
      validation: (r) => r.max(60),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description override",
      type: "text",
      rows: 2,
      group: "seo",
      description: "Overrides the auto-generated description. 140–160 chars.",
      validation: (r) => r.max(160),
    }),
  ],
  orderings: [
    { name: "city",  title: "By city",  by: [{ field: "citySlug",   direction: "asc" }] },
    { name: "area",  title: "By area",  by: [{ field: "areaSlug.current", direction: "asc" }] },
  ],
  preview: {
    select: { area: "area", city: "city", enabled: "enabled" },
    prepare: ({ area, city, enabled }) => ({
      title: `${area}, ${city}`,
      subtitle: enabled ? "Enabled" : "Disabled",
    }),
  },
});
