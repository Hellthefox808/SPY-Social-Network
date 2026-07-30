# Testing & Quality Assurance Documentation

This document outlines the testing strategy, quality assurance procedures, and execution workflows for **SocialGraph Atlas**.

---

## 1. Testing Strategy

The project employs a multi-layered verification strategy combining static type checking, linting, unit testing, and multi-agent pipeline validation.

```
┌─────────────────────────────────────────────────────────────┐
│                    VERIFICATION MATRIX                      │
├───────────────────────────────┬─────────────────────────────┤
│ Static Type Analysis          │ npx tsc --noEmit            │
│ Code Linting & Style          │ npx eslint .                │
│ Automated Unit Testing        │ npm test                    │
│ Production Build Check        │ npm run build               │
│ Autonomous Pipeline Audit     │ npm run agent:pipeline      │
└───────────────────────────────┴─────────────────────────────┘
```

---

## 2. Running Automated Tests

### Unit Test Suite
The unit test suite is built using Node.js native test runner executed via `tsx`:

```bash
npm test
```

**Coverage Areas**:
- `RateLimiter`: Sliding-window request control & limit enforcement.
- `ConfidenceEngine`: 10-Metric score calculation & missing data identification.

---

## 3. Static Type Analysis

Verify TypeScript strict type safety across all files:

```bash
npx tsc --noEmit
```

---

## 4. Code Quality & Linting

Run ESLint flat configuration check:

```bash
npx eslint .
```

---

## 5. Multi-Agent Pipeline Verification

Run dry-run or live execution of the multi-agent task runner:

```bash
# Dry-run multi-agent pipeline
npm run agent:pipeline -- --dry-run

# Run task through multi-agent loop
npm run agent:pipeline -- --task "Audit database models"
```

---

## 6. Authorship Notice

**Author**:  
**Ravi Ranjan Singh**  
*Software Engineer • Software Architect • Full Stack Developer • AI SaaS Developer*  
- GitHub: [@Hellthefox808](https://github.com/Hellthefox808)
