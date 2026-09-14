# Deployment & Edge Infrastructure

## Overview
SopKit deploys on Cloudflare via `@opennextjs/cloudflare`, pairing Edge HTML generation with immutable asset CDN caching and zero-knowledge worker execution.

## Deployment Pipeline
```
Code Push (main branch)
       │
       ▼
GitHub Actions CI Pipeline:
 ├── Registry Validation:    npx tsx scripts/validate-registry.ts
 ├── TypeScript Checks:      bun run typecheck
 ├── Automated Unit Tests:   bun run test:arch
 ├── Performance Audits:     bun run perf:audit
 └── Route Matrix Discovery: bun run perf:discover
       │
       ▼
Cloudflare Pages / OpenNext Build:
 ├── Versioned Assets:       /_next/static/*  -> Cache-Control: max-age=31536000, immutable
 ├── Edge Worker Routes:     Serverless SSR / ISR execution
 └── Cloudflare CDN Cache:   Fast edge delivery with stale-while-revalidate
```

## Production Verification Checklist
- [x] All 618 tools verified in registry (`scripts/validate-registry.ts`).
- [x] Zero TypeScript compilation errors (`bun run typecheck`).
- [x] Zero breaking URL changes or missing redirects.
- [x] Monetization ads disabled (`SHOW_SCRIPTLY_ADS = false`).
- [x] Content-Security-Policy enables WebAssembly and Web Worker isolation without leaking scripts.
- [x] Performance budgets strictly enforced across Mobile and Desktop.
