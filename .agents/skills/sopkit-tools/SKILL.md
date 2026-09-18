---
name: sopkit-tools
description: Best practices, design system invariants, state persistence, and anti-spam SEO rules for SopKit web tools.
---

# SopKit Web Tools Architecture & Guidelines

Every web tool on SopKit (`sopkit.space`) follows strict architectural, UX, accessibility, and SEO standards.

## 1. Tool Design System (Mandatory)

All interactive tool components live in `src/components/tools/**` and MUST be composed from the centralized design system:

```tsx
import {
  ToolShell, ToolGrid, ToolGridMain, ToolGridSide,
  ToolPanel, ToolDropzone, ToolModeTabs,
  ToolField, ToolFileBar, ToolSectionTitle,
  ToolPrivacyNote, ToolPreviewFrame, DS,
} from "@/components/tools/shared/design-system";
```

### Design Invariants:
- **Outer Shell**: Always wrap with `<ToolShell>`. Never use custom `max-w-* mx-auto` containers.
- **Uploads**: Always use `<ToolDropzone>` with drag-and-drop, keyboard navigation, and screen reader announcements.
- **Radii**: `rounded-xl` for standard elements, `rounded-2xl` for hero emphasis, `rounded-full` for badges.
- **Dark Mode**: Never use raw `bg-white` without dark mode overrides (`bg-white dark:bg-slate-900`). Prefer CSS variable-backed classes (`bg-card`, `bg-background`, `border-border`).
- **No Duplicate Headers**: `ToolLayout` already renders the single server-rendered `<h1>` and privacy badge. Do not duplicate H1s or privacy notices inside tool bodies.

## 2. State Persistence (`useToolStorage`)

To provide high-retention UX, always persist user inputs and active configurations in localStorage:

```tsx
import { useToolStorage } from "@/hooks/useToolStorage";
import { ToolAutoSaveIndicator } from "@/components/tools/shared/ToolAutoSaveIndicator";

export default function MyTool() {
  const [input, setInput, isLoaded, clearInput] = useToolStorage("my-tool:input", "");
  // ...
  return (
    <ToolShell>
      <ToolAutoSaveIndicator isSaved={isLoaded} onClear={clearInput} />
      {/* Tool contents */}
    </ToolShell>
  );
}
```

## 3. SEO & Content Governance

- **Single Source of Truth**: All page copy MUST live in `src/data/generated-manual-content.ts` under `MANUAL_TOOL_CONTENT`.
- **No Generic Templates**: Every tool must have unique, human-crafted `whatItIs`, `features`, `howToUse`, and `faqs`.
- **Registration Checklist**:
  1. Add metadata to `src/constants/tools.json`.
  2. Add manual content to `src/data/generated-manual-content.ts`.
  3. Register component in `src/components/tools/shared/IntentToolDispatcher.tsx`.
  4. Create route `src/app/(category)/[slug]/page.tsx` wrapping the tool in `ToolLayout`.
  5. Run verification scripts: `bun run typecheck`, `bun run test:arch`, `bun run validate:registry`.
