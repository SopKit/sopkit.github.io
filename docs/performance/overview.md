# Performance Architecture Overview

SopKit is engineered under the principle that **performance is an architectural constraint, not a cosmetic optimization**. 

Every page on SopKit is backed by an explicit `PagePerformanceProfile` that dictates:
1. Hard transfer budgets (JavaScript, CSS, Images, Total).
2. Hard Core Web Vital targets (FCP, LCP, TBT, CLS, INP, Speed Index).
3. Client boundary limits (maximum client components per page).
4. Third-party script governance (deferral, idle execution, or complete prohibition).
5. Immutable asset caching policies (1-year TTL with content hashes).

---

## The September 14, 2026 Baseline

Before this redesign, real-world PageSpeed Insights revealed significant performance bottlenecks:
- **Mobile Score 67**: FCP 2.1s, LCP 4.4s, TBT 560ms, CLS 0.00, Speed Index 3.3s.
- **Desktop Score 55**: FCP 0.8s, LCP 1.0s, TBT 470ms, CLS 0.49, Speed Index 1.6s.
- **Root Causes**:
  - Over 1,046 KiB payload with ~600 KiB first-party JS and 232-243 KiB unused JavaScript.
  - Sub-optimal 10-minute cache TTLs on static assets (~444 KiB waste).
  - Unmanaged third-party overhead (~167 KiB GTM/GA + ~163 KiB AdSense).
  - Unreserved ad containers causing desktop CLS to spike to 0.49.
  - Massive DOM trees (2,365 nodes mobile / 6,902 desktop).

---

## The New Invariants

1. **Per-Page Profiles**: Every route belongs to a category (`marketing`, `tool`, `directory`, `content`, `documentation`, `developer`, `utility`) with strict limits.
2. **Server-First Execution**: Server Components are the default. Client Components exist only at the leaf level for direct user interaction.
3. **Lazy Tool Runtimes**: Heavy libraries (PDF-lib, PDF.js, Canvas, OCR) load exclusively on-demand upon first user interaction.
4. **Zero-CLS Container Reservation**: Every dynamic element (tool workspaces, ad slots, preview canvas) has pre-reserved dimensions using CSS `contain-layout` and intrinsic aspect ratios.
5. **Aggressive Immutable Caching**: Static bundles receive `public, max-age=31536000, immutable`.
