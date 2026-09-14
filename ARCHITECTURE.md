# SopKit System Architecture

An overview of the architectural patterns, structural hierarchy, and technical standards governing SopKit.

---

## 1. Directory Structure & Responsibilities

```
sopkit.github.io/
├── src/
│   ├── app/                               # Next.js App Router (pages, layouts, routes)
│   │   ├── (landing)/page.tsx             # Editorial landing page
│   │   ├── (image)/image-tools/           # Image suite pillar hub
│   │   ├── (pdf)/pdf-tools/               # PDF suite pillar hub
│   │   ├── tools/page.tsx                 # Full 600+ tool directory
│   │   ├── embed-tool/                    # Ad-free iframe embed route
│   │   └── layout.tsx                     # Root application layout (Newsreader + Inter)
│   ├── components/
│   │   ├── layout/                        # Global layout primitives
│   │   │   ├── Container.tsx              # Universal container sizes (sm to full)
│   │   │   ├── Section.tsx                # Standardized vertical rhythm & dividers
│   │   │   ├── PageShell.tsx              # Unified application shell
│   │   │   ├── Header.tsx                 # Floating capsule navigation
│   │   │   └── Footer.tsx                 # High-density editorial footer
│   │   ├── marketing/                     # Modern landing & discovery modules
│   │   │   ├── HeroSection.tsx            # Editorial hero with fanned preview cards
│   │   │   ├── CategoryShowcase.tsx       # Curated category portal
│   │   │   ├── ToolDirectorySection.tsx   # Live searchable directory with filter pills
│   │   │   ├── TrustSection.tsx           # Four honest client-side pillars
│   │   │   └── FAQSection.tsx             # Interactive editorial accordion
│   │   ├── tools/                         # 600+ interactive tool implementations
│   │   │   └── shared/
│   │   │       ├── ToolLayout.tsx         # Unified tool layout wrapper
│   │   │       ├── IntentToolDispatcher   # Dynamic dispatcher for client tools
│   │   │       └── design-system/         # Tool UI design system tokens & primitives
│   │   └── ui/                            # Base primitives (shadcn + PillButton)
│   ├── lib/
│   │   ├── design-system/tokens.ts        # Centralized tokens (scale, spacing, shadows)
│   │   ├── tools.ts                       # Registry querying and category helpers
│   │   └── seo.ts                         # Metadata & structured data builders
│   ├── constants/
│   │   ├── config.ts                      # Site-wide constants & feature flags
│   │   └── tools.json                     # Canonical tool metadata registry
│   └── data/
│       └── generated-manual-content.ts    # Manual SEO content source of truth
├── scripts/
│   ├── validate-registry.ts               # Automated registry integrity validation
│   ├── deduplicate-tools.mjs              # Tool metadata deduplication utility
│   └── generate-llms.mjs                  # Generates public/llms.txt and llms-full.txt
├── DESIGN_SYSTEM.md                       # Complete visual design system reference
├── CONTRIBUTING.md                        # Developer contribution guidelines
└── ARCHITECTURE.md                        # This document
```

---

## 2. Client vs Server Component Boundaries

SopKit maximizes server rendering to maintain high Core Web Vitals and search crawler indexability:
- **Server Components (Default)**:
  - Root layout (`src/app/layout.tsx`)
  - Page entry points (`page.tsx`)
  - Tool wrappers (`ToolLayout.tsx`)
  - Structured data (`StructuredData.tsx`)
- **Client Components (`"use client"`)**:
  - Interactive tool workspaces in `src/components/tools/**`
  - Instant search & filter toolbars (`HeroSection.tsx`, `ToolDirectorySection.tsx`)
  - Header scroll detection & mobile drawer (`Header.tsx`)
  - Interactive FAQ accordion (`FAQSection.tsx`)

---

## 3. Tool Registry & Content Separation

SopKit strictly decouples tool metadata from editorial SEO content:
1. **Metadata (`src/constants/tools.json`)**: Contains technical attributes: `id`, `name`, `route`, `category`, `keywords`, and `popularity`.
2. **Editorial Content (`src/data/generated-manual-content.ts`)**: Contains human-written, search-intent copy: `whatItIs`, `features`, `howToUse`, and `faqs`.
3. **Dispatcher (`src/components/tools/shared/IntentToolDispatcher.tsx`)**: Dynamically resolves and mounts the interactive React component for the active tool ID.

---

## 4. Privacy & Sandbox Execution

All interactive utilities process files strictly in the client's browser sandbox:
- **WebAssembly (Wasm)**: Powers heavy media processing (e.g. PDF manipulation via pdf-lib, image compression via mozjpeg/oxipng).
- **HTML5 Canvas & Web Workers**: Perform background transformations without freezing the main UI thread.
- **Zero Upload Policy**: No server routes accept file payloads or log user inputs.
