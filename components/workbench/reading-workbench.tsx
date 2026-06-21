"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, CircleDashed } from "lucide-react";
import { AnalysisPanel } from "@/components/analysis/analysis-panel";
import { InputPanel } from "@/components/input/input-panel";
import { AppShell } from "@/components/layout/app-shell";
import { Topbar } from "@/components/layout/topbar";
import { Toast } from "@/components/shared/toast";
import { getRecord, saveRecord } from "@/lib/db";
import {
  createMockAnalysisResult,
  defaultOriginalText,
  defaultTags,
  defaultTitle
} from "@/lib/mock";
import { countEnglishWords, createId } from "@/lib/utils";
import type {
  AnalysisResult,
  ReadingMode,
  ReadingRecord,
  SaveStatus
} from "@/types/analysis";

export function ReadingWorkbench() {
  const searchParams = useSearchParams();
  const requestedRecordId = searchParams.get("recordId");
  const [recordId, setRecordId] = useState(() => createId());
  const [title, setTitle] = useState(defaultTitle);
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [originalText, setOriginalText] = useState(defaultOriginalText);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(() =>
    createMockAnalysisResult()
  );
  const [createdAt, setCreatedAt] = useState(() => new Date().toISOString());
  const [lastEditedAt, setLastEditedAt] = useState(() => new Date().toISOString());
  const [mode, setMode] = useState<ReadingMode>("bilingual");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [hydrated, setHydrated] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncedToGithub, setSyncedToGithub] = useState(false);
  const [githubPath, setGithubPath] = useState<string | undefined>();
  const [collapsed, setCollapsed] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" } | null>(
    null
  );

  const wordCount = useMemo(() => countEnglishWords(originalText), [originalText]);

  useEffect(() => {
    let cancelled = false;

    async function loadRecord() {
      if (!requestedRecordId) {
        setHydrated(true);
        return;
      }

      try {
        const record = await getRecord(requestedRecordId);
        if (!record || cancelled) {
          setHydrated(true);
          return;
        }

        setRecordId(record.id);
        setTitle(record.title);
        setTags(record.tags);
        setOriginalText(record.originalText);
        setAnalysisResult(record.analysisResult);
        setCreatedAt(record.createdAt);
        setLastEditedAt(record.updatedAt);
        setSyncedToGithub(Boolean(record.syncedToGithub));
        setGithubPath(record.githubPath);
      } catch {
        showToast("读取本地记录失败", "error");
      } finally {
        if (!cancelled) setHydrated(true);
      }
    }

    loadRecord();
    return () => {
      cancelled = true;
    };
  }, [requestedRecordId]);

  const buildRecord = useCallback(
    (updatedAt = new Date().toISOString()): ReadingRecord => ({
      id: recordId,
      title,
      tags,
      originalText,
      analysisResult,
      createdAt,
      updatedAt,
      syncedToGithub,
      githubPath
    }),
    [
      analysisResult,
      createdAt,
      githubPath,
      originalText,
      recordId,
      syncedToGithub,
      tags,
      title
    ]
  );

  useEffect(() => {
    if (!hydrated) return;

    const timer = window.setTimeout(async () => {
      const now = new Date().toISOString();
      const record = buildRecord(now);
      setSaveStatus("saving");

      try {
        await saveRecord(record);
        setLastEditedAt(now);
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
        showToast("本地保存失败，请检查浏览器权限", "error");
      }
    }, 650);

    return () => window.clearTimeout(timer);
  }, [buildRecord, hydrated]);

  function showToast(message: string, tone: "success" | "error" = "success") {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 2600);
  }

  async function handleAnalyze() {
    if (!originalText.trim()) {
      showToast("请先粘贴或输入英文原文", "error");
      return;
    }

    setAnalyzing(true);
    setCollapsed(false);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, tags, text: originalText })
      });

      if (!response.ok) {
        throw new Error("Analyze failed");
      }

      const payload = (await response.json()) as { result: AnalysisResult };
      const now = new Date().toISOString();
      setAnalysisResult(payload.result);
      await saveRecord({
        ...buildRecord(now),
        analysisResult: payload.result,
        syncedToGithub: false,
        githubPath: undefined
      });
      setSyncedToGithub(false);
      setGithubPath(undefined);
      setLastEditedAt(now);
      setSaveStatus("saved");
      showToast("解析完成，已保存到本地");
    } catch {
      showToast("解析失败，请检查 API 配置或稍后重试", "error");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleNew() {
    const now = new Date().toISOString();

    try {
      await saveRecord(buildRecord(now));
    } catch {
      showToast("本地保存失败，请检查浏览器权限", "error");
    }

    setRecordId(createId());
    setTitle("");
    setTags([]);
    setOriginalText("");
    setAnalysisResult(null);
    setCreatedAt(now);
    setLastEditedAt(now);
    setSyncedToGithub(false);
    setGithubPath(undefined);
    setSaveStatus("idle");
    showToast("已创建新的空白解析");
  }

  async function handleSync() {
    setSyncing(true);

    try {
      const record = buildRecord();
      const response = await fetch("/api/github/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ record })
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        path?: string;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "GitHub 同步失败");
      }

      const now = new Date().toISOString();
      setSyncedToGithub(true);
      setGithubPath(payload.path);
      await saveRecord({
        ...record,
        updatedAt: now,
        syncedToGithub: true,
        githubPath: payload.path
      });
      setLastEditedAt(now);
      showToast("已同步到 GitHub");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "GitHub 同步失败，请稍后重试";
      showToast(message, "error");
    } finally {
      setSyncing(false);
    }
  }

  function updateNote(note: string) {
    setAnalysisResult((current) =>
      current
        ? {
            ...current,
            note,
            updatedAt: new Date().toISOString()
          }
        : current
    );
  }

  return (
    <AppShell
      topbar={
        <Topbar onNew={handleNew} onSync={handleSync} syncing={syncing} />
      }
    >
      <div className="grid h-[calc(100vh-8rem)] grid-cols-[minmax(420px,0.43fr)_minmax(540px,0.57fr)] gap-5">
        <InputPanel
          title={title}
          tags={tags}
          originalText={originalText}
          wordCount={wordCount}
          mode={mode}
          saveStatus={saveStatus}
          lastEditedAt={lastEditedAt}
          analyzing={analyzing}
          onTitleChange={(value) => {
            setSyncedToGithub(false);
            setTitle(value);
          }}
          onTagsChange={(value) => {
            setSyncedToGithub(false);
            setTags(value);
          }}
          onTextChange={(value) => {
            setSyncedToGithub(false);
            setOriginalText(value);
          }}
          onClearText={() => {
            setSyncedToGithub(false);
            setOriginalText("");
          }}
          onModeChange={setMode}
          onAnalyze={handleAnalyze}
        />

        <AnalysisPanel
          result={analysisResult}
          mode={mode}
          loading={analyzing}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          onNoteChange={updateNote}
          onCopied={(message) => showToast(message)}
        />
      </div>

      <div className="fixed bottom-5 right-7 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs text-slate-600 shadow-soft">
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
          保存到本地
        </span>
        <span className="h-3 w-px bg-slate-200" />
        <span className="inline-flex items-center gap-1.5">
          {syncedToGithub ? (
            <CheckCircle2
              className="h-3.5 w-3.5 text-emerald-600"
              aria-hidden="true"
            />
          ) : (
            <CircleDashed
              className="h-3.5 w-3.5 text-slate-400"
              aria-hidden="true"
            />
          )}
          {syncedToGithub ? `已同步到 GitHub：${githubPath}` : "GitHub 未配置或待同步"}
        </span>
      </div>

      <Toast message={toast?.message ?? null} tone={toast?.tone} />
    </AppShell>
  );
}
