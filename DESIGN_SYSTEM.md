# SopKit Editorial Design System

A centralized, editorial design system engineered for high-density utility applications, fast discovery, and a calm reading experience.

---

## 1. Visual Philosophy & Core Direction

SopKit pairs high-contrast **Editorial Serif typography** (`Newsreader`) with a clean, modern **sans-serif** (`Inter`) and a warm, natural cream/white light mode canvas (`45 15% 98%`) alongside an obsidian dark mode (`240 10% 4%`).

Key principles:
1. **Typography as Articulation**: Large display and page titles use classic editorial serif with italic emphasis; technical data, controls, and body copy use precision geometric sans.
2. **Pill-Centric Navigation & Actions**: Segmented capsule navigation bars and high-contrast pill action buttons with directional indicator icons (`ArrowUpRight` ↗).
3. **Fanned & Tilted Showcase Cards**: Interactive preview elements displayed with subtle organic rotations, layered shadows, and paper-tear transition accents.
4. **Honest Copy**: Zero fake metrics, zero unverifiable benchmark claims, and zero aggressive sales jargon. Every word serves search intent and user trust.

---

## 2. Design Tokens (`src/lib/design-system/tokens.ts`)

### Typography Scale
- **Display**: `font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95]`
- **Page Title**: `font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05]`
- **Section Title**: `font-serif text-2xl sm:text-3xl md:text-4xl tracking-tight leading-snug`
- **Card Title**: `font-sans text-base sm:text-lg font-semibold tracking-tight`
- **Body**: `font-sans text-sm sm:text-base leading-relaxed text-muted-foreground`
- **Body Small**: `font-sans text-xs sm:text-sm leading-normal text-muted-foreground`
- **Label**: `font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground`
- **Code**: `font-mono text-xs sm:text-sm`
- **Caption**: `font-mono text-[11px] uppercase tracking-widest text-muted-foreground`

### Semantic Surface & Color Tokens (HSL CSS Variables)
| Token | Light Mode (Warm Canvas) | Dark Mode (Obsidian) | Purpose |
|---|---|---|---|
| `--background` | `45 15% 98%` | `240 10% 4%` | Base application canvas |
| `--foreground` | `240 10% 10%` | `0 0% 98%` | Primary text and headings |
| `--surface` | `0 0% 100%` | `240 10% 6%` | Standard card surface |
| `--surface-muted` | `45 10% 95%` | `240 10% 9%` | Inset backgrounds, secondary strips |
| `--surface-elevated` | `0 0% 100%` | `240 10% 12%` | Modals, flyouts, and floating pills |
| `--border` | `45 10% 88%` | `240 6% 16%` | Primary structural borders |
| `--primary` | `240 10% 10%` | `0 0% 98%` | High-contrast actions |
| `--primary-foreground`| `0 0% 98%` | `240 10% 10%` | Contrast text on primary |
| `--accent` | `24 95% 53%` | `24 95% 53%` | Subtle warm amber branding accent |

### Radius Scale
- `sm`: `rounded-md` (Badges, inner controls)
- `md`: `rounded-xl` (Inputs, buttons, small cards)
- `lg`: `rounded-2xl` (Standard panels, showcase cards)
- `xl`: `rounded-3xl` (Large callout containers)
- `full`: `rounded-full` (Capsule navbar, pill buttons, filter chips)

---

## 3. Foundational Primitives

### Universal Container (`<Container>`)
Path: `src/components/layout/Container.tsx`
Sizes:
- `sm`: `max-w-2xl`
- `md`: `max-w-4xl`
- `lg`: `max-w-5xl`
- `xl`: `max-w-7xl` (Default)
- `full`: `max-w-full`

### Section Rhythm (`<Section>`)
Path: `src/components/layout/Section.tsx`
Rhythms:
- `compact`: `py-8 sm:py-12`
- `default`: `py-12 sm:py-16 md:py-20`
- `loose`: `py-16 sm:py-24 md:py-32`
- Supports `divided` prop for subtle top border division.

### Pill Action Button (`<PillButton>`)
Path: `src/components/ui/pill-button.tsx`
Variants:
- `primary`: Solid contrast pill (black in light mode, white in dark mode)
- `secondary`: Muted surface pill
- `outline`: Bordered pill
- `ghost`: Transparent pill
- Supports optional `withArrow` prop which renders the tilted arrow icon `ArrowUpRight` (↗).

### Header & Navigation (`<Header>`)
Path: `src/components/layout/Header.tsx`
Features:
- Floating capsule navigation with dynamic scroll blur.
- Global ⌘K search trigger targeting `<ToolDirectorySection>`.
- Responsive mobile drawer.

### Footer (`<Footer>`)
Path: `src/components/layout/Footer.tsx`
Features:
- Editorial layout with Tool Suites, Platform, and Trust & Legal columns.
- Client-side execution badge and interactive language selector.

---

## 4. Interactive Tool Design System (`src/components/tools/shared/design-system/`)

All interactive tool interfaces in `src/components/tools/**` must consume tokens from:
```tsx
import { DS, ToolShell, ToolGrid, ToolPanel, ToolDropzone } from "@/components/tools/shared/design-system";
```
- `DS.shell`: `w-full max-w-4xl mx-auto space-y-8`
- `DS.grid`: `grid grid-cols-1 md:grid-cols-12 gap-8` (7-col workspace + 5-col preview/results)
- `DS.dropzone`: Standardized keyboard-accessible dashed dropzone.
- `DS.tabs`: Standard segmented control for tool modes.
