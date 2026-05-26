/**
 * On-demand revalidation endpoint for Sanity.
 *
 * When an editor publishes a document in Sanity Studio, a webhook configured
 * in the Sanity dashboard hits this route. We verify the signature against a
 * shared secret, then invalidate every fetch tagged with "sanity" so the next
 * request to any public page sees the updated content within seconds.
 *
 * Configure the webhook in Sanity:
 *   sanity.io/manage/project/<id>/api/webhooks → Create webhook
 *   URL: https://<your-domain>/api/revalidate
 *   Trigger: Create, Update, Delete (document level)
 *   HTTP method: POST
 *   Secret: same value as SANITY_REVALIDATE_SECRET env var
 *
 * Env vars required (set in .env.local and Vercel):
 *   SANITY_REVALIDATE_SECRET — any random string, shared with the webhook
 */
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type SanityWebhookBody = {
  _type?: string;
  _id?: string;
  slug?: { current?: string };
};

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET;
    if (!secret) {
      return NextResponse.json(
        { message: "Missing SANITY_REVALIDATE_SECRET env var" },
        { status: 500 },
      );
    }

    const { isValidSignature, body } = await parseBody<SanityWebhookBody>(
      req,
      secret,
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 },
      );
    }

    if (!body?._type) {
      return NextResponse.json(
        { message: "Bad webhook payload — missing _type" },
        { status: 400 },
      );
    }

    // Second arg is the stale-while-revalidate window — "max" lets the
    // current cached HTML serve immediately while Next.js regenerates
    // fresh content in the background. See Next 16 revalidating docs.
    revalidateTag("sanity", "max");

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      id: body._id,
      slug: body.slug?.current,
      now: Date.now(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
