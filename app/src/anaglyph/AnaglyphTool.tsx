import { useEffect, useRef, useState } from "react";
import type { Direction, AnaglyphConfig, RoundRecord, RoundSpec, Mode, Outcome, AnaglyphResult } from "./types";
import { makeRound, nextLevel, MIN_LEVEL, MAX_LEVEL } from "./generator";
import { AnaglyphBoard, type Feedback } from "./AnaglyphBoard";
import { AnaglyphResults } from "./AnaglyphResults";
import { saveAnaglyphSession } from "./storage";
import { playBeep } from "../audio";

type Phase = "idle" | "playing" | "complete";

const FEEDBACK_MS = 850;
const KEY_TO_DIR: Record<string, Direction> = {
  ArrowUp: "N",
  ArrowRight: "E",
  ArrowDown: "S",
  ArrowLeft: "W",
};

export default function AnaglyphTool() {
  // Config (idle screen)
  const [mode, setMode] = useState<Mode>("converge");
  const [timeoutSec, setTimeoutSec] = useState(10);
  const [rounds, setRounds] = useState(20);
  const [startLevel, setStartLevel] = useState(3);
  const [audio, setAudio] = useState(true);

  // Session state
  const [phase, setPhase] = useState<Phase>("idle");
  const [config, setConfig] = useState<AnaglyphConfig | null>(null);
  const [level, setLevel] = useState(startLevel);
  const [roundIndex, setRoundIndex] = useState(0);
  const [round, setRound] = useState<RoundSpec | null>(null);
  const [records, setRecords] = useState<RoundRecord[]>([]);
  const [remainingMs, setRemainingMs] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [result, setResult] = useState<AnaglyphResult | null>(null);

  const roundStartRef = useRef(0);
  const sessionStartRef = useRef(0);
  const resolveRef = useRef<(dir: Direction | null) => void>(() => {});

  const start = () => {
    const cfg: AnaglyphConfig = {
      mode,
      timeoutSec: Math.max(2, timeoutSec),
      rounds: Math.max(1, rounds),
      startLevel: Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, startLevel)),
      audio,
    };
    setConfig(cfg);
    setLevel(cfg.startLevel);
    setRoundIndex(0);
    setRecords([]);
    setFeedback(null);
    setResult(null);
    setRemainingMs(cfg.timeoutSec * 1000);
    setRound(makeRound(0, cfg.startLevel, cfg.mode));
    sessionStartRef.current = performance.now();
    setPhase("playing");
    playBeep(cfg.audio);
  };

  const stop = () => {
    if (records.length > 0 && config) {
      finish(records, config);
    } else {
      setPhase("idle");
      setRound(null);
    }
  };

  const finish = (recs: RoundRecord[], cfg: AnaglyphConfig) => {
    const res: AnaglyphResult = {
      id: String(Date.now()),
      createdAt: Date.now(),
      config: cfg,
      records: recs,
      totalMs: performance.now() - sessionStartRef.current,
    };
    saveAnaglyphSession(res);
    setResult(res);
    setPhase("complete");
    setRound(null);
  };

  // Resolve the current round from a selection (or null on timeout).
  const resolve = (selected: Direction | null) => {
    if (phase !== "playing" || feedback || !round || !config) return;
    const now = performance.now();
    const outcome: Outcome =
      selected === null ? "timeout" : selected === round.targetDirection ? "correct" : "incorrect";
    const levelAfter = nextLevel(level, outcome);
    const record: RoundRecord = {
      index: round.index,
      level: round.level,
      mode: round.mode,
      targetDirection: round.targetDirection,
      selected,
      outcome,
      elapsedMs: now - roundStartRef.current,
      levelAfter,
    };
    setRecords((prev) => [...prev, record]);
    setFeedback({ selected, correct: outcome === "correct", targetDirection: round.targetDirection });
    playBeep(config.audio, outcome === "correct" ? 880 : 300, 140);
  };

  // Keep the latest resolver available to async timers / key handlers.
  useEffect(() => {
    resolveRef.current = resolve;
  });

  // Countdown timer for the active round (paused while feedback is shown).
  useEffect(() => {
    if (phase !== "playing" || feedback || !config) return;
    const startTs = performance.now();
    roundStartRef.current = startTs;
    const deadline = startTs + config.timeoutSec * 1000;
    let raf = 0;
    const tick = () => {
      const rem = Math.max(0, deadline - performance.now());
      setRemainingMs(rem);
      if (rem <= 0) {
        resolveRef.current(null);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, roundIndex, feedback, config]);

  // Advance to the next round (or finish) after the feedback flash.
  useEffect(() => {
    if (phase !== "playing" || !feedback || !config) return;
    const id = setTimeout(() => {
      const nextIndex = roundIndex + 1;
      const newLevel = records.length ? records[records.length - 1].levelAfter : level;
      if (nextIndex >= config.rounds) {
        finish(records, config);
        return;
      }
      setLevel(newLevel);
      setRoundIndex(nextIndex);
      setRound(makeRound(nextIndex, newLevel, config.mode));
      setRemainingMs(config.timeoutSec * 1000);
      setFeedback(null);
      playBeep(config.audio);
    }, FEEDBACK_MS);
    return () => clearTimeout(id);
  }, [feedback, phase, config, roundIndex, records, level]);

  // Keyboard selection via arrow keys.
  useEffect(() => {
    if (phase !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      const dir = KEY_TO_DIR[e.key];
      if (dir) {
        e.preventDefault();
        resolveRef.current(dir);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  if (phase === "complete" && result) {
    return <AnaglyphResults result={result} onRestart={() => setPhase("idle")} />;
  }

  if (phase === "idle") {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Anaglyph Depth</h1>
          <p className="text-gray-600">
            Put on your <b className="text-red-600">red</b>/<b className="text-green-600">green</b>{" "}
            glasses (red lens over the left eye). Four numbers appear at north, east, south and
            west, each floating at a different depth. Pick the one with the strongest depth &mdash;
            get it right and the next set gets harder; miss it or time out and it eases off.
          </p>
        </div>

        <div className="bg-white rounded-lg border p-4 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-gray-600">Mode</span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
              className="px-3 py-2 border rounded"
            >
              <option value="converge">Convergence (pops out)</option>
              <option value="diverge">Divergence (sinks back)</option>
              <option value="alternate">Alternate</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-gray-600">Timeout (seconds)</span>
            <input
              type="number"
              min={2}
              max={60}
              value={timeoutSec}
              onChange={(e) => setTimeoutSec(Number(e.target.value))}
              className="px-3 py-2 border rounded"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-gray-600">Rounds</span>
            <input
              type="number"
              min={1}
              max={100}
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="px-3 py-2 border rounded"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-gray-600">Start level (1&ndash;{MAX_LEVEL})</span>
            <input
              type="number"
              min={MIN_LEVEL}
              max={MAX_LEVEL}
              value={startLevel}
              onChange={(e) => setStartLevel(Number(e.target.value))}
              className="px-3 py-2 border rounded"
            />
          </label>

          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" checked={audio} onChange={(e) => setAudio(e.target.checked)} />
            Audio cue
          </label>
        </div>

        <button
          onClick={start}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Start
        </button>
      </div>
    );
  }

  // phase === "playing"
  const instruction =
    round?.mode === "converge"
      ? "Select the number that pops OUT the most (closest to you)."
      : "Select the number that sinks BACK the most (farthest away).";
  const remainingPct = config ? (remainingMs / (config.timeoutSec * 1000)) * 100 : 0;
  const remainingSec = (remainingMs / 1000).toFixed(1);

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 flex flex-wrap items-center gap-4 px-4 py-3 bg-white border-b border-gray-200 text-sm">
        <span className="font-medium">
          Round {roundIndex + 1} / {config?.rounds}
        </span>
        <span className="text-gray-500">
          Level {level} / {MAX_LEVEL}
        </span>
        <span className="px-2 py-0.5 rounded bg-gray-100 capitalize">{round?.mode}</span>
        <span className="text-gray-500 tabular-nums">{remainingSec}s</span>
        <button onClick={stop} className="ml-auto px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Stop
        </button>
      </div>

      <div className="shrink-0 h-1.5 bg-gray-200">
        <div
          className="h-full bg-blue-500 transition-[width] duration-75"
          style={{ width: `${remainingPct}%` }}
        />
      </div>

      <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-5 overflow-hidden p-4">
        <p className="text-gray-600 text-center">{instruction}</p>
        {round && (
          <AnaglyphBoard
            round={round}
            disabled={!!feedback}
            feedback={feedback}
            onSelect={(dir) => resolveRef.current(dir)}
          />
        )}
        <p className="text-xs text-gray-400">Click a number, or use the arrow keys.</p>
      </div>
    </div>
  );
}
