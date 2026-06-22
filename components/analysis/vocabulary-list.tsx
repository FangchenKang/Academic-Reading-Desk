"use client";

import Link from "next/link";
import { BookOpenText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { phraseTypeLabels } from "@/lib/vocabulary";
import type { AnalysisResult, ReadingMode } from "@/types/analysis";

type VocabularyItem = NonNullable<AnalysisResult["vocabulary"]>[number];

export function VocabularyList({
  vocabulary,
  mode
}: {
  vocabulary: VocabularyItem[];
  mode: ReadingMode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-950">
            二、学术表达词汇
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            从原文中提取可迁移到论文写作中的表达
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" asChild>
          <Link href="/terms">
            <BookOpenText className="h-3.5 w-3.5" aria-hidden="true" />
            查看词库
          </Link>
        </Button>
      </div>

      {vocabulary.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-500">
          暂无学术表达词汇。旧记录可能没有这个字段，重新解析后会自动补充。
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {vocabulary.map((item, index) => (
            <article
              key={`${item.word}-${index}`}
              className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950">
                    {item.word}
                  </p>
                  {mode !== "english" ? (
                    <p
                      className={cn(
                        "mt-1 text-sm",
                        mode === "chinese"
                          ? "font-medium text-teal-700"
                          : "text-slate-600"
                      )}
                    >
                      {item.translation}
                    </p>
                  ) : null}
                </div>
                <Badge tone="teal" className="shrink-0">
                  {phraseTypeLabels[item.phraseType ?? "other"]}
                </Badge>
              </div>

              {item.explanation && mode !== "english" ? (
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">
                  {item.explanation}
                </p>
              ) : null}

              {item.example ? (
                <p
                  className={cn(
                    "mt-2 border-l-2 border-emerald-200 pl-3 text-xs leading-5",
                    mode === "chinese" ? "text-slate-500" : "text-slate-700"
                  )}
                >
                  {item.example}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
