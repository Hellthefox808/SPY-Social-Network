import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const correlationId = req.headers.get("x-correlation-id") || `req-${Date.now()}`;
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
    const offset = Math.max(0, parseInt(searchParams.get("offset") || "0", 10));
    const statusFilter = searchParams.get("status");

    const whereClause: Record<string, unknown> = {};
    if (statusFilter) {
      whereClause.status = statusFilter;
    }

    const jobs = await db.analysisJob.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        profiles: true,
        metrics: true,
      },
    });

    return NextResponse.json(jobs, {
      headers: { "X-Correlation-ID": correlationId, "Cache-Control": "private, max-age=10" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    logger.error("API Reports GET error", {}, correlationId, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const correlationId = req.headers.get("x-correlation-id") || `req-${Date.now()}`;
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await db.analysisJob.delete({
      where: { id },
    });

    // Record AuditLog
    await db.auditLog.create({
      data: {
        action: "DELETE_REPORT",
        resource: id,
        details: `Deleted AnalysisJob report ${id}`,
      },
    });

    return NextResponse.json({ success: true }, { headers: { "X-Correlation-ID": correlationId } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    logger.error("API Reports DELETE error", {}, correlationId, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
