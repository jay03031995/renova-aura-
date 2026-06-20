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

import { cache } from "react";
import { client, sanityEnabled } from "./client";
import {
  announcementQuery,
  clinicSettingsQuery,
  concernBySlugQuery,
  concernSlugsQuery,
  concernsQuery,
  doctorBySlugQuery,
  doctorSlugsQuery,
  doctorsQuery,
  eeatPillarsQuery,
  heroSlidesQuery,
  homepageFaqsQuery,
  packagesQuery,
  procedureBySlugQuery,
  procedureSlugsQuery,
  proceduresByPillarQuery,
  proceduresQuery,
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
import {
  PROCEDURES as LOCAL_PROCEDURES,
  PROCEDURE_SLUGS as LOCAL_PROCEDURE_SLUGS,
  HAIR_PROCEDURES as LOCAL_HAIR_PROCEDURES,
  PLASTIC_PROCEDURES as LOCAL_PLASTIC_PROCEDURES,
  type Procedure,
  type ProcedurePillar,
} from "@/data/procedures";
import {
  CONCERNS as LOCAL_CONCERNS,
  CONCERN_SLUGS as LOCAL_CONCERN_SLUGS,
  type Concern,
} from "@/data/concerns";
import {
  PACKAGES as LOCAL_PACKAGES,
  type TreatmentPackage,
} from "@/data/packages";

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
    // No caching — every fetch goes straight to Sanity so published edits
    // are live immediately. The (site) layout is also force-dynamic; this
    // also covers fetches outside it (metadata, sitemap, redirects).
    return await client.fetch<T>(query, params ?? {}, {
      cache: "no-store",
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
  specialty?: string;
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
    specialty: d.specialty ?? "",
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

/**
 * Surface the local `photo` path as `imageUrl` so the bgImg() helper in
 * the doctor components picks it up automatically. Sanity-uploaded
 * portraits override this once the project is connected.
 */
function withLocalPhoto(d: Doctor): DoctorFetched {
  return { ...d, imageUrl: d.photo };
}

export async function getDoctors(): Promise<DoctorFetched[]> {
  const docs = await safeFetch<SanityDoctor[]>(doctorsQuery);
  if (!isFilled(docs)) return LOCAL_DOCTORS.map(withLocalPhoto);
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
  const local = LOCAL_DOCTORS.find((d) => d.slug === slug);
  return local ? withLocalPhoto(local) : undefined;
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

export const getClinic = cache(async (): Promise<ClinicData> => {
  const doc = await safeFetch<{
    name?: string;
    tagline?: string;
    address?: string;
    hours?: string;
    phone?: string;
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
    email: doc.email ?? LOCAL_CLINIC.email,
    shopUrl: doc.shopUrl ?? LOCAL_CLINIC.shopUrl,
    social: {
      instagram: doc.instagramUrl ?? LOCAL_CLINIC.social.instagram,
      youtube: doc.youtubeUrl ?? LOCAL_CLINIC.social.youtube,
      linkedin: doc.linkedinUrl ?? LOCAL_CLINIC.social.linkedin,
    },
    logoUrl: doc.logo?.url,
  };
});

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
  featuredSocial?: string;
};

export async function getSiteSettings(): Promise<SiteSettingsData> {
  const doc = await safeFetch<{
    siteUrl?: string;
    defaultMetaTitle?: string;
    titleTemplate?: string;
    defaultMetaDescription?: string;
    defaultOgImage?: { url?: string };
    featuredSocial?: string;
  } | null>(siteSettingsQuery);
  if (!doc) return {};
  return {
    siteUrl: doc.siteUrl,
    defaultMetaTitle: doc.defaultMetaTitle,
    titleTemplate: doc.titleTemplate,
    defaultMetaDescription: doc.defaultMetaDescription,
    defaultOgImageUrl: doc.defaultOgImage?.url,
    featuredSocial: doc.featuredSocial,
  };
}

// ----- Treatment packages ---------------------------------------------------

/** All enabled packages, ordered. Falls back to local data when Sanity empty. */
export async function getPackages(): Promise<TreatmentPackage[]> {
  const docs = await safeFetch<
    {
      slug: string;
      name: string;
      category: string;
      includes?: string;
      price?: string;
      concernSlug?: string;
      order?: number;
    }[]
  >(packagesQuery);
  if (!isFilled(docs)) return LOCAL_PACKAGES;
  return docs.map((d) => ({
    slug: d.slug,
    name: d.name,
    category: d.category as TreatmentPackage["category"],
    includes: d.includes ?? "",
    price: d.price,
    concernSlug: d.concernSlug || undefined,
    order: d.order ?? 0,
  }));
}

/** Packages tied to a given concern slug (for the per-concern section). */
export async function getPackagesByConcern(
  concernSlug: string,
): Promise<TreatmentPackage[]> {
  const all = await getPackages();
  return all.filter((p) => p.concernSlug === concernSlug);
}

// ----- Hero carousel --------------------------------------------------------

export type HeroSlideData = {
  eyebrow: string;
  headline: { line1: string; line2: string };
  subtitle: string;
  ctaLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  image: string;
  imageAlt: string;
};

type SanityHeroSlide = {
  eyebrow?: string;
  headlineLine1?: string;
  headlineLine2?: string;
  subtitle?: string;
  ctaLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  image?: string;
  imageAlt?: string;
};

/**
 * Hero carousel slides from Sanity. Returns `null` when Sanity is empty or
 * unreachable so the Hero component renders its built-in fallback slides.
 */
export async function getHeroSlides(): Promise<HeroSlideData[] | null> {
  const docs = await safeFetch<SanityHeroSlide[]>(heroSlidesQuery);
  if (!isFilled(docs)) return null;
  return docs
    .filter((d) => d.image && d.headlineLine1)
    .map((d) => ({
      eyebrow: d.eyebrow ?? "",
      headline: { line1: d.headlineLine1 ?? "", line2: d.headlineLine2 ?? "" },
      subtitle: d.subtitle ?? "",
      ctaLabel: d.ctaLabel ?? "Book Appointment",
      secondaryHref: d.secondaryHref ?? "/procedures",
      secondaryLabel: d.secondaryLabel ?? "Explore Services",
      image: d.image as string,
      imageAlt: d.imageAlt ?? "",
    }));
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
  const docs = await safeFetch<{
    letter: string;
    title: string;
    description: string;
    imageUrl?: string;
  }[]>(eeatPillarsQuery);
  if (!isFilled(docs)) return LOCAL_EEAT.map((e) => ({ ...e, imageUrl: undefined }));
  return docs.map((d) => ({
    letter: d.letter,
    title: d.title,
    desc: d.description,
    imageUrl: d.imageUrl,
  }));
}

export async function getTrustItems(): Promise<{ icon: string; text: string }[]> {
  const docs = await safeFetch<{ icon: string; text: string }[]>(trustItemsQuery);
  if (!isFilled(docs)) return LOCAL_TRUST_ITEMS;
  return docs;
}

// ----- Procedures -----------------------------------------------------------

type SanityProcedure = {
  _id: string;
  name: string;
  slug: string;
  pillar: ProcedurePillar;
  tag?: string;
  headline: string;
  overview?: string;
  image?: { url?: string };
  quickDuration?: string;
  quickSessions?: string;
  quickDowntime?: string;
  quickAnaesthesia?: string;
  keyPoints?: string[];
  suitableFor?: string[];
  process?: { title: string; description: string }[];
  benefits?: { icon: string; title: string; description: string }[];
  faqs?: { question: string; answer: string }[];
  medicallyReviewedBy?: string;
  lastReviewed?: string;
};

function mapProcedure(d: SanityProcedure): Procedure {
  return {
    slug: d.slug,
    name: d.name,
    pillar: d.pillar,
    tag: d.tag,
    image: d.image?.url,
    headline: d.headline,
    overview: d.overview ?? "",
    quick: {
      duration: d.quickDuration ?? "",
      sessions: d.quickSessions ?? "",
      downtime: d.quickDowntime ?? "",
      anaesthesia: d.quickAnaesthesia,
    },
    keyPoints: d.keyPoints ?? [],
    suitableFor: d.suitableFor ?? [],
    process: (d.process ?? []).map((s) => ({ t: s.title, d: s.description })),
    benefits: (d.benefits ?? []).map((b) => ({
      i: b.icon,
      t: b.title,
      d: b.description,
    })),
    faqs: (d.faqs ?? []).map((f) => ({ q: f.question, a: f.answer })),
    medicallyReviewedBy: d.medicallyReviewedBy,
    lastReviewed: d.lastReviewed,
  };
}

export async function getProcedures(): Promise<Procedure[]> {
  const docs = await safeFetch<SanityProcedure[]>(proceduresQuery);
  if (!isFilled(docs)) return LOCAL_PROCEDURES;
  return docs.map(mapProcedure);
}

export async function getProceduresByPillar(
  pillar: ProcedurePillar,
): Promise<Procedure[]> {
  const docs = await safeFetch<SanityProcedure[]>(proceduresByPillarQuery, {
    pillar,
  });
  if (!isFilled(docs)) {
    return pillar === "hair-transplant"
      ? LOCAL_HAIR_PROCEDURES
      : LOCAL_PLASTIC_PROCEDURES;
  }
  return docs.map(mapProcedure);
}

export async function getProcedureBySlug(
  slug: string,
): Promise<Procedure | undefined> {
  const doc = await safeFetch<SanityProcedure | null>(procedureBySlugQuery, {
    slug,
  });
  if (doc) return mapProcedure(doc);
  return LOCAL_PROCEDURES.find((p) => p.slug === slug);
}

export async function getProcedureSlugs(): Promise<
  { slug: string; pillar: ProcedurePillar }[]
> {
  const docs = await safeFetch<{ slug: string; pillar: ProcedurePillar }[]>(
    procedureSlugsQuery,
  );
  if (isFilled(docs)) return docs;
  return LOCAL_PROCEDURES.map((p) => ({ slug: p.slug, pillar: p.pillar }));
}

// ----- Skin Concerns --------------------------------------------------------

type SanityConcern = {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  cardTagline?: string;
  image?: { url?: string };
  headline?: string;
  summary?: string;
  symptoms?: string[];
  causes?: string[];
  approach?: string[];
  relatedProcedures?: SanityProcedure[];
  faqs?: { question: string; answer: string }[];
};

function mapConcern(d: SanityConcern): Concern {
  return {
    slug: d.slug,
    name: d.name,
    icon: d.icon ?? "◍",
    image: d.image?.url,
    cardTagline: d.cardTagline ?? "",
    headline: d.headline ?? "",
    summary: d.summary ?? "",
    symptoms: d.symptoms ?? [],
    causes: d.causes ?? [],
    approach: d.approach ?? [],
    // Sanity gives full procedure refs; for the page we just need the slugs
    // — the existing UI looks them up in PROCEDURE_BY_SLUG anyway.
    relatedProcedureSlugs: (d.relatedProcedures ?? []).map((p) => p.slug),
    faqs: (d.faqs ?? []).map((f) => ({ q: f.question, a: f.answer })),
  };
}

export async function getConcerns(): Promise<Concern[]> {
  const docs = await safeFetch<SanityConcern[]>(concernsQuery);
  if (!isFilled(docs)) return LOCAL_CONCERNS;
  return docs.map(mapConcern);
}

export async function getConcernBySlug(slug: string): Promise<Concern | undefined> {
  const doc = await safeFetch<SanityConcern | null>(concernBySlugQuery, {
    slug,
  });
  if (doc) return mapConcern(doc);
  return LOCAL_CONCERNS.find((c) => c.slug === slug);
}

export async function getConcernSlugs(): Promise<string[]> {
  const slugs = await safeFetch<string[]>(concernSlugsQuery);
  if (isFilled(slugs)) return slugs;
  return LOCAL_CONCERN_SLUGS;
}

// ── Location fetchers ────────────────────────────────────────────────────────

import { allLocationsQuery, locationByCityAreaQuery } from "./queries";
import { NCR_AREAS, type NcrArea } from "@/data/locations";

export type SanityLocation = {
  _id: string;
  area: string;
  areaSlug: string;
  city: string;
  citySlug: string;
  pincode?: string;
  headline?: string;
  intro?: string;
  faqs?: { question: string; answer: string }[];
  metaTitle?: string;
  metaDescription?: string;
};

/** All enabled locations from Sanity, falling back to the static NCR_AREAS. */
export async function getAllLocations(): Promise<SanityLocation[]> {
  const docs = await safeFetch<SanityLocation[]>(allLocationsQuery);
  if (isFilled(docs)) return docs;
  // Fallback: map static data to the same shape (no overrides)
  return NCR_AREAS.map((a) => ({
    _id: `location.${a.areaSlug}`,
    area: a.area,
    areaSlug: a.areaSlug,
    city: a.city,
    citySlug: a.citySlug,
    pincode: a.pincode,
  }));
}

/** Single location by city + area slug. */
export async function getLocationByCityArea(
  citySlug: string,
  areaSlug: string,
): Promise<SanityLocation | null> {
  const doc = await safeFetch<SanityLocation | null>(
    locationByCityAreaQuery,
    { citySlug, areaSlug },
  );
  if (doc) return doc;
  // Static fallback
  const area = NCR_AREAS.find(
    (a) => a.citySlug === citySlug && a.areaSlug === areaSlug,
  );
  if (!area) return null;
  return {
    _id: `location.${area.areaSlug}`,
    area: area.area,
    areaSlug: area.areaSlug,
    city: area.city,
    citySlug: area.citySlug,
    pincode: area.pincode,
  };
}
