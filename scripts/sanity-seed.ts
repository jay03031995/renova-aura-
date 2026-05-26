/**
 * One-shot migration: pushes the bundled TypeScript content into the
 * configured Sanity dataset. Run with:
 *
 *   npm run sanity:seed
 *
 * Requires NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and
 * SANITY_API_TOKEN (editor permission) set in .env.local.
 */

import { writeClient } from "@/sanity/lib/client";
import { projectId } from "@/sanity/env";
import { CLINIC } from "@/data/clinic";
import {
  CATEGORIES,
  TREATMENTS,
  TREATMENT_SLUGS,
  TREATMENTS_FULL,
} from "@/data/treatments";
import { CONCERNS_FULL } from "@/data/concerns";
import { DOCTORS } from "@/data/doctors";
import {
  EEAT,
  FAQS,
  RESULTS,
  TESTIMONIALS,
  TRUST_ITEMS,
} from "@/data/site";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function ref(id: string) {
  return { _type: "reference", _ref: id };
}

function slug(current: string) {
  return { _type: "slug", current };
}

async function main() {
  const token = process.env.SANITY_API_TOKEN;
  if (!projectId) {
    throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Add it to .env.local.");
  }
  if (!token) {
    throw new Error("SANITY_API_TOKEN is not set. Add it to .env.local.");
  }

  const client = writeClient(token);
  const docs: { _id: string; _type: string }[] = [];

  // --- Treatment categories ------------------------------------------------
  for (const [i, c] of CATEGORIES.entries()) {
    docs.push({
      _id: `category-${slugify(c.key)}`,
      _type: "treatmentCategory",
      key: c.key,
      title: c.title,
      description: c.desc,
      order: i,
    } as never);
  }

  // --- Treatments ----------------------------------------------------------
  for (const t of TREATMENTS) {
    const detailSlug = TREATMENT_SLUGS[t.id];
    const detail = TREATMENTS_FULL[detailSlug];
    docs.push({
      _id: `treatment-${detailSlug}`,
      _type: "treatment",
      name: t.name,
      slug: slug(detailSlug),
      category: ref(`category-${slugify(t.cat)}`),
      imageVariant: t.img,
      tag: t.tag,
      shortDescription: t.desc,
      duration: t.dur,
      headline: detail?.headline ?? "",
      overview: detail?.overview ?? "",
      quickDuration: detail?.quick.duration ?? "",
      quickSessions: detail?.quick.sessions ?? "",
      quickDowntime: detail?.quick.downtime ?? "",
      keyPoints: detail?.keyPoints ?? [],
      suitableFor: detail?.suitableFor ?? [],
      process:
        detail?.process.map((s) => ({
          _type: "processStep",
          title: s.t,
          description: s.d,
        })) ?? [],
      benefits:
        detail?.benefits.map((b) => ({
          _type: "benefit",
          icon: b.i,
          title: b.t,
          description: b.d,
        })) ?? [],
      faqs:
        detail?.faqs.map((f) => ({
          _type: "faqItem",
          question: f.q,
          answer: f.a,
        })) ?? [],
    } as never);
  }

  // --- Concerns ------------------------------------------------------------
  for (const [i, c] of CONCERNS_FULL.entries()) {
    docs.push({
      _id: `concern-${c.slug}`,
      _type: "concern",
      name: c.name,
      slug: slug(c.slug),
      icon: c.icon,
      cardTagline: c.count,
      imageVariant: "v1",
      headline: c.headline,
      summary: c.summary,
      symptoms: c.symptoms,
      causes: c.causes,
      approach: c.approach,
      treatments: c.treatmentSlugs.map((s) => ref(`treatment-${s}`)),
      faqs: c.faqs.map((f) => ({
        _type: "faqItem",
        question: f.q,
        answer: f.a,
      })),
      order: i,
    } as never);
  }

  // --- Doctors -------------------------------------------------------------
  for (const [i, d] of DOCTORS.entries()) {
    docs.push({
      _id: `doctor-${d.slug}`,
      _type: "doctor",
      name: d.name,
      slug: slug(d.slug),
      title: d.title,
      imageVariant: d.img,
      years: d.years,
      order: i,
      focusLine: d.focus,
      homeBio: d.homeBio,
      shortLine: d.short,
      listBio: d.listBio,
      statCreds: d.statCreds.map((s) => ({
        _type: "statCred",
        value: s.n,
        superscript: s.sup,
        label: s.l,
      })),
      listExpertise: d.listExpertise,
      tagline: d.tagline,
      detailBio: d.detailBio,
      credentials: d.credentials.map((c) => ({
        _type: "credential",
        icon: c.i,
        title: c.t,
        description: c.d,
      })),
      timeline: d.timeline.map((t) => ({
        _type: "timelineEntry",
        year: t.y,
        title: t.t,
        description: t.d,
      })),
      expertise: d.expertise,
      treatments: d.treatments.map((t) => ({
        _type: "doctorTreatment",
        icon: t.i,
        name: t.n,
        category: t.c,
      })),
      quotes: d.quotes.map((q) => ({
        _type: "patientQuote",
        quote: q.q,
        name: q.n,
        detail: q.d,
      })),
    } as never);
  }

  // --- Patient results -----------------------------------------------------
  for (const [i, r] of RESULTS.entries()) {
    docs.push({
      _id: `result-${r.id}`,
      _type: "result",
      name: r.name,
      category: r.cat,
      externalImageUrl: r.img,
      weeks: r.weeks,
      sessions: r.sessions,
      patient: r.patient,
      concern: r.concern,
      consentOnFile: true,
      order: i,
    } as never);
  }

  // --- Testimonials / FAQs / EEAT / Trust ---------------------------------
  TESTIMONIALS.forEach((t, i) => {
    docs.push({
      _id: `testimonial-${i + 1}`,
      _type: "testimonial",
      quote: t.q,
      name: t.name,
      detail: t.detail,
      showOnHomepage: true,
      order: i,
    } as never);
  });

  FAQS.forEach((f, i) => {
    docs.push({
      _id: `homepageFaq-${i + 1}`,
      _type: "homepageFaq",
      question: f.q,
      answer: f.a,
      order: i,
    } as never);
  });

  EEAT.forEach((p, i) => {
    docs.push({
      _id: `eeatPillar-${i + 1}`,
      _type: "eeatPillar",
      letter: p.letter,
      title: p.title,
      description: p.desc,
      order: i,
    } as never);
  });

  TRUST_ITEMS.forEach((t, i) => {
    docs.push({
      _id: `trustItem-${i + 1}`,
      _type: "trustItem",
      icon: t.icon,
      text: t.text,
      order: i,
    } as never);
  });

  // --- Singletons ----------------------------------------------------------
  docs.push({
    _id: "clinicSettings",
    _type: "clinicSettings",
    name: CLINIC.name,
    tagline: CLINIC.tagline,
    address: CLINIC.address,
    hours: CLINIC.hours,
    phone: CLINIC.phone,
    phone2: CLINIC.phone2,
    email: CLINIC.email,
    googleMapsEmbedUrl:
      "https://www.google.com/maps?q=Dermaheal+Skin+Clinic+Ramphal+Chowk+Dwarka&output=embed",
    googleMapsLinkUrl:
      "https://www.google.com/maps?q=Dermaheal+Skin+Clinic+Ramphal+Chowk+Dwarka",
    shopUrl: CLINIC.shopUrl,
    instagramUrl: CLINIC.social.instagram,
    youtubeUrl: CLINIC.social.youtube,
    linkedinUrl: CLINIC.social.linkedin,
  } as never);

  docs.push({
    _id: "siteSettings",
    _type: "siteSettings",
    siteUrl: "https://dermaheal.co.in",
    defaultMetaTitle:
      "Dermaheal Skin & Hair Clinic — Top Dermatologist in Dwarka, Delhi",
    titleTemplate: "%s — Dermaheal Skin & Hair Clinic",
    defaultMetaDescription:
      "Dermaheal is Dwarka's MD-led skin and hair clinic. 27+ advanced treatments calibrated for Indian skin.",
    heroEyebrow: "Dermatology · Aesthetics · Trichology",
    heroHeadline:
      "Skin that knows the<br/>difference between <em>care</em><br/>and <em>cosmetics.</em>",
    heroSubhead:
      "Dwarka's trusted MD-led dermatology practice, calibrated for Indian skin, grounded in clinical evidence, and built around the kind of unhurried care that produces real, lasting results.",
    footerColumns: [
      {
        _type: "footerColumn",
        title: "Treatments",
        links: [
          { _type: "footerLink", label: "Hair Transplant", href: "/treatments/hair-transplant" },
          { _type: "footerLink", label: "Anti-Wrinkle (Botox)", href: "/treatments/botox" },
          { _type: "footerLink", label: "MNRF Treatment", href: "/treatments/mnrf" },
          { _type: "footerLink", label: "Cosmelan", href: "/treatments/cosmelan" },
          { _type: "footerLink", label: "Acne Scar Reduction", href: "/treatments/acne-scar-reduction" },
          { _type: "footerLink", label: "All Treatments", href: "/treatments" },
        ],
      },
      {
        _type: "footerColumn",
        title: "Concerns",
        links: [
          { _type: "footerLink", label: "Acne & Scars", href: "/concerns/acne" },
          { _type: "footerLink", label: "Pigmentation & Melasma", href: "/concerns/pigmentation-melasma" },
          { _type: "footerLink", label: "Hair Loss", href: "/concerns/hair-loss-thinning" },
          { _type: "footerLink", label: "Anti-Ageing", href: "/concerns/anti-ageing-wrinkles" },
          { _type: "footerLink", label: "Unwanted Hair", href: "/concerns/unwanted-hair" },
        ],
      },
      {
        _type: "footerColumn",
        title: "Clinic",
        links: [
          { _type: "footerLink", label: "Our Doctors", href: "/doctors" },
          { _type: "footerLink", label: "Patient Results", href: "/results" },
          { _type: "footerLink", label: "Patient Stories", href: "/#testimonials" },
          { _type: "footerLink", label: "FAQs", href: "/#faq" },
          { _type: "footerLink", label: "Contact", href: "/#contact" },
        ],
      },
      {
        _type: "footerColumn",
        title: "Resources",
        links: [
          { _type: "footerLink", label: "Book a Consultation", href: "/#book" },
          { _type: "footerLink", label: "Shop", href: "https://dermaheal.co.in/shop" },
        ],
      },
    ],
  } as never);

  docs.push({
    _id: "announcementBar",
    _type: "announcementBar",
    enabled: true,
    message: "BOOK A CONSULTATION WITH AN MD DERMATOLOGIST",
    linkLabel: "Book this week →",
    linkUrl: "/#book",
  } as never);

  // --- Push to Sanity ------------------------------------------------------
  const tx = client.transaction();
  for (const d of docs) tx.createOrReplace(d as never);

  const result = await tx.commit();
  console.log(
    `\n✔  Seeded ${result.results.length} documents into project "${projectId}".`,
  );
  console.log(
    "→ Open http://localhost:3000/studio (run `npm run dev` first) to start editing.",
  );
}

main().catch((err) => {
  console.error("\n✖  Sanity seed failed:");
  console.error(err);
  process.exit(1);
});
