/**
 * RenovaAura treatment packages (dermatology / aesthetics), sourced from the
 * clinic's "Packages for RenovaAura" document.
 *
 * `category` drives grouping on the /packages page; `concernSlug` ties a
 * package to a concern detail page (src/data/concerns.ts) so it can render in
 * that page's "Packages" section. Leave `concernSlug` empty for packages with
 * no matching concern (e.g. hair-loss).
 *
 * `price` is intentionally blank — the clinic fills it in via Sanity Studio.
 * A few `includes` lines are blank where the source doc didn't specify the
 * session count yet (flagged to the clinic).
 */
export type PackageCategory =
  | "acne"
  | "acne-scars"
  | "pigmentation"
  | "hair-loss"
  | "anti-ageing";

export type TreatmentPackage = {
  slug: string;
  name: string;
  category: PackageCategory;
  image?: string;
  /** Short description of what's included (sessions / component treatments). */
  includes: string;
  /** Optional concern slug (src/data/concerns.ts) for the per-concern section. */
  concernSlug?: string;
  /** Display price, e.g. "₹24,000". Blank until the clinic sets it. */
  price?: string;
  order: number;
};

/** Category display labels + order for the /packages page. */
export const PACKAGE_CATEGORIES: { slug: PackageCategory; label: string }[] = [
  { slug: "acne", label: "Acne" },
  { slug: "acne-scars", label: "Acne Scars" },
  { slug: "pigmentation", label: "Pigmentation" },
  { slug: "hair-loss", label: "Hair Loss" },
  { slug: "anti-ageing", label: "Anti-Ageing" },
];

export const PACKAGES: TreatmentPackage[] = [
  // ---- Acne ----------------------------------------------------------------
  {
    slug: "acne-clear-correct-regime",
    name: "Acne Clear & Correct Regime",
    category: "acne",
    includes: "3× black / chemical peel + 3× carbon peel",
    concernSlug: "acne",
    order: 1,
  },
  {
    slug: "advanced-acne-corrective-therapy",
    name: "Advanced Acne-Corrective Therapy",
    category: "acne",
    includes: "3× Acnelan peel + 3× carbon peel + 2× ILS",
    concernSlug: "acne",
    order: 2,
  },
  {
    slug: "renova-carbon-purify",
    name: "Renova Carbon Purify",
    category: "acne",
    includes: "4× carbon peel",
    concernSlug: "acne",
    order: 3,
  },

  // ---- Acne scars ----------------------------------------------------------
  {
    slug: "aura-skin-resurfacing-program",
    name: "Aura Skin Resurfacing Program",
    category: "acne-scars",
    includes: "4× CO₂ laser",
    concernSlug: "scar-reduction",
    order: 4,
  },
  {
    slug: "renova-re-texture",
    name: "Renova Re-Texture",
    category: "acne-scars",
    includes: "4× erbium glass laser",
    concernSlug: "scar-reduction",
    order: 5,
  },
  {
    slug: "aura-signature-scar-remodelling-therapy",
    name: "Aura Signature Scar Re-Modelling Therapy",
    category: "acne-scars",
    includes: "3× CO₂ / erbium glass + 3× Dermapen",
    concernSlug: "scar-reduction",
    order: 6,
  },
  {
    slug: "stretch-mark-fix",
    name: "Stretch Mark Fix",
    category: "acne-scars",
    includes: "2× CO₂ + 2× erbium + 2× Dermapen + 6× GFC",
    concernSlug: "stretch-marks",
    order: 7,
  },

  // ---- Pigmentation --------------------------------------------------------
  {
    slug: "aura-clarity-protocol",
    name: "Aura Clarity Protocol",
    category: "pigmentation",
    includes: "6× Q-switch laser",
    concernSlug: "pigmentation-melasma",
    order: 8,
  },
  {
    slug: "aura-dermabright",
    name: "Aura Dermabright",
    category: "pigmentation",
    includes: "6× Dermapen",
    concernSlug: "pigmentation-melasma",
    order: 9,
  },
  {
    slug: "aura-melano-control-peel",
    name: "Aura Melano-Control Peel",
    category: "pigmentation",
    includes: "1× Cosmelan peel",
    concernSlug: "pigmentation-melasma",
    order: 10,
  },
  {
    slug: "aura-gold-peel",
    name: "Aura Gold Peel",
    category: "pigmentation",
    includes: "3× yellow peel",
    concernSlug: "pigmentation-melasma",
    order: 11,
  },
  {
    slug: "renova-exo-gen",
    name: "Renova Exo-Gen",
    category: "pigmentation",
    includes: "6× exosome therapy",
    concernSlug: "pigmentation-melasma",
    order: 12,
  },
  {
    slug: "renova-liquid-gold-facial",
    name: "Renova Liquid Gold Facial",
    category: "pigmentation",
    includes: "3× vampire (PRP) facial",
    concernSlug: "dull-skin-brightening",
    order: 13,
  },
  {
    slug: "dermapen-pdrn-meso-glow",
    name: "Dermapen PDRN Meso-Glow",
    category: "pigmentation",
    includes: "", // session count TBD — confirm with clinic
    concernSlug: "dull-skin-brightening",
    order: 14,
  },
  {
    slug: "tattoo-removal",
    name: "Tattoo Removal",
    category: "pigmentation",
    includes: "8–10× Q-switch laser",
    concernSlug: "tattoo-removal",
    order: 15,
  },

  // ---- Hair loss -----------------------------------------------------------
  {
    slug: "renova-follicle-boost",
    name: "Renova Follicle Boost",
    category: "hair-loss",
    includes: "6× PRP",
    order: 16,
  },
  {
    slug: "aura-pure-gfc",
    name: "Aura Pure GFC",
    category: "hair-loss",
    includes: "6× GFC",
    order: 17,
  },
  {
    slug: "aura-meso-infusion",
    name: "Aura Meso-Infusion",
    category: "hair-loss",
    includes: "Mesotherapy course",
    order: 18,
  },
  {
    slug: "renova-erglass-follicle-stimulation",
    name: "Renova Er:Glass Follicle Stimulation",
    category: "hair-loss",
    includes: "", // session count TBD — confirm with clinic
    order: 19,
  },
  {
    slug: "aura-dht-blocker-infusion",
    name: "Aura DHT-Blocker Infusion",
    category: "hair-loss",
    includes: "Mesotherapy",
    order: 20,
  },

  // ---- Anti-ageing ---------------------------------------------------------
  {
    slug: "aura-hydra-plump-lip",
    name: "Aura Hydra-Plump Lip",
    category: "anti-ageing",
    includes: "Lip booster",
    concernSlug: "anti-ageing-wrinkles",
    order: 21,
  },
  {
    slug: "renova-vector-lift",
    name: "Renova Vector Lift",
    category: "anti-ageing",
    includes: "Thread lift",
    concernSlug: "anti-ageing-wrinkles",
    order: 22,
  },
  {
    slug: "aura-mid-face-lift",
    name: "Aura Mid-Face Lift",
    category: "anti-ageing",
    includes: "", // details TBD — confirm with clinic
    concernSlug: "anti-ageing-wrinkles",
    order: 23,
  },
  {
    slug: "renova-sculpt",
    name: "Renova Sculpt",
    category: "anti-ageing",
    includes: "", // details TBD — confirm with clinic
    concernSlug: "anti-ageing-wrinkles",
    order: 24,
  },
  {
    slug: "aura-renova-lip",
    name: "Aura Lip / Renova Lip",
    category: "anti-ageing",
    includes: "Lip enhancement",
    concernSlug: "anti-ageing-wrinkles",
    order: 25,
  },
  {
    slug: "renova-jaw-define",
    name: "Renova Jaw Define",
    category: "anti-ageing",
    includes: "", // details TBD — confirm with clinic
    concernSlug: "anti-ageing-wrinkles",
    order: 26,
  },
  {
    slug: "liquid-facelift",
    name: "Liquid Facelift",
    category: "anti-ageing",
    includes: "", // details TBD — confirm with clinic
    concernSlug: "anti-ageing-wrinkles",
    order: 27,
  },
];

export const PACKAGE_SLUGS = PACKAGES.map((p) => p.slug);
