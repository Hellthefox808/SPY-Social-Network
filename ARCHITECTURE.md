# SocialGraph Atlas • Enterprise Architecture Specification

## Overview
SocialGraph Atlas is an enterprise-grade OSINT (Open Source Intelligence) SaaS platform designed for high-concurrency profile extraction, geographical intelligence scoring, network graph visualization, and AI entity resolution.

---

## System Architecture Diagram

```
                                +-------------------+
                                |   Client Browser  |
                                | (React 19/Next 15)|
                                +---------+---------+
                                          |
                                    HTTP / REST
                                          |
                                          v
                                +-------------------+
                                | Edge Middleware   |
                                | Security Headers  |
                                | Correlation IDs   |
                                +---------+---------+
                                          |
                                          v
                                +-------------------+
                                |    API Controllers |
                                |  (Zod Validation)  |
                                +---------+---------+
                                          |
             +----------------------------+----------------------------+
             |                                                         |
             v                                                         v
   +--------------------+                                    +--------------------+
   |  JobService Engine |                                    |  AI Orchestrator   |
   | (State Management) |                                    | Context & Extract  |
   +---------+----------+                                    +---------+----------+
             |                                                         |
             +----------------------------+----------------------------+
                                          |
                                          v
                     +--------------------+--------------------+
                     |                                         |
                     v                                         v
          +--------------------+                     +--------------------+
          |  Adapter Registry  |                     |   GeoService       |
          | GitHub/Reddit/Web  |                     | OSM Nominatim/Hubs |
          +---------+----------+                     +---------+----------+
                    |                                          |
                    +--------------------+---------------------+
                                         |
                                         v
                               +-------------------+
                               |  Database Layer   |
                               | SQLite / Postgres |
                               +-------------------+
```

---

## Architectural Layers

1. **Presentation Layer (`src/app`, `src/components`)**:
   - Built on Next.js 15 App Router & React 19.
   - Interactive visual components: MapLibre GL for geolocation mapping, custom SVG force-directed network simulations, evidence logs.

2. **Middleware & Security (`src/middleware.ts`, `src/lib/rateLimiter.ts`)**:
   - Request correlation tracking via `X-Correlation-ID`.
   - Security header injection (`CSP`, `HSTS`, `X-Frame-Options`).
   - Sliding-window IP rate limiting.

3. **Domain Service Layer (`src/lib/services/`)**:
   - **`JobService`**: Manages transactional analysis job lifecycles (`PENDING` -> `RUNNING` -> `COMPLETED`/`FAILED`) and execution metrics (`JobMetrics`).
   - **`GeoService`**: High-performance geocoding service with local tech hubs lookup, memory caching, and Nominatim API fallback.
   - **`AdapterService`**: Extensible registry pattern for platform scrapers & API integrations.

4. **AI Orchestration Layer (`src/lib/ai/`)**:
   - Context payload minimization to prevent token bloat.
   - Structured JSON output parsing and fallback handling.

5. **Persistence Layer (`prisma/schema.prisma`)**:
   - Unified relational schema indexed for high-volume lookup queries.
   - Support for SQLite (local dev) and PostgreSQL (production).
