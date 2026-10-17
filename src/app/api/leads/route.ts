/**
 * POST /api/leads
 *
 * Receives a submission from the AI Skin Analysis or Hair Graft Calculator
 * and writes it to Sanity as a `lead` document. Clinic staff see it in
 * /studio under "🧪 Tool Leads".
 *
 * Required env var: SANITY_API_TOKEN (Editor role).
 *
 * Lead persistence is required for success. A report may only be marked
 * complete after this endpoint confirms the Sanity write.
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
    const parsed = (await req.json()) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return bad("Invalid lead submission body");
    }
    body = parsed as Body;
  } catch {
    return bad("Invalid JSON body");
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const idempotencyKey = req.headers.get("idempotency-key") ?? "";

  if (!body.tool || !["skin-analysis", "graft-calculator"].includes(body.tool)) {
    return bad("Invalid or missing tool identifier");
  }
  if (name.length < 2) return bad("Name is required");
  if (!/^\+?[0-9\s-]{10,}$/.test(phone)) return bad("Valid phone is required");
  if (email && (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254)) {
    return bad("Enter a valid email address or leave it blank.");
  }
  if (!/^[a-f0-9-]{36}$/i.test(idempotencyKey)) {
    return bad("Submission key is invalid. Please retry the form.");
  }

  if (!sanityEnabled) {
    return bad("Lead saving is temporarily unavailable. Please try again later or call the clinic.", 503);
  }

  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    return bad(
      "Lead saving is not configured. Please try again later or call the clinic.",
      503,
    );
  }

  try {
    const summary = typeof body.summary === "string" ? body.summary.trim().slice(0, 1000) : undefined;
    const city = typeof body.city === "string" ? body.city.trim().slice(0, 120) : undefined;
    const ageRange = typeof body.ageRange === "string" ? body.ageRange.trim().slice(0, 80) : undefined;
    const source = typeof body.source === "string" ? body.source.trim().slice(0, 300) : "/tools";
    const client = writeClient(token);
    const doc = await client.createIfNotExists({
      _id: `lead-${idempotencyKey}`,
      _type: "lead",
      status: "new",
      tool: body.tool,
      name,
      phone,
      email: email || undefined,
      ageRange: ageRange || undefined,
      city: city || undefined,
      summary: summary || undefined,
      inputs: body.inputs ? JSON.stringify(body.inputs, null, 2) : undefined,
      outputs: body.outputs ? JSON.stringify(body.outputs, null, 2) : undefined,
      submittedAt: new Date().toISOString(),
      source,
    });

    return NextResponse.json({ ok: true, id: doc._id, persisted: true });
  } catch (err) {
    console.error("[/api/leads] Sanity persistence failed", {
      errorName: err instanceof Error ? err.name : "UnknownError",
    });
    return bad(
      "We couldn't save your assessment right now. Please retry, or call the clinic for help.",
      500,
    );
  }
}
