/**
 * Questionnaire-based skin concern summary.
 * This is deterministic guidance, not an AI model or a medical diagnosis.
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
  concerns: SkinConcern[];
  lifestyle: LifestyleFactor[];
};

export type AnalysisResult = {
  skinProfile: string;
  riskFactors: string[];
  recommendedConcernSlugs: string[];
  lifestyleAdvice: string[];
  summary: string;
};

const CONCERN_TO_SLUG: Record<SkinConcern, string> = {
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
  const ageLabel = ageBracket === "u25" ? "under 25" : ageBracket === "o55" ? "55+" : ageBracket;
  const concernLabels = concerns.map((concern) => concern.replaceAll("-", " "));
  const skinProfile = `Fitzpatrick type ${fitzpatrick} · ${skinType} skin · age ${ageLabel}`;

  const riskFactors: string[] = [];
  if (["IV", "V", "VI"].includes(fitzpatrick) && concerns.includes("pigmentation")) {
    riskFactors.push(
      "Pigmentation treatment should be selected and monitored by a clinician; some procedures can cause dark marks after irritation, especially in more deeply pigmented skin.",
    );
  }
  if (concerns.includes("rosacea")) {
    riskFactors.push(
      "Facial redness can have several causes. A clinician should confirm the cause before treatment, especially if symptoms are new, persistent, painful, or affecting the eyes.",
    );
  }
  if (concerns.includes("acne") && concerns.includes("scars")) {
    riskFactors.push(
      "If breakouts are still active, a clinician may address those first before planning treatment for acne marks or scars.",
    );
  }
  if (lifestyle.includes("smoker")) {
    riskFactors.push(
      "Tell your clinician if you smoke, particularly before a procedure, because it can affect healing.",
    );
  }

  const lifestyleAdvice: string[] = [
    "Use broad-spectrum sunscreen and follow its label for reapplication, especially when outdoors.",
    "Keep a simple, gentle routine and introduce one new product at a time; stop if it causes persistent irritation.",
  ];
  if (skinType === "dry") lifestyleAdvice.push("A fragrance-free moisturiser may help support dry or tight-feeling skin.");
  if (skinType === "oily" || concerns.includes("acne")) lifestyleAdvice.push("Choose non-comedogenic products if they suit your skin; avoid picking at active breakouts.");
  if (concerns.includes("pigmentation")) lifestyleAdvice.push("Sun protection can help limit worsening of uneven pigmentation; persistent or changing spots should be assessed by a clinician.");
  if (lifestyle.includes("low-sleep")) lifestyleAdvice.push("If possible, work toward a regular sleep schedule that fits your needs.");
  if (lifestyle.includes("high-stress")) lifestyleAdvice.push("Consider a stress-management habit that feels practical for you.");
  if (lifestyle.includes("smoker")) lifestyleAdvice.push("If you want support to stop smoking, a healthcare professional can help you find options.");

  const concernsText = concernLabels.length ? concernLabels.join(", ") : "no specific concerns selected";
  const summary = `${skinProfile} · selected concerns: ${concernsText}`;

  return {
    skinProfile,
    riskFactors,
    recommendedConcernSlugs: concerns.map((concern) => CONCERN_TO_SLUG[concern]),
    lifestyleAdvice,
    summary,
  };
}
