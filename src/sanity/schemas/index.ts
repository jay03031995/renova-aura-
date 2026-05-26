import {
  benefitObject,
  credentialObject,
  doctorTreatmentObject,
  faqItemObject,
  footerColumnObject,
  footerLinkObject,
  patientQuoteObject,
  processStepObject,
  seoObject,
  statObject,
  timelineEntryObject,
} from "./objects";
import {
  announcementBarSchema,
  clinicSettingsSchema,
  siteSettingsSchema,
} from "./singletons";
// NOTE: treatment / concern schemas removed in the RenovaAura rebuild —
// replaced by the static `procedures.ts` data file (hair + plastic surgery).
// Add Sanity-backed procedure / hairProcedure schemas later if/when the
// clinic wants to manage procedure content from Studio.
import { doctorSchema } from "./doctor";
import { resultSchema } from "./result";
import {
  eeatPillarSchema,
  homepageFaqSchema,
  redirectSchema,
  testimonialSchema,
  trustItemSchema,
} from "./siteContent";
import { appointmentSchema } from "./appointment";

export const schemaTypes = [
  // Objects
  seoObject,
  processStepObject,
  benefitObject,
  faqItemObject,
  credentialObject,
  timelineEntryObject,
  patientQuoteObject,
  statObject,
  doctorTreatmentObject,
  footerLinkObject,
  footerColumnObject,
  // Singletons
  clinicSettingsSchema,
  siteSettingsSchema,
  announcementBarSchema,
  // Documents
  doctorSchema,
  resultSchema,
  testimonialSchema,
  homepageFaqSchema,
  eeatPillarSchema,
  trustItemSchema,
  redirectSchema,
  appointmentSchema,
];

export const singletonTypes = new Set([
  "clinicSettings",
  "siteSettings",
  "announcementBar",
]);
