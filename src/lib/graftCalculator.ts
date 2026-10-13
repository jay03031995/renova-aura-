/**
 * Simple zone-and-severity planning estimate.
 *
 * The zone bands and severity factors below are rough UX defaults, not a
 * validated medical model. A clinician should replace them with RenovaAura's
 * own approved planning table before the result is described as clinic-grade.
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
export type ZoneSelection = { zone: GraftZone; severity: Severity };
export type GraftEstimate = { low: number; high: number };

export const GRAFT_ZONES: readonly GraftZone[] = [1, 2, 3, 4, 5, 6, 7, 8];

// Broad, per-zone graft bands for a rough public-facing estimate. These are
// intentionally isolated so a clinician can replace them with approved data.
const ZONE_BASE_ESTIMATES: Record<GraftZone, GraftEstimate> = {
  1: { low: 300, high: 600 },
  2: { low: 400, high: 800 },
  3: { low: 600, high: 1_000 },
  4: { low: 600, high: 1_000 },
  5: { low: 600, high: 1_000 },
  6: { low: 600, high: 1_000 },
  7: { low: 400, high: 800 },
  8: { low: 300, high: 600 },
};

const SEVERITY_FACTORS: Record<Severity, number> = {
  mild: 0.7,
  moderate: 1,
  severe: 1.3,
};

function roundToHundred(value: number): number {
  return Math.round(value / 100) * 100;
}

/** Adds each selected zone's severity-adjusted band once, rounding per zone. */
export function calculateGrafts(selections: readonly ZoneSelection[]) {
  if (!selections || selections.length === 0) {
    throw new RangeError("Select at least one scalp zone.");
  }

  const seen = new Set<GraftZone>();
  const zones = selections.map(({ zone, severity }) => {
    if (!GRAFT_ZONES.includes(zone) || seen.has(zone)) {
      throw new RangeError("Choose each scalp zone no more than once.");
    }
    if (!(severity in SEVERITY_FACTORS)) {
      throw new RangeError(`Choose a severity for scalp zone ${zone}.`);
    }
    seen.add(zone);
    const factor = SEVERITY_FACTORS[severity];
    const base = ZONE_BASE_ESTIMATES[zone];
    return {
      zone,
      severity,
      low: roundToHundred(base.low * factor),
      high: roundToHundred(base.high * factor),
    };
  });

  return zones.reduce(
    (total, zone) => ({
      low: total.low + zone.low,
      high: total.high + zone.high,
      zones,
    }),
    { low: 0, high: 0, zones },
  );
}
