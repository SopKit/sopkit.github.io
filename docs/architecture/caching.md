# HTTP & Edge Caching Architecture

## Overview
A critical finding from the September 14, 2026 PageSpeed audit was that assets had short ~10-minute cache lifetimes, costing approximately 444 KiB in unnecessary network re-transfers.

The redesign implements an aggressive, hierarchical caching architecture.

```
src/performance/headers.ts     # Authoritative HTTP Cache-Control header generator
```

## Caching Strategy Matrix

| Resource Type | Cache-Control Directive | CDN-Cache-Control | Invalidation Trigger |
| :--- | :--- | :--- | :--- |
| **Hashed Static Chunks** (`/_next/static/*`) | `public, max-age=31536000, immutable` | `public, max-age=31536000` | Automated on deploy (new hash) |
| **Self-Hosted Web Fonts** (`/fonts/*`) | `public, max-age=31536000, immutable` | `public, max-age=31536000` | Versioned font paths |
| **Optimized Image Media** (`/images/*`) | `public, max-age=2592000, stale-while-revalidate=86400` | `public, max-age=31536000` | Content hash change |
| **Static SSG/ISR Pages** (`/`, `/tools`, `/pdf-tools`) | `public, max-age=3600, s-maxage=86400` | `public, max-age=86400, stale-while-revalidate=604800` | Next.js revalidation / webhook purge |
| **Dynamic Metadata** (`/sitemap.xml`, `robots.txt`) | `public, max-age=86400, s-maxage=86400` | `public, max-age=604800` | Daily regeneration |
| **Ephemeral File Processing Outputs** | `private, no-cache, no-store, must-revalidate` | None | Never stored |

## Cloudflare Edge Directives
- `stale-while-revalidate` ensures edge nodes serve cached representations instantaneously while background fetches fetch new builds.
- Origin shields and tier-caching absorb traffic spikes without degrading tool responsiveness.
