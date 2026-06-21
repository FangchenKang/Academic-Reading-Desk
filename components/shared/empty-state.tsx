import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  className
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center",
        className
      )}
    >
      <div className="mb-3 rounded-lg bg-white p-3 text-slate-500 shadow-sm">
        <FileText className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      {description ? (
        <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
          {description}
        </p>
      ) : null}
    </div>
  );
}
