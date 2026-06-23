"use client";

import { useMemo, useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AnalysisResult, ReadingMode } from "@/types/analysis";

type BilingualItem = AnalysisResult["bilingual"][number];

export function BilingualTable({
  items,
  defaultMode,
  onCopied
}: {
  items: AnalysisResult["bilingual"];
  defaultMode: ReadingMode;
  onCopied: (message: string) => void;
}) {
  const sentenceIds = useMemo(() => items.map(getSentenceId), [items]);
  const [sentenceModes, setSentenceModes] = useState<Record<string, ReadingMode>>(
    () => buildSentenceModeMap(sentenceIds, defaultMode)
  );

  const copyMode = getWholeTextCopyMode(sentenceIds, sentenceModes);
  const copyText = items
    .map((item, index) =>
      formatBilingualItem(item, sentenceModes[getSentenceId(item, index)] ?? copyMode)
    )
    .join("\n\n");
  const allShowingChinese =
    sentenceIds.length > 0 &&
    sentenceIds.every((id) => sentenceModes[id] === "bilingual");
  const allHidingChinese =
    sentenceIds.length > 0 &&
    sentenceIds.every((id) => sentenceModes[id] === "english");

  function setAllSentences(mode: ReadingMode) {
    setSentenceModes(buildSentenceModeMap(sentenceIds, mode));
  }

  function toggleSentence(id: string) {
    setSentenceModes((current) => {
      const currentMode = current[id] ?? defaultMode;
      return {
        ...current,
        [id]: currentMode === "bilingual" ? "english" : "bilingual"
      };
    });
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-950">一、双语精读</h3>
          <p className="mt-1 text-xs text-slate-500">
            逐句拆解英文原文，先读懂文本再积累术语
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={allShowingChinese ? "subtle" : "outline"}
            size="sm"
            onClick={() => setAllSentences("bilingual")}
          >
            全部显示中文
          </Button>
          <Button
            type="button"
            variant={allHidingChinese ? "subtle" : "outline"}
            size="sm"
            onClick={() => setAllSentences("english")}
          >
            全部隐藏中文
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={async () => {
              await navigator.clipboard.writeText(copyText);
              onCopied("双语精读全文已复制");
            }}
          >
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            复制全文
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-500">
          暂无逐句精读内容，请点击解析文本生成。
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => {
            const id = getSentenceId(item, index);
            const sentenceMode = sentenceModes[id] ?? defaultMode;
            const showEnglish = sentenceMode !== "chinese";
            const showChinese = sentenceMode !== "english";

            return (
              <article
                key={id}
                role="button"
                tabIndex={0}
                onClick={() => toggleSentence(id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    toggleSentence(id);
                  }
                }}
                className="group relative flex w-full cursor-pointer gap-3 rounded-lg border border-slate-100 bg-slate-50/80 p-3 transition-all hover:border-teal-100 hover:bg-white"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-600 text-[11px] font-bold text-white">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1 pr-24">
                  {showEnglish ? (
                    <p className="whitespace-pre-wrap break-words text-[15px] leading-7 text-slate-950">
                      {item.en}
                    </p>
                  ) : null}

                  {showChinese ? (
                    <p
                      className={cn(
                        "whitespace-pre-wrap break-words text-sm leading-7 text-slate-600 transition-all",
                        showEnglish
                          ? "mt-3 border-t border-slate-100 pt-3"
                          : "font-medium text-teal-800"
                      )}
                    >
                      {item.zh}
                    </p>
                  ) : null}
                </div>

                <div className="absolute right-2 top-2 flex items-center gap-1">
                  <span className="rounded-full bg-white px-2 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200">
                    {getSentenceToggleLabel(sentenceMode)}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-slate-400 opacity-80 hover:text-teal-700 group-hover:opacity-100"
                    title="复制当前句"
                    aria-label={`复制第 ${index + 1} 句`}
                    onClick={async (event) => {
                      event.stopPropagation();
                      await navigator.clipboard.writeText(
                        formatBilingualItem(item, sentenceMode)
                      );
                      onCopied("单句已复制");
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function buildSentenceModeMap(ids: string[], mode: ReadingMode) {
  return ids.reduce<Record<string, ReadingMode>>((map, id) => {
    map[id] = mode;
    return map;
  }, {});
}

function getWholeTextCopyMode(
  ids: string[],
  sentenceModes: Record<string, ReadingMode>
) {
  if (ids.length > 0 && ids.every((id) => sentenceModes[id] === "bilingual")) {
    return "bilingual" as const;
  }

  if (ids.length > 0 && ids.every((id) => sentenceModes[id] === "chinese")) {
    return "chinese" as const;
  }

  return "english" as const;
}

function getSentenceId(item: BilingualItem, index: number) {
  return `${index}-${item.en || item.zh}`;
}

function getSentenceToggleLabel(mode: ReadingMode) {
  if (mode === "bilingual") return "隐藏中文";
  if (mode === "chinese") return "显示英文";
  return "显示中文";
}

function formatBilingualItem(item: BilingualItem, mode: ReadingMode) {
  if (mode === "english") return item.en;
  if (mode === "chinese") return item.zh;
  return `${item.en}\n${item.zh}`;
}
