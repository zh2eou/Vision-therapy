import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { AnaglyphResult } from "./types";
import { MAX_LEVEL } from "./generator";

interface Props {
  result: AnaglyphResult;
  onRestart: () => void;
}

function fmt(ms: number) {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

const OUTCOME_LABEL: Record<string, string> = {
  correct: "✓",
  incorrect: "✗",
  timeout: "⏱",
};

export function AnaglyphResults({ result, onRestart }: Props) {
  const records = result.records;
  const correct = records.filter((r) => r.outcome === "correct").length;
  const timeouts = records.filter((r) => r.outcome === "timeout").length;
  const accuracy = records.length ? (correct / records.length) * 100 : 0;
  const avgMs = records.length
    ? records.reduce((a, r) => a + r.elapsedMs, 0) / records.length
    : 0;
  const peakLevel = records.reduce((m, r) => Math.max(m, r.level), 0);
  const finalLevel = records.length ? records[records.length - 1].levelAfter : 0;

  const chartData = records.map((r) => ({ round: r.index + 1, level: r.level }));

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `anaglyph-session-${result.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Session complete</h1>
        <div className="flex gap-2">
          <button onClick={exportJson} className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Export JSON
          </button>
          <button onClick={onRestart} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            New session
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Stat label="Rounds" value={String(records.length)} />
        <Stat label="Accuracy" value={`${accuracy.toFixed(0)}% (${correct}/${records.length})`} />
        <Stat label="Timeouts" value={String(timeouts)} />
        <Stat label="Avg time" value={fmt(avgMs)} />
        <Stat label="Peak level" value={`${peakLevel} / ${MAX_LEVEL}`} />
        <Stat label="Final level" value={`${finalLevel} / ${MAX_LEVEL}`} />
      </div>

      <div className="bg-white rounded-lg border p-4">
        <h2 className="font-medium mb-2">Difficulty over time</h2>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="round" />
              <YAxis domain={[0, MAX_LEVEL]} allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="level" stroke="#3b82f6" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <h2 className="font-medium p-4 border-b">Round-by-round</h2>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Mode</th>
              <th className="p-2">Level</th>
              <th className="p-2">Target</th>
              <th className="p-2">Selected</th>
              <th className="p-2">Result</th>
              <th className="p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.index} className="border-t">
                <td className="p-2">{r.index + 1}</td>
                <td className="p-2">{r.mode}</td>
                <td className="p-2">{r.level}</td>
                <td className="p-2">{r.targetDirection}</td>
                <td className="p-2">{r.selected ?? "—"}</td>
                <td className="p-2">{OUTCOME_LABEL[r.outcome]}</td>
                <td className="p-2">{fmt(r.elapsedMs)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-lg border p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
