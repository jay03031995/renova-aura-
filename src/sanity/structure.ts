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
    .title("RenovaAura Admin")
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
      // Leads — captured from /tools (AI Skin Analysis + Graft Calculator)
      S.listItem()
        .title("🧪 Tool Leads")
        .child(
          S.list()
            .title("Leads")
            .items([
              S.listItem()
                .title("🟠 New leads")
                .child(
                  S.documentTypeList("lead")
                    .title("New leads")
                    .filter('_type == "lead" && status == "new"')
                    .defaultOrdering([
                      { field: "submittedAt", direction: "desc" },
                    ]),
                ),
              S.listItem()
                .title("📞 Contacted")
                .child(
                  S.documentTypeList("lead")
                    .title("Contacted")
                    .filter('_type == "lead" && status == "contacted"')
                    .defaultOrdering([
                      { field: "submittedAt", direction: "desc" },
                    ]),
                ),
              S.divider(),
              S.listItem()
                .title("Skin Analysis leads")
                .child(
                  S.documentTypeList("lead")
                    .title("Skin Analysis leads")
                    .filter('_type == "lead" && tool == "skin-analysis"')
                    .defaultOrdering([
                      { field: "submittedAt", direction: "desc" },
                    ]),
                ),
              S.listItem()
                .title("Graft Calculator leads")
                .child(
                  S.documentTypeList("lead")
                    .title("Graft Calculator leads")
                    .filter('_type == "lead" && tool == "graft-calculator"')
                    .defaultOrdering([
                      { field: "submittedAt", direction: "desc" },
                    ]),
                ),
              S.divider(),
              S.listItem()
                .title("All leads")
                .child(
                  S.documentTypeList("lead")
                    .title("All leads")
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
      // Homepage hero carousel
      S.documentTypeListItem("heroSlide").title("🖼️ Hero slides"),
      S.divider(),
      // Procedures pillar — hair transplant + plastic surgery
      S.listItem()
        .title("💆 Procedures")
        .child(
          S.list()
            .title("Procedures")
            .items([
              S.listItem()
                .title("Hair Transplant (11)")
                .child(
                  S.documentTypeList("procedure")
                    .title("Hair Transplant")
                    .filter('_type == "procedure" && pillar == "hair-transplant"')
                    .defaultOrdering([
                      { field: "order", direction: "asc" },
                      { field: "name", direction: "asc" },
                    ]),
                ),
              S.listItem()
                .title("Plastic Surgery (10)")
                .child(
                  S.documentTypeList("procedure")
                    .title("Plastic Surgery")
                    .filter('_type == "procedure" && pillar == "plastic-surgery"')
                    .defaultOrdering([
                      { field: "order", direction: "asc" },
                      { field: "name", direction: "asc" },
                    ]),
                ),
              S.divider(),
              S.listItem()
                .title("All procedures")
                .child(
                  S.documentTypeList("procedure")
                    .title("All procedures")
                    .defaultOrdering([
                      { field: "pillar", direction: "asc" },
                      { field: "order", direction: "asc" },
                    ]),
                ),
            ]),
        ),
      S.documentTypeListItem("concern").title("🩹 Skin Concerns"),
      S.documentTypeListItem("package").title("📦 Treatment Packages"),
      S.documentTypeListItem("doctor").title("Doctors"),
      S.documentTypeListItem("result").title("Patient results"),
      S.divider(),
      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.documentTypeListItem("homepageFaq").title("Homepage FAQs"),
      S.documentTypeListItem("eeatPillar").title("EEAT pillars"),
      S.documentTypeListItem("trustItem").title("Trust strip items"),
      S.divider(),
      S.documentTypeListItem("location").title("📍 NCR Locations"),
      S.documentTypeListItem("redirect").title("URL redirects"),
    ]);
