# Circle of Concentration — Implementation Plan

## Goal
Interactive vision-therapy exercise. User eyes track clockwise across 4 quadrants of a circle, alternating arithmetic (+, −) and category-example prompts, for N loops. Tracks per-step timing + correctness.

## Quadrant layout (clockwise from top-left)
1. **TL** — `+N` (add to running total)
2. **TR** — Category A (give example, e.g. "Colors")
3. **BR** — `−N` (subtract from running total)
4. **BL** — Category B (give example, e.g. "Animals")

Loop = TL → TR → BR → BL → TL … Starting number shown outside TL (e.g. `5`).

## Tech stack
- **Vanilla + Vite + React + TypeScript** (single-page, no backend needed).
- **Canvas or SVG** for circle + quadrant rendering (SVG simpler, scales cleanly).
- **Chart.js** or **Recharts** for end-of-session step-time graph.
- **Tailwind** for layout/controls.
- State: React `useReducer` for exercise FSM.

## Core modules
| File | Purpose |
|------|---------|
| `src/types.ts` | `Step`, `Quadrant`, `SessionConfig`, `StepRecord`, `SessionResult` |
| `src/generator.ts` | Random number + category generation per difficulty |
| `src/categories.ts` | Category lists tiered by difficulty (easy → obscure) |
| `src/fsm.ts` | Reducer: idle → running → paused → complete; advance on submit |
| `src/components/Circle.tsx` | SVG circle, 4 quadrants, active-quadrant highlight, arrows |
| `src/components/AnswerInput.tsx` | Single input bound to current step; Enter = submit |
| `src/components/ControlPanel.tsx` | Loops count, difficulty slider, scale slider (50–100%), start/stop |
| `src/components/Results.tsx` | Correctness table + timing graph + averages |
| `src/hooks/useTimer.ts` | Per-step + total timestamps |
| `src/App.tsx` | Compose |

## Step generation
- Addition quadrant: random int in `[1, 9 + difficulty*3]`
- Subtraction quadrant: random int in `[1, currentTotal]` (prevent negative) or allow negative at high difficulty
- Categories: two distinct per session, from difficulty-tier pools
- Starting number: random `[1, 20]`

## Difficulty tiers (slider 1–5)
1. Single-digit math, common categories (Colors, Animals, Fruits)
2. Low-teen math, broader (Sports, Countries)
3. Two-digit, specific (European capitals, Jazz musicians)
4. Larger + multi-op variants, obscure (Phyla, Cognitive biases)
5. Max range + niche (Mineralogy, Philosophers)

Category pools stored in `categories.ts` as `{tier: string[][]}`. Each category entry has optional validator (regex list of accepted examples) OR free-text captured for manual review.

## Timing
- `stepStart[i]` stamped on quadrant activation
- `stepEnd[i]` stamped on submit
- Total = last end − first start
- Aggregates:
  - avg per step
  - avg per operation type (`+`, category-A, `−`, category-B)
  - per-loop duration

## Answer evaluation
- Arithmetic: exact integer compare against computed expected.
- Category: check answer (lowercased, trimmed) against category's accepted-list. If no list, mark "unverified" (user reviews).

## Scaling
- Circle wrapper: `transform: scale(var(--scale))`, slider writes CSS var in `[0.5, 1]`.
- Default full-screen: circle diameter = `min(100vw, 100vh) * 0.9`.

## Session flow
1. User sets loops (default 8), difficulty, scale → Start.
2. Generator produces sequence: `4 * loops` steps, shared running total.
3. Circle highlights active quadrant (pulse/ring). Input focused.
4. User types answer, Enter → record, advance, highlight next quadrant. Arrow animation between quadrants.
5. After final step → Results screen.

## Results screen
- Per-step table: quadrant, prompt, user answer, expected, correct?, elapsed ms.
- Line chart of step times (x=step index, y=ms), color-coded by operation type.
- Summary card: total time, avg step, avg by op-type, correctness %.
- Export JSON button.

## Milestones
1. **M1** — Scaffold Vite+React+TS+Tailwind; render static SVG circle with 4 quadrants + starting number.
2. **M2** — Generator + FSM; run through a session headless with console output.
3. **M3** — Wire UI: input, active-quadrant highlight, advance on submit.
4. **M4** — Timing capture + Results screen (table only).
5. **M5** — Chart + averages + export.
6. **M6** — Difficulty slider + scale slider + polish (arrows, animation).
7. **M7** — Category validator lists for easy/medium tiers.

## Decisions
- **Validation**: curated lists tiers 1–3 (generate large pools per category), manual review tiers 4–5.
- **Audio cue**: yes, on quadrant advance (soft tone, toggleable).
- **Session history**: yes, persist to localStorage; Results screen shows past sessions.
