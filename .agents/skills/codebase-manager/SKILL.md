---
name: codebase-manager
description: Manage and maintain the SopKit Next.js codebase, register new tools, manage routes, run registry deduplication, and verify compilation safety.
---

# Codebase Management Skill

Use this skill to safely register new tools, clean up the global registry, map components inside the central dispatcher, and ensure type safety.

---

## 1. Codebase Architecture

SopKit is a data-driven toolkit built on Next.js 16 (App Router) and Tailwind CSS.
*   **Single Source of Truth**: All tools are registered in **[tools.json](file:///Users/shaswatraj/Desktop/earn/sopkit.github.io/src/constants/tools.json)** under their respective categories.
*   **Central Dispatcher**: Interactive tools must be mapped inside **[IntentToolDispatcher.tsx](file:///Users/shaswatraj/Desktop/earn/sopkit.github.io/src/components/tools/shared/IntentToolDispatcher.tsx)** to allow client-side dynamic loading and iframe embedding.

---

## 2. Registering a New Tool

Follow this workflow to add a new tool to SopKit:

1.  **Develop the Interactive Component**:
    *   Create a React component file in `src/components/tools/<category>/` (e.g., `src/components/tools/developer/NewCoolTool.tsx`).
    *   Ensure all components are responsive and style them using modern glassmorphism aesthetics.
2.  **Map in Central Dispatcher**:
    *   Add a dynamic import at the top of **[IntentToolDispatcher.tsx](file:///Users/shaswatraj/Desktop/earn/sopkit.github.io/src/components/tools/shared/IntentToolDispatcher.tsx)**:
        ```typescript
        const NewCoolTool = dynamic(() => import("@/components/tools/developer/NewCoolTool"), { ssr: false });
        ```
    *   Add the registry entry in `INTENT_TOOL_REGISTRY`:
        ```typescript
        "new-cool-tool": { component: NewCoolTool, props: {} },
        ```
3.  **Register in tools.json**:
    *   Add the tool metadata to **[tools.json](file:///Users/shaswatraj/Desktop/earn/sopkit.github.io/src/constants/tools.json)** inside the correct category tools array:
        ```json
        {
          "id": "new-cool-tool",
          "name": "New Cool Tool Name",
          "description": "Short, SEO-optimized explanation of what the tool does.",
          "route": "/new-cool-tool",
          "category": "developer"
        }
        ```
4.  **Create Static Route Page** (if needed for standalone page):
    *   Create `src/app/(developer)/new-cool-tool/page.tsx`.
    *   Import and wrap the component inside `ToolLayout` with metadata.

---

## 3. Maintenance Scripts

SopKit contains built-in helper scripts to automate registry health checks:

*   **Deduplication**: Run `node scripts/deduplicate-tools.mjs` to globally merge duplicate tool registrations, compile unique `extraSlugs`, and deduplicate categories.
*   **Unmapped Scan**: Run `node scripts/find-unmapped-tools.mjs` to list any tools registered in `tools.json` that are still missing from the dispatcher.
*   **LLM Indices**: Run `node scripts/generate-llms.mjs` to re-compile the AI search listings (`/llms.txt` and `/llms-full.txt`).

---

## 4. Verification Constraints

*   **No Production Builds**: Do not run production build commands (`bun run build` / `npm run build`) in the workspace terminal.
*   **Type Safety Check**: To check for any errors before pushing, run `bun run typecheck`.
