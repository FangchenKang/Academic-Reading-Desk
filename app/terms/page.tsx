import { AppShell } from "@/components/layout/app-shell";
import { TermLibrary } from "@/components/records/term-library";

export default function TermsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <div className="mb-5">
          <p className="text-sm font-medium text-blue-700">Term Library</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">术语库</h2>
          <p className="mt-2 text-sm text-slate-500">
            汇总已解析记录中的政治学、公共管理、数字治理等学科术语。
          </p>
        </div>
        <TermLibrary />
      </div>
    </AppShell>
  );
}
