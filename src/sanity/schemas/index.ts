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
  whyUsSectionSchema,
} from "./singletons";
import { doctorSchema } from "./doctor";
import { heroSlideSchema } from "./heroSlide";
import { packageSchema } from "./package";
import { resultSchema } from "./result";
import { procedureSchema } from "./procedure";
import { concernSchema } from "./concern";
import { bodyConcernSchema } from "./bodyConcern";
import { equipmentSchema } from "./equipment";
import { realResultSchema } from "./realResult";
import { videoSchema } from "./video";
import { galleryImageSchema } from "./galleryImage";
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
import { pageMetricSchema } from "./pageMetric";

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
  whyUsSectionSchema,
  // Documents
  heroSlideSchema,
  packageSchema,
  procedureSchema,
  concernSchema,
  bodyConcernSchema,
  equipmentSchema,
  doctorSchema,
  resultSchema,
  realResultSchema,
  videoSchema,
  galleryImageSchema,
  testimonialSchema,
  homepageFaqSchema,
  eeatPillarSchema,
  trustItemSchema,
  locationSchema,
  redirectSchema,
  appointmentSchema,
  leadSchema,
  pageMetricSchema,
];

export const singletonTypes = new Set([
  "clinicSettings",
  "siteSettings",
  "announcementBar",
  "whyUsSection",
]);
