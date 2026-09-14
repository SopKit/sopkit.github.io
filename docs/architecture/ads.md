# Monetization & Zero-CLS Ad Architecture

## Overview
Monetization on SopKit is built to be **performance-first and layout-shift free**. Poorly integrated advertising scripts and dynamic banner heights are the primary cause of high CLS scores on ad-supported platforms.

```
src/features/ads/
├── policy.ts                  # Route permission engine (strict blocking on tool canvases/embeds)
├── placements.ts              # Pre-reserved layout-contained ad dimensions
├── AdSlot.tsx                 # Zero-CLS React component with contain-intrinsic-size
└── index.ts                   # Public exports
```

## Architectural Invariants
1. **Global Ad Suppression**: Ads are disabled site-wide by default (`SHOW_SCRIPTLY_ADS = false` in `src/constants/config.ts`).
2. **Pre-Reserved Intrinsic Sizing**: If ads are enabled, ad containers are rendered with hard-coded CSS dimensions and `contain-layout` (`style={{ minHeight: "90px", containIntrinsicSize: "728px 90px" }}`). The container never expands or collapses upon ad script injection, guaranteeing **CLS < 0.03**.
3. **Disallowed Routes**:
   - `/embed-tool/*` (clean, unmonetized embedding for external developers)
   - `/api/*` (pure data APIs)
   - `/settings/*` and `/admin/*`
   - Active interactive tool canvases (users must never mistake an ad for a tool output or download button).
