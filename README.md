# 学术英文精读台

面向政治学、公共管理与社会科学研究者的英文学术精读工作台。用户可以粘贴英文论文段落，先用“双语精读”逐句读懂原文，再查看学科核心术语、学术表达词汇、重点句式与自动笔记，并体验本地记录、个人词库和 GitHub 同步入口。

## 功能

- 桌面端横屏工作台：首页包含原文输入、学科标签、阅读模式切换和 AI 解析结果区。
- Mock 兜底结果：未配置 AI Key 时也能完整预览双语精读句卡、核心术语、学术表达词汇、句式和自动笔记。
- 双语精读优先：AI 解析结果区按“双语精读 / 核心术语 / 学术表达词汇 / 重点句式 / 自动笔记”的顺序呈现，阅读模式会控制句卡显示英文、双语或中文。
- 上海交通大学本地大模型 API：配置 Key 后，通过 OpenAI 兼容 `chat/completions` 接口返回真实解析结果。
- 两级词汇系统：`terms` 只沉淀政治学、公共管理和社会科学概念术语；`vocabulary` 用来积累可迁移到论文写作中的学术表达，不做泛泛背单词。
- IndexedDB 本地保存：标题、标签、原文与解析结果会保存为学习记录；同一篇文本再次解析会更新同一条记录，避免重复堆积。
- 历史记录页：查看、载入和删除本地学习记录。
- 个人词库中心：按“学科核心术语 / 学术表达词汇 / 全部词条”筛选，并按出现频次、来源记录数和最近更新时间排序。
- 笔记、模板、设置页面：保留后续继续开发的完整 UI 入口。
- GitHub 同步接口：已预留 `/api/github/sync`，未配置时返回友好提示。

## 技术栈

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui 风格本地组件
- Lucide React
- IndexedDB via `idb`

## 运行

```bash
npm install
npm run dev
```

访问 `http://localhost:3000`。

## 环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

本项目可接入上海交通大学本地大模型 API。请用户自行申请学校 API Key：本地开发时只写入 `.env.local`，部署到 Vercel 时写入 Project Settings 的 Environment Variables。不要泄露 API Key，不要把真实 Key 写入代码、README 或任何提交记录；`.env.local` 必须保留在 `.gitignore` 中，不要提交到 GitHub。

未配置 `OPENAI_API_KEY` 时，系统会自动返回 mock 分析结果，方便直接预览。配置 `OPENAI_API_KEY` 后，`/api/analyze` 会调用学校 API：

```env
OPENAI_API_KEY=
OPENAI_BASE_URL=https://models.sjtu.edu.cn/api/v1
OPENAI_MODEL=deepseek-chat

GITHUB_TOKEN=
GITHUB_OWNER=
GITHUB_REPO=
GITHUB_BRANCH=main
```

如果校外网络无法访问学校 API，请先确认校园网或 VPN 连接。请求失败时，前端会显示类似“解析失败，请检查 API 配置、校园网或 VPN 连接”的友好提示。

GitHub 同步需要配置 `GITHUB_TOKEN`、`GITHUB_OWNER`、`GITHUB_REPO` 和 `GITHUB_BRANCH`。同步文件默认写入 `records/yyyy-mm-dd-slug-title.md`。

## 词库说明

项目不是通用背单词工具，而是面向论文精读的两级词库：

- `terms`：学科核心术语，例如 governance、accountability、public trust，用于沉淀概念与理论关键词。
- `vocabulary`：学术表达词汇，例如 investigates、erode trust、play a crucial moderating role，用于积累可迁移到英文论文写作中的表达、搭配和句式片段。

个人词库中心会从本地 IndexedDB 记录中聚合词条，并统计频次、出现过的记录数、最近出现时间、来源标题和例句。旧记录如果没有 `vocabulary` 字段，会按空数组处理，不影响打开和统计。

## 后续计划

- 支持 PDF 上传、Zotero 导入与文献元数据读取。
- 建立个人术语库、Anki 卡片导出和可复用句式训练。
- 完善 GitHub 双向同步与冲突处理。
