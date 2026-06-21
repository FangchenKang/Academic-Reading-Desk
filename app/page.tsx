import { Suspense } from "react";
import { ReadingWorkbench } from "@/components/workbench/reading-workbench";

export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-500">正在加载工作台……</div>}>
      <ReadingWorkbench />
    </Suspense>
  );
}
