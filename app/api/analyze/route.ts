import { NextResponse } from "next/server";
import { analyzeAcademicText, hasConfiguredAiKey } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      title?: string;
      tags?: string[];
      text?: string;
    };

    if (!body.text?.trim()) {
      return NextResponse.json(
        { error: "请提供需要解析的英文文本" },
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
    return NextResponse.json(
      { error: "解析失败，请检查 API 配置、校园网或 VPN 连接" },
      { status: 500 }
    );
  }
}
