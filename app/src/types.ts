export type Quadrant = "TL" | "TR" | "BR" | "BL";

export type OpType = "add" | "catA" | "sub" | "catB";

export interface Step {
  index: number;
  loop: number;
  quadrant: Quadrant;
  op: OpType;
  prompt: string;
  expected: number | null;
  category: string | null;
  runningTotalBefore: number;
}

export interface StepRecord {
  step: Step;
  answer: string;
  correct: boolean | null;
  startedAt: number;
  endedAt: number;
  elapsedMs: number;
}

export interface SessionConfig {
  loops: number;
  difficulty: number;
  scale: number;
  audio: boolean;
  staticNumbers: boolean;
  startNumber: number;
  categoryA: string;
  categoryB: string;
}

export interface SessionResult {
  id: string;
  createdAt: number;
  config: SessionConfig;
  steps: Step[];
  records: StepRecord[];
  totalMs: number;
}
