import { NextResponse, type NextRequest } from "next/server";
import { writeClient } from "@/sanity/lib/client";

export const dynamic = "force-dynamic";

const EVENT_FIELDS = {
  page_view: "impressions",
  appointment_start: "appointmentStarts",
  appointment_submit: "appointmentSubmissions",
  call_click: "callClicks",
  whatsapp_click: "whatsappClicks",
  directions_click: "directionsClicks",
  cta_click: "ctaClicks",
} as const;

export async function POST(req: NextRequest) {
  const token = process.env.SANITY_API_TOKEN;
  if (!token) return NextResponse.json({ ok: false }, { status: 503 });
  const body = await req.json().catch(() => null) as Record<string, string> | null;
  const field = body?.event && EVENT_FIELDS[body.event as keyof typeof EVENT_FIELDS];
  if (!body || !field) return NextResponse.json({ ok: false }, { status: 400 });
  const day = new Date().toISOString().slice(0, 10);
  const areaSlug = (body.area || "site").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const id = `pageMetric.${day}.${areaSlug}`;
  const client = writeClient(token);
  await client.patch(id).setIfMissing({
    _id: id, _type: "pageMetric", date: day, area: body.area || "Site", city: body.city || "", path: body.path || "",
    impressions: 0, appointmentStarts: 0, appointmentSubmissions: 0, callClicks: 0, whatsappClicks: 0, directionsClicks: 0, ctaClicks: 0,
  }).inc({ [field]: 1 }).commit({ autoGenerateArrayKeys: true });
  return NextResponse.json({ ok: true });
}
