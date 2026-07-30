/**
 * Seed starter media so the new Real Results / Videos / Gallery features are
 * visible. Placeholder Unsplash images + well-known demo videos — replace them
 * with real clinic media in Sanity Studio.
 *
 * Idempotent (deterministic _id + createOrReplace).
 *
 * Usage:
 *   set -a; source .env.local; set +a   # load SANITY_API_TOKEN
 *   npx tsx scripts/seed-media.ts
 */
import { createClient } from "@sanity/client";

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  console.error("✗ SANITY_API_TOKEN missing.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "eqn3mfxm",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token,
  apiVersion: "2024-11-01",
  useCdn: false,
});

async function img(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`image HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const asset = await client.assets.upload("image", buf, {
    filename: url.split("/").pop()?.split("?")[0] || "media.jpg",
  });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}
const ref = (id: string) => ({ _type: "reference", _ref: id, _key: Math.random().toString(36).slice(2, 10) });

const U = (id: string) => `https://images.unsplash.com/${id}?w=1400&q=80`;

async function run() {
  // Reference a couple of existing treatments so results/videos also show on
  // their pages (best-effort — skipped if none exist yet).
  const proc = await client.fetch<{ _id: string }[]>(
    `*[_type=="procedure"][0..1]{_id}`,
  );
  const concern = await client.fetch<{ _id: string }[]>(
    `*[_type=="concern"][0..1]{_id}`,
  );
  const treatmentRefs = [...proc, ...concern].map((d) => ref(d._id));
  console.log(`Linking to ${treatmentRefs.length} existing treatment(s).`);

  // ---- Gallery images ----
  const galleryImages = [
    { id: "galleryImage.clinic-reception", title: "Clinic reception", category: "Clinic", u: "photo-1519494026892-80bbd2d6fd0d" },
    { id: "galleryImage.treatment-room", title: "Treatment room", category: "Clinic", u: "photo-1629909613654-28e377c37b09" },
    { id: "galleryImage.laser-machine", title: "Laser technology", category: "Skin", u: "photo-1512290923902-8a9f81dc236c" },
  ];
  for (const g of galleryImages) {
    process.stdout.write(`gallery: ${g.title} … `);
    await client.createOrReplace({
      _id: g.id,
      _type: "galleryImage",
      title: g.title,
      category: g.category,
      image: await img(U(g.u)),
      featured: true,
      displayOrder: galleryImages.indexOf(g),
    });
    console.log("ok");
  }

  // ---- Real results (before/after) ----
  const results = [
    { id: "realResult.sample-hair", title: "Hair Restoration Result", caption: "9 months · FUE", category: "Hair", b: "photo-1522337660859-02fbefca4702", a: "photo-1503443207922-dff7d543fd0e" },
    { id: "realResult.sample-skin", title: "Acne Scar Reduction", caption: "6 sessions · 12 weeks", category: "Skin", b: "photo-1512290923902-8a9f81dc236c", a: "photo-1487412947147-5cebf100ffc2" },
    { id: "realResult.sample-body", title: "Body Contouring Result", caption: "8 weeks", category: "Body", b: "photo-1474552226712-ac0f0961a954", a: "photo-1488477181946-6428a0291777" },
  ];
  for (const r of results) {
    process.stdout.write(`result: ${r.title} … `);
    await client.createOrReplace({
      _id: r.id,
      _type: "realResult",
      title: r.title,
      caption: r.caption,
      category: r.category,
      beforeImage: await img(U(r.b)),
      afterImage: await img(U(r.a)),
      treatments: treatmentRefs,
      featured: true,
      consentOnFile: true,
      displayOrder: results.indexOf(r),
    });
    console.log("ok");
  }

  // ---- Videos (well-known safe demo clips — replace in Studio) ----
  const videos = [
    { id: "video.sample-walkthrough", title: "Sample: Clinic walkthrough", category: "Clinic", sourceType: "youtube", youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ" },
    { id: "video.sample-treatment", title: "Sample: Treatment overview", category: "Skin", sourceType: "vimeo", vimeoUrl: "https://vimeo.com/76979871" },
  ];
  for (const v of videos) {
    process.stdout.write(`video: ${v.title} … `);
    await client.createOrReplace({
      _id: v.id,
      _type: "video",
      title: v.title,
      category: v.category,
      sourceType: v.sourceType,
      youtubeUrl: v.youtubeUrl,
      vimeoUrl: v.vimeoUrl,
      treatments: treatmentRefs,
      featured: true,
      displayOrder: videos.indexOf(v),
    });
    console.log("ok");
  }

  console.log("\n✓ Seeded starter media (gallery images, results, videos).");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
