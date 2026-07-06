import { useState } from "react";
import CircleOfConcentration from "./CircleOfConcentration";
import AnaglyphTool from "./anaglyph/AnaglyphTool";

type Tool = "home" | "coc" | "anaglyph";

const TOOLS: { id: Tool; title: string; blurb: string }[] = [
  {
    id: "coc",
    title: "Circle of Concentration",
    blurb:
      "Track clockwise across four quadrants, alternating arithmetic and category prompts. Builds saccadic control and divided attention.",
  },
  {
    id: "anaglyph",
    title: "Anaglyph Depth",
    blurb:
      "Red/green glasses exercise. Numbers float at different depths in each cardinal direction; pick the strongest. Adaptive difficulty with convergence & divergence.",
  },
];

export default function App() {
  const [tool, setTool] = useState<Tool>("home");

  if (tool === "home") {
    return (
      <div className="min-h-full p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-1">Vision Therapy</h1>
        <p className="text-gray-600 mb-8">Choose an exercise.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className="text-left bg-white rounded-xl border p-6 hover:border-blue-500 hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{t.title}</h2>
              <p className="text-sm text-gray-600">{t.blurb}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-2 bg-gray-900 text-white">
        <button
          onClick={() => setTool("home")}
          className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm"
        >
          ← Home
        </button>
        <span className="font-medium">
          {TOOLS.find((t) => t.id === tool)?.title}
        </span>
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        {tool === "coc" && <CircleOfConcentration />}
        {tool === "anaglyph" && <AnaglyphTool />}
      </div>
    </div>
  );
}
