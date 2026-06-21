import { AppShell } from "@/components/layout/app-shell";
import { NoteList } from "@/components/records/note-list";

export default function NotesPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <div className="mb-5">
          <p className="text-sm font-medium text-blue-700">Reading Notes</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">笔记</h2>
          <p className="mt-2 text-sm text-slate-500">
            自动笔记会沉淀在这里，便于回顾论文段落逻辑和可复用写法。
          </p>
        </div>
        <NoteList />
      </div>
    </AppShell>
  );
}
