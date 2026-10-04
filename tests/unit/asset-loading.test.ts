/**
 * @file tests/unit/asset-loading.test.ts
 * @description Regression guard for the "engine loaded from a runtime CDN" class of bug.
 *
 * These tools historically injected <script> tags from cdn.jsdelivr.net / cdnjs /
 * unpkg at runtime. That makes the tools dependent on third-party networks, breaks
 * under a strict `script-src 'self'` CSP, and contradicts the platform's
 * local-processing privacy claims. The engines are bundled as npm dependencies, so
 * these components must import them instead of fetching them.
 */

import { describe, it, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const read = (relativePath: string): string =>
	readFileSync(fileURLToPath(new URL(`../../${relativePath}`, import.meta.url)), "utf8");

const CDN_HOSTS = ["cdn.jsdelivr.net", "cdnjs.cloudflare.com", "unpkg.com"];

/** Components whose engine dependency is bundled and must not be fetched from a CDN. */
const BUNDLED_ENGINE_COMPONENTS = [
	"src/components/tools/pdf/PDFPageDelete.tsx",
	"src/components/tools/pdf/PDFRotation.tsx",
	"src/components/tools/pdf/PDFEditor.tsx",
	"src/components/tools/pdf/PDFToWord.tsx",
	"src/components/tools/pdf/PDFToImage.tsx",
	"src/components/tools/exam/PdfCompressor200kb.tsx",
	"src/components/tools/exam/JpgToPdfExam.tsx",
	"src/components/tools/text/MarkdownToPdfTool.tsx",
	"src/components/tools/video/terabox/TeraboxVideoPlayer.tsx",
];

const PDFJS_WORKER_COMPONENTS = [
	"src/components/tools/pdf/PDFPageDelete.tsx",
	"src/components/tools/pdf/PDFRotation.tsx",
	"src/components/tools/pdf/PDFEditor.tsx",
	"src/components/tools/pdf/PDFToWord.tsx",
	"src/components/tools/pdf/PDFToImage.tsx",
];

describe("Bundled asset loading", () => {
	it("resolves the QR engine from the bundled package, not an external URL", () => {
		const source = read("src/lib/load-qrcode.ts");
		expect(source).toContain('import("qrcode")');
		expect(source).not.toMatch(/https?:\/\//);
	});

	for (const relativePath of BUNDLED_ENGINE_COMPONENTS) {
		it(`${relativePath} does not fetch an engine from a CDN`, () => {
			const source = read(relativePath);
			for (const host of CDN_HOSTS) {
				expect(source.includes(host)).toBe(false);
			}
		});
	}

	for (const relativePath of PDFJS_WORKER_COMPONENTS) {
		it(`${relativePath} uses the locally bundled pdf.js worker`, () => {
			const source = read(relativePath);
			expect(source).toContain('"pdfjs-dist/build/pdf.worker.min.mjs"');
			expect(source.includes("pdf.worker.min.js")).toBe(false);
		});
	}
});
