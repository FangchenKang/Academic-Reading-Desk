"use client";

import type { ReadingMode } from "@/types/analysis";
import { cn } from "@/lib/utils";

const modes: { value: ReadingMode; label: string }[] = [
  { value: "english", label: "英文模式" },
  { value: "bilingual", label: "双语模式" },
  { value: "chinese", label: "中文模式" }
];

export function ModeToggle({
  value,
  onChange
}: {
  value: ReadingMode;
  onChange: (value: ReadingMode) => void;
}) {
  return (
    <div className="grid grid-cols-3 rounded-lg border border-slate-200 bg-slate-50 p-1">
      {modes.map((mode) => (
        <button
          key={mode.value}
          type="button"
          className={cn(
            "rounded-md px-3 py-2 text-xs font-semibold transition-colors",
            value === mode.value
              ? "bg-white text-blue-700 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          )}
          onClick={() => onChange(mode.value)}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
