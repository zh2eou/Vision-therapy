import type { Step, StepRecord, SessionResult, SessionConfig } from "./types";
import { validateAnswer } from "./categories";
import type { CategoryDef } from "./categories";

export type Phase = "idle" | "running" | "complete";

export interface State {
  phase: Phase;
  config: SessionConfig | null;
  catDefs: [CategoryDef, CategoryDef] | null;
  steps: Step[];
  records: StepRecord[];
  currentIndex: number;
  startedAt: number;
  stepStartedAt: number;
  lastResult: SessionResult | null;
}

export type Action =
  | {
      type: "start";
      config: SessionConfig;
      catDefs: [CategoryDef, CategoryDef];
      steps: Step[];
    }
  | { type: "submit"; answer: string }
  | { type: "reset" };

export const initialState: State = {
  phase: "idle",
  config: null,
  catDefs: null,
  steps: [],
  records: [],
  currentIndex: 0,
  startedAt: 0,
  stepStartedAt: 0,
  lastResult: null,
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start": {
      const now = performance.now();
      return {
        ...state,
        phase: "running",
        config: action.config,
        catDefs: action.catDefs,
        steps: action.steps,
        records: [],
        currentIndex: 0,
        startedAt: now,
        stepStartedAt: now,
      };
    }
    case "submit": {
      if (state.phase !== "running") return state;
      const step = state.steps[state.currentIndex];
      const now = performance.now();
      let correct: boolean | null = null;
      if (step.op === "add" || step.op === "sub") {
        const n = Number(action.answer.trim());
        correct = Number.isFinite(n) && n === step.expected;
      } else if (state.catDefs) {
        const cat = step.op === "catA" ? state.catDefs[0] : state.catDefs[1];
        correct = validateAnswer(cat, action.answer);
      }
      const record: StepRecord = {
        step,
        answer: action.answer,
        correct,
        startedAt: state.stepStartedAt,
        endedAt: now,
        elapsedMs: now - state.stepStartedAt,
      };
      const records = [...state.records, record];
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.steps.length) {
        const result: SessionResult = {
          id: String(Date.now()),
          createdAt: Date.now(),
          config: state.config!,
          steps: state.steps,
          records,
          totalMs: now - state.startedAt,
        };
        return {
          ...state,
          phase: "complete",
          records,
          currentIndex: nextIndex,
          lastResult: result,
        };
      }
      return {
        ...state,
        records,
        currentIndex: nextIndex,
        stepStartedAt: now,
      };
    }
    case "reset":
      return { ...initialState, lastResult: state.lastResult };
  }
}
