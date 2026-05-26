/**
 * Single source of truth for RenovaAura's two service pillars:
 *   1. Hair restoration (11 procedures) — primary homepage focus
 *   2. Plastic surgery & aesthetics (10 procedures) — secondary
 *
 * The /procedures/[pillar]/[slug] page reads from this file to render
 * a full detail page per procedure. Replace the placeholder copy below
 * with clinic-reviewed medical content before launch.
 *
 * EEAT structure baked in:
 *  - `headline` + `overview`: clear answer-first description
 *  - `quick`: duration/downtime facts patients want up front
 *  - `process`: stepwise transparency of what happens in clinic
 *  - `benefits`, `suitableFor`, `keyPoints`: discoverability + clarity
 *  - `faqs`: explicit Q&A (great for Google FAQ rich snippets)
 *  - `medicallyReviewedBy` / `lastReviewed`: signals clinical authority
 */

export type ProcedurePillar = "hair-transplant" | "plastic-surgery";

export type Procedure = {
  slug: string;
  name: string;
  pillar: ProcedurePillar;
  tag?: string; // e.g. "Most popular", "Walk-in 60 min"
  headline: string;
  overview: string;
  /**
   * Card image URL. Currently Unsplash placeholders curated per procedure
   * category — replace with clinic photography (uploaded via Sanity) before
   * launch. Falls back to PILLAR_DEFAULT_IMAGE when missing.
   */
  image?: string;
  quick: {
    duration: string;
    sessions: string;
    downtime: string;
    anaesthesia?: string;
  };
  keyPoints: string[];
  suitableFor: string[];
  process: { t: string; d: string }[];
  benefits: { i: string; t: string; d: string }[];
  faqs: { q: string; a: string }[];
  medicallyReviewedBy?: string; // e.g. "Dr. A. Sharma, MS Plastic Surgery"
  lastReviewed?: string; // ISO date for EEAT trust signal
};

/** Curated placeholder images by procedure category (Unsplash, no auth). */
const IMG = {
  hairSurgery:
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80",
  hairHealthy:
    "https://images.unsplash.com/photo-1620331317065-6f9f4b6bb13e?w=800&q=80",
  hairWoman:
    "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&q=80",
  beard:
    "https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=800&q=80",
  eyebrow:
    "https://images.unsplash.com/photo-1583241475880-083f84372725?w=800&q=80",
  injection:
    "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80",
  faceTreatment:
    "https://images.unsplash.com/photo-1614859275206-fbcb27e57057?w=800&q=80",
  faceConsult:
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
  eyesCloseup:
    "https://images.unsplash.com/photo-1469275606726-7651dcaba2ad?w=800&q=80",
  noseProfile:
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
  bodyContour:
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
  lips:
    "https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=800&q=80",
};

export const PILLAR_DEFAULT_IMAGE: Record<ProcedurePillar, string> = {
  "hair-transplant": IMG.hairSurgery,
  "plastic-surgery": IMG.faceConsult,
};

// =========================================================================
// HAIR TRANSPLANT — 11 procedures
// =========================================================================

const HAIR: Procedure[] = [
  {
    slug: "fue-hair-transplant",
    image: IMG.hairSurgery,
    name: "FUE Hair Transplant",
    pillar: "hair-transplant",
    tag: "Most popular",
    headline:
      "Natural hairline restoration using your own follicles — no linear scar, no stitches.",
    overview:
      "Follicular Unit Extraction (FUE) is RenovaAura's most-requested hair restoration procedure. Individual follicles are harvested one-by-one from the back of the scalp using a precision punch (0.8–1.0 mm), then placed into the recipient area at the angle and density of your natural hair growth. Because no scalp strip is removed, recovery is shorter than FUT and the donor area shows only tiny dot scars that are invisible under short haircuts.",
    quick: {
      duration: "6–10 hours (single day)",
      sessions: "1 — top-up if needed at 9–12 months",
      downtime: "2–3 days off work; full healing in 10 days",
      anaesthesia: "Local",
    },
    keyPoints: [
      "Permanent results from your own DHT-resistant donor follicles",
      "No linear scar — tiny dot scars only, invisible at typical haircuts",
      "Up to 3,500–4,000 grafts in a single sitting",
      "Resume office work in 3 days, hair growth visible by month 4",
    ],
    suitableFor: [
      "Norwood stage II–V male pattern baldness",
      "Stable hair loss for 12+ months",
      "Sufficient donor density on the back/sides of the scalp",
      "Patients who prefer short haircuts and want no visible scar",
    ],
    process: [
      {
        t: "Consultation & graft planning",
        d: "Trichoscopy assessment of donor and recipient, hairline design with your input, count of grafts needed, and review of medical history.",
      },
      {
        t: "Donor harvesting (3–4 hr)",
        d: "Local anaesthesia, then individual follicular units extracted with a 0.8–1.0 mm punch under magnification. You can rest, eat, watch a film during this stage.",
      },
      {
        t: "Recipient site creation (1–2 hr)",
        d: "Micro-incisions made at the precise angle, depth and direction of your natural hair, designing a soft, age-appropriate hairline.",
      },
      {
        t: "Graft placement (2–3 hr)",
        d: "Each follicle is hand-placed by trained technicians to achieve natural density and direction.",
      },
      {
        t: "Aftercare & follow-up",
        d: "Day-1 wash demonstration, written aftercare protocol, growth photos at 3, 6, 9 and 12 months.",
      },
    ],
    benefits: [
      {
        i: "✦",
        t: "Truly natural look",
        d: "Hairline designed to suit your face shape and age — never a straight 'helmet' line.",
      },
      {
        i: "✦",
        t: "No linear scar",
        d: "Dot scars only — wear your hair as short as you like, no give-away.",
      },
      {
        i: "✦",
        t: "Permanent results",
        d: "Donor follicles are genetically DHT-resistant — transplanted hair stays for life.",
      },
      {
        i: "✦",
        t: "Single-day procedure",
        d: "Walk in morning, leave evening, return to office in 3 days.",
      },
    ],
    faqs: [
      {
        q: "Is FUE painful?",
        a: "No — the procedure is done under local anaesthesia, so you'll feel only the initial injections. Most patients describe the day itself as more 'long' than 'painful' and read or watch films through it.",
      },
      {
        q: "When will I see results?",
        a: "Transplanted hair sheds in weeks 2–4 (expected), starts regrowing from month 3, and full density is visible at 9–12 months.",
      },
      {
        q: "How many grafts will I need?",
        a: "Typically 1,500–3,500 depending on your Norwood stage and goals. Your trichoscopy assessment will give you an exact number before you commit.",
      },
      {
        q: "What's the difference between FUE, DHI and FUT?",
        a: "FUT removes a strip and leaves a linear scar (cheapest per graft, but visible). FUE extracts individual follicles (no linear scar). DHI uses a Choi pen to extract and implant in one step (faster placement, slightly higher cost). All three give permanent results.",
      },
    ],
  },
  {
    slug: "fut-hair-transplant",
    image: IMG.hairSurgery,
    name: "FUT Hair Transplant",
    pillar: "hair-transplant",
    headline:
      "Strip-based hair restoration that yields the highest graft count per session.",
    overview:
      "Follicular Unit Transplantation (FUT) removes a thin strip of scalp from the donor area, then dissects it into individual follicular units under microscope before transplanting them into the recipient area. FUT is best suited for patients needing very high graft counts in one sitting (4,000+) and who can tolerate a fine linear scar (easily hidden under medium-length hair).",
    quick: {
      duration: "5–8 hours (single day)",
      sessions: "1",
      downtime: "5–7 days off work for sutures",
      anaesthesia: "Local",
    },
    keyPoints: [
      "Highest graft yield per session — 4,000–5,000 grafts possible",
      "Lower per-graft cost than FUE/DHI",
      "Leaves a fine linear scar (1–2 mm wide) at the back of scalp",
      "Best for patients with significant baldness who don't wear hair very short",
    ],
    suitableFor: [
      "Norwood stage IV–VII with high graft requirements",
      "Patients comfortable with medium or longer hair length",
      "Budget-conscious patients seeking maximum density",
    ],
    process: [
      { t: "Consultation & planning", d: "Donor scalp laxity test, graft count, scar discussion, hairline design." },
      { t: "Strip excision", d: "Thin scalp strip removed under local anaesthesia, donor closed with trichophytic sutures to minimise scar visibility." },
      { t: "Microscopic graft dissection", d: "Strip dissected into 1, 2, 3, 4-hair grafts under high-magnification microscopes." },
      { t: "Recipient site creation & placement", d: "Same as FUE — angle/depth-controlled implantation." },
      { t: "Aftercare & suture removal at day 10", d: "Standard hair-transplant aftercare; suture removal at follow-up." },
    ],
    benefits: [
      { i: "✦", t: "Maximum grafts per day", d: "Get the most coverage in a single sitting." },
      { i: "✦", t: "Cost-effective per graft", d: "Best price-per-graft of all hair-restoration techniques." },
      { i: "✦", t: "Preserves donor density", d: "Less overall donor area used compared to large-volume FUE." },
      { i: "✦", t: "Microscope-dissected grafts", d: "Higher survival rate of dissected follicles." },
    ],
    faqs: [
      { q: "Will the scar be visible?", a: "Only if you cut your hair very short (grade 1–2). At medium hair length or longer the scar is fully hidden. The trichophytic closure technique we use grows hair through the scar to camouflage it further." },
      { q: "Is FUT outdated?", a: "No — FUT remains the gold standard when very high graft counts are needed. FUE is more popular because most patients want no visible scar." },
    ],
  },
  {
    slug: "dhi-hair-transplant",
    image: IMG.hairSurgery,
    name: "DHI Hair Transplant",
    pillar: "hair-transplant",
    tag: "Premium",
    headline: "Direct Hair Implantation with the Choi pen — extract and implant in one step.",
    overview:
      "Direct Hair Implantation (DHI) uses a specialised Choi implanter pen that loads each follicle and places it directly into the recipient area in one motion — no separate channel creation step. This results in less time out-of-body for each graft, potentially higher survival rates, and tighter density control. DHI is RenovaAura's premium hair restoration option, recommended for patients seeking the highest precision.",
    quick: { duration: "6–10 hours", sessions: "1", downtime: "2–3 days", anaesthesia: "Local" },
    keyPoints: [
      "Choi pen places follicles directly — less time outside the body",
      "Highest possible density (up to 70–80 follicles per cm²)",
      "Best precision for hairline design and eyebrow/beard work",
      "Premium pricing — typically 30–50% higher than standard FUE",
    ],
    suitableFor: [
      "Patients seeking maximum density and precision",
      "Hairline-only refinements",
      "Crown, eyebrow and beard transplants where every follicle counts",
      "Norwood stage II–IV",
    ],
    process: [
      { t: "Consultation & graft planning", d: "Same as FUE — trichoscopy, hairline design, graft count." },
      { t: "Donor harvesting", d: "Individual follicle extraction under magnification, kept in storage solution." },
      { t: "Loading into Choi pen", d: "Each follicle is loaded into a Choi implanter pen ready for direct placement." },
      { t: "Direct implantation", d: "Surgeon places each follicle at the precise angle, depth, and direction using the pen — no separate slit-making step." },
      { t: "Aftercare", d: "Same protocols as FUE — written guide, day-1 wash demo, photo follow-ups." },
    ],
    benefits: [
      { i: "✦", t: "Higher graft survival", d: "Follicles spend less time out-of-body, improving viability." },
      { i: "✦", t: "Maximum density", d: "Can achieve 70–80 follicles per cm² — the highest of any technique." },
      { i: "✦", t: "Precision for small areas", d: "Best choice for hairline refinement, eyebrows and beards." },
      { i: "✦", t: "No need to shave fully", d: "Some DHI protocols allow partial shaving — better for women." },
    ],
    faqs: [
      { q: "Is DHI better than FUE?", a: "Not 'better' — different. DHI gives tighter density and precision but costs more and takes longer. For most male pattern baldness cases, FUE delivers identical aesthetic results." },
      { q: "Do I need to shave my head?", a: "For full-scalp DHI, yes (or very short). For partial DHI (women, partial restoration) we can work with longer donor hair." },
    ],
  },
  {
    slug: "sapphire-fue-hair-transplant",
    image: IMG.hairHealthy,
    name: "Sapphire FUE Hair Transplant",
    pillar: "hair-transplant",
    headline: "FUE with sapphire-tipped blades for finer channels and faster healing.",
    overview:
      "Sapphire FUE is a variant of standard FUE that uses sapphire-tipped blades (instead of steel) to create the recipient site channels. The sapphire blade is sharper and smoother, allowing finer micro-incisions — meaning denser implantation, less tissue trauma, and faster healing.",
    quick: { duration: "6–9 hours", sessions: "1", downtime: "2 days", anaesthesia: "Local" },
    keyPoints: [
      "Finer recipient channels = denser, more natural look",
      "Less tissue damage = faster healing (days, not weeks)",
      "Reduced scabbing and post-op redness",
      "Same permanent results as standard FUE",
    ],
    suitableFor: ["Anyone considering standard FUE — Sapphire is an upgrade option", "Patients wanting fastest possible healing", "Hairline refinements"],
    process: [
      { t: "Consultation & planning", d: "Identical to standard FUE." },
      { t: "Donor extraction", d: "Same individual-follicle extraction with precision punch." },
      { t: "Sapphire-blade channel creation", d: "Sapphire-tipped blade makes finer, V-shaped channels in the recipient area." },
      { t: "Implantation", d: "Follicles placed into the fine channels for maximum density." },
      { t: "Aftercare", d: "Standard FUE post-op protocol — slightly faster recovery typical." },
    ],
    benefits: [
      { i: "✦", t: "Finer channels", d: "Sapphire blade is sharper than steel, creating smaller incisions." },
      { i: "✦", t: "Less swelling", d: "Reduced tissue trauma means less post-op puffiness." },
      { i: "✦", t: "Higher density", d: "Smaller channels mean follicles can be placed closer together." },
      { i: "✦", t: "Faster healing", d: "Most patients report scabs resolving in 5–7 days vs 10+." },
    ],
    faqs: [
      { q: "Is Sapphire FUE worth the extra cost?", a: "For most patients, yes — the finer healing and density improvement are visible. If budget is a concern, standard FUE gives 90% of the same result." },
    ],
  },
  {
    slug: "beard-transplant",
    image: IMG.beard,
    name: "Beard Transplant",
    pillar: "hair-transplant",
    headline: "Fill patchy beards, scars, or design a full beard from scratch using your own scalp hair.",
    overview:
      "Beard transplantation uses FUE or DHI techniques to harvest follicles from the back of the scalp and transplant them into beard, moustache, sideburn or goatee areas. Ideal for patchy growth, scar coverage, or for men who want a denser, fuller beard than nature gave them.",
    quick: { duration: "4–7 hours", sessions: "1 — touch-up at 9 months if needed", downtime: "5–7 days for full social downtime", anaesthesia: "Local" },
    keyPoints: [
      "Permanent — transplanted scalp hair retains its growth pattern in the beard",
      "500–2,500 grafts depending on coverage needed",
      "Natural angles designed to match your existing beard or your chosen style",
      "Trimmable and shave-able like a natural beard",
    ],
    suitableFor: [
      "Patchy beard growth",
      "Scar coverage (acne, surgical)",
      "Sparse moustache or sideburns",
      "Designing a denser beard for aesthetic reasons",
    ],
    process: [
      { t: "Beard design", d: "Discuss shape, density, sideburn integration; mark areas with you." },
      { t: "Donor extraction", d: "Follicles harvested from back/sides of scalp (chest hair as alternative)." },
      { t: "Beard channel creation", d: "Angled at 5–15° from skin to mimic natural beard growth direction." },
      { t: "Placement", d: "Single-hair grafts at edges, 2-hair grafts for density." },
      { t: "Aftercare", d: "No shaving for 10 days, soft cleanse only; first trim at week 4." },
    ],
    benefits: [
      { i: "✦", t: "Cover patchy areas", d: "Fill gaps in beard, moustache, or sideburns naturally." },
      { i: "✦", t: "Scar camouflage", d: "Excellent for hiding acne scars, burn scars, or surgical scars." },
      { i: "✦", t: "Permanent & natural", d: "Grows like a regular beard — trim, shave, style as normal." },
      { i: "✦", t: "Custom design", d: "Choose your final beard shape with the surgeon before starting." },
    ],
    faqs: [
      { q: "Will the beard hair fall out and regrow?", a: "Yes — like scalp transplants, the transplanted hair sheds in weeks 2–4 then regrows from month 3. Final density at month 9–12." },
      { q: "Can it be shaved or trimmed?", a: "Absolutely — once fully healed (4 weeks), treat it like any beard." },
    ],
  },
  {
    slug: "eyebrow-transplant",
    image: IMG.eyebrow,
    name: "Eyebrow Transplant",
    pillar: "hair-transplant",
    headline: "Restore sparse, thinning or scarred eyebrows with permanent natural-hair grafts.",
    overview:
      "Eyebrow transplantation uses FUE or DHI to place individual scalp follicles into the brow area, restoring shape, fullness, and growth direction. Suitable for over-plucked, thinning, scarred or naturally sparse brows.",
    quick: { duration: "2–4 hours", sessions: "1", downtime: "3–5 days", anaesthesia: "Local" },
    keyPoints: [
      "100–400 grafts per brow depending on coverage needed",
      "Each follicle placed at the precise angle of natural brow growth",
      "Permanent results — no need for daily filling-in",
      "Trimmable; will need monthly trim as scalp hair grows longer than brow hair",
    ],
    suitableFor: [
      "Over-plucked or thinning eyebrows",
      "Eyebrow scars (trauma, surgical, burn)",
      "Trichotillomania damage",
      "Naturally sparse brows",
      "Patients tired of daily microblading/tattoo maintenance",
    ],
    process: [
      { t: "Brow design", d: "Detailed brow mapping with you — shape, arch, density." },
      { t: "Donor extraction", d: "Single-hair follicles extracted from above the ear (finer texture matches brow hair best)." },
      { t: "Implantation", d: "Each follicle placed at a precise 5–10° angle to mimic natural brow growth." },
      { t: "Aftercare", d: "No water on brows for 3 days, gentle saline mist; first trim at week 6." },
    ],
    benefits: [
      { i: "✦", t: "Permanent solution", d: "No more daily pencil or microblading touch-ups." },
      { i: "✦", t: "Natural angle & flow", d: "Surgeon-designed brow that suits your face." },
      { i: "✦", t: "Hides scars", d: "Covers brow scars and patchy areas seamlessly." },
    ],
    faqs: [
      { q: "Will they need trimming?", a: "Yes — scalp hair grows longer than brow hair, so monthly trim is part of the maintenance." },
    ],
  },
  {
    slug: "hairline-lowering",
    image: IMG.hairHealthy,
    name: "Hairline Lowering",
    pillar: "hair-transplant",
    headline: "Lower a high or receded hairline by 1–4 cm in a single sitting.",
    overview:
      "Hairline lowering can be done two ways: surgically (forehead reduction — a strip of forehead skin is excised and the hairline advanced) or via transplantation (FUE/DHI grafts to create a lower hairline). RenovaAura usually recommends transplant-based lowering for its scarless result.",
    quick: { duration: "5–8 hours", sessions: "1–2", downtime: "5–7 days", anaesthesia: "Local" },
    keyPoints: [
      "Lowers hairline by 1–4 cm to balance facial proportions",
      "Useful for naturally high foreheads or post-receding hairlines",
      "Transplant approach: no scar; surgical approach: hidden in hairline",
      "Permanent result",
    ],
    suitableFor: ["Naturally high or 'long' foreheads", "Mild forehead asymmetry", "Patients seeking a more balanced face shape"],
    process: [
      { t: "Forehead measurement", d: "Mark new hairline position with you, confirming aesthetic balance." },
      { t: "Donor extraction", d: "FUE harvest of needed grafts." },
      { t: "Implantation", d: "Grafts placed along new hairline with soft, irregular front edge for natural look." },
    ],
    benefits: [
      { i: "✦", t: "Better facial balance", d: "A hairline 1–4 cm lower can transform face proportions." },
      { i: "✦", t: "Permanent", d: "No regular maintenance needed." },
    ],
    faqs: [{ q: "Surgery or transplant?", a: "Transplant for most — surgical forehead reduction works faster but leaves a thin scar along the hairline. We'll review both options at consultation." }],
  },
  {
    slug: "prp-hair-treatment",
    image: IMG.injection,
    name: "PRP for Hair Loss",
    pillar: "hair-transplant",
    headline: "Concentrated platelets from your own blood, injected to slow loss and stimulate regrowth.",
    overview:
      "Platelet-Rich Plasma (PRP) therapy involves drawing a small amount of your blood, spinning it in a centrifuge to concentrate the platelets, and injecting that platelet-rich plasma into the scalp. The growth factors released stimulate dormant follicles, slow ongoing miniaturisation, and improve overall hair quality. Best results in early-stage thinning before significant baldness has set in.",
    quick: { duration: "45–60 minutes per session", sessions: "4 initial sessions, 1 month apart, then 6-monthly maintenance", downtime: "None", anaesthesia: "Topical only" },
    keyPoints: [
      "Non-surgical — walk in, walk out same hour",
      "Uses your own blood — no allergic reaction risk",
      "Best for early thinning, not for fully bald areas",
      "Can be combined with hair transplant for faster recovery",
    ],
    suitableFor: [
      "Early-stage male pattern baldness (Norwood I–III)",
      "Female pattern hair thinning (Ludwig I–II)",
      "Post-transplant maintenance to protect surrounding native hair",
      "Patients not ready for surgical hair restoration",
    ],
    process: [
      { t: "Blood draw", d: "30 ml drawn from arm into specialised PRP tubes." },
      { t: "Centrifugation", d: "Tubes spun to separate plasma from red blood cells; platelet-rich layer extracted." },
      { t: "Scalp activation", d: "Microneedling to create micro-channels and enhance absorption." },
      { t: "PRP injection", d: "Plasma injected into thinning areas with insulin-fine needle." },
    ],
    benefits: [
      { i: "✦", t: "Slows hair loss", d: "Strengthens existing follicles and protects against further thinning." },
      { i: "✦", t: "Stimulates regrowth", d: "Visible thickening in 3–6 months for most patients." },
      { i: "✦", t: "Zero downtime", d: "Back to office immediately after the session." },
      { i: "✦", t: "Combines with transplant", d: "Boosts graft survival and faster regrowth post-FUE." },
    ],
    faqs: [
      { q: "Does PRP regrow bald areas?", a: "No — it cannot regrow hair on fully bald scalp. It works on miniaturising follicles that are still alive but weak." },
      { q: "How soon will I see results?", a: "Reduced shedding from session 2; visible thickening from month 3–6." },
    ],
  },
  {
    slug: "gfc-hair-therapy",
    image: IMG.injection,
    name: "GFC Hair Therapy",
    pillar: "hair-transplant",
    headline: "Growth Factor Concentrate — next-generation PRP with higher growth factor yield.",
    overview:
      "Growth Factor Concentrate (GFC) is an advanced version of PRP that uses specialised activator gels to release a much higher concentration of growth factors (PDGF, VEGF, IGF, EGF) from your platelets. The result is typically faster, more pronounced regrowth than standard PRP — at a slightly higher per-session cost.",
    quick: { duration: "60–75 minutes", sessions: "4 sessions monthly, then 6-monthly maintenance", downtime: "None", anaesthesia: "Topical" },
    keyPoints: [
      "Up to 10× more growth factors than standard PRP",
      "Cell-free formulation — no red blood cells injected",
      "Faster visible response (often by session 2)",
      "Higher cost than PRP",
    ],
    suitableFor: ["Same as PRP — early to moderate hair thinning", "Patients who didn't respond well to PRP", "Post-transplant maintenance"],
    process: [
      { t: "Blood draw", d: "16 ml of your blood drawn." },
      { t: "Two-tube activation", d: "Activator gel releases growth factors at much higher concentration." },
      { t: "Scalp prep", d: "Microneedling for absorption." },
      { t: "Injection", d: "GFC injected across thinning areas." },
    ],
    benefits: [
      { i: "✦", t: "Higher concentration", d: "More growth factors per ml than standard PRP." },
      { i: "✦", t: "Faster response", d: "Most patients see improvement by session 2." },
      { i: "✦", t: "No red blood cells", d: "Cell-free injection — less inflammation." },
    ],
    faqs: [{ q: "GFC or PRP?", a: "GFC if your scalp didn't respond to PRP or if you want faster results and don't mind the extra cost. PRP if budget-conscious." }],
  },
  {
    slug: "mesotherapy-for-hair",
    image: IMG.injection,
    name: "Mesotherapy for Hair",
    pillar: "hair-transplant",
    headline: "Custom cocktail of vitamins, peptides and DHT-blockers injected into the scalp.",
    overview:
      "Mesotherapy delivers a customised cocktail of biotin, peptides, vitamins, minerals, and DHT-blockers (like dutasteride) directly into the scalp via fine-needle injections. By bypassing the bloodstream, the active ingredients reach the follicles in much higher concentration than oral supplements. Used both as a standalone hair-loss treatment and as a booster alongside PRP/GFC.",
    quick: { duration: "45 minutes per session", sessions: "6–8 weekly sessions, then monthly maintenance", downtime: "None", anaesthesia: "Topical" },
    keyPoints: [
      "Directly nourishes follicles (no first-pass liver metabolism)",
      "Cocktail tailored to your specific cause of hair loss",
      "Can include scalp dutasteride for ongoing DHT blockade",
      "Often combined with PRP/GFC for synergy",
    ],
    suitableFor: [
      "Diffuse thinning of any cause",
      "Telogen effluvium (stress-related shedding)",
      "Hormonal hair loss in women",
      "Post-pregnancy hair loss",
    ],
    process: [
      { t: "Scalp assessment", d: "Identify type and cause of hair loss to customise the cocktail." },
      { t: "Cocktail preparation", d: "Selected actives drawn into syringe under sterile prep." },
      { t: "Injection", d: "Multiple superficial scalp injections, 1–2 cm apart, across thinning zones." },
    ],
    benefits: [
      { i: "✦", t: "Targeted nutrition", d: "Active ingredients reach follicles directly." },
      { i: "✦", t: "Customisable", d: "Cocktail adjusted to your cause of hair loss." },
      { i: "✦", t: "Zero downtime", d: "Resume normal activity immediately." },
    ],
    faqs: [{ q: "How is mesotherapy different from PRP?", a: "PRP uses your own platelets. Mesotherapy uses external actives (vitamins, peptides, DHT-blockers). They're commonly combined — PRP to stimulate, mesotherapy to nourish." }],
  },
  {
    slug: "female-hair-transplant",
    image: IMG.hairWoman,
    name: "Female Hair Transplant",
    pillar: "hair-transplant",
    headline: "Specialised hair restoration for women — no full head shave required.",
    overview:
      "Female hair loss patterns differ from male — typically diffuse thinning across the crown rather than receding hairline. RenovaAura offers two female-specific approaches: (1) partial-shave FUE where only the donor strip is shaved (hidden under top hair), and (2) DHI through long hair, which requires no shaving at all but takes longer.",
    quick: { duration: "6–10 hours", sessions: "1–2 depending on extent", downtime: "3–5 days", anaesthesia: "Local" },
    keyPoints: [
      "No full head shave required (partial-shave or no-shave options)",
      "Crown densification is the most common goal",
      "Hairline lowering and temple-fill also commonly done",
      "Combine with PRP/GFC to protect surrounding native hair",
    ],
    suitableFor: [
      "Female pattern hair thinning (Ludwig I–II)",
      "Post-traction alopecia from tight hairstyles",
      "Temple recession",
      "Patients with stable hair loss for 12+ months",
    ],
    process: [
      { t: "Detailed scalp & hormonal workup", d: "Female hair loss often has reversible causes — we rule them out first." },
      { t: "Partial shave or no-shave decision", d: "Based on your hair length and extent of transplant." },
      { t: "Standard FUE or DHI protocol", d: "Same as male transplant from this point onward." },
    ],
    benefits: [
      { i: "✦", t: "Discreet recovery", d: "Partial-shave means the donor area is hidden under your existing hair." },
      { i: "✦", t: "Targeted densification", d: "Crown, hairline, or temples — wherever you've lost density." },
      { i: "✦", t: "Permanent solution", d: "Same permanence as male hair transplant." },
    ],
    faqs: [
      { q: "Do I really need a transplant or can medications help?", a: "Always try minoxidil + nutritional/hormonal correction first — these reverse early female hair loss in many cases. Transplant is for stable, established loss." },
      { q: "Will my scalp show after?", a: "Not in the donor (partial-shave or no-shave). Recipient area heals in 5–10 days with minor scabbing." },
    ],
  },
];

// =========================================================================
// PLASTIC SURGERY — 10 procedures
// =========================================================================

const PLASTIC: Procedure[] = [
  {
    slug: "rhinoplasty",
    image: IMG.noseProfile,
    name: "Rhinoplasty (Nose Reshaping)",
    pillar: "plastic-surgery",
    tag: "Most popular",
    headline:
      "Reshape the nose to improve facial harmony — closed or open technique, with breathing-function preservation.",
    overview:
      "Rhinoplasty corrects nasal bridge bumps, droopy tips, wide nostrils, asymmetry, or breathing obstruction. RenovaAura offers both closed (incisions inside the nose, no external scar) and open (small scar on columella, allowing more precise reshaping) approaches. Functional septoplasty can be combined for patients with breathing issues.",
    quick: { duration: "2–4 hours", sessions: "1", downtime: "7–10 days social downtime, swelling resolves over 6–12 months", anaesthesia: "General" },
    keyPoints: [
      "Closed or open approach based on the change needed",
      "Functional improvements (deviated septum, valve correction) can be combined",
      "Cartilage-preserving techniques for natural, long-lasting result",
      "1-night hospital stay typical",
    ],
    suitableFor: [
      "Dorsal hump correction",
      "Droopy or bulbous tip refinement",
      "Wide nostril narrowing (alar reduction)",
      "Asymmetry correction",
      "Functional breathing improvement (septoplasty + rhinoplasty)",
    ],
    process: [
      { t: "Detailed consultation", d: "3D imaging where appropriate, simulation of expected result, discussion of approach." },
      { t: "Pre-operative workup", d: "Blood tests, ECG, anaesthesia review." },
      { t: "Surgery (day 0)", d: "2–4 hour procedure under general anaesthesia." },
      { t: "Recovery — week 1", d: "Splint on nose for 7 days, bruising around eyes resolves by day 10." },
      { t: "Recovery — months 1–12", d: "Final shape emerges over 12 months as residual swelling resolves." },
    ],
    benefits: [
      { i: "✦", t: "Facial harmony", d: "Reshaped nose proportional to face." },
      { i: "✦", t: "Breathing improvement", d: "Septoplasty combined when needed." },
      { i: "✦", t: "Natural result", d: "Cartilage-preserving techniques avoid the 'operated' look." },
    ],
    faqs: [
      { q: "Will my nose look obvious 'done'?", a: "Modern rhinoplasty aims for refinement, not transformation — most patients are told 'you look great' but not 'did you have surgery?'" },
      { q: "When can I return to work?", a: "Office work — 10 days. Strenuous exercise — 6 weeks. Final shape — 12 months." },
    ],
  },
  {
    slug: "blepharoplasty",
    image: IMG.eyesCloseup,
    name: "Blepharoplasty (Eyelid Surgery)",
    pillar: "plastic-surgery",
    headline: "Refresh tired or hooded eyes — upper, lower, or both eyelids.",
    overview:
      "Blepharoplasty removes excess skin (upper eyelid) and/or under-eye bags (lower eyelid) to give a more rested, youthful appearance without changing the fundamental eye shape. Often done under local with sedation; recovery is quick because the eyelid heals exceptionally well.",
    quick: { duration: "1–3 hours", sessions: "1", downtime: "7–10 days", anaesthesia: "Local + sedation, or General" },
    keyPoints: [
      "Upper, lower, or both lids in single session",
      "Local anaesthesia with sedation possible for upper lid only",
      "Incisions hidden in the natural eyelid crease",
      "Functional improvement for severe upper-lid hooding affecting vision",
    ],
    suitableFor: [
      "Upper eyelid hooding (skin overhanging the lash line)",
      "Under-eye bags / puffiness",
      "Looking 'tired' despite enough sleep",
      "Vision obstruction from severe upper eyelid skin excess",
    ],
    process: [
      { t: "Consultation", d: "Identify whether upper, lower, or both lids need addressing; map skin and fat excess." },
      { t: "Surgery", d: "1–3 hour procedure; upper lid only is often done under local anaesthesia." },
      { t: "Recovery", d: "Cold compresses days 1–3, sutures removed day 5–7, makeup OK by day 10." },
    ],
    benefits: [
      { i: "✦", t: "Refreshed appearance", d: "Look rested even when you're not." },
      { i: "✦", t: "Hidden incisions", d: "Scars hide perfectly in the natural eyelid crease." },
      { i: "✦", t: "Long-lasting", d: "Results last 10+ years for upper lid, even longer for lower." },
    ],
    faqs: [
      { q: "Will my eyes look 'different'?", a: "No — blepharoplasty doesn't change eye shape, only removes excess skin/fat. You'll look like you, just refreshed." },
    ],
  },
  {
    slug: "facelift",
    image: IMG.faceTreatment,
    name: "Facelift (SMAS / Deep-Plane)",
    pillar: "plastic-surgery",
    headline: "Reposition deeper facial tissues for a natural, lasting rejuvenation — not just skin tightening.",
    overview:
      "Modern facelift (SMAS or deep-plane) goes beyond surface skin tightening to reposition the underlying facial fascia and muscle layer. This corrects jowls, marionette lines, and mid-face descent while preserving facial expression. The result is natural and long-lasting (10–15 years) — unlike skin-only lifts which look 'pulled'.",
    quick: { duration: "4–6 hours", sessions: "1", downtime: "14 days social downtime, 6 weeks for exercise", anaesthesia: "General" },
    keyPoints: [
      "SMAS or deep-plane technique — not skin-only",
      "Addresses jowls, jawline, mid-face, and neck",
      "Often combined with blepharoplasty and fat grafting",
      "Long-lasting — 10–15 years typical",
    ],
    suitableFor: [
      "Visible jowl formation",
      "Mid-face descent / 'flattening' of cheeks",
      "Loose neck skin (combined with neck lift)",
      "Patients aged 45–70 typically",
    ],
    process: [
      { t: "Consultation & planning", d: "Discuss approach (mid-face, full-face, plus neck), realistic outcomes, recovery plan." },
      { t: "Pre-op workup", d: "Blood tests, ECG, anaesthesia review, lifestyle adjustment (stop smoking 6 weeks before)." },
      { t: "Surgery", d: "4–6 hour procedure under general anaesthesia, 1–2 nights in hospital." },
      { t: "Recovery", d: "Drain removed day 2–3, sutures out by day 14, full activity at 6 weeks." },
    ],
    benefits: [
      { i: "✦", t: "Natural result", d: "Repositioned tissues, not 'pulled' skin." },
      { i: "✦", t: "Long-lasting", d: "10–15 years before any revision typically needed." },
      { i: "✦", t: "Comprehensive", d: "Addresses face, jowls, and neck in one operation." },
    ],
    faqs: [
      { q: "Will I look 'done'?", a: "Done well, no — modern deep-plane lift gives a refreshed look without the 'wind tunnel' effect of old-style lifts." },
      { q: "When can I socialise?", a: "Most patients are comfortable being seen at 2–3 weeks; final result settles over 3–6 months." },
    ],
  },
  {
    slug: "liposuction",
    image: IMG.bodyContour,
    name: "Liposuction",
    pillar: "plastic-surgery",
    headline: "Permanently remove stubborn fat from specific body areas through small incisions.",
    overview:
      "Liposuction removes diet-and-exercise-resistant fat from the abdomen, flanks, thighs, arms, back, or under the chin using a thin cannula through small incisions. Modern techniques (VASER, tumescent, power-assisted) make recovery faster and results smoother than traditional lipo. Best for patients near their goal weight who have stubborn areas of fat.",
    quick: { duration: "1–4 hours (varies by areas)", sessions: "1", downtime: "5–7 days, compression garment for 6 weeks", anaesthesia: "Local + sedation, or General" },
    keyPoints: [
      "Removes fat permanently from treated areas",
      "Not a weight-loss procedure — for body contouring",
      "Compression garment essential for 6 weeks post-op",
      "Final result visible at 3–6 months",
    ],
    suitableFor: [
      "Stubborn fat deposits resistant to diet and exercise",
      "Body contouring near goal weight",
      "Chin/jawline contouring",
      "BMI under 30 ideally",
    ],
    process: [
      { t: "Consultation", d: "Mark target areas, discuss expected fat volume removal, recovery plan." },
      { t: "Surgery", d: "Tumescent solution infused, fat aspirated through small (3–4 mm) incisions." },
      { t: "Compression & recovery", d: "Compression garment from day 0 for 6 weeks, lymphatic drainage massage from week 2." },
    ],
    benefits: [
      { i: "✦", t: "Permanent fat removal", d: "Removed fat cells don't grow back." },
      { i: "✦", t: "Body contouring", d: "Sculpt waistline, thighs, arms, chin." },
      { i: "✦", t: "Small scars", d: "Incisions are 3–4 mm and placed in hidden creases." },
    ],
    faqs: [
      { q: "Will the fat come back?", a: "Not in treated areas. But if you gain significant weight, remaining fat cells elsewhere will enlarge." },
      { q: "How much fat can be removed safely?", a: "Up to 5 litres in one session for outpatient; more requires inpatient with stricter monitoring." },
    ],
  },
  {
    slug: "breast-augmentation",
    image: IMG.bodyContour,
    name: "Breast Augmentation",
    pillar: "plastic-surgery",
    headline: "Implant or fat-transfer breast enhancement, sized and shaped to your frame.",
    overview:
      "Breast augmentation increases breast size and improves shape using either silicone/saline implants or fat transfer from another body area. RenovaAura uses 3D imaging to simulate the result before surgery, helping you choose the size and shape that suits your frame.",
    quick: { duration: "1–2 hours", sessions: "1", downtime: "5–7 days", anaesthesia: "General" },
    keyPoints: [
      "Silicone (more natural feel) or saline implants",
      "Fat transfer option for modest enhancement without implants",
      "3D imaging to simulate final result before surgery",
      "Inframammary, periareolar, or transaxillary incision options",
    ],
    suitableFor: [
      "Naturally small or asymmetric breasts",
      "Post-pregnancy volume loss",
      "Post-weight-loss volume loss",
      "Reconstruction after mastectomy (with separate consultation)",
    ],
    process: [
      { t: "Consultation & imaging", d: "Discuss size, shape, incision approach, implant vs fat transfer." },
      { t: "Surgery", d: "1–2 hour procedure under general anaesthesia." },
      { t: "Recovery", d: "Support bra for 6 weeks, no upper-body exercise for 4 weeks." },
    ],
    benefits: [
      { i: "✦", t: "Choose your size & shape", d: "3D imaging shows the result before you commit." },
      { i: "✦", t: "Natural feel", d: "Modern cohesive-gel implants feel realistic to touch." },
      { i: "✦", t: "Long-lasting", d: "Modern implants typically last 15–20 years." },
    ],
    faqs: [{ q: "Do implants need to be replaced?", a: "Not on a fixed schedule, but most patients consider replacement at 15–20 years if shape/feel changes." }],
  },
  {
    slug: "tummy-tuck",
    image: IMG.bodyContour,
    name: "Tummy Tuck (Abdominoplasty)",
    pillar: "plastic-surgery",
    headline: "Remove excess abdominal skin and tighten loose muscles after weight loss or pregnancy.",
    overview:
      "Tummy tuck removes excess abdominal skin and tightens the underlying muscle wall (often loosened by pregnancy or weight loss). Often combined with liposuction for full body contouring. Result is a flatter, firmer abdomen with restored core support.",
    quick: { duration: "3–4 hours", sessions: "1", downtime: "2–3 weeks", anaesthesia: "General" },
    keyPoints: [
      "Removes excess skin and tightens abdominal muscles",
      "Hidden low-bikini-line scar",
      "Often combined with liposuction",
      "Restores core support post-pregnancy",
    ],
    suitableFor: [
      "Loose abdominal skin after pregnancy or weight loss",
      "Diastasis recti (separated abdominal muscles)",
      "Excess skin no longer responding to diet/exercise",
      "Patients at stable weight not planning more pregnancies",
    ],
    process: [
      { t: "Consultation", d: "Assess skin laxity, muscle separation, fat distribution; plan incision." },
      { t: "Surgery", d: "3–4 hour procedure, 1–2 nights in hospital." },
      { t: "Recovery", d: "Compression binder for 6 weeks, no strenuous activity for 6 weeks." },
    ],
    benefits: [
      { i: "✦", t: "Flatter abdomen", d: "Excess skin removed; firmer muscle wall." },
      { i: "✦", t: "Core restoration", d: "Tightened muscles improve posture and core strength." },
      { i: "✦", t: "Hidden scar", d: "Low-bikini-line incision invisible under most clothing." },
    ],
    faqs: [{ q: "Mini or full tummy tuck?", a: "Mini for skin laxity below the navel only; full for whole abdomen with muscle tightening. Decided at consultation." }],
  },
  {
    slug: "gynecomastia-surgery",
    image: IMG.bodyContour,
    name: "Gynecomastia Surgery",
    pillar: "plastic-surgery",
    headline: "Permanent correction of male breast enlargement — restore a flat, masculine chest.",
    overview:
      "Gynecomastia surgery removes the glandular tissue and excess fat that cause male breast enlargement. Combines liposuction (for fat) with gland excision through a small periareolar incision (for the firm glandular tissue). One of RenovaAura's most-requested male procedures.",
    quick: { duration: "1.5–2 hours", sessions: "1", downtime: "5–7 days; compression vest for 4 weeks", anaesthesia: "Local + sedation, or General" },
    keyPoints: [
      "Permanent — gland removal cannot recur",
      "Small (1–2 cm) periareolar scar that fades",
      "Compression vest essential for skin to redrape smoothly",
      "Back to office in 5–7 days",
    ],
    suitableFor: [
      "Adult men with persistent breast enlargement",
      "Both glandular and fatty types",
      "Hormonal causes ruled out by endocrinologist",
      "Stable weight",
    ],
    process: [
      { t: "Endocrine workup", d: "Rule out testosterone/oestrogen imbalance before surgery." },
      { t: "Surgery", d: "Liposuction of fatty component, then gland excision via periareolar incision." },
      { t: "Recovery", d: "Compression vest 24/7 for 2 weeks then daytime for 2 more, sutures out at day 10." },
    ],
    benefits: [
      { i: "✦", t: "Permanent", d: "Gland removal cannot recur." },
      { i: "✦", t: "Tiny scar", d: "Periareolar incision fades to near-invisible." },
      { i: "✦", t: "Confidence restored", d: "Shirts fit better, beach/gym comfort returns." },
    ],
    faqs: [{ q: "Will I have a scar?", a: "Yes — a 1–2 cm scar around the lower edge of each areola. It fades over 6–12 months to near-invisible in most cases." }],
  },
  {
    slug: "lip-fillers",
    image: IMG.lips,
    name: "Lip Fillers",
    pillar: "plastic-surgery",
    headline: "Natural, subtle lip enhancement with hyaluronic-acid filler — never overdone.",
    overview:
      "Lip filler adds volume, shape, and definition to the lips using hyaluronic-acid (HA) fillers. RenovaAura's approach is conservative — small volumes (0.5–1 ml) injected with cannula technique to enhance your natural lip shape rather than transform it. Results are immediate and last 9–12 months.",
    quick: { duration: "30 minutes", sessions: "1", downtime: "1–2 days mild swelling", anaesthesia: "Topical + lidocaine in filler" },
    keyPoints: [
      "0.5–1 ml typical (avoid the 'duck lip' look)",
      "HA-based — reversible if you change your mind (hyaluronidase enzyme)",
      "Results last 9–12 months",
      "Cannula technique reduces bruising vs needle injection",
    ],
    suitableFor: ["Thin or asymmetric lips", "Loss of lip volume with age", "Vertical lip lines ('smoker's lines')", "Defining lip border (Cupid's bow)"],
    process: [
      { t: "Consultation", d: "Discuss goals, show before/after photos, mark areas." },
      { t: "Numbing", d: "Topical anaesthetic cream for 15 minutes." },
      { t: "Injection", d: "Cannula or needle injection of HA filler — 15-minute procedure." },
      { t: "Follow-up", d: "2-week review for symmetry adjustment if needed." },
    ],
    benefits: [
      { i: "✦", t: "Immediate result", d: "See the final shape as you leave." },
      { i: "✦", t: "Reversible", d: "Don't like it? Enzyme dissolves it in 24 hours." },
      { i: "✦", t: "Natural enhancement", d: "Subtle volume — never 'overdone'." },
    ],
    faqs: [
      { q: "Will it look fake?", a: "Not with conservative volumes (0.5–1 ml) and cannula technique. We always start small." },
      { q: "How long does it last?", a: "9–12 months for most patients. Top-up at month 9–10." },
    ],
  },
  {
    slug: "botox",
    image: IMG.injection,
    name: "Botox / Anti-Wrinkle Injections",
    pillar: "plastic-surgery",
    headline: "Smooth dynamic wrinkles on the forehead, frown lines and crow's feet.",
    overview:
      "Botulinum toxin (Botox) temporarily relaxes the muscles that create dynamic wrinkles — forehead lines, frown 'elevens', and crow's feet. Done with a fine needle, takes 15 minutes, lasts 3–4 months. Also used for masseter slimming, gummy smile correction, and underarm sweating.",
    quick: { duration: "15 minutes", sessions: "Every 3–4 months", downtime: "None — no mark visible after a few hours", anaesthesia: "None (optional topical)" },
    keyPoints: [
      "15-minute walk-in / walk-out treatment",
      "Results visible at day 3–7, full effect by day 14",
      "Lasts 3–4 months",
      "Same active for masseter slimming and hyperhidrosis (underarm sweat)",
    ],
    suitableFor: [
      "Forehead horizontal lines",
      "Frown 'eleven' lines between brows",
      "Crow's feet around eyes",
      "Masseter (jaw-slimming) Botox",
      "Underarm sweat reduction",
    ],
    process: [
      { t: "Assessment", d: "Map dynamic muscles, plan injection points and units." },
      { t: "Injection", d: "Fine-needle injections at marked points — under 5 minutes of actual injection time." },
      { t: "Aftercare", d: "No lying down for 4 hours, no facial massage 24 hours, no makeup for 4 hours." },
    ],
    benefits: [
      { i: "✦", t: "Quick & subtle", d: "15 minutes; nobody notices except 'you look rested'." },
      { i: "✦", t: "Preventive", d: "Regular use slows formation of permanent etched lines." },
      { i: "✦", t: "Multiple uses", d: "Same active for face, jaw-slimming, and sweat control." },
    ],
    faqs: [
      { q: "Will my face look frozen?", a: "Not with proper dosing — modern protocols aim for 'softened movement', not paralysis." },
      { q: "How often do I need to repeat?", a: "Every 3–4 months. Regular users often find the gap stretches to 5–6 months over time." },
    ],
  },
  {
    slug: "thread-lift",
    image: IMG.faceTreatment,
    name: "Thread Lift",
    pillar: "plastic-surgery",
    headline: "Non-surgical face lift using dissolvable PDO threads — instant lift, minimal downtime.",
    overview:
      "Thread lift uses dissolvable PDO (polydioxanone) threads with tiny anchoring barbs, inserted under the skin to physically lift and reposition sagging tissue. Stimulates collagen as the threads dissolve over 6–8 months, with the lifting effect lasting 12–18 months. A bridge option between non-surgical fillers and a full surgical facelift.",
    quick: { duration: "45–60 minutes", sessions: "1 — top-up at 12 months", downtime: "2–3 days mild swelling", anaesthesia: "Local" },
    keyPoints: [
      "Instant lift visible the same day",
      "PDO threads dissolve over 6–8 months",
      "Collagen stimulation extends results to 12–18 months",
      "Bridge between fillers and full facelift surgery",
    ],
    suitableFor: [
      "Early jowl formation (35–50 age group typically)",
      "Mid-face sagging",
      "Brow lift (small barbed threads)",
      "Patients not ready for surgical facelift",
    ],
    process: [
      { t: "Consultation", d: "Assess sagging areas, mark vector lines, plan thread placement." },
      { t: "Insertion", d: "Local anaesthesia, threads inserted via fine cannula along vectors." },
      { t: "Lift adjustment", d: "Surgeon adjusts tension to achieve symmetric, natural lift." },
    ],
    benefits: [
      { i: "✦", t: "Immediate result", d: "Lift visible the same day." },
      { i: "✦", t: "No surgery", d: "No general anaesthesia, no major downtime." },
      { i: "✦", t: "Collagen boost", d: "Threads stimulate collagen as they dissolve, extending results." },
    ],
    faqs: [
      { q: "Thread lift vs facelift?", a: "Thread lift is non-surgical with 12–18 month results — best for early sagging. Facelift is surgical with 10+ year results — for established jowls and mid-face descent." },
    ],
  },
];

export const PROCEDURES: Procedure[] = [...HAIR, ...PLASTIC];

export const HAIR_PROCEDURES = HAIR;
export const PLASTIC_PROCEDURES = PLASTIC;

export const PROCEDURE_BY_SLUG = Object.fromEntries(
  PROCEDURES.map((p) => [p.slug, p]),
) as Record<string, Procedure>;

export const PROCEDURE_SLUGS = PROCEDURES.map((p) => p.slug);
