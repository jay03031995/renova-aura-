import { defineField, defineType } from "sanity";

/**
 * Treatment package (dermatology / aesthetics). Grouped by `category` on the
 * /packages page and tied to a concern detail page via `concernSlug`.
 */
export const packageSchema = defineType({
  name: "package",
  title: "Treatment package",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Package name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Acne", value: "acne" },
          { title: "Acne Scars", value: "acne-scars" },
          { title: "Pigmentation", value: "pigmentation" },
          { title: "Hair Loss", value: "hair-loss" },
          { title: "Anti-Ageing", value: "anti-ageing" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Package Image",
      type: "image",
      options: { hotspot: true },
      description:
        "Optional image shown on package cards. Existing packages keep the current placeholder if this is empty.",
    }),
    defineField({
      name: "includes",
      title: "What's included",
      type: "text",
      rows: 2,
      description: 'Sessions / component treatments, e.g. "6× Q-switch laser".',
    }),
    defineField({
      name: "price",
      title: "Price (display)",
      type: "string",
      description: 'Optional, e.g. "₹24,000" or "From ₹18,000". Leave blank to hide.',
    }),
    defineField({
      name: "concernSlug",
      title: "Related concern",
      type: "string",
      description:
        "Ties this package to a concern detail page. Must match a concern slug.",
      options: {
        list: [
          { title: "Acne & Acne Scars", value: "acne" },
          { title: "Pigmentation & Melasma", value: "pigmentation-melasma" },
          { title: "Anti-Ageing & Wrinkles", value: "anti-ageing-wrinkles" },
          { title: "Dull Skin & Uneven Tone", value: "dull-skin-brightening" },
          { title: "Scar Reduction", value: "scar-reduction" },
          { title: "Stretch Marks", value: "stretch-marks" },
          { title: "Tattoo Removal", value: "tattoo-removal" },
          { title: "Open Pores", value: "open-pores" },
          { title: "Dark Circles", value: "dark-circles" },
          { title: "Rosacea & Sensitive Skin", value: "rosacea-sensitive-skin" },
          { title: "Laser Hair Reduction", value: "laser-hair-reduction" },
          { title: "(none)", value: "" },
        ],
      },
    }),
    defineField({ name: "order", title: "Sort order", type: "number", initialValue: 0 }),
    defineField({
      name: "enabled",
      title: "Show this package",
      type: "boolean",
      initialValue: true,
    }),
  ],
  orderings: [
    { name: "order", title: "Manual order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", category: "category", includes: "includes" },
    prepare: ({ title, category, includes }) => ({
      title,
      subtitle: [category, includes].filter(Boolean).join(" · "),
    }),
  },
});
