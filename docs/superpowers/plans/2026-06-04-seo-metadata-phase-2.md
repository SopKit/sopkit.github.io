# SEO Metadata Implementation Phase 2

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve SEO metadata sitewide by fixing the "About" page and enhancing the programmatic tool page generation script.

**Architecture:** Surgical updates to page-level metadata and script-based batch updates for tool pages.

**Tech Stack:** Next.js (Metadata API), Node.js (fs, path).

---

### Task 1: Fix About Page Metadata

**Files:**
- Modify: `src/app/(company)/about/page.tsx`

- [ ] **Step 1: Update metadata in `src/app/(company)/about/page.tsx`**
    - Change `title` to: `About SopKit - 365+ Free Online Tools for PDF, Image, Video & More`
    - Change `description` to: `Learn about SopKit, your privacy-first toolkit with 365+ free online tools. We offer browser-based PDF, image, video, SEO, and developer utilities with no signup required.`
    - Update `openGraph.title`, `openGraph.description`, `twitter.title`, and `twitter.description` accordingly.

### Task 2: Enhance Tool Page Generation Script

**Files:**
- Modify: `scripts/fix-all-tool-pages.cjs`

- [ ] **Step 1: Update `generatePageContent` in `scripts/fix-all-tool-pages.cjs`**
    - Improve `title` generation logic to be more descriptive.
    - Improve `description` generation logic to include more benefits and category-specific context if possible.

### Task 3: Execute Batch Update

**Files:**
- Run: `node scripts/fix-all-tool-pages.cjs`

- [ ] **Step 1: Run the script**
    - Execute `node scripts/fix-all-tool-pages.cjs` from the project root.
    - Capture and verify the output.

- [ ] **Step 2: Verify a few generated files**
    - Check if the metadata in a few newly updated `page.tsx` files looks correct.
