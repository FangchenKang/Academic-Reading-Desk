import { NextResponse } from "next/server";
import {
  analyzeAcademicText,
  getAiAnalysisErrorPayload,
  hasConfiguredAiKey
} from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      title?: string;
      tags?: string[];
      text?: string;
    };

    if (!body.text?.trim()) {
      return NextResponse.json(
        { error: "请提供需要解析的英文文本", code: "missing_text" },
        { status: 400 }
      );
    }

    const usesRealApi = hasConfiguredAiKey();
    const result = await analyzeAcademicText({
      title: body.title?.trim() || "Untitled Reading",
      tags: Array.isArray(body.tags) ? body.tags : [],
      text: body.text
    });

    return NextResponse.json({ result, source: usesRealApi ? "api" : "mock" });
  } catch (error) {
    console.error("[api/analyze]", error);

    const payload = getAiAnalysisErrorPayload(error);
    const status =
      payload.code === "api_request_failed"
        ? 502
        : payload.code === "unknown"
          ? 500
          : 422;

    return NextResponse.json(
      { ...payload, source: hasConfiguredAiKey() ? "api" : "mock" },
      { status }
    );
  }
}
