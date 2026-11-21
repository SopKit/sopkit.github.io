/**
 * Shared pdf.js loader for the browser-only PDF tools.
 *
 * pdf.js needs a worker script. Every tool used to point
 * `GlobalWorkerOptions.workerSrc` at a CDN URL ending in `pdf.worker.min.js`,
 * but pdfjs-dist 4+ ships only `pdf.worker.min.mjs`, so the CDN answered 404,
 * the "fake worker" fallback failed on the same URL, and every page that
 * rendered pages (PDF to image, rotate, delete pages, annotate, PDF to Word)
 * showed "0 pages". Two other tools injected a pdf.js 3.x build plus pdf-lib
 * from CDNs by <script> tag, which is slower and depends on a third party.
 *
 * The worker now ships with the site: `scripts/copy-vendor-assets.mjs`
 * copies the installed worker to `public/vendor/pdf.worker.min.js` before
 * `next dev` and `next build` (see package.json `predev`/`prebuild`), so the
 * worker version always matches the bundled library and nothing is fetched
 * from a third party at runtime.
 */

export const PDF_WORKER_PATH = "/vendor/pdf.worker.min.js";

type PdfJsModule = typeof import("pdfjs-dist");

let pending: Promise<PdfJsModule> | null = null;

/** Loads pdfjs-dist once, configures the self-hosted worker, and caches the module. */
export function loadPdfJs(): Promise<PdfJsModule> {
	if (!pending) {
		pending = import("pdfjs-dist")
			.then((lib) => {
				lib.GlobalWorkerOptions.workerSrc = PDF_WORKER_PATH;
				return lib;
			})
			.catch((error: unknown) => {
				// Allow a retry after a transient chunk-load failure.
				pending = null;
				throw error;
			});
	}
	return pending;
}

export interface RenderedPage {
	canvas: HTMLCanvasElement;
	width: number;
	height: number;
}

type PdfPage = Awaited<ReturnType<Awaited<ReturnType<PdfJsModule["getDocument"]>["promise"]>["getPage"]>>;

/**
 * Renders one page to a fresh canvas at the given scale. Passes both `canvas`
 * and `canvasContext` so the call is valid for pdfjs-dist 4 through 6.
 */
export async function renderPdfPageToCanvas(page: PdfPage, scale: number): Promise<RenderedPage> {
	const viewport = page.getViewport({ scale });
	const canvas = document.createElement("canvas");
	canvas.width = Math.max(1, Math.floor(viewport.width));
	canvas.height = Math.max(1, Math.floor(viewport.height));
	const context = canvas.getContext("2d");
	if (!context) {
		throw new Error("Could not create a 2D canvas context.");
	}
	await page.render({ canvas, canvasContext: context, viewport }).promise;
	return { canvas, width: canvas.width, height: canvas.height };
}
