# SopKit SEO Improvement Roadmap

This roadmap outlines specific strategies to resolve existing search engine optimization conflicts on SopKit, improve page indexation speeds, and capture search traffic.

---

## 🎯 Phase 1: Canonical Signal Unification (Immediate)

### 1. Consistent Trailing Slashes
Next.js outputs static HTML build directories with `trailingSlash: true` configured in `next.config.mjs` (e.g. `/url-encoder-decoder/index.html`).
- **Action**: All alternates canonical URLs, OpenGraph URLs, and Sitemap XML listings must explicitly end with a trailing slash `/`.
- **Reason**: Disagreements in trailing slashes create canonical duplicate index signals, leading search engines to double-crawl and dilute page authority.

### 2. Prune Placeholder Metadata in `/tools/[slug]`
The dynamic route matches `/tools/[slug]` but currently uses a fallback metadata template containing template placeholders (e.g., `title: "Tools/[Slug] Online Free"`).
- **Action**: Update `/tools/[slug]/page.tsx` with dynamic metadata matching the actual slug from the tools database, or set `robots: { index: false }` for unmatched query parameters.

---

## 🚀 Phase 2: Redirect Resolution for GitHub Pages

### 1. Static Redirect Generation
SopKit uses `extraSlugs` for search visibility, but standard server redirects (`_redirects` / `_headers`) are ignored by GitHub Pages.
- **Action**: Run `generate-redirects.cjs` to produce static HTML file structures for all extra slugs. These files will use:
  ```html
  <meta http-equiv="refresh" content="0; url=/target-tool-page/">
  <link rel="canonical" href="https://sopkit.github.io/target-tool-page/">
  ```
- **Reason**: Converts 5,000+ broken 404 targets into valid redirections, preserving link equity and domain rating.

---

## 📊 Phase 3: Core Web Vitals & Hydration Optimization

### 1. Reserve Height for Ad Placements
- **Action**: Wrap Google AdSense slots in wrapper elements with predefined minimum heights (e.g. `min-h-[250px]`).
- **Reason**: Eliminates layout shifts (CLS) when advertising blocks load, improving PageSpeed Insights scoring (which is a core Google ranking signal).

### 2. Static Freshness Timestamps
- **Action**: Avoid dynamically stamping `dateModified: new Date()` on page loads. Instead, feed actual git commit timestamps into sitemap and JSON-LD schema objects.
- **Reason**: Prevents search engines from detecting simulated updates, ensuring true document freshness matches.

---

## 🌐 Phase 4: Generative Engine Optimization (GEO) & Schema Markup

### 1. Complete JSON-LD Schema
- **Action**: Ensure all tool landing pages render both `HowTo` (how to use the tool step-by-step) and `FAQPage` (common questions and answers) schema structures.
- **Reason**: Increases click-through rates (CTR) on traditional SERPs and structures the data for AI search engine crawl ingestion (Gemini, Perplexity, ChatGPT).
