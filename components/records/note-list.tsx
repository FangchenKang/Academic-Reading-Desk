"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { listRecords } from "@/lib/db";
import { createMockAnalysisResult } from "@/lib/mock";
import { formatDateTime } from "@/lib/utils";
import type { ReadingRecord } from "@/types/analysis";

export function NoteList() {
  const [records, setRecords] = useState<ReadingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listRecords()
      .then(setRecords)
      .finally(() => setLoading(false));
  }, []);

  const noteRecords = useMemo(() => {
    if (records.length > 0) {
      return records.filter((record) => record.analysisResult?.note);
    }

    const now = new Date().toISOString();
    return [
      {
        id: "mock-note",
        title: "Algorithmic Governance and Public Trust",
        citation:
          "Author, A. A. (2024). Algorithmic Governance and Public Trust. Journal of Public Administration.",
        tags: ["政治学", "数字治理"],
        originalText: "",
        analysisResult: createMockAnalysisResult(),
        createdAt: now,
        updatedAt: now
      }
    ];
  }, [records]);

  if (loading) {
    return <div className="h-60 animate-pulse rounded-lg bg-white" />;
  }

  if (noteRecords.length === 0) {
    return (
      <EmptyState title="暂无笔记" description="解析完成后，自动笔记会汇总到这里。" />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {noteRecords.map((record) => (
        <article
          key={record.id}
          className="rounded-lg border border-amber-100 bg-amber-50 p-4 shadow-sm"
        >
          <div className="mb-3 flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-950">{record.title}</p>
              <p className="mt-1 text-xs text-slate-500">
                更新：{formatDateTime(record.updatedAt)}
              </p>
            </div>
            {record.id !== "mock-note" ? (
              <Button type="button" variant="outline" size="sm" asChild>
                <Link href={`/?recordId=${record.id}`}>打开</Link>
              </Button>
            ) : null}
          </div>
          <p className="text-sm leading-7 text-slate-700">
            {record.analysisResult?.note}
          </p>
        </article>
      ))}
    </div>
  );
}
