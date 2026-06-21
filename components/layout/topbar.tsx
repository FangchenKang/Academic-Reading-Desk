"use client";

import Link from "next/link";
import { Database, Github, Plus, Settings } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Topbar({
  onNew,
  onSync,
  syncing = false,
  syncDisabled = false
}: {
  onNew?: () => void;
  onSync?: () => void;
  syncing?: boolean;
  syncDisabled?: boolean;
}) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-slate-50/80 px-8">
      <div>
        <p className="text-xs font-medium text-slate-500">Academic Reading Desk</p>
        <h1 className="mt-1 text-xl font-semibold text-slate-950">
          学术英文精读台
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {onNew ? (
          <Button type="button" onClick={onNew}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            新建解析
          </Button>
        ) : (
          <Link href="/" className={cn(buttonVariants())}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            新建解析
          </Link>
        )}

        <Link href="/records" className={cn(buttonVariants({ variant: "outline" }))}>
          <Database className="h-4 w-4" aria-hidden="true" />
          本地记录
        </Link>

        <Button
          type="button"
          variant="outline"
          onClick={onSync}
          disabled={!onSync || syncing || syncDisabled}
        >
          <Github className="h-4 w-4" aria-hidden="true" />
          {syncing ? "同步中……" : "同步 GitHub"}
        </Button>

        <Link
          href="/settings"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <Settings className="h-4 w-4" aria-hidden="true" />
          设置
        </Link>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm"
          aria-label="用户头像"
        >
          R
        </button>
      </div>
    </header>
  );
}
