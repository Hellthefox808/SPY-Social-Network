import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const checks: Record<string, { status: string; latencyMs?: number }> = {};
  let healthy = true;

  // 1. Database connectivity
  const dbStart = Date.now();
  try {
    await db.$queryRaw`SELECT 1`;
    checks.database = { status: "ok", latencyMs: Date.now() - dbStart };
  } catch (err) {
    healthy = false;
    checks.database = { status: "error", latencyMs: Date.now() - dbStart };
  }

  // 2. Job count
  try {
    const jobCount = await db.analysisJob.count();
    checks.jobs = { status: "ok", latencyMs: jobCount };
  } catch {
    checks.jobs = { status: "error" };
  }

  return NextResponse.json(
    {
      status: healthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      checks,
    },
    {
      status: healthy ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
