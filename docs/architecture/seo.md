# SEO, AEO & GEO Architecture

## Mission
Ensure every public route on SopKit maintains supreme search visibility across traditional engines (Google, Bing) and Answer/Generative AI engines (ChatGPT, Perplexity, Gemini, Claude).

```
src/seo/
├── config.ts                  # Centralized site branding & identity
├── types.ts                   # Strongly typed SEO & schema contracts
├── canonical.ts               # Strict canonical URL sanitizer (strips UTMs, normalizes slashes)
├── metadata.ts                # Next.js Metadata generator with OpenGraph & Twitter cards
├── structured-data.ts         # Schema.org JSON-LD builders (WebSite, SoftwareApp, Breadcrumb, FAQ)
├── entities.ts                # Knowledge Graph entity graph linking tools and categories
└── validators.ts              # CI assertions for title length, description length, single H1
```

## Anti-Spam & Quality Invariants
1. **No Generic Placeholders**: Dynamic string interpolation like `Free ${name} online` is forbidden. Tool content must be manually authored and verified.
2. **Dedicated Schema per Entity**:
   - Platform: `WebSite` + `Organization`.
   - Tool pages: `SoftwareApplication` + `BreadcrumbList` + `FAQPage` (only when verified FAQs exist).
   - Category pages: `CollectionPage` + `ItemList` + `BreadcrumbList`.
   - Articles: `Article` + `BreadcrumbList`.
3. **Canonical Normalization**: All canonical URLs strictly resolve to `https://sopkit.space/<slug>` without trailing slashes or tracking parameters.
4. **Agentic Crawlability**: `llms.txt` and semantic HTML landmark trees are maintained to ensure accessibility to AI agents.
