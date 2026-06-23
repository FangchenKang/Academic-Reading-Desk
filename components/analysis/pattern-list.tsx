"use client";

import { useMemo, useState } from "react";
import { Layers3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/types/analysis";

type Pattern = AnalysisResult["patterns"][number];

export function PatternList({
  patterns
}: {
  patterns: AnalysisResult["patterns"];
}) {
  const patternIds = useMemo(() => patterns.map(getPatternId), [patterns]);
  const [expandedPatternIds, setExpandedPatternIds] = useState<Set<string>>(
    new Set()
  );
  const allExpanded =
    patternIds.length > 0 && expandedPatternIds.size === patternIds.length;

  function togglePattern(id: string) {
    setExpandedPatternIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function setAllPatterns(expanded: boolean) {
    setExpandedPatternIds(expanded ? new Set(patternIds) : new Set());
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-950">四、重点句式</h3>
          <p className="mt-1 text-xs text-slate-500">
            识别可迁移到论文写作中的功能句
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setAllPatterns(!allExpanded)}
        >
          <Layers3 className="h-3.5 w-3.5" aria-hidden="true" />
          {allExpanded ? "收起模板" : "展开模板"}
        </Button>
      </div>

      {patterns.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-500">
          模型没有返回重点句式。可以重新解析，或检查模型是否按 JSON 字段返回
          patterns。
        </div>
      ) : (
        <div className="space-y-3">
          {patterns.map((item, index) => {
            const id = getPatternId(item, index);
            const expanded = expandedPatternIds.has(id);

            return (
              <button
                key={id}
                type="button"
                onClick={() => togglePattern(id)}
                className="grid w-full grid-cols-[34px_1fr] gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 text-left transition-colors hover:border-teal-100 hover:bg-white"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {item.type}
                    </p>
                    {item.reusableTemplate ? (
                      <span className="text-xs text-blue-600">
                        {expanded ? "隐藏模板" : "查看模板"}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                  <p className="mt-2 rounded-lg bg-white px-3 py-2 text-sm leading-6 text-slate-800">
                    {item.example}
                  </p>
                  {expanded && item.reusableTemplate ? (
                    <p className="mt-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs leading-5 text-slate-600">
                      Template: {item.reusableTemplate}
                    </p>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

function getPatternId(item: Pattern, index: number) {
  return `${index}-${item.type || item.example}`;
}
