# SEO Fix Implementation Plan (Phase 1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix Next.js static generation bailouts and improve SEO crawlability by updating navigation links and wrapping search-dependent components in Suspense.

**Architecture:** 
- Wrap `BreadcrumbsEnhanced` in `Suspense` in `ToolLayout.jsx`.
- Update `categories` in `AppleNavbar.tsx` to use static routes instead of search queries.

**Tech Stack:** React, Next.js (Static Export), TypeScript.

---

### Task 1: Wrap BreadcrumbsEnhanced in Suspense in ToolLayout.jsx

**Files:**
- Modify: `src/components/tools/shared/ToolLayout.jsx`

- [ ] **Step 1: Import Suspense from react**
- [ ] **Step 2: Wrap BreadcrumbsEnhanced in Suspense**

```javascript
import { Suspense } from "react";
// ...
<Suspense fallback={<div className="h-6 w-64 bg-muted/20 animate-pulse rounded" />}>
    <BreadcrumbsEnhanced
        customBreadcrumbs={breadcrumbs}
        suppressSchema={true}
    />
</Suspense>
```

- [ ] **Step 3: Verify the file structure and import**

### Task 2: Update category links in AppleNavbar.tsx

**Files:**
- Modify: `src/components/navigation/AppleNavbar.tsx`

- [ ] **Step 1: Update the categories array**

```typescript
const categories = [
    { name: "Image", href: "/image-tools/" },
    { name: "PDF", href: "/pdf-tools/" },
    { name: "Video", href: "/video-tools/" },
    { name: "Developer", href: "/developer-tools/" },
];
```

- [ ] **Step 2: Verify the links match the requested static hub pages**

### Task 3: Verification

- [ ] **Step 1: Run linting/type checking if available**
- [ ] **Step 2: Verify the code compiles**

Run: `npm run build` or `npm run dev` (if possible in this env) to check for errors.
Since we can't run full builds easily, we'll check with a simple lint command if exists.
