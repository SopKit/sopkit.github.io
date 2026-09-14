# Contributing to SopKit

Thank you for contributing to SopKit! This guide covers the process for adding new tools, updating existing utilities, and maintaining code quality.

---

## 1. Adding a New Tool Workflow

When creating a new utility, follow these exact steps:

### Step 1: Add Tool Metadata to Registry
Append the tool to `src/constants/tools.json`:
```json
{
  "id": "my-new-tool",
  "name": "My New Tool",
  "route": "/my-new-tool",
  "category": "image",
  "description": "One-line clear description of what this tool accomplishes locally.",
  "keywords": ["tag1", "tag2", "tag3"]
}
```

### Step 2: Add Manual SEO Content
Add a dedicated entry to `src/data/generated-manual-content.ts`:
```ts
"my-new-tool": {
  whatItIs: "A concise, human-written explanation of the tool's purpose and client-side execution.",
  features: [
    "Feature 1: Specific benefit",
    "Feature 2: Format support",
    "Feature 3: 100% local processing"
  ],
  howToUse: {
    steps: [
      "Select or drop your file into the workspace.",
      "Adjust the settings in the control panel.",
      "Download your processed result immediately."
    ]
  },
  faqs: [
    {
      question: "Are my files uploaded anywhere?",
      answer: "No. All computation executes locally inside your browser sandbox."
    }
  ]
}
```

### Step 3: Implement the Tool UI
Create the interactive component under `src/components/tools/<category>/MyNewTool.tsx`.
Always compose using the Tool Design System:
```tsx
import {
  ToolShell,
  ToolGrid,
  ToolGridMain,
  ToolGridSide,
  ToolPanel,
  ToolDropzone,
  ToolSectionTitle,
} from "@/components/tools/shared/design-system";

export default function MyNewTool() {
  return (
    <ToolShell>
      <ToolGrid>
        <ToolGridMain>
          <ToolPanel>
            <ToolDropzone
              onDrop={handleDrop}
              title="Drop your file here"
              subtitle="Supports JPG, PNG, and WebP"
            />
          </ToolPanel>
        </ToolGridMain>
        <ToolGridSide>
          <ToolPanel>
            <ToolSectionTitle>Configuration</ToolSectionTitle>
            {/* Controls */}
          </ToolPanel>
        </ToolGridSide>
      </ToolGrid>
    </ToolShell>
  );
}
```

### Step 4: Map in IntentToolDispatcher
Register the component inside `src/components/tools/shared/IntentToolDispatcher.tsx` to enable iframe embed support.

### Step 5: Create Route Page
Create `src/app/<category-group>/my-new-tool/page.tsx` using `ToolLayout` and `generateToolMetadata()`.

---

## 2. Verification Commands

Before submitting a PR or pushing changes:

```bash
# 1. Validate tool registry integrity (0 duplicates, valid routes)
npx tsx scripts/validate-registry.ts

# 2. Deduplicate tool registry if bulk changes were made
node scripts/deduplicate-tools.mjs

# 3. Regenerate LLM indices
node scripts/generate-llms.mjs

# 4. Run TypeScript compile check
bun x tsc -p tsconfig.json --noEmit
```

> **Warning**: Do not execute production build commands (`bun run build` / `npm run build`) in terminal sessions. Always rely on `bun x tsc -p tsconfig.json --noEmit` and registry validation scripts.
