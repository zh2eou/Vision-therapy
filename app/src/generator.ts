import { pickTwoCategories } from "./categories";
import type { CategoryDef } from "./categories";
import type { Step, SessionConfig } from "./types";

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function numberRangeForDifficulty(diff: number): [number, number] {
  // tier 1: 1-9, tier 5: 1-50
  const max = 6 + diff * 8;
  return [1, max];
}

export function generateSession(
  loops: number,
  difficulty: number,
  staticNumbers = false,
  seed = Date.now(),
): { steps: Step[]; config: Pick<SessionConfig, "startNumber" | "categoryA" | "categoryB"> & { catDefs: [CategoryDef, CategoryDef] } } {
  const rng = mulberry32(seed);
  const [lo, hi] = numberRangeForDifficulty(difficulty);
  const rand = (min: number, max: number) =>
    Math.floor(rng() * (max - min + 1)) + min;

  const [catA, catB] = pickTwoCategories(difficulty, rng);
  const startNumber = rand(1, 20);

  const staticAdd = rand(lo, hi);
  const staticSub = rand(lo, hi);

  const steps: Step[] = [];
  let total = startNumber;
  let index = 0;

  for (let loop = 0; loop < loops; loop++) {
    // TL: +N
    {
      const n = staticNumbers ? staticAdd : rand(lo, hi);
      const before = total;
      const expected = before + n;
      steps.push({
        index: index++,
        loop,
        quadrant: "TL",
        op: "add",
        prompt: `+${n}`,
        expected,
        category: null,
        runningTotalBefore: before,
      });
      total = expected;
    }
    // TR: category A
    steps.push({
      index: index++,
      loop,
      quadrant: "TR",
      op: "catA",
      prompt: catA.name,
      expected: null,
      category: catA.name,
      runningTotalBefore: total,
    });
    // BR: -N (random mode clamps to avoid negatives; static mode keeps N fixed)
    {
      const n = staticNumbers
        ? staticSub
        : rand(lo, Math.max(lo, Math.min(hi, total)));
      const before = total;
      const expected = before - n;
      steps.push({
        index: index++,
        loop,
        quadrant: "BR",
        op: "sub",
        prompt: `-${n}`,
        expected,
        category: null,
        runningTotalBefore: before,
      });
      total = expected;
    }
    // BL: category B
    steps.push({
      index: index++,
      loop,
      quadrant: "BL",
      op: "catB",
      prompt: catB.name,
      expected: null,
      category: catB.name,
      runningTotalBefore: total,
    });
  }

  return {
    steps,
    config: {
      startNumber,
      categoryA: catA.name,
      categoryB: catB.name,
      catDefs: [catA, catB],
    },
  };
}
