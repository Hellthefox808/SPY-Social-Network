# SocialGraph Atlas • System Design Document

## 1. Core Principles

- **Loose Coupling & High Cohesion**: Components communicate via typed interfaces (`ISocialAdapter`, `GeocodeResult`).
- **Resilience & Graceful Degradation**: External API failures automatically fall back to mock adapters or static spatial heuristics without crashing user requests.
- **Traceability**: Every output coordinate, entity edge, and extracted metadata attribute links directly to a raw `EvidenceItem`.

---

## 2. Component Specifications

### 2.1 Job Pipeline Engine (`src/lib/services/JobService.ts`)

- **Queueing**: Asynchronous background job creation with status transitions.
- **Metrics**: Captures `fetchMs`, `geocodeMs`, `transformMs`, `totalMs`, and entity counts in `JobMetrics`.
- **Transactions**: Atomic persistence of `Profile`, `Entity`, `Location`, `Edge`, and `EvidenceItem` records.

### 2.2 Geocoding Engine (`src/lib/services/GeoService.ts`)

- **Tier 1**: Memory Cache (Instant lookup for repeated locations).
- **Tier 2**: Tech Hubs Dictionary (20+ global tech regions pre-configured).
- **Tier 3**: OpenStreetMap Nominatim API (4-second abort timeout, backoff retry).

---

## 3. Data Integrity & Indexing Strategy

- **Indices**:
  - `AnalysisJob(status, createdAt, detectedPlatform)`
  - `Profile(jobId, handle)`
  - `Entity(jobId, entityType)`
  - `Location(jobId, locationType, confidence)`
  - `Edge(jobId, relationType)`
  - `AuditLog(userId, action, createdAt)`
