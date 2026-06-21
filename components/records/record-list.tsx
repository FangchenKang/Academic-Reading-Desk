"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { deleteRecord, listRecords } from "@/lib/db";
import type { ReadingRecord } from "@/types/analysis";
import { RecordCard } from "@/components/records/record-card";

export function RecordList() {
  const [records, setRecords] = useState<ReadingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    listRecords().then((nextRecords) => {
      if (cancelled) return;
      setRecords(nextRecords);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  async function refresh() {
    setLoading(true);
    const nextRecords = await listRecords();
    setRecords(nextRecords);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("确定删除这条学习记录吗？");
    if (!confirmed) return;

    await deleteRecord(id);
    await refresh();
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-32 animate-pulse rounded-lg bg-white" />
        ))}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <EmptyState
        title="暂无本地记录"
        description="在首页输入文本并等待自动保存后，这里会显示历史学习记录。"
      />
    );
  }

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <RecordCard key={record.id} record={record} onDelete={handleDelete} />
      ))}
    </div>
  );
}
