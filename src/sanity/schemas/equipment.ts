import { defineField, defineType } from "sanity";

export const equipmentSchema = defineType({
  name: "equipment",
  title: "Laser / Technology",
  type: "document",
  groups: [
    { name: "summary", title: "Summary" },
    { name: "content", title: "Detailed content" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "summary",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "summary",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      group: "summary",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 3,
      group: "summary",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "summary",
      options: {
        list: [
          { title: "Laser", value: "Laser" },
          { title: "Hair", value: "Hair" },
          { title: "Plastic Surgery", value: "Plastic Surgery" },
          { title: "Skin", value: "Skin" },
          { title: "Body", value: "Body" },
          { title: "Diagnostics", value: "Diagnostics" },
          { title: "Other", value: "Other" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      group: "summary",
      initialValue: 0,
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "summary",
      initialValue: false,
    }),
    defineField({
      name: "detailedDescription",
      title: "Detailed Description",
      type: "text",
      rows: 8,
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      group: "seo",
    }),
  ],
  preview: {
    select: {
      title: "name",
      category: "category",
      featured: "featured",
      media: "image",
    },
    prepare({ title, category, featured, media }) {
      return {
        title,
        subtitle: [category, featured ? "Featured" : undefined]
          .filter(Boolean)
          .join(" · "),
        media,
      };
    },
  },
  orderings: [
    {
      title: "Display order",
      name: "displayOrder",
      by: [
        { field: "displayOrder", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
  ],
});
