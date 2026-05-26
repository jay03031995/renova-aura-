/**
 * High-level data fetchers used by page components.
 *
 * Each function tries Sanity first when the project is configured, and
 * falls back to the local TypeScript data files when Sanity is missing
 * or empty.
 *
 * RenovaAura: treatment/concern fetchers from the dermaheal era are
 * removed — procedures are served from the static `procedures.ts`
 * data file directly (see /procedures routes).
 */

import { client, sanityEnabled } from "./client";
import {
  announcementQuery,
  clinicSettingsQuery,
  doctorBySlugQuery,
  doctorSlugsQuery,
  doctorsQuery,
  eeatPillarsQuery,
  homepageFaqsQuery,
  resultsQuery,
  siteSettingsQuery,
  testimonialsQuery,
  trustItemsQuery,
} from "./queries";

// ----- Local fallbacks ------------------------------------------------------

import { CLINIC as LOCAL_CLINIC } from "@/data/clinic";
import {
  DOCTORS as LOCAL_DOCTORS,
  DOCTOR_SLUGS as LOCAL_DOCTOR_SLUGS,
  type Doctor,
} from "@/data/doctors";
import {
  EEAT as LOCAL_EEAT,
  FAQS as LOCAL_FAQS,
  RESULTS as LOCAL_RESULTS,
  TESTIMONIALS as LOCAL_TESTIMONIALS,
  TRUST_ITEMS as LOCAL_TRUST_ITEMS,
  type Result,
} from "@/data/site";

// ----- Shared helpers -------------------------------------------------------

function isFilled<T>(v: T | null | undefined): v is T {
  if (v == null) return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "string") return v.length > 0;
  return true;
}

async function safeFetch<T>(query: string, params?: Record<string, unknown>) {
  if (!sanityEnabled) return null;
  try {
    return await client.fetch<T>(query, params ?? {}, {
      next: { tags: ["sanity"], revalidate: 60 },
    });
  } catch (e) {
    console.warn("[sanity] fetch failed, falling back to local data:", e);
    return null;
  }
}

// ----- Doctors --------------------------------------------------------------

type SanityDoctor = {
  _id: string;
  name: string;
  slug: string;
  title: string;
  imageVariant?: string;
  years?: number;
  focusLine?: string;
  homeBio?: string;
  portrait?: { url?: string };
  shortLine?: string;
  listBio?: string;
  statCreds?: { value: string; superscript?: string; label: string }[];
  listExpertise?: string[];
  tagline?: string;
  detailBio?: string;
  credentials?: { icon: string; title: string; description?: string }[];
  timeline?: { year: string; title: string; description?: string }[];
  expertise?: string[];
  treatments?: { icon?: string; name: string; category?: string }[];
  quotes?: { quote: string; name: string; detail?: string }[];
};

export type DoctorFetched = Doctor & { imageUrl?: string };

function mapDoctor(d: SanityDoctor): DoctorFetched {
  return {
    slug: d.slug,
    name: d.name,
    title: d.title,
    img: d.imageVariant ?? "d1",
    focus: d.focusLine ?? "",
    years: d.years ?? 0,
    homeBio: d.homeBio ?? "",
    short: d.shortLine ?? "",
    listBio: d.listBio ?? "",
    statCreds: (d.statCreds ?? []).map((s) => ({ n: s.value, sup: s.superscript, l: s.label })),
    listExpertise: d.listExpertise ?? [],
    tagline: d.tagline ?? "",
    detailBio: d.detailBio ?? "",
    credentials: (d.credentials ?? []).map((c) => ({ i: c.icon, t: c.title, d: c.description ?? "" })),
    timeline: (d.timeline ?? []).map((t) => ({ y: t.year, t: t.title, d: t.description })),
    expertise: d.expertise ?? [],
    treatments: (d.treatments ?? []).map((t) => ({ i: t.icon ?? "✦", n: t.name, c: t.category ?? "" })),
    quotes: (d.quotes ?? []).map((q) => ({ q: q.quote, n: q.name, d: q.detail ?? "" })),
    imageUrl: d.portrait?.url,
  };
}

export async function getDoctors(): Promise<DoctorFetched[]> {
  const docs = await safeFetch<SanityDoctor[]>(doctorsQuery);
  if (!isFilled(docs)) return LOCAL_DOCTORS;
  return docs.map(mapDoctor);
}

export async function getDoctorSlugs(): Promise<string[]> {
  const slugs = await safeFetch<string[]>(doctorSlugsQuery);
  if (isFilled(slugs)) return slugs;
  return LOCAL_DOCTOR_SLUGS;
}

export async function getDoctorBySlug(slug: string): Promise<DoctorFetched | undefined> {
  const doc = await safeFetch<SanityDoctor | null>(doctorBySlugQuery, { slug });
  if (doc) return mapDoctor(doc);
  return LOCAL_DOCTORS.find((d) => d.slug === slug);
}

// ----- Results --------------------------------------------------------------

export type ResultFetched = Result & { imageUrl?: string };

export async function getResults(): Promise<ResultFetched[]> {
  const docs = await safeFetch<
    {
      _id: string;
      name: string;
      category: string;
      weeks: string;
      sessions: string;
      patient: string;
      concern: string;
      externalImageUrl?: string;
      image?: { url?: string };
    }[]
  >(resultsQuery);
  if (!isFilled(docs)) return LOCAL_RESULTS;
  return docs.map((d) => ({
    id: d._id,
    name: d.name,
    cat: d.category,
    weeks: d.weeks,
    sessions: d.sessions,
    patient: d.patient,
    concern: d.concern,
    img: d.image?.url || d.externalImageUrl || "",
    imageUrl: d.image?.url || d.externalImageUrl,
  }));
}

// ----- Site singletons ------------------------------------------------------

export type ClinicData = typeof LOCAL_CLINIC & { logoUrl?: string };

export async function getClinic(): Promise<ClinicData> {
  const doc = await safeFetch<{
    name?: string;
    tagline?: string;
    address?: string;
    hours?: string;
    phone?: string;
    phone2?: string;
    email?: string;
    shopUrl?: string;
    instagramUrl?: string;
    youtubeUrl?: string;
    linkedinUrl?: string;
    logo?: { url?: string };
  } | null>(clinicSettingsQuery);
  if (!doc) return LOCAL_CLINIC;
  return {
    ...LOCAL_CLINIC,
    name: doc.name ?? LOCAL_CLINIC.name,
    tagline: doc.tagline ?? LOCAL_CLINIC.tagline,
    address: doc.address ?? LOCAL_CLINIC.address,
    hours: doc.hours ?? LOCAL_CLINIC.hours,
    phone: doc.phone ?? LOCAL_CLINIC.phone,
    phone2: doc.phone2 ?? LOCAL_CLINIC.phone2,
    email: doc.email ?? LOCAL_CLINIC.email,
    shopUrl: doc.shopUrl ?? LOCAL_CLINIC.shopUrl,
    social: {
      instagram: doc.instagramUrl ?? LOCAL_CLINIC.social.instagram,
      youtube: doc.youtubeUrl ?? LOCAL_CLINIC.social.youtube,
      linkedin: doc.linkedinUrl ?? LOCAL_CLINIC.social.linkedin,
    },
    logoUrl: doc.logo?.url,
  };
}

export type AnnouncementData = {
  enabled: boolean;
  message: string;
  linkLabel?: string;
  linkUrl?: string;
};

export async function getAnnouncement(): Promise<AnnouncementData> {
  const doc = await safeFetch<AnnouncementData | null>(announcementQuery);
  if (doc && typeof doc.message === "string") return doc;
  return {
    enabled: true,
    message: "BOOK A CONSULTATION WITH A BOARD-CERTIFIED SURGEON",
    linkLabel: "Book this week →",
    linkUrl: "/#book",
  };
}

export type SiteSettingsData = {
  siteUrl?: string;
  defaultMetaTitle?: string;
  titleTemplate?: string;
  defaultMetaDescription?: string;
  defaultOgImageUrl?: string;
};

export async function getSiteSettings(): Promise<SiteSettingsData> {
  const doc = await safeFetch<{
    siteUrl?: string;
    defaultMetaTitle?: string;
    titleTemplate?: string;
    defaultMetaDescription?: string;
    defaultOgImage?: { url?: string };
  } | null>(siteSettingsQuery);
  if (!doc) return {};
  return {
    siteUrl: doc.siteUrl,
    defaultMetaTitle: doc.defaultMetaTitle,
    titleTemplate: doc.titleTemplate,
    defaultMetaDescription: doc.defaultMetaDescription,
    defaultOgImageUrl: doc.defaultOgImage?.url,
  };
}

// ----- Homepage strings -----------------------------------------------------

export async function getTestimonials() {
  const docs = await safeFetch<{ quote: string; name: string; detail?: string }[]>(testimonialsQuery);
  if (!isFilled(docs)) return LOCAL_TESTIMONIALS;
  return docs.map((d) => ({ q: d.quote, name: d.name, detail: d.detail ?? "" }));
}

export async function getHomepageFaqs() {
  const docs = await safeFetch<{ question: string; answer: string }[]>(homepageFaqsQuery);
  if (!isFilled(docs)) return LOCAL_FAQS;
  return docs.map((d) => ({ q: d.question, a: d.answer }));
}

export async function getEeatPillars() {
  const docs = await safeFetch<{ letter: string; title: string; description: string }[]>(eeatPillarsQuery);
  if (!isFilled(docs)) return LOCAL_EEAT;
  return docs.map((d) => ({ letter: d.letter, title: d.title, desc: d.description }));
}

export async function getTrustItems(): Promise<{ icon: string; text: string }[]> {
  const docs = await safeFetch<{ icon: string; text: string }[]>(trustItemsQuery);
  if (!isFilled(docs)) return LOCAL_TRUST_ITEMS;
  return docs;
}
