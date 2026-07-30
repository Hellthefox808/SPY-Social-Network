# SocialGraph Atlas • Project Brief & Overview

## 1. Project Vision
SocialGraph Atlas is an enterprise-grade AI Profile Intelligence Cloud and Decision Platform. Its vision is to solve identity fragmentation across public social networks, open-source repositories, and digital platforms by converting unstructured web signals into explainable knowledge graph matrices, geointelligence maps, and deterministic decision scores.

---

## 2. Business Problem & Opportunity
Growth teams, talent acquisition leaders, executive recruiters, and B2B marketers spend extensive manual effort cross-referencing user handles, validating technical skills, and estimating geographic density. Existing tools provide static metrics or unverified black-box scores.

SocialGraph Atlas closes this gap by combining:
- **Pluggable Data Adapters**: Normalizing public identity endpoints.
- **Explainable 10-Metric Scoring**: Providing full mathematical attribution for confidence ratings.
- **Multi-Agent Orchestration**: Generating contextual growth and hiring advice.

---

## 3. Core Target Audience
1. **Talent Acquisition Leaders & Technical Recruiters**: Validate developer seniority, code frequency, and location authenticity.
2. **Growth & B2B Marketers**: Analyze geographic concentration and audience affinity for targeted campaigns.
3. **Intelligence Analysts**: Map relationships between entities, tech stacks, and organizations.

---

## 4. Architectural Summary
SocialGraph Atlas utilizes a modular 5-tier architecture:
1. **Universal Adapter Registry**: Connects GitHub, Reddit, and Web endpoints.
2. **Data Pipeline & Persistence**: Prisma ORM with PostgreSQL and local MongoDB.
3. **GeoService Engine**: 3-Tier geocoding with instant memory caching and Nominatim fallbacks.
4. **Scoring Engine**: 10-Metric explainable confidence calculator.
5. **Multi-Agent Collaboration OS**: `GeoAgent`, `MarketingAgent`, `RecruitmentAgent`, and `AuditAgent` synthesizing actionable briefings.

---

## 5. Technology Stack Summary
- **Frontend**: Next.js 15 App Router, React 19, TypeScript 5.6, Tailwind CSS, MapLibre GL.
- **Backend**: Node.js 20+, TypeScript, RESTful API Routes, `jose` JWT authentication.
- **Database**: PostgreSQL (Prisma ORM) & MongoDB.
- **Testing & Quality**: `tsx` (Node.js test runner), ESLint v9 flat config, TypeScript strict mode.

---

## 6. Engineering Principles & Scalability Goals
- **Strict Decoupling**: Components communicate strictly through typed interfaces (`ISocialAdapter`, `GeocodeResult`).
- **Resilience & Graceful Degradation**: External API timeouts automatically fall back to static spatial heuristics without breaking requests.
- **Traceability**: Every output coordinate, entity edge, and extracted attribute links directly to an underlying `EvidenceItem`.

---

## 7. Authorship & Maintainer Notice

**Project Author & Owner**:  
**Ravi Ranjan Singh**  
*Software Engineer • Software Architect • Full Stack Developer • AI SaaS Developer*

- **GitHub Repository**: [Hellthefox808/SPY-Social-Network](https://github.com/Hellthefox808/SPY-Social-Network)
