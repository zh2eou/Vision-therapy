import type { Step, Quadrant } from "../types";

interface Props {
  step: Step | null;
  startNumber: number;
  categoryA: string;
  categoryB: string;
  scale: number; // 0.5 - 1
  showLastSum?: { text: string; quadrant: Quadrant } | null;
}

const QUAD_POS: Record<Quadrant, { x: number; y: number; anchor: string }> = {
  TL: { x: 150, y: 170, anchor: "middle" },
  TR: { x: 350, y: 170, anchor: "middle" },
  BR: { x: 350, y: 330, anchor: "middle" },
  BL: { x: 150, y: 330, anchor: "middle" },
};

export function Circle({ step, startNumber, categoryA, categoryB, scale }: Props) {
  const active = step?.quadrant ?? null;

  const quadrantLabel = (q: Quadrant) => {
    if (q === "TL") return step && step.quadrant === "TL" ? step.prompt : "+N";
    if (q === "BR") return step && step.quadrant === "BR" ? step.prompt : "-N";
    if (q === "TR") return categoryA;
    return categoryB;
  };

  const isActive = (q: Quadrant) => active === q;

  return (
    <div
      className="flex items-center justify-center w-full h-full"
      style={{ transform: `scale(${scale})`, transformOrigin: "center" }}
    >
      <svg
        viewBox="0 0 500 500"
        preserveAspectRatio="xMidYMid meet"
        style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "100%" }}
      >
        {/* Starting number top-left */}
        <text x="40" y="60" fontSize="44" fontWeight="600" fill="#111">
          {startNumber}
        </text>
        <path
          d="M 75 72 Q 110 95 135 120"
          fill="none"
          stroke="#111"
          strokeWidth="2.5"
          markerEnd="url(#arrow)"
        />

        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#111" />
          </marker>
        </defs>

        {/* Circle + cross */}
        <circle cx="250" cy="250" r="180" fill="#fafafa" stroke="#111" strokeWidth="3" />
        <line x1="250" y1="70" x2="250" y2="430" stroke="#111" strokeWidth="2" />
        <line x1="70" y1="250" x2="430" y2="250" stroke="#111" strokeWidth="2" />

        {/* Quadrant highlights */}
        {(["TL", "TR", "BR", "BL"] as Quadrant[]).map((q) => {
          const pos = QUAD_POS[q];
          return (
            <g key={q}>
              {isActive(q) && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="56"
                  fill="rgba(59,130,246,0.18)"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  className="animate-pulse"
                />
              )}
              <text
                x={pos.x}
                y={pos.y + 10}
                fontSize={q === "TL" || q === "BR" ? 36 : 24}
                fontWeight="600"
                textAnchor="middle"
                fill="#111"
              >
                {quadrantLabel(q)}
              </text>
            </g>
          );
        })}

        {/* Clockwise arrows (inside circle, between quadrants) */}
        <path d="M 230 95 Q 270 90 300 105" fill="none" stroke="#111" strokeWidth="2" markerEnd="url(#arrow)" />
        <path d="M 405 230 Q 410 270 395 300" fill="none" stroke="#111" strokeWidth="2" markerEnd="url(#arrow)" />
        <path d="M 270 405 Q 230 410 200 395" fill="none" stroke="#111" strokeWidth="2" markerEnd="url(#arrow)" />
        <path d="M 95 270 Q 90 230 105 200" fill="none" stroke="#111" strokeWidth="2" markerEnd="url(#arrow)" />
      </svg>
    </div>
  );
}
