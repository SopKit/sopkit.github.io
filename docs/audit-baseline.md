# SopKit Engineering Audit Baseline & Findings Inventory

**Baseline Commit SHA:** `caafc551699cec219a685df48d64195b195f76ce`  
**Date of Audit:** September 17, 2026  
**Package Manager:** Bun v1.3.11  
**Runtime / Deployment Target:** Next.js 16 (Static Export for GitHub Pages, with Cloudflare Pages fallback)

---

## 1. Baseline Verification Commands

The following commands were executed against the clean repository at baseline commit `caafc551699cec219a685df48d64195b195f76ce`:

| Command | Status | Details |
|---|---|---|
| `bun run typecheck` | ✅ PASSED | `tsc --noEmit` completed with 0 errors. |
| `bun run test:arch` | ✅ PASSED | 28 tests passed across 8 test suites (Registry, Budgets, Search, SEO Metadata, Schema, File Validation, Headers, SSRF). |
| `bun run validate:registry` | ✅ PASSED | Verified 618 tools across 19 categories with 0 duplicate IDs or routes. |
| `node scripts/test-packages.js` | ✅ PASSED | All 9 workspace packages (`@sopkit/base64`, `uuid`, `slug`, `json`, `color`, `validator`, `password`, `xml`, `jwt`) compiled and passed native tests in 12.05s. |

---

## 2. Prioritized Findings Table

| Priority | Area | File & Line | Evidence | User Impact | Proposed Fix | Verification | Status |
|---|---|---|---|---|---|---|---|
| **P0** | Privacy / Tracking | `src/app/layout.tsx`, `src/components/layout/Footer.tsx` | Footer said "zero tracking"; layout unconditionally loaded GA4, Clarity, OneDollarStats, and AdSense. | Users were misled by false privacy claims while trackers loaded unconditionally. | Removed absolute claims; disclosed analytics; gated AdSense behind `NEXT_PUBLIC_ENABLE_ADS === "true"`. | Verified layout scripts, metadata, and footer trust copy. | **Resolved** |
| **P0** | Privacy / External API | `src/app/(generators)/ai-image-generator/page.tsx`, `AIImageGeneratorTool.tsx` | Page advertised "100% client-side", "no AI training", but called Pollinations.ai with user prompt. | Inaccurate privacy promise; user prompt sent to third party without disclosure. | Labeled as external API; disclosed Pollinations.ai & prompt transmission before submission; removed false claims. | Verified UI disclosure banner and page metadata. | **Resolved** |
| **P0** | Privacy Policy | `src/app/(company)/privacy/page.tsx` | Metadata claimed "SopKit collects nothing", while body acknowledged analytics and proxies without naming providers. | Policy contradicted metadata and implementation. | Rewrote policy with truthful inventory of analytics, ads, local vs external execution models, and data choices. | Inspected updated privacy policy. | **Resolved** |
| **P0** | Build Safety | `next.config.mjs`, `.github/workflows/deploy-pages.yml` | `typescript: { ignoreBuildErrors: true }` ignored type errors during build. CI lacked pre-build checks. | TypeScript errors could leak into production undetected. | Set `ignoreBuildErrors: false`; added `bun run typecheck`, `test:arch`, and `validate:registry` to CI. | Verified `bun run typecheck` passes with zero errors. | **Resolved** |
| **P0** | Telemetry PII Hygiene | `src/lib/analytics.ts` | `trackPageView()` sent full URLs with query strings/hashes; `trackSearch()` sent raw query; `trackOutboundClick()` sent full query params. | Exposure risk of sensitive tokens, user search inputs, and credentials in telemetry. | Sanitized page views to pathname only; redacted API keys/tokens/emails from search; sanitized error codes and outbound links. | Verified 4 unit tests in `tests/unit/analytics.test.ts`. | **Resolved** |
| **P0** | Image Compressor Correctness | `src/components/tools/image/ImageCompressorTool.tsx` | When target KB could not be reached, code marked `status: "done"` with success toast. | Users were misled into thinking target file size was achieved. | Added `target-unattainable` status, truthful reporting when target KB is unreachable without resizing, setting change invalidation, and URL revocation. | Verified 3 unit tests in `tests/unit/compressor.test.ts`. | **Resolved** |
| **P0** | Credential Tool Ad Exclusions | `src/data/monetization.ts`, `src/app/layout.tsx` | Ad exclusions omitted password generators, tokens, and API credential tools. Layout loaded AdSense globally. | Ads or session replay could appear on sensitive credential tools. | Added password generator, API key tester, JWT debugger, token, hash, and encryption tools to risky lists; gated ad script. | Verified monetization policy decisions and ad gating. | **Resolved** |
| **P1** | Client Payload Bloat | `src/app/(landing)/page.tsx`, `HeroSection.tsx`, `ToolDirectorySection.tsx` | Homepage passed full `Tool` objects (articles, FAQs, howtos) to client components; `HeroSection` imported `getAllTools()`. | Massive RSC payload and client bundle bloat. | Created lightweight `SearchToolRecord` type; passed minimal records; removed client-side `getAllTools()` import. | Verified `bun run typecheck` and `test:arch`. | **Resolved** |
| **P1** | Footer Bundle Bloat | `src/components/layout/Footer.tsx`, `src/constants/routes.ts` | Client-side `Footer.tsx` imported `getRouteById` from `@/lib/tools`, bundling 355 KiB `tools.json`. | Unnecessary ~355 KiB JSON imported in global client footer. | Created static route constants; refactored footer to import static routes, eliminating `tools.json` dependency. | Inspected imports and client bundle tree. | **Resolved** |
| **P1** | Placeholder Ad Slot IDs | `src/constants/config.ts`, `AdPlacement.tsx` | AdSense slot IDs were sequential mock placeholders (`9876543210`–`9876543215`). | Attempting to render unverified ad slots caused failed requests and layout churn. | Documented mock IDs; added `isValidAdSenseSlotId()`; skipped rendering unverified slots cleanly. | Verified `AdPlacement` ignores mock IDs. | **Resolved** |
| **P1** | AdSlot Dynamic Layout Shift | `src/components/ads/AdSlot.tsx` | `AdSlot` reserved space, then abruptly returned `null` after timeout when unfilled, shifting content. | High Cumulative Layout Shift (CLS) on slow or blocked ad requests. | Maintained CSS layout containment (`contain-intrinsic-size`, fixed min-height) when unfilled instead of dynamic null collapse. | Verified layout containment in `AdSlot.tsx`. | **Resolved** |
| **P1** | Structured Data Reliability | `src/components/shared/StructuredData.tsx` | `includeFAQ` ignored on tool pages; fallback FAQs claimed local-only for all tools; hardcoded 2024 dates; unvalidated ratings defaulted to 5; unproven 65% claim; duplicate schemas. | Inaccurate JSON-LD emitted to search engines. | Respected `includeFAQ`; tailored fallback FAQ to execution type; validated ratings; omitted fake dates; deduplicated global schemas; sanitized JSON-LD. | Verified schema output and test suites. | **Resolved** |
| **P1** | Service Worker Registration | `src/components/shared/PWARegistration.tsx` | Registered only on `window.addEventListener("load")`. Late hydration missed registration. | PWA offline caching failed on late-mounted navigation. | Registered immediately if `document.readyState === "complete"` or on `load`, with clean event listener teardown. | Verified lifecycle hooks in `PWARegistration.tsx`. | **Resolved** |
| **P1** | Search Accessibility | `ToolDirectorySection.tsx`, `HeroSection.tsx` | Directory input lacked `aria-label`; hero suggestions lacked WAI-ARIA combobox/listbox/option attributes; directory counter was misleading. | Screen-reader and keyboard accessibility failures. | Added `aria-label`, full combobox/listbox/option ARIA attributes, and accurate displayed counter (`Showing ${visibleCount} of ${totalCount}`). | Inspected DOM ARIA attributes and counter. | **Resolved** |
| **P1** | CI Quality Gates | `.github/workflows/deploy-pages.yml` | CI ran `bun run build` directly without running typecheck or arch tests. | Broken types or regressions could deploy to production. | Added `bun run typecheck`, `bun run test:arch`, and `bun run validate:registry` before build step in CI. | Verified workflow configuration. | **Resolved** |
| **P2** | SEO Metadata Generator | `src/lib/seo.ts` | `generateToolMetadata()` defaulted to claiming data never leaves device even for external tools. | Risk of generating false privacy claims on future tools. | Tailored fallback description to tool capability (`tool.executionType`). | Verified `generateToolMetadata` branching. | **Resolved** |

---

## 3. Tool Processing Model Taxonomy

To ensure truthful disclosures and prevent false claims, tools are categorized by execution model:

1. **`client` (Browser-Only / WebAssembly)**:
   - *Behavior:* Data is processed entirely inside the user's browser (HTML5 Canvas, WebAssembly, Web Audio API, etc.). Zero server uploads.
   - *Examples:* Image Compressor, PDF Merger, JSON Formatter, Base64 Encoder, UUID Generator.
   - *Disclosure:* "Processed locally in your browser sandbox. No file uploads."

2. **`external` (External AI / Third-Party API)**:
   - *Behavior:* Requests and inputs (e.g. text prompts) are sent directly to external service providers for processing.
   - *Examples:* AI Image Generator (`Pollinations.ai`).
   - *Disclosure:* "External Processing: Prompts are processed by Pollinations.ai. Avoid entering sensitive or confidential data."

3. **`server` / `proxy` (Edge Proxy Utilities)**:
   - *Behavior:* Network requests that cannot be made directly from client due to CORS are proxied through edge functions (e.g. HTTP Header Checker, DNS Lookup).
   - *Disclosure:* "Network request processed via secure edge proxy. Payloads are not persistently stored."
