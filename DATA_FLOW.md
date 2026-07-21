# SocialGraph Atlas • Data Flow Specification

## Request Lifecycle & Data Pipeline

```
[ User Input ]
      |
      v
[ Frontend Form Validation (Zod / Next.js) ]
      |
      v
[ HTTP POST /api/analyze ]
      |
      +---> Rate Limiter Check (30 req / min)
      |
      +---> Generate X-Correlation-ID
      |
      v
[ JobService.createJob() ]
      |
      +---> Writes AnalysisJob (status: PENDING)
      |
      +---> Triggers Async Process Pipeline (202 Accepted)
      |
      v
[ JobService.processJob() ]
      |
      +---> 1. Update status to RUNNING
      |
      +---> 2. Select Platform Adapter (GitHub / Reddit / Web)
      |
      +---> 3. Extract Raw Metadata & Connections
      |
      +---> 4. Geocode Location Text (GeoService Cache / Nominatim)
      |
      +---> 5. Calculate Confidence Scores (0.0 to 1.0)
      |
      +---> 6. Execute DB Transaction (Profile, Entity, Location, Edge, Evidence)
      |
      +---> 7. Write JobMetrics (Timing & Entity Counts)
      |
      +---> 8. Update status to COMPLETED
      |
      v
[ Frontend Client Polling (2000ms interval) ]
      |
      v
[ HTTP GET /api/analyze?jobId={id} ]
      |
      v
[ Render Dashboard: Overview, Map, Network Graph, Evidence Logs ]
```
