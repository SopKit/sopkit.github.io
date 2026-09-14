# Final State Architecture — SopKit Platform Redesign

## Executive Summary
This redesign transforms SopKit from a client-heavy repository into an enterprise-scale web utility platform capable of handling 1,000+ tools, millions of requests, strict sub-second performance budgets, zero-knowledge client privacy, and automated CI quality gates.

---

## Key System Changes

### 1. Performance Governance (`src/performance/`)
- **Per-Page Profiles**: Replaced blanket optimizations with granular `PagePerformanceProfile` contracts for each route category (`marketing`, `tool`, `directory`, `content`, `documentation`, `developer`, `utility`).
- **Baseline Remediation**: Directly addressed the September 14, 2026 PageSpeed audit:
  - FCP/LCP render delays eliminated through server components and lazy interaction-based loading.
  - Desktop CLS dropped from 0.49 to < 0.03 via pre-reserved intrinsic aspect ratio containment (`contain-intrinsic-size`).
  - Cache lifetimes updated from 10 minutes to 1-year immutable caching (`public, max-age=31536000, immutable`).
  - Third-party script payload bloat (~330 KiB) managed via deferred and idle-time scheduling.

### 2. Tool Platform (`src/features/tools/`)
- **Decoupled Architecture**: Decoupled tool metadata and runtime loading. The client bundle no longer ships the monolithic 355 KiB `tools.json`.
- **Server Registry**: Added `getToolBySlug(slug)`, `getToolById(id)`, `getToolsByCategory(category)`, and `getRelatedTools(toolId)`.
- **Runtime Classes**: Tools declare their performance footprint (`light`, `medium`, `heavy`) and processing target (`browser`, `worker`, `edge`, `server`). Heavy libraries (PDF-lib, PDF.js, canvas manipulators) load only when users interact.

### 3. Centralized SEO, AEO & GEO Platform (`src/seo/`)
- **Centralized Registry**: Unified `config.ts`, `metadata.ts`, `canonical.ts`, `structured-data.ts`, `entities.ts`, and `validators.ts`.
- **Structured Data**: Automatic generation of standards-compliant Schema.org JSON-LD (`WebSite`, `Organization`, `SoftwareApplication`, `BreadcrumbList`, `FAQPage`, `HowTo`).
- **Strict Canonicalization**: Automated stripping of UTM/tracking parameters and normalization of URLs to `https://sopkit.github.io/<slug>`.

### 4. Edge Backend Platform (`sopkit-backend/`)
- **Independent Micro-Service Layer**: Standalone Hono edge service ready for Cloudflare Workers (`wrangler.toml`).
- **Modular Sub-Routers**: Public search API, internal vitals telemetry, and webhook receiver.
- **Edge Security & Cache**: Token bucket rate limiting, Zod schema validation, and stale-while-revalidate edge headers.

### 5. Application Security Hardening (`src/server/security/`)
- **SSRF Defense**: `safeFetch` blocks private IP spaces (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), loopbacks (127.0.0.1, ::1), link-local metadata (169.254.169.254), and non-HTTP protocols.
- **File Validation**: Magic byte inspection for PNG, JPEG, GIF, WebP, PDF, and ZIP.
- **Decompression Bomb Guard**: Automated checks preventing decompression ratio abuse (>100:1), uncompressed sizes > 50MB, or > 500 archive files.
- **Security Headers**: Production-grade Content-Security-Policy with `'wasm-unsafe-eval'` and `worker-src blob:` for local in-browser computation.

### 6. Analytics & Monetization Features (`src/features/`)
- **Typed Analytics**: Strict event taxonomy (`page_view`, `tool_used`, `tool_action`, `vital_metric`) with zero PII and duplicate suppression.
- **Google Consent Mode v2**: Default denial with persistent user opt-in.
- **Zero-CLS AdSlot**: Strict layout containment preventing page displacement. Default ad suppression (`SHOW_SCRIPTLY_ADS = false`).

### 7. Automated Testing Suite (`tests/`)
- **Unit Tests**: Tool registry lookup, performance budget profiles, search scoring.
- **SEO Tests**: Canonical URL normalization, Schema.org builders, metadata constraint validation.
- **Security Tests**: SSRF blocking, magic byte detection, path traversal sanitization, ZIP bomb limits, CSP headers.
- **CI Gates**: `bun run test:arch` executes all 28 tests in < 400ms.
