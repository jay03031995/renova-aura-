# RenovaAura

Hair Transplant · Plastic Surgery · Dermatology · Wellness · Aesthetics

A modern, EEAT-structured clinical website built with **Next.js 16**, the **App Router**, **Sanity CMS** for editor-managed content, and a CRM-style admin dashboard for appointment management.

## What's in the box

- **Homepage** — 3-slide image carousel hero, hair-transplant pillar, plastic-surgery pillar, WhyUs, Doctors, Results, Testimonials, FAQ, Contact
- **/procedures** — 21 procedure detail pages
  - 11 hair restoration (FUE, FUT, DHI, Sapphire FUE, beard, eyebrow, hairline lowering, PRP, GFC, mesotherapy, female hair transplant)
  - 10 plastic surgery (rhinoplasty, blepharoplasty, facelift, liposuction, breast augmentation, tummy tuck, gynecomastia, lip filler, Botox, thread lift)
- **/doctors**, **/results** — listing pages
- **/studio** — Sanity admin panel with:
  - 📊 Appointments dashboard (live KPIs)
  - 📅 Appointments list (new / contacted / confirmed / completed pipeline)
  - Doctor + Result content management
  - Clinic settings, announcement bar, site SEO
- **/api/bookings** — POST endpoint that saves bookings into Sanity
- **/api/revalidate** — Sanity webhook endpoint for instant content updates
- **EEAT structure** baked in — MedicalProcedure + FAQPage JSON-LD per procedure page, medical-review attribution, doctor credentials, transparent process steps

## Setup (one-time)

### 1. Install (needs ~1GB free disk)

```bash
cd renovaaura
npm install
```

### 2. Create a new Sanity project

1. Go to <https://www.sanity.io/manage>
2. **Create new project** → name it "RenovaAura"
3. Choose **production** as the dataset name
4. From the project's API page:
   - Copy the **Project ID**
   - **CORS origins** → add `http://localhost:3000` with "Allow credentials" ✅
   - **Tokens** → create an **Editor** token, copy the value

### 3. Environment variables

```bash
cp .env.local.example .env.local
```

Then fill in `.env.local`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=<paste from Sanity>
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-11-01
SANITY_API_TOKEN=<paste from Sanity>
SANITY_REVALIDATE_SECRET=<run `openssl rand -hex 32`>
```

### 4. Run the dev server

```bash
npm run dev
```

Open <http://localhost:3000> for the public site, <http://localhost:3000/studio> for the admin.

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo at <https://vercel.com/new>
3. Add the same 4 env vars from `.env.local` to Vercel
4. Deploy
5. Add your Vercel URL to Sanity CORS (with credentials)
6. Visit `https://<your-deploy>.vercel.app/studio` → **Register this studio**

## Where to edit content

| Content | Where |
|---|---|
| Hair / plastic surgery procedure copy | `src/data/procedures.ts` |
| Clinic name, phone, address, hours | `src/data/clinic.ts` (also /studio → Clinic settings) |
| Hero carousel slides | `src/components/home/Hero.tsx` (top of file: `SLIDES`) |
| Color palette | `src/app/globals.css` (`:root` block) |
| Doctors | /studio → Doctors |
| Patient results / before-after | /studio → Patient results |
| Booking form fields | `src/components/BookingModal.tsx` |

## EEAT structure notes

Every procedure detail page includes:

- `MedicalProcedure` schema.org JSON-LD
- `FAQPage` schema.org JSON-LD (eligible for Google FAQ rich snippets)
- Quick facts strip (duration, sessions, downtime, anaesthesia)
- Stepwise process explainer (transparency = trust)
- Suitable-for / contraindication clarity
- Medically-reviewed-by attribution (when set in `procedures.ts`)

## Known v1 limitations

This scaffold gets the structure and visual foundation in place. Items the clinic should review before launch:

- All clinic info in `src/data/clinic.ts` is **placeholder** — replace name/address/phone/email/social
- Hero carousel images are Unsplash placeholders — upload real clinic photography
- Procedure copy in `src/data/procedures.ts` is comprehensive but should be reviewed by the clinical team for accuracy
- Doctor data still has dermaheal-era entries in `src/data/doctors.ts` — add RenovaAura doctors via /studio
- Results gallery has dermaheal-era images in `src/data/site.ts` — replace via /studio

## Tech

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript
- Sanity v5 (CMS + Studio)
- Inter font (Apple SF Pro web equivalent)

## License

Proprietary — © RenovaAura.
