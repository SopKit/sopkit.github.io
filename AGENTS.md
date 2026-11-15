# AGENTS.md — SopKit Contributor & Architectural Rules

## 1. Tool Design System (Mandatory)

All interactive tool UIs live in `src/components/tools/**` and MUST be composed from the centralized design system (`src/features/tools/ui` or `@/components/tools/shared/design-system`) — never hand-rolled. The DS is built on [Astryx](https://astryx.atmeta.com) (`@astryxdesign/core` + `@astryxdesign/theme-neutral`); theme root lives in `src/components/shared/theme-provider.tsx`, global tokens in `src/app/globals.css`:

```tsx
import {
  ToolShell, ToolGrid, ToolGridMain, ToolGridSide,
  ToolPanel, ToolDropzone, ToolModeTabs,
  ToolField, ToolFileBar, ToolSectionTitle,
  ToolPrivacyNote, ToolPreviewFrame, DS,
} from "@/components/tools/shared/design-system";
```

Rules:
1. Outer wrapper is always `<ToolShell>` (max-w-4xl, standard rhythm). No custom `max-w-* mx-auto` wrappers.
2. File upload is always `<ToolDropzone>` (keyboard accessible, drag-and-drop, clipboard paste, selections announced via a live region; styled with Astryx tokens). No custom dashed `<div onClick>` zones, no raw file inputs.
3. Segmented mode switches are always `<ToolModeTabs>` (Astryx `TabList` with `role="tablist"`: real tablist semantics, roving tabindex).
4. Settings panels are always `<ToolPanel>` (Astryx `Card`) + `<ToolSectionTitle>`; labeled inputs are always `<ToolField>` (Astryx `Field` label over the `Input` adapter).
5. Radii come from Astryx radius tokens: `--radius-container` default (`DS.radius.lg`, also what `rounded-xl` / `rounded-lg` resolve to), `--radius-page` for emphasis (`DS.radius.xl` / `rounded-2xl`), `--radius-full` for pills/chips (`DS.radius.full` / `rounded-full`). No `rounded-3xl` / `rounded-md` / `rounded-sm` and no raw px radii in tool UIs.
6. Base layer is Astryx (`@astryxdesign/core`) via the `src/components/ui` adapters (`Button`, `Input`, `Label`, `Card`, `Select` → `Selector`, `Tabs` → `TabList`, `Dialog`, `DropdownMenu`, `Tooltip`, `Accordion`/`Collapsible`, `Slider`, `Switch`). Adapters keep the familiar compound API; never import `@radix-ui/*` or add cva recipes. Colours use Astryx tokens (`--color-*`) or the semantic Tailwind names mapped to them in `globals.css`. The DS standardizes composition, not primitives.
7. Every tool page keeps exactly one server-rendered `<h1>` (via `ToolLayout`), unique `seoTitle` (≤60 chars) + `seoDescription` (100–160 chars) in `tools.json`, and full FAQ/HowTo/Article JSON-LD (automatic via `StructuredData`). Never add a second H1 inside the tool component.
8. Do not duplicate the privacy sandbox badge inside the tool component — `ToolLayout` already renders it above the tool card.

---

## 2. Platform Architecture Invariants

### Performance Governance (`src/performance/`)
- Every public route has a `PagePerformanceProfile` (`src/performance/page-profile.ts`).
- Budgets: Mobile LCP < 2.5s, TBT < 200ms, CLS < 0.05. Desktop LCP < 1.8s, TBT < 150ms, CLS < 0.03.
- Run `bun run perf:audit` and `bun run test:arch` before every commit.

### Tool Platform (`src/features/tools/`)
- Server-side tool querying via `src/features/tools/registry.ts` (`getToolBySlug`, `getAllTools`, `getRelatedTools`).
- Never import raw 355 KiB `tools.json` directly into client component bundles.
- Heavy processing libraries (PDF-lib, PDF.js, docx, canvas engines) MUST load on-demand after user interaction.

### Security Hardening (`src/server/security/`)
- Remote URL fetches MUST use `safeFetch` (`src/server/security/ssrf.ts`) which strictly blocks loopback, link-local, and RFC 1918 private subnets.
- File uploads MUST pass magic-byte validation and ZIP bomb checks (`src/server/security/file-validation.ts`).
- Filenames must be sanitized against path traversal.

### SEO, AEO & GEO Platform (`src/seo/`)
- Centralized metadata and canonical URL generator: `src/seo/metadata.ts` and `src/seo/canonical.ts`.
- Canonical URLs are normalized to `https://sopkit.space/<slug>/` (trailing slash, matching `trailingSlash: true` on GitHub Pages) without tracking query parameters. Internal links use `pageHref()` from `src/seo/canonical.ts` so they never cost a 301 hop.
- Schema.org JSON-LD structured data generated via `src/seo/structured-data.ts`.

### Monetization & Zero-CLS Policy (`src/features/ads/`)
- `SHOW_SCRIPTLY_ADS = false` globally unless explicitly requested.
- Any ad container rendered MUST use `AdSlot` with pre-reserved CSS layout containment (`contain-intrinsic-size`, fixed min-height). Dynamic zero-to-height ad displacement is strictly forbidden.

---

## 3. Verification Commands

Run before committing:
```bash
# 1. Typecheck the entire application
bun run typecheck

# 2. Run automated architecture, security, and SEO tests
bun run test:arch

# 3. Validate tool registry integrity
npx tsx scripts/validate-registry.ts

# 4. Generate LLM indices
node scripts/generate-llms.mjs
```
- Never run production build commands (`bun run build`, `npm run build`) in the dev terminal.
- Always commit and push directly to `main` upon verification.
