import { defineField, defineType } from "sanity";

/**
 * Video — treatment videos, machine demos, walkthroughs, testimonials.
 * Shown on treatment pages (via the `treatments` reference) and in the
 * media Gallery. Source can be an uploaded file, a YouTube URL, or a
 * Vimeo URL.
 */
export const videoSchema = defineType({
  name: "video",
  title: "Video",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Video title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "sourceType",
      title: "Video source",
      type: "string",
      options: {
        list: [
          { title: "YouTube URL", value: "youtube" },
          { title: "Vimeo URL", value: "vimeo" },
          { title: "Uploaded file", value: "upload" },
        ],
        layout: "radio",
      },
      initialValue: "youtube",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube URL",
      type: "url",
      hidden: ({ parent }) => parent?.sourceType !== "youtube",
    }),
    defineField({
      name: "vimeoUrl",
      title: "Vimeo URL",
      type: "url",
      hidden: ({ parent }) => parent?.sourceType !== "vimeo",
    }),
    defineField({
      name: "videoFile",
      title: "Video file",
      type: "file",
      options: { accept: "video/*" },
      hidden: ({ parent }) => parent?.sourceType !== "upload",
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail (optional)",
      type: "image",
      options: { hotspot: true },
      description:
        "Optional. YouTube/Vimeo thumbnails are used automatically when left empty.",
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
      name: "treatments",
      title: "Show on these treatment pages",
      type: "array",
      of: [
        {
          type: "reference",
          to: [
            { type: "procedure" },
            { type: "concern" },
            { type: "bodyConcern" },
          ],
        },
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured in gallery",
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
    select: { title: "title", subtitle: "category", media: "thumbnail" },
  },
});
