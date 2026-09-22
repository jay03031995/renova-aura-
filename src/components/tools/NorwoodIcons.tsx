/**
 * Norwood-Hamilton scale visual diagrams.
 *
 * Each component renders a simplified front + side view of a head with
 * the bald/recessed region shaded in sage. Pure SVG, no external assets,
 * fully themeable via CSS (currentColor where possible).
 *
 * Scale: viewBox is 160 × 96 for each, so the front-view occupies x=0–70
 * and the side-view occupies x=90–160. Vertical center ~48.
 */
import type { Norwood } from "@/lib/graftCalculator";

type Props = { className?: string };

const SCALP = "#1a1f15"; // dark hair
const SKIN = "#e8c9a8"; // skin
const BALD = "#7a8c5b"; // sage — affected area
const STROKE = "#2a3520";

/** Shared face + neck silhouette (front view). Pixel-precise within the 70 × 96 box. */
function FaceFront({ children }: { children: React.ReactNode }) {
  return (
    <g>
      {/* neck + shoulders */}
      <path
        d="M 22 86 L 16 96 L 54 96 L 48 86 Z"
        fill={SKIN}
        stroke={STROKE}
        strokeWidth="0.5"
      />
      {/* head — egg shape */}
      <ellipse cx="35" cy="44" rx="22" ry="28" fill={SKIN} stroke={STROKE} strokeWidth="0.7" />
      {/* full scalp hair (default — overridden by children clip) */}
      <path
        d="M 13 38 Q 13 18 35 16 Q 57 18 57 38 Q 53 30 35 28 Q 17 30 13 38 Z"
        fill={SCALP}
      />
      {children}
      {/* eyes (tiny) */}
      <circle cx="26" cy="48" r="0.9" fill={STROKE} />
      <circle cx="44" cy="48" r="0.9" fill={STROKE} />
      {/* nose */}
      <path d="M 35 51 L 33 60 L 37 60 Z" fill="none" stroke={STROKE} strokeWidth="0.4" />
      {/* mouth */}
      <path d="M 31 67 Q 35 69 39 67" stroke={STROKE} strokeWidth="0.5" fill="none" />
    </g>
  );
}

/** Shared face silhouette (side view, facing right). 70 × 96 box at x=90. */
function FaceSide({ children }: { children: React.ReactNode }) {
  return (
    <g transform="translate(90 0)">
      {/* neck */}
      <path d="M 32 86 L 26 96 L 50 96 L 44 86 Z" fill={SKIN} stroke={STROKE} strokeWidth="0.5" />
      {/* head profile facing right */}
      <path
        d="M 18 44 Q 18 18 38 16 Q 60 18 60 44 Q 60 60 56 70 Q 53 78 48 80 L 44 86 L 32 86 Q 26 80 22 72 Q 18 60 18 44 Z"
        fill={SKIN}
        stroke={STROKE}
        strokeWidth="0.7"
      />
      {/* full scalp hair */}
      <path
        d="M 19 40 Q 19 18 38 16 Q 60 18 60 40 Q 60 32 56 28 Q 50 24 38 24 Q 22 26 19 40 Z"
        fill={SCALP}
      />
      {children}
      {/* ear */}
      <path d="M 49 47 Q 51 49 51 53 Q 51 56 49 57" fill="none" stroke={STROKE} strokeWidth="0.5" />
      {/* eye */}
      <circle cx="49" cy="46" r="0.8" fill={STROKE} />
      {/* nose */}
      <path d="M 60 50 L 64 52 L 60 55" fill="none" stroke={STROKE} strokeWidth="0.5" />
      {/* mouth */}
      <path d="M 56 62 L 60 63" stroke={STROKE} strokeWidth="0.5" fill="none" />
    </g>
  );
}

function Frame({ children, className }: Props & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 160 96"
      className={className}
      style={{ display: "block", width: "100%", height: "auto" }}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// Norwood II — mild frontal recession at temples
export function NorwoodII({ className }: Props) {
  return (
    <Frame className={className}>
      <FaceFront>
        <path d="M 13 38 Q 17 30 24 30 L 24 36 Q 20 36 17 38 Z" fill={BALD} />
        <path d="M 57 38 Q 53 30 46 30 L 46 36 Q 50 36 53 38 Z" fill={BALD} />
      </FaceFront>
      <FaceSide>
        <path d="M 19 38 Q 24 30 32 28 L 32 34 Q 26 34 22 38 Z" fill={BALD} />
      </FaceSide>
    </Frame>
  );
}

// Norwood III — deeper temple recession, M-shape
export function NorwoodIII({ className }: Props) {
  return (
    <Frame className={className}>
      <FaceFront>
        <path d="M 13 38 Q 17 26 28 24 L 28 36 Q 22 36 17 38 Z" fill={BALD} />
        <path d="M 57 38 Q 53 26 42 24 L 42 36 Q 48 36 53 38 Z" fill={BALD} />
      </FaceFront>
      <FaceSide>
        <path d="M 19 38 Q 22 24 34 22 L 34 34 Q 26 34 22 38 Z" fill={BALD} />
      </FaceSide>
    </Frame>
  );
}

// Norwood III Vertex — temple recession plus vertex (crown) thinning
export function NorwoodIIIv({ className }: Props) {
  return (
    <Frame className={className}>
      <FaceFront>
        <path d="M 13 38 Q 17 26 28 24 L 28 36 Q 22 36 17 38 Z" fill={BALD} />
        <path d="M 57 38 Q 53 26 42 24 L 42 36 Q 48 36 53 38 Z" fill={BALD} />
        {/* vertex circle visible through top */}
        <ellipse cx="35" cy="22" rx="8" ry="4" fill={BALD} opacity="0.85" />
      </FaceFront>
      <FaceSide>
        <path d="M 19 38 Q 22 24 34 22 L 34 34 Q 26 34 22 38 Z" fill={BALD} />
        <ellipse cx="35" cy="24" rx="9" ry="5" fill={BALD} opacity="0.85" />
      </FaceSide>
    </Frame>
  );
}

// Norwood IV — frontal recession + clear vertex baldness, bridge intact
export function NorwoodIV({ className }: Props) {
  return (
    <Frame className={className}>
      <FaceFront>
        <path d="M 13 38 Q 17 22 30 22 L 30 38 Q 22 38 17 38 Z" fill={BALD} />
        <path d="M 57 38 Q 53 22 40 22 L 40 38 Q 48 38 53 38 Z" fill={BALD} />
        <ellipse cx="35" cy="22" rx="12" ry="5" fill={BALD} />
      </FaceFront>
      <FaceSide>
        <path d="M 19 38 Q 22 22 36 22 L 36 36 Q 28 36 22 38 Z" fill={BALD} />
        <ellipse cx="40" cy="22" rx="13" ry="6" fill={BALD} />
      </FaceSide>
    </Frame>
  );
}

// Norwood V — bridge thinning between frontal and vertex
export function NorwoodV({ className }: Props) {
  return (
    <Frame className={className}>
      <FaceFront>
        <path d="M 13 38 Q 14 18 35 18 Q 56 18 57 38 Q 53 24 35 24 Q 17 24 13 38 Z" fill={BALD} />
        <rect x="29" y="20" width="12" height="10" fill={BALD} opacity="0.75" />
      </FaceFront>
      <FaceSide>
        <path d="M 19 38 Q 20 18 38 18 Q 56 20 58 36 Q 50 24 38 24 Q 22 26 19 38 Z" fill={BALD} />
      </FaceSide>
    </Frame>
  );
}

// Norwood VI — bridge gone, frontal + vertex connected
export function NorwoodVI({ className }: Props) {
  return (
    <Frame className={className}>
      <FaceFront>
        <path d="M 13 40 Q 13 14 35 14 Q 57 14 57 40 L 53 38 Q 51 30 35 28 Q 19 30 17 38 Z" fill={BALD} />
      </FaceFront>
      <FaceSide>
        <path d="M 19 42 Q 19 14 38 14 Q 60 16 60 42 Q 56 34 38 32 Q 22 32 19 42 Z" fill={BALD} />
      </FaceSide>
    </Frame>
  );
}

// Norwood VII — horseshoe pattern, only sides + back remain
export function NorwoodVII({ className }: Props) {
  return (
    <Frame className={className}>
      <FaceFront>
        <path d="M 13 46 Q 13 14 35 14 Q 57 14 57 46 L 55 44 Q 50 38 35 36 Q 20 38 15 44 Z" fill={BALD} />
      </FaceFront>
      <FaceSide>
        <path
          d="M 19 50 Q 19 14 38 14 Q 60 16 60 50 Q 58 42 50 38 Q 38 36 26 40 Q 22 44 19 50 Z"
          fill={BALD}
        />
      </FaceSide>
    </Frame>
  );
}

export const NORWOOD_ICONS: Record<
  Norwood,
  React.ComponentType<{ className?: string }>
> = {
  II: NorwoodII,
  III: NorwoodIII,
  IIIv: NorwoodIIIv,
  IV: NorwoodIV,
  V: NorwoodV,
  VI: NorwoodVI,
  VII: NorwoodVII,
};
