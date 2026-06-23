"use client";

import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { CitationInput } from "@/components/input/citation-input";
import { ModeToggle } from "@/components/input/mode-toggle";
import { TagSelector } from "@/components/input/tag-selector";
import { TextEditor } from "@/components/input/text-editor";
import { TitleInput } from "@/components/input/title-input";
import { formatDateTime } from "@/lib/utils";
import type { ReadingMode, SaveStatus } from "@/types/analysis";

export function InputPanel({
  title,
  citation,
  tags,
  originalText,
  wordCount,
  mode,
  saveStatus,
  lastEditedAt,
  analyzing,
  onTitleChange,
  onCitationChange,
  onTagsChange,
  onTextChange,
  onClearText,
  onModeChange,
  onAnalyze
}: {
  title: string;
  citation: string;
  tags: string[];
  originalText: string;
  wordCount: number;
  mode: ReadingMode;
  saveStatus: SaveStatus;
  lastEditedAt: string;
  analyzing: boolean;
  onTitleChange: (value: string) => void;
  onCitationChange: (value: string) => void;
  onTagsChange: (tags: string[]) => void;
  onTextChange: (value: string) => void;
  onClearText: () => void;
  onModeChange: (mode: ReadingMode) => void;
  onAnalyze: () => void;
}) {
  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
      <div className="shrink-0 border-b border-slate-100 px-5 py-4">
        <p className="text-xs font-medium text-slate-500">Source Workspace</p>
        <h2 className="mt-1 text-lg font-semibold text-slate-950">原文输入</h2>
      </div>

      <div className="thin-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
        <TitleInput value={title} onChange={onTitleChange} />
        <CitationInput value={citation} onChange={onCitationChange} />
        <TagSelector tags={tags} onChange={onTagsChange} />
        <TextEditor
          value={originalText}
          wordCount={wordCount}
          onChange={onTextChange}
          onClear={onClearText}
        />
      </div>

      <div className="sticky bottom-0 z-10 shrink-0 space-y-3 border-t border-slate-200 bg-white/90 px-5 py-3 shadow-[0_-10px_24px_rgba(15,23,42,0.06)] backdrop-blur">
        <div className="grid grid-cols-[minmax(150px,0.9fr)_minmax(260px,1.5fr)] gap-3">
          <Button type="button" onClick={onAnalyze} disabled={analyzing}>
            <Zap className="h-4 w-4" aria-hidden="true" />
            {analyzing ? "解析中……" : "解析文本"}
          </Button>
          <div>
            <p className="mb-1 text-[11px] font-medium text-slate-500">
              默认显示偏好
            </p>
            <ModeToggle value={mode} onChange={onModeChange} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <StatusBadge status={saveStatus} />
          <span className="text-xs text-slate-500">
            最近编辑：{formatDateTime(lastEditedAt)}
          </span>
        </div>
      </div>
    </section>
  );
}
