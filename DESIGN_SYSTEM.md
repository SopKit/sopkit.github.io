# SopKit Design System — Astryx

SopKit's UI is built on [Astryx](https://astryx.atmeta.com) (`@astryxdesign/core` with `@astryxdesign/theme-neutral`). Astryx owns every colour, radius, shadow, spacing and type value; SopKit adds layout recipes and a small tool-composition layer on top.

---

## 1. Wiring

- **Theme root**: `src/components/shared/theme-provider.tsx` wraps the app in Astryx `<Theme theme={neutralTheme}>`; `next-themes` writes `data-theme` on `<html>` and Astryx follows it (light / dark / system).
- **Global CSS**: `src/app/globals.css` imports `@astryxdesign/core/reset.css`, `astryx.css` and the neutral theme in the Astryx layer order (Tailwind utilities sit above Astryx so `className` still wins), and maps the semantic Tailwind names (`bg-background`, `text-muted-foreground`, `border-border`, `bg-primary`, `rounded-xl` …) onto Astryx tokens.
- **Primitives**: `src/components/ui/*` are thin adapters over Astryx components that keep the familiar compound API, e.g. `Select` → `Selector`, `Tabs` → `TabList role="tablist"`, `Dialog` → `Dialog`, `DropdownMenu` → `DropdownMenu`, `Tooltip` → `Tooltip`, `Accordion` / `Collapsible` → `CollapsibleGroup` / `Collapsible`. Import Astryx per component (`@astryxdesign/core/Selector`). No `@radix-ui/*`, no cva recipes.

## 2. Tokens (Astryx)

| Purpose | Astryx token | Tailwind alias |
|---|---|---|
| Page canvas | `--color-background-body` | `bg-background` |
| Card / panel surface | `--color-background-card` | `bg-card` |
| Muted / inset surface | `--color-background-muted` | `bg-muted` |
| Popover surface | `--color-background-popover` | `bg-popover` |
| Primary / secondary text | `--color-text-primary` / `--color-text-secondary` | `text-foreground` / `text-muted-foreground` |
| Borders | `--color-border`, `--color-border-emphasized` | `border-border`, `border-input` |
| Accent / focus | `--color-accent`, `--color-on-accent` | `bg-primary`, `ring-ring` |
| Radius | `--radius-inner` · `--radius-element` · `--radius-container` · `--radius-page` · `--radius-full` | `rounded-sm` · `rounded-md` · `rounded-lg`/`rounded-xl` · `rounded-2xl` · `rounded-full` |
| Elevation | `--shadow-low` · `--shadow-med` · `--shadow-high` | `shadow-sm` · `shadow-md` · `shadow-lg` |
| Type | `--font-family-body` / `-heading` / `-code`, `--text-*-size` | `font-sans` / `font-serif` / `font-mono` |

Use the Tailwind alias or the token directly (`bg-(--color-background-card)`); never raw hex/HSL values.

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

All interactive tool interfaces in `src/components/tools/**` compose from:
```tsx
import { DS, ToolShell, ToolGrid, ToolPanel, ToolDropzone, ToolField, ToolModeTabs } from "@/components/tools/shared/design-system";
```
- `ToolShell` / `DS.shell`: `w-full max-w-4xl mx-auto space-y-6`.
- `ToolGrid` / `DS.grid`: `grid grid-cols-1 md:grid-cols-12 gap-6` (7-col workspace + 5-col preview/results).
- `ToolPanel`: Astryx `Card` surface + DS content rhythm.
- `ToolField`: Astryx `Field` label over the `Input` adapter (or a custom control).
- `ToolModeTabs`: Astryx `TabList` (`role="tablist"`, `layout="fill"`).
- `ToolDropzone`: keyboard-accessible drag-and-drop / paste zone styled with Astryx tokens, with a polite live region.
- `DS.radius`: `lg` → `--radius-container`, `xl` → `--radius-page`, `full` → `--radius-full`.
