import { db } from "@/lib/db";
import { getAdapterForUrl, detectPlatform } from "@/lib/adapters/registry";
import { geoService } from "@/lib/services/GeoService";
import { getConfidenceScore } from "@/lib/geo/scorer";
import { logger } from "@/lib/logger";

interface SourceFetchResult {
  provider: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  durationMs?: number;
  errorMessage?: string;
  recordsCount?: number;
}

export class JobService {
  private readonly MAX_RETRIES = 3;

  /**
   * Calculates exponential backoff delay: n^2 seconds (1s, 4s, 9s)
   */
  private getBackoffMs(attempt: number): number {
    return Math.pow(attempt, 2) * 1000;
  }

  /**
   * Creates a new analysis job record and triggers async processing.
   */
  public async createJob(url: string, correlationId: string = "job-create"): Promise<string> {
    const normalizedUrl = this.normalizeUrl(url);
    const platform = detectPlatform(normalizedUrl);

    logger.info("Creating new AnalysisJob", { url, normalizedUrl, platform }, correlationId);

    const job = await db.analysisJob.create({
      data: {
        inputUrl: url,
        normalizedUrl,
        detectedPlatform: platform,
        status: "PENDING",
      },
    });

    return job.id;
  }

  /**
   * Executes the full OSINT extraction pipeline for a given job.
   * Includes retry with exponential backoff (3 attempts: 1s, 4s, 9s delays).
   */
  public async processJob(jobId: string, correlationId: string = "job-process"): Promise<void> {
    const startTime = Date.now();
    let fetchMs = 0;
    let geocodeMs = 0;
    let transformMs = 0;
    let retryCount = 0;

    const sourceResults: SourceFetchResult[] = [];

    try {
      // 1. Set job to RUNNING
      const job = await db.analysisJob.update({
        where: { id: jobId },
        data: { status: "RUNNING" },
      });

      logger.info(`Starting execution for job ${jobId}`, { platform: job.detectedPlatform }, correlationId);

      // 2. Fetch platform data with retry + exponential backoff
      const fetchStart = Date.now();
      const adapter = getAdapterForUrl(job.normalizedUrl);

      sourceResults.push({
        provider: adapter.platform,
        status: "in_progress",
      });

      let data;
      let lastAdapterError: unknown;

      for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
        try {
          data = await adapter.analyze(job.normalizedUrl);
          lastAdapterError = undefined;
          break; // Success, exit retry loop
        } catch (adapterErr) {
          lastAdapterError = adapterErr;
          retryCount = attempt;
          const retryDelay = this.getBackoffMs(attempt);
          logger.warn(
            `Adapter ${adapter.platform} attempt ${attempt}/${this.MAX_RETRIES} failed. Retrying in ${retryDelay}ms...`,
            { jobId, attempt },
            correlationId,
            adapterErr
          );

          if (attempt < this.MAX_RETRIES) {
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
          }
        }
      }

      if (!data) {
        const errMsg = lastAdapterError instanceof Error ? lastAdapterError.message : "Unknown adapter error";
        sourceResults[sourceResults.length - 1] = {
          ...sourceResults[sourceResults.length - 1],
          status: "failed",
          errorMessage: errMsg,
          durationMs: Date.now() - fetchStart,
        };
        throw new Error(`Data extraction failed for ${job.normalizedUrl} after ${retryCount} retries: ${errMsg}`);
      }

      fetchMs = Date.now() - fetchStart;
      sourceResults[sourceResults.length - 1] = {
        provider: adapter.platform,
        status: "completed",
        durationMs: fetchMs,
        recordsCount: (data.connections?.length || 0) + (data.locations?.length || 0) + (data.evidence?.length || 0),
      };

      // 3. Geocode location items with per-location error isolation
      const geoStart = Date.now();
      sourceResults.push({ provider: "geo-service", status: "in_progress" });

      const geocodedLocations = await Promise.all(
        data.locations.map(async (loc) => {
          let resolvedLat = loc.lat;
          let resolvedLng = loc.lng;
          let city = loc.city;
          let country = loc.country;
          let state = loc.state;

          // Only geocode if coordinates are missing (lat=0, lng=0) but we have text
          if (loc.lat === 0 && loc.lng === 0 && loc.label) {
            try {
              const geoRes = await geoService.geocode(loc.label, correlationId);
              resolvedLat = geoRes.lat;
              resolvedLng = geoRes.lng;
              city = geoRes.city || city;
              country = geoRes.country || country;
              state = geoRes.state || state;
            } catch (geoErr) {
              // Isolate geocode failure — use placeholder coords instead of failing the entire job
              logger.warn(`Geocode failed for "${loc.label}", using placeholder`, { jobId }, correlationId, geoErr);
              resolvedLat = 0;
              resolvedLng = 0;
            }
          }

          const score = getConfidenceScore(loc.type);

          return {
            label: loc.label,
            city,
            state,
            country,
            lat: resolvedLat,
            lng: resolvedLng,
            locationType: loc.type,
            confidence: score,
            sourceUrl: loc.sourceUrl,
            evidenceText: loc.evidence || "",
          };
        })
      );
      geocodeMs = Date.now() - geoStart;
      sourceResults[sourceResults.length - 1] = {
        provider: "geo-service",
        status: "completed",
        durationMs: geocodeMs,
        recordsCount: geocodedLocations.length,
      };

      // 4. Persist data inside DB Transaction
      const txStart = Date.now();
      sourceResults.push({ provider: "database-write", status: "in_progress" });

      let entitiesCount = 0;
      let locationsCount = 0;
      let edgesCount = 0;

      await db.$transaction(async (tx) => {
        // Create Profile
        await tx.profile.create({
          data: {
            jobId,
            platform: data.platform,
            handle: data.profile.handle || "",
            displayName: data.profile.name || "",
            avatarUrl: data.profile.avatar || "",
            bio: data.profile.bio || "",
            website: data.profile.website || "",
            followersCount: data.profile.followers || null,
            followingCount: data.profile.following || null,
            postsCount: data.profile.posts || null,
            locationText: data.profile.location || "",
            sourceUrl: data.profile.url,
          },
        });

        const entityMap: Record<string, string> = {};

        // Primary entity
        const primaryEntity = await tx.entity.create({
          data: {
            jobId,
            entityType: "account",
            name: data.profile.handle || data.profile.name || "Main Profile",
            platform: data.platform,
            externalUrl: data.profile.url,
            confidence: 1.0,
          },
        });
        entityMap["primary"] = primaryEntity.id;
        entitiesCount++;

        // Connections
        for (const conn of data.connections) {
          const ent = await tx.entity.create({
            data: {
              jobId,
              entityType: conn.relationType.includes("company") ? "company" : "account",
              name: conn.name,
              platform: conn.platform || data.platform,
              externalUrl: conn.sourceUrl,
              confidence: conn.confidence,
            },
          });
          entityMap[conn.id] = ent.id;
          entitiesCount++;

          if (typeof conn.lat === "number" && typeof conn.lng === "number" && (conn.lat !== 0 || conn.lng !== 0)) {
            await tx.location.create({
              data: {
                jobId,
                entityId: ent.id,
                label: conn.location || conn.name,
                lat: conn.lat,
                lng: conn.lng,
                locationType: "inferred",
                confidence: conn.confidence,
                sourceUrl: conn.sourceUrl,
                evidenceText: conn.evidence || `Discovered connection: "${conn.name}"`,
              },
            });
            locationsCount++;
          } else if (conn.location) {
            try {
              const geoRes = await geoService.geocode(conn.location, correlationId);
              if (geoRes.lat !== 0 || geoRes.lng !== 0) {
                await tx.location.create({
                  data: {
                    jobId,
                    entityId: ent.id,
                    label: conn.location,
                    city: geoRes.city || null,
                    state: geoRes.state || null,
                    country: geoRes.country || null,
                    lat: geoRes.lat,
                    lng: geoRes.lng,
                    locationType: "inferred",
                    confidence: conn.confidence * 0.8,
                    sourceUrl: conn.sourceUrl,
                    evidenceText: conn.evidence || `Geocoded connection: "${conn.location}"`,
                  },
                });
                locationsCount++;
              }
            } catch (geoErr) {
              logger.warn(`Connection geocode failed for "${conn.location}", skipping location`, { jobId }, correlationId, geoErr);
            }
          }
        }

        // Primary Locations
        for (const loc of geocodedLocations) {
          await tx.location.create({
            data: {
              jobId,
              entityId: primaryEntity.id,
              label: loc.label,
              city: loc.city || null,
              state: loc.state || null,
              country: loc.country || null,
              lat: loc.lat,
              lng: loc.lng,
              locationType: loc.locationType,
              confidence: loc.confidence,
              sourceUrl: loc.sourceUrl,
              evidenceText: loc.evidenceText,
            },
          });
          locationsCount++;
        }

        // Edges
        for (const conn of data.connections) {
          const targetEntityId = entityMap[conn.id];
          if (targetEntityId) {
            await tx.edge.create({
              data: {
                jobId,
                sourceEntityId: primaryEntity.id,
                targetEntityId,
                relationType: conn.relationType,
                weight: conn.relationType === "collaborated" ? 0.9 : 0.7,
                confidence: conn.confidence,
                sourceUrl: conn.sourceUrl,
                evidenceText: conn.evidence || "",
              },
            });
            edgesCount++;
          }
        }

        // Evidence items
        for (const ev of data.evidence) {
          await tx.evidenceItem.create({
            data: {
              jobId,
              evidenceType: ev.type,
              sourceUrl: ev.sourceUrl,
              snippet: ev.snippet || "",
              extractionMethod: ev.type === "API" ? "Official API Fetch" : "Metadata / Heuristics Extraction",
              confidence: ev.confidence,
            },
          });
        }
      });

      transformMs = Date.now() - txStart;
      sourceResults[sourceResults.length - 1] = {
        provider: "database-write",
        status: "completed",
        durationMs: transformMs,
        recordsCount: entitiesCount + locationsCount + edgesCount,
      };

      const totalMs = Date.now() - startTime;

      // Update job to COMPLETED & record JobMetrics (with source attribution & retry count)
      await db.analysisJob.update({
        where: { id: jobId },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });

      await db.jobMetrics.create({
        data: {
          jobId,
          fetchMs,
          geocodeMs,
          transformMs,
          totalMs,
          retryCount,
          entitiesCount,
          locationsCount,
          edgesCount,
        },
      });

      logger.info(`Job ${jobId} completed successfully in ${totalMs}ms (${retryCount} retries)`, { totalMs, fetchMs, geocodeMs, transformMs, retryCount }, correlationId);

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error occurred.";
      logger.error(`Job ${jobId} failed after ${retryCount} retries`, { jobId, retryCount }, correlationId, err);

      await db.analysisJob.update({
        where: { id: jobId },
        data: {
          status: "FAILED",
          errorMessage: message,
          completedAt: new Date(),
        },
      });

      // Even on failure, record metrics so we can track error rates
      try {
        await db.jobMetrics.create({
          data: {
            jobId,
            fetchMs,
            geocodeMs,
            transformMs,
            totalMs: Date.now() - startTime,
            retryCount,
          },
        });
      } catch {
        // Ignore metrics write error — job already marked as failed
      }
    }
  }

  public normalizeUrl(url: string): string {
    let clean = url.trim();
    if (!/^https?:\/\//i.test(clean)) {
      clean = "https://" + clean;
    }
    try {
      const parsed = new URL(clean);
      return parsed.href;
    } catch {
      return clean;
    }
  }
}

export const jobService = new JobService();
