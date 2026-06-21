"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const tones = ["blue", "green", "violet", "teal", "amber", "slate"] as const;

export function TagSelector({
  tags,
  onChange
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  function addTag() {
    const next = window.prompt("请输入新的学科标签");
    const trimmed = next?.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) return;
    onChange([...tags, trimmed]);
  }

  function removeTag(tag: string) {
    onChange(tags.filter((item) => item !== tag));
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">学科标签</span>
        <Button type="button" variant="outline" size="sm" onClick={addTag}>
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          添加
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge key={tag} tone={tones[index % tones.length]}>
            {tag}
            <button
              type="button"
              className="ml-1.5 rounded-full text-current/70 hover:text-current"
              onClick={() => removeTag(tag)}
              aria-label={`删除 ${tag}`}
            >
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          </Badge>
        ))}
        {tags.length === 0 ? (
          <span className="text-sm text-slate-400">暂无标签，可点击添加。</span>
        ) : null}
      </div>
    </div>
  );
}
