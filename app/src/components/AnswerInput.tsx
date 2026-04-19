import { useEffect, useRef, useState } from "react";
import type { Step } from "../types";

interface Props {
  step: Step;
  onSubmit: (answer: string) => void;
}

export function AnswerInput({ step, onSubmit }: Props) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue("");
    ref.current?.focus();
  }, [step.index]);

  const placeholder =
    step.op === "add" || step.op === "sub" ? "sum / difference" : `example of ${step.category}`;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!value.trim()) return;
        onSubmit(value);
      }}
      className="flex gap-2 w-full max-w-md"
    >
      <input
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        autoComplete="off"
        inputMode={step.op === "add" || step.op === "sub" ? "numeric" : "text"}
      />
      <button
        type="submit"
        className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
      >
        Enter
      </button>
    </form>
  );
}
