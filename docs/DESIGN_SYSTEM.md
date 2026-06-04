# SopKit Design System

## Source of Truth

- Tokens and reusable component utilities: `src/styles/design-system.css`
- Global mapping into Tailwind semantic colors: `src/app/globals.css`
- Core UI primitives: `src/components/ui/button.jsx`, `src/components/ui/card.jsx`

## Design Direction

- Clean and minimal visual language
- Premium but restrained surfaces and shadows
- Accessible contrast and focus states
- Consistent spacing and readable typography
- Apple-inspired glassmorphism design system

## Core Tokens

- Semantic colors: `--background`, `--foreground`, `--card`, `--primary`, `--muted`
- Layout: `--space-section`, `--space-block`, `--text-measure`
- Surface: `--surface-1`, `--surface-2`, `--surface-elevated`
- Elevation: `--shadow-soft`, `--shadow-card`

## Reusable Classes

- `.ds-page`: Root page surface and text baseline
- `.ds-container`: Consistent content width container
- `.ds-section`: Vertical section spacing
- `.ds-prose`: Readable line length and body rhythm
- `.ds-surface`: Premium card/surface shell
- `.ds-interactive`: Subtle premium hover motion
- `.ds-heading`: Heading rhythm
- `.ds-eyebrow`: Compact label style
- `.ds-divider`: Visual section divider

## SEO/UX Notes

- Better readability improves engagement and reduces pogo-sticking risk
- Strong focus-visible styles improve accessibility signals
- Reduced-motion support improves usability and stability
- Tokenized system keeps styling consistent across 405+ tool pages
- Semantic HTML structure supports screen readers and search engines

## Usage Example

```jsx
<section className="ds-section">
  <div className="ds-container">
    <p className="ds-eyebrow">Utility</p>
    <h1 className="ds-heading text-balance text-4xl font-semibold">URL Shortener</h1>
    <p className="ds-prose mt-4">Create short, trackable links with custom aliases.</p>
  </div>
</section>
```
