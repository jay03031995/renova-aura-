import { defineType, defineField } from "sanity";

/**
 * Lead document — captures submissions from the two interactive tools:
 *  - AI Skin Analysis (skinAnalysis tool)
 *  - Hair Graft Calculator (graftCalculator tool)
 *
 * Created by the POST /api/leads route (server-side, editor token).
 * Editable in Studio so clinic staff can update status, add internal
 * notes, and route the lead into the booking pipeline.
 */
export const leadSchema = defineType({
  name: "lead",
  title: "Lead",
  type: "document",
  fields: [
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "new",
      options: {
        list: [
          { title: "🟠 New — needs follow-up", value: "new" },
          { title: "📞 Contacted", value: "contacted" },
          { title: "📅 Booked consultation", value: "booked" },
          { title: "✓ Converted to patient", value: "converted" },
          { title: "✗ Closed — not interested", value: "closed" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tool",
      title: "Tool used",
      type: "string",
      options: {
        list: [
          { title: "AI Skin Analysis", value: "skin-analysis" },
          { title: "Hair Graft Calculator", value: "graft-calculator" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "ageRange",
      title: "Age range",
      type: "string",
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
    }),
    defineField({
      name: "summary",
      title: "Result summary",
      type: "text",
      rows: 3,
      description: "Headline output the patient saw (e.g. ~2,400 grafts).",
    }),
    defineField({
      name: "inputs",
      title: "Tool inputs (JSON)",
      type: "text",
      rows: 6,
      readOnly: true,
      description: "Raw inputs from the tool form — JSON.",
    }),
    defineField({
      name: "outputs",
      title: "Tool outputs (JSON)",
      type: "text",
      rows: 6,
      readOnly: true,
      description: "Computed result, recommendations, scores — JSON.",
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "source",
      title: "Source URL / surface",
      type: "string",
      readOnly: true,
      description: "Page or surface where the tool was filled.",
    }),
    defineField({
      name: "notes",
      title: "Internal notes",
      type: "text",
      rows: 4,
      description: "Staff-only — not visible to the patient.",
    }),
  ],
  preview: {
    select: {
      name: "name",
      tool: "tool",
      status: "status",
      summary: "summary",
      phone: "phone",
    },
    prepare({ name, tool, status, summary, phone }) {
      const statusLabel: Record<string, string> = {
        new: "🟠 New",
        contacted: "📞 Contacted",
        booked: "📅 Booked",
        converted: "✓ Converted",
        closed: "✗ Closed",
      };
      const toolLabel =
        tool === "skin-analysis" ? "Skin Analysis" : "Graft Calculator";
      return {
        title: `${statusLabel[status] ?? status} — ${name ?? "Unnamed"}`,
        subtitle: [toolLabel, phone, summary].filter(Boolean).join(" · "),
      };
    },
  },
  orderings: [
    {
      title: "Submitted (newest first)",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
});
