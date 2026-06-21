"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookMarked,
  FileText,
  HelpCircle,
  Home,
  Layers3,
  NotebookPen,
  Settings,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "首页", icon: Home },
  { href: "/records", label: "记录", icon: FileText },
  { href: "/terms", label: "术语库", icon: BookMarked },
  { href: "/notes", label: "笔记", icon: NotebookPen },
  { href: "/templates", label: "模板", icon: Layers3 },
  { href: "/settings", label: "设置", icon: Settings },
  { href: "/settings#help", label: "帮助", icon: HelpCircle }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-24 flex-col border-r border-slate-200 bg-white/95 px-2 py-4 shadow-sm">
      <Link
        href="/"
        className="mb-5 flex flex-col items-center gap-2 rounded-lg px-1 py-2 text-center"
        aria-label="学术英文精读台"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="text-[11px] font-semibold leading-4 text-slate-800">
          学术英文
          <br />
          精读台
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href.replace("#help", ""));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-[11px] font-medium transition-colors",
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
