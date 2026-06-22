"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { listRecords } from "@/lib/db";
import { createMockAnalysisResult, defaultOriginalText } from "@/lib/mock";
import { cn, formatDateTime } from "@/lib/utils";
import {
  buildLexiconEntries,
  categoryLabels,
  filterLexiconEntries,
  getPhraseTypeLabel,
  sortLexiconEntries,
  type LexiconEntry,
  type LexiconFilter,
  type LexiconSort
} from "@/lib/vocabulary";
import type { ReadingRecord } from "@/types/analysis";

const filterOptions: { value: LexiconFilter; label: string }[] = [
  { value: "disciplinary_term", label: "学科核心术语" },
  { value: "academic_expression", label: "学术表达词汇" },
  { value: "all", label: "全部词条" }
];

const sortOptions: { value: LexiconSort; label: string }[] = [
  { value: "recordCount", label: "按记录数" },
  { value: "frequency", label: "按频次" },
  { value: "recent", label: "按最近更新" }
];

export function TermLibrary() {
  const [records, setRecords] = useState<ReadingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<LexiconFilter>("academic_expression");
  const [sort, setSort] = useState<LexiconSort>("recordCount");

  useEffect(() => {
    listRecords()
      .then(setRecords)
      .finally(() => setLoading(false));
  }, []);

  const sourceRecords = useMemo(() => {
    if (records.length > 0) return records;

    const now = new Date().toISOString();
    return [
      {
        id: "mock-lexicon",
        title: "Algorithmic Governance and Public Trust",
        citation:
          "Author, A. A. (2024). Algorithmic Governance and Public Trust. Journal of Public Administration.",
        tags: ["政治学", "公共管理", "数字治理"],
        originalText: defaultOriginalText,
        analysisResult: createMockAnalysisResult(),
        createdAt: now,
        updatedAt: now
      }
    ] satisfies ReadingRecord[];
  }, [records]);

  const entries = useMemo(() => buildLexiconEntries(sourceRecords), [sourceRecords]);
  const visibleEntries = useMemo(
    () => sortLexiconEntries(filterLexiconEntries(entries, filter), sort),
    [entries, filter, sort]
  );
  const termCount = entries.filter((entry) => entry.category === "disciplinary_term")
    .length;
  const expressionCount = entries.filter(
    (entry) => entry.category === "academic_expression"
  ).length;

  if (loading) {
    return <div className="h-60 animate-pulse rounded-lg bg-white" />;
  }

  if (entries.length === 0) {
    return (
      <EmptyState
        title="暂无词条"
        description="解析文本后会自动汇总学科核心术语和学术表达词汇。"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="全部词条" value={entries.length} />
        <StatCard label="学科核心术语" value={termCount} />
        <StatCard label="学术表达词汇" value={expressionCount} />
        <StatCard label="来源记录" value={records.length || 1} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={filter === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={sort === option.value ? "subtle" : "outline"}
              size="sm"
              onClick={() => setSort(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {visibleEntries.length === 0 ? (
        <EmptyState
          title="当前分类暂无词条"
          description="旧记录可能还没有学术表达词汇字段；重新解析文本后会自动补充。"
        />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {visibleEntries.map((entry) => (
            <LexiconCard key={entry.key} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function LexiconCard({ entry }: { entry: LexiconEntry }) {
  const isTerm = entry.category === "disciplinary_term";
  const phraseLabel = getPhraseTypeLabel(entry.phraseType);
  const sourceTitles = entry.sourceTitles.slice(0, 2).join("；");
  const extraSourceCount = Math.max(0, entry.sourceTitles.length - 2);

  return (
    <article
      className={cn(
        "rounded-lg border bg-white p-4 shadow-sm",
        isTerm ? "border-blue-100" : "border-emerald-100"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-semibold text-slate-950">{entry.text}</p>
          <p className="mt-1 text-sm font-medium text-teal-700">
            {entry.translation || "暂无释义"}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <Badge tone={isTerm ? "blue" : "teal"}>{categoryLabels[entry.category]}</Badge>
          {!isTerm ? <Badge tone="slate">{phraseLabel}</Badge> : null}
        </div>
      </div>

      {isTerm && entry.explanation ? (
        <p className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-sm leading-6 text-slate-700">
          {entry.explanation}
        </p>
      ) : null}

      {!isTerm && entry.explanation ? (
        <p className="mt-3 text-sm leading-6 text-slate-600">{entry.explanation}</p>
      ) : null}

      {!isTerm && entry.examples[0] ? (
        <p className="mt-3 border-l-2 border-emerald-200 pl-3 text-xs leading-5 text-slate-600">
          {entry.examples[0]}
        </p>
      ) : null}

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>频次：{entry.frequency}</span>
        <span>记录：{entry.recordCount}</span>
        <span>最近：{formatDateTime(entry.lastSeenAt ?? "") || "未知"}</span>
      </div>

      <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-400">
        来源：{sourceTitles || "未知"}
        {extraSourceCount > 0 ? ` 等 ${extraSourceCount + 2} 条` : ""}
      </p>
    </article>
  );
}
