interface Props {
  loops: number;
  difficulty: number;
  scale: number;
  audio: boolean;
  staticNumbers: boolean;
  running: boolean;
  onChange: (p: { loops?: number; difficulty?: number; scale?: number; audio?: boolean; staticNumbers?: boolean }) => void;
  onStart: () => void;
  onStop: () => void;
}

export function ControlPanel({
  loops,
  difficulty,
  scale,
  audio,
  staticNumbers,
  running,
  onChange,
  onStart,
  onStop,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-4 px-4 py-3 bg-white border-b border-gray-200">
      <label className="flex items-center gap-2 text-sm">
        Loops
        <input
          type="number"
          min={1}
          max={30}
          value={loops}
          onChange={(e) => onChange({ loops: Number(e.target.value) })}
          disabled={running}
          className="w-16 px-2 py-1 border rounded"
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        Difficulty {difficulty}
        <input
          type="range"
          min={1}
          max={5}
          value={difficulty}
          onChange={(e) => onChange({ difficulty: Number(e.target.value) })}
          disabled={running}
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        Scale {Math.round(scale * 100)}%
        <input
          type="range"
          min={50}
          max={100}
          value={Math.round(scale * 100)}
          onChange={(e) => onChange({ scale: Number(e.target.value) / 100 })}
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={audio}
          onChange={(e) => onChange({ audio: e.target.checked })}
        />
        Audio cue
      </label>

      <label className="flex items-center gap-2 text-sm" title="Same +N/-N every loop (vs. new random each loop)">
        <input
          type="checkbox"
          checked={staticNumbers}
          onChange={(e) => onChange({ staticNumbers: e.target.checked })}
          disabled={running}
        />
        Static numbers
      </label>

      {running ? (
        <button onClick={onStop} className="ml-auto px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Stop
        </button>
      ) : (
        <button
          onClick={onStart}
          className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
        >
          Start
        </button>
      )}
    </div>
  );
}
