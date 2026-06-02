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
 *
 * Manual "Refresh website" button:
 *   GET /api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
 *   Clears the Sanity content cache on demand and returns a confirmation
 *   page. Bookmark this URL — clicking it after publishing in the Studio
 *   makes your changes appear immediately, without waiting for the cache.
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

/**
 * Manual refresh "button" — a secret-protected page editors can bookmark.
 * GET /api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
 */
export async function GET(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  const provided = req.nextUrl.searchParams.get("secret");

  if (!secret) {
    return page(
      "Not configured",
      "Set SANITY_REVALIDATE_SECRET in your hosting environment first.",
      false,
    );
  }
  if (provided !== secret) {
    return new NextResponse(
      pageHtml(
        "Access denied",
        "Add your secret to the link: /api/revalidate?secret=YOUR_SECRET",
        false,
        false,
      ),
      { status: 401, headers: { "content-type": "text/html; charset=utf-8" } },
    );
  }

  revalidateTag("sanity", "max");
  return page(
    "Website refreshed ✓",
    "Your latest published changes are now live. Give the site a moment, then reload it.",
    true,
  );
}

function page(title: string, message: string, ok: boolean) {
  return new NextResponse(pageHtml(title, message, ok, true), {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function pageHtml(
  title: string,
  message: string,
  ok: boolean,
  showButton: boolean,
) {
  const accent = ok ? "#3f5e4e" : "#9a3b2f";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title} · RenovaAura</title>
<style>
  :root { color-scheme: light; }
  body { margin:0; min-height:100vh; display:grid; place-items:center;
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    background:#f6f4ef; color:#2c2418; padding:24px; }
  .card { max-width:440px; text-align:center; background:#fff; border:1px solid #e7e2d8;
    border-radius:20px; padding:40px 32px; box-shadow:0 12px 40px rgba(40,30,20,.08); }
  h1 { font-size:24px; margin:0 0 10px; color:${accent}; }
  p { font-size:15px; line-height:1.55; color:#6b6253; margin:0 0 24px; }
  a.btn { display:inline-block; text-decoration:none; background:${accent}; color:#fff;
    font-weight:600; font-size:15px; padding:12px 24px; border-radius:999px; }
  a.home { display:block; margin-top:16px; color:#8a8170; font-size:13px; text-decoration:none; }
</style></head><body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
    ${showButton ? `<a class="btn" href="javascript:location.reload()">Refresh website again</a>` : ""}
    <a class="home" href="https://www.renovaaura.com">← Back to renovaaura.com</a>
  </div>
</body></html>`;
}
