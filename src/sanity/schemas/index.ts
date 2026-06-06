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
import { doctorSchema } from "./doctor";
import { heroSlideSchema } from "./heroSlide";
import { packageSchema } from "./package";
import { resultSchema } from "./result";
import { procedureSchema } from "./procedure";
import { concernSchema } from "./concern";
import {
  eeatPillarSchema,
  homepageFaqSchema,
  redirectSchema,
  testimonialSchema,
  trustItemSchema,
} from "./siteContent";
import { appointmentSchema } from "./appointment";
import { leadSchema } from "./lead";
import { locationSchema } from "./location";

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
  heroSlideSchema,
  packageSchema,
  procedureSchema,
  concernSchema,
  doctorSchema,
  resultSchema,
  testimonialSchema,
  homepageFaqSchema,
  eeatPillarSchema,
  trustItemSchema,
  locationSchema,
  redirectSchema,
  appointmentSchema,
  leadSchema,
];

export const singletonTypes = new Set([
  "clinicSettings",
  "siteSettings",
  "announcementBar",
]);
