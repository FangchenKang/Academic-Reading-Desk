import type { AnalysisResult } from "@/types/analysis";
import { createMockAnalysisResult } from "@/lib/mock";

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

export async function analyzeAcademicText(input: {
  title: string;
  tags: string[];
  text: string;
}): Promise<AnalysisResult> {
  // MVP stage: keep the server boundary, but return deterministic mock data.
  // Real OpenAI-compatible providers can be wired here without changing the UI.
  return createMockAnalysisResult(input.title, input.tags);
}
