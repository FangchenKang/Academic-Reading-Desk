"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import type { ReadingRecord } from "@/types/analysis";

export function RecordCard({
  record,
  onDelete
}: {
  record: ReadingRecord;
  onDelete: (id: string) => void;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-blue-200">
      <div className="flex items-start justify-between gap-4">
        <Link href={`/?recordId=${record.id}`} className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-slate-950">
            {record.title || "Untitled Reading"}
          </p>
          {record.citation ? (
            <p className="mt-1 truncate text-xs text-slate-400">
              {record.citation}
            </p>
          ) : null}
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
            {record.originalText || "暂无原文内容"}
          </p>
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onDelete(record.id)}
          aria-label="删除记录"
        >
          <Trash2 className="h-4 w-4 text-slate-400" aria-hidden="true" />
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {record.tags.map((tag, index) => (
          <Badge
            key={tag}
            tone={index % 2 === 0 ? "blue" : "green"}
            className="text-[11px]"
          >
            {tag}
          </Badge>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>创建：{formatDateTime(record.createdAt)}</span>
        <span>更新：{formatDateTime(record.updatedAt)}</span>
        <span className={record.syncedToGithub ? "text-emerald-600" : "text-slate-400"}>
          {record.syncedToGithub ? "已同步 GitHub" : "待同步"}
        </span>
      </div>
    </article>
  );
}
