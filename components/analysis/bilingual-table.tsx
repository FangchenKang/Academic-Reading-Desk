"use client";

import { CopyButton } from "@/components/shared/copy-button";
import { cn } from "@/lib/utils";
import type { AnalysisResult, ReadingMode } from "@/types/analysis";

export function BilingualTable({
  items,
  mode,
  onCopied
}: {
  items: AnalysisResult["bilingual"];
  mode: ReadingMode;
  onCopied: () => void;
}) {
  const copyText = items.map((item) => `${item.en}\n${item.zh}`).join("\n\n");
  const englishOnly = mode === "english";

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-950">三、双语对照</h3>
          <p className="mt-1 text-xs text-slate-500">
            {englishOnly ? "当前仅显示英文原句" : "英文原句与中文翻译并列阅读"}
          </p>
        </div>
        <CopyButton text={copyText} label="复制全部" onCopied={onCopied} />
      </div>

      <div
        className={cn(
          "overflow-hidden rounded-lg border border-slate-200",
          englishOnly ? "grid grid-cols-1" : "grid grid-cols-2"
        )}
      >
        <div className="bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
          英文原句
        </div>
        {!englishOnly ? (
          <div className="border-l border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
            中文翻译
          </div>
        ) : null}

        {items.map((item, index) => (
          <div key={item.en} className="contents">
            <div
              className={cn(
                "border-t border-slate-200 px-3 py-3 text-sm leading-6",
                mode === "chinese" ? "text-slate-500" : "text-slate-800",
                index % 2 === 1 && "bg-slate-50/50"
              )}
            >
              {item.en}
            </div>
            {!englishOnly ? (
              <div
                className={cn(
                  "border-l border-t border-slate-200 px-3 py-3 text-sm leading-6",
                  mode === "chinese"
                    ? "font-medium text-teal-800"
                    : "text-slate-700",
                  index % 2 === 1 && "bg-slate-50/50"
                )}
              >
                {item.zh}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
