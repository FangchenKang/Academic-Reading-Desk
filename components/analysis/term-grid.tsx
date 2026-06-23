"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/shared/copy-button";
import { cn } from "@/lib/utils";
import type { AnalysisResult } from "@/types/analysis";

type Term = AnalysisResult["terms"][number];

export function TermGrid({
  terms,
  onCopied
}: {
  terms: Term[];
  onCopied: () => void;
}) {
  const termIds = useMemo(() => terms.map(getTermId), [terms]);
  const [expandedTermIds, setExpandedTermIds] = useState<Set<string>>(new Set());
  const allExpanded = termIds.length > 0 && expandedTermIds.size === termIds.length;
  const copyText = terms
    .map((item) => `${item.term} - ${item.translation}\n${item.explanation ?? ""}`)
    .join("\n\n");

  function toggleTerm(id: string) {
    setExpandedTermIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function setAllTerms(expanded: boolean) {
    setExpandedTermIds(expanded ? new Set(termIds) : new Set());
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-950">二、核心术语</h3>
          <p className="mt-1 text-xs text-slate-500">
            从论文语境中提取具有概念意义的学科核心术语
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setAllTerms(!allExpanded)}
          >
            {allExpanded ? "全部收起" : "全部展开"}
          </Button>
          <CopyButton text={copyText} label="复制术语" onCopied={onCopied} />
          <Button type="button" variant="outline" size="sm" asChild>
            <Link href="/terms">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              词库
            </Link>
          </Button>
        </div>
      </div>

      {terms.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-500">
          模型没有返回核心术语。可以换一段更完整的英文论文文本，或重新解析一次。
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {terms.map((item, index) => {
            const id = getTermId(item, index);
            const expanded = expandedTermIds.has(id);

            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleTerm(id)}
                className={cn(
                  "rounded-lg border p-3 text-left transition-all",
                  expanded
                    ? "border-blue-200 bg-blue-50"
                    : "border-slate-200 bg-slate-50 hover:border-teal-200 hover:bg-teal-50/60"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-slate-950">
                      {item.term}
                    </p>
                    <p className="mt-1 text-sm font-medium text-teal-700">
                      {item.translation || "暂无释义"}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200">
                    {expanded ? "收起" : "展开"}
                  </span>
                </div>

                {expanded ? (
                  <div className="mt-3 rounded-lg border border-blue-100 bg-white/70 p-3">
                    {item.explanation ? (
                      <p className="text-sm leading-6 text-slate-700">
                        {item.explanation}
                      </p>
                    ) : null}
                    {item.example ? (
                      <p className="mt-2 border-l-2 border-blue-200 pl-3 text-xs leading-5 text-slate-500">
                        {item.example}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

function getTermId(item: Term, index: number) {
  return `${index}-${item.term || item.translation}`;
}
