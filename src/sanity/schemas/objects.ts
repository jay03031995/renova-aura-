import { defineField, defineType } from "sanity";

/** Re-usable SEO block attached to every routable document. */
export const seoObject = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Meta title",
      type: "string",
      description: "55 – 60 characters. Falls back to the document's main title if empty.",
      validation: (r) => r.max(70).warning("Keep under 70 characters."),
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 3,
      description: "150 – 160 characters. Shown in Google search results.",
      validation: (r) => r.max(200).warning("Keep under 200 characters."),
    }),
    defineField({
      name: "ogImage",
      title: "Social share image (Open Graph)",
      type: "image",
      options: { hotspot: true },
      description: "1200×630 recommended. Falls back to the site-wide default if empty.",
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL override",
      type: "url",
      description:
        "Leave empty to use this page's own URL. Set only when canonicalising to another page.",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
      description: "Add a noindex robots tag (page won't appear in Google).",
    }),
  ],
});

export const processStepObject = defineType({
  name: "processStep",
  title: "Process step",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});

export const benefitObject = defineType({
  name: "benefit",
  title: "Benefit",
  type: "object",
  fields: [
    defineField({
      name: "icon",
      title: "Icon glyph",
      type: "string",
      description: "A single unicode glyph (✦ ◐ ❋ ✶ ⟡ ◍).",
      initialValue: "✦",
    }),
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
  ],
  preview: {
    select: { icon: "icon", title: "title", subtitle: "description" },
    prepare: ({ icon, title, subtitle }) => ({ title: `${icon ?? "•"}  ${title}`, subtitle }),
  },
});

export const faqItemObject = defineType({
  name: "faqItem",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({ name: "question", title: "Question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", title: "Answer", type: "text", rows: 4, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "question", subtitle: "answer" } },
});

export const credentialObject = defineType({
  name: "credential",
  title: "Credential",
  type: "object",
  fields: [
    defineField({
      name: "icon",
      title: "Badge text",
      type: "string",
      description: "Short text rendered in the badge (e.g. MD, FUE, ✦).",
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
  ],
  preview: {
    select: { icon: "icon", title: "title" },
    prepare: ({ icon, title }) => ({ title: `[${icon}]  ${title}` }),
  },
});

export const timelineEntryObject = defineType({
  name: "timelineEntry",
  title: "Timeline entry",
  type: "object",
  fields: [
    defineField({ name: "year", title: "Year / label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
  ],
  preview: { select: { title: "title", subtitle: "year" } },
});

export const patientQuoteObject = defineType({
  name: "patientQuote",
  title: "Patient quote",
  type: "object",
  fields: [
    defineField({ name: "quote", title: "Quote", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "name", title: "Patient name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "detail", title: "Treatment / location", type: "string" }),
  ],
  preview: { select: { title: "name", subtitle: "quote" } },
});

export const statObject = defineType({
  name: "statCred",
  title: "Stat credential",
  type: "object",
  fields: [
    defineField({ name: "value", title: "Value", type: "string", validation: (r) => r.required() }),
    defineField({ name: "superscript", title: "Superscript (yrs, +, etc.)", type: "string" }),
    defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
  ],
  preview: {
    select: { value: "value", sup: "superscript", label: "label" },
    prepare: ({ value, sup, label }) => ({ title: `${value}${sup ?? ""}`, subtitle: label }),
  },
});

export const doctorTreatmentObject = defineType({
  name: "doctorTreatment",
  title: "Treatment performed",
  type: "object",
  fields: [
    defineField({ name: "icon", title: "Icon glyph", type: "string", initialValue: "✦" }),
    defineField({ name: "name", title: "Treatment name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "category", title: "Category label", type: "string" }),
  ],
  preview: {
    select: { icon: "icon", title: "name", subtitle: "category" },
    prepare: ({ icon, title, subtitle }) => ({ title: `${icon ?? "•"}  ${title}`, subtitle }),
  },
});

export const footerLinkObject = defineType({
  name: "footerLink",
  title: "Footer link",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "href", title: "URL or path", type: "string", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

export const footerColumnObject = defineType({
  name: "footerColumn",
  title: "Footer column",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Column title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [{ type: "footerLink" }],
    }),
  ],
  preview: { select: { title: "title", links: "links" }, prepare: ({ title, links }) => ({ title, subtitle: `${(links ?? []).length} links` }) },
});
