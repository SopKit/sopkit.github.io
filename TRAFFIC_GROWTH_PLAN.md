# SopKit Traffic-Growth Master Plan

_Synthesized from a full repo audit + 2025-26 SEO and distribution research. Last updated: 2026-07-06._

## Diagnosis
The technical foundation is strong — static SSG export, per-page canonicals, robots + segmentable sitemap + llms.txt + RSS + IndexNow, AI-crawler access all wired. This is not an infrastructure problem. Three fixable ceilings:
1. ~400 of 473 tool pages use **template-generated** FAQ/HowTo/article → thin/duplicate-content risk that caps rankings.
2. Structured data and internal linking are **not universal**.
3. Off-site authority is **under-leveraged** despite ideal assets (open-source + privacy-first + 8 NPM packages).

Fix on-page quality first → wire the internal-link mesh → then pour fuel on distribution.

## Structural advantages
- **Every tool = a long-tail landing page.** 473 tools + 350 `extraSlugs` + size-ladder patterns = thousands of "convert X to Y / compress to N KB" queries at near-zero marginal cost.
- **"Free + privacy-first + open-source + no upload"** is what HN/Reddit/dev communities over-index on, and a costly-to-fake E-E-A-T trust signal.

---

## Phase 1 — Fix the on-page ceiling (Weeks 1-3, highest ROI)
1. **Universal structured data** in `ToolLayout.tsx`: `BreadcrumbList` + `SoftwareApplication` + `FAQPage` as build-time JSON-LD on every tool page. Validate with Rich Results Test.
2. **Keyword-rich `RelatedTools` mesh** on every page: 6-10 contextual siblings with descriptive anchors + reverse-conversion links (png-to-jpg ↔ jpg-to-png) + size-ladder links. Every hub links to all children. _Biggest untapped lever._
3. **Trust strip** on every tool page: "100% in-browser · files never uploaded · free · no signup."
4. **Upgrade top ~50 traffic tools** from templated to bespoke: numbered how-to steps + real worked example ("2.4MB JPG → 48KB") + 3-6 visible FAQs.
5. **Resolve deploy ambiguity** (GitHub Pages static export vs OpenNext/Cloudflare) — gates dynamic OG images and edge tactics.

## Phase 2 — Scale programmatic SEO (Weeks 3-8)
6. **Segment the sitemap** into a `generateSitemaps()` index by template (image/pdf/video/converters/calculators/hubs/blog) for per-template indexed-vs-submitted diagnosis in Search Console.
7. **Complete compress-to-size ladders** (high-intent, low-competition exam niche): 10/15/25/50/150/200/500 KB for images + `compress-pdf-to-{100kb,1mb,2mb}`.
8. **Build convert-X→Y matrices** (image/doc/audio-video/data formats) from a data-driven template — every page needs ≥1 unique element (intro + example + FAQ) or it reads as spam.
9. **Core Web Vitals pass** on image tools: `images.unoptimized:true` is the LCP risk — pre-sized WebP/AVIF thumbnails, explicit width/height, lazy-load below-fold. Audit AdSense/Clarity/GA/stonks INP drag.

## Phase 3 — Off-site authority & launches (Weeks 2-8, parallel)
**Bedrock (Week 1-2, permanent dofollow):**
10. Tier-1 directories: SourceForge, StackShare, AlternativeTo, SaaSHub, DevHunt (also feed AI-search recommendations).
11. **README/NPM SEO**: rewrite H1s to searched terms ("compress PNG online" not "Image Utilities"), add high-intent `keywords` + `homepage` per `@sopkit/*` package, add GitHub Topics, enable Discussions, open awesome-list PRs (awesome-nodejs/javascript/devtools/privacy/seo).

**Launch spikes (space ~1-2 weeks apart):**
12. **Show HN first**: `Show HN: SopKit – 400+ privacy-first browser tools, open source, no uploads`. Tue-Thu 9am-12pm ET. First hour decisive — line up 10-30 contacts for honest feedback (never ask for upvotes). Maker comment immediately.
13. **Product Hunt** 1-2 weeks later: prep account + teaser 3-4 weeks out, authentic screen-recording, launch 12:01 AM PT.
14. **Reddit showcase** (build karma first): r/SideProject, r/InternetIsBeautiful, r/coolgithubprojects, r/opensource, r/privacy.

## Phase 4 — Evergreen loops (ongoing)
15. **Embeddable widgets** for flagship tools with "Powered by SopKit" backlink — passive dofollow at scale.
16. **"Best free X" listicle + AlternativeTo outreach** — durable ranking + referral.
17. **dev.to/Hashnode series** (canonical_url → own domain) + **Stack Overflow answers**.
18. **HARO-style**: Source of Sources, Featured, Qwoted, Help a B2B Writer.

---

## Flywheel
SEO pages → GitHub stars → higher ranking → more discovery → more stars. Launches buy the authority spike; evergreen loops convert it to sustained traffic. **Fund launches once; fund loops continuously.**

**Timeline:** indexing 2-4 weeks → first traffic 4-8 weeks → meaningful growth 3-6 months.

## Repo housekeeping
- `GROWTH_PLAN.md` is actually an NPM-monorepo build prompt, not a traffic plan.
- `seo-audit-report.json` is a failed local run (localhost down), not a real result.
- The genuine prior roadmap lives in `seo-implementation/docs/SEO-IMPROVEMENT-PLAN.md`.

## Key files to touch
- `src/components/tools/shared/ToolLayout.tsx` — enforce schema + template + trust strip + related-tools mesh.
- `src/app/sitemap.ts` — convert to segmented `generateSitemaps()` index.
- `src/data/seo-opportunities.ts`, `src/data/tool-seo-inventory.ts`, `src/lib/intent-data.ts` — unique per-page content (FAQs, examples, related IDs).
- `next.config.mjs` — `images.unoptimized` LCP mitigation.
- `src/app/(image)/compress-image-to-*` — replicate into full size ladders + PDF.
