import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({
  children,
  topbar
}: {
  children: React.ReactNode;
  topbar?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />
      <div className="min-h-screen pl-24">
        {topbar ?? <Topbar />}
        <main className="min-h-[calc(100vh-5rem)] px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
