import { AppShell } from "@/components/layout/app-shell";
import { TermLibrary } from "@/components/records/term-library";

export default function TermsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <div className="mb-5">
          <p className="text-sm font-medium text-blue-700">Personal Lexicon</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">
            个人词库中心
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            分层汇总已解析记录中的学科核心术语与可迁移的学术表达词汇，并按出现频次、来源记录和最近更新时间统计。
          </p>
        </div>
        <TermLibrary />
      </div>
    </AppShell>
  );
}
