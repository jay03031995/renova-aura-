import { parseBody } from "next-sanity/webhook";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type LeadCreatedEvent = {
  _id?: string;
  _type?: string;
  tool?: string;
};

function json(message: string, status: number) {
  return NextResponse.json({ ok: status >= 200 && status < 300, message }, { status });
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_LEAD_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[sanity-lead-webhook] Missing webhook secret configuration");
    return json("Lead notification webhook is not configured.", 503);
  }

  let body: LeadCreatedEvent | null;
  try {
    const parsed = await parseBody<LeadCreatedEvent>(req, secret, false);
    if (parsed.isValidSignature !== true) {
      return json("Invalid webhook signature.", 401);
    }
    body = parsed.body;
  } catch {
    return json("Invalid webhook payload.", 400);
  }

  if (body?._type !== "lead" || !body._id) {
    return json("Expected a created lead document.", 400);
  }
  if (body._id.startsWith("drafts.")) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const recipients = (process.env.SANITY_LEAD_NOTIFICATION_EMAIL ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
  if (!apiKey || !from || recipients.length === 0) {
    console.error("[sanity-lead-webhook] Email provider configuration is incomplete");
    return json("Lead email notifications are not configured.", 503);
  }

  const toolLabel =
    body.tool === "skin-analysis"
      ? "Skin AI assessment"
      : body.tool === "graft-calculator"
        ? "Graft Calculator assessment"
        : "Website assessment";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `sanity-lead-${body._id}`,
      },
      body: JSON.stringify({
        from,
        to: recipients,
        subject: `New RenovaAura lead: ${toolLabel}`,
        text: `A new ${toolLabel} has been saved in Sanity. Open the Studio Tool Leads list to review it and follow up.`,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("[sanity-lead-webhook] Email provider rejected the notification", {
        status: response.status,
      });
      return json("The notification email could not be delivered.", 502);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[sanity-lead-webhook] Email delivery failed", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return json("The notification email could not be delivered.", 502);
  }
}
