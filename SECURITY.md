# Security Policy & Audit Specifications

**SocialGraph Atlas (SPY Social Network)** takes security, data protection, and privacy extremely seriously. This document outlines supported versions, security architecture policies, reporting guidelines, and audit procedures.

---

## 1. Supported Versions

Only the latest release on the `main` branch is actively supported with security patches and vulnerability updates.

| Version | Branch | Status | Supported |
| :--- | :--- | :--- | :--- |
| **0.1.x** | `main` | Production-Ready / Active | Yes |
| **< 0.1.0** | - | Deprecated | No |

---

## 2. Security Architecture & Controls

- **Authentication & JWT Encryption**: Sessions are signed and encrypted using the `jose` library (HS256) with `httpOnly`, `secure`, and `sameSite: lax` flags.
- **Middleware Auth Wall**: Route protection enforced in `src/middleware.ts` guarding `/dashboard`, `/reports`, `/mainframe`.
- **Sliding-Window Rate Limiting**: In-memory rate limiting (`src/lib/rateLimiter.ts`) guarding API endpoints against brute force attacks.
- **Security Headers**: OWASP ASVS Level 2 compliance with strict security headers:
  - `X-Frame-Options: DENY` (Clickjacking defense)
  - `X-Content-Type-Options: nosniff` (MIME-sniffing defense)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Correlation-ID` tracing on every request.

---

## 3. Reporting a Vulnerability

If you discover a security vulnerability or credential risk, **DO NOT open a public GitHub issue**.

Please report security vulnerabilities directly to the repository maintainer:

- **Maintainer**: **Ravi Ranjan Singh**
- **GitHub**: [@Hellthefox808](https://github.com/Hellthefox808)
- **Repository**: [Hellthefox808/SPY-Social-Network](https://github.com/Hellthefox808/SPY-Social-Network)

### Report Guidance:
1. Provide a detailed summary of the vulnerability (e.g. CSRF, XSS, rate-limit bypass, secret leakage).
2. Include steps or a proof-of-concept payload to reproduce the issue safely.
3. We will acknowledge receipt within 24–48 hours and work with you to patch and disclose the remediation.

---

## 4. Security Audit Commands

Contributors can run local security audits using the built-in Security Agent in the multi-agent pipeline:

```bash
# Run Security Agent audit via multi-agent pipeline
npm run agent:pipeline -- --task "Audit security guards and secret leakage"

# Run dependency security audit
npm audit
```
