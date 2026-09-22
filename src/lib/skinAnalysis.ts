/**
 * AI Skin Analysis — clinical decision logic.
 *
 * NOT a black-box ML model. This is an expert-system mapper that takes
 * a structured patient self-report (Fitzpatrick skin type, concerns,
 * lifestyle factors) and outputs:
 *  - Skin profile summary
 *  - Risk indicators
 *  - 2–3 RenovaAura procedures matched to the concerns
 *  - Lifestyle recommendations
 *
 * Rules are coded from standard dermatology practice. Each rule cites
 * the underlying concern so editors can audit / refine them.
 */

export type Fitzpatrick = "I" | "II" | "III" | "IV" | "V" | "VI";
export type SkinType = "oily" | "dry" | "combination" | "normal" | "sensitive";

export type SkinConcern =
  | "acne"
  | "pigmentation"
  | "anti-ageing"
  | "dark-circles"
  | "dull-skin"
  | "open-pores"
  | "rosacea"
  | "scars"
  | "unwanted-hair"
  | "stretch-marks";

export type LifestyleFactor =
  | "smoker"
  | "high-stress"
  | "low-sleep"
  | "high-sun-exposure"
  | "screen-heavy"
  | "indoor-mostly"
  | "alcohol";

export type AnalysisInput = {
  fitzpatrick: Fitzpatrick;
  skinType: SkinType;
  ageBracket: "u25" | "25-34" | "35-44" | "45-54" | "o55";
  concerns: SkinConcern[]; // primary concerns the patient picked
  lifestyle: LifestyleFactor[];
};

export type AnalysisResult = {
  skinProfile: string;
  riskFactors: string[];
  recommendedProcedureSlugs: string[];
  recommendedConcernSlugs: string[];
  lifestyleAdvice: string[];
  /** A 0–100 "skin health snapshot" score for visual feedback. */
  healthScore: number;
  /** Per-attribute scores (0–100, higher = healthier) for the heat-map
      scorecard overlay + report. */
  metrics: SkinMetric[];
  /** Compressed one-line summary used as the lead summary. */
  summary: string;
};

export type SkinMetric = {
  key: string;
  label: string;
  /** 0–100, higher = healthier / fewer issues. */
  score: number;
  /** Visual tone band for the ring colour. */
  tone: "good" | "mid" | "low";
};

/**
 * Derive 8 per-attribute scores from the questionnaire. Each starts from a
 * healthy baseline and is reduced by the concerns / lifestyle factors that
 * affect it. Higher = healthier (matches the on-screen scorecard rings).
 */
function buildMetrics(input: AnalysisInput): SkinMetric[] {
  const { skinType, ageBracket, concerns, lifestyle } = input;
  const c = new Set(concerns);
  const l = new Set(lifestyle);
  const older = ageBracket === "45-54" || ageBracket === "o55";

  const clamp = (n: number) => Math.max(42, Math.min(99, Math.round(n)));
  const tone = (s: number): SkinMetric["tone"] =>
    s >= 80 ? "good" : s >= 62 ? "mid" : "low";

  const defs: { key: string; label: string; base: number; penalty: number }[] = [
    {
      key: "hydration",
      label: "Hydration",
      base: 90,
      penalty:
        (skinType === "dry" ? 22 : 0) +
        (l.has("low-sleep") ? 8 : 0) +
        (l.has("alcohol") ? 6 : 0) +
        (l.has("high-sun-exposure") ? 6 : 0) +
        (c.has("dull-skin") ? 8 : 0),
    },
    {
      key: "oiliness",
      label: "Oiliness / Shine",
      base: 88,
      penalty:
        (skinType === "oily" ? 24 : 0) +
        (c.has("acne") ? 12 : 0) +
        (c.has("open-pores") ? 10 : 0),
    },
    {
      key: "texture",
      label: "Texture",
      base: 92,
      penalty:
        (c.has("scars") ? 22 : 0) +
        (c.has("open-pores") ? 12 : 0) +
        (c.has("acne") ? 10 : 0),
    },
    {
      key: "dark-spots",
      label: "Dark Spots",
      base: 94,
      penalty:
        (c.has("pigmentation") ? 26 : 0) +
        (l.has("high-sun-exposure") ? 10 : 0),
    },
    {
      key: "dark-circles",
      label: "Dark Circles",
      base: 86,
      penalty:
        (c.has("dark-circles") ? 24 : 0) +
        (l.has("low-sleep") ? 12 : 0) +
        (l.has("screen-heavy") ? 6 : 0),
    },
    {
      key: "redness",
      label: "Redness prone",
      base: 90,
      penalty:
        (c.has("rosacea") ? 26 : 0) +
        (skinType === "sensitive" ? 14 : 0) +
        (l.has("alcohol") ? 6 : 0),
    },
    {
      key: "wrinkles",
      label: "Wrinkles",
      base: 92,
      penalty:
        (c.has("anti-ageing") ? 22 : 0) +
        (older ? 14 : 0) +
        (l.has("smoker") ? 10 : 0) +
        (l.has("high-sun-exposure") ? 6 : 0),
    },
    {
      key: "blemish",
      label: "Blemish prone",
      base: 90,
      penalty:
        (c.has("acne") ? 24 : 0) +
        (skinType === "oily" ? 10 : 0) +
        (c.has("scars") ? 6 : 0),
    },
  ];

  return defs.map((d) => {
    const score = clamp(d.base - d.penalty);
    return { key: d.key, label: d.label, score, tone: tone(score) };
  });
}

// Map concern → procedure recommendations (curated)
const CONCERN_TO_PROCEDURES: Record<SkinConcern, string[]> = {
  acne: ["lip-fillers", "botox"], // placeholder — clinic typically uses MNRF, peels
  pigmentation: ["botox", "lip-fillers"],
  "anti-ageing": ["botox", "thread-lift", "facelift"],
  "dark-circles": ["blepharoplasty", "lip-fillers"],
  "dull-skin": ["botox"],
  "open-pores": ["botox"],
  rosacea: ["botox"],
  scars: ["facelift", "blepharoplasty"],
  "unwanted-hair": [],
  "stretch-marks": ["liposuction", "tummy-tuck"],
};

const CONCERN_TO_CONCERN_SLUG: Record<SkinConcern, string> = {
  acne: "acne",
  pigmentation: "pigmentation-melasma",
  "anti-ageing": "anti-ageing-wrinkles",
  "dark-circles": "dark-circles",
  "dull-skin": "dull-skin-brightening",
  "open-pores": "open-pores",
  rosacea: "rosacea-sensitive-skin",
  scars: "scar-reduction",
  "unwanted-hair": "laser-hair-reduction",
  "stretch-marks": "stretch-marks",
};

export function analyseSkin(input: AnalysisInput): AnalysisResult {
  const { fitzpatrick, skinType, ageBracket, concerns, lifestyle } = input;

  // ---- Skin profile narrative ----
  const skinProfile = [
    `Fitzpatrick type ${fitzpatrick}`,
    `${skinType} skin`,
    `age bracket ${ageBracket.replace("u", "<").replace("o", ">")}`,
  ].join(", ");

  // ---- Risk factors ----
  const riskFactors: string[] = [];
  if (
    (fitzpatrick === "IV" || fitzpatrick === "V" || fitzpatrick === "VI") &&
    concerns.includes("pigmentation")
  ) {
    riskFactors.push(
      "Higher-melanin skin with pigmentation concerns — aggressive lasers can cause paradoxical worsening. Calibrated wavelength selection is essential.",
    );
  }
  if (concerns.includes("acne") && skinType === "oily") {
    riskFactors.push(
      "Oily skin + active acne — sebum regulation should be addressed before scar-revision protocols.",
    );
  }
  if (lifestyle.includes("smoker") && concerns.includes("anti-ageing")) {
    riskFactors.push(
      "Smoking accelerates collagen breakdown and impairs healing — affects both anti-ageing results and any surgical outcomes.",
    );
  }
  if (lifestyle.includes("high-sun-exposure") && concerns.includes("pigmentation")) {
    riskFactors.push(
      "High UV exposure is the #1 trigger for melasma. Strict daily SPF 50+ is non-negotiable before any depigmenting protocol.",
    );
  }
  if (ageBracket === "u25" && concerns.includes("anti-ageing")) {
    riskFactors.push(
      "At your age, preventive skincare (retinoids, sunscreen, antioxidants) will outperform injectables. We'd advise against fillers / Botox until later.",
    );
  }
  if (skinType === "sensitive" && concerns.includes("acne")) {
    riskFactors.push(
      "Sensitive skin barrier — common acne actives (BPO, AHAs) may trigger irritation. Slow introduction with barrier-restoring routine is key.",
    );
  }

  // ---- Procedure + concern recommendations ----
  const procedureSet = new Set<string>();
  const concernSet = new Set<string>();
  for (const c of concerns) {
    concernSet.add(CONCERN_TO_CONCERN_SLUG[c]);
    for (const p of CONCERN_TO_PROCEDURES[c]) procedureSet.add(p);
  }
  const recommendedProcedureSlugs = Array.from(procedureSet).slice(0, 3);
  const recommendedConcernSlugs = Array.from(concernSet).slice(0, 3);

  // ---- Lifestyle advice ----
  const lifestyleAdvice: string[] = [];
  lifestyleAdvice.push(
    "Daily broad-spectrum SPF 50+ — applied every morning, reapplied every 3 hours when outdoors.",
  );
  if (concerns.includes("anti-ageing") || ageBracket !== "u25") {
    lifestyleAdvice.push(
      "Topical retinoid 3 nights/week (gradual introduction) — the single most-studied anti-ageing active.",
    );
  }
  if (concerns.includes("dull-skin") || skinType === "dry") {
    lifestyleAdvice.push(
      "Layered hydration — humectant (hyaluronic acid) + occlusive (squalane / ceramides) twice daily.",
    );
  }
  if (lifestyle.includes("low-sleep") || lifestyle.includes("high-stress")) {
    lifestyleAdvice.push(
      "7–8 hours sleep + stress management — cortisol directly worsens acne, melasma and inflammation.",
    );
  }
  if (concerns.includes("dark-circles")) {
    lifestyleAdvice.push(
      "Caffeine eye serum AM, peptide eye cream PM. Reduce screen time 1 hour before sleep.",
    );
  }
  if (lifestyle.includes("smoker")) {
    lifestyleAdvice.push(
      "Smoking cessation has the single largest aesthetic impact of any lifestyle change — better skin, faster healing, longer-lasting treatments.",
    );
  }

  // ---- Health score (additive, starts at 0) ----
  // We BUILD the score from completeness + healthy-lifestyle signals,
  // rather than starting at an arbitrary 80 and deducting. Patient
  // sees 0 until they've answered enough, then watches it grow.
  let score = 0;
  // Baseline points for answering the core profile
  if (fitzpatrick) score += 10;
  if (skinType) score += 10;
  if (ageBracket) score += 5;
  // Healthy skin baseline — fewer concerns reported → higher score
  const concernPenalty = concerns.length * 5;
  const baseHealth = Math.max(0, 50 - concernPenalty); // 0–50 depending on concerns
  score += baseHealth;
  // Lifestyle penalties (only after lifestyle has been answered)
  if (lifestyle.length > 0 || concerns.length > 0) {
    for (const l of lifestyle) {
      if (l === "smoker") score -= 8;
      if (l === "high-sun-exposure") score -= 5;
      if (l === "low-sleep") score -= 4;
      if (l === "high-stress") score -= 3;
      if (l === "alcohol") score -= 3;
      if (l === "screen-heavy") score -= 2;
    }
    // Younger patients with no concerns get a small bonus
    if (
      ageBracket === "u25" &&
      concerns.length === 0 &&
      lifestyle.length === 0
    ) {
      score += 10;
    }
    if (ageBracket === "45-54") score -= 2;
    if (ageBracket === "o55") score -= 5;
  }
  const healthScore = Math.max(0, Math.min(95, score));

  const concernsText = concerns.length
    ? concerns.map((c) => c.replace("-", " ")).join(", ")
    : "general skin maintenance";
  const summary = `Fitzpatrick ${fitzpatrick} ${skinType} skin · primary concerns: ${concernsText} · skin score ${healthScore}/100`;

  return {
    skinProfile,
    riskFactors,
    recommendedProcedureSlugs,
    recommendedConcernSlugs,
    lifestyleAdvice,
    healthScore,
    metrics: buildMetrics(input),
    summary,
  };
}
