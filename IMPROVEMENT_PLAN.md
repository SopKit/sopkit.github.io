# SopKit Improvement Plan — SEO, UX, Performance & Cleanup

_Generated from a 5-agent parallel audit (SEO, UX/UI, Performance/CWV, redundant files, dead code)._
_Deploy target confirmed: **GitHub Pages** static export (`output: "export"`, `trailingSlash: true`), built with **Bun**._

---

## 🔴 P0 — Critical (do first)

### SEO
1. **Broken redirects — 5,107 `extraSlug` URLs return 404 not 301.** `public/_redirects` & `public/_headers` are Cloudflare-only formats; GitHub Pages ignores them. Every historically-indexed/linked SEO slug is a dead 404 → lost link equity + crawl errors. Security headers (HSTS, X-Frame-Options) also never apply.
   - *Fix:* Decide hosting (GitHub Pages vs Cloudflare). If staying on Pages, regenerate per-slug static redirect stubs (`<meta http-equiv="refresh">` + `rel=canonical`) via `scripts/generate-redirects.cjs`, or move to Cloudflare.
2. **Trailing-slash signals disagree site-wide.** `sitemap.ts` emits non-slash URLs (`:81,98,105`) that 301 to slash versions; OG `url` has no slash while `canonical` does (e.g. `(image)/image-compressor/page.tsx:10 vs :18`); JSON-LD forces slash. → sitemap advertises non-canonical URLs for ~600 pages.
   - *Fix:* make sitemap + OG `url` match the trailing-slash canonical.
3. **`/tools/[slug]` ships ~946 thin stubs with literal placeholder metadata** — `title: "Tools/[Slug] Online Free"`, `canonical: ".../tools/[slug]/"`, `robots: index` (`tools/[slug]/page.tsx:9-30`). Crawlers can index garbage.
   - *Fix:* set `robots: noindex`, substitute real values, drop the `route`-based duplicate params.

### Performance (Core Web Vitals = ranking factor)
4. **Unbounded CLS from ads.** `AdPlacement.tsx:77-105` renders `null` then injects a tall card after mount via `useEffect`+`Math.random()`, placed 5× per page with no reserved height (`ToolLayout.tsx:238,256,303,357`).
   - *Fix:* reserve fixed `min-height` per slot; decide ad synchronously (deterministic seed, not effect+random).
5. **AdSense loaded `afterInteractive`** (`layout.tsx:325-329`) competes with hydration (INP) and Auto Ads inject uncontrolled (CLS).
   - *Fix:* `strategy="lazyOnload"`; constrain Auto Ad containers.

### UX
6. **No category navigation — 561 tools hidden behind one search box.** Navbar is marketing labels (`AppleNavbar.tsx:69-75`); only path to tools is search + a grid icon. Search is also hidden on mobile (`:33 hidden md:block`).
   - *Fix:* add a category mega-menu (data already in `layout.tsx:198-221`); expose search on mobile.

---

## 🟠 P1 — High

### Dead code & duplicates (verified by grep — safe deletes)
7. **`src/components/tools/converters/` (24 files) — zero references.** Delete outright.
8. **Duplicate tool components — `design/` folder is dead.** Verified import counts (0 = dead):
   | Keep (used) | Delete (0 refs) |
   |---|---|
   | `developer/CSSGradientTool` (2) | `design/CSSGradientTool` |
   | `image/FaviconGeneratorTool` (3) | `design/FaviconGeneratorTool` |
   | `image/LogoGeneratorTool` (2) | `design/LogoGeneratorTool` |
   | `utilities/PasswordGeneratorTool` (2) | `security/PasswordGeneratorTool` |
   | `utilities/QRCodeGeneratorTool` (2) | `text/QRCodeGeneratorTool` |
   | `developer/UserAgentParserTool` (1) | `utilities/UserAgentParserTool` |
   | `downloaders/YouTubeDownloader` (6) | `youtube/YouTubeDownloader` |
   | `downloaders/YouTubeShortsDownloader` (2) | `youtube/YouTubeShortsDownloader` |

   ⚠️ `code/RegexTesterTool` & `text/RegexTesterTool` both showed 0 via one import path — **investigate before deleting** (may be imported differently). `implementations/` (17 files, 1 ref) vs `impl/` (13 refs) — reconcile.
9. **`TeraboxPlayerTool-fixed.tsx`** leftover patch file — confirm which is imported, delete the other.

### Redundant files / deps (safe, ~1MB + 4 dead packages)
10. Delete tracked junk: `package-lock.json` (508K — CI uses Bun), `scripts/__pycache__/*.pyc`, `seo-implementation/reports/seo-audit-report.json` (424K, already gitignored), `pre-flight-report.json` (84K).
11. `.gitignore` additions: `__pycache__/`, `*.pyc`, `pre-flight-report.json`.
12. Remove dead deps: `next-pwa` (never wired), `wavesurfer.js`, `lamejs`, `audiobuffer-to-wav` (0 imports). Investigate `zod`, `dotenv`.
13. De-dupe identical `og-image.jpg` == `og-image.png` (same md5) — consolidate after fixing ~6 refs.

### SEO consistency
14. **Unify tool count** — currently "300+" / "460+" / "405+" / "90+" / "470+" across schema, llms.txt, hero, search, archive. Derive all from `SITE_CONFIG.toolCountString`.
15. **Purge dead `/all-downloaders` hub refs** (`llms.txt:26`, `seo.ts:237`, `StructuredData.tsx`) — the `_(downloaders)/` folder is a Next private folder (non-routed).
16. **Consolidate `/tools` vs `/archive`** — both render full listing; `/archive` is indexable, absent from sitemap, stale "90+". `noindex` or merge.
17. **Gate the "processed locally / never uploaded" FAQ** (`StructuredData.tsx:108-120`) — currently emitted on server-dependent tools (AI/translate/downloaders) = false claims + boilerplate spam.

### UX polish
18. **Move the interactive tool above the `after-hero` ad** (`ToolLayout.tsx:238` before `:247`) — the tool is below the fold on mobile.
19. **Unify search on the scored API** — `/search` page does plain `.includes()` (`SearchContent.tsx:71-81`) ignoring the ranked `_api/search/route.ts:44-65`.
20. **Fix gradient-text bug** — H1 uses `bg-gradient-to-b` with no `bg-clip-text text-transparent` (`ToolLayout.tsx:225`, `PremiumHero.tsx:29`) → renders a background rectangle, not gradient text.
21. **Category filters must be real `<button>`s** — currently `<Badge onClick>` spans, keyboard/AT-inaccessible (`SearchContent.tsx:151-167`).

---

## 🟡 P2 — Medium / polish

### SEO
22. Fix truncated OG/Twitter descriptions (cut mid-sentence, e.g. `image-compressor/page.tsx:14,23`).
23. Sitelinks `SearchAction` targets `/search` which robots.ts disallows (`StructuredData.tsx:260` vs `robots.ts:14`) — conflicting.
24. Synthetic freshness: every rebuild stamps `dateModified: new Date()` on all pages (`StructuredData.tsx:73`, `feed.xml`). Use real timestamps.
25. Either adopt `src/lib/seo.ts` everywhere (after slash fix) or delete it — 550+ pages hardcode metadata, it's dead + emits wrong-shape canonicals.

### Performance
26. Preconnect/self-host hero logo host `ph-files.imgix.net` (`PremiumHero.tsx:58`) — LCP element on external origin, not preconnected.
27. Compress 600–800KB PNGs → WebP (`public/og-images/*`, `base-icon.png` 458K, `viral-banner.png` 648K).
28. If dropping `output:"export"`, enable image optimization (currently `unoptimized:true`, 115 raw `<img>` vs 1 `next/image`).
29. Trim rarely-used font weights (5 preloaded: 400/500/600/700/800, `layout.tsx:31`).

### UX
30. Consolidate 4 divergent tool-card designs + inconsistent corner radius (`rounded-none` vs `rounded-3xl` vs `rounded-sm`).
31. Add per-tool error/loading boundaries — a throw in any client tool blanks the whole page to global `error.tsx`; global `loading.tsx` is a heavy full-screen overlay on every nav.
32. Remove/relocate hardcoded light-mode Product Hunt card from hero (`PremiumHero.tsx:56-64`).
33. Fix low-contrast small text (stacked muted opacities, `text-[10px]`), add `focus-visible:` rings on cards.
34. Delete/fix broken `ToolInteractivePlaceholder.tsx` (missing `'use client'`, false "processed locally" copy).

### Config hygiene
35. Resolve eslint + biome both configured (only eslint scripted). Pick one.
36. Resolve Cloudflare stack (`wrangler.jsonc`, `open-next.config.ts`, `deploy*` scripts, `@opennextjs/cloudflare`, `wrangler`) — incompatible with `output:"export"`, likely abandoned. Owner sign-off before removing.
37. De-dupe context docs: `context/project-overview.md` vs `01-project-overview.md`; multiple `agents.md`. Stale dirs `.agents/ .commandcode/ .openclaude/ ecc/`.
38. Archive one-off migration scripts (`add-30-money-tools.js`, `fix-all-tool-pages.cjs`, `transform-tool-pages.cjs`, etc.).

---

## Suggested execution order
1. **Quick wins first** (P1 #10-13, #7-8): delete verified dead code + tracked junk + dead deps → ~1MB lighter, safer bundle, zero runtime risk.
2. **SEO correctness** (P0 #1-3, P1 #14-17): fix the 404 redirect crisis + trailing slashes + thin stubs — biggest ranking impact.
3. **CWV** (P0 #4-5, P2 #26-27): ad CLS + AdSense strategy + images.
4. **UX discovery** (P0 #6, P1 #18-21): category nav, tool-above-ad, real search, a11y.
5. **Polish & config hygiene** (P2).
