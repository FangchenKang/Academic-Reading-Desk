"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function TextEditor({
  value,
  wordCount,
  onChange,
  onClear
}: {
  value: string;
  wordCount: number;
  onChange: (value: string) => void;
  onClear: () => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-700">
          原文内容（支持粘贴英文段落或摘要）
        </span>
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          清空
        </Button>
      </div>
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-[315px] resize-none text-[15px]"
        placeholder="Paste an English abstract or paragraph here..."
      />
      <p className="mt-2 text-xs text-slate-500">字数统计：{wordCount} 词</p>
    </div>
  );
}
