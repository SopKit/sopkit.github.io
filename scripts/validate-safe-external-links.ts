// Validates that clickable links built from user input or third-party
// content never reach an <a href> without an http(s)-only scheme check:
//
//   - src/components/tools/downloaders/SitemapUrlDownloader.tsx renders
//     <loc> values from a fetched or pasted sitemap as links. Both
//     extraction paths already constrain the scheme loosely (a
//     startsWith("http") filter, an https?://-only regex), so this
//     site is hardening: the gate replaces two implicit per-path
//     filters with one explicit check at the sink.
//   - src/components/tools/seo/SeoToolkit.tsx renders the user-typed
//     audit URL as the result link, with no validation.
//   - src/components/tools/video/TwitterVideoDownloader.tsx renders
//     download hrefs parsed out of a third-party service's HTML.
//   - src/components/tools/utilities/QrReaderPremium.tsx gates its
//     scanned-QR link on the loose startsWith("http") test, which is
//     implicit and case-sensitive.
//
// The fix routes all four sites through src/lib/safe-external-url.ts
// (WHATWG parse + http:/https: allowlist; unsafe values render as
// plain text, never as links). This script pins the call sites in
// source, because the property being guarded is "no unsanitized value
// reaches the href", which is a property of the source text. The
// behavioural pins (what the helpers actually accept/reject) live in
// tests/seo/safe-external-links.test.ts against the real lib
// functions; this script pins the call sites.
//
// Deliberately NOT covered here: window.open targets (modern browsers
// do not execute javascript: URLs opened via window.open, and several
// call sites legitimately open blob:/data: downloads), and anchors
// whose scheme is fixed by construction (registry routes, site
// constants, blob: URLs created locally, https://-prefixed builders).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface SafeExternalLinksResult {
	checkedFiles: number;
	violations: string[];
}

const LIB_REL = "src/lib/safe-external-url.ts";
const SITEMAP_REL =
	"src/components/tools/downloaders/SitemapUrlDownloader.tsx";
const AUDIT_REL = "src/components/tools/seo/SeoToolkit.tsx";
const TWITTER_REL =
	"src/components/tools/video/TwitterVideoDownloader.tsx";
const QR_REL = "src/components/tools/utilities/QrReaderPremium.tsx";

/** Check the five source texts; exported for the bun test's synthetic
 * cases. Each argument is the full file text. */
export function checkSafeExternalLinkSources(
	libSource: string,
	sitemapSource: string,
	auditSource: string,
	twitterSource: string,
	qrSource: string,
): string[] {
	const violations: string[] = [];

	// --- The helper library itself must export both functions and
	// --- implement the allowlist (not a denylist) over a real parse.
	for (const fn of ["isSafeExternalUrl", "safeExternalHref"]) {
		if (!new RegExp(`export function ${fn}\\b`).test(libSource)) {
			violations.push(`${LIB_REL} does not export ${fn}`);
		}
	}
	if (!/new URL\(/.test(libSource)) {
		violations.push(`${LIB_REL} does not parse its input with new URL`);
	}
	if (!/protocol === "http:"/.test(libSource)) {
		violations.push(`${LIB_REL} does not allowlist the http: protocol`);
	}
	if (!/protocol === "https:"/.test(libSource)) {
		violations.push(`${LIB_REL} does not allowlist the https: protocol`);
	}

	// --- SitemapUrlDownloader: extracted <loc> values must pass through
	// --- safeExternalHref, and no raw href={u} may remain.
	if (!/safeExternalHref\(u\)/.test(sitemapSource)) {
		violations.push(
			`${SITEMAP_REL} does not pass extracted URLs through safeExternalHref`,
		);
	}
	if (/href=\{u\}/.test(sitemapSource)) {
		violations.push(
			`${SITEMAP_REL} still renders a raw href={u} anchor`,
		);
	}

	// --- SeoToolkit: the audited URL must pass through safeExternalHref,
	// --- and no raw href={auditData.url} may remain.
	if (!/safeExternalHref\(auditData\.url\)/.test(auditSource)) {
		violations.push(
			`${AUDIT_REL} does not pass the audit URL through safeExternalHref`,
		);
	}
	if (/href=\{auditData\.url\}/.test(auditSource)) {
		violations.push(
			`${AUDIT_REL} still renders a raw href={auditData.url} anchor`,
		);
	}

	// --- TwitterVideoDownloader: third-party download hrefs must pass
	// --- through safeExternalHref, and no raw href={option.url} may remain.
	if (!/safeExternalHref\(option\.url\)/.test(twitterSource)) {
		violations.push(
			`${TWITTER_REL} does not pass download URLs through safeExternalHref`,
		);
	}
	if (/href=\{option\.url\}/.test(twitterSource)) {
		violations.push(
			`${TWITTER_REL} still renders a raw href={option.url} anchor`,
		);
	}

	// --- QrReaderPremium: the scanned-QR link gate must be the explicit
	// --- helper, not the loose startsWith("http") test.
	if (!/isSafeExternalUrl\(scannedResult\)/.test(qrSource)) {
		violations.push(
			`${QR_REL} does not gate the scanned link on isSafeExternalUrl`,
		);
	}
	if (/scannedResult\.startsWith\("http"\)/.test(qrSource)) {
		violations.push(
			`${QR_REL} still uses the loose startsWith("http") link gate`,
		);
	}

	return violations;
}

export function findSafeExternalLinkIssues(
	root: string,
): SafeExternalLinksResult {
	const libSource = fs.readFileSync(path.join(root, LIB_REL), "utf8");
	const sitemapSource = fs.readFileSync(
		path.join(root, SITEMAP_REL),
		"utf8",
	);
	const auditSource = fs.readFileSync(path.join(root, AUDIT_REL), "utf8");
	const twitterSource = fs.readFileSync(
		path.join(root, TWITTER_REL),
		"utf8",
	);
	const qrSource = fs.readFileSync(path.join(root, QR_REL), "utf8");
	return {
		checkedFiles: 5,
		violations: checkSafeExternalLinkSources(
			libSource,
			sitemapSource,
			auditSource,
			twitterSource,
			qrSource,
		),
	};
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const invokedAsScript =
	process.argv[1] !== undefined &&
	path.resolve(process.argv[1]) === path.resolve(__filename);

if (invokedAsScript) {
	const result = findSafeExternalLinkIssues(rootDir);
	if (result.violations.length > 0) {
		console.error(
			`validate-safe-external-links: FAILED with ${result.violations.length} violation(s):`,
		);
		for (const violation of result.violations) {
			console.error(`  - ${violation}`);
		}
		process.exit(1);
	}
	console.log(
		`validate-safe-external-links: OK (${result.checkedFiles} safe-external-link files, 0 violations)`,
	);
}
