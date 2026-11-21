import { describe, it, expect } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import { PDF_WORKER_PATH } from "../../src/lib/pdfjs";

// Before this guard every PDF tool pointed pdf.js at a CDN URL ending in
// `pdf.worker.min.js`; pdfjs-dist 4+ ships only `.mjs`, so the request was a
// 404 and PDF to image, rotate, delete pages, annotate and PDF to Word all
// showed "0 pages" for every visitor. Two more tools injected pdf.js 3.x and
// pdf-lib from CDNs by <script>. The worker is now copied from node_modules
// into public/vendor at predev/prebuild, and no tool may load engines from a
// third-party CDN.

const rootDir = path.resolve(import.meta.dir, "../..");

function walk(dir: string, out: string[] = []): string[] {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) walk(full, out);
		else if (/\.(tsx?|mjs)$/.test(entry.name)) out.push(full);
	}
	return out;
}

describe("pdf.js worker delivery", () => {
	it("serves the worker from our own origin under /vendor", () => {
		expect(PDF_WORKER_PATH).toBe("/vendor/pdf.worker.min.js");
	});

	it("copies the installed worker into public/vendor with the copy script", () => {
		const script = path.join(rootDir, "scripts/copy-vendor-assets.mjs");
		expect(fs.existsSync(script)).toBe(true);
		const result = Bun.spawnSync(["node", script], { cwd: rootDir });
		expect(result.exitCode).toBe(0);
		const worker = path.join(rootDir, "public", PDF_WORKER_PATH);
		expect(fs.existsSync(worker)).toBe(true);
		expect(fs.statSync(worker).size).toBeGreaterThan(100 * 1024);
		const source = fs.readFileSync(path.join(rootDir, "node_modules/pdfjs-dist/build/pdf.worker.min.mjs"));
		expect(Buffer.compare(fs.readFileSync(worker), source)).toBe(0);
	});

	it("runs the copy before dev and build and ignores the copies in git", () => {
		const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, "package.json"), "utf8")) as {
			scripts: Record<string, string>;
		};
		expect(pkg.scripts.predev).toContain("scripts/copy-vendor-assets.mjs");
		expect(pkg.scripts.prebuild.startsWith("node scripts/copy-vendor-assets.mjs")).toBe(true);
		const ignore = fs.readFileSync(path.join(rootDir, ".gitignore"), "utf8");
		expect(ignore.split("\n")).toContain("public/vendor/");
	});
});

// Libraries that are still fetched from a CDN because they are not in
// package.json (adding a dependency needs a lockfile update, which this host
// cannot produce). Shrink this list, never grow it.
const CDN_ALLOWLIST = new Set([
	"src/components/tools/security/HashGeneratorTool.tsx", // crypto-js
	"src/components/tools/utilities/QrReaderPremium.tsx", // jsqr
	"src/components/tools/shared/EmbedWidgetGiver.tsx", // prism theme for the embed snippet
]);

describe("tool components load engines from the bundle, never a CDN", () => {
	const toolFiles = walk(path.join(rootDir, "src/components/tools"));

	it("no tool sets a CDN pdf.js worker or injects CDN scripts", () => {
		const offenders: string[] = [];
		for (const file of toolFiles) {
			if (CDN_ALLOWLIST.has(path.relative(rootDir, file))) continue;
			const source = fs.readFileSync(file, "utf8");
			if (
				/GlobalWorkerOptions\.workerSrc\s*=/.test(source) ||
				/cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|unpkg\.com/.test(source)
			) {
				offenders.push(path.relative(rootDir, file));
			}
		}
		expect(offenders).toEqual([]);
	});

	it("every pdfjs-dist consumer goes through the shared loader", () => {
		for (const file of toolFiles) {
			const source = fs.readFileSync(file, "utf8");
			if (source.includes('"pdfjs-dist"')) {
				throw new Error(`${path.relative(rootDir, file)} imports pdfjs-dist directly; use loadPdfJs() from @/lib/pdfjs`);
			}
		}
	});
});
