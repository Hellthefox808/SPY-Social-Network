# SocialGraph Atlas (SPY Social Network)

> **Enterprise AI Profile Intelligence Cloud, Knowledge Graph Engine & Decision Operating System**

[![Next.js 15](https://img.shields.io/badge/Next.js-15_App_Router-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-PostgreSQL-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Supported-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Author](https://img.shields.io/badge/Author-Hellthefox808_(Ravi)-ff69b4?style=flat-square)](https://github.com/Hellthefox808)

---

## 📌 Executive Briefing

**SocialGraph Atlas** (also known as **SPY Social Network**) is a production-grade **Enterprise AI Profile Intelligence Cloud & Decision Platform** designed for growth teams, talent acquisition leaders, executive recruiters, and B2B marketers.

Instead of presenting isolated social metrics or raw follower numbers, SocialGraph Atlas converts authorized public profile signals from **LinkedIn**, **Naukri.com**, **GitHub**, **Reddit**, and public web endpoints into **explainable 10-metric scores**, **interactive knowledge graph matrices**, **live geointelligence maps**, and **actionable business decision recommendations**.

---

## 🏛️ Enterprise System Architecture

```text
                                  DATA FABRIC
    [ GitHub Connector ]  [ LinkedIn Connector ]  [ Naukri Connector ]  [ Enterprise CRM ]
                                       │
                                       ▼
                          UNIVERSAL CONNECTOR FRAMEWORK
              (Authentication • Schema Mapping • Rate Limiting • Retries)
                                       │
                                       ▼
                         KNOWLEDGE GRAPH & AI MEMORY
             (Graph Traversal • Embedding Store • Long-Term Org Memory)
                                       │
                                       ▼
                         MULTI-AGENT COLLABORATION OS
            (GeoAgent • MarketingAgent • RecruitmentAgent • AuditAgent)
                                       │
                                       ▼
                           DECISION INTELLIGENCE ENGINE
                (10-Metric Scoring • Actionable ROI • Risk Score)
                                       │
                                       ▼
                       WORKFLOW AUTOMATION & EXPORTS
               (PDF Briefings • Webhook Triggers • CRM Sync)
                                       │
                                       ▼
                         ENTERPRISE APIS & SECURITY
                    (REST • OpenAPI • Middleware Auth Wall)
```

---

## ✨ Key Enterprise Capabilities

- 🧠 **Explainable 10-Metric Scoring Engine**: Transparent 0–100 evaluations across Technical Depth (+25), Network Reach (+20), Skill Maturity (+18), Geographic Density (+12), Data Confidence (+15), and Industry Relevance (+10).
- 🤖 **Multi-Agent Orchestrator**: Collaborative intelligence agents (`GeoAgent`, `MarketingAgent`, `RecruitmentAgent`, `AuditAgent`) that synthesize actionable advice (e.g., *"Allocate 35% of ad spend to Singapore due to 3.2x engagement rate"*).
- 🕸️ **Knowledge Graph Matrix**: Dynamic relationship mapping across `Person ➔ Company ➔ Skill ➔ Tech Stack ➔ Geography`.
- 🗺️ **Live Geointelligence Heatmap**: High-density geographic cluster visualizer powered by MapLibre GL.
- 🔒 **Enterprise Middleware Auth Wall**: Strict route protection (`middleware.ts`) enforcing login-first application access, Open Redirect defenses, and `X-Correlation-ID` tracing.
- ⚡ **Zero-Lag Motion Engine**: Offscreen memory canvas rendering and playhead throttling for smooth 60FPS background graphics.
- 💳 **Tiered SaaS Subscription Architecture**: Free ($0/mo), Pro ($29/mo), Business ($99/mo), and Enterprise Custom pricing models.

---

## 🛠️ Tech Stack & Infrastructure

- **Framework**: Next.js 15 (App Router), React 19, TypeScript 5.
- **Styling & UI**: Tailwind CSS, Framer Motion, Lucide Icons, Glassmorphism design system tokens.
- **Databases**: PostgreSQL (Prisma ORM) & Local MongoDB (`mongodb://127.0.0.1:27017/socialgraph_atlas`).
- **Security & Headers**: OWASP ASVS Level 2, JWT `jose` session management, CORS protection, `X-Frame-Options: DENY`, `nosniff`.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL or MongoDB

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Hellthefox808/SPY-Social-Network.git
   cd SPY-Social-Network
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables (`.env.local`):**

   ```env
   DATABASE_URL="file:./dev.db"
   AUTH_SECRET="your_production_secret_key_here"
   SESSION_SECRET="your_production_session_secret_key_here"
   MONGODB_URI="mongodb://127.0.0.1:27017/socialgraph_atlas?directConnection=true&serverSelectionTimeoutMS=2000"
   ```

4. **Initialize Database:**

   ```bash
   npx prisma db push
   ```

5. **Run Development Server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👤 Author & Owner Authorization

**SocialGraph Atlas** is solely authored, designed, and owned by:

### **Hellthefox808 (Ravi)**
- **Role**: Founder & Lead Software Architect
- **GitHub Profile**: [@Hellthefox808](https://github.com/Hellthefox808)
- **Official Repository**: [SPY-Social-Network](https://github.com/Hellthefox808/SPY-Social-Network)

---

## 📄 License & Security

- **License**: Enterprise / Proprietary License. All rights reserved by **Hellthefox808 (Ravi)**.
- **Security Policy**: For vulnerability reporting and security advisories, consult `security_audit_report.md`.
