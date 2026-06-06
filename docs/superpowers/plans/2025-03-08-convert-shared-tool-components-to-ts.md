# Conversion of Shared Components to TypeScript Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert shared tool components to TypeScript, ensuring proper type safety for props and internal logic.

**Architecture:** Define interfaces for shared components, utilizing the existing `Tool` interface from `src/lib/tools.ts`. Ensure optionality where required and maintain compatibility with existing usage patterns.

**Tech Stack:** React, TypeScript, Next.js, Lucide React.

---

### Task 1: Update `src/components/seo/BreadcrumbsEnhanced.tsx`

**Files:**
- Modify: `src/components/seo/BreadcrumbsEnhanced.tsx`

- [ ] **Step 1: Define `Breadcrumb` and `BreadcrumbsEnhancedProps` interfaces**

```typescript
import { ChevronRight, Home, LucideIcon } from "lucide-react";

export interface Breadcrumb {
  name: string;
  url: string;
  isLast?: boolean;
  icon?: LucideIcon;
}

export interface BreadcrumbsEnhancedProps {
  customBreadcrumbs?: Breadcrumb[];
  homeText?: string;
  suppressSchema?: boolean;
}
```

- [ ] **Step 2: Apply interfaces and fix internal types**

```typescript
export default function BreadcrumbsEnhanced({
  customBreadcrumbs = [],
  homeText = "Home",
  suppressSchema = false,
}: BreadcrumbsEnhancedProps) {
  // ... update internal functions to use Breadcrumb type
}

export interface RichBreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
  showHome?: boolean;
  showSchema?: boolean;
  className?: string;
  variant?: "default" | "minimal" | "pills";
}

export function RichBreadcrumbs({
  breadcrumbs,
  showHome = true,
  showSchema = true,
  className = "",
  variant = "default",
}: RichBreadcrumbsProps) {
  // ...
}
```

- [ ] **Step 3: Run type check**

Run: `tsc src/components/seo/BreadcrumbsEnhanced.tsx --noEmit --esModuleInterop --skipLibCheck --jsx react-jsx`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/seo/BreadcrumbsEnhanced.tsx
git commit -m "ts: add types to BreadcrumbsEnhanced"
```

### Task 2: Update `src/components/tools/shared/ToolSharedComponents.tsx`

**Files:**
- Modify: `src/components/tools/shared/ToolSharedComponents.tsx`

- [ ] **Step 1: Add types for `ToolFAQ`, `ToolFeatures`, `ToolSteps`**

```typescript
export interface ToolFeaturesProps {
  features?: string[];
}

export const ToolFeatures = ({ features }: ToolFeaturesProps) => {
  // ...
};

export interface ToolStep {
  name: string;
  text: string;
}

export interface ToolStepsProps {
  steps?: ToolStep[];
  toolName: string;
}

export const ToolSteps = ({ steps, toolName }: ToolStepsProps) => {
  // ...
};

export interface FAQ {
  question: string;
  answer: string;
}

export interface ToolFAQProps {
  faqs?: FAQ[];
  toolName: string;
}

export const ToolFAQ = ({ faqs, toolName }: ToolFAQProps) => {
  // ...
};
```

- [ ] **Step 2: Run type check**

Run: `tsc src/components/tools/shared/ToolSharedComponents.tsx --noEmit --esModuleInterop --skipLibCheck --jsx react-jsx`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/tools/shared/ToolSharedComponents.tsx
git commit -m "ts: add types to ToolSharedComponents"
```

### Task 3: Update `src/components/tools/shared/ToolLayout.tsx`

**Files:**
- Modify: `src/components/tools/shared/ToolLayout.tsx`

- [ ] **Step 1: Define `ToolLayoutProps` and `ToolArticleProps`**

```typescript
import { Tool } from "@/lib/tools";
import { Breadcrumb } from "@/components/seo/BreadcrumbsEnhanced";

interface ToolArticleProps {
  content?: string;
}

interface ToolLayoutProps {
  tool: Tool;
  children: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
  relatedTools?: Tool[];
  showHireMe?: boolean;
}
```

- [ ] **Step 2: Update `ToolArticle` component with types**

```typescript
function ToolArticle({ content }: ToolArticleProps) {
  if (!content) return null;
  // ...
}
```

- [ ] **Step 3: Update `ToolLayout` component with types and fix data enrichment**

```typescript
export default function ToolLayout({
  tool,
  children,
  breadcrumbs,
  relatedTools = [],
  showHireMe = false,
}: ToolLayoutProps) {
  // ...
}
```

- [ ] **Step 4: Run type check**

Run: `tsc src/components/tools/shared/ToolLayout.tsx --noEmit --esModuleInterop --skipLibCheck --jsx react-jsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/tools/shared/ToolLayout.tsx
git commit -m "ts: convert ToolLayout to TypeScript"
```
