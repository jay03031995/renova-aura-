import { defineField, defineType } from "sanity";

export const blogPostSchema = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  groups: [
    { name: "main", title: "Main", default: true },
    { name: "content", title: "Content" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "main",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      group: "main",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      group: "main",
      validation: (rule) => rule.max(180),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "main",
      description: "Posts are excluded from sitemap until this date is set and in the past.",
    }),
    defineField({
      name: "indexable",
      title: "Allow this blog post in search",
      type: "boolean",
      group: "seo",
      initialValue: false,
      description:
        "Safe default is off. Enable only after clinical/editorial review and SEO metadata are complete.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      group: "content",
      of: [{ type: "block" }],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "title", subtitle: "publishedAt" },
  },
});
