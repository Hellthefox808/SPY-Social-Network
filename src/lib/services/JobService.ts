import { db } from "@/lib/db";
import { getAdapterForUrl, detectPlatform } from "@/lib/adapters/registry";
import { geoService } from "@/lib/services/GeoService";
import { getConfidenceScore } from "@/lib/geo/scorer";
import { logger } from "@/lib/logger";

export class JobService {
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
   */
  public async processJob(jobId: string, correlationId: string = "job-process"): Promise<void> {
    const startTime = Date.now();
    let fetchMs = 0;
    let geocodeMs = 0;
    let transformMs = 0;

    try {
      // 1. Set job to RUNNING
      const job = await db.analysisJob.update({
        where: { id: jobId },
        data: { status: "RUNNING" },
      });

      logger.info(`Starting execution for job ${jobId}`, { platform: job.detectedPlatform }, correlationId);

      // 2. Fetch platform data
      const fetchStart = Date.now();
      const adapter = getAdapterForUrl(job.normalizedUrl);
      let data;

      try {
        data = await adapter.analyze(job.normalizedUrl);
      } catch (adapterErr) {
        logger.error(`Primary adapter ${adapter.platform} failed. Failing job.`, { jobId }, correlationId, adapterErr);
        throw new Error(`Data extraction failed for ${job.normalizedUrl}`);
      }
      fetchMs = Date.now() - fetchStart;

      // 3. Geocode location items
      const geoStart = Date.now();
      const geocodedLocations = await Promise.all(
        data.locations.map(async (loc) => {
          let resolvedLat = loc.lat;
          let resolvedLng = loc.lng;
          let city = loc.city;
          let country = loc.country;
          let state = loc.state;

          if (loc.lat === 0 && loc.lng === 0 && loc.label) {
            const geoRes = await geoService.geocode(loc.label, correlationId);
            resolvedLat = geoRes.lat;
            resolvedLng = geoRes.lng;
            city = geoRes.city || city;
            country = geoRes.country || country;
            state = geoRes.state || state;
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

      // 4. Persist data inside DB Transaction
      const txStart = Date.now();
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
          }
        }

        // Locations
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

      const totalMs = Date.now() - startTime;

      // Update job to COMPLETED & record JobMetrics
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
          entitiesCount,
          locationsCount,
          edgesCount,
        },
      });

      logger.info(`Job ${jobId} completed successfully in ${totalMs}ms`, { totalMs, fetchMs, geocodeMs, transformMs }, correlationId);

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error occurred.";
      logger.error(`Job ${jobId} failed`, { jobId }, correlationId, err);

      await db.analysisJob.update({
        where: { id: jobId },
        data: {
          status: "FAILED",
          errorMessage: message,
          completedAt: new Date(),
        },
      });
    }
  }

  private normalizeUrl(url: string): string {
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
