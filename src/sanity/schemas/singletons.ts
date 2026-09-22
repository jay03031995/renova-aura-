import { defineField, defineType } from "sanity";

export const clinicSettingsSchema = defineType({
  name: "clinicSettings",
  title: "Clinic settings",
  type: "document",
  groups: [
    { name: "primary", title: "Clinic", default: true },
    { name: "contact", title: "Contact" },
    { name: "social", title: "Social" },
  ],
  fields: [
    defineField({ name: "name", title: "Clinic name", type: "string", group: "primary", validation: (r) => r.required() }),
    defineField({ name: "tagline", title: "Tagline", type: "string", group: "primary" }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      group: "primary",
    }),
    defineField({ name: "address", title: "Address", type: "text", rows: 2, group: "contact" }),
    defineField({ name: "hours", title: "Opening hours (display)", type: "string", group: "contact" }),
    defineField({ name: "phone", title: "Primary phone", type: "string", group: "contact" }),
    defineField({ name: "phone2", title: "Secondary phone", type: "string", group: "contact" }),
    defineField({ name: "email", title: "Email", type: "string", group: "contact" }),
    defineField({ name: "googleMapsEmbedUrl", title: "Google Maps embed URL", type: "url", group: "contact" }),
    defineField({ name: "googleMapsLinkUrl", title: "Google Maps link URL", type: "url", group: "contact" }),
    defineField({ name: "shopUrl", title: "Shop URL", type: "url", group: "social" }),
    defineField({ name: "instagramUrl", title: "Instagram URL", type: "url", group: "social" }),
    defineField({ name: "youtubeUrl", title: "YouTube URL", type: "url", group: "social" }),
    defineField({ name: "linkedinUrl", title: "LinkedIn URL", type: "url", group: "social" }),
  ],
  preview: { prepare: () => ({ title: "Clinic settings" }) },
});

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site settings & SEO defaults",
  type: "document",
  groups: [
    { name: "seo", title: "SEO defaults", default: true },
    { name: "footer", title: "Footer" },
    { name: "homepage", title: "Homepage strings" },
  ],
  fields: [
    defineField({ name: "siteUrl", title: "Site URL", type: "url", group: "seo", description: "Used as base URL for canonicals, sitemap and metadataBase." }),
    defineField({ name: "canonicalUrl", title: "Canonical URL", type: "url", group: "seo", description: "Default canonical URL for the website homepage." }),
    defineField({ name: "defaultSeoTitle", title: "Default SEO title", type: "string", group: "seo" }),
    defineField({ name: "defaultSeoDescription", title: "Default SEO description", type: "text", rows: 3, group: "seo" }),
    defineField({ name: "defaultMetaTitle", title: "Default meta title (legacy)", type: "string", group: "seo", hidden: true }),
    defineField({ name: "titleTemplate", title: "Title template", type: "string", group: "seo", description: "Use %s as placeholder, e.g. '%s — RenovaAura'." }),
    defineField({ name: "defaultMetaDescription", title: "Default meta description (legacy)", type: "text", rows: 3, group: "seo", hidden: true }),
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
      options: { hotspot: true },
      group: "seo",
      description: "Square browser icon. PNG or SVG source recommended.",
    }),
    defineField({
      name: "openGraphImage",
      title: "Open Graph image",
      type: "image",
      options: { hotspot: true },
      group: "seo",
      description: "1200x630 recommended for Facebook, LinkedIn and rich previews.",
    }),
    defineField({
      name: "twitterImage",
      title: "Twitter/X image",
      type: "image",
      options: { hotspot: true },
      group: "seo",
      description: "1200x630 recommended for X/Twitter summary cards.",
    }),
    defineField({
      name: "defaultOgImage",
      title: "Default social share image (legacy)",
      type: "image",
      options: { hotspot: true },
      group: "seo",
      hidden: true,
      description: "1200×630 recommended. Used when a page has no specific OG image.",
    }),
    defineField({
      name: "footerColumns",
      title: "Footer columns",
      type: "array",
      of: [{ type: "footerColumn" }],
      group: "footer",
    }),
    defineField({
      name: "footerBottomNote",
      title: "Footer bottom note",
      type: "string",
      group: "footer",
      description: "Default: © 2026 …. Falls back to copyright string if empty.",
    }),
    defineField({
      name: "featuredSocial",
      title: "Featured social icon in footer",
      type: "string",
      group: "footer",
      description: "Which single social icon to show in the footer brand block. Instagram is the default.",
      options: {
        list: [
          { title: "Instagram", value: "instagram" },
          { title: "YouTube",   value: "youtube" },
          { title: "LinkedIn",  value: "linkedin" },
          { title: "WhatsApp",  value: "whatsapp" },
        ],
        layout: "radio",
      },
      initialValue: "instagram",
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero headline (HTML allowed)",
      type: "text",
      rows: 4,
      group: "homepage",
      description: "Use <em>…</em> for the italicised highlight words.",
    }),
    defineField({ name: "heroSubhead", title: "Hero sub-headline", type: "text", rows: 3, group: "homepage" }),
    defineField({ name: "heroEyebrow", title: "Hero eyebrow", type: "string", group: "homepage" }),
  ],
  preview: { prepare: () => ({ title: "Site settings & SEO" }) },
});

export const announcementBarSchema = defineType({
  name: "announcementBar",
  title: "Announcement bar",
  type: "document",
  fields: [
    defineField({
      name: "enabled",
      title: "Show announcement bar",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "linkLabel", title: "Link label", type: "string" }),
    defineField({ name: "linkUrl", title: "Link URL or path", type: "string" }),
  ],
  preview: {
    select: { title: "message", enabled: "enabled" },
    prepare: ({ title, enabled }) => ({
      title: title ?? "Announcement bar",
      subtitle: enabled ? "Live" : "Hidden",
    }),
  },
});

export const whyUsSectionSchema = defineType({
  name: "whyUsSection",
  title: "Why Us section",
  type: "document",
  fields: [
    defineField({
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: { hotspot: true },
      description: "Large left-side image in the homepage Why Us section.",
    }),
    defineField({
      name: "mainImageAlt",
      title: "Main image alt text",
      type: "string",
      initialValue: "Procedure room at RenovaAura Anand Vihar Clinic",
    }),
    defineField({
      name: "supportingImage",
      title: "Supporting image",
      type: "image",
      options: { hotspot: true },
      description: "Smaller overlapping image in the homepage Why Us section.",
    }),
    defineField({
      name: "supportingImageAlt",
      title: "Supporting image alt text",
      type: "string",
      initialValue: "RenovaAura clinic detail",
    }),
  ],
  preview: { prepare: () => ({ title: "Why Us section" }) },
});
