import type { StructureBuilder } from "sanity/structure";
import { singletonTypes } from "./schemas";
import AppointmentsDashboard from "./dashboard/AppointmentsDashboard";

const SINGLETON_LABELS: Record<string, string> = {
  clinicSettings: "Clinic settings",
  siteSettings: "Site settings & SEO",
  announcementBar: "Announcement bar",
};

/**
 * Studio sidebar structure — singletons appear as a single document each
 * (not a list of one), and content collections are grouped logically.
 */
export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Dermaheal Admin")
    .items([
      // Dashboard — landing view with live counters for clinic staff.
      S.listItem()
        .title("📊 Dashboard")
        .id("appointmentsDashboard")
        .icon(() => "📊")
        .child(
          S.component(AppointmentsDashboard)
            .id("appointmentsDashboard")
            .title("Appointments Dashboard"),
        ),
      S.divider(),
      // Appointments — pinned at top so staff see new bookings first.
      S.listItem()
        .title("📅 Appointments")
        .child(
          S.list()
            .title("Appointments")
            .items([
              S.listItem()
                .title("🟠 Needs follow-up (new)")
                .child(
                  S.documentTypeList("appointment")
                    .title("New — needs follow-up")
                    .filter('_type == "appointment" && status == "new"')
                    .defaultOrdering([
                      { field: "submittedAt", direction: "desc" },
                    ]),
                ),
              S.listItem()
                .title("📞 Contacted")
                .child(
                  S.documentTypeList("appointment")
                    .title("Contacted")
                    .filter('_type == "appointment" && status == "contacted"')
                    .defaultOrdering([
                      { field: "submittedAt", direction: "desc" },
                    ]),
                ),
              S.listItem()
                .title("✅ Confirmed")
                .child(
                  S.documentTypeList("appointment")
                    .title("Confirmed")
                    .filter('_type == "appointment" && status == "confirmed"')
                    .defaultOrdering([
                      { field: "preferredDate", direction: "asc" },
                    ]),
                ),
              S.divider(),
              S.listItem()
                .title("All appointments")
                .child(
                  S.documentTypeList("appointment")
                    .title("All appointments")
                    .defaultOrdering([
                      { field: "submittedAt", direction: "desc" },
                    ]),
                ),
            ]),
        ),
      S.divider(),
      // Singletons
      ...Array.from(singletonTypes).map((type) =>
        S.listItem()
          .title(SINGLETON_LABELS[type] ?? type)
          .id(type)
          .child(S.document().schemaType(type).documentId(type)),
      ),
      S.divider(),
      // Collections — RenovaAura: hair/plastic procedures are static data
      // (see src/data/procedures.ts), so only doctor/result content lives
      // in Sanity for now.
      S.documentTypeListItem("doctor").title("Doctors"),
      S.documentTypeListItem("result").title("Patient results"),
      S.divider(),
      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.documentTypeListItem("homepageFaq").title("Homepage FAQs"),
      S.documentTypeListItem("eeatPillar").title("EEAT pillars"),
      S.documentTypeListItem("trustItem").title("Trust strip items"),
      S.divider(),
      S.documentTypeListItem("redirect").title("URL redirects"),
    ]);
