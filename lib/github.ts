import type { ReadingRecord } from "@/types/analysis";
import { slugify } from "@/lib/utils";
import { phraseTypeLabels } from "@/lib/vocabulary";

export function recordToMarkdown(record: ReadingRecord) {
  const result = record.analysisResult;
  const lines: string[] = [
    `# ${record.title || "Untitled Reading"}`,
    "",
    "## 引文信息",
    "",
    record.citation?.trim() || "未填写",
    "",
    "## 学科标签",
    "",
    ...record.tags.map((tag) => `- ${tag}`),
    "",
    "## 原文",
    "",
    record.originalText || "暂无原文",
    ""
  ];

  if (result) {
    lines.push(
      "## 核心术语",
      "",
      "| 术语 | 中文释义 | 解释 |",
      "|---|---|---|",
      ...result.terms.map(
        (item) =>
          `| ${tableCell(item.term)} | ${tableCell(item.translation)} | ${tableCell(
            item.explanation
          )} |`
      ),
      "",
      "## 学术表达词汇",
      "",
      "| 英文表达 | 中文释义 | 表达类型 | 解释 | 例句 |",
      "|---|---|---|---|---|",
      ...(result.vocabulary ?? []).map(
        (item) =>
          `| ${tableCell(item.word)} | ${tableCell(item.translation)} | ${tableCell(
            phraseTypeLabels[item.phraseType ?? "other"]
          )} | ${tableCell(item.explanation)} | ${tableCell(item.example)} |`
      ),
      "",
      "## 重点句式",
      ""
    );

    for (const pattern of result.patterns) {
      lines.push(
        `### ${pattern.type}`,
        "",
        `说明：${pattern.description}`,
        "",
        `例句：${pattern.example}`,
        "",
        `可复用模板：${pattern.reusableTemplate ?? ""}`,
        ""
      );
    }

    lines.push(
      "## 双语对照",
      "",
      "| 英文原句 | 中文翻译 |",
      "|---|---|---|",
      ...result.bilingual.map(
        (item) => `| ${tableCell(item.en)} | ${tableCell(item.zh)} |`
      ),
      "",
      "## 自动笔记",
      "",
      result.note,
      ""
    );
  }

  lines.push(
    "## 元数据",
    "",
    `- 创建时间：${record.createdAt}`,
    `- 更新时间：${record.updatedAt}`
  );

  return lines.join("\n");
}

function tableCell(value: string | undefined) {
  return (value ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, "<br>");
}

export function buildGithubPath(record: ReadingRecord) {
  const date = new Date(record.updatedAt);
  const stamp = Number.isNaN(date.getTime())
    ? new Date().toISOString().slice(0, 10)
    : date.toISOString().slice(0, 10);
  const slug = slugify(record.title || "untitled-reading") || "untitled-reading";
  return `records/${stamp}-${slug}.md`;
}

export async function syncRecordToGithub(record: ReadingRecord) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !owner || !repo) {
    throw new Error(
      "GitHub 同步未启用：线上请在 Vercel Environment Variables 中填写 GITHUB_TOKEN、GITHUB_OWNER 和 GITHUB_REPO；本地开发请写入 .env.local"
    );
  }

  const path = buildGithubPath(record);
  const markdown = recordToMarkdown(record);
  const endpoint = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28"
  };

  let sha: string | undefined;
  const existing = await fetch(`${endpoint}?ref=${branch}`, { headers });
  if (existing.ok) {
    const payload = (await existing.json()) as { sha?: string };
    sha = payload.sha;
  }

  const response = await fetch(endpoint, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: `Sync reading record: ${record.title || "Untitled Reading"}`,
      content: Buffer.from(markdown, "utf8").toString("base64"),
      branch,
      sha
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub 同步失败：${text.slice(0, 200)}`);
  }

  return { path };
}
