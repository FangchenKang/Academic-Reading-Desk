import type {
  AnalysisResult,
  VocabularyCategory,
  VocabularyPhraseType
} from "@/types/analysis";
import { createMockAnalysisResult } from "@/lib/mock";

const defaultBaseUrl = "https://models.sjtu.edu.cn/api/v1";
const defaultModel = "deepseek-chat";

export type AiAnalysisErrorCode =
  | "api_request_failed"
  | "empty_response"
  | "invalid_json"
  | "empty_result"
  | "unknown";

export class AiAnalysisError extends Error {
  code: AiAnalysisErrorCode;
  status?: number;
  debugDetail?: string;

  constructor(
    code: AiAnalysisErrorCode,
    message: string,
    options?: { status?: number; debugDetail?: string }
  ) {
    super(message);
    this.name = "AiAnalysisError";
    this.code = code;
    this.status = options?.status;
    this.debugDetail = options?.debugDetail;
  }
}

export function getAiAnalysisErrorPayload(error: unknown) {
  if (error instanceof AiAnalysisError) {
    return {
      error: error.message,
      code: error.code,
      status: error.status
    };
  }

  return {
    error: "解析失败，请检查 API 配置、校园网或 VPN 连接",
    code: "unknown" satisfies AiAnalysisErrorCode
  };
}

export const academicReadingSystemPrompt =
  "你是一个面向政治学、公共管理与社会科学研究者的英文学术精读助手。你的任务不是简单翻译，而是帮助研究者从英文论文段落中提取值得长期记忆的学科术语、学术短语、论文句式、段落逻辑和可复用写法。你必须输出严格 JSON 对象，不能输出 Markdown、代码块、解释性前言或多余文本。";

const requiredJsonShape = `{
  "title": "string",
  "tags": ["string"],
  "terms": [
    {
      "term": "English academic term or phrase",
      "translation": "中文释义",
      "explanation": "结合原文语境的中文解释",
      "example": "source sentence or phrase from the English text"
    }
  ],
  "vocabulary": [
    {
      "word": "transferable academic expression from the source text",
      "translation": "中文释义",
      "category": "academic_expression",
      "explanation": "说明这个表达在论文写作中的功能",
      "example": "source sentence or phrase from the English text",
      "phraseType": "verb | noun_phrase | adjective | adverb | collocation | transition | other",
      "frequency": 1
    }
  ],
  "patterns": [
    {
      "type": "句式功能类型，例如 研究问题句 / 理论缺口句 / 机制解释句",
      "description": "中文说明这个句式在论文写作中的功能",
      "example": "original English sentence",
      "reusableTemplate": "reusable English writing template"
    }
  ],
  "bilingual": [
    {
      "en": "English sentence or meaning unit",
      "zh": "准确自然的中文学术翻译"
    }
  ],
  "note": "中文自动笔记",
  "summary": "可选中文摘要",
  "createdAt": "ISO datetime string, optional",
  "updatedAt": "ISO datetime string, optional"
}`;

export function buildAcademicReadingPrompt(input: {
  title: string;
  tags: string[];
  text: string;
}) {
  return `请分析下面这段英文学术文本，并只输出一个严格 JSON 对象。

论文标题：${input.title}

学科标签：${input.tags.join("、") || "未指定"}

英文原文：
${input.text}

必须遵守：
1. 顶层字段必须使用英文键名：title, tags, terms, vocabulary, patterns, bilingual, note, summary, createdAt, updatedAt。
2. terms 必须是非空数组，只提取 6 到 10 个具有政治学、公共管理或社会科学概念意义的学科核心术语。不要把普通写作动词或通用搭配放入 terms。即使文本较短，也至少提取 3 个。
3. vocabulary 必须提取 8 到 15 个可迁移到英文学术论文写作中的表达，优先选择原文中的动词、名词短语、搭配、转折表达和机制表达。vocabulary 不是泛泛背单词，category 默认使用 academic_expression；不要与 terms 大量重复。
4. patterns 必须是非空数组。提取 3 到 5 个重点句式，包括研究问题句、理论缺口句、机制解释句、方法说明句、发现总结句或政策启示句等。即使文本较短，也至少提取 2 个。
5. bilingual 必须是非空数组。请把原文拆分为适合精读的英文句子或意群，不要过度切碎，也不要把多个复杂句全部挤在一起。每个 bilingual item 尽量对应一个完整英文句子；如果原句过长，可以按意群合理拆分。中文翻译要准确、自然、学术化，适合社会科学论文阅读。即使文本较短，也至少返回 2 条。
6. 不要返回空数组。不要返回中文键名。不要把 JSON 放进 Markdown 代码块。
7. 如果原文信息有限，也要基于已有文本提取可用内容，不要用空数组代替分析。
8. note 必须用中文概括本段核心观点、关键词、逻辑关系和可借鉴写法。

JSON 结构必须严格匹配：
${requiredJsonShape}`;
}

function buildRepairPrompt(input: {
  title: string;
  tags: string[];
  text: string;
  previousOutput: string;
  reason: string;
}) {
  return `你上一次返回的结果无法用于前端展示，原因是：${input.reason}

请重新分析原文，并只输出一个严格 JSON 对象。不要解释，不要使用 Markdown。

原文标题：${input.title}
学科标签：${input.tags.join("、") || "未指定"}

英文原文：
${input.text}

上一次模型返回内容如下，请不要照抄其中的空数组或错误结构：
${input.previousOutput.slice(0, 3000)}

修复要求：
1. terms、vocabulary、patterns、bilingual 都必须是非空数组。
2. 必须使用英文键名和以下 JSON 结构。
3. 如果原文较短，也至少返回 3 个 terms、5 个 vocabulary、2 个 patterns、2 条 bilingual。
4. 只输出 JSON 对象，不要输出任何说明文字。

${requiredJsonShape}`;
}

export function hasConfiguredAiKey() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export async function analyzeAcademicText(input: {
  title: string;
  tags: string[];
  text: string;
}): Promise<AnalysisResult> {
  if (!hasConfiguredAiKey()) {
    return createMockAnalysisResult(input.title, input.tags);
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const baseUrl = (process.env.OPENAI_BASE_URL || defaultBaseUrl).replace(/\/+$/, "");
  const model = process.env.OPENAI_MODEL || defaultModel;
  const userPrompt = buildAcademicReadingPrompt(input);
  const content = await requestChatCompletion({ apiKey, baseUrl, model, userPrompt });

  try {
    return normalizeAnalysisResult(parseAnalysisJson(content), input);
  } catch (error) {
    if (!shouldRetryWithStrictSchema(error)) {
      throw error;
    }

    const retryPrompt = buildRepairPrompt({
      ...input,
      previousOutput: content,
      reason: error instanceof Error ? error.message : "模型返回结构不符合要求"
    });
    const retryContent = await requestChatCompletion({
      apiKey,
      baseUrl,
      model,
      userPrompt: retryPrompt
    });

    return normalizeAnalysisResult(parseAnalysisJson(retryContent), input);
  }
}

type ChatCompletionResponse = {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
};

async function requestChatCompletion({
  apiKey,
  baseUrl,
  model,
  userPrompt
}: {
  apiKey?: string;
  baseUrl: string;
  model: string;
  userPrompt: string;
}) {
  let response: Response;

  try {
    response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: academicReadingSystemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        stream: false,
        max_tokens: 4096,
        temperature: 0.2
      })
    });
  } catch (error) {
    throw new AiAnalysisError(
      "api_request_failed",
      "学校 API 请求失败，请检查 API 配置、校园网或 VPN 连接。",
      { debugDetail: error instanceof Error ? error.message : String(error) }
    );
  }

  if (!response.ok) {
    const detail = await response.text();
    throw new AiAnalysisError(
      "api_request_failed",
      getApiFailureMessage(response.status),
      {
        status: response.status,
        debugDetail: detail.slice(0, 500)
      }
    );
  }

  let data: ChatCompletionResponse;
  try {
    data = (await response.json()) as ChatCompletionResponse;
  } catch {
    throw new AiAnalysisError(
      "empty_response",
      "学校 API 返回成功，但响应不是有效 JSON，请检查模型服务返回格式。"
    );
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new AiAnalysisError(
      "empty_response",
      "学校 API 返回成功，但没有可解析的 message.content，请检查模型服务返回格式。"
    );
  }

  return content;
}

function shouldRetryWithStrictSchema(error: unknown) {
  return (
    error instanceof AiAnalysisError &&
    (error.code === "empty_result" || error.code === "invalid_json")
  );
}

function parseAnalysisJson(rawContent: string): unknown {
  const candidates = [
    rawContent,
    stripMarkdownFence(rawContent),
    extractJsonObject(rawContent)
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch {
      // Try the next cleaned candidate.
    }
  }

  throw new AiAnalysisError(
    "invalid_json",
    "模型返回了内容，但不是可解析的 JSON。请稍后重试，或检查模型是否按要求输出严格 JSON。"
  );
}

function stripMarkdownFence(content: string) {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return fenced?.[1]?.trim() ?? content.trim();
}

function extractJsonObject(content: string) {
  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return "";
  return content.slice(start, end + 1).trim();
}

function normalizeAnalysisResult(
  value: unknown,
  input: { title: string; tags: string[] }
): AnalysisResult {
  if (!isRecord(value)) {
    throw new AiAnalysisError(
      "invalid_json",
      "模型返回的 JSON 结构不是对象，无法生成精读结果。"
    );
  }

  const now = new Date().toISOString();

  const result = {
    title: readStringByKeys(value, ["title"], input.title),
    tags: readStringArray(readValueByKeys(value, ["tags", "标签"]), input.tags),
    terms: dedupeByText(
      readArrayByKeys(value, [
        "terms",
        "keyTerms",
        "coreTerms",
        "academicTerms",
        "terminology",
        "核心术语",
        "术语"
      ])
        .map((item, index) => {
          const record = isRecord(item) ? item : {};
          const translation = readStringByKeys(record, [
            "translation",
            "zh",
            "chinese",
            "meaning",
            "中文",
            "释义"
          ]);
          return {
            term:
              readStringByKeys(record, [
                "term",
                "phrase",
                "name",
                "english",
                "en",
                "术语"
              ]) ||
              translation ||
              `term-${index + 1}`,
            translation,
            explanation: readOptionalStringByKeys(record, [
              "explanation",
              "definition",
              "description",
              "note",
              "解释",
              "说明"
            ]),
            example: readOptionalStringByKeys(record, [
              "example",
              "source",
              "sentence",
              "context",
              "例句",
              "原文例句"
            ])
          };
        })
        .filter((item) =>
          [item.term, item.translation, item.explanation, item.example].some(hasText)
        ),
      (item) => item.term
    ),
    vocabulary: dedupeByText(
      readArrayByKeys(value, [
        "vocabulary",
        "academicVocabulary",
        "academicExpressions",
        "writingVocabulary",
        "expressions",
        "学术表达词汇",
        "表达词汇",
        "学术表达"
      ])
        .map((item, index) => {
          const record = isRecord(item) ? item : {};
          const translation = readStringByKeys(record, [
            "translation",
            "zh",
            "chinese",
            "meaning",
            "中文",
            "释义"
          ]);
          return {
            word:
              readStringByKeys(record, [
                "word",
                "phrase",
                "expression",
                "term",
                "english",
                "en",
                "表达",
                "词汇"
              ]) ||
              translation ||
              `expression-${index + 1}`,
            translation,
            category: normalizeVocabularyCategory(
              readOptionalStringByKeys(record, ["category", "type", "类别"])
            ),
            explanation: readOptionalStringByKeys(record, [
              "explanation",
              "definition",
              "description",
              "function",
              "note",
              "解释",
              "说明"
            ]),
            example: readOptionalStringByKeys(record, [
              "example",
              "source",
              "sentence",
              "context",
              "例句",
              "原文例句"
            ]),
            phraseType: normalizePhraseType(
              readOptionalStringByKeys(record, [
                "phraseType",
                "phrase_type",
                "partOfSpeech",
                "pos",
                "表达类型",
                "词性"
              ])
            ),
            frequency: readPositiveNumberByKeys(record, [
              "frequency",
              "count",
              "occurrences",
              "频次"
            ])
          };
        })
        .filter((item) =>
          [item.word, item.translation, item.explanation, item.example].some(hasText)
        ),
      (item) => item.word
    ),
    patterns: readArrayByKeys(value, [
      "patterns",
      "sentencePatterns",
      "writingPatterns",
      "keySentences",
      "重点句式",
      "句式"
    ])
      .map((item, index) => {
        const record = isRecord(item) ? item : {};
        return {
          type:
            readStringByKeys(record, ["type", "name", "function", "category", "类型"]) ||
            `句式 ${index + 1}`,
          description: readStringByKeys(record, [
            "description",
            "explanation",
            "function",
            "说明",
            "解释"
          ]),
          example: readStringByKeys(record, [
            "example",
            "sentence",
            "source",
            "原文例句",
            "例句"
          ]),
          reusableTemplate: readOptionalStringByKeys(record, [
            "reusableTemplate",
            "template",
            "writingTemplate",
            "模板",
            "可复用模板"
          ])
        };
      })
      .filter((item) =>
        [item.type, item.description, item.example, item.reusableTemplate].some(hasText)
      ),
    bilingual: readArrayByKeys(value, [
      "bilingual",
      "translations",
      "parallelText",
      "sentenceTranslations",
      "双语精读",
      "双语对照",
      "翻译"
    ])
      .map((item, index) => {
        const record = isRecord(item) ? item : {};
        return {
          en:
            readStringByKeys(record, ["en", "english", "source", "original", "英文"]) ||
            `sentence-${index + 1}`,
          zh: readStringByKeys(record, ["zh", "chinese", "translation", "中文", "译文"])
        };
      })
      .filter((item) => [item.en, item.zh].some(hasText)),
    note: readStringByKeys(value, ["note", "notes", "autoNote", "笔记", "自动笔记"]),
    summary: readOptionalStringByKeys(value, ["summary", "摘要"]),
    createdAt: readStringByKeys(value, ["createdAt"], now),
    updatedAt: readStringByKeys(value, ["updatedAt"], now)
  };

  if (
    result.terms.length === 0 &&
    result.patterns.length === 0 &&
    result.bilingual.length === 0
  ) {
    throw new AiAnalysisError(
      "empty_result",
      "模型返回了 JSON，但双语精读、核心术语和重点句式都是空的。系统已尝试用严格 schema 修复，仍未得到可展示内容。请检查模型输出或稍后重试。"
    );
  }

  return result;
}

function dedupeByText<T>(items: T[], getText: (item: T) => string) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = normalizeLexiconKey(getText(item));
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeLexiconKey(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizeVocabularyCategory(value: string | undefined): VocabularyCategory {
  if (
    value === "disciplinary_term" ||
    value === "academic_expression" ||
    value === "general_vocabulary"
  ) {
    return value;
  }

  return "academic_expression" as const;
}

function normalizePhraseType(value: string | undefined): VocabularyPhraseType {
  if (
    value === "verb" ||
    value === "noun_phrase" ||
    value === "adjective" ||
    value === "adverb" ||
    value === "collocation" ||
    value === "transition" ||
    value === "other"
  ) {
    return value;
  }

  return "other" as const;
}

function getApiFailureMessage(status: number) {
  if (status === 401 || status === 403) {
    return "学校 API 鉴权失败，请检查 OPENAI_API_KEY 是否正确，并确认 Vercel Production 环境变量已保存后重新部署。";
  }

  if (status === 404) {
    return "学校 API 地址或模型配置可能不正确，请检查 OPENAI_BASE_URL 和 OPENAI_MODEL。";
  }

  return `学校 API 请求失败（HTTP ${status}），请检查 API 配置、校园网或 VPN 连接。`;
}

function hasText(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readValueByKeys(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null) return value;
  }
  return undefined;
}

function readArrayByKeys(record: Record<string, unknown>, keys: string[]) {
  const value = readValueByKeys(record, keys);
  return Array.isArray(value) ? value : [];
}

function readStringByKeys(
  record: Record<string, unknown>,
  keys: string[],
  fallback = ""
) {
  return readString(readValueByKeys(record, keys), fallback);
}

function readOptionalStringByKeys(record: Record<string, unknown>, keys: string[]) {
  return readOptionalString(readValueByKeys(record, keys));
}

function readPositiveNumberByKeys(record: Record<string, unknown>, keys: string[]) {
  const value = readValueByKeys(record, keys);
  const numberValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : undefined;

  if (
    typeof numberValue !== "number" ||
    !Number.isFinite(numberValue) ||
    numberValue <= 0
  ) {
    return undefined;
  }

  return numberValue;
}

function readString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function readOptionalString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function readStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  const strings = value.filter((item): item is string => typeof item === "string");
  return strings.length > 0 ? strings : fallback;
}
