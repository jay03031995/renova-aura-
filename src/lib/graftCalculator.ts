
/**
 * RenovaAura Hair Graft Calculator
 *
 * Estimates are preliminary planning ranges, not a validated medical model.
 * Stage ranges, zone mappings, and severity factors require clinician review.
 */

export const NORWOOD_STAGES = [
  { value: "1", label: "I", description: "No visible pattern loss", zones: [] },
  { value: "2", label: "II", description: "Slight temple recession", zones: [1, 7] },
  { value: "2A", label: "II A", description: "Recession across the front", zones: [1, 2, 7] },
  { value: "3", label: "III", description: "Defined temple recession", zones: [1, 2, 7] },
  { value: "3V", label: "III Vertex", description: "Temple recession and crown thinning", zones: [1, 2, 5, 7] },
  { value: "4", label: "IV", description: "Frontal loss and a separate crown area", zones: [1, 2, 4, 5, 7] },
  { value: "4A", label: "IV A", description: "Frontal loss extends farther back", zones: [1, 2, 3, 4, 7] },
  { value: "5", label: "V", description: "Frontal and crown areas enlarge", zones: [1, 2, 3, 4, 5, 7] },
  { value: "5A", label: "V A", description: "Frontal loss extends across the top", zones: [1, 2, 3, 4, 5, 6, 7] },
  { value: "6", label: "VI", description: "Frontal and crown loss meet", zones: [1, 2, 3, 4, 5, 6, 7, 8] },
] as const;

export type Norwood = (typeof NORWOOD_STAGES)[number]["value"];
export type Severity = "mild" | "moderate" | "severe";
export type GraftZone = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type ZoneSelection = {
  zone: GraftZone;
  severity: Severity;
};

export type GraftEstimate = {
  low: number;
  high: number;
};

export type ZoneEstimate = ZoneSelection & GraftEstimate;

export type NorwoodStageEstimate = {
  stage: Norwood;
  label: string;
  description: string;
  zones: readonly number[];
  estimate: GraftEstimate | null;
};

export const GRAFT_ZONES: readonly GraftZone[] = [
  1, 2, 3, 4, 5, 6, 7, 8,
];

/**
 * Broad stage-level planning estimates.
 * The 2A, 4A, and 5A ranges are provisional approximations.
 * These are not individualized treatment recommendations.
 */
const NORWOOD_BASE_ESTIMATES: Record<
  Exclude<Norwood, "1">,
  GraftEstimate
> = {
  "2": { low: 800, high: 1500 },
  "2A": { low: 900, high: 1500 },
  "3": { low: 1500, high: 2500 },
  "3V": { low: 2000, high: 3500 },
  "4": { low: 2500, high: 3500 },
  "4A": { low: 2500, high: 4000 },
  "5": { low: 3500, high: 5000 },
  "5A": { low: 4000, high: 5500 },
  "6": { low: 4500, high: 6500 },
};

/**
 * Rough zone bands retained from the existing implementation.
 * Replace these with clinic-approved values before production use.
 */
const ZONE_BASE_ESTIMATES: Record<GraftZone, GraftEstimate> = {
  1: { low: 300, high: 600 },
  2: { low: 400, high: 800 },
  3: { low: 600, high: 1000 },
  4: { low: 600, high: 1000 },
  5: { low: 600, high: 1000 },
  6: { low: 600, high: 1000 },
  7: { low: 400, high: 800 },
  8: { low: 300, high: 600 },
};

/**
 * Configurable severity assumptions, retained from your old file.
 */
export const SEVERITY_FACTORS: Record<Severity, number> = {
  mild: 0.7,
  moderate: 1,
  severe: 1.3,
};

const VALID_SEVERITIES: readonly string[] = [
  "mild",
  "moderate",
  "severe",
];

function roundToHundred(value: number): number {
  return Math.round(value / 100) * 100;
}

function isValidZone(zone: number): zone is GraftZone {
  return GRAFT_ZONES.includes(zone as GraftZone);
}

function isValidSeverity(value: string): value is Severity {
  return VALID_SEVERITIES.includes(value);
}

export function getNorwoodStage(
  stage: Norwood
): NorwoodStageEstimate | undefined {
  const stageInfo = NORWOOD_STAGES.find(
    (item) => item.value === stage
  );

  if (!stageInfo) return undefined;

  const estimate =
    stage === "1"
      ? null
      : { ...NORWOOD_BASE_ESTIMATES[stage] };

  return {
    stage: stageInfo.value,
    label: stageInfo.label,
    description: stageInfo.description,
    zones: stageInfo.zones,
    estimate,
  };
}

export function getZonesForStage(stage: Norwood): GraftZone[] {
  const stageInfo = getNorwoodStage(stage);

  return (stageInfo?.zones ?? []).filter(isValidZone);
}

/**
 * Calculates the stage-based estimate.
 *
 * The Norwood range is the baseline.
 * Selected-zone severity refines that baseline using the average
 * severity factor. Zone estimates are NOT added to the stage estimate.
 *
 * If no zones are selected, the unadjusted stage range is returned.
 */
export function estimateByNorwoodStage(
  stage: Norwood,
  selections: readonly ZoneSelection[] = []
): GraftEstimate | null {
  const stageInfo = getNorwoodStage(stage);

  if (!stageInfo?.estimate) {
    return null;
  }

  if (selections.length === 0) {
    return { ...stageInfo.estimate };
  }

  validateSelections(selections);

  const averageFactor =
    selections.reduce(
      (total, selection) =>
        total + SEVERITY_FACTORS[selection.severity],
      0
    ) / selections.length;

  return {
    low: Math.max(
      0,
      roundToHundred(stageInfo.estimate.low * averageFactor)
    ),
    high: Math.max(
      0,
      roundToHundred(stageInfo.estimate.high * averageFactor)
    ),
  };
}

function validateSelections(
  selections: readonly ZoneSelection[]
): void {
  if (!selections || selections.length === 0) {
    throw new RangeError("Select at least one scalp zone.");
  }

  const seen = new Set<GraftZone>();

  for (const selection of selections) {
    const { zone, severity } = selection;

    if (!isValidZone(zone) || seen.has(zone)) {
      throw new RangeError(
        "Choose each scalp zone no more than once."
      );
    }

    if (!isValidSeverity(severity)) {
      throw new RangeError(
        `Choose a valid severity for scalp zone ${zone}.`
      );
    }

    seen.add(zone);
  }
}

/**
 * Zone-level breakdown retained for compatibility with existing code.
 * This total is a separate zone-based calculation. Do not add it to
 * the Norwood stage estimate.
 */
export function calculateGrafts(
  selections: readonly ZoneSelection[]
): {
  low: number;
  high: number;
  zones: ZoneEstimate[];
} {
  validateSelections(selections);

  const zones: ZoneEstimate[] = selections.map(
    ({ zone, severity }) => {
      const base = ZONE_BASE_ESTIMATES[zone];
      const factor = SEVERITY_FACTORS[severity];

      return {
        zone,
        severity,
        low: roundToHundred(base.low * factor),
        high: roundToHundred(base.high * factor),
      };
    }
  );

  return {
    low: zones.reduce((total, zone) => total + zone.low, 0),
    high: zones.reduce((total, zone) => total + zone.high, 0),
    zones,
  };
}
