# Repo-wide Tool Audit — 2026-10-04 (phase 2)

Reproducible command: `npm run audit:tools` (`node scripts/audit-all-tools.mjs`)
Scope: all **640** registered tools + all **427** tool components.

## Scoreboard (after this change)

| Dimension | Before | After |
| --- | --- | --- |
| Tools audited | 640 | 640 |
| Missing name / route / description | 0 | 0 |
| Missing `seoTitle` / `seoDescription` | 0 | 0 |
| `seoTitle` > 60 chars | 0 | 0 |
| `seoDescription` > 160 chars | **4** | **0** |
| `seoDescription` < 100 chars | 129 | 129 |
| `description` < 80 chars | 11 | 11 |
| Duplicate `seoTitle` / `seoDescription` / `description` | 0 | 0 |
| Routes with **no** `page.tsx` (404 risk) | **0** | **0** |
| Tools with no FAQ content | 11 | 11 |
| Forbidden radii (`rounded-3xl/md/sm`) in tool components | **13 files / 36 uses** | **0** |
| Custom `<input type="file">` not using `ToolDropzone` | 65 | 65 |
| Custom drop zones not using `ToolDropzone` | 1 | 1 |
| Raw `max-w-* mx-auto` wrappers (not `ToolShell`) | 225 | 225 |
| Tool components with a runtime CDN dependency | 7 | 7 |

**P1 issues: 0.**

## Fixes applied this phase

1. **SEO — 4 over-length meta descriptions trimmed to ≤160 chars** (SERP truncation):
   `font-generator`, `rent-receipt-generator`, `gif-generator`, `article-rewriter`.
   Unique content preserved; no duplication introduced.
2. **UI/UX — design-system radius compliance**: replaced all 36 `rounded-md` usages
   across 13 tool components with the DS-compliant `rounded-lg` (per `AGENTS.md` rule 5,
   which forbids `rounded-3xl/md/sm` in tool UIs). Files:
   LoveCalculator, Base64Tool, CodeFormatterTool, CsvColumnExtractorTool,
   HtmlEntityCodecTool, JSONMinifierTool, JSONToSchemaTool, JWTDecoderTool,
   JsonToTypeScriptTool, JsonToYamlTool, TechBroQuoteGeneratorTool,
   ImageCompressorTool, ColorRgbHexTool.

## Confirmed findings NOT fixed (with rationale)

| Finding | Severity | Why not fixed here |
| --- | --- | --- |
| 129 tools with `seoDescription` < 100 chars; 11 `description` < 80 chars | P3 | The existing strings are already unique and descriptive; bulk-rewriting them risks near-duplicate/spammy copy, which is worse for SEO than a short description. Needs editor-per-tool judgement. |
| 11 tools with no FAQ content | P2 | Adding FAQ answers that assert privacy/processing behaviour requires verifying each tool's actual data flow (several are downloaders with external calls). Fabricating answers would create misleading structured data. |
| 65 components use raw `<input type="file">` instead of `ToolDropzone` | P2 | `AGENTS.md` mandates `ToolDropzone`, but mass-converting changes layout and interaction; must be done per component with visual verification (no browser available here). |
| 225 components use raw `max-w-* mx-auto` wrappers instead of `ToolShell` | P3 | Same risk; several are wrapped by `ToolLayout` already. Needs per-component review. |
| 7 tool components still load an engine from a CDN | P2 | No bundled/native equivalent without adding dependencies (`jsQR`, `crypto-js`, `gifshot`) or a pdf.js v3→v6 migration that needs browser testing. See `production-hardening.md` F-003. |
| Pre-existing ESLint errors (unused imports/vars) in tool components | P3 | Not part of the CI/deploy gates (`typecheck`, `test:arch`, `validate:registry`). Out of scope; not introduced by these changes. |

## Verification

- `npm run audit:tools` → 0 P1; the two "before" metrics now read 0.
- `npx tsc --noEmit` → PASS
- `npm run test:arch` → PASS (68 tests)
- `npx tsx scripts/validate-registry.ts` → PASS (640 tools, 0 duplicates)
- `npx tsx scripts/validate-seo-architecture.ts` → PASS
- `src/constants/tools.json` re-parsed successfully after edits
