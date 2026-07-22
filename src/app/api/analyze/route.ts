import { NextRequest, NextResponse, after } from "next/server";
import { z } from "zod";
import { jobService } from "@/lib/services/JobService";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rateLimiter";
import { logger } from "@/lib/logger";
import { getAdapterForUrl } from "@/lib/adapters/registry";
import { getSession } from "@/lib/session";

const analyzeSchema = z.object({
  url: z.string().min(1, "URL is required"),
});

export async function POST(req: NextRequest) {
  const correlationId = req.headers.get("x-correlation-id") || `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const clientIp = req.headers.get("x-forwarded-for") || "client-ip";

  // Rate Limiting Check
  const rl = checkRateLimit(`analyze-post:${clientIp}`, 30, 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, error: "Rate limit exceeded. Please try again later.", meta: { resetMs: rl.resetMs } },
      { status: 429, headers: { "X-Correlation-ID": correlationId } }
    );
  }

  try {
    const body = await req.json();
    const parsed = analyzeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid input URL" },
        { status: 400, headers: { "X-Correlation-ID": correlationId } }
      );
    }

    const normalizedUrl = jobService.normalizeUrl(parsed.data.url);
    const adapter = getAdapterForUrl(normalizedUrl);

    const jobId = await jobService.createJob(parsed.data.url, correlationId);

    // ── Usage Tracking: log to AuditLog ──────────────────────────────
    try {
      const session = await getSession();
      const userId = session?.userId ? String(session.userId) : null;
      await db.auditLog.create({
        data: {
          userId,
          action: "ANALYZE_URL",
          resource: parsed.data.url,
          details: JSON.stringify({
            platform: adapter.platform,
            provider: adapter.provider,
            jobId,
            normalizedUrl,
          }),
          ipAddress: clientIp,
        },
      });
    } catch (auditErr) {
      // Audit failure must never break the main flow
      logger.warn("Failed to write audit log for analyze", {}, correlationId, auditErr);
    }

    after(() => {
      jobService.processJob(jobId, correlationId).catch((err) => {
        logger.error(`Background job execution failed for job ${jobId}`, {}, correlationId, err);
      });
    });

    // Return source attribution even during PENDING state so the dashboard shows the provider
    return NextResponse.json(
      {
        success: true,
        data: {
          jobId,
          status: "PENDING",
          sourceProvider: adapter.provider,
          detectedPlatform: adapter.platform,
        },
        meta: { correlationId },
      },
      { status: 202, headers: { "X-Correlation-ID": correlationId } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    logger.error("API Analyze POST error", {}, correlationId, err);
    return NextResponse.json(
      { success: false, error: message, meta: { correlationId } },
      { status: 500, headers: { "X-Correlation-ID": correlationId } }
    );
  }
}

export async function GET(req: NextRequest) {
  const correlationId = req.headers.get("x-correlation-id") || `req-${Date.now()}`;
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: "jobId is required" },
        { status: 400, headers: { "X-Correlation-ID": correlationId } }
      );
    }

    const job = await db.analysisJob.findUnique({
      where: { id: jobId },
      include: {
        profiles: true,
        entities: true,
        locations: true,
        edges: true,
        evidenceItems: {
          orderBy: { createdAt: "desc" },
        },
        metrics: true,
      },
    });

    if (!job) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404, headers: { "X-Correlation-ID": correlationId } }
      );
    }

    // Build source attribution metadata for the frontend
    const sourceMetadata = {
      provider: job.metrics?.retryCount ? (job.metrics.retryCount > 0 ? "recovered-via-retry" : "direct-fetch") : "pending",
      retryCount: job.metrics?.retryCount || 0,
      fetchLatencyMs: job.metrics?.fetchMs || null,
      geocodeLatencyMs: job.metrics?.geocodeMs || null,
      databaseLatencyMs: job.metrics?.transformMs || null,
      totalLatencyMs: job.metrics?.totalMs || null,
      entitiesCount: job.metrics?.entitiesCount || 0,
      locationsCount: job.metrics?.locationsCount || 0,
      edgesCount: job.metrics?.edgesCount || 0,
    };

    // Enrich response with source attribution (backward compatible)
    const enrichedJob = {
      ...job,
      _source: sourceMetadata,
    };

    return NextResponse.json(enrichedJob, {
      headers: { "X-Correlation-ID": correlationId, "Cache-Control": "no-store" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    logger.error("API Analyze GET error", {}, correlationId, err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500, headers: { "X-Correlation-ID": correlationId } }
    );
  }
}
