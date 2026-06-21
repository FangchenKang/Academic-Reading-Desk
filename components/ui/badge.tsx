import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
  tone = "blue"
}: {
  className?: string;
  children: React.ReactNode;
  tone?: "blue" | "green" | "violet" | "slate" | "amber" | "teal";
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    violet: "bg-violet-50 text-violet-700 ring-violet-100",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    teal: "bg-teal-50 text-teal-700 ring-teal-100"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
