# Bulk Add 30 High-Value Tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 30 new high-value tools to SopKit with rich SEO content, modern UI, and high monetization potential.

**Architecture:** 
1. Register tool metadata in `src/constants/tools.json`.
2. Create dynamic SEO opportunities in `src/data/seo-opportunities.ts` (if needed for specific variations).
3. Update `src/components/tools/shared/IntentToolDispatcher.tsx` to map tool IDs to components.
4. Create Next.js page files in `src/app/(category)/[slug]/page.tsx`.
5. Implement new tool components in `src/components/tools/impl/` or relevant category folders.

**Tech Stack:** Next.js (App Router), Tailwind CSS, Lucide Icons, Shadcn UI, React.

---

### Task 1: Resume & Job Tools Implementation

**Files:**
- Modify: `src/constants/tools.json`
- Modify: `src/components/tools/shared/IntentToolDispatcher.tsx`
- Create: `src/components/tools/impl/ResumeATSChecker.jsx`
- Create: `src/components/tools/impl/JobMessageGenerator.jsx`
- Create: `src/app/(text)/resume-ats-score-checker/page.tsx`
- Create: `src/app/(text)/resume-keyword-matcher/page.tsx`
- Create: `src/app/(text)/cover-letter-generator/page.tsx`
- Create: `src/app/(text)/linkedin-headline-generator/page.tsx`
- Create: `src/app/(text)/internship-message-generator/page.tsx`

- [ ] **Step 1: Implement `ResumeATSChecker.jsx` component**
  - Features: Text/File upload for Resume, Text area for Job Description.
  - Logic: Keyword matching, length check, formatting score (simple heuristic).
  - UI: Progress circles, missing keyword list, tips.

- [ ] **Step 2: Implement `JobMessageGenerator.jsx` component**
  - Features: Fields for Name, Role, Company, Skills, Experience.
  - Logic: Template-based generation with variation selection.
  - UI: Result preview with "Copy to Clipboard" button.

- [ ] **Step 3: Register Resume tools in `tools.json`**
  - Add entries for: `resume-ats-score-checker`, `resume-keyword-matcher`, `cover-letter-generator`, `linkedin-headline-generator`, `internship-message-generator`.
  - Include rich metadata (features, faqs, howTo, article).

- [ ] **Step 4: Update `IntentToolDispatcher.tsx`**
  - Map new tool IDs to components.

- [ ] **Step 5: Create page files for Resume tools**

---

### Task 2: Student & University Calculators (Batch 1)

**Files:**
- Modify: `src/constants/tools.json`
- Modify: `src/components/tools/shared/IntentToolDispatcher.tsx`
- Create: `src/app/(calculators)/cgpa-to-percentage-calculator-india/page.tsx`
- Create: `src/app/(calculators)/sgpa-to-cgpa-calculator/page.tsx`
- Create: `src/app/(calculators)/attendance-shortage-calculator/page.tsx`
- Create: `src/app/(calculators)/marks-needed-calculator/page.tsx`

- [ ] **Step 1: Register tools in `tools.json` with rich content**
  - `cgpa-to-percentage-calculator-india`
  - `sgpa-to-cgpa-calculator`
  - `attendance-shortage-calculator`
  - `marks-needed-calculator`

- [ ] **Step 2: Update `IntentToolDispatcher.tsx`**
  - Map new routes to `AcademicGradesCalculator` and `AttendanceCalculator`.

- [ ] **Step 3: Create page files**

---

### Task 3: Exam Photo & Signature Resizers (Fix & Add)

**Files:**
- Modify: `src/constants/tools.json`
- Modify: `src/components/tools/shared/IntentToolDispatcher.tsx`
- Create: `src/app/(exam-tools)/neet-photo-signature-resizer/page.tsx` (Update existing)
- Create: `src/app/(exam-tools)/ssc-photo-signature-resizer/page.tsx`
- Create: `src/app/(exam-tools)/upsc-photo-resizer-350x350/page.tsx`

- [ ] **Step 1: Enrich `neet-photo-resizer` metadata in `tools.json`**
  - Add missing rich content.

- [ ] **Step 2: Add `ssc-photo-signature-resizer` and `upsc-photo-resizer-350x350` to `tools.json`**

- [ ] **Step 3: Update `IntentToolDispatcher.tsx`**
  - Map new routes to `ExamPhotoResizer`.

- [ ] **Step 4: Create/Update page files**

---

### Task 4: General Image & PDF Tools

**Files:**
- Modify: `src/constants/tools.json`
- Modify: `src/components/tools/shared/IntentToolDispatcher.tsx`
- Create: `src/app/(image)/compress-image-to-exact-kb/page.tsx`
- Create: `src/app/(image)/resize-image-cm-mm-inch/page.tsx`
- Create: `src/app/(image)/passport-photo-maker-india/page.tsx`
- Create: `src/app/(image)/aadhaar-pan-photo-resizer/page.tsx`
- Create: `src/app/(pdf)/compress-pdf-to-exact-kb/page.tsx`
- Create: `src/app/(pdf)/remove-pages-from-pdf/page.tsx`
- Create: `src/app/(pdf)/pdf-to-jpg-converter/page.tsx`
- Create: `src/app/(pdf)/merge-pdf-online/page.tsx`

- [ ] **Step 1: Register all 8 tools in `tools.json`**
- [ ] **Step 2: Update `IntentToolDispatcher.tsx`**
- [ ] **Step 3: Create page files**

---

### Task 5: Finance & Business Tools

**Files:**
- Modify: `src/constants/tools.json`
- Modify: `src/components/tools/shared/IntentToolDispatcher.tsx`
- Create: `src/components/tools/impl/FinanceCalculators.jsx`
- Create: `src/app/(money)/invoice-generator-india/page.tsx`
- Create: `src/app/(money)/gst-calculator-india/page.tsx`
- Create: `src/app/(money)/emi-calculator/page.tsx`
- Create: `src/app/(money)/sip-calculator/page.tsx`
- Create: `src/app/(money)/fd-calculator-india/page.tsx`
- Create: `src/app/(money)/salary-calculator-india/page.tsx`

- [ ] **Step 1: Implement `FinanceCalculators.jsx`**
  - Logic for EMI, SIP, FD, GST, Salary.
- [ ] **Step 2: Register tools in `tools.json`**
- [ ] **Step 3: Update `IntentToolDispatcher.tsx`**
- [ ] **Step 4: Create page files**

---

### Task 6: SEO & Web Tools

**Files:**
- Modify: `src/constants/tools.json`
- Modify: `src/components/tools/shared/IntentToolDispatcher.tsx`
- Create: `src/components/tools/impl/WebTools.jsx`
- Create: `src/app/(seo)/domain-name-generator/page.tsx`
- Create: `src/app/(seo)/website-cost-calculator/page.tsx`
- Create: `src/app/(seo)/seo-title-meta-description-generator/page.tsx`
- Create: `src/app/(seo)/robots-txt-sitemap-generator/page.tsx`

- [ ] **Step 1: Implement `WebTools.jsx`**
- [ ] **Step 2: Register tools in `tools.json`**
- [ ] **Step 3: Update `IntentToolDispatcher.tsx`**
- [ ] **Step 4: Create page files**

---

### Task 7: Final Audit & Money Leak Check

- [ ] **Step 1: Run comprehensive lint and build**
- [ ] **Step 2: Verify all 30 tool URLs load correctly**
- [ ] **Step 3: Ensure rich content (FAQs, etc.) is visible on all new pages**
- [ ] **Step 4: Verify Ad placements are present and follow policy**
