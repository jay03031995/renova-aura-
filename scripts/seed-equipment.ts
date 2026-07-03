/**
 * Seed the two Reveal Lasers technologies used at RenovaAura into Sanity:
 *   - VEGA Comfort  → Laser Hair Reduction   (reveallasers.com/technology/vega-comfort)
 *   - QLARA         → Pigmentation / toning   (reveallasers.co.in/technology/qlara)
 *
 * Idempotent: deterministic _id + createOrReplace, so re-running updates in
 * place. Placeholder Unsplash images are uploaded once — replace them with the
 * real machine photos in the Studio afterwards.
 *
 * Usage:
 *   set -a; source .env.local; set +a   # load SANITY_API_TOKEN
 *   npx tsx scripts/seed-equipment.ts
 */
import { createClient } from "@sanity/client";

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
const withKeys = <T extends object>(arr: T[]) =>
  arr.map((o) => ({ _key: key(), ...o }));

async function uploadImage(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`image HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const asset = await client.assets.upload("image", buf, {
    filename: url.split("/").pop()?.split("?")[0] || "equipment.jpg",
  });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

const EQUIPMENT = [
  {
    _id: "equipment.vega-comfort-laser-hair-reduction",
    slug: "vega-comfort-laser-hair-reduction",
    name: "VEGA Comfort — Laser Hair Reduction",
    treatmentName: "Laser Hair Reduction",
    category: "Laser",
    technologyPartner: "Reveal Lasers",
    displayOrder: 1,
    featured: true,
    imageUrl:
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1600&q=80",
    shortDescription:
      "RenovaAura performs laser hair reduction on the VEGA Comfort — a dual-wavelength diode laser by Reveal Lasers built for fast, near-painless, permanent hair reduction across every skin type.",
    detailedDescription:
      "Laser hair reduction at RenovaAura is delivered on the VEGA Comfort, a next-generation diode hair-removal platform from our technology partner Reveal Lasers. It pairs two clinically proven wavelengths — 755 nm and 810 nm (Reveal's 2D Dual Laser Technology) — so energy reaches the hair follicle at exactly the right depth for coarse and fine hair alike.\nWhat makes the VEGA Comfort different is comfort and safety. Its best-in-class contact cooling protects the surface of the skin while SMOOTH gradual heating and Accu-Therm sweeping delivery raise the follicle to treatment temperature evenly — so sessions feel like a warm massage rather than the snap of older machines.\nBecause the wavelengths and cooling are calibrated for all Fitzpatrick skin types, it is a safe, effective choice for Indian skin. Most patients see visible reduction within about three sittings, with a full course delivering smooth, long-term, permanent hair reduction.",
    specifications: [
      { label: "Laser type", value: "Dual-wavelength diode — 755 nm + 810 nm (2D Dual Laser)" },
      { label: "Cooling", value: "Best-in-class contact cooling for near-painless sessions" },
      { label: "Delivery", value: "SMOOTH gradual heating + Accu-Therm uniform sweeping energy" },
      { label: "Follicle target", value: "Treats hair at the bulge/base — all colours & textures" },
      { label: "Skin types", value: "Safe across every Fitzpatrick type (I–VI), including Indian skin" },
      { label: "Sessions", value: "Visible reduction from ~3 sittings; full course typically 6–8" },
    ],
    keyBenefits: [
      "Virtually painless thanks to best-in-class contact cooling",
      "Faster results in fewer sessions than conventional lasers",
      "Safe and effective on every skin tone, tan or untanned",
      "Works on fine and coarse hair across face and body",
      "Long-term, permanent hair reduction",
      "No downtime — return to your day straight after",
    ],
    treatmentAreas: [
      "Upper lip, chin & jawline",
      "Underarms",
      "Arms & hands",
      "Legs & feet",
      "Bikini line & Brazilian",
      "Back & shoulders",
      "Chest & abdomen",
      "Full body",
    ],
    idealFor:
      "Anyone wanting to stop shaving, waxing or threading — including patients with PCOS-related facial hair, ingrown-hair or folliculitis concerns, and darker skin tones that older lasers could not safely treat.",
    faqs: [
      {
        question: "Is laser hair reduction on the VEGA Comfort painful?",
        answer:
          "No. The VEGA Comfort uses best-in-class contact cooling with gradual SMOOTH heating, so most patients describe it as a warm, comfortable sensation rather than the sharp snap of older lasers.",
      },
      {
        question: "How many sessions will I need?",
        answer:
          "Visible reduction usually appears within about three sittings. A full course is typically 6–8 sessions spaced a few weeks apart, depending on the area and your hair cycle.",
      },
      {
        question: "Is it safe for Indian and darker skin tones?",
        answer:
          "Yes. Its 755 nm + 810 nm wavelengths and advanced cooling are calibrated to treat all Fitzpatrick skin types safely, including deeper Indian skin tones.",
      },
      {
        question: "Is the hair reduction permanent?",
        answer:
          "Laser hair reduction delivers long-term, permanent reduction. Most patients keep results with occasional maintenance sessions once the initial course is complete.",
      },
    ],
    seoTitle: "Laser Hair Reduction on VEGA Comfort (Reveal Lasers) — RenovaAura, New Delhi",
    seoDescription:
      "Permanent laser hair reduction at RenovaAura on the VEGA Comfort diode laser by Reveal Lasers — near-painless, fast and safe for all skin types. Anand Vihar, New Delhi.",
  },
  {
    _id: "equipment.qlara-pigmentation",
    slug: "qlara-pigmentation",
    name: "QLARA — Pigmentation & Laser Toning",
    treatmentName: "Pigmentation",
    category: "Laser",
    technologyPartner: "Reveal Lasers",
    displayOrder: 2,
    featured: true,
    imageUrl:
      "https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=1600&q=80",
    shortDescription:
      "RenovaAura treats pigmentation, melasma and dull skin on the QLARA — a Q-switched multi-wavelength laser by Reveal Lasers with Smart MultiTone mode for safe, versatile results.",
    detailedDescription:
      "Pigmentation treatment at RenovaAura is performed on the QLARA, a Q-switched laser platform from our technology partner Reveal Lasers. Its Smart MultiTone mode lets our dermatologists match wavelength, pulse and energy precisely to your pigmentation — for enhanced safety, versatility and speed.\nThe QLARA is a true multi-wavelength system: 532 nm targets superficial, epidermal pigment where melanin absorption is highest, while 1064 nm penetrates deeper to reach dermal pigment and support gentle laser toning. Additional 595 nm and 660 nm outputs allow multicoloured tattoo removal. Nanosecond and microsecond pulses in single, double and multi-pulse sequences shatter pigment into particles the body clears naturally.\nBecause treatment depth and energy are fully customisable, the QLARA is safe and effective for Indian skin — addressing melasma, hyperpigmentation, freckles, solar lentigo and post-acne marks while lifting overall tone and clarity.",
    specifications: [
      { label: "Laser type", value: "Q-switched multi-wavelength with Smart MultiTone mode" },
      { label: "Wavelengths", value: "532 nm (epidermal) · 1064 nm (dermal) · 595/660 nm (tattoo)" },
      { label: "Pulse control", value: "Nanosecond & microsecond — single, double & multi-pulse" },
      { label: "Treats", value: "Melasma, hyperpigmentation, lentigines, freckles, dyschromia, tattoos, toning" },
      { label: "Skin types", value: "Depth-tunable and calibrated for Indian skin — all Fitzpatrick types" },
      { label: "Downtime", value: "Minimal — most patients resume normal activity the same day" },
    ],
    keyBenefits: [
      "Multi-wavelength — treats both surface and deep pigmentation",
      "Smart MultiTone mode for safer, faster, tailored sessions",
      "Effective on stubborn melasma and post-acne pigmentation",
      "Adds glow and evens skin tone with gentle laser toning",
      "Removes multicoloured tattoos",
      "Safe for Indian skin with minimal downtime",
    ],
    treatmentAreas: [
      "Melasma",
      "Freckles & solar lentigo",
      "Post-acne pigmentation",
      "Dark underarms & knuckles",
      "Sun spots & dyschromia",
      "Multicoloured tattoo removal",
      "Skin toning & glow",
      "Onychomycosis",
    ],
    idealFor:
      "Patients with melasma, uneven tone, sun-induced spots or post-inflammatory pigmentation who want a customisable, dermatologist-supervised laser calibrated for Indian skin — as well as anyone seeking tattoo removal.",
    faqs: [
      {
        question: "Can the QLARA laser treat melasma safely on Indian skin?",
        answer:
          "Yes. The QLARA is a Q-switched laser with fully tunable depth and energy, and its Smart MultiTone mode lets our dermatologists calibrate gentle settings that are safe and effective for melasma on Indian skin.",
      },
      {
        question: "How many sessions does pigmentation treatment need?",
        answer:
          "It depends on the type and depth of pigmentation. Superficial spots may clear in a few sessions, while melasma is managed over a longer, gradual course alongside topical care and sun protection.",
      },
      {
        question: "Is there downtime after QLARA laser toning?",
        answer:
          "Downtime is minimal. You may notice mild redness that settles within hours, and most patients return to normal activity the same day with sunscreen.",
      },
      {
        question: "Can the QLARA remove tattoos?",
        answer:
          "Yes. Its 532, 1064, 595 and 660 nm outputs let it break down black and multicoloured tattoo inks over a series of sessions.",
      },
    ],
    seoTitle: "Pigmentation & Melasma Laser on QLARA (Reveal Lasers) — RenovaAura, New Delhi",
    seoDescription:
      "Pigmentation, melasma and laser toning at RenovaAura on the QLARA Q-switched laser by Reveal Lasers — multi-wavelength, safe for Indian skin. Anand Vihar, New Delhi.",
  },
];

async function run() {
  for (const e of EQUIPMENT) {
    process.stdout.write(`• ${e.name} … `);
    const { imageUrl, faqs, specifications, ...rest } = e;
    const image = await uploadImage(imageUrl);
    await client.createOrReplace({
      _type: "equipment",
      ...rest,
      slug: { _type: "slug", current: e.slug },
      image,
      specifications: withKeys(specifications),
      faqs: withKeys(faqs),
    });
    console.log("done");
  }
  console.log(`\n✓ Seeded ${EQUIPMENT.length} technologies.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
