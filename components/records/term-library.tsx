"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { listRecords } from "@/lib/db";
import { createMockAnalysisResult } from "@/lib/mock";
import type { AnalysisResult, ReadingRecord } from "@/types/analysis";

type Term = AnalysisResult["terms"][number] & { sourceTitle: string };

export function TermLibrary() {
  const [records, setRecords] = useState<ReadingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listRecords()
      .then(setRecords)
      .finally(() => setLoading(false));
  }, []);

  const terms = useMemo(() => {
    const sourceRecords =
      records.length > 0
        ? records
        : [
            {
              title: "Algorithmic Governance and Public Trust",
              analysisResult: createMockAnalysisResult()
            } as ReadingRecord
          ];
    const map = new Map<string, Term>();

    sourceRecords.forEach((record) => {
      record.analysisResult?.terms.forEach((term) => {
        if (!map.has(term.term)) {
          map.set(term.term, { ...term, sourceTitle: record.title });
        }
      });
    });

    return Array.from(map.values());
  }, [records]);

  if (loading) {
    return <div className="h-60 animate-pulse rounded-lg bg-white" />;
  }

  if (terms.length === 0) {
    return <EmptyState title="暂无术语" description="解析文本后会自动汇总术语。" />;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {terms.map((term) => (
        <article
          key={term.term}
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-950">{term.term}</p>
              <p className="mt-1 text-sm font-medium text-teal-700">
                {term.translation}
              </p>
            </div>
            <Badge tone="blue">术语</Badge>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {term.explanation}
          </p>
          <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-400">
            来源：{term.sourceTitle}
          </p>
        </article>
      ))}
    </div>
  );
}
