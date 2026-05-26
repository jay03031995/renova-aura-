import { defineField, defineType } from "sanity";

export const resultSchema = defineType({
  name: "result",
  title: "Patient result",
  type: "document",
  groups: [
    { name: "main", title: "Main", default: true },
    { name: "clinical", title: "Clinical detail" },
  ],
  fields: [
    defineField({ name: "name", title: "Result title", type: "string", group: "main", validation: (r) => r.required(), description: 'e.g. "Acne Scar Reduction (MNRF)".' }),
    defineField({
      name: "category",
      title: "Concern category",
      type: "string",
      group: "main",
      options: {
        list: [
          "Acne Scars",
          "Pigmentation",
          "Hair Loss",
          "Anti-Ageing",
          "Hair Restoration",
          "Lasers",
          "Brightening",
          "Other",
        ].map((c) => ({ title: c, value: c })),
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Before / after image",
      type: "image",
      options: { hotspot: true },
      group: "main",
      description:
        "Side-by-side composite is fine. Patient consent must be on file before publishing.",
    }),
    defineField({
      name: "externalImageUrl",
      title: "External image URL (legacy)",
      type: "url",
      group: "main",
      description: "Use the upload above for new entries. This field is supported for the seeded legacy gallery only.",
    }),
    defineField({ name: "weeks", title: "Photographed at (weeks after start)", type: "string", group: "clinical", validation: (r) => r.required() }),
    defineField({ name: "sessions", title: "Sessions / protocol", type: "string", group: "clinical", validation: (r) => r.required() }),
    defineField({ name: "patient", title: "Patient label", type: "string", group: "clinical", description: 'Generic, anonymised label (e.g. "Adult patient").', initialValue: "Adult patient" }),
    defineField({ name: "concern", title: "Specific concern", type: "string", group: "clinical", validation: (r) => r.required() }),
    defineField({
      name: "treatment",
      title: "Related treatment",
      type: "reference",
      to: [{ type: "treatment" }],
      group: "clinical",
      description: "Linking a treatment lets us cross-promote between the gallery and treatment pages.",
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      initialValue: 0,
      group: "main",
    }),
    defineField({
      name: "consentOnFile",
      title: "Patient consent on file",
      type: "boolean",
      initialValue: false,
      group: "main",
      validation: (r) => r.required(),
    }),
  ],
  orderings: [
    { name: "order", title: "Manual order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "name", subtitle: "category", media: "image" } },
});
