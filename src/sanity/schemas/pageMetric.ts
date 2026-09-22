import { defineField, defineType } from "sanity";

export const pageMetricSchema = defineType({
  name: "pageMetric", title: "Page metric", type: "document",
  fields: [
    defineField({ name: "date", title: "Date", type: "date" }),
    defineField({ name: "area", title: "Area", type: "string" }),
    defineField({ name: "city", title: "City", type: "string" }),
    defineField({ name: "path", title: "Landing page", type: "string" }),
    ...["impressions","appointmentStarts","appointmentSubmissions","callClicks","whatsappClicks","directionsClicks","ctaClicks"].map((name) => defineField({ name, title: name.replace(/([A-Z])/g, " $1"), type: "number", initialValue: 0 })),
  ],
  preview: { select: { title: "area", date: "date", impressions: "impressions" }, prepare: ({ title, date, impressions }) => ({ title: `${title} · ${date}`, subtitle: `${impressions || 0} impressions` }) },
});
