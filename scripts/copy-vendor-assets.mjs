#!/usr/bin/env node
/**
 * Copies browser assets that must be served from our own origin into
 * `public/vendor/` (git-ignored). Runs before `next dev` and `next build`
 * via the `predev` and `prebuild` scripts, so the copies always match the
 * installed package versions.
 *
 * Currently: the pdf.js worker. See src/lib/pdfjs.ts for why.
 */
import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "vendor");

const ASSETS = [
	{
		from: path.join(root, "node_modules", "pdfjs-dist", "build", "pdf.worker.min.mjs"),
		// Served as a classic ".js" path: pdf.js creates a module worker from it
		// regardless of extension, and ".js" has an unambiguous MIME type on
		// every static host.
		to: path.join(outDir, "pdf.worker.min.js"),
	},
];

mkdirSync(outDir, { recursive: true });

for (const asset of ASSETS) {
	if (!existsSync(asset.from)) {
		console.error(`copy-vendor-assets: missing ${path.relative(root, asset.from)}. Run the package install first.`);
		process.exit(1);
	}
	copyFileSync(asset.from, asset.to);
	const kb = Math.round(statSync(asset.to).size / 1024);
	console.log(`copy-vendor-assets: ${path.relative(root, asset.to)} (${kb} KB)`);
}
