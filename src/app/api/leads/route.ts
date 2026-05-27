/**
 * POST /api/leads
 *
 * Receives a submission from the AI Skin Analysis or Hair Graft Calculator
 * and writes it to Sanity as a `lead` document. Clinic staff see it in
 * /studio under "🧪 Tool Leads".
 *
 * Required env var: SANITY_API_TOKEN (Editor role).
 *
 * Falls back gracefully when Sanity isn't configured — returns a success
 * response with a synthetic ID so the tool UX still flows (the PDF still
 * downloads, the patient sees their result), but no record is persisted.
 * Useful while the new RenovaAura Sanity project is being set up.
 */
import { NextResponse, type NextRequest } from "next/server";
import { writeClient, sanityEnabled } from "@/sanity/lib/client";

export const dynamic = "force-dynamic";

type Body = {
  tool: "skin-analysis" | "graft-calculator";
  name?: string;
  phone?: string;
  email?: string;
  ageRange?: string;
  city?: string;
  summary?: string;
  inputs?: unknown;
  outputs?: unknown;
  source?: string;
};

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return bad("Invalid JSON body");
  }

  const name = (body.name ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const email = (body.email ?? "").trim();

  if (!body.tool || !["skin-analysis", "graft-calculator"].includes(body.tool)) {
    return bad("Invalid or missing tool identifier");
  }
  if (name.length < 2) return bad("Name is required");
  if (!/^\+?[0-9\s-]{10,}$/.test(phone)) return bad("Valid phone is required");

  // Soft-fail when Sanity isn't wired up yet — the PDF flow still works.
  if (!sanityEnabled) {
    return NextResponse.json({
      ok: true,
      id: `local-${Date.now()}`,
      persisted: false,
      message:
        "Sanity isn't configured yet — lead was not persisted but the PDF will still download.",
    });
  }

  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    return bad(
      "Server is missing SANITY_API_TOKEN. Add it in Vercel env vars and redeploy.",
      500,
    );
  }

  try {
    const client = writeClient(token);
    const doc = await client.create({
      _type: "lead",
      status: "new",
      tool: body.tool,
      name,
      phone,
      email: email || undefined,
      ageRange: body.ageRange || undefined,
      city: body.city || undefined,
      summary: body.summary || undefined,
      inputs: body.inputs ? JSON.stringify(body.inputs, null, 2) : undefined,
      outputs: body.outputs ? JSON.stringify(body.outputs, null, 2) : undefined,
      submittedAt: new Date().toISOString(),
      source: body.source || "/tools",
    });

    return NextResponse.json({ ok: true, id: doc._id, persisted: true });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to save lead — please call the clinic.";
    console.error("[/api/leads] write failed:", err);
    return bad(message, 500);
  }
}
