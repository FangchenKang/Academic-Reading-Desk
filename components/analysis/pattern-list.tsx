"use client";

import { Layers3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AnalysisResult, ReadingMode } from "@/types/analysis";

export function PatternList({
  patterns,
  mode
}: {
  patterns: AnalysisResult["patterns"];
  mode: ReadingMode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-950">三、重点句式</h3>
          <p className="mt-1 text-xs text-slate-500">
            识别可迁移到论文写作中的功能句
          </p>
        </div>
        <Button type="button" variant="outline" size="sm">
          <Layers3 className="h-3.5 w-3.5" aria-hidden="true" />
          更多句式
        </Button>
      </div>

      {patterns.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-500">
          模型没有返回重点句式。可以重新解析，或检查模型是否按 JSON 字段返回
          patterns。
        </div>
      ) : (
        <div className="space-y-3">
          {patterns.map((item, index) => (
            <div
              key={item.type || index}
              className="grid grid-cols-[34px_1fr] gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                {index + 1}
              </span>
              <div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">{item.type}</p>
                  {item.reusableTemplate ? (
                    <span className="text-xs text-blue-600">可复用模板</span>
                  ) : null}
                </div>
                {mode !== "english" ? (
                  <p
                    className={cn(
                      "mt-1 text-sm leading-6",
                      mode === "chinese" ? "text-slate-800" : "text-slate-600"
                    )}
                  >
                    {item.description}
                  </p>
                ) : null}
                <p
                  className={cn(
                    "mt-2 rounded-lg bg-white px-3 py-2 text-sm leading-6",
                    mode === "chinese" ? "text-slate-500" : "text-slate-800"
                  )}
                >
                  {item.example}
                </p>
                {mode !== "chinese" && item.reusableTemplate ? (
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Template: {item.reusableTemplate}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
