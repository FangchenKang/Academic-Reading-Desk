import { Github, KeyRound, ServerCog } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";

const envItems = [
  "OPENAI_API_KEY",
  "OPENAI_BASE_URL",
  "OPENAI_MODEL",
  "GITHUB_TOKEN",
  "GITHUB_OWNER",
  "GITHUB_REPO",
  "GITHUB_BRANCH"
];

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <div className="mb-5">
          <p className="text-sm font-medium text-blue-700">Configuration</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">设置</h2>
          <p className="mt-2 text-sm text-slate-500">
            当前 MVP 优先完成前端与 mock 数据。真实 API 和 GitHub 同步通过环境变量预留。
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <KeyRound className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-slate-950">AI 配置说明</h3>
                <p className="text-sm text-slate-500">
                  未配置 Key 时，系统会自动使用 mock 分析结果。
                </p>
              </div>
            </div>
            <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs leading-6 text-slate-100">
{`OPENAI_API_KEY=
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini`}
            </pre>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <Github className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-slate-950">GitHub 同步说明</h3>
                <p className="text-sm text-slate-500">
                  配置后可将当前学习记录同步为 Markdown 文件。
                </p>
              </div>
            </div>
            <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs leading-6 text-slate-100">
{`GITHUB_TOKEN=
GITHUB_OWNER=
GITHUB_REPO=
GITHUB_BRANCH=main`}
            </pre>
          </section>
        </div>

        <section
          id="help"
          className="mt-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <ServerCog className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-semibold text-slate-950">环境变量清单</h3>
              <p className="text-sm text-slate-500">
                请在项目根目录创建 `.env.local`，并按需填写以下变量。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {envItems.map((item) => (
              <code
                key={item}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700"
              >
                {item}
              </code>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
