export type Mode = "converge" | "diverge" | "alternate";

// Concrete depth direction for a single round (alternate resolves to one of these).
export type DepthMode = "converge" | "diverge";

export type Direction = "N" | "E" | "S" | "W";

export type Outcome = "correct" | "incorrect" | "timeout";

export interface NumberSpec {
  direction: Direction;
  value: number;
  /** Total horizontal red/green separation in px. Larger = stronger depth ("pop"). */
  disparity: number;
  isTarget: boolean;
}

export interface RoundSpec {
  index: number;
  level: number;
  mode: DepthMode;
  numbers: NumberSpec[];
  targetDirection: Direction;
}

export interface RoundRecord {
  index: number;
  level: number;
  mode: DepthMode;
  targetDirection: Direction;
  selected: Direction | null;
  outcome: Outcome;
  elapsedMs: number;
  levelAfter: number;
}

export interface AnaglyphConfig {
  mode: Mode;
  timeoutSec: number;
  rounds: number;
  startLevel: number;
  audio: boolean;
}

export interface AnaglyphResult {
  id: string;
  createdAt: number;
  config: AnaglyphConfig;
  records: RoundRecord[];
  totalMs: number;
}
