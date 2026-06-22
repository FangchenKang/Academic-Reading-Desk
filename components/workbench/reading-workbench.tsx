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
  defaultCitation,
  defaultOriginalText,
  defaultTags,
  defaultTitle
} from "@/lib/mock";
import { countEnglishWords, createId } from "@/lib/utils";
import type {
  AnalysisErrorState,
  AnalysisResult,
  ReadingMode,
  ReadingRecord,
  SaveStatus
} from "@/types/analysis";

type AnalyzeErrorPayload = {
  error?: string;
  code?: string;
  status?: number;
};

export function ReadingWorkbench() {
  const searchParams = useSearchParams();
  const requestedRecordId = searchParams.get("recordId");
  const [recordId, setRecordId] = useState(() => createId());
  const [title, setTitle] = useState(defaultTitle);
  const [citation, setCitation] = useState(defaultCitation);
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [originalText, setOriginalText] = useState(defaultOriginalText);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(() =>
    createMockAnalysisResult()
  );
  const [analysisError, setAnalysisError] = useState<AnalysisErrorState | null>(
    null
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
        setCitation(record.citation ?? "");
        setTags(record.tags);
        setOriginalText(record.originalText);
        setAnalysisResult(record.analysisResult);
        setAnalysisError(null);
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
      citation,
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
      citation,
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
    setAnalysisError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, tags, text: originalText })
      });

      const payload = (await response.json()) as {
        result?: AnalysisResult;
        error?: string;
        code?: string;
        status?: number;
      };

      if (!response.ok || !payload.result) {
        throw createAnalyzeError(payload);
      }

      const now = new Date().toISOString();
      setAnalysisResult(payload.result);
      setAnalysisError(null);
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
    } catch (error) {
      const analyzeError = normalizeAnalyzeError(error);
      setAnalysisError(analyzeError);
      showToast(
        analyzeError.message,
        "error"
      );
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
    setCitation("");
    setTags([]);
    setOriginalText("");
    setAnalysisResult(null);
    setAnalysisError(null);
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
      mainClassName="overflow-hidden"
      topbar={
        <Topbar onNew={handleNew} onSync={handleSync} syncing={syncing} />
      }
    >
      <div className="grid h-full min-h-0 grid-cols-[minmax(420px,0.43fr)_minmax(540px,0.57fr)] gap-5 overflow-hidden">
        <InputPanel
          title={title}
          citation={citation}
          tags={tags}
          originalText={originalText}
          wordCount={wordCount}
          mode={mode}
          saveStatus={saveStatus}
          lastEditedAt={lastEditedAt}
          analyzing={analyzing}
          onTitleChange={(value) => {
            setSyncedToGithub(false);
            setAnalysisError(null);
            setTitle(value);
          }}
          onCitationChange={(value) => {
            setSyncedToGithub(false);
            setCitation(value);
          }}
          onTagsChange={(value) => {
            setSyncedToGithub(false);
            setAnalysisError(null);
            setTags(value);
          }}
          onTextChange={(value) => {
            setSyncedToGithub(false);
            setAnalysisError(null);
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
          error={analysisError}
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

function createAnalyzeError(payload: AnalyzeErrorPayload) {
  const error = new Error(
    payload.error ?? "解析失败，请检查 API 配置、校园网或 VPN 连接"
  ) as Error & { status?: number };
  error.name = payload.code ?? "analyze_failed";
  error.status = payload.status;
  return error;
}

function normalizeAnalyzeError(error: unknown): AnalysisErrorState {
  if (error instanceof Error) {
    const maybeStatus = (error as Error & { status?: unknown }).status;
    return {
      title: getAnalyzeErrorTitle(error.name),
      message: error.message,
      code: error.name === "Error" ? undefined : error.name,
      status: typeof maybeStatus === "number" ? maybeStatus : undefined
    };
  }

  return {
    title: "解析失败",
    message: "解析失败，请检查 API 配置、校园网或 VPN 连接"
  };
}

function getAnalyzeErrorTitle(code?: string) {
  switch (code) {
    case "api_request_failed":
      return "API 请求失败";
    case "empty_response":
      return "API 返回为空";
    case "invalid_json":
      return "JSON 解析失败";
    case "empty_result":
      return "模型返回空数据";
    case "missing_text":
      return "缺少英文原文";
    default:
      return "解析失败";
  }
}
