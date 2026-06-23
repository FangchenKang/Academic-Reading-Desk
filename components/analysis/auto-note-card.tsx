"use client";

import { NotebookPen } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { Textarea } from "@/components/ui/textarea";

export function AutoNoteCard({
  note,
  onChange,
  onCopied
}: {
  note: string;
  onChange: (value: string) => void;
  onCopied: () => void;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-950">五、自动笔记</h3>
          <p className="mt-1 text-xs text-slate-500">
            可编辑的中文理解笔记，适合后续沉淀到个人知识库
          </p>
        </div>
        <CopyButton text={note} label="复制笔记" onCopied={onCopied} />
      </div>

      <div className="grid grid-cols-[36px_1fr] gap-3 rounded-lg border border-amber-100 bg-amber-50 p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-amber-700 shadow-sm">
          <NotebookPen className="h-4 w-4" aria-hidden="true" />
        </div>
        <Textarea
          value={note}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-28 border-amber-100 bg-white text-slate-800"
        />
      </div>
    </section>
  );
}
