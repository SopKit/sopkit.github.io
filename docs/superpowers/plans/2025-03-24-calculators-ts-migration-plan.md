# Calculators TypeScript Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all TypeScript errors in five calculator components by defining interfaces, typing event handlers, and handling nulls.

**Architecture:** Senior-level TypeScript implementation using React types and explicit interfaces for state management.

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide React, Shadcn UI.

---

### Task 1: AcademicGradesCalculator.tsx Migration

**Files:**
- Modify: `src/components/tools/calculators/AcademicGradesCalculator.tsx`

- [ ] **Step 1: Define Interfaces and Props**
```typescript
interface SgpaCourse {
    id: number;
    credits: number;
    grade: number;
}

interface CgpaSemester {
    id: number;
    sgpa: string;
}

interface RequiredMarksResult {
    marks: number;
    percent: string | number;
}

interface Props {
    defaultTab?: "sgpa" | "cgpa" | "cgpa-pct" | "req-marks";
}
```

- [ ] **Step 2: Update Component Definition and State**
Update the component signature to use `Props` and type the `useState` calls for `sgpaCourses` and `cgpaSemesters`.

- [ ] **Step 3: Type Event Handlers and Helpers**
Type `id`, `field`, `val` in `updateSgpaCourse`, `updateCgpaSem`, and other helpers.

- [ ] **Step 4: Verify with TSC**
Run: `npx tsc src/components/tools/calculators/AcademicGradesCalculator.tsx --noEmit --jsx react-jsx --esModuleInterop --skipLibCheck`
Expected: Success

### Task 2: AttendanceCalculator.tsx Migration

**Files:**
- Modify: `src/components/tools/calculators/AttendanceCalculator.tsx`

- [ ] **Step 1: Type Event Handlers**
Use `React.ChangeEvent<HTMLInputElement>` for `onChange` handlers.

- [ ] **Step 2: Verify with TSC**
Run: `npx tsc src/components/tools/calculators/AttendanceCalculator.tsx --noEmit --jsx react-jsx --esModuleInterop --skipLibCheck`
Expected: Success

### Task 3: BmiIdealWeightCalculatorTool.tsx Migration

**Files:**
- Modify: `src/components/tools/calculators/BmiIdealWeightCalculatorTool.tsx`

- [ ] **Step 1: Type the useMemo Result**
Explicitly type the return object of `useMemo`.

- [ ] **Step 2: Type Event Handlers**
Use `React.ChangeEvent<HTMLInputElement>` for `onChange`.

- [ ] **Step 3: Verify with TSC**
Run: `npx tsc src/components/tools/calculators/BmiIdealWeightCalculatorTool.tsx --noEmit --jsx react-jsx --esModuleInterop --skipLibCheck`
Expected: Success

### Task 4: BmrCalculatorTool.tsx Migration

**Files:**
- Modify: `src/components/tools/calculators/BmrCalculatorTool.tsx`

- [ ] **Step 1: Define BmrResult Interface**
```typescript
interface BmrResult {
    mifflin: number;
    harris: number;
}
```

- [ ] **Step 2: Type result State**
`const [result, setResult] = useState<BmrResult | null>(null);`

- [ ] **Step 3: Type Select components**
Type the `onValueChange` parameters (strings).

- [ ] **Step 4: Verify with TSC**
Run: `npx tsc src/components/tools/calculators/BmrCalculatorTool.tsx --noEmit --jsx react-jsx --esModuleInterop --skipLibCheck`
Expected: Success

### Task 5: BodyFatCalculatorTool.tsx Migration

**Files:**
- Modify: `src/components/tools/calculators/BodyFatCalculatorTool.tsx`

- [ ] **Step 1: Define BodyFatResult Interface**
```typescript
interface BodyFatResult {
    bodyFat: number;
    fatMass: number;
    leanMass: number;
    category: string;
    unit: string;
}
```

- [ ] **Step 2: Type result State**
`const [result, setResult] = useState<BodyFatResult | null>(null);`

- [ ] **Step 3: Type Event Handlers**
Use `React.ChangeEvent<HTMLInputElement | HTMLSelectElement>` for native elements and `(value: string) => void` for Shadcn `Select`.

- [ ] **Step 4: Verify with TSC**
Run: `npx tsc src/components/tools/calculators/BodyFatCalculatorTool.tsx --noEmit --jsx react-jsx --esModuleInterop --skipLibCheck`
Expected: Success
