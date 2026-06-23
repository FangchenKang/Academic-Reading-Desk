import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    configured: Boolean(
      process.env.GITHUB_TOKEN && process.env.GITHUB_OWNER && process.env.GITHUB_REPO
    )
  });
}
