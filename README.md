# SPY Social Network (SocialGraph Atlas)
> **AI-Powered Profile Intelligence, Geointelligence Mapping & Business Growth SaaS**

[![Next.js 15](https://img.shields.io/badge/Next.js-15_App_Router-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-PostgreSQL-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Author](https://img.shields.io/badge/Author-Hellthefox808-ff69b4?style=flat-square)](https://github.com/Hellthefox808)

---

## 📌 What is SPY Social Network?

**SPY Social Network** (also known as **SocialGraph Atlas**) is a market-ready **AI SaaS platform** that transforms profile URLs and user IDs from platforms like **LinkedIn**, **Naukri.com**, **GitHub**, **Reddit**, and public websites into **decision-ready business intelligence and live geointelligence maps**.

Instead of manually digging through raw numbers or fragmented social metadata, SPY Social Network aggregates connection counts, maps geographical distribution, and runs an **AI Orchestration Engine** to generate growth recommendations for marketing, talent acquisition, and market research.

---

## 🎯 Why This Project Exists

Modern marketing, recruiting, and business intelligence teams face three major hurdles when analyzing target profiles or developer/talent ecosystems:

1. **Noise Over Insights**: Raw follower counts and profile bios don't tell you *where* an audience is or *how* to engage them effectively.
2. **Lack of Geographic Clarity**: Teams waste budget marketing to regions where their target audience does not reside.
3. **Privacy & Compliance Risk**: Scraping private identities can lead to legal issues. SPY Social Network focuses on **aggregated network analytics** and **geointelligence density**, enabling privacy-preserving HR recruitment and B2B marketing decisions.

### Core Promise
> *"Enter any profile link or user ID, and the platform instantly generates audience geo-distribution maps, network density analytics, and AI growth recommendations."*

---

## ✨ Key Features

- 🌐 **Multi-Platform Adapter Registry**: Native URL ingestion for **LinkedIn**, **Naukri.com**, **GitHub**, **Reddit**, and generic websites.
- 🗺️ **Live Geointelligence Map**: Interactive high-density geographical visualization powered by MapLibre GL.
- 🧠 **AI Business Recommendations Engine**: Generates a **Growth Impact Score (0–100)** and actionable regional marketing/HR steps.
- 🔒 **Privacy & HR Compliance Mode**: Displays aggregated network clusters and regional reach metrics without exposing private identities.
- 📊 **Exportable Reports**: One-click exports to **PDF Executive Briefings**, **JSON Data Payloads**, and **CSV files**.
- 💳 **Market-Ready Subscription Tiers**: Free ($0/mo), Pro ($29/mo), Business ($99/mo), and Enterprise Custom pricing pages built-in.

---

## 🏗️ Technical Architecture

- **Frontend**: Next.js 15 (App Router), React 19, TailwindCSS, Lucide Icons, Framer Motion.
- **Backend API**: Next.js Serverless API Routes utilizing `after()` callbacks to prevent execution timeouts on long-running OSINT jobs.
- **AI & Analytics**: Custom `AIOrchestrator` for structured entity extraction and business recommendation synthesis.
- **Database**: PostgreSQL with Prisma ORM.
- **Geocoding Pipeline**: OpenStreetMap Nominatim with strict Promise-based queue throttling (1.1s rate limiter to prevent IP bans).
- **Authentication**: JWT-based session tokens with strict HTTP security headers (`middleware.ts`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL Database

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

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/spy_db"
   SESSION_SECRET="your_production_secret_key_here"
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

## 👨‍💻 Author & Creator

This project is created and maintained by:

**Hellthefox808 (Ravi)**
- **GitHub**: [@Hellthefox808](https://github.com/Hellthefox808)
- **Project Repository**: [SPY-Social-Network](https://github.com/Hellthefox808/SPY-Social-Network)

---

## 📄 License & Security

- **License**: Proprietary / Enterprise License. See `LICENSE` for details.
- **Security Policy**: For vulnerability reporting, please refer to [SECURITY.md](SECURITY.md).
