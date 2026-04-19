import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { SessionResult } from "../types";

interface Props {
  result: SessionResult;
  history: SessionResult[];
  onRestart: () => void;
}

function fmt(ms: number) {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function Results({ result, history, onRestart }: Props) {
  const records = result.records;
  const total = result.totalMs;
  const avgStep = total / records.length;
  const byOp: Record<string, number[]> = { add: [], sub: [], catA: [], catB: [] };
  records.forEach((r) => byOp[r.step.op].push(r.elapsedMs));
  const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

  const verified = records.filter((r) => r.correct !== null);
  const correctCount = verified.filter((r) => r.correct).length;
  const accuracy = verified.length ? (correctCount / verified.length) * 100 : 0;

  const chartData = records.map((r, i) => ({ idx: i + 1, ms: Math.round(r.elapsedMs), op: r.step.op }));

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `coc-session-${result.id}.json`;
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

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Stat label="Total" value={fmt(total)} />
        <Stat label="Avg / step" value={fmt(avgStep)} />
        <Stat label="Accuracy" value={`${accuracy.toFixed(0)}% (${correctCount}/${verified.length})`} />
        <Stat label="Loops" value={String(result.config.loops)} />
        <Stat label="Difficulty" value={String(result.config.difficulty)} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Avg +" value={fmt(avg(byOp.add))} />
        <Stat label={`Avg ${result.config.categoryA}`} value={fmt(avg(byOp.catA))} />
        <Stat label="Avg −" value={fmt(avg(byOp.sub))} />
        <Stat label={`Avg ${result.config.categoryB}`} value={fmt(avg(byOp.catB))} />
      </div>

      <div className="bg-white rounded-lg border p-4">
        <h2 className="font-medium mb-2">Step times</h2>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="idx" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="ms" stroke="#3b82f6" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <h2 className="font-medium p-4 border-b">Step-by-step</h2>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Loop</th>
              <th className="p-2">Quad</th>
              <th className="p-2">Prompt</th>
              <th className="p-2">Answer</th>
              <th className="p-2">Expected</th>
              <th className="p-2">Correct</th>
              <th className="p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.step.index} className="border-t">
                <td className="p-2">{r.step.index + 1}</td>
                <td className="p-2">{r.step.loop + 1}</td>
                <td className="p-2">{r.step.quadrant}</td>
                <td className="p-2">{r.step.prompt}</td>
                <td className="p-2">{r.answer}</td>
                <td className="p-2">{r.step.expected ?? "—"}</td>
                <td className="p-2">
                  {r.correct === null ? "?" : r.correct ? "✓" : "✗"}
                </td>
                <td className="p-2">{fmt(r.elapsedMs)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {history.length > 1 && (
        <div className="bg-white rounded-lg border p-4">
          <h2 className="font-medium mb-2">History</h2>
          <ul className="text-sm space-y-1">
            {history.slice(0, 10).map((h) => (
              <li key={h.id} className="flex gap-4">
                <span className="text-gray-500">{new Date(h.createdAt).toLocaleString()}</span>
                <span>L{h.config.loops}</span>
                <span>D{h.config.difficulty}</span>
                <span>{fmt(h.totalMs)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
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
