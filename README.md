# 学术英文精读台

面向政治学、公共管理与社会科学研究者的英文学术精读工作台。当前 MVP 先完成前端界面与 mock 数据：用户可以粘贴英文论文段落，查看核心术语、重点句式、双语对照与自动笔记，并体验本地记录、页面导航与 GitHub 同步入口。

## 功能

- 桌面端横屏工作台：首页包含原文输入、学科标签、阅读模式切换和 AI 解析结果区。
- Mock 解析结果：未配置 AI Key 时也能完整预览术语、句式、双语翻译和自动笔记。
- IndexedDB 本地保存：标题、标签、原文与解析结果会自动保存为学习记录。
- 历史记录页：查看、载入和删除本地学习记录。
- 术语库、笔记、模板、设置页面：保留后续继续开发的完整 UI 入口。
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

当前阶段前端与 mock 数据优先。`OPENAI_API_KEY` 可先留空，系统会自动返回 mock 分析结果，项目可以直接预览。

```env
OPENAI_API_KEY=
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini

GITHUB_TOKEN=
GITHUB_OWNER=
GITHUB_REPO=
GITHUB_BRANCH=main
```

GitHub 同步需要配置 `GITHUB_TOKEN`、`GITHUB_OWNER`、`GITHUB_REPO` 和 `GITHUB_BRANCH`。同步文件默认写入 `records/yyyy-mm-dd-slug-title.md`。

## 后续计划

- 接入真实 OpenAI 兼容 API，并保持 mock fallback。
- 支持 PDF 上传、Zotero 导入与文献元数据读取。
- 建立个人术语库、Anki 卡片导出和可复用句式训练。
- 完善 GitHub 双向同步与冲突处理。
