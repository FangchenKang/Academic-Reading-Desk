import { NextResponse } from "next/server";
import { syncRecordToGithub } from "@/lib/github";
import type { ReadingRecord } from "@/types/analysis";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { record?: ReadingRecord };

    if (!body.record?.id) {
      return NextResponse.json(
        { ok: false, error: "缺少需要同步的学习记录" },
        { status: 400 }
      );
    }

    const result = await syncRecordToGithub(body.record);
    return NextResponse.json({ ok: true, path: result.path });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "GitHub 同步失败，请稍后重试";

    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
