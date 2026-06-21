"use client";

import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { ModeToggle } from "@/components/input/mode-toggle";
import { TagSelector } from "@/components/input/tag-selector";
import { TextEditor } from "@/components/input/text-editor";
import { TitleInput } from "@/components/input/title-input";
import { formatDateTime } from "@/lib/utils";
import type { ReadingMode, SaveStatus } from "@/types/analysis";

export function InputPanel({
  title,
  tags,
  originalText,
  wordCount,
  mode,
  saveStatus,
  lastEditedAt,
  analyzing,
  onTitleChange,
  onTagsChange,
  onTextChange,
  onClearText,
  onModeChange,
  onAnalyze
}: {
  title: string;
  tags: string[];
  originalText: string;
  wordCount: number;
  mode: ReadingMode;
  saveStatus: SaveStatus;
  lastEditedAt: string;
  analyzing: boolean;
  onTitleChange: (value: string) => void;
  onTagsChange: (tags: string[]) => void;
  onTextChange: (value: string) => void;
  onClearText: () => void;
  onModeChange: (mode: ReadingMode) => void;
  onAnalyze: () => void;
}) {
  return (
    <section className="flex h-full flex-col rounded-lg border border-slate-200 bg-white shadow-soft">
      <div className="border-b border-slate-100 px-5 py-4">
        <p className="text-xs font-medium text-slate-500">Source Workspace</p>
        <h2 className="mt-1 text-lg font-semibold text-slate-950">原文输入</h2>
      </div>

      <div className="thin-scrollbar flex-1 space-y-5 overflow-y-auto px-5 py-5">
        <TitleInput value={title} onChange={onTitleChange} />
        <TagSelector tags={tags} onChange={onTagsChange} />
        <TextEditor
          value={originalText}
          wordCount={wordCount}
          onChange={onTextChange}
          onClear={onClearText}
        />
      </div>

      <div className="space-y-4 border-t border-slate-100 px-5 py-4">
        <div className="grid grid-cols-[minmax(150px,0.95fr)_minmax(260px,1.4fr)] gap-3">
          <Button type="button" onClick={onAnalyze} disabled={analyzing}>
            <Zap className="h-4 w-4" aria-hidden="true" />
            {analyzing ? "解析中……" : "解析文本"}
          </Button>
          <ModeToggle value={mode} onChange={onModeChange} />
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
