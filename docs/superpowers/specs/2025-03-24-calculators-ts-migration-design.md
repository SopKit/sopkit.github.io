# Design Spec: TypeScript Migration for Calculators

## Goal
Convert five calculator components from JavaScript (renamed to `.tsx`) to fully typed TypeScript, resolving all TS errors (TS2339, TS7006, TS18047).

## Components to Update
1. `AcademicGradesCalculator.tsx`
2. `AttendanceCalculator.tsx`
3. `BmiIdealWeightCalculatorTool.tsx`
4. `BmrCalculatorTool.tsx`
5. `BodyFatCalculatorTool.tsx`

## Core Requirements
- **Define Interfaces**: Create `interface` for complex state objects.
- **Type Event Handlers**: Use appropriate React event types.
- **Handle Nulls**: Use optional chaining or guard clauses.
- **Fix Types**: Ensure numbers and strings are correctly handled in state and calculations.

## Component-Specific Designs

### AcademicGradesCalculator
- `interface SgpaCourse { id: number; credits: number; grade: number; }`
- `interface CgpaSemester { id: number; sgpa: string; }`
- `interface RequiredMarksResult { marks: number; percent: string | number; }`
- Props: `interface Props { defaultTab?: "sgpa" | "cgpa" | "cgpa-pct" | "req-marks"; }`

### AttendanceCalculator
- Input event types: `React.ChangeEvent<HTMLInputElement>`.
- Internal logic using `parseInt` and `parseFloat` with defaults.

### BmiIdealWeightCalculatorTool
- `useMemo` result type: `{ bmi: string; cat: string; ideal: string; }`.

### BmrCalculatorTool
- `interface BmrResult { mifflin: number; harris: number; }`
- State: `const [result, setResult] = useState<BmrResult | null>(null);`

### BodyFatCalculatorTool
- `interface BodyFatResult { bodyFat: number; fatMass: number; leanMass: number; category: string; unit: string; }`
- State: `const [result, setResult] = useState<BodyFatResult | null>(null);`

## Verification Strategy
- Run `tsc --noEmit` on the modified files.
- Manual verification of calculation logic to ensure no regressions.
