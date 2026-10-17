# Sanity webhooks

The site runs as a server-capable Next.js App Router application (`next build`
and `next start`). Do not deploy it with `output: "export"`: API routes and
on-demand cache revalidation require a server-capable Next.js host.

## RenovaAura Lead Notifications

Create a separate **document webhook** in Sanity Manage → project → API →
Webhooks with these settings:

| Setting | Value |
| --- | --- |
| Name | `RenovaAura Lead Notifications` |
| Dataset | `production` |
| URL | `https://www.renovaaura.com/api/webhooks/sanity-lead` |
| HTTP method | `POST` |
| Trigger | `Create` only |
| Filter | `_type == "lead" && tool in ["skin-analysis", "graft-calculator"]` |
| Projection | `{_type, _id, tool}` |
| API version | `2024-11-01` |
| Include drafts | Off |
| Include versions | Off |
| Secret | Same value as `SANITY_LEAD_WEBHOOK_SECRET` |
| Additional headers | None |

The endpoint verifies Sanity's `sanity-webhook-signature` with
`SANITY_LEAD_WEBHOOK_SECRET`. It sends a minimal notification through Resend;
the message contains the assessment category only, with no patient name,
phone, email, concern details, inputs, or outputs.

## Website content revalidation

Keep the existing signed document webhook separate from lead notifications:

| Setting | Value |
| --- | --- |
| Name | `RenovaAura Website Revalidation` |
| Dataset | `production` |
| URL | `https://www.renovaaura.com/api/revalidate` |
| HTTP method | `POST` |
| Trigger | `Create`, `Update`, and `Delete` |
| Filter | `_type in ["announcementBar", "blogPost", "bodyConcern", "clinicSettings", "concern", "doctor", "eeatPillar", "equipment", "galleryImage", "homepageFaq", "heroSlide", "location", "package", "procedure", "realResult", "redirect", "result", "siteSettings", "testimonial", "trustItem", "video", "whyUsSection"]` |
| Projection | `{_type, _id}` |
| API version | `2024-11-01` |
| Include drafts | Off |
| Include versions | Off |
| Secret | Same value as `SANITY_REVALIDATE_SECRET` |
| Additional headers | None |

The server fetches content directly from Sanity (not the Sanity CDN), caches
those requests with the `sanity` Next.js tag, and immediately expires that tag
after a valid webhook. The one-hour interval is a fallback if Sanity cannot
deliver a webhook.

## Environment variables

Set these in local development and the production hosting environment. Keep
the two webhook secrets independent.

```dotenv
SANITY_API_TOKEN=
SANITY_REVALIDATE_SECRET=
SANITY_LEAD_WEBHOOK_SECRET=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
SANITY_LEAD_NOTIFICATION_EMAIL=
```

`RESEND_FROM_EMAIL` must use a sender domain verified in Resend.
`SANITY_LEAD_NOTIFICATION_EMAIL` can contain comma-separated recipients. Add
or rotate secrets in both Sanity Manage and the hosting environment, then
redeploy or restart the server.
