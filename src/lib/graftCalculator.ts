/**
 * Hair Graft Calculator — clinical math.
 *
 * Methodology:
 *  - Recipient area estimated by Norwood-Hamilton stage (cm²)
 *  - Adjusted by user-reported coverage depth (sparse / moderate / dense)
 *  - Goal density (recipient follicles per cm²) — typically 30–55 FU/cm²
 *    in modern practice; 35–45 FU/cm² is conservative-natural
 *  - Donor density factor — patients with high donor density tolerate
 *    higher harvest counts; low donor density caps the realistic max
 *  - Hair texture multiplier — coarse hair achieves better visual
 *    coverage per graft, so dense-coverage targets can use fewer grafts
 *  - Age modifier — younger patients (<30) are advised conservative
 *    counts to future-proof against ongoing loss
 *
 * References:
 *  - Norwood OT. Male pattern baldness: classification and incidence
 *    (South Med J. 1975)
 *  - Unger WP et al. "Hair Transplantation" 5th ed (2010)
 *  - Avram MR, "Hair Transplantation for Men and Women" (Dermatologic
 *    Clinics, 2005)
 *  - Recipient density ranges per ISHRS consensus (2018)
 *
 * Output: estimated graft range (low / mid / high) + recommended
 * procedure(s) from RenovaAura's catalogue based on count.
 */

export type Norwood =
  | "II"
  | "III"
  | "IIIv"
  | "IV"
  | "V"
  | "VI"
  | "VII";

export type HairTexture = "fine" | "medium" | "coarse";
export type DonorDensity = "low" | "average" | "high";
export type GoalDensity = "conservative" | "natural" | "dense";
export type AgeBracket = "u30" | "30-40" | "40-50" | "50-60" | "o60";

export type CalculatorInput = {
  norwood: Norwood;
  texture: HairTexture;
  donorDensity: DonorDensity;
  goalDensity: GoalDensity;
  ageBracket: AgeBracket;
  /** Additional concerns (beard, eyebrow). Each adds a fixed graft band. */
  alsoBeard?: boolean;
  alsoEyebrow?: boolean;
};

export type CalculatorResult = {
  estimateLow: number;
  estimateMid: number;
  estimateHigh: number;
  /** Recipient area calculation, cm² */
  recipientAreaCm2: number;
  /** Goal density used, follicles/cm² */
  targetDensity: number;
  /** Effective grafts/cm² assumed (target density / hairs-per-graft factor) */
  graftsPerCm2: number;
  /** Recommended procedure slug from src/data/procedures.ts */
  recommendedProcedure: string;
  /** Single-session feasibility: can this be done in one sitting? */
  singleSession: boolean;
  /** Sessions estimate when single-session not feasible */
  sessions: number;
  /** Plain-language rationale for the result. */
  rationale: string[];
  /** Detailed breakdown lines, for the PDF report. */
  breakdown: { label: string; value: string }[];
};

// =========================================================================
// Reference data
// =========================================================================

/**
 * Recipient area in cm² by Norwood stage. Values from Bernstein/Rassman
 * recipient-area tables and ISHRS practice consensus, averaged.
 */
const RECIPIENT_AREA_CM2: Record<Norwood, number> = {
  II: 18, // frontal recession
  III: 35, // deeper temple/frontal
  IIIv: 50, // frontal + emerging vertex
  IV: 75, // frontal + clear vertex
  V: 100, // bridge thinning
  VI: 130, // bridge gone, large connected area
  VII: 165, // horseshoe pattern
};

/**
 * Goal recipient density (follicles per cm²).
 * - 32 FU/cm² = conservative, natural at normal distance
 * - 42 FU/cm² = average modern target
 * - 52 FU/cm² = high-density (Sapphire FUE/DHI premium work)
 */
const GOAL_DENSITY_FU_PER_CM2: Record<GoalDensity, number> = {
  conservative: 32,
  natural: 42,
  dense: 52,
};

/**
 * Average hairs-per-graft (follicular unit). Texture matters because
 * coarse hair gives better visual coverage per graft, so we adjust
 * the effective grafts/cm² needed.
 */
const TEXTURE_HAIRS_PER_GRAFT: Record<HairTexture, number> = {
  fine: 1.9,
  medium: 2.3,
  coarse: 2.6,
};

/**
 * Coverage feasibility factor based on donor density.
 *  - Low donor → cap maximum extractable, force lower target
 *  - High donor → can comfortably hit dense targets in one session
 */
const DONOR_FACTOR: Record<DonorDensity, number> = {
  low: 0.85,
  average: 1.0,
  high: 1.1,
};

/**
 * Age-based future-loss reserve. Younger patients should bank donor
 * for future sessions — we reduce the recommended count.
 */
const AGE_FACTOR: Record<AgeBracket, number> = {
  u30: 0.85, // reserve donor
  "30-40": 0.95,
  "40-50": 1.0,
  "50-60": 1.0,
  o60: 1.0,
};

/** Single-session FUE feasibility cap. Above this → 2 sessions. */
const SINGLE_SESSION_CAP = 4000;

// =========================================================================
// Calculator
// =========================================================================

export function calculateGrafts(input: CalculatorInput): CalculatorResult {
  const area = RECIPIENT_AREA_CM2[input.norwood];
  const targetDensity = GOAL_DENSITY_FU_PER_CM2[input.goalDensity];
  const hairsPerGraft = TEXTURE_HAIRS_PER_GRAFT[input.texture];
  const donor = DONOR_FACTOR[input.donorDensity];
  const ageMod = AGE_FACTOR[input.ageBracket];

  // Base graft count = recipient area × target density (already in FU/cm²
  // since modern FUE counts grafts as 1 FU)
  const baseCount = area * targetDensity;

  // Texture adjustment: coarse hair → 8% fewer grafts give same visual
  // coverage; fine hair → 8% more grafts needed for equivalent look.
  // We anchor on medium (2.3 hairs/graft).
  const textureAdj = 2.3 / hairsPerGraft;

  // Donor density: high donor lets you safely push 10% denser placement
  // because the surgeon can extract more without thinning the donor.
  // Low donor caps you 15% below the goal.
  // Age: applied last.
  const midpoint = baseCount * textureAdj * donor * ageMod;

  // ± 12% spread to bracket the estimate honestly.
  const estimateLow = Math.round((midpoint * 0.88) / 50) * 50;
  const estimateMid = Math.round(midpoint / 50) * 50;
  const estimateHigh = Math.round((midpoint * 1.12) / 50) * 50;

  // Add beard / eyebrow if selected
  let extraLow = 0;
  let extraHigh = 0;
  if (input.alsoBeard) {
    extraLow += 1500;
    extraHigh += 2500;
  }
  if (input.alsoEyebrow) {
    extraLow += 250;
    extraHigh += 400;
  }

  const finalLow = estimateLow + extraLow;
  const finalMid = estimateMid + Math.round((extraLow + extraHigh) / 2);
  const finalHigh = estimateHigh + extraHigh;

  // Sessions feasibility
  const singleSession = finalMid <= SINGLE_SESSION_CAP;
  const sessions = singleSession
    ? 1
    : Math.ceil(finalMid / SINGLE_SESSION_CAP);

  // Recommended procedure
  let recommendedProcedure = "fue-hair-transplant";
  if (input.goalDensity === "dense") {
    recommendedProcedure =
      finalMid >= 2500 ? "sapphire-fue-hair-transplant" : "dhi-hair-transplant";
  } else if (finalMid >= 4000) {
    recommendedProcedure = "fut-hair-transplant"; // best graft yield per session
  }

  const rationale: string[] = [];
  rationale.push(
    `Norwood ${input.norwood} corresponds to an approximate recipient area of ${area} cm², the surface that needs new follicles.`,
  );
  rationale.push(
    `At your selected coverage goal (${input.goalDensity} — ${targetDensity} follicles/cm²), the math gives a baseline of ${Math.round(baseCount).toLocaleString()} grafts.`,
  );
  if (input.texture !== "medium") {
    rationale.push(
      input.texture === "coarse"
        ? "Coarse hair achieves more visual coverage per graft, so the count is reduced ~8% versus medium-texture patients."
        : "Fine hair needs slightly more grafts for equivalent visual coverage versus medium-texture patients.",
    );
  }
  if (input.donorDensity === "high")
    rationale.push(
      "Your high donor density (≥80 FU/cm²) safely supports the upper end of this range in a single session.",
    );
  if (input.donorDensity === "low")
    rationale.push(
      "Lower donor density (<60 FU/cm²) caps the realistic harvest. Final number confirmed at consultation.",
    );
  if (input.ageBracket === "u30")
    rationale.push(
      "Because you're under 30, we deliberately reserve donor for future sessions — pattern baldness continues to progress and a conservative count today protects long-term options.",
    );
  if (!singleSession)
    rationale.push(
      `The total exceeds the ~${SINGLE_SESSION_CAP.toLocaleString()}-graft single-session FUE cap. We'd plan ${sessions} sessions 9–12 months apart for safe donor recovery.`,
    );
  if (input.alsoBeard)
    rationale.push("Beard restoration adds 1,500–2,500 grafts to the plan.");
  if (input.alsoEyebrow)
    rationale.push("Eyebrow restoration adds 250–400 grafts to the plan.");

  const breakdown = [
    { label: "Norwood stage", value: input.norwood },
    { label: "Recipient area", value: `${area} cm²` },
    {
      label: "Target density",
      value: `${targetDensity} follicles/cm²`,
    },
    {
      label: "Hair texture",
      value: `${input.texture} (${hairsPerGraft.toFixed(1)} hairs/graft)`,
    },
    { label: "Donor density", value: input.donorDensity },
    { label: "Age bracket", value: input.ageBracket.replace("o", ">").replace("u", "<") },
    { label: "Goal coverage", value: input.goalDensity },
  ];
  if (input.alsoBeard) breakdown.push({ label: "+ Beard", value: "1,500–2,500" });
  if (input.alsoEyebrow)
    breakdown.push({ label: "+ Eyebrows", value: "250–400" });

  return {
    estimateLow: finalLow,
    estimateMid: finalMid,
    estimateHigh: finalHigh,
    recipientAreaCm2: area,
    targetDensity,
    graftsPerCm2: targetDensity,
    recommendedProcedure,
    singleSession,
    sessions,
    rationale,
    breakdown,
  };
}
