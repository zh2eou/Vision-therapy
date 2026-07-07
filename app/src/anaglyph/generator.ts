import type { Direction, DepthMode, Mode, Outcome, RoundSpec, NumberSpec } from "./types";

export const MIN_LEVEL = 1;
export const MAX_LEVEL = 12;

const DIRECTIONS: Direction[] = ["N", "E", "S", "W"];

function clamp(x: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, x));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * Difficulty is expressed as how easy it is to tell which number has the strongest
 * depth. At low levels the target's disparity is far above the distractors (obvious);
 * at high levels the gap shrinks so all four look almost equally "popped".
 */
export interface LevelParams {
  targetDisparity: number;
  distractorMin: number;
  distractorMax: number;
}

export function levelToParams(level: number): LevelParams {
  const L = clamp(level, MIN_LEVEL, MAX_LEVEL);
  const t = (L - MIN_LEVEL) / (MAX_LEVEL - MIN_LEVEL);
  // Target pop is a touch smaller at high levels (harder to fuse cleanly too).
  const targetDisparity = Math.round(lerp(22, 11, t));
  // Gap between the target and the strongest distractor shrinks with level.
  const gap = lerp(13, 1.5, t);
  const distractorMax = Math.max(0, targetDisparity - gap);
  const distractorMin = Math.max(0, distractorMax - 6);
  return { targetDisparity, distractorMin, distractorMax };
}

export function resolveMode(mode: Mode, roundIndex: number): DepthMode {
  if (mode === "alternate") return roundIndex % 2 === 0 ? "converge" : "diverge";
  return mode;
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function makeRound(
  index: number,
  level: number,
  mode: Mode,
  rng: () => number = Math.random,
): RoundSpec {
  const { targetDisparity, distractorMin, distractorMax } = levelToParams(level);
  const depthMode = resolveMode(mode, index);

  // Four distinct digits so each position reads as a different number.
  const values = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rng).slice(0, 4);
  const targetIdx = Math.floor(rng() * DIRECTIONS.length);

  const numbers: NumberSpec[] = DIRECTIONS.map((direction, i) => {
    const isTarget = i === targetIdx;
    const disparity = isTarget
      ? targetDisparity
      : Math.round(lerp(distractorMin, distractorMax, rng()));
    return { direction, value: values[i], disparity, isTarget };
  });

  return {
    index,
    level,
    mode: depthMode,
    numbers,
    targetDirection: DIRECTIONS[targetIdx],
  };
}

/**
 * Adaptive difficulty: a correct answer bumps difficulty up one level; a wrong
 * guess drops it one level; a timeout drops it two levels ("one or two levels").
 */
export function nextLevel(level: number, outcome: Outcome): number {
  if (outcome === "correct") return clamp(level + 1, MIN_LEVEL, MAX_LEVEL);
  if (outcome === "incorrect") return clamp(level - 1, MIN_LEVEL, MAX_LEVEL);
  return clamp(level - 2, MIN_LEVEL, MAX_LEVEL); // timeout
}
