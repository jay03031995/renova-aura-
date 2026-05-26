/**
 * POST /api/bookings
 *
 * Receives a booking submission from the public BookingModal and writes it
 * to Sanity as an `appointment` document. Clinic staff then see it in
 * /studio under "📅 Appointments → 🟠 Needs follow-up (new)".
 *
 * Required env var: SANITY_API_TOKEN (Editor role).
 */
import { NextResponse, type NextRequest } from "next/server";
import { writeClient } from "@/sanity/lib/client";

// Don't try to statically prerender a POST route.
export const dynamic = "force-dynamic";

type Body = {
  name?: string;
  phone?: string;
  email?: string;
  age?: string;
  concern?: string;
  city?: string;
  date?: string;
  time?: string;
  source?: string;
};

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(req: NextRequest) {
  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    return bad(
      "Server is missing SANITY_API_TOKEN. Add it to environment variables and redeploy.",
      500,
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return bad("Invalid JSON body");
  }

  const name = (body.name ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const email = (body.email ?? "").trim();
  if (name.length < 2) return bad("Name is required");
  if (!/^\+?[0-9\s-]{10,}$/.test(phone)) return bad("Valid phone is required");

  try {
    const client = writeClient(token);
    const doc = await client.create({
      _type: "appointment",
      status: "new",
      name,
      phone,
      email: email || undefined,
      ageRange: body.age || undefined,
      concern: body.concern || undefined,
      preferredClinic: body.city || undefined,
      preferredDate: body.date || undefined,
      preferredTime: body.time || undefined,
      submittedAt: new Date().toISOString(),
      source: body.source || "website-booking-modal",
    });

    return NextResponse.json({ ok: true, id: doc._id });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to save appointment — please call the clinic.";
    console.error("[/api/bookings] write failed:", err);
    return bad(message, 500);
  }
}
