import { defineField, defineType } from "sanity";

/**
 * Homepage hero carousel slide. Each slide renders a full-bleed image with a
 * sage-green overlay, eyebrow pill, two-line headline (the second line is the
 * italicised emphasis), a subtitle, and two CTAs (primary opens the booking
 * modal; secondary links wherever you point it). Order controls slide
 * sequence; toggle "enabled" to hide a slide without deleting it.
 */
export const heroSlideSchema = defineType({
  name: "heroSlide",
  title: "Hero slide",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow (small label above headline)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "headlineLine1",
      title: "Headline — line 1",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "headlineLine2",
      title: "Headline — line 2 (emphasised)",
      type: "string",
      description: "Rendered in the italic accent style.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 2,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "ctaLabel",
      title: "Primary button label",
      type: "string",
      initialValue: "Book Appointment",
      description: "Primary button always opens the booking form.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "secondaryLabel",
      title: "Secondary button label",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "secondaryHref",
      title: "Secondary button link",
      type: "string",
      description: "Internal path (e.g. /procedures/hair-transplant) or full URL.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Background image",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "imageAlt",
      title: "Image alt text",
      type: "string",
      description: "Describe the image for screen readers and SEO.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "enabled",
      title: "Show this slide",
      type: "boolean",
      initialValue: true,
    }),
  ],
  orderings: [
    { name: "order", title: "Manual order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { line1: "headlineLine1", line2: "headlineLine2", eyebrow: "eyebrow", media: "image", enabled: "enabled" },
    prepare: ({ line1, line2, eyebrow, media, enabled }) => ({
      title: `${line1} ${line2}`.trim(),
      subtitle: enabled === false ? `Hidden · ${eyebrow}` : eyebrow,
      media,
    }),
  },
});
