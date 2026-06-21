"use client";

import { ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { AutoNoteCard } from "@/components/analysis/auto-note-card";
import { BilingualTable } from "@/components/analysis/bilingual-table";
import { PatternList } from "@/components/analysis/pattern-list";
import { TermGrid } from "@/components/analysis/term-grid";
import type { AnalysisResult, ReadingMode } from "@/types/analysis";

export function AnalysisPanel({
  result,
  mode,
  loading,
  collapsed,
  onCollapsedChange,
  onNoteChange,
  onCopied
}: {
  result: AnalysisResult | null;
  mode: ReadingMode;
  loading: boolean;
  collapsed: boolean;
  onCollapsedChange: (value: boolean) => void;
  onNoteChange: (value: string) => void;
  onCopied: (message: string) => void;
}) {
  return (
    <section className="flex h-full flex-col rounded-lg border border-slate-200 bg-white shadow-soft">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-xs font-medium text-slate-500">AI Reading Output</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-950">
            AI解析结果
          </h2>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onCollapsedChange(!collapsed)}
        >
          <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
          {collapsed ? "展开全部" : "收起全部"}
        </Button>
      </div>

      <div className="thin-scrollbar flex-1 overflow-y-auto bg-slate-50 px-5 py-5">
        {loading ? <AnalysisLoading /> : null}

        {!loading && !result ? (
          <EmptyState
            title="暂无解析结果"
            description="点击左侧“解析文本”后，这里会展示核心术语、重点句式、双语对照和自动笔记。"
          />
        ) : null}

        {!loading && result && !collapsed ? (
          <div className="space-y-4">
            <TermGrid
              terms={result.terms}
              mode={mode}
              onCopied={() => onCopied("术语已复制")}
            />
            <PatternList patterns={result.patterns} mode={mode} />
            <BilingualTable
              items={result.bilingual}
              mode={mode}
              onCopied={() => onCopied("双语内容已复制")}
            />
            <AutoNoteCard
              note={result.note}
              mode={mode}
              onChange={onNoteChange}
              onCopied={() => onCopied("笔记已复制")}
            />
          </div>
        ) : null}

        {!loading && result && collapsed ? (
          <EmptyState
            title="结果模块已收起"
            description="点击右上角“展开全部”即可继续查看解析结果。"
          />
        ) : null}
      </div>
    </section>
  );
}

function AnalysisLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        正在解析中……
      </div>
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="h-20 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-20 animate-pulse rounded-lg bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
