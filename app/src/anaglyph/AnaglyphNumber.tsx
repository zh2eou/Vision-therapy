import type { CSSProperties } from "react";
import type { DepthMode } from "./types";

interface Props {
  value: number;
  /** Total red/green separation in px. */
  disparity: number;
  mode: DepthMode;
  size?: number;
}

// Assumes the RED lens is worn over the LEFT eye and the GREEN lens over the
// RIGHT eye (the common orientation). For convergence (object in front of the
// screen / crossed disparity) the left-eye image sits to the right and the
// right-eye image to the left; divergence (behind the screen) is the reverse.
// If a user's glasses are swapped, front/back invert but the task is unchanged
// because the target is always the number with the largest disparity.
export function AnaglyphNumber({ value, disparity, mode, size = 76 }: Props) {
  const sign = mode === "converge" ? 1 : -1;
  const redX = (sign * disparity) / 2;
  const greenX = (-sign * disparity) / 2;

  const glyph: CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: size,
    lineHeight: 1,
    mixBlendMode: "screen",
    userSelect: "none",
    fontVariantNumeric: "tabular-nums",
  };

  return (
    <div style={{ position: "relative", width: size * 0.85, height: size }}>
      <span style={{ ...glyph, color: "#ff2d2d", transform: `translateX(${redX}px)` }}>
        {value}
      </span>
      <span style={{ ...glyph, color: "#2dff2d", transform: `translateX(${greenX}px)` }}>
        {value}
      </span>
    </div>
  );
}
