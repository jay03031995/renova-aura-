import { defineField, defineType } from "sanity";

export const testimonialSchema = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "quote", title: "Quote", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "name", title: "Patient name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "detail", title: "Treatment / clinic detail", type: "string" }),
    defineField({
      name: "order",
      title: "Sort order on the homepage",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "showOnHomepage",
      title: "Show on homepage",
      type: "boolean",
      initialValue: true,
    }),
  ],
  orderings: [
    { name: "order", title: "Manual order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "name", subtitle: "quote" } },
});

export const homepageFaqSchema = defineType({
  name: "homepageFaq",
  title: "Homepage FAQ",
  type: "document",
  fields: [
    defineField({ name: "question", title: "Question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", title: "Answer", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    { name: "order", title: "Manual order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "question", subtitle: "answer" } },
});

export const eeatPillarSchema = defineType({
  name: "eeatPillar",
  title: "EEAT pillar",
  type: "document",
  fields: [
    defineField({
      name: "letter",
      title: "Pillar letter (E / E / A / T)",
      type: "string",
      validation: (r) => r.required().max(2),
    }),
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "order", title: "Sort order", type: "number", initialValue: 0 }),
  ],
  orderings: [
    { name: "order", title: "Manual order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { letter: "letter", title: "title" },
    prepare: ({ letter, title }) => ({ title: `${letter} — ${title}` }),
  },
});

export const trustItemSchema = defineType({
  name: "trustItem",
  title: "Trust strip item",
  type: "document",
  fields: [
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: {
        list: [
          { title: "Shield", value: "shield" },
          { title: "Award", value: "award" },
          { title: "Check", value: "check" },
          { title: "Sparkle", value: "sparkle" },
          { title: "Calendar", value: "calendar" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "text", title: "Text", type: "string", validation: (r) => r.required() }),
    defineField({ name: "order", title: "Sort order", type: "number", initialValue: 0 }),
  ],
  orderings: [
    { name: "order", title: "Manual order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "text", subtitle: "icon" } },
});

export const redirectSchema = defineType({
  name: "redirect",
  title: "URL redirect",
  type: "document",
  fields: [
    defineField({
      name: "from",
      title: "From (source path)",
      type: "string",
      validation: (r) => r.required().regex(/^\//, { name: "leading slash" }),
      description: "Path on this site, e.g. /treatments/old-slug.",
    }),
    defineField({
      name: "to",
      title: "To (destination)",
      type: "string",
      validation: (r) => r.required(),
      description: "Internal path (/treatments/new-slug) or external URL.",
    }),
    defineField({
      name: "permanent",
      title: "Permanent (301)",
      type: "boolean",
      initialValue: true,
      description: "Most URL changes should be permanent so Google updates its index.",
    }),
  ],
  preview: {
    select: { from: "from", to: "to", permanent: "permanent" },
    prepare: ({ from, to, permanent }) => ({
      title: `${from} → ${to}`,
      subtitle: permanent ? "301" : "302",
    }),
  },
});
