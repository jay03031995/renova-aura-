import { defineType, defineField } from "sanity";

/**
 * One appointment request submitted through the website booking modal.
 * Created by the public POST /api/bookings route (server-side, with the
 * editor token). Editable in Studio so clinic staff can update status,
 * add internal notes, etc.
 */
export const appointmentSchema = defineType({
  name: "appointment",
  title: "Appointment",
  type: "document",
  fields: [
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "new",
      options: {
        list: [
          { title: "New — needs follow-up", value: "new" },
          { title: "Contacted (WhatsApp / phone)", value: "contacted" },
          { title: "Confirmed", value: "confirmed" },
          { title: "Completed", value: "completed" },
          { title: "Cancelled by patient", value: "cancelled" },
          { title: "No-show", value: "noShow" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "name",
      title: "Patient name",
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
      name: "concern",
      title: "Primary concern",
      type: "string",
    }),
    defineField({
      name: "preferredClinic",
      title: "Preferred clinic",
      type: "string",
    }),
    defineField({
      name: "preferredDate",
      title: "Preferred date",
      type: "date",
      options: { dateFormat: "ddd, DD MMM YYYY" },
    }),
    defineField({
      name: "preferredTime",
      title: "Preferred time",
      type: "string",
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      readOnly: true,
      description:
        "Where the request came from (e.g. website-booking-modal, homepage-simple).",
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
      concern: "concern",
      status: "status",
      date: "preferredDate",
      time: "preferredTime",
      phone: "phone",
    },
    prepare({ name, concern, status, date, time, phone }) {
      const statusLabel: Record<string, string> = {
        new: "🟠 New",
        contacted: "📞 Contacted",
        confirmed: "✅ Confirmed",
        completed: "✓ Completed",
        cancelled: "✗ Cancelled",
        noShow: "⚠ No-show",
      };
      return {
        title: `${statusLabel[status] ?? status} — ${name ?? "Unnamed"}`,
        subtitle: [
          phone,
          concern,
          date && time ? `${date} · ${time}` : date || time,
        ]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
  orderings: [
    {
      title: "Submitted (newest first)",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
    {
      title: "Preferred date (soonest first)",
      name: "preferredDateAsc",
      by: [{ field: "preferredDate", direction: "asc" }],
    },
  ],
});
