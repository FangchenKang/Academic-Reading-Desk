"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/shared/copy-button";
import { cn } from "@/lib/utils";
import type { AnalysisResult, ReadingMode } from "@/types/analysis";

type Term = AnalysisResult["terms"][number];

export function TermGrid({
  terms,
  mode,
  onCopied
}: {
  terms: Term[];
  mode: ReadingMode;
  onCopied: () => void;
}) {
  const [selected, setSelected] = useState<Term | null>(terms[0] ?? null);
  const visibleSelected =
    terms.find((item) => item.term === selected?.term) ?? terms[0] ?? null;
  const copyText = terms
    .map((item) => `${item.term} - ${item.translation}\n${item.explanation ?? ""}`)
    .join("\n\n");

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-950">一、核心术语</h3>
          <p className="mt-1 text-xs text-slate-500">
            从论文语境中提取值得长期积累的学科表达
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={copyText} label="复制术语" onCopied={onCopied} />
          <Button type="button" variant="outline" size="sm" asChild>
            <Link href="/terms">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              术语库
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
          {terms.map((item) => (
            <button
              key={item.term}
              type="button"
              onClick={() => setSelected(item)}
              className={cn(
                "rounded-lg border p-3 text-left transition-colors",
                visibleSelected?.term === item.term
                  ? "border-blue-200 bg-blue-50"
                  : "border-slate-200 bg-slate-50 hover:border-teal-200 hover:bg-teal-50/60"
              )}
            >
              <p className="text-sm font-semibold text-slate-950">{item.term}</p>
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
              ) : (
                <p className="mt-1 text-xs text-slate-400">academic term</p>
              )}
            </button>
          ))}
        </div>
      )}

      {visibleSelected ? (
        <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50/60 p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-blue-900">
                {visibleSelected.term}
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {visibleSelected.explanation}
              </p>
            </div>
            <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-blue-700">
              {visibleSelected.translation}
            </span>
          </div>
          {visibleSelected.example ? (
            <p className="mt-2 border-l-2 border-blue-200 pl-3 text-xs leading-5 text-slate-500">
              {visibleSelected.example}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
