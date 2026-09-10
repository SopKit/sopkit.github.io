# AGENTS.md — SopKit contributor rules

## Tool Design System (mandatory)

All interactive tool UIs live in `src/components/tools/**` and MUST be composed
from the centralized design system — never hand-rolled:

```tsx
import {
  ToolShell, ToolGrid, ToolGridMain, ToolGridSide,
  ToolPanel, ToolDropzone, ToolModeTabs,
  ToolField, ToolFileBar, ToolSectionTitle,
  ToolPrivacyNote, ToolPreviewFrame, DS,
} from "@/components/tools/shared/design-system";
```

Rules:
1. Outer wrapper is always `<ToolShell>` (max-w-4xl, standard rhythm). No custom
   `max-w-* mx-auto` wrappers.
2. File upload is always `<ToolDropzone>` (keyboard accessible, drag-and-drop,
   announced to screen readers). No custom dashed `<div onClick>` zones, no raw
   file inputs.
3. Segmented mode switches are always `<ToolModeTabs>` (real tablist semantics).
4. Settings panels are always `<ToolPanel>` + `<ToolSectionTitle>`; labeled
   inputs are always `<ToolField>` (Label + h-10 Input).
5. Radii: `rounded-xl` default, `rounded-2xl` for emphasis, `rounded-full` for
   pills/chips. No `rounded-3xl` / `rounded-md` / `rounded-sm` in tool UIs.
6. Base layer stays shadcn (`Button`, `Input`, `Label`, `Card`, `Select`,
   `Slider`, `Switch`). The DS standardizes composition, not primitives.
7. Every tool page keeps exactly one server-rendered `<h1>` (via `ToolLayout`),
   unique `seoTitle` (≤60 chars) + `seoDescription` (100–160 chars) in
   `tools.json`, and full FAQ/HowTo/Article JSON-LD (automatic via
   `StructuredData`). Never add a second H1 inside the tool component.
8. Do not duplicate the privacy sandbox badge inside the tool component —
   `ToolLayout` already renders it above the tool card.
9. Validate with `npx tsx scripts/validate-registry.ts` after registry edits and
   keep `bun run typecheck` + `eslint` clean on touched files. Never run
   production builds (`bun run build` / `npm run build`).

## Registry

- `src/constants/tools.json` is the single source of truth for tool metadata.
  Run `node scripts/deduplicate-tools.mjs` after bulk edits.
- Interactive tools must also be mapped in
  `src/components/tools/shared/IntentToolDispatcher.tsx`.
