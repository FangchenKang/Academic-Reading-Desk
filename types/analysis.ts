export type ReadingMode = "english" | "bilingual" | "chinese";

export type AnalysisResult = {
  title: string;
  tags: string[];
  terms: {
    term: string;
    translation: string;
    explanation?: string;
    example?: string;
  }[];
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
