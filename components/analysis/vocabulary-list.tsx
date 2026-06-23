"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpenText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { phraseTypeLabels } from "@/lib/vocabulary";
import type { AnalysisResult } from "@/types/analysis";

type VocabularyItem = NonNullable<AnalysisResult["vocabulary"]>[number];

export function VocabularyList({
  vocabulary
}: {
  vocabulary: VocabularyItem[];
}) {
  const visibleVocabulary = useMemo(() => vocabulary.slice(0, 12), [vocabulary]);
  const hiddenCount = Math.max(0, vocabulary.length - visibleVocabulary.length);
  const vocabularyIds = useMemo(
    () => visibleVocabulary.map(getVocabularyId),
    [visibleVocabulary]
  );
  const [expandedVocabularyIds, setExpandedVocabularyIds] = useState<Set<string>>(
    new Set()
  );
  const hasExpanded = expandedVocabularyIds.size > 0;

  function toggleVocabulary(id: string) {
    setExpandedVocabularyIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-950">
            三、学术表达词汇
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            从原文中提取可迁移到论文写作中的表达
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasExpanded ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setExpandedVocabularyIds(new Set())}
            >
              全部收起
            </Button>
          ) : null}
          <Button type="button" variant="outline" size="sm" asChild>
            <Link href="/terms">
              <BookOpenText className="h-3.5 w-3.5" aria-hidden="true" />
              查看词库
            </Link>
          </Button>
        </div>
      </div>

      {visibleVocabulary.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-500">
          暂无学术表达词汇。旧记录可能没有这个字段，重新解析后会自动补充。
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            {visibleVocabulary.map((item, index) => {
              const id = getVocabularyId(item, index);
              const expanded = expandedVocabularyIds.has(id);

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleVocabulary(id)}
                  className={cn(
                    "rounded-lg border p-3 text-left transition-all",
                    expanded
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-emerald-100 bg-emerald-50/40 hover:border-teal-200 hover:bg-teal-50/70"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold text-slate-950">
                        {item.word}
                      </p>
                      <p className="mt-1 text-sm font-medium text-teal-700">
                        {item.translation || "暂无释义"}
                      </p>
                    </div>
                    <Badge tone="teal" className="shrink-0">
                      {phraseTypeLabels[item.phraseType ?? "other"]}
                    </Badge>
                  </div>

                  {expanded ? (
                    <div className="mt-3 rounded-lg bg-white/70 px-3 py-2">
                      {item.explanation ? (
                        <p className="text-xs leading-5 text-slate-600">
                          {item.explanation}
                        </p>
                      ) : null}
                      {item.example ? (
                        <p className="mt-2 border-l-2 border-emerald-200 pl-3 text-xs leading-5 text-slate-600">
                          {item.example}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
          {hiddenCount > 0 ? (
            <p className="mt-3 text-xs text-slate-400">
              已展示前 12 个表达，另外 {hiddenCount} 个可在词库中心查看。
            </p>
          ) : null}
        </>
      )}
    </section>
  );
}

function getVocabularyId(item: VocabularyItem, index: number) {
  return `${index}-${item.word || item.translation}`;
}
