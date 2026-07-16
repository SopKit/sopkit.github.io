# Codebase Scan (SopKit)

Generated: 2026-07-16

## Scope
Scanned the repository structure at a high level to identify major directories, technologies, and key code areas.

## Top-level layout
- **Next.js / App Router**: `src/app/**`
- **UI components**: `src/components/**`
- **Core configuration/constants/data**:
  - `src/constants/**`
  - `src/data/**`
- **Business logic / helpers**: `src/lib/**`
- **Scripts (build/audit/devops)**: `scripts/**`
- **Shared “stack” utilities** (server/client wrappers): `stack/**`
- **Type declarations**: `types/**`
- **Packages (workspace libraries)**: `packages/**`

## Key directories

### `src/app/**`
Contains route segments and page implementations.
Notable areas:
- **Public Next.js pages**: `src/app/.../page.tsx`
- **Dynamic/API routes**:
  - `src/app/_api/**`
  - `src/app/_handler/**`
- **Tool routes grouped by segments**:
  - Many route groups under `src/app/(...)/...`
  - Includes embed routes under `src/app/embed/**`
  - Tools directory routes under `src/app/tools/**` and `src/app/tools/[slug]/**`

### `src/components/**`
Reusable UI building blocks and tool layouts.
Notable subareas:
- Navigation: `components/navigation/**`
- SEO components: `components/seo/**`
- Shared UI: `components/shared/**`, `components/ui/**`
- Tool page content components: `components/tools/**` (with category subfolders)

### `src/constants/**`
Static configuration used by the app.
Includes:
- `constants/tools.json`
- `constants/directories.json`
- Additional content/config helpers.

### `src/data/**`
Generated/manual content and SEO data.
Includes:
- `data/generated-manual-content.ts`
- `data/seo-opportunities.ts`
- `data/tool-seo-inventory.ts`
- `data/manual/**`

### `src/lib/**`
Core functions for tool rendering/SEO/UX flows.
Includes modules such as:
- `src/lib/tools.ts`
- `src/lib/seo.ts`
- `src/lib/youtube-*` and other tool/action helpers
- `src/lib/ai-services/**`

### `stack/**`
Likely abstraction over framework/runtime concerns:
- `stack/client.ts`
- `stack/server.ts`

### `packages/**`
A monorepo of small, reusable, typed libraries under `@sopkit/*`.
Packages identified:
- `@sopkit/base64`
- `@sopkit/cli`
- `@sopkit/color`
- `@sopkit/json`
- `@sopkit/jwt`
- `@sopkit/password`
- `@sopkit/slug`
- `@sopkit/uuid`
- `@sopkit/validator`
- `@sopkit/xml`

Each package has:
- `src/index.ts`
- `tsconfig.json`
- `tsup.config.ts`
- `test/**`

## Supporting content
### `docs/**`
Documentation for architecture, agents, prompts, and design.
Subfolders:
- `docs/internal/**`
- `docs/superpowers/**`

### `context/**`
Project context/standards:
- code standards
- UI context
- progress tracker
- agents

## Public/runtime assets
### `public/**`
Static assets for Next.js / Cloudflare Pages.
Contains:
- SEO/publish files: `ads.txt`, `opensearch.xml`, `manifest.json`, `browserconfig.xml`
- Generated media: `og-image.*`
- Tool index text blobs: `llms*.txt`
- Icons under `public/icons/**`

## Build & maintenance scripts
### `scripts/**`
Automation for auditing, SEO generation, and release tasks.
Includes:
- `scripts/seo-audit-local.mjs`
- `scripts/find-duplicate-tools.mjs`
- `scripts/find-empty-or-fake-tools.mjs`
- `scripts/generate-icons.cjs`
- `scripts/generate-llms.mjs`
- `scripts/update-all-seo-privacy.mjs`
- `scripts/publish-all.mjs`

## Important top-level project files
- `package.json`
- `next.config.mjs`
- `tailwind.config.js`
- `eslint.config.mjs`
- `tsconfig.json`
- `wrangler.jsonc` (Cloudflare)
- `bun.lock` (runtime lock)

## Notes / limitations
- Ripgrep-based searches were unavailable in this environment, so the scan is structural (directory-level) rather than deep semantic (exact symbol/function matches).
- The scan can be extended to “content-level” scanning by reading key files (routes/layouts/SEO/data loaders) and summarizing responsibilities.


