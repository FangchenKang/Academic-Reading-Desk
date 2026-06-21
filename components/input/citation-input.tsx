"use client";

import { Textarea } from "@/components/ui/textarea";

export function CitationInput({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        引文信息
      </span>
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[72px] resize-y py-2.5 text-sm leading-5"
        placeholder="请输入参考文献格式、DOI、期刊来源或其他引文信息"
      />
    </label>
  );
}
