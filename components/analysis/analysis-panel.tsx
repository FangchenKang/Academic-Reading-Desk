"use client";

import { ChevronUp, CircleAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { AutoNoteCard } from "@/components/analysis/auto-note-card";
import { BilingualTable } from "@/components/analysis/bilingual-table";
import { PatternList } from "@/components/analysis/pattern-list";
import { TermGrid } from "@/components/analysis/term-grid";
import { VocabularyList } from "@/components/analysis/vocabulary-list";
import type {
  AnalysisErrorState,
  AnalysisResult,
  ReadingMode
} from "@/types/analysis";

export function AnalysisPanel({
  result,
  error,
  defaultMode,
  resetKey,
  loading,
  collapsed,
  onCollapsedChange,
  onNoteChange,
  onCopied
}: {
  result: AnalysisResult | null;
  error: AnalysisErrorState | null;
  defaultMode: ReadingMode;
  resetKey: number;
  loading: boolean;
  collapsed: boolean;
  onCollapsedChange: (value: boolean) => void;
  onNoteChange: (value: string) => void;
  onCopied: (message: string) => void;
}) {
  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
      <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur">
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

      <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto bg-slate-50 px-5 py-5">
        {loading ? <AnalysisLoading /> : null}

        {!loading && error ? <AnalysisErrorCard error={error} /> : null}

        {!loading && !error && !result ? (
          <EmptyState
            title="暂无解析结果"
            description="点击左侧“解析文本”后，这里会展示双语精读、核心术语、学术表达词汇、重点句式和自动笔记。"
          />
        ) : null}

        {!loading && !error && result && !collapsed ? (
          <div className="space-y-4">
            <BilingualTable
              key={`bilingual-${resetKey}`}
              items={result.bilingual}
              defaultMode={defaultMode}
              onCopied={onCopied}
            />
            <TermGrid
              key={`terms-${resetKey}`}
              terms={result.terms}
              onCopied={() => onCopied("术语已复制")}
            />
            <VocabularyList
              key={`vocabulary-${resetKey}`}
              vocabulary={result.vocabulary ?? []}
            />
            <PatternList key={`patterns-${resetKey}`} patterns={result.patterns} />
            <AutoNoteCard
              note={result.note}
              onChange={onNoteChange}
              onCopied={() => onCopied("笔记已复制")}
            />
          </div>
        ) : null}

        {!loading && !error && result && collapsed ? (
          <EmptyState
            title="结果模块已收起"
            description="点击右上角“展开全部”即可继续查看解析结果。"
          />
        ) : null}
      </div>
    </section>
  );
}

function AnalysisErrorCard({ error }: { error: AnalysisErrorState }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-900">
      <div className="flex items-start gap-3">
        <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div>
          <h3 className="text-sm font-semibold">{error.title}</h3>
          <p className="mt-1 text-sm leading-6 text-red-800">{error.message}</p>
          {error.code ? (
            <p className="mt-2 text-xs text-red-700">错误类型：{error.code}</p>
          ) : null}
          {error.status ? (
            <p className="mt-1 text-xs text-red-700">HTTP 状态码：{error.status}</p>
          ) : null}
        </div>
      </div>
    </div>
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
