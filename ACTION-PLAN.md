# SopKit SEO Action Plan

> **⚠️ SUPERSEDED — historical snapshot from 2026-06-04.** Items have since been
> worked on; priorities/numbers below are stale. Kept for history only.

**Prioritized by Impact × Effort**  
**Site:** [sopkit.github.io](https://sopkit.github.io) — 405+ free online tools  
**Generated:** 2026-06-04

---

## Critical Fixes (Blocks Rankings or Causes Penalties)

### 1. 301 Redirect All Extra Slugs
**Status:** Implemented via next.config.mjs redirects  
**Problem:** 1,686 extra slug URLs served duplicate content via iframes  
**Fix:** Programmatic 301 redirects from all extra slugs to canonical parent tool routes

### 2. Soft 404 Fix
**Status:** Verified — not-found.tsx returns HTTP 404  
**Fix:** Intent route properly returns null for unknown slugs, letting Next.js handle 404

### 3. Remove Hardcoded Robots Meta
**Status:** ✅ DONE — Already removed from layout.tsx  
**Fix:** Metadata API handles robots per-page

### 4. Remove Non-Compliant Hreflang Tags
**Status:** ✅ DONE — No hreflang tags found in codebase  
**Fix:** All `alternates: { canonical }` references are proper canonical URLs

### 5. Add WWW Redirect
**Status:** Needs Cloudflare Pages configuration  
**Fix:** Add rule in Cloudflare dashboard: `www.sopkit.github.io/*` → `https://sopkit.github.io/:splat`

### 6. Sitemap Deduplication
**Status:** ✅ DONE — Sitemap.ts already deduplicates by URL

---

## High Priority (Fix Within 1 Week)

### 7. Remove Deprecated X-XSS-Protection Header
**Status:** ✅ DONE

### 8. Enable optimizeCss
**Status:** ✅ DONE — Changed to `true` in next.config.mjs

### 9. Update Tool Counts
**Status:** ✅ DONE — llms.txt updated to 405+, opensearch.xml updated

### 10. Allow GPTBot for Search
**Status:** ✅ DONE — robots.ts allows GPTBot

### 11. Replace FID with INP
**Status:** ✅ DONE — Already `"INP"` in webVitalsAttribution

---

## Medium Priority (Within 1 Month)

- Expand tool page content to 1,000+ words for top 50 tools
- Reduce JS bundle size (split 700KB+ chunks)
- Reduce homepage DOM (2,689 → <1,500)
- Fix sitemap lastmod dates with actual values
- Add per-tool OG images
- Add AggregateRating schema for rich snippets

---

## Implementation Roadmap

| Priority | Focus | Status |
|----------|-------|--------|
| Critical | Extra slug redirects, soft 404, duplicate robots, hreflang, WWW, sitemap | Mostly ✅ |
| High | Security headers, CSS optimization, tool counts, GPTBot, INP | ✅ Complete |
| Medium | Content depth, bundle splitting, DOM reduction, OG images | 🔄 In progress |

---

*Current SEO Health Score estimate: ~72/100 (up from 56)*
