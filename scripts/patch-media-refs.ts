import { createClient } from "@sanity/client";
const token = process.env.SANITY_API_TOKEN;
if (!token) { console.error("no token"); process.exit(1); }
const client = createClient({ projectId: "eqn3mfxm", dataset: "production", token, apiVersion: "2024-11-01", useCdn: false });
const key = () => Math.random().toString(36).slice(2, 8);

async function run() {
  const procs = await client.fetch<{ _id: string; slug: string }[]>(
    `*[_type=="procedure" && slug.current in ["fat-grafting","breast-reduction","scar-revision"]]{_id,"slug":slug.current}`,
  );
  console.log("resolved ids:", procs);
  const treatments = procs.map((p) => ({ _type: "reference", _ref: p._id, _key: key() }));
  for (const id of ["realResult.sample-hair","realResult.sample-skin","realResult.sample-body","video.sample-walkthrough","video.sample-treatment"]) {
    await client.patch(id).set({ treatments }).commit();
    console.log("patched", id);
  }
}
run().catch((e) => { console.error(e); process.exit(1); });
