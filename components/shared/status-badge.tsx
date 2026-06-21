import { CheckCircle2, CircleAlert, Clock3, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SaveStatus } from "@/types/analysis";

export function StatusBadge({
  status,
  className
}: {
  status: SaveStatus;
  className?: string;
}) {
  const config = {
    idle: {
      icon: Clock3,
      text: "等待编辑",
      className: "text-slate-500"
    },
    saving: {
      icon: Loader2,
      text: "正在保存……",
      className: "text-blue-600"
    },
    saved: {
      icon: CheckCircle2,
      text: "自动保存成功",
      className: "text-emerald-600"
    },
    error: {
      icon: CircleAlert,
      text: "保存失败",
      className: "text-red-600"
    }
  }[status];

  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      <Icon
        className={cn("h-4 w-4", status === "saving" && "animate-spin")}
        aria-hidden="true"
      />
      {config.text}
    </span>
  );
}
