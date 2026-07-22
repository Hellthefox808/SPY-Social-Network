import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const correlationId = req.headers.get("x-correlation-id") || `req-${Date.now()}`;
  const start = Date.now();

  try {
    const { searchParams } = new URL(req.url);
    const days = Math.min(90, Math.max(1, parseInt(searchParams.get("days") || "30", 10)));

    const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Run all aggregations in parallel
    const [
      totalJobs,
      jobsByStatus,
      jobsByPlatform,
      recentJobs,
      jobsByDay,
      avgMetrics,
      topLocations,
      auditActivity,
      totalProfiles,
      totalEntities,
    ] = await Promise.all([
      // 1. Total job count
      db.analysisJob.count(),

      // 2. Jobs grouped by status
      db.analysisJob.groupBy({
        by: ["status"],
        _count: { id: true },
      }),

      // 3. Jobs grouped by detected platform
      db.analysisJob.groupBy({
        by: ["detectedPlatform"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),

      // 4. Recent jobs (within time window)
      db.analysisJob.findMany({
        where: { createdAt: { gte: sinceDate } },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          inputUrl: true,
          detectedPlatform: true,
          status: true,
          createdAt: true,
          errorMessage: true,
        },
      }),

      // 5. Jobs by day for trend chart
      db.$queryRawUnsafe<Array<{ day: string; count: bigint }>>(
        `SELECT DATE(createdAt) as day, COUNT(*) as count
         FROM AnalysisJob
         WHERE createdAt >= ?
         GROUP BY DATE(createdAt)
         ORDER BY day ASC`,
        sinceDate.toISOString()
      ),

      // 6. Average performance metrics
      db.jobMetrics.aggregate({
        _avg: {
          fetchMs: true,
          geocodeMs: true,
          transformMs: true,
          totalMs: true,
          retryCount: true,
          entitiesCount: true,
          locationsCount: true,
          edgesCount: true,
        },
        _count: { id: true },
      }),

      // 7. Top location labels
      db.location.groupBy({
        by: ["label"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 10,
      }),

      // 8. Recent audit log activity
      db.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          action: true,
          resource: true,
          createdAt: true,
        },
      }),

      // 9. Total profiles captured
      db.profile.count(),

      // 10. Total entities discovered
      db.entity.count(),
    ]);

    // Compute derived stats
    const completedJobs = jobsByStatus.find((j) => j.status === "COMPLETED")?._count.id ?? 0;
    const failedJobs = jobsByStatus.find((j) => j.status === "FAILED")?._count.id ?? 0;
    const pendingJobs = jobsByStatus.find((j) => j.status === "PENDING")?._count.id ?? 0;
    const runningJobs = jobsByStatus.find((j) => j.status === "RUNNING")?._count.id ?? 0;
    const errorRate = totalJobs > 0 ? parseFloat(((failedJobs / totalJobs) * 100).toFixed(1)) : 0;
    const successRate = totalJobs > 0 ? parseFloat(((completedJobs / totalJobs) * 100).toFixed(1)) : 0;

    // Format jobs-by-day for chart consumption
    const dailyTrend = (jobsByDay as Array<{ day: string; count: bigint }>).map((row) => ({
      date: row.day,
      count: Number(row.count),
    }));

    // Format platform breakdown
    const platformBreakdown = jobsByPlatform.map((p) => ({
      platform: p.detectedPlatform,
      count: p._count.id,
    }));

    // Format status breakdown
    const statusBreakdown = [
      { status: "COMPLETED", count: completedJobs },
      { status: "FAILED", count: failedJobs },
      { status: "PENDING", count: pendingJobs },
      { status: "RUNNING", count: runningJobs },
    ];

    // Format top locations
    const topLocationLabels = topLocations.map((loc) => ({
      label: loc.label,
      count: loc._count.id,
    }));

    const response = {
      summary: {
        totalJobs,
        totalProfiles,
        totalEntities,
        completedJobs,
        failedJobs,
        pendingJobs,
        runningJobs,
        errorRate,
        successRate,
        timeWindowDays: days,
      },
      platformBreakdown,
      statusBreakdown,
      performance: {
        metricsCount: avgMetrics._count.id,
        averages: {
          fetchMs: Math.round(avgMetrics._avg.fetchMs ?? 0),
          geocodeMs: Math.round(avgMetrics._avg.geocodeMs ?? 0),
          transformMs: Math.round(avgMetrics._avg.transformMs ?? 0),
          totalMs: Math.round(avgMetrics._avg.totalMs ?? 0),
          retryCount: parseFloat((avgMetrics._avg.retryCount ?? 0).toFixed(1)),
          entitiesPerJob: parseFloat((avgMetrics._avg.entitiesCount ?? 0).toFixed(1)),
          locationsPerJob: parseFloat((avgMetrics._avg.locationsCount ?? 0).toFixed(1)),
          edgesPerJob: parseFloat((avgMetrics._avg.edgesCount ?? 0).toFixed(1)),
        },
      },
      trends: {
        daily: dailyTrend,
      },
      topLocations: topLocationLabels,
      recentActivity: recentJobs,
      auditLog: auditActivity,
      meta: {
        correlationId,
        latencyMs: Date.now() - start,
        generatedAt: new Date().toISOString(),
      },
    };

    return NextResponse.json(response, {
      headers: {
        "X-Correlation-ID": correlationId,
        "Cache-Control": "private, max-age=30",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    logger.error("API Analytics GET error", {}, correlationId, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
