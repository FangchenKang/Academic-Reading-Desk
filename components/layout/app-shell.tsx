import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  topbar,
  mainClassName
}: {
  children: React.ReactNode;
  topbar?: React.ReactNode;
  mainClassName?: string;
}) {
  return (
    <div className="h-screen overflow-hidden bg-slate-100">
      <Sidebar />
      <div className="flex h-screen min-h-0 flex-col pl-24">
        {topbar ?? <Topbar />}
        <main
          className={cn(
            "thin-scrollbar min-h-0 flex-1 overflow-y-auto px-8 py-6",
            mainClassName
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
