"use client";

import { Input } from "@/components/ui/input";

export function TitleInput({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        论文标题
      </span>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Algorithmic Governance and Public Trust"
      />
    </label>
  );
}
