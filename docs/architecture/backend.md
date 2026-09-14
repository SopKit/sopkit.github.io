# Backend Architecture & Edge Services

## Overview
The `sopkit-backend/` package is an independent service layer designed to run on Cloudflare Workers / Edge runtimes. It handles high-throughput stateless operations, search indexing, and telemetry without placing heavy loads on the Next.js origin application.

```
sopkit-backend/
├── package.json               # Standalone dependencies (Hono, Zod, Cloudflare Workers types)
├── wrangler.toml              # Cloudflare Workers configuration
└── src/
    ├── index.ts               # Hono edge router with CORS & security headers
    ├── api/
    │   ├── public/            # Public search & tools catalog APIs
    │   ├── internal/          # RUM telemetry & Web Vitals aggregation
    │   └── webhooks/          # Webhook receivers (GitHub releases, indexing pings)
    ├── services/              # Pure domain services (SearchService, FileSanitizationService)
    ├── adapters/              # Cloudflare KV, R2, and external integration adapters
    ├── validation/            # Zod input validation schemas
    ├── security/              # Token bucket rate limiting, SSRF defense
    ├── cache/                 # Edge cache headers with stale-while-revalidate
    └── telemetry/             # Structured JSON logger
```

## Security & Reliability Standards
- **Input Validation**: Every endpoint enforces strict Zod schema validation. Malformed payloads are rejected with HTTP 400.
- **Rate Limiting**: Sliding window token bucket protects against DDoS and abusive scrapers.
- **Zero File Retention**: If server-assisted file transformation is invoked, all file chunks exist only in ephemeral worker memory and are never persisted to disk or storage buckets.
