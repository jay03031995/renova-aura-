import { defineField, defineType } from "sanity";

/**
 * Gallery Image — clinic photos, machine images, procedure images and any
 * other imagery shown in the media Gallery. (Before/after results live in
 * the `realResult` type and are merged into the gallery automatically.)
 */
export const galleryImageSchema = defineType({
  name: "galleryImage",
  title: "Gallery Image",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Hair", value: "Hair" },
          { title: "Skin", value: "Skin" },
          { title: "Plastic Surgery", value: "Plastic Surgery" },
          { title: "Body", value: "Body" },
          { title: "Clinic", value: "Clinic" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description (optional)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "displayOrder",
      by: [{ field: "displayOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "image" },
  },
});
