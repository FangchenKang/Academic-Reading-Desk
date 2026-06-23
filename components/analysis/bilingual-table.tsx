"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AnalysisResult, ReadingMode } from "@/types/analysis";

export function BilingualTable({
  items,
  mode,
  onCopied
}: {
  items: AnalysisResult["bilingual"];
  mode: ReadingMode;
  onCopied: (message: string) => void;
}) {
  const copyText = items.map((item) => formatBilingualItem(item, mode)).join("\n\n");

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-950">一、双语精读</h3>
          <p className="mt-1 text-xs text-slate-500">
            逐句拆解英文原文，先读懂文本再积累术语
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={async () => {
            await navigator.clipboard.writeText(copyText);
            onCopied("双语精读全文已复制");
          }}
        >
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          复制全文
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-500">
          暂无逐句解析，请点击解析文本生成。
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <article
              key={`${item.en}-${index}`}
              className="group relative flex w-full gap-3 rounded-lg border border-slate-100 bg-slate-50/80 p-3 transition-colors hover:border-teal-100 hover:bg-white"
            >
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-600 text-[11px] font-bold text-white">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0 flex-1 pr-9">
                {mode !== "chinese" ? (
                  <p
                    className={cn(
                      "whitespace-pre-wrap break-words text-[15px] leading-7 text-slate-900",
                      mode === "english" && "text-slate-950"
                    )}
                  >
                    {item.en}
                  </p>
                ) : null}

                {mode === "bilingual" ? (
                  <p className="mt-3 whitespace-pre-wrap break-words border-t border-slate-100 pt-3 text-sm leading-7 text-slate-600">
                    {item.zh}
                  </p>
                ) : null}

                {mode === "chinese" ? (
                  <p className="whitespace-pre-wrap break-words text-sm font-medium leading-7 text-teal-800">
                    {item.zh}
                  </p>
                ) : null}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-7 w-7 text-slate-400 opacity-80 hover:text-teal-700 group-hover:opacity-100"
                title="复制当前句"
                aria-label={`复制第 ${index + 1} 句`}
                onClick={async () => {
                  await navigator.clipboard.writeText(formatBilingualItem(item, mode));
                  onCopied("单句已复制");
                }}
              >
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function formatBilingualItem(
  item: AnalysisResult["bilingual"][number],
  mode: ReadingMode
) {
  if (mode === "english") return item.en;
  if (mode === "chinese") return item.zh;
  return `${item.en}\n${item.zh}`;
}
