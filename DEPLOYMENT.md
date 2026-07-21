# SocialGraph Atlas • Production Deployment Guide

## Docker / Containerized Deployment

### 1. Environment Configuration

Ensure `.env` contains:

```env
DATABASE_URL="file:./dev.db" # Or postgresql://user:pass@host:5432/dbname
AUTH_SECRET="your-production-secret-key-32-chars-min"
SESSION_SECRET="your-session-secret-key"
NODE_ENV="production"
```

### 2. Build & Run Container

```bash
docker build -t socialgraph-atlas:latest .
docker run -d -p 3000:3000 --env-file .env socialgraph-atlas:latest
```

---

## Production Verification Checklist

- [x] Run database migrations: `npx prisma db push`
- [x] Generate Prisma Client: `npx prisma generate`
- [x] Build application: `npm run build`
- [x] Run health check endpoints: `GET /api/reports`
