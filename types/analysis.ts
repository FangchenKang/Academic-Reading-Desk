export type ReadingMode = "english" | "bilingual" | "chinese";

export type VocabularyCategory =
  | "disciplinary_term"
  | "academic_expression"
  | "general_vocabulary";

export type VocabularyPhraseType =
  | "verb"
  | "noun_phrase"
  | "adjective"
  | "adverb"
  | "collocation"
  | "transition"
  | "other";

export type VocabularyItem = {
  word: string;
  translation: string;
  category: VocabularyCategory;
  explanation?: string;
  example?: string;
  phraseType?: VocabularyPhraseType;
  frequency?: number;
};

export type AnalysisResult = {
  title: string;
  tags: string[];
  terms: {
    term: string;
    translation: string;
    explanation?: string;
    example?: string;
  }[];
  vocabulary?: VocabularyItem[];
  patterns: {
    type: string;
    description: string;
    example: string;
    reusableTemplate?: string;
  }[];
  bilingual: {
    en: string;
    zh: string;
  }[];
  note: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
};

export type AnalysisErrorState = {
  title: string;
  message: string;
  code?: string;
  status?: number;
};

export type ReadingRecord = {
  id: string;
  title: string;
  citation: string;
  tags: string[];
  originalText: string;
  analysisResult: AnalysisResult | null;
  createdAt: string;
  updatedAt: string;
  syncedToGithub?: boolean;
  githubPath?: string;
};

export type SaveStatus = "idle" | "saving" | "saved" | "error";
