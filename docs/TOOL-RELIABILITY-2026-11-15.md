# Image and PDF tool reliability pass (2026-11-15)

Trigger: the operator reported that the image resizer and "all image and PDF
tools" were broken on the live site. The site had just been migrated to the
Astryx design system (commit 6c2b031), so the first suspicion was a UI
regression. It was not: every page hydrated and accepted files. The failures
were runtime dependencies that never loaded, and one object-URL lifetime bug.

## How it was measured

Every image and PDF route was driven with a real headless Chromium (Playwright
in a remote sandbox, because this host's glibc cannot run Chromium): load the
page, register console/pageerror/requestfailed/4xx listeners, upload a
generated PNG/JPEG/WebP/SVG/ICO/PDF/DOCX of the right type, click the primary
action, wait, and record page text, download events and errors.

| Route | Result before | Cause |
|---|---|---|
| `/image-resizer/` | Upload shows "pending", "Resize Images" sticks at 0% forever, thumbnails 404 | `URL.revokeObjectURL` called inside `img.onload` right after storing the URL; the resize step then loads the revoked URL and `onload` never fires |
| `/pdf-to-jpg-converter/`, `/pdf-rotation/`, `/remove-pages-from-pdf/`, `/pdf-editor/`, `/pdf-to-word/` | "0 of 0 pages", "0 pages loaded", "page 1 of 0" | `GlobalWorkerOptions.workerSrc` pointed at `cdn.jsdelivr.net/npm/pdfjs-dist@<v>/build/pdf.worker.min.js`, which is 404 because pdfjs-dist 4+ ships only `pdf.worker.min.mjs`; the "fake worker" fallback fetched the same URL |
| `/pdf-compressor/`, `/pdf-grayscale/` | Grayscale produced nothing; compressor worked but slowly | Both injected pdf.js 3.4.120 and pdf-lib from CDNs by `<script>` at click time |
| `/gif-generator/` | "Loading Engine" forever | gifshot injected from cdnjs at runtime |
| `/compress-image-to-100kb/` family | "Size mismatch" for small clean images | Output below the portal's minimum size; nothing could lift it |
| Every tool page | two nested `<main>` landmarks | group layouts render `<main>`, and `ToolLayout` plus several hub pages rendered a second `<main>` inside it |

Verified working before the pass (no change needed): image compressor, image
converter and all its format aliases, circular crop, EXIF reader, favicon
generators, image to Base64, Base64 to image, watermark, photo enhancer,
DPI/cm/mm/px resizers, metadata remover, colour picker, Gemini watermark
remover, background remover, logo generator, PDF merger, splitter, metadata
editor, page numbers, watermark, protect, repair, unlock, image to PDF, Word to
PDF, HTML to PDF.

One recurring console 404 was a red herring: every `<a download href="blob:…">`
rendered through the Astryx `Button` triggers a Next.js `Link` prefetch of the
blob URL with its scheme stripped (`https://sopkit.space/<uuid>`). The download
itself works. Left as is; it is a prefetch of a non-page.

## Decisions

1. **pdf.js worker ships with the site.** `src/lib/pdfjs.ts` exposes
   `loadPdfJs()` (one cached dynamic import, worker at `/vendor/pdf.worker.min.js`)
   and `renderPdfPageToCanvas()`. `scripts/copy-vendor-assets.mjs` copies the
   installed worker into `public/vendor/` (git-ignored) in `predev` and as the
   first `prebuild` step, so the worker version always equals the bundled
   library and GitHub Pages serves it from our origin. All eight pdf.js
   consumers use the loader; `page.render` is called with both `canvas` and
   `canvasContext` so it is valid for pdfjs-dist 4 to 6.
2. **No tool loads an engine from a CDN.** pdf-lib and html2canvas were
   already dependencies; `PDFGrayscale`, `PDFCompressor`, `PdfCompressor200kb`,
   `JpgToPdfExam` and `MarkdownToPdfTool` now `import()` them. gifshot is
   replaced by a dependency-free GIF89a encoder (`src/lib/gif/`). Guarded by
   `tests/unit/pdfjs-loader.test.ts`, which fails on any `workerSrc =` or
   `cdn.jsdelivr.net|cdnjs.cloudflare.com|unpkg.com` string under
   `src/components/tools` except an explicit allowlist of three tools whose
   libraries (crypto-js, jsqr, prism) are not in `package.json`. Adding them
   needs a lockfile update that this host cannot produce (`bun install`
   crashes); shrink the list when that is possible.
3. **Image resizer rewritten** on the design system with object URLs kept
   alive until removal, `onerror` handling, fit modes, output format and
   quality, presets, per-file and ZIP download. Pure math in
   `src/lib/image/resize-math.ts` with tests.
4. **GIF generator rewritten** on the design system over the bundled encoder,
   with fit modes, background colour, palette size, dithering, loop and
   progress. Encoder round-trip tested in `tests/unit/gif-encoder.test.ts`.
5. **Exam photo resizer pads to the minimum size.** When even quality 0.95
   lands under the portal's minimum, `padJpegToMinimumSize()`
   (`src/lib/image/jpeg-pad.ts`) inserts JPEG comment segments after SOI. The
   pixels are untouched, the file is still a valid JPEG, and the UI says so.
   Tested in `tests/unit/jpeg-pad.test.ts`.
6. **One `<main>` per page.** `ToolLayout`, the landing page, hub pages and
   content wrappers now render `<div>` (the skip-link target `#main-content`
   is kept); the group layouts keep the landmark.

## Not changed

- Hash generator, QR reader and the embed-code snippet still fetch a CDN
  script (see decision 2).
- The blob-URL prefetch 404 noted above.
- Tools that were verified working were not restyled.
