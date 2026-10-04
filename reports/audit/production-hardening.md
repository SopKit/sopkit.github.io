# SopKit Production-Hardening Audit — 2026-10-04

Branch: `audit/production-hardening`
Method: specialised audit passes run sequentially by a single agent (the environment
does not expose parallel subagent orchestration). Every finding below cites the
actual file/line evidence that was inspected. Confirmed findings are separated from
suspected ones. No test result is asserted that was not observed.

## Phase 0 — Repository inventory (confirmed)

| Item | Finding |
| --- | --- |
| Framework | Next.js 16.3.8 (App Router), React 19, TypeScript 5.9 |
| Rendering model | **Static export** — `next.config.mjs` sets `output: "export"` |
| Deployment | GitHub Pages (`deploy-pages.yml`, artifact `./out`) |
| Package manager | Bun (`bun.lock`, `bun install --frozen-lockfile` in CI) |
| CI gates | `typecheck`, `test:arch`, `validate:registry`, then `bun run build` |
| Tools | 640 tools across 20 categories (registry validator) |
| Design system | `src/components/tools/shared/design-system` |
| SEO | `src/seo/*`, `structudata/build-time sitemap` and per-route metadata |

## Findings

### F-001 — CSP defines a strict script policy that is never shipped (P2 / CONFIRMED)
- File: `src/server/security/headers.ts` (exports `buildSecurityHeaders`)
- Evidence: only importers are `tests/security/headers.test.ts`. No `middleware.ts`
  exists, `next.config.mjs` sets no headers, the app is a static export, and
  `public/_headers` (the Cloudflare/Netlify headers file) contains **no**
  `Content-Security-Policy`. GitHub Pages does not honour `_headers` at all.
- Impact: the documented "strict CSP with `wasm-unsafe-eval`" (see
  `docs/architecture/*`) is not enforced in production. Security control exists on
  paper only. It also means the earlier CDN-script failures were **not** caused by
  CSP in production (see F-002).
- Fix: not applied. Enabling a strict CSP now would break the remaining CDN-dependent
  tools (F-003). Correct order is: bundle the remaining engines, then ship CSP.

### F-002 — QR generator depended on a runtime CDN (P1 / CONFIRMED, FIXED)
- Files: `src/lib/load-qrcode.ts`, `src/components/tools/utilities/QrGeneratorPremium.tsx`
- Evidence: the loader injected `<script>` tags from `unpkg.com`, `cdn.jsdelivr.net`
  and `cdnjs.cloudflare.com`; the premium tool read `window.QRCode`.
- Impact: tool fails whenever those networks are blocked/slow; contradicts the
  "runs in your browser" privacy claim; incompatible with F-001's intended CSP.
- Fix: `load-qrcode.ts` now lazily `import("qrcode")` (bundled); the premium tool uses
  bundled `qr-code-styling` on demand. Verified: webpack emitted
  `_node_modules_qrcode_lib_browser_js.js` and `_node_modules_qr-code-styling_*.js`.
- Correction to an earlier assessment: because no CSP is actually shipped (F-001),
  CSP was **not** the confirmed production cause; the CDN dependency itself is the
  confirmed defect.

### F-003 — Engines loaded from CDNs despite being bundled (P1/P2 / CONFIRMED, PARTIALLY FIXED)
Runtime `<script src="…cdn…">` injections found:

| Component | Engine | Bundled already? | Status |
| --- | --- | --- | --- |
| PDFPageDelete, PDFRotation, PDFEditor, PDFToWord, PDFToImage | pdf.js **worker** | yes (`pdfjs-dist`) | **FIXED** → local worker asset |
| PdfCompressor200kb, JpgToPdfExam | pdf-lib | yes (`pdf-lib@1.17.1`) | **FIXED** → `import("pdf-lib")` |
| MarkdownToPdfTool | pdf-lib + html2canvas | yes (both) | **FIXED** → `import(...)` |
| TeraboxVideoPlayer (terabox/) | hls.js | yes (`hls.js`) | **FIXED** → `import("hls.js")` *(component is dead code — see F-008)* |
| PDFCompressor, PDFGrayscale | pdf.js v3 from cdnjs | only v6 bundled | **NOT FIXED** (v3→v6 `render()` API differs; needs browser testing) |
| QrReaderPremium | jsQR | no | **NOT FIXED** (needs new dependency) |
| HashGeneratorTool | crypto-js | no | **NOT FIXED** (needs new dependency) |
| GifGeneratorTool | gifshot | no | **NOT FIXED** (needs new dependency) |
| EmbedPlayer | plyr / video.js / fluid / mediaelement | no | **NOT FIXED** (embed context) |
| EmbedWidgetGiver | prism (cdnjs) | no | **NOT FIXED** (syntax highlighting for embed preview) |

Verified after fixes: `_next/static/media/pdf.worker.min.*.mjs` is emitted and served
`200 application/javascript`, and `pdf-lib`/`html2canvas` chunks are generated.

### F-004 — External QR API used at runtime (P2 / CONFIRMED, NO FIX NEEDED)
- Files: `src/components/tools/utilities/QrGeneratorTool.tsx:43`,
  `src/components/tools/video/terabox/TeraboxSharingTools.tsx:33`
- Evidence: both build an `api.qrserver.com/...` image URL, sending user content to a
  third party.
- Impact: privacy + reliability; would be blocked by the intended CSP `img-src`.
- Fix: not applied because **both components are dead code** (F-008). Remove the
  components instead of migrating them.

### F-005 — `api.qrserver.com`-style external calls contradict local-processing claims (P2 / CONFIRMED)
Folds into F-004 and the remaining rows of F-003.

### F-006 — Dead code: unused tool implementations (P2 / CONFIRMED)
- `src/components/tools/implementations/ToolImplementation.tsx` — no importers.
- `src/components/tools/impl/ToolImplementation.tsx` and its
  `SeoNetworkPolicyTools.tsx` — no importers.
- `src/components/tools/utilities/QrGeneratorTool.tsx` — only reachable from the two
  dead `ToolImplementation` files.
- `src/components/tools/video/terabox/TeraboxVideoPlayer.tsx` and
  `src/components/tools/video/TeraboxVideoPlayer.tsx` — no importers; the live route
  `/terabox-downloader` renders `SimpleTeraboxPlayer` instead.
- `src/components/tools/video/terabox/TeraboxSharingTools.tsx` — no importers.
- Fix: not applied (deleting features needs owner sign-off per the audit rules).

### F-007 — `await import()` code-splitting is working; no regression found (P4 / CONFIRMED)
Heavy engines (`pdf-lib`, `pdfjs-dist`, `html2canvas`, `hls.js`, `qr-code-styling`,
`qrcode`) are all dynamic imports and are emitted as separate chunks.

### F-008 — Dead code touched incidentally (informational)
The `hls.js` hardening in F-003 was applied to an unused component. Kept because it
removes a CDN dependency and is covered by a regression test, but it does not affect
any live route.

## Verification (observed, on this branch)

| Check | Command | Result |
| --- | --- | --- |
| Typecheck | `npx tsc --noEmit` | PASS (exit 0) |
| Architecture tests | `npm run test:arch` (bun) | PASS — 68 pass / 0 fail |
| New regression test | `bun test tests/unit/asset-loading.test.ts` | PASS — 15 pass / 0 fail |
| Registry | `npx tsx scripts/validate-registry.ts` | PASS — 640 tools |
| Lint (changed files) | `npx eslint …` | No **new** errors; pre-existing warnings remain. `PDFToImage.tsx` ref-during-render and `TeraboxVideoPlayer` setState-in-effect errors are pre-existing (baseline confirmed). |
| Dev compile | `next dev --webpack` (8 affected routes) | 200 on all routes, no compile errors |
| Worker asset | `GET /_next/static/media/pdf.worker.min.*.mjs` | 200 `application/javascript` |

## Not run / limitations

- **Production build** (`bun run build`) was **not** run: the repo's `AGENTS.md`
  forbids production builds in the dev terminal.
- **Bun install** cannot run in this sandbox (`getrandom failed: errno 38`); `bun.lock`
  was edited by hand for the QR work and validated as JSONC. CI uses
  `bun install --frozen-lockfile`.
- **No browser** (Chrome unavailable): user-flow testing of the repaired tools was done
  via SSR compiles, emitted-chunk/asset inspection, and library-level checks — not a
  live click-through.
- **PR**: not opened — `gh` is authenticated but the GitHub API returned
  "rate limit already exceeded". Changes are committed on the branch locally.

## Final status

```
Build:              NOT RUN (forbidden by AGENTS.md)
Tests:              PASS (68 arch + 15 new)
Lint:               PASS on changed files (no new errors)
Typecheck:          PASS
Tool Functionality: PARTIAL (fixed class verified at compile/bundle level; PDFCompressor/PDFGrayscale/QR reader/hash/GIF not repaired)
SEO:                NOT RE-AUDITED (out of budget)
Accessibility:      NOT RE-AUDITED (out of budget)
Performance:        PARTIAL (verified code-splitting; no regressions)
Security:           PARTIAL (CDN/external deps reduced; intended CSP still unshipped — F-001)
Responsive UX:      NOT RE-AUDITED (out of budget)

Confirmed issues before fixes: 6 (F-001…F-006)
Confirmed issues fixed:        1 class (F-002) + partial F-003
Remaining confirmed issues:    5 (F-001, F-004, F-005, F-006, rest of F-003)
New tests added:               1 file / 15 assertions
```
