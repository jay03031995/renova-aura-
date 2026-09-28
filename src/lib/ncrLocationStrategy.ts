import { NCR_AREAS, type NcrArea } from "@/data/locations";
import type { DoctorFetched } from "@/sanity/lib/fetchers";
import type { Procedure } from "@/data/procedures";

export const CLINIC_AREA = "Anand Vihar";

const HAIR_PRIMARY_SLUGS = [
  "fue-hair-transplant",
  "dhi-hair-transplant",
  "female-hair-transplant",
  "hairline-lowering",
  "beard-transplant",
  "eyebrow-transplant",
];

const PLASTIC_PRIORITY_SLUGS = [
  "gynecomastia-surgery",
  "scar-revision",
  "keloid-hypertrophic-scar",
  "liposuction",
  "tummy-tuck",
  "post-burn-contracture",
];

const HIGH_INTENT_AREA_SLUGS = [
  "anand-vihar",
  "rohini",
  "dwarka",
  "lajpat-nagar",
  "saket",
  "sector-18",
  "sector-62",
  "greater-noida",
  "indirapuram",
  "vaishali",
  "sector-29",
  "mg-road",
  "sector-16",
];

const PLASTIC_AREA_SLUGS = [
  "anand-vihar",
  "rohini",
  "noida-extension",
  "sector-18",
  "indirapuram",
  "sector-29",
  "saket",
];

const cityIntent: Record<string, string> = {
  "new-delhi": "Hair transplant clinic in New Delhi",
  noida: "Hair transplant care for patients from Noida",
  ghaziabad: "Hair transplant care for patients from Ghaziabad",
  gurugram: "Hair transplant care for patients from Gurugram",
  faridabad: "Hair transplant care for patients from Faridabad",
};

export function locationPrimaryIntent(area: NcrArea | { area: string; areaSlug: string; citySlug: string }) {
  if (area.areaSlug === "anand-vihar") return "Anand Vihar clinic page";
  return cityIntent[area.citySlug] ?? `Hair transplant clinic serving ${area.area}`;
}

export function generalLocationMeta(area: string) {
  const title =
    area === CLINIC_AREA
      ? "Hair Transplant Clinic in Anand Vihar | RenovaAura"
      : `Hair Transplant Clinic near ${area} | RenovaAura`;
  const description =
    area === CLINIC_AREA
      ? "Meet Dr. Bhawna Bhardwaj for hair transplant, skin and aesthetic care at RenovaAura's Anand Vihar clinic in New Delhi."
      : `Explore hair transplant care with Dr. Bhawna Bhardwaj. Patients from ${area} can book a consultation at our Anand Vihar clinic.`;
  const h1 =
    area === CLINIC_AREA
      ? "Hair Transplant Clinic in Anand Vihar"
      : `Hair Transplant Clinic Serving ${area}`;
  return {
    title,
    description,
    h1,
    support:
      "Meet our hair restoration, plastic surgery and skin specialists at RenovaAura's Anand Vihar clinic.",
  };
}

export function shouldPublishLocationTreatment(areaSlug: string, procedureSlug: string) {
  if (HAIR_PRIMARY_SLUGS.includes(procedureSlug)) {
    return HIGH_INTENT_AREA_SLUGS.includes(areaSlug);
  }
  if (PLASTIC_PRIORITY_SLUGS.includes(procedureSlug)) {
    return PLASTIC_AREA_SLUGS.includes(areaSlug);
  }
  return areaSlug === "anand-vihar";
}

export function indexableLocationTreatmentParams(procedures: Procedure[]) {
  return NCR_AREAS.flatMap((area) =>
    procedures
      .filter((procedure) => shouldPublishLocationTreatment(area.areaSlug, procedure.slug))
      .map((procedure) => ({
        city: area.citySlug,
        area: area.areaSlug,
        treatment: procedure.slug,
      })),
  );
}

export const strategicLocationTreatmentParams = indexableLocationTreatmentParams;

export function approvedDoctorSlugForProcedure(procedure: Pick<Procedure, "pillar">) {
  return procedure.pillar === "plastic-surgery" ? "ankur-bhatia" : "bhawna-bhardwaj";
}

export function isDoctorApprovedForProcedure(procedure: Pick<Procedure, "pillar">, doctorSlug: string) {
  return doctorSlug === approvedDoctorSlugForProcedure(procedure);
}

export function treatmentSpecialist(procedure: Procedure, doctors: DoctorFetched[]) {
  const approvedSlug = approvedDoctorSlugForProcedure(procedure);
  return doctors.find((doctor) => doctor.slug === approvedSlug);
}

export function indexableLocationDoctorParams(procedures: Procedure[], doctors: DoctorFetched[]) {
  return indexableLocationTreatmentParams(procedures).flatMap((param) => {
    const procedure = procedures.find((item) => item.slug === param.treatment);
    if (!procedure) return [];
    const doctor = doctors.find((item) => isDoctorApprovedForProcedure(procedure, item.slug));
    return doctor ? [{ ...param, doctor: doctor.slug }] : [];
  });
}

export function treatmentLocationMeta(procedure: Procedure, area: string) {
  const isClinicArea = area === CLINIC_AREA;
  const prefix = isClinicArea ? "in" : "near";
  const doctor = procedure.pillar === "plastic-surgery" ? "Dr. Ankur Bhatia" : "Dr. Bhawna Bhardwaj";
  const title = `${procedure.name} Near Me ${prefix} ${area} | ${doctor}`;
  const description = isClinicArea
    ? `Searching for ${procedure.name} near me? Consult ${doctor} at RenovaAura's Anand Vihar clinic for a personalised assessment.`
    : `Searching for ${procedure.name} near me around ${area}? Patients from ${area} can consult ${doctor} at RenovaAura's Anand Vihar clinic.`;
  const h1 = isClinicArea
    ? `${procedure.name} in Anand Vihar`
    : `${procedure.name} for Patients from ${area}`;
  return { title, description, h1 };
}

export function doctorTreatmentLocationMeta(procedure: Procedure, doctor: string, area: string, city: string) {
  const title = `${procedure.name} Near Me with ${doctor} | ${area}`;
  const description =
    `Looking for ${doctor} near me for ${procedure.name}? RenovaAura serves patients from ${area}, ${city} at its Anand Vihar clinic.`;
  return { title, description };
}

export function formatBreadcrumb(city: string, area: string, treatment?: string) {
  return ["Home", "Locations", city, area, treatment].filter(Boolean).join(" › ");
}
