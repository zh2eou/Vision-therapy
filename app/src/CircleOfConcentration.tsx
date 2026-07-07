import { useEffect, useReducer, useState } from "react";
import { Circle } from "./components/Circle";
import { AnswerInput } from "./components/AnswerInput";
import { ControlPanel } from "./components/ControlPanel";
import { Results } from "./components/Results";
import { reducer, initialState } from "./fsm";
import { generateSession } from "./generator";
import type { SessionConfig } from "./types";
import { loadHistory, saveSession } from "./storage";
import { playBeep } from "./audio";

export default function CircleOfConcentration() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loops, setLoops] = useState(8);
  const [difficulty, setDifficulty] = useState(2);
  const [scale, setScale] = useState(1);
  const [audio, setAudio] = useState(true);
  const [staticNumbers, setStaticNumbers] = useState(false);
  const [history, setHistory] = useState(loadHistory());

  useEffect(() => {
    if (state.phase === "complete" && state.lastResult) {
      saveSession(state.lastResult);
      setHistory(loadHistory());
    }
  }, [state.phase, state.lastResult]);

  useEffect(() => {
    if (state.phase === "running") playBeep(audio);
  }, [state.currentIndex, state.phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = () => {
    const { steps, config } = generateSession(loops, difficulty, staticNumbers);
    const fullConfig: SessionConfig = {
      loops,
      difficulty,
      scale,
      audio,
      staticNumbers,
      startNumber: config.startNumber,
      categoryA: config.categoryA,
      categoryB: config.categoryB,
    };
    dispatch({ type: "start", config: fullConfig, catDefs: config.catDefs, steps });
  };

  const stop = () => dispatch({ type: "reset" });

  if (state.phase === "complete" && state.lastResult) {
    return (
      <Results
        result={state.lastResult}
        history={history}
        onRestart={() => dispatch({ type: "reset" })}
      />
    );
  }

  const currentStep = state.phase === "running" ? state.steps[state.currentIndex] : null;

  return (
    <div className="flex flex-col h-full">
      <ControlPanel
        loops={loops}
        difficulty={difficulty}
        scale={scale}
        audio={audio}
        staticNumbers={staticNumbers}
        running={state.phase === "running"}
        onChange={(p) => {
          if (p.loops !== undefined) setLoops(p.loops);
          if (p.difficulty !== undefined) setDifficulty(p.difficulty);
          if (p.scale !== undefined) setScale(p.scale);
          if (p.audio !== undefined) setAudio(p.audio);
          if (p.staticNumbers !== undefined) setStaticNumbers(p.staticNumbers);
        }}
        onStart={start}
        onStop={stop}
      />

      <div className="flex-1 flex flex-col items-center justify-center gap-6 overflow-hidden">
        {state.phase === "idle" && (
          <div className="text-center text-gray-600 max-w-md">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Circle of Concentration</h1>
            <p>Set difficulty and loops, then press <b>Start</b>. Eyes move clockwise; answer each quadrant aloud and type it in.</p>
          </div>
        )}

        {state.phase === "running" && currentStep && state.config && (
          <>
            <div className="flex-1 w-full flex items-center justify-center min-h-0">
              <Circle
                step={currentStep}
                startNumber={state.config.startNumber}
                categoryA={state.config.categoryA}
                categoryB={state.config.categoryB}
                scale={scale}
              />
            </div>
            <div className="w-full flex flex-col items-center gap-2 pb-6">
              <div className="text-sm text-gray-500">
                Step {state.currentIndex + 1} / {state.steps.length} · Loop{" "}
                {currentStep.loop + 1} / {state.config.loops}
              </div>
              <AnswerInput
                step={currentStep}
                onSubmit={(answer) => dispatch({ type: "submit", answer })}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
