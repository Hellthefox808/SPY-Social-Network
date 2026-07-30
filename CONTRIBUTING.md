# Contributing to SocialGraph Atlas

Thank you for your interest in contributing to **SocialGraph Atlas (SPY Social Network)**! We welcome contributions from developers, designers, data engineers, and security researchers.

This document outlines the guidelines and workflow for submitting issues, feature requests, and Pull Requests to ensure a smooth, high-quality development process.

---

## 1. Code of Conduct

We are committed to providing a welcoming, inclusive, and respectful environment for all contributors. Please adhere to the following principles:
- Use welcoming and inclusive language.
- Be respectful of differing viewpoints and technical approaches.
- Focus on constructive feedback and collaboration.

---

## 2. Getting Started & Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: v14.0 or higher
- **npm**: v9.0.0 or higher

### Step-by-Step Local Environment Setup

1. **Fork the Repository**:
   Click the **Fork** button at the top right of [Hellthefox808/SPY-Social-Network](https://github.com/Hellthefox808/SPY-Social-Network).

2. **Clone your Fork locally**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/SPY-Social-Network.git
   cd SPY-Social-Network
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Configure Environment Variables (`.env.local`)**:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/socialgraph_atlas?schema=public"
   SESSION_SECRET="dev_super_secret_key_change_in_production_123456789"
   NODE_ENV="development"
   ```

5. **Initialize Database Schema & Seed Data**:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

6. **Start the Local Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 3. Branching Strategy

Always create a descriptive feature or bugfix branch off `main`:

| Branch Prefix | Usage | Example |
| :--- | :--- | :--- |
| `feature/` | New functionality or feature additions | `feature/slack-webhook-export` |
| `fix/` | Bug fixes and patch remediations | `fix/geocoding-timeout-fallback` |
| `docs/` | Documentation improvements | `docs/update-contributing-guide` |
| `refactor/` | Code structure optimization without feature change | `refactor/session-jwt-utility` |
| `test/` | Adding or updating unit/integration tests | `test/geoservice-unit-tests` |

```bash
git checkout -b feature/your-feature-name
```

---

## 4. Pre-Submission Quality Checklist

Before submitting a Pull Request, you MUST run and pass all local verification checks:

```bash
# 1. Static Type Checking (Must report 0 errors)
npx tsc --noEmit

# 2. Static Code Analysis & Linting (Must report 0 errors and 0 warnings)
npx eslint .

# 3. Automated Unit Testing Suite (Must pass all tests)
npm test

# 4. Production Build Verification (Must compile successfully)
npm run build

# 5. Multi-Agent Pipeline Verification (Dry-run audit)
npm run agent:pipeline -- --dry-run
```

---

## 5. Git Commit Conventions

We enforce **Conventional Commits** to keep git history clean, readable, and automated changelog-compatible.

### Commit Format
```text
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```

### Examples
- `feat(scoring): add geographic density multiplier to 10-metric engine`
- `fix(session): resolve static build phase throw when SESSION_SECRET is unset`
- `docs(readme): add 21-section enterprise documentation suite`
- `refactor(canvas): cap underwater animation rendering loop to 60 FPS`

---

## 6. Submitting a Pull Request (PR)

1. **Push your branch to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request**:
   - Navigate to [Hellthefox808/SPY-Social-Network/pulls](https://github.com/Hellthefox808/SPY-Social-Network/pulls).
   - Target the `main` branch.
   - Title your PR using conventional commit formatting (e.g. `feat(api): add export endpoint for JSON reports`).

3. **PR Description Checklist**:
   - Describe what changed and why.
   - Include output of `npm test`, `npx tsc --noEmit`, `npx eslint .`, and `npm run build`.
   - Link any related issue numbers (e.g. `Fixes #42`).

---

## 7. Authorship & Project Maintainer

**Project Author & Owner**:  
**Ravi Ranjan Singh**  
*Software Engineer • Software Architect • Full Stack Developer • AI SaaS Developer • Repository Owner*

- **GitHub**: [@Hellthefox808](https://github.com/Hellthefox808)
- **Repository**: [Hellthefox808/SPY-Social-Network](https://github.com/Hellthefox808/SPY-Social-Network)
