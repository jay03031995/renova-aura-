/**
 * Seed only Body Concern documents into Sanity.
 *
 * Usage:
 *   set -a; source .env.local; set +a
 *   npx tsx scripts/seed-body-concerns.ts
 */
import { createClient } from "@sanity/client";
import { BODY_CONCERNS } from "../src/data/bodyConcerns";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "q7pg9y33";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!token) {
  console.error(
    "SANITY_API_TOKEN missing. Run: set -a; source .env.local; set +a",
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
const withKeys = <T extends object>(arr: T[], type?: string) =>
  arr.map((o) => ({ _key: key(), ...(type ? { _type: type } : {}), ...o }));

const docs = BODY_CONCERNS.map((c, index) => ({
  _id: `bodyConcern.${c.slug}`,
  _type: "bodyConcern",
  name: c.name,
  slug: { _type: "slug", current: c.slug },
  icon: c.icon,
  order: index + 1,
  cardTagline: c.cardTagline,
  headline: c.headline,
  summary: c.summary,
  symptoms: c.symptoms,
  causes: c.causes,
  approach: c.approach,
  faqs: withKeys(
    c.faqs.map((f) => ({ question: f.q, answer: f.a })),
    "faqItem",
  ),
}));

async function main() {
  const tx = client.transaction();
  for (const doc of docs) tx.createOrReplace(doc);

  await tx.commit({ visibility: "async" });

  console.log(`Seeded ${docs.length} body concerns.`);
}

main().catch((e) => {
  console.error("Body concern seed failed:", e);
  process.exit(1);
});
