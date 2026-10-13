import type { Norwood } from "@/lib/graftCalculator";

type Props = { stage: Norwood; className?: string };

const stagePatterns: Record<
  Norwood,
  { frontal: "none" | "mild" | "deep" | "advanced" | "progressing"; vertex: "none" | "small" | "large" | "joined" }
> = {
  "1": { frontal: "none", vertex: "none" },
  "2": { frontal: "mild", vertex: "none" },
  "2A": { frontal: "advanced", vertex: "none" },
  "3": { frontal: "deep", vertex: "none" },
  "3V": { frontal: "deep", vertex: "small" },
  "4": { frontal: "deep", vertex: "large" },
  "4A": { frontal: "progressing", vertex: "none" },
  "5": { frontal: "deep", vertex: "large" },
  "5A": { frontal: "progressing", vertex: "none" },
  "6": { frontal: "advanced", vertex: "joined" },
};

function FrontalLoss({ kind }: { kind: (typeof stagePatterns)[Norwood]["frontal"] }) {
  if (kind === "none") return null;
  if (kind === "mild") {
    return (
      <>
        <path d="M164 48 Q174 42 185 47 L181 54 Q174 50 168 55Z" />
        <path d="M236 47 Q247 42 257 48 L253 55 Q247 50 240 54Z" />
      </>
    );
  }
  if (kind === "deep") {
    return (
      <>
        <path d="M162 48 Q172 36 189 43 L184 55 Q175 50 166 59Z" />
        <path d="M232 43 Q249 36 259 48 L255 59 Q246 50 237 55Z" />
      </>
    );
  }
  if (kind === "progressing") {
    return (
      <path d="M163 48 Q171 31 210 32 Q249 31 258 48 L251 58 Q244 48 232 46 L233 68 Q220 73 205 68 L204 47 Q179 46 170 58Z" />
    );
  }
  return <path d="M164 48 Q169 34 210 33 Q251 34 257 48 L249 57 Q243 44 210 43 Q177 44 171 57Z" />;
}

function VertexLoss({ kind }: { kind: (typeof stagePatterns)[Norwood]["vertex"] }) {
  if (kind === "none") return null;
  if (kind === "small") {
    return <ellipse cx="220" cy="79" rx="9" ry="7" />;
  }
  if (kind === "large") {
    return <ellipse cx="220" cy="78" rx="16" ry="12" />;
  }
  return <path d="M165 48 Q177 43 210 43 Q243 43 257 48 L249 64 Q245 91 220 95 Q195 91 190 64Z" />;
}

export default function NorwoodIllustration({ stage, className }: Props) {
  const pattern = stagePatterns[stage];

  return (
    <svg
      viewBox="0 0 300 124"
      className={className}
      role="img"
      aria-label={`${stage} pattern shown in side-profile and top-down views`}
      focusable="false"
    >
      <rect x="3" y="3" width="140" height="118" rx="10" fill="#f7f6f0" />
      <rect x="157" y="3" width="140" height="118" rx="10" fill="#f7f6f0" />
      <text x="73" y="17" textAnchor="middle" className="norwood-illustration-label">SIDE PROFILE</text>
      <text x="227" y="17" textAnchor="middle" className="norwood-illustration-label">TOP VIEW</text>

      <g stroke="#66704f" strokeWidth="1.5" strokeLinejoin="round">
        <path
          d="M35 99 Q27 87 30 68 Q31 40 52 29 Q75 18 96 32 Q108 41 106 58 L111 67 L106 72 L108 79 Q106 87 98 88 L94 101Z"
          fill="#e8d4c2"
        />
        <path
          d="M31 67 Q28 37 51 28 Q75 18 96 32 Q104 38 106 50 Q97 42 88 39 Q74 33 62 38 Q44 43 37 62Z"
          fill="#263226"
          stroke="none"
        />
        {pattern.frontal !== "none" && (
          <path
            d={
              pattern.frontal === "mild"
                ? "M35 53 Q42 45 51 44 L55 51 Q45 52 39 61Z"
                : pattern.frontal === "deep"
                  ? "M33 59 Q39 42 55 39 L61 48 Q47 51 39 67Z"
                  : pattern.frontal === "progressing"
                    ? "M34 61 Q40 38 70 34 L79 42 Q56 48 44 72Z"
                    : "M34 61 Q40 38 68 35 L72 46 Q50 50 40 69Z"
            }
            fill="#d9b7a5"
            stroke="none"
          />
        )}
        {pattern.vertex !== "none" && (
          <ellipse
            cx="69"
            cy="37"
            rx={pattern.vertex === "small" ? 6 : pattern.vertex === "large" ? 10 : 16}
            ry={pattern.vertex === "small" ? 4 : pattern.vertex === "large" ? 7 : 11}
            fill="#d9b7a5"
            stroke="none"
          />
        )}
        <ellipse cx="220" cy="70" rx="40" ry="45" fill="#263226" />
        <g fill="#d9b7a5" stroke="none">
          <FrontalLoss kind={pattern.frontal} />
          <VertexLoss kind={pattern.vertex} />
        </g>
        <path d="M180 70 Q220 78 260 70" fill="none" stroke="#738063" strokeWidth=".7" strokeDasharray="2 3" />
      </g>
    </svg>
  );
}
