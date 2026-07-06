import type { CSSProperties } from "react";
import type { Direction, RoundSpec } from "./types";
import { AnaglyphNumber } from "./AnaglyphNumber";

export interface Feedback {
  selected: Direction | null;
  correct: boolean;
  targetDirection: Direction;
}

interface Props {
  round: RoundSpec;
  disabled: boolean;
  feedback: Feedback | null;
  onSelect: (dir: Direction) => void;
}

const POS: Record<Direction, CSSProperties> = {
  N: { top: "6%", left: "50%", transform: "translateX(-50%)" },
  S: { bottom: "6%", left: "50%", transform: "translateX(-50%)" },
  E: { right: "6%", top: "50%", transform: "translateY(-50%)" },
  W: { left: "6%", top: "50%", transform: "translateY(-50%)" },
};

export function AnaglyphBoard({ round, disabled, feedback, onSelect }: Props) {
  return (
    <div
      className="relative rounded-xl shadow-inner"
      style={{
        width: "min(70vh, 90vw)",
        height: "min(70vh, 90vw)",
        background: "#050505",
        border: "1px solid #222",
      }}
    >
      {/* Central fixation cross to aid fusion */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 22,
          height: 22,
          transform: "translate(-50%, -50%)",
          opacity: 0.5,
        }}
      >
        <div style={{ position: "absolute", top: 10, left: 0, width: 22, height: 2, background: "#888" }} />
        <div style={{ position: "absolute", left: 10, top: 0, width: 2, height: 22, background: "#888" }} />
      </div>

      {round.numbers.map((n) => {
        const isTarget = n.direction === round.targetDirection;
        const isSelected = feedback?.selected === n.direction;
        let ring = "transparent";
        if (feedback) {
          if (isTarget) ring = "#22c55e";
          else if (isSelected) ring = "#ef4444";
        }
        return (
          <button
            key={n.direction}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(n.direction)}
            aria-label={`Select ${n.direction}`}
            style={{
              position: "absolute",
              ...POS[n.direction],
              padding: 10,
              borderRadius: 12,
              border: `3px solid ${ring}`,
              background: "transparent",
              cursor: disabled ? "default" : "pointer",
            }}
          >
            <AnaglyphNumber value={n.value} disparity={n.disparity} mode={round.mode} />
          </button>
        );
      })}
    </div>
  );
}
