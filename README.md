# SocialGraph Atlas (SPY Social Network)

> **Enterprise AI Profile Intelligence Cloud, Knowledge Graph Engine & Decision Operating System**

[![Next.js 15](https://img.shields.io/badge/Next.js-15_App_Router-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.20_PostgreSQL-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/Version-0.1.0-emerald?style=flat-square)](package.json)
[![Status](https://img.shields.io/badge/Status-Production--Ready-brightgreen?style=flat-square)](https://github.com/Hellthefox808/SPY-Social-Network)

---

## 1. Project Title

**SocialGraph Atlas** (*SPY Social Network*)  
**Version**: 0.1.0  
**Project Status**: Production-Ready / Stable Release  
**Repository**: [Hellthefox808/SPY-Social-Network](https://github.com/Hellthefox808/SPY-Social-Network)

---

## 2. Executive Summary

### Problem Statement
In modern talent acquisition, growth marketing, and executive intelligence, public profile data across platforms like GitHub, LinkedIn, Naukri.com, and Reddit remains fragmented, noisy, and unverified. Growth leaders and recruiters waste hours manually cross-referencing profiles, estimating skill maturity, and attempting to determine geographic/technical authenticity.

### Target Audience
- **Growth Marketing Teams**: Identify high-converting technical demographic clusters.
- **Talent Acquisition Leaders & Executive Recruiters**: Source verified technical talent with transparent scoring metrics.
- **B2B Intelligence & Sales Engineers**: Validate organization structures and entity linkages across platforms.

### Reason for Existence
SocialGraph Atlas automates profile ingestion, normalizes multi-platform identity signals, extracts entity relationships, geocodes locations, and calculates explainable 10-metric confidence scores—converting raw web data into actionable decision intelligence.

### Key Differentiators
- **Explainable Scoring**: Transparent 0–100 evaluations across 10 distinct dimensions (Technical Depth, Skill Maturity, Network Reach, Geographic Density, Data Confidence, etc.).
- **Multi-Agent Advisory Layer**: Specialized agent roles (`GeoAgent`, `MarketingAgent`, `RecruitmentAgent`, `AuditAgent`) synthesizing contextual ROI recommendations.
- **Knowledge Graph Matrix**: Deep entity relationship mapping across `Person ➔ Company ➔ Skill ➔ Tech Stack ➔ Geography`.
- **Live Geointelligence**: MapLibre GL spatial heatmaps with fallback geocoding tiers.

---

## 3. Project Overview

### Business Purpose
SocialGraph Atlas serves as an enterprise intelligence cloud that bridges public web signal collection with deterministic decision engines, empowering organizations to make data-backed hiring and growth decisions.

### Primary Objectives
1. **Unified Identity Normalization**: Consolidate multi-platform handles (GitHub, Reddit, Websites, LinkedIn) under a single `AnalysisJob` profile.
2. **Transparent Confidence Scoring**: Eliminate black-box scoring by providing full attribution breakdowns for every rating.
3. **Resilient Geocoding**: Resolve non-standard location strings to precise coordinates using a 3-tier fallback engine (Memory Cache $\rightarrow$ Tech Hubs Dictionary $\rightarrow$ Nominatim OpenStreetMap API).
4. **Interactive Graph Exploration**: Render high-performance 2D/3D knowledge graph matrices for entity linkage visualization.

### High-Level Workflow

```
[ User Input URL / Handle ] ➔ [ Job Pipeline Engine ] ➔ [ Universal Adapter Registry ]
                                                                 │
[ Multi-Agent Advice ]  [ 10-Metric Scoring Engine ]  [ GeoService Geocoding Engine ]
          │
          ▼
[ Interactive Dashboard: Overview • Graph • Map • Evidence • Reports ]
```

---

## 4. Key Features

- **Authentication & Session Management**:
  - Secure JWT session cookies (`jose` HS256) with `httpOnly`, `secure`, and `sameSite: lax` flags.
  - BCrypt password hashing and middleware auth wall guarding `/dashboard`, `/reports`, `/mainframe`.
- **Dashboard & Visualization**:
  - Tabbed analytical workspace: **Overview**, **Knowledge Graph**, **Geointelligence Map**, **Evidence Matrix**, **Raw Data Inspector**.
  - Interactive MapLibre GL spatial clustering map with custom dark vector tiles.
- **AI & Multi-Agent Collaboration**:
  - `GeoAgent`: Spatial density analysis and relocation likelihood.
  - `MarketingAgent`: Engagement rates, audience affinity, and outreach strategy.
  - `RecruitmentAgent`: Seniority index, code frequency, and technical depth scoring.
  - `AuditAgent`: Signal authenticity and data confidence evaluation.
- **Automation & Pipeline Execution**:
  - Asynchronous background job queueing (`JobService`) with metric tracking (`fetchMs`, `geocodeMs`, `transformMs`).
  - Native autonomous agent pipeline runner CLI (`npm run agent:pipeline`).
- **API & Integrations**:
  - RESTful endpoints for `/api/analyze`, `/api/auth/login`, `/api/auth/logout`, `/api/exports`, `/api/reports`.
  - Open API reference specifications in `API_REFERENCE.md`.
- **Analytics & Scoring**:
  - 10-Metric Scoring Engine evaluating Technical Depth (+25), Network Reach (+20), Skill Maturity (+18), Geographic Density (+12), Data Confidence (+15), Industry Relevance (+10).
- **Security & Protection**:
  - OWASP ASVS Level 2 compliance, strict CORS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, sliding-window rate limiting.
- **Responsive Design & Accessibility**:
  - Fully responsive Tailwind CSS layout tailored for desktop, tablet, and mobile displays.
  - High-contrast dark theme with reduced motion fallbacks and ARIA semantic tags.

---

## 5. Interface Previews

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SOCIALGRAPH ATLAS DASHBOARD                     │
├────────────────────────────────────────────────────────────────────────┤
│  [ Overview ]  [ Knowledge Graph ]  [ Geointelligence Map ]  [ Evidence ]│
│                                                                        │
│  ┌───────────────────────────┐  ┌───────────────────────────────────┐  │
│  │ Profile: octocat          │  │ Overall Score: 94/100 (HIGH)      │  │
│  │ Platform: GitHub          │  │ Technical Depth: 95/100           │  │
│  │ Followers: 12,450         │  │ Data Confidence: 92/100           │  │
│  └───────────────────────────┘  └───────────────────────────────────┘  │
│                                                                        │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ MapLibre GL Spatial Cluster Heatmap                               │  │
│  │ [ San Francisco: 37.7749, -122.4194 ] [ Confidence: 0.95 ]         │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript 5.6, Tailwind CSS, Framer Motion, Lucide React, MapLibre GL.
- **Backend**: Node.js 20+, Next.js Route Handlers, TypeScript, `jose` JWT authentication.
- **Database**: PostgreSQL (Prisma ORM 5.20) & Local MongoDB support (`mongodb://127.0.0.1:27017/socialgraph_atlas`).
- **Security**: BCrypt password hashing, sliding-window rate limiter, `httpOnly` secure cookies.
- **Developer Tooling & Testing**: `tsx` (Node.js test runner), ESLint v9 (flat config), TypeScript strict mode, `ts-node`.

---

## 7. Architecture Overview

### Application Layers
1. **Presentation Layer (`src/app`, `src/components`)**: React 19 UI components, interactive dashboards, MapLibre GL maps.
2. **Middleware & Auth Wall (`src/middleware.ts`, `src/lib/session.ts`)**: Session validation, security headers, correlation tracing.
3. **Domain & Business Logic (`src/lib/services`, `src/lib/ai`, `src/lib/scoring`)**: Multi-agent orchestrators, scoring engines, geocoding engines.
4. **Adapter & Ingestion Layer (`src/lib/adapters`)**: Pluggable social adapters (GitHub, Reddit, Website scrapers, Mock adapters).
5. **Data Layer (`prisma/schema.prisma`, `src/lib/db.ts`)**: Prisma ORM PostgreSQL models (`User`, `AnalysisJob`, `Profile`, `Entity`, `Location`, `Edge`, `EvidenceItem`).

---

## 8. Project Structure

```
SPY-Social-Network/
├── .agents/                    # Subagent system prompts & task queue
│   ├── orchestrator.md          # Orchestrator / Manager agent specification
│   ├── planner.md               # AI Planner agent specification
│   ├── coder.md                 # Coding agent specification
│   ├── researcher.md            # Research agent specification
│   ├── tester.md                # Testing agent specification
│   ├── security.md              # Security agent specification
│   └── docwriter.md             # Documentation agent specification
├── prisma/                     # Database schema & seed scripts
│   ├── schema.prisma            # Prisma schema (PostgreSQL models)
│   └── seed.ts                  # Database seeding script
├── scripts/                    # Automation scripts
│   └── agent-pipeline.ts        # Autonomous multi-agent pipeline runner
├── src/
│   ├── app/                     # Next.js App Router pages & API endpoints
│   │   ├── api/                 # REST API endpoints (/analyze, /auth, /exports, /reports)
│   │   ├── dashboard/           # Main analytics dashboard & profile detail views
│   │   ├── login/               # Authentication login page
│   │   └── signup/              # User registration page
│   ├── components/              # Reusable UI & dashboard components
│   │   ├── dashboard/           # Overview, Graph, Map, Evidence, & Copilot tabs
│   │   └── ui/                  # Button, Pill, Container, Motion graphics
│   ├── context/                 # React state providers (AuthContext, ClientProviders)
│   ├── lib/                     # Core business logic services
│   │   ├── adapters/            # Universal social data adapters (GitHub, Reddit, Website)
│   │   ├── ai/                  # Multi-agent collaboration orchestrators
│   │   ├── geo/                 # Geocoding & spatial location engines
│   │   ├── scoring/             # 10-Metric Confidence & Scoring engines
│   │   ├── services/            # GeoService & JobService core services
│   │   ├── db.ts                # Prisma database client singleton
│   │   ├── logger.ts            # Structured JSON logger
│   │   ├── rateLimiter.ts       # Sliding window rate limiter
│   │   └── session.ts           # JWT session encryption & cookie management
│   └── types/                   # Shared TypeScript interface definitions
├── tests/                      # Automated unit test suite
│   └── services.test.ts         # Service unit tests (RateLimiter, ConfidenceEngine)
├── API_REFERENCE.md             # Complete REST API documentation
├── ARCHITECTURE.md              # Detailed system architecture guide
├── DATA_FLOW.md                 # Data flow & sequence diagrams
├── DEPLOYMENT.md                # Production deployment guide
├── PROJECT_OVERVIEW.md          # Complete project brief & vision
├── SECURITY.md                  # Security policies & OWASP audit notes
└── TESTING.md                   # Comprehensive testing documentation
```

---

## 9. Installation & Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: v14.0 or higher (or standard PostgreSQL instance)
- **npm**: v9.0.0 or higher

### Step-by-Step Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Hellthefox808/SPY-Social-Network.git
   cd SPY-Social-Network
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (`.env.local`):**
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/socialgraph_atlas?schema=public"
   SESSION_SECRET="your_production_super_secret_jwt_key_min_32_chars"
   NODE_ENV="development"
   ```

4. **Initialize Database Schema:**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Run Local Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

6. **Build & Execute Unit Tests:**
   ```bash
   # Run typecheck
   npx tsc --noEmit

   # Run ESLint
   npx eslint .

   # Run Unit Test Suite
   npm test

   # Build for Production
   npm run build
   ```

---

## 10. Configuration

- **Environment Variables**: Managed via `.env` / `.env.local` using `process.env`.
- **Session Security**: `SESSION_SECRET` must be set in production to enforce strong JWT signature encryption.
- **Database Connection**: Configured via `DATABASE_URL` for PostgreSQL instances.

---

## 11. Usage Guide

### User Workflow
1. Navigate to `/login` or `/signup` to authenticate.
2. Access the main `/dashboard` workspace.
3. Enter a target profile URL (e.g. `https://github.com/octocat`) in the analysis search bar.
4. Explore calculated **10-Metric Scores**, **Knowledge Graph Matrix**, and **Geointelligence Heatmap**.
5. Export PDF summaries or JSON evidence reports via `/api/exports`.

---

## 12. API Overview

All API endpoints follow REST conventions and return JSON payloads:

- `POST /api/auth/login`: Authenticate user and issue `sg_session` cookie.
- `POST /api/auth/logout`: Revoke session cookie.
- `POST /api/analyze`: Trigger profile ingestion and analysis job.
- `GET /api/reports`: Fetch historical analysis reports.
- `POST /api/exports`: Generate export payloads.

Full documentation is available in [API_REFERENCE.md](file:///c:/Users/ravir/Desktop/PROJECT/GITHUB/C-STYLE/SPY/API_REFERENCE.md).

---

## 13. Security

- **JWT Session Security**: Encryption using `jose` HS256 algorithm.
- **Route Protection**: Next.js Middleware guarding authenticated routes (`/dashboard`, `/reports`, `/mainframe`).
- **Rate Limiting**: In-memory sliding-window limiter guarding API routes against abuse.
- **Headers**: OWASP ASVS compliance with strict security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`).

Full security documentation is available in [SECURITY.md](file:///c:/Users/ravir/Desktop/PROJECT/GITHUB/C-STYLE/SPY/SECURITY.md).

---

## 14. Performance

- **Static Generation & Server Rendering**: Next.js App Router optimizing page loads.
- **Offscreen Canvas Throttling**: Frame-rate throttled motion background rendering.
- **Geocoding Tiered Cache**: Instant Tier 1 memory cache lookup for repeated geocoding requests.

---

## 15. Accessibility

- **Keyboard Navigation**: Full tab index focus support across forms and dashboard tabs.
- **Contrast Ratios**: High-contrast color tokens exceeding WCAG AAA standard ratios.
- **Reduced Motion**: Fallbacks for CSS keyframe animations.

---

## 16. Testing

- **Unit Testing**: Native `tsx --test` runner executing service unit tests (`tests/services.test.ts`).
- **Static Type Checking**: `npx tsc --noEmit`.
- **Linting**: `npx eslint .`.

Full testing guide is available in [TESTING.md](file:///c:/Users/ravir/Desktop/PROJECT/GITHUB/C-STYLE/SPY/TESTING.md).

---

## 17. Deployment

- Fully optimized for deployment on **Vercel**, **AWS Elastic Beanstalk**, **Docker**, or **DigitalOcean**.
- Complete deployment steps available in [DEPLOYMENT.md](file:///c:/Users/ravir/Desktop/PROJECT/GITHUB/C-STYLE/SPY/DEPLOYMENT.md).

---

## 18. Additional Documentation

- 📄 [PROJECT_OVERVIEW.md](file:///c:/Users/ravir/Desktop/PROJECT/GITHUB/C-STYLE/SPY/PROJECT_OVERVIEW.md) — Comprehensive Project Brief & Architectural Vision
- 📄 [ARCHITECTURE.md](file:///c:/Users/ravir/Desktop/PROJECT/GITHUB/C-STYLE/SPY/ARCHITECTURE.md) — Detailed Architecture Specification
- 📄 [DATA_FLOW.md](file:///c:/Users/ravir/Desktop/PROJECT/GITHUB/C-STYLE/SPY/DATA_FLOW.md) — Data Flow & Sequence Diagrams
- 📄 [API_REFERENCE.md](file:///c:/Users/ravir/Desktop/PROJECT/GITHUB/C-STYLE/SPY/API_REFERENCE.md) — REST API Reference Specifications
- 📄 [SECURITY.md](file:///c:/Users/ravir/Desktop/PROJECT/GITHUB/C-STYLE/SPY/SECURITY.md) — Security Policies & Audit Guidelines
- 📄 [DEPLOYMENT.md](file:///c:/Users/ravir/Desktop/PROJECT/GITHUB/C-STYLE/SPY/DEPLOYMENT.md) — Deployment & Production Operations
- 📄 [TESTING.md](file:///c:/Users/ravir/Desktop/PROJECT/GITHUB/C-STYLE/SPY/TESTING.md) — Automated Testing Guidelines

---

## 19. Roadmap

- [x] Multi-platform profile adapter registry (GitHub, Reddit, Web scrapers)
- [x] 10-Metric explainable confidence scoring engine
- [x] Tiered geocoding engine with MapLibre GL heatmaps
- [x] Autonomous multi-agent pipeline orchestration script
- [ ] Multi-tenant organization workspace isolation
- [ ] Real-time WebSocket streaming for analysis job updates

---

## 20. License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 21. Authorship & Project Maintainer

**Author & Project Maintainer**:  
**Ravi Ranjan Singh**  
*Software Engineer • Software Architect • Full Stack Developer • AI SaaS Developer*

- **GitHub**: [@Hellthefox808](https://github.com/Hellthefox808)
- **Repository**: [Hellthefox808/SPY-Social-Network](https://github.com/Hellthefox808/SPY-Social-Network)
