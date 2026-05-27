/**
 * Skin Concerns — RenovaAura's third pillar (after hair transplant and
 * plastic surgery). Each concern page is a problem-first landing page
 * that addresses what a patient is feeling/seeing, then routes them
 * into the relevant procedures.
 *
 * EEAT structure per concern: symptoms list (what you see), causes
 * (what's actually happening), approach (how RenovaAura treats it),
 * related procedures (cross-links into the procedures pages), FAQs.
 *
 * Slugs are stable URL paths — don't change without a redirect.
 */

export type Concern = {
  slug: string;
  name: string;
  icon: string;
  /**
   * Card image URL. Currently Unsplash placeholders — replace with
   * clinic photography (via Sanity) before launch.
   */
  image?: string;
  cardTagline: string;
  headline: string;
  summary: string;
  symptoms: string[];
  causes: string[];
  approach: string[];
  /**
   * Procedure slugs from src/data/procedures.ts that RenovaAura uses
   * for this concern. The detail page renders cards linking out.
   */
  relatedProcedureSlugs: string[];
  faqs: { q: string; a: string }[];
};

/** Curated placeholder images per concern (Unsplash, already whitelisted). */
const IMG = {
  acne:
    "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80",
  pigmentation:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
  antiAgeing:
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80",
  laserHair:
    "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&q=80",
  dullSkin:
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
  openPores:
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80",
  darkCircles:
    "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=800&q=80",
  rosacea:
    "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80",
  scars:
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80",
  stretchMarks:
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
  tattoo:
    "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=800&q=80",
};

export const CONCERNS: Concern[] = [
  {
    slug: "acne",
    image: IMG.acne,
    name: "Acne & Acne Scars",
    icon: "◉",
    cardTagline: "Active acne · post-inflammatory scars",
    headline:
      "Stop new breakouts. Repair the scars left behind. A staged plan, not a single facial.",
    summary:
      "Acne is rarely 'just a teen thing' — adult hormonal acne, jawline cysts, and post-inflammatory hyperpigmentation are some of our most common consultations. RenovaAura treats both the active acne (medical management + dermatology-grade topicals) and the scarring it leaves behind (MNRF, subcision, fillers) in a staged plan.",
    symptoms: [
      "Painful cystic spots along the jawline and chin",
      "Inflammatory whiteheads, blackheads, or pustules",
      "Dark marks (post-inflammatory hyperpigmentation) lingering after spots heal",
      "Rolling, ice-pick or boxcar scars from past acne",
      "Acne that flares with periods, stress, or specific foods",
    ],
    causes: [
      "Hormonal imbalance (especially androgens in women)",
      "Excess sebum production",
      "C. acnes bacteria colonising blocked follicles",
      "Diet triggers — high glycemic index foods, dairy in some patients",
      "Over-cleansing or wrong skincare products disrupting the barrier",
    ],
    approach: [
      "Identify your acne type and any hormonal driver before any treatment starts",
      "Active acne first: medical management, topicals, and in-clinic peels to break the cycle",
      "Maintenance plan to prevent rebound when active treatment ends",
      "Once active acne is controlled, address scarring with MNRF + subcision + fillers as needed",
      "Honest timeline — meaningful results take months, not weeks",
    ],
    relatedProcedureSlugs: ["botox", "lip-fillers", "thread-lift"],
    faqs: [
      {
        q: "Will my acne come back when I stop treatment?",
        a: "Often yes — that's why we always build a maintenance plan into your protocol. The goal is to identify the smallest amount of ongoing skincare/medication you need to stay clear.",
      },
      {
        q: "Can scars be removed completely?",
        a: "Most scars improve dramatically (60–80%) with the right combination of treatments. Complete removal isn't always possible, but the visible severity can be reduced enough that scars no longer dominate how your skin looks.",
      },
      {
        q: "Are acne treatments safe during pregnancy?",
        a: "Many are not — retinoids and certain oral medications must be avoided. We adjust your protocol if you're pregnant or planning pregnancy.",
      },
    ],
  },
  {
    slug: "pigmentation-melasma",
    image: IMG.pigmentation,
    name: "Pigmentation & Melasma",
    icon: "◐",
    cardTagline: "Melasma · sun damage · dark patches",
    headline:
      "Even out skin tone with calibrated depigmenting protocols — not random whitening.",
    summary:
      "Melasma and post-inflammatory hyperpigmentation are particularly common on Indian skin and notoriously tricky to treat — aggressive lasers can make them worse. RenovaAura uses calibrated depigmenting protocols (Cosmelan, tranexamic acid, low-fluence Q-switched laser) chosen for your specific pigment type, never a one-size-fits-all approach.",
    symptoms: [
      "Symmetrical brown patches on cheeks, forehead, upper lip",
      "Darkening that flares in sun and pregnancy",
      "Dark marks after acne, eczema, or skin injury",
      "Uneven skin tone or dull-looking complexion",
    ],
    causes: [
      "UV exposure (#1 trigger for melasma)",
      "Hormonal shifts — pregnancy, oral contraceptives, perimenopause",
      "Post-inflammatory pigment (after acne, burns, irritation)",
      "Visible-light exposure (blue light, sunlight, even indoor lighting)",
      "Heat — kitchen workers and runners often see flares",
    ],
    approach: [
      "Wood's lamp examination to identify depth (epidermal vs dermal vs mixed)",
      "Strict 50+ broad-spectrum sunscreen — non-negotiable, all year",
      "Depigmenting actives chosen for your pigment depth and skin type",
      "Cosmelan mask or oral tranexamic acid for stubborn melasma",
      "Very gentle laser only after pigment is suppressed — wrong laser worsens melasma",
      "Long-term maintenance plan; melasma is managed, not cured",
    ],
    relatedProcedureSlugs: ["botox", "lip-fillers"],
    faqs: [
      {
        q: "Why does my melasma keep coming back?",
        a: "Because melasma is a chronic condition driven by sun, hormones, and heat — not a one-time problem. We manage it with active treatment phases and maintenance phases, like managing high blood pressure.",
      },
      {
        q: "Is laser safe for Indian skin pigmentation?",
        a: "Only specific wavelengths at very low fluences, and only after pigment is suppressed with topicals. Aggressive lasers cause paradoxical worsening in 30–40% of Indian patients. We're conservative for a reason.",
      },
    ],
  },
  {
    slug: "anti-ageing-wrinkles",
    image: IMG.antiAgeing,
    name: "Anti-Ageing & Wrinkles",
    icon: "◑",
    cardTagline: "Fine lines · loss of volume · sagging",
    headline:
      "Refresh, don't transform. Combine Botox, fillers, and energy devices for a natural lift.",
    summary:
      "RenovaAura's anti-ageing approach is layered — Botox for dynamic lines, hyaluronic-acid fillers for volume loss, energy devices (HIFU, RF microneedling) for skin tightening, and thread lift for early jowls. We avoid the 'frozen' or 'pillow face' look that comes from overusing a single tool.",
    symptoms: [
      "Forehead horizontal lines",
      "Frown 'eleven' lines between brows",
      "Crow's feet at eye corners",
      "Volume loss in cheeks, temples, under-eyes",
      "Early jowl formation, mid-face sagging",
      "Marionette lines from nose to mouth corners",
    ],
    causes: [
      "Natural collagen decline (about 1% per year after age 25)",
      "UV damage accelerating collagen breakdown",
      "Repeated facial expressions etching dynamic lines into static ones",
      "Bone resorption changing facial scaffolding",
      "Volume loss in facial fat pads",
    ],
    approach: [
      "Map dynamic vs static wrinkles — they need different tools",
      "Botox at conservative doses for dynamic lines (forehead, frown, crow's feet)",
      "HA fillers for volume restoration where lost — not where it wasn't",
      "Energy devices (RF microneedling, HIFU) for collagen stimulation",
      "Thread lift for early jowls; refer to facelift when jowls are established",
      "Skincare actives that genuinely help: retinoids, vitamin C, sunscreen",
    ],
    relatedProcedureSlugs: [
      "botox",
      "lip-fillers",
      "thread-lift",
      "facelift",
      "blepharoplasty",
    ],
    faqs: [
      {
        q: "When should I start anti-ageing treatments?",
        a: "Preventive Botox makes sense in late 20s for some patients with very expressive faces. Volume restoration usually starts mid-30s onwards. Skincare (sunscreen, retinoids) should start in your 20s.",
      },
      {
        q: "Will I look fake or frozen?",
        a: "Not with our dosing approach. We aim for softened movement, not paralysis. If you don't want any visible movement loss, we'll talk about lower doses or alternatives.",
      },
    ],
  },
  {
    slug: "laser-hair-reduction",
    image: IMG.laserHair,
    name: "Laser Hair Reduction",
    icon: "◒",
    cardTagline: "Diode + Nd:YAG · 70–90% reduction · safe on Indian skin",
    headline:
      "Permanent hair reduction with diode + Nd:YAG lasers — calibrated for every Indian skin type.",
    summary:
      "Laser hair reduction (LHR) works best when the wavelength is matched to your skin type and hair colour. RenovaAura uses diode (810 nm) for lighter skin tones and Nd:YAG (1064 nm) for darker skin tones — Nd:YAG is the only laser truly safe for type V–VI Indian skin. A full course gives 70–90% permanent reduction across face, body, underarms, bikini, back, or chest.",
    symptoms: [
      "Coarse facial hair (upper lip, chin, jawline) — often hormonal",
      "Underarm, leg, bikini, back, or chest hair you want permanently reduced",
      "Razor bumps and ingrown hairs from regular shaving",
      "Hirsutism patterns suggesting PCOS",
      "Folliculitis flares after waxing or threading",
    ],
    causes: [
      "Genetic factors (most common — runs in families)",
      "Hormonal imbalance — PCOS, insulin resistance, adrenal disorders",
      "Medications (steroids, hormone therapy)",
      "Post-pregnancy or perimenopausal hormonal shifts",
      "Sometimes idiopathic — no identifiable cause",
    ],
    approach: [
      "Hormonal workup if facial hair pattern suggests PCOS or thyroid involvement",
      "Skin-type (Fitzpatrick) assessment to choose the right laser wavelength — diode for I–III, Nd:YAG for IV–VI",
      "Mandatory test patch on first visit before full-area treatment",
      "6–8 sessions, 4–6 weeks apart, for 70–90% permanent reduction",
      "Triple-cooling system protects darker skin from burns and pigmentation",
      "Annual maintenance touch-ups to handle hormonal regrowth",
      "Post-care protocol: SPF 50+, no waxing or plucking between sessions (shaving is fine)",
    ],
    relatedProcedureSlugs: [],
    faqs: [
      {
        q: "Is laser hair removal truly permanent?",
        a: "It causes permanent reduction (70–90% of hairs after a full course), not 100% removal. Hormonal regrowth can occur over years, so annual maintenance keeps you smooth long-term.",
      },
      {
        q: "Will laser darken my skin?",
        a: "Not when the correct wavelength is used for your skin type. We use Nd:YAG for Indian skin types IV–VI specifically to avoid post-inflammatory pigmentation, which is a real risk with wrong wavelengths.",
      },
      {
        q: "How many sessions will I need?",
        a: "6–8 sessions is the standard course, 4–6 weeks apart. PCOS patients often need 2–4 extra sessions due to ongoing hormonal stimulation of follicles.",
      },
      {
        q: "Can I do laser on my face if I have melasma?",
        a: "Only with extra caution. Lasers can trigger melasma flares. We pre-treat the melasma first and use very conservative settings on facial laser sessions.",
      },
      {
        q: "Is it painful?",
        a: "Modern diode and Nd:YAG lasers with integrated cooling feel like a warm rubber-band snap — uncomfortable but tolerable without anaesthesia. We can apply a numbing cream for sensitive areas (bikini, upper lip) on request.",
      },
    ],
  },
  {
    slug: "dull-skin-brightening",
    image: IMG.dullSkin,
    name: "Dull Skin & Uneven Tone",
    icon: "◓",
    cardTagline: "Skin brightening · radiance · texture",
    headline:
      "Get your glow back with dermatology-grade peels, medifacials, and at-home actives.",
    summary:
      "Dull skin is rarely about one thing — it's usually a combination of dead-cell buildup, dehydration, pollution damage, and uneven pigment. Our brightening protocol layers gentle chemical exfoliation, hydration boosters, and antioxidant-rich actives to restore radiance.",
    symptoms: [
      "Skin looks tired and lacks 'glow'",
      "Foundation goes on patchy or muddy",
      "Texture feels rough rather than smooth",
      "Uneven tone — some areas darker than others",
      "Makeup doesn't sit well anymore",
    ],
    causes: [
      "Dead skin-cell accumulation",
      "Dehydration (most dullness is partly water loss)",
      "Pollution and oxidative stress",
      "Poor sleep, smoking, alcohol",
      "Sun damage building up over years",
    ],
    approach: [
      "Hydration test (dehydration is the easiest to fix)",
      "Gentle in-clinic chemical peels (mandelic, lactic, or salicylic)",
      "Medifacials with antioxidants and hydrating serums",
      "At-home vitamin C, niacinamide, and retinoid routine",
      "Sunscreen reinforcement — UV undoes brightening progress",
    ],
    relatedProcedureSlugs: ["botox"],
    faqs: [
      {
        q: "How fast will I see brighter skin?",
        a: "Immediate glow after a medifacial; lasting improvement in tone takes 6–12 weeks of consistent at-home + monthly in-clinic protocol.",
      },
    ],
  },
  {
    slug: "open-pores",
    image: IMG.openPores,
    name: "Open Pores",
    icon: "◔",
    cardTagline: "Visible pores · enlarged pores · oily skin",
    headline:
      "Shrink and refine pores with RF microneedling and barrier-restoring skincare.",
    summary:
      "Pores can't be permanently closed (they don't have a closing mechanism) but their visibility can be significantly reduced. RenovaAura uses RF microneedling to remodel pore-area collagen, combined with niacinamide and retinoid skincare to keep them clear.",
    symptoms: [
      "Visible pores on nose, cheeks, forehead",
      "Skin looks 'rough' close-up",
      "Foundation settles into pores",
      "Pores look larger when skin is dry or in summer heat",
    ],
    causes: [
      "Genetics (#1 factor)",
      "Excess sebum stretching pore walls",
      "Sun damage degrading collagen around pores",
      "Age — collagen loss makes pores look bigger",
      "Comedones (blackheads) blocking and stretching pores",
    ],
    approach: [
      "Niacinamide and salicylic acid skincare to regulate sebum and clear pores",
      "Retinoid to thicken skin and improve cellular turnover",
      "RF microneedling sessions to stimulate collagen around pores",
      "Strict sunscreen — sun damage worsens pore visibility",
      "Optional in-clinic deep-cleansing facials for comedone clearance",
    ],
    relatedProcedureSlugs: ["botox"],
    faqs: [
      {
        q: "Can pores be permanently closed?",
        a: "No — pores are functional openings. But visible size can be reduced by 30–50% with the right protocol over 3–6 months.",
      },
    ],
  },
  {
    slug: "dark-circles",
    image: IMG.darkCircles,
    name: "Dark Circles & Under-Eye Hollows",
    icon: "◕",
    cardTagline: "Pigmented · vascular · hollow type",
    headline:
      "Different causes need different treatments — get the right diagnosis first.",
    summary:
      "Dark circles aren't one thing. Pigmented circles need depigmenting treatment. Vascular circles need lasers or fillers. Hollow circles need tear-trough filler or blepharoplasty. Treating the wrong type wastes time and money — we diagnose first.",
    symptoms: [
      "Brown shadows under the eyes (pigmented)",
      "Bluish-purple tint under eyes (vascular)",
      "Sunken or hollow appearance (volume loss)",
      "Looking 'tired' even when well-rested",
      "Darker in morning or after poor sleep",
    ],
    causes: [
      "Pigmented: melanin deposition, post-inflammatory pigment, genetic",
      "Vascular: thin under-eye skin showing blood vessels beneath",
      "Hollow: volume loss in tear-trough area, age-related",
      "Aggravated by: poor sleep, allergies, screen fatigue, dehydration",
    ],
    approach: [
      "Pinch test, wood's lamp, and stretch test to identify type",
      "Pigmented: arbutin / kojic acid / hydroquinone topicals + Q-switched laser",
      "Vascular: long-pulsed Nd:YAG laser to reduce visible vessels",
      "Hollow: tear-trough HA filler (very small volumes) or blepharoplasty",
      "Lifestyle: sleep, hydration, screen breaks, allergy control",
    ],
    relatedProcedureSlugs: ["blepharoplasty", "lip-fillers"],
    faqs: [
      {
        q: "Will under-eye filler look obvious?",
        a: "Not with the right technique and very small volumes (0.5 ml or less). Done by an experienced injector with cannula technique, it's invisible.",
      },
    ],
  },
  {
    slug: "rosacea-sensitive-skin",
    image: IMG.rosacea,
    name: "Rosacea & Sensitive Skin",
    icon: "◖",
    cardTagline: "Redness · flushing · reactive skin",
    headline:
      "Calm reactive skin with a gentle barrier-first protocol — no aggressive treatments.",
    summary:
      "Sensitive and reactive skin gets worse with the harsh routines marketed to it. RenovaAura's approach is barrier-first: identify triggers, simplify your routine, restore the moisture barrier, then carefully introduce anti-inflammatory actives. Vascular laser only when the skin is calm.",
    symptoms: [
      "Persistent facial redness (cheeks, nose, chin)",
      "Flushing easily with heat, alcohol, spicy food, stress",
      "Visible small blood vessels (telangiectasia)",
      "Burning, stinging or tightness with new skincare products",
      "Bumpy texture without true acne",
    ],
    causes: [
      "Vascular hypersensitivity (rosacea)",
      "Damaged skin barrier from over-exfoliation",
      "Genetic predisposition",
      "Trigger foods (alcohol, hot drinks, spicy food, histamine-rich foods)",
      "Sun and heat exposure",
    ],
    approach: [
      "Trigger diary to identify your personal flare triggers",
      "Simplify skincare to barrier-restoring basics (ceramides, panthenol)",
      "Avoid: alcohol-based toners, fragrance, aggressive scrubs, hot water",
      "Anti-inflammatory topicals (azelaic acid, ivermectin if rosacea)",
      "Vascular laser (Nd:YAG or pulsed dye) for visible vessels — only when skin is calm",
      "SPF 50 daily — UV is a major trigger",
    ],
    relatedProcedureSlugs: ["botox"],
    faqs: [
      {
        q: "Can rosacea be cured?",
        a: "Not cured, but managed very well. Most patients reach 80–90% reduction in redness and flushing with the right protocol.",
      },
    ],
  },
  {
    slug: "scar-reduction",
    image: IMG.scars,
    name: "Scar Reduction",
    icon: "◗",
    cardTagline: "Surgical · acne · injury · keloid scars",
    headline:
      "Improve scars from acne, surgery, injuries — even old scars respond to the right treatment.",
    summary:
      "Different scar types respond to different treatments. Acne scars need subcision + MNRF + fillers. Hypertrophic scars need steroid injections. Keloids need a layered approach. Surgical scars often improve with silicone + early intervention. We identify the type first.",
    symptoms: [
      "Rolling, ice-pick, or boxcar acne scars",
      "Raised hypertrophic scars from injury or surgery",
      "Thick, growing keloid scars",
      "Discoloured (red or brown) scars that won't fade",
      "Stretched or wide scars from old wounds",
    ],
    causes: [
      "Inflammation during wound healing",
      "Tension on healing skin",
      "Genetic tendency to keloid formation",
      "Delayed healing in some areas (chest, shoulders, jawline)",
    ],
    approach: [
      "Identify scar type — atrophic, hypertrophic, keloid, or pigmented",
      "Atrophic (acne): subcision to release tethered scars, MNRF for resurfacing, fillers for volume",
      "Hypertrophic: intralesional steroid injections, silicone gel, vascular laser",
      "Keloid: combination steroid + 5-FU injections, sometimes excision",
      "Pigmented: depigmenting topicals + low-fluence laser",
      "Best results when scars are addressed early — but old scars also respond",
    ],
    relatedProcedureSlugs: [
      "beard-transplant",
      "eyebrow-transplant",
      "facelift",
    ],
    faqs: [
      {
        q: "How much can old scars improve?",
        a: "60–80% improvement is typical with the right combination protocol over 6–12 months. Complete erasure is rare; significant reduction in visibility is very achievable.",
      },
      {
        q: "Will keloids come back after treatment?",
        a: "Keloids recur in 30–40% of cases without combination treatment. Our protocol layers steroid + 5-FU + sometimes radiation to reduce recurrence significantly.",
      },
    ],
  },
  {
    slug: "stretch-marks",
    image: IMG.stretchMarks,
    name: "Stretch Marks",
    icon: "◘",
    cardTagline: "Red · white · pregnancy · growth-related",
    headline:
      "Best results on red stretch marks; meaningful improvement even for older white ones.",
    summary:
      "Stretch marks are dermal scars. Red stretch marks (newer) respond very well to vascular laser and microneedling. White stretch marks (older) need more aggressive collagen stimulation with MNRF and resurfacing — improvement is possible but slower.",
    symptoms: [
      "Red or purple linear streaks (newer, active)",
      "White or silver streaks (older, mature)",
      "Common areas: abdomen, thighs, hips, breasts, upper arms",
      "Following pregnancy, growth spurts, weight gain, bodybuilding",
    ],
    causes: [
      "Rapid skin stretching exceeding dermal elasticity",
      "Pregnancy",
      "Adolescent growth spurts",
      "Weight gain or rapid muscle gain (bodybuilders)",
      "Steroid use (medical or otherwise)",
      "Genetics — some skin tears more easily than others",
    ],
    approach: [
      "Red marks: pulsed dye / vascular laser + microneedling (best window for treatment)",
      "White marks: RF microneedling + topical retinoids (slower but real improvement)",
      "Combination with PRP or growth factors for enhanced collagen response",
      "Realistic counselling — texture improves more than discoloration in old marks",
      "Best to start treatment when marks are still red/pink",
    ],
    relatedProcedureSlugs: ["liposuction", "tummy-tuck"],
    faqs: [
      {
        q: "Can stretch marks be completely removed?",
        a: "Not completely. Red marks can fade to nearly invisible; white marks can become significantly less obvious in texture and tone but rarely disappear entirely.",
      },
    ],
  },
  {
    slug: "tattoo-removal",
    image: IMG.tattoo,
    name: "Tattoo Removal",
    icon: "◚",
    cardTagline: "Q-switched laser · multi-session",
    headline:
      "Permanent tattoo removal with Q-switched Nd:YAG — most colours, 6–12 sessions.",
    summary:
      "RenovaAura uses Q-switched Nd:YAG laser, which fragments tattoo ink into particles small enough for the body to absorb. Black ink responds best, followed by dark blue and red. Yellow, green, and light blue are more resistant but improvable over more sessions.",
    symptoms: [
      "Unwanted tattoo from past decisions, breakups, or career changes",
      "Faded amateur tattoos",
      "Lightening professional tattoos in preparation for cover-up",
      "Cosmetic tattoo (eyebrows, lip line) removal",
    ],
    causes: [
      "Permanent ink particles deposited in the dermis",
      "Particles too large for normal immune clearance",
      "Different inks at different depths in the skin",
    ],
    approach: [
      "Assess tattoo: colour, age, ink density, location, skin type",
      "Test spot to predict response",
      "Q-switched Nd:YAG laser sessions, 6 weeks apart",
      "Typical course: 6–12 sessions for amateur tattoos, 10–15+ for professional",
      "Aftercare: keep dry, no sun, no picking scabs",
      "Realistic counselling: some colours and densities don't fully clear",
    ],
    relatedProcedureSlugs: [],
    faqs: [
      {
        q: "Does tattoo removal hurt?",
        a: "Yes — similar to getting the tattoo but in shorter bursts. Topical numbing cream is applied beforehand to reduce discomfort.",
      },
      {
        q: "Will there be a scar?",
        a: "Rarely with Q-switched laser — but always a possibility, especially in patients prone to keloid or with very dense old ink.",
      },
    ],
  },
];

export const CONCERN_BY_SLUG = Object.fromEntries(
  CONCERNS.map((c) => [c.slug, c]),
) as Record<string, Concern>;

export const CONCERN_SLUGS = CONCERNS.map((c) => c.slug);
