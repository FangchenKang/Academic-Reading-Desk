import type {
  ReadingRecord,
  VocabularyCategory,
  VocabularyPhraseType
} from "@/types/analysis";

export type LexiconEntry = {
  key: string;
  text: string;
  translation: string;
  category: VocabularyCategory;
  explanation?: string;
  phraseType?: string;
  frequency: number;
  recordCount: number;
  sourceRecordIds: string[];
  sourceTitles: string[];
  examples: string[];
  firstSeenAt?: string;
  lastSeenAt?: string;
  tags: string[];
};

export type LexiconFilter = VocabularyCategory | "all";
export type LexiconSort = "recordCount" | "frequency" | "recent";

type LexiconDraft = Omit<
  LexiconEntry,
  "sourceRecordIds" | "sourceTitles" | "examples" | "tags"
> & {
  sourceRecordIds: Set<string>;
  sourceTitles: Set<string>;
  examples: Set<string>;
  tags: Set<string>;
};

export const categoryLabels: Record<VocabularyCategory, string> = {
  disciplinary_term: "学科核心术语",
  academic_expression: "学术表达词汇",
  general_vocabulary: "通用词汇"
};

export const phraseTypeLabels: Record<VocabularyPhraseType | "unknown", string> = {
  verb: "动词",
  noun_phrase: "名词短语",
  adjective: "形容词",
  adverb: "副词",
  collocation: "搭配",
  transition: "连接表达",
  other: "其他",
  unknown: "未分类"
};

export function getPhraseTypeLabel(value?: string) {
  if (isVocabularyPhraseType(value)) return phraseTypeLabels[value];
  return phraseTypeLabels.unknown;
}

export function buildLexiconEntries(records: ReadingRecord[]) {
  const map = new Map<string, LexiconDraft>();

  records.forEach((record) => {
    const result = record.analysisResult;
    if (!result) return;

    (result.terms ?? []).forEach((term) => {
      addLexiconItem(map, {
        record,
        text: term.term,
        translation: term.translation,
        category: "disciplinary_term",
        explanation: term.explanation,
        example: term.example,
        frequency: 1
      });
    });

    (result.vocabulary ?? []).forEach((item) => {
      addLexiconItem(map, {
        record,
        text: item.word,
        translation: item.translation,
        category: item.category ?? "academic_expression",
        explanation: item.explanation,
        example: item.example,
        phraseType: item.phraseType,
        frequency: item.frequency ?? 1
      });
    });
  });

  return Array.from(map.values()).map((entry) => ({
    ...entry,
    sourceRecordIds: Array.from(entry.sourceRecordIds),
    sourceTitles: Array.from(entry.sourceTitles),
    examples: Array.from(entry.examples),
    tags: Array.from(entry.tags)
  }));
}

export function filterLexiconEntries(
  entries: LexiconEntry[],
  filter: LexiconFilter
) {
  if (filter === "all") return entries;
  return entries.filter((entry) => entry.category === filter);
}

export function sortLexiconEntries(entries: LexiconEntry[], sort: LexiconSort) {
  return [...entries].sort((a, b) => {
    if (sort === "frequency") {
      return (
        b.frequency - a.frequency ||
        b.recordCount - a.recordCount ||
        compareDateDesc(a.lastSeenAt, b.lastSeenAt)
      );
    }

    if (sort === "recent") {
      return (
        compareDateDesc(a.lastSeenAt, b.lastSeenAt) ||
        b.recordCount - a.recordCount ||
        b.frequency - a.frequency
      );
    }

    return (
      b.recordCount - a.recordCount ||
      b.frequency - a.frequency ||
      compareDateDesc(a.lastSeenAt, b.lastSeenAt)
    );
  });
}

export function getRecordLexiconStats(record: ReadingRecord) {
  const terms = record.analysisResult?.terms?.length ?? 0;
  const vocabulary = record.analysisResult?.vocabulary?.length ?? 0;

  return { terms, vocabulary };
}

function addLexiconItem(
  map: Map<string, LexiconDraft>,
  input: {
    record: ReadingRecord;
    text: string;
    translation: string;
    category: VocabularyCategory;
    explanation?: string;
    example?: string;
    phraseType?: VocabularyPhraseType;
    frequency?: number;
  }
) {
  const text = normalizeDisplayText(input.text);
  if (!text) return;

  const key = `${input.category}:${normalizeLexiconKey(text)}`;
  const existing = map.get(key);
  const frequency = Math.max(1, Math.round(input.frequency ?? 1));

  if (!existing) {
    map.set(key, {
      key,
      text,
      translation: input.translation,
      category: input.category,
      explanation: input.explanation,
      phraseType: input.phraseType,
      frequency,
      recordCount: 1,
      sourceRecordIds: new Set([input.record.id]),
      sourceTitles: new Set([input.record.title || "Untitled Reading"]),
      examples: new Set(input.example ? [input.example] : []),
      firstSeenAt: input.record.createdAt,
      lastSeenAt: input.record.updatedAt,
      tags: new Set(input.record.tags)
    });
    return;
  }

  const hadRecord = existing.sourceRecordIds.has(input.record.id);
  existing.sourceRecordIds.add(input.record.id);
  existing.sourceTitles.add(input.record.title || "Untitled Reading");
  input.record.tags.forEach((tag) => existing.tags.add(tag));
  if (input.example) existing.examples.add(input.example);
  if (!existing.translation && input.translation) existing.translation = input.translation;
  if (!existing.explanation && input.explanation) {
    existing.explanation = input.explanation;
  }
  if (!existing.phraseType && input.phraseType) existing.phraseType = input.phraseType;
  existing.frequency += frequency;
  existing.recordCount += hadRecord ? 0 : 1;
  existing.firstSeenAt = earliestDate(existing.firstSeenAt, input.record.createdAt);
  existing.lastSeenAt = latestDate(existing.lastSeenAt, input.record.updatedAt);
}

function isVocabularyPhraseType(
  value: string | undefined
): value is VocabularyPhraseType {
  return (
    value === "verb" ||
    value === "noun_phrase" ||
    value === "adjective" ||
    value === "adverb" ||
    value === "collocation" ||
    value === "transition" ||
    value === "other"
  );
}

function normalizeDisplayText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeLexiconKey(value: string) {
  return normalizeDisplayText(value).toLowerCase();
}

function compareDateDesc(a?: string, b?: string) {
  return getTime(b) - getTime(a);
}

function latestDate(a?: string, b?: string) {
  return getTime(a) >= getTime(b) ? a : b;
}

function earliestDate(a?: string, b?: string) {
  if (!a) return b;
  if (!b) return a;
  return getTime(a) <= getTime(b) ? a : b;
}

function getTime(value?: string) {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}
