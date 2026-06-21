import { NextResponse } from "next/server";
import { analyzeAcademicText } from "@/lib/ai";

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

    const result = await analyzeAcademicText({
      title: body.title?.trim() || "Untitled Reading",
      tags: Array.isArray(body.tags) ? body.tags : [],
      text: body.text
    });

    return NextResponse.json({ result, source: "mock" });
  } catch {
    return NextResponse.json(
      { error: "解析失败，请检查 API 配置或稍后重试" },
      { status: 500 }
    );
  }
}
