/**
 * TEMPORARY diagnostic endpoint — confirms whether the production runtime can
 * read Sanity. Returns booleans/counts only; never the token value. Delete
 * once the SANITY_API_TOKEN env-var issue is resolved.
 */
import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "@/sanity/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = process.env.SANITY_API_TOKEN;
  const out: Record<string, unknown> = {
    projectId,
    dataset,
    hasToken: !!token,
    tokenLen: token ? token.length : 0,
    hasRevalidateSecret: !!process.env.SANITY_REVALIDATE_SECRET,
  };
  try {
    const c = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      perspective: "published",
      token,
    });
    out.heroSlides = await c.fetch<number>(`count(*[_type == "heroSlide"])`);
    out.doctors = await c.fetch<number>(`count(*[_type == "doctor"])`);
  } catch (e) {
    out.fetchError = e instanceof Error ? e.message : String(e);
  }
  return NextResponse.json(out);
}
