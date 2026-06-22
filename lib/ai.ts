import type { AnalysisResult } from "@/types/analysis";
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
  "你是一个面向政治学、公共管理与社会科学研究者的英文学术精读助手。你的任务不是简单翻译，而是帮助研究者从英文论文段落中提取值得长期记忆的学科术语、学术短语、论文句式、段落逻辑和可复用写法。你需要特别关注政治学、公共管理、政策过程、数字治理、基层治理、组织理论、公共信任、制度分析、社会科学方法等相关表达。请输出严格 JSON，不要输出 Markdown，不要输出解释性前言。";

export function buildAcademicReadingPrompt(input: {
  title: string;
  tags: string[];
  text: string;
}) {
  return `请分析下面这段英文学术文本，并按照指定 JSON 结构输出结果。

论文标题：
${input.title}

学科标签：
${input.tags.join("、")}

英文原文：
${input.text}

分析要求：
1. 提取 6 到 10 个最值得记忆的学科核心术语。不要提取过于普通的英语单词，优先提取政治学、公共管理、社会科学论文中有概念意义、理论意义或写作价值的词。
2. 每个术语需要给出中文释义、简短解释，并尽量结合原文语境说明其含义。
3. 提取 3 到 5 个重点句式。重点识别研究问题句、文献缺口句、理论贡献句、机制解释句、方法说明句、发现总结句、政策启示句等。
4. 每个句式需要说明它在论文写作中的功能，并提供原文例句。如果可以，请给出一个可复用英文模板。
5. 将原文拆分成若干句子或意群，生成英中双语对照翻译。中文翻译要准确、自然、学术化，不要机械直译。
6. 生成一段简洁中文自动笔记，概括本段的核心观点、关键概念、逻辑关系和可借鉴写法。
7. 输出必须是严格 JSON，字段必须完全符合指定结构，不要输出代码块标记，不要输出 Markdown。`;
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

  return normalizeAnalysisResult(parseAnalysisJson(content), input);
}

type ChatCompletionResponse = {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
};

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
    title: readString(value.title, input.title),
    tags: readStringArray(value.tags, input.tags),
    terms: readArray(value.terms)
      .map((item) => {
        const record = isRecord(item) ? item : {};
        return {
          term: readString(record.term),
          translation: readString(record.translation),
          explanation: readOptionalString(record.explanation),
          example: readOptionalString(record.example)
        };
      })
      .filter((item) =>
        [item.term, item.translation, item.explanation, item.example].some(hasText)
      ),
    patterns: readArray(value.patterns)
      .map((item) => {
        const record = isRecord(item) ? item : {};
        return {
          type: readString(record.type),
          description: readString(record.description),
          example: readString(record.example),
          reusableTemplate: readOptionalString(record.reusableTemplate)
        };
      })
      .filter((item) =>
        [item.type, item.description, item.example, item.reusableTemplate].some(hasText)
      ),
    bilingual: readArray(value.bilingual)
      .map((item) => {
        const record = isRecord(item) ? item : {};
        return {
          en: readString(record.en),
          zh: readString(record.zh)
        };
      })
      .filter((item) => [item.en, item.zh].some(hasText)),
    note: readString(value.note),
    summary: readOptionalString(value.summary),
    createdAt: readString(value.createdAt, now),
    updatedAt: readString(value.updatedAt, now)
  };

  if (
    result.terms.length === 0 &&
    result.patterns.length === 0 &&
    result.bilingual.length === 0
  ) {
    throw new AiAnalysisError(
      "empty_result",
      "模型返回了 JSON，但核心术语、重点句式和双语对照都是空的。请换一段更完整的英文论文文本，或检查模型输出。"
    );
  }

  return result;
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

function readArray(value: unknown) {
  return Array.isArray(value) ? value : [];
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
