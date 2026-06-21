import { AppShell } from "@/components/layout/app-shell";
import { RecordList } from "@/components/records/record-list";

export default function RecordsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <div className="mb-5">
          <p className="text-sm font-medium text-blue-700">Local Records</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">本地记录</h2>
          <p className="mt-2 text-sm text-slate-500">
            查看保存在 IndexedDB 中的学习记录，点击记录可回到首页继续编辑。
          </p>
        </div>
        <RecordList />
      </div>
    </AppShell>
  );
}
