import { CheckCircle2, CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toast({
  message,
  tone = "success"
}: {
  message: string | null;
  tone?: "success" | "error";
}) {
  if (!message) return null;
  const Icon = tone === "success" ? CheckCircle2 : CircleAlert;

  return (
    <div
      className={cn(
        "fixed right-6 top-6 z-50 flex items-center gap-2 rounded-lg border bg-white px-4 py-3 text-sm shadow-soft",
        tone === "success"
          ? "border-emerald-100 text-emerald-700"
          : "border-red-100 text-red-700"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {message}
    </div>
  );
}
