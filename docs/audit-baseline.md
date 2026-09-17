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
| **P0** | Privacy / Tracking | `src/app/layout.tsx:280-330`, `src/components/layout/Footer.tsx:55-60` | Footer says "zero tracking"; layout unconditionally loads GA4 (`G-HKX99R92SE`), Clarity (`uh6y61lx9p`), OneDollarStats (`stonks.js`), and AdSense (`ca-pub-1828915420581549`). | Users are misled by false privacy claims while trackers load unconditionally. | Remove absolute claims ("zero tracking", "100% private"); disclose third-party analytics honestly; gate third-party scripts. | Inspect layout scripts and footer text. | Confirmed |
| **P0** | Privacy / External API | `src/app/(generators)/ai-image-generator/page.tsx:9`, `src/components/tools/generators/AIImageGeneratorTool.tsx:310` | Page metadata advertises "100% client-side", "no AI training", but implementation calls `https://image.pollinations.ai/prompt/...` with user prompt. | Inaccurate privacy promise; user prompt data is sent to a third-party service without disclosure. | Label as external processing; disclose Pollinations.ai and prompt transmission before generation; remove unsupported "no AI training" claims. | Check tool UI disclosure and page metadata. | Confirmed |
| **P0** | Privacy Policy | `src/app/(company)/privacy/page.tsx:8` | Metadata claims "SopKit collects nothing: tools run 100% in your browser", while body describes analytics, server proxies, and API credentials. GA4, Clarity, and AdSense are not named. | Policy contradicts both metadata and actual site implementation. | Rewrite policy with truthful inventory of analytics, ads, local vs external execution models, and data choices. | Review policy text against implementation. | Confirmed |
| **P0** | Build Safety | `next.config.mjs:17` | `typescript: { ignoreBuildErrors: true }` ignores type errors during build. | TypeScript errors can leak into production undetected. | Remove `ignoreBuildErrors: true`; enforce typecheck gate in CI before build. | Run `bun run typecheck`. | Confirmed |
| **P0** | Telemetry PII Hygiene | `src/lib/analytics.ts:47, 58, 198, 207` | `trackPageView()` sends `window.location.href` (including query strings and hashes); `trackSearch()` sends raw query; `trackError()` accepts raw messages; `trackOutboundClick()` sends full destination URL. | Exposure risk of sensitive tokens, user search inputs, and credentials in GA4. | Sanitize `trackPageView` to pathname; redact sensitive tokens from search; sanitize error codes; strip query params from outbound links. | Unit test analytics sanitization. | Confirmed |
| **P0** | Image Compressor Correctness | `src/components/tools/image/ImageCompressorTool.tsx:125-140` | When target KB cannot be reached, code falls back to 0.05 quality and sets `status: "done"`. Batch ends with success toast even if target was missed. | User thinks target size was achieved when it was not. | Introduce distinct statuses: `target-met`, `target-unattainable`, `failed`, and `done`; display actual sizes and explain canvas limits. | Test target KB unreachable cases. | Confirmed |
| **P0** | Credential Tool Ad Exclusions | `src/data/monetization.ts`, `src/app/layout.tsx` | Ad exclusion list covers video/downloaders, but excludes passwords, tokens, API testers, and credentials. Layout loads AdSense everywhere. | Ads or session replay could capture sensitive credential fields. | Add credential tools to risky slugs/categories; disable ads and replay on sensitive tools; gate script loading. | Review monetization decisions for password/token tools. | Confirmed |
| **P1** | Client Payload Bloat | `src/app/(landing)/page.tsx:36, 47`, `src/components/marketing/HeroSection.tsx:86` | Homepage passes full `Tool` objects (with articles, FAQs, howtos) to client components; `HeroSection` imports `getAllTools()` inside client bundle. | Massive RSC payload and client bundle size increase. | Create lightweight `SearchToolRecord` type; pass minimal records to hero and directory; eliminate client import of `tools.json`. | Check client bundle dependencies. | Confirmed |
| **P1** | Footer Bundle Bloat | `src/components/layout/Footer.tsx:7, 34-37` | Client-side `Footer.tsx` imports `getRouteById` from `@/lib/tools` which pulls the 355 KiB `tools.json`. | Unnecessary ~355 KiB JSON imported in global client footer. | Use static route constants directly in footer. | Check footer imports. | Confirmed |
| **P1** | Placeholder Ad Slot IDs | `src/constants/config.ts:21-28`, `src/components/ads/AdPlacement.tsx:108` | AdSense slot IDs are sequential mock placeholders (`9876543210`–`9876543215`). | Attempting to render unverified ad slots produces failed ad requests and layout churn. | Treat mock IDs as unconfigured; hide unconfigured ad placements cleanly without errors or CLS. | Check `AdPlacement` rendering when IDs are mock. | Confirmed |
| **P1** | AdSlot Dynamic Layout Shift | `src/components/ads/AdSlot.tsx:104` | `AdSlot` reserves space, then abruptly returns `null` after 4.5s timeout when unfilled, shifting content. | Causes high Cumulative Layout Shift (CLS) on slow or blocked ad requests. | Maintain stable layout container or collapse gracefully before entering viewport. | Verify layout stability with unfilled state. | Confirmed |
| **P1** | Structured Data Reliability | `src/components/shared/StructuredData.tsx:98, 118, 175, 223, 310` | `includeFAQ` ignored on tool pages; fallback FAQs claim local-only for all tools; hardcoded 2024 date in articles; unverified ratings default to 5; unsubstantiated "over 65%" claim on home FAQ; duplicate WebSite/Org schema on home. | Inaccurate JSON-LD emitted to search engines. | Respect `includeFAQ`; tailor fallback FAQ to tool execution type; validate review ratings; remove unproven statistics; deduplicate home schemas. | Test schema builder output. | Confirmed |
| **P1** | Service Worker Registration | `src/components/shared/PWARegistration.tsx:12` | Registers only on `window.addEventListener("load")`. If component mounts after page load, registration never fires. | PWA offline caching fails to register on late-hydrated navigation. | Check `document.readyState === "complete"` and register immediately, with cleanup. | Check PWA registration logic. | Confirmed |
| **P1** | Search Accessibility | `src/components/marketing/ToolDirectorySection.tsx:80`, `src/components/marketing/HeroSection.tsx:251` | Directory input lacks `aria-label`; hero suggestions lack WAI-ARIA combobox/listbox/option attributes; directory says "Showing N" while rendering up to 48. | Screen-reader and keyboard accessibility failures; confusing displayed count. | Add accessible labels, ARIA combobox pattern, and accurate displayed counter. | Inspect DOM ARIA attributes and counter. | Confirmed |
| **P1** | CI Quality Gates | `.github/workflows/deploy-pages.yml:38` | CI runs `bun run build` directly without running typecheck or arch tests. | Broken types or architectural regressions can deploy to production. | Add `bun run typecheck` and `bun run test:arch` before build step in CI. | Review workflow YAML. | Confirmed |
| **P2** | SEO Metadata Generator | `src/lib/seo.ts:161` | `generateToolMetadata()` defaults to claiming data never leaves device even for external tools. | Risk of generating false privacy claims on new tools. | Tailor fallback description to tool capability (`executionType`). | Test `generateToolMetadata` for external vs client tools. | Confirmed |

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
