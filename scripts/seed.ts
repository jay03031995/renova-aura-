/**
 * Seed the Sanity dataset from the local TypeScript data files.
 *
 * Populates every editable content type (doctors, procedures, concerns,
 * testimonials, FAQs, EEAT pillars, trust strip, clinic + site settings,
 * announcement bar) so the Studio is fully editable. Faithfully mirrors the
 * current local content, so the live site looks identical — just CMS-driven.
 *
 * Idempotent: every document uses a deterministic _id and createOrReplace,
 * so re-running updates in place rather than duplicating. Procedure/concern
 * images (Unsplash) and doctor portraits (local /public) are uploaded as
 * Sanity assets once and cached by source.
 *
 * Usage:
 *   set -a; source .env.local; set +a   # load SANITY_API_TOKEN
 *   npx tsx scripts/seed.ts
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

import { DOCTORS } from "../src/data/doctors";
import { PROCEDURES } from "../src/data/procedures";
import { CONCERNS } from "../src/data/concerns";
import { EEAT, FAQS, TESTIMONIALS, TRUST_ITEMS } from "../src/data/site";
import { CLINIC } from "../src/data/clinic";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "..", "public");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "eqn3mfxm";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!token) {
  console.error(
    "✗ SANITY_API_TOKEN missing. Run: set -a; source .env.local; set +a",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-11-01",
  useCdn: false,
});

const key = () => Math.random().toString(36).slice(2, 12);

/** Add a unique _key (and optional _type) to each array item. */
const withKeys = <T extends object>(arr: T[], type?: string) =>
  arr.map((o) => ({ _key: key(), ...(type ? { _type: type } : {}), ...o }));

// ---- image upload (cached + best-effort) ----------------------------------

const assetCache = new Map<string, string>();
const imageRef = (assetId: string) => ({
  _type: "image",
  asset: { _type: "reference", _ref: assetId },
});

async function uploadFromUrl(url?: string) {
  if (!url) return undefined;
  if (assetCache.has(url)) return imageRef(assetCache.get(url)!);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const filename = url.split("/").pop()?.split("?")[0] || "image.jpg";
    const asset = await client.assets.upload("image", buf, { filename });
    assetCache.set(url, asset._id);
    return imageRef(asset._id);
  } catch (e) {
    console.warn(`  ⚠ image skipped (${url}): ${(e as Error).message}`);
    return undefined;
  }
}

async function uploadFromPublic(path?: string) {
  if (!path) return undefined;
  const cacheKey = `public:${path}`;
  if (assetCache.has(cacheKey)) return imageRef(assetCache.get(cacheKey)!);
  try {
    const buf = readFileSync(join(PUBLIC_DIR, path));
    const filename = path.split("/").pop() || "image.jpg";
    const asset = await client.assets.upload("image", buf, { filename });
    assetCache.set(cacheKey, asset._id);
    return imageRef(asset._id);
  } catch (e) {
    console.warn(`  ⚠ portrait skipped (${path}): ${(e as Error).message}`);
    return undefined;
  }
}

const ref = (id: string) => ({ _type: "reference", _ref: id });
const omitEmpty = <T extends object>(o: T) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));

// ---- builders --------------------------------------------------------------

async function buildProcedures() {
  const pillarCounters: Record<string, number> = {};
  const docs = [];
  for (const p of PROCEDURES) {
    const order = (pillarCounters[p.pillar] =
      (pillarCounters[p.pillar] ?? 0) + 1);
    const image = await uploadFromUrl(p.image);
    docs.push(
      omitEmpty({
        _id: `procedure.${p.slug}`,
        _type: "procedure",
        name: p.name,
        slug: { _type: "slug", current: p.slug },
        pillar: p.pillar,
        tag: p.tag,
        order,
        headline: p.headline,
        overview: p.overview,
        image,
        quickDuration: p.quick?.duration,
        quickSessions: p.quick?.sessions,
        quickDowntime: p.quick?.downtime,
        quickAnaesthesia: p.quick?.anaesthesia,
        keyPoints: p.keyPoints ?? [],
        suitableFor: p.suitableFor ?? [],
        process: withKeys(
          (p.process ?? []).map((s) => ({ title: s.t, description: s.d })),
          "processStep",
        ),
        benefits: withKeys(
          (p.benefits ?? []).map((b) => ({
            icon: b.i,
            title: b.t,
            description: b.d,
          })),
          "benefit",
        ),
        faqs: withKeys(
          (p.faqs ?? []).map((f) => ({ question: f.q, answer: f.a })),
          "faqItem",
        ),
        medicallyReviewedBy: p.medicallyReviewedBy,
        lastReviewed: p.lastReviewed,
      }),
    );
  }
  return docs;
}

async function buildConcerns() {
  const docs = [];
  let order = 0;
  for (const c of CONCERNS) {
    order += 1;
    const image = await uploadFromUrl(c.image);
    docs.push(
      omitEmpty({
        _id: `concern.${c.slug}`,
        _type: "concern",
        name: c.name,
        slug: { _type: "slug", current: c.slug },
        icon: c.icon,
        image,
        order,
        cardTagline: c.cardTagline,
        headline: c.headline,
        summary: c.summary,
        symptoms: c.symptoms ?? [],
        causes: c.causes ?? [],
        approach: c.approach ?? [],
        relatedProcedures: (c.relatedProcedureSlugs ?? []).map((s) => ({
          _key: key(),
          ...ref(`procedure.${s}`),
        })),
        faqs: withKeys(
          (c.faqs ?? []).map((f) => ({ question: f.q, answer: f.a })),
          "faqItem",
        ),
      }),
    );
  }
  return docs;
}

async function buildDoctors() {
  const docs = [];
  let order = 0;
  for (const d of DOCTORS) {
    order += 1;
    const portrait = await uploadFromPublic(d.photo);
    docs.push(
      omitEmpty({
        _id: `doctor.${d.slug}`,
        _type: "doctor",
        name: d.name,
        slug: { _type: "slug", current: d.slug },
        title: d.title,
        imageVariant: d.img,
        portrait,
        years: d.years,
        order,
        focusLine: d.focus,
        homeBio: d.homeBio,
        shortLine: d.short,
        listBio: d.listBio,
        statCreds: withKeys(
          (d.statCreds ?? []).map((s) => ({
            value: s.n,
            superscript: s.sup,
            label: s.l,
          })),
          "statCred",
        ),
        listExpertise: d.listExpertise ?? [],
        tagline: d.tagline,
        detailBio: d.detailBio,
        credentials: withKeys(
          (d.credentials ?? []).map((c) => ({
            icon: c.i,
            title: c.t,
            description: c.d,
          })),
          "credential",
        ),
        timeline: withKeys(
          (d.timeline ?? []).map((t) => ({
            year: t.y,
            title: t.t,
            description: t.d,
          })),
          "timelineEntry",
        ),
        expertise: d.expertise ?? [],
        treatments: withKeys(
          (d.treatments ?? []).map((t) => ({
            icon: t.i,
            name: t.n,
            category: t.c,
          })),
          "doctorTreatment",
        ),
        quotes: withKeys(
          (d.quotes ?? []).map((q) => ({
            quote: q.q,
            name: q.n,
            detail: q.d,
          })),
          "patientQuote",
        ),
      }),
    );
  }
  return docs;
}

function buildSimpleDocs() {
  const testimonials = TESTIMONIALS.map((t, i) => ({
    _id: `testimonial.${i}`,
    _type: "testimonial",
    quote: t.q,
    name: t.name,
    detail: t.detail,
    order: i,
    showOnHomepage: true,
  }));

  const faqs = FAQS.map((f, i) => ({
    _id: `homepageFaq.${i}`,
    _type: "homepageFaq",
    question: f.q,
    answer: f.a,
    order: i,
  }));

  const pillars = EEAT.map((e, i) => ({
    _id: `eeatPillar.${i}`,
    _type: "eeatPillar",
    letter: e.letter,
    title: e.title,
    description: e.desc,
    order: i,
  }));

  const trust = TRUST_ITEMS.map((t, i) => ({
    _id: `trustItem.${i}`,
    _type: "trustItem",
    icon: t.icon,
    text: t.text,
    order: i,
  }));

  return [...testimonials, ...faqs, ...pillars, ...trust];
}

function buildSingletons() {
  const clinicSettings = {
    _id: "clinicSettings",
    _type: "clinicSettings",
    name: CLINIC.name,
    tagline: CLINIC.tagline,
    address: CLINIC.address,
    hours: CLINIC.hours,
    phone: CLINIC.phone,
    phone2: CLINIC.phone2,
    email: CLINIC.email,
    googleMapsEmbedUrl: `https://www.google.com/maps?q=${CLINIC.mapsQuery}&output=embed`,
    googleMapsLinkUrl: `https://www.google.com/maps?q=${CLINIC.mapsQuery}`,
    shopUrl: CLINIC.shopUrl,
    instagramUrl: CLINIC.social.instagram,
    youtubeUrl: CLINIC.social.youtube,
    linkedinUrl: CLINIC.social.linkedin,
  };

  const siteSettings = {
    _id: "siteSettings",
    _type: "siteSettings",
    siteUrl: "https://renovaaura.com",
    titleTemplate: "%s — RenovaAura",
    defaultMetaDescription: CLINIC.tagline,
  };

  const announcementBar = {
    _id: "announcementBar",
    _type: "announcementBar",
    enabled: true,
    message: "BOOK A CONSULTATION WITH A BOARD-CERTIFIED SURGEON",
    linkLabel: "Book this week →",
    linkUrl: "/#book",
  };

  return [clinicSettings, siteSettings, announcementBar];
}

// ---- run -------------------------------------------------------------------

async function commit(label: string, docs: object[]) {
  let tx = client.transaction();
  for (const doc of docs) tx = tx.createOrReplace(doc as never);
  await tx.commit({ visibility: "async" });
  console.log(`  ✓ ${label}: ${docs.length}`);
}

async function main() {
  console.log(`Seeding Sanity → project ${projectId}, dataset ${dataset}\n`);

  console.log("Procedures (uploading images)…");
  const procedures = await buildProcedures();
  await commit("procedures", procedures);

  console.log("Concerns (uploading images + linking procedures)…");
  const concerns = await buildConcerns();
  await commit("concerns", concerns);

  console.log("Doctors (uploading portraits)…");
  const doctors = await buildDoctors();
  await commit("doctors", doctors);

  await commit("testimonials / faqs / eeat / trust", buildSimpleDocs());
  await commit("singletons (clinic / site / announcement)", buildSingletons());

  console.log("\n✓ Seed complete.");
}

main().catch((e) => {
  console.error("\n✗ Seed failed:", e);
  process.exit(1);
});
