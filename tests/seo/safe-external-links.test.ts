import { describe, it, expect } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import {
	isSafeExternalUrl,
	safeExternalHref,
} from "../../src/lib/safe-external-url";
import {
	checkSafeExternalLinkSources,
	findSafeExternalLinkIssues,
} from "../../scripts/validate-safe-external-links";

// Before this guard, two tool pages rendered clickable links built
// from user input or third-party content with no scheme check at all
// (SeoToolkit's user-typed audit URL, TwitterVideoDownloader's
// download hrefs parsed out of a third-party service's HTML), and two
// more relied on loose, implicit scheme constraints (SitemapUrl-
// Downloader's per-path startsWith("http") / https?://-only filters,
// QrReaderPremium's startsWith("http") gate). React attribute escaping
// stops a value breaking out of an href attribute, but it does not
// stop a dangerous scheme: a clicked <a href="javascript:...">
// executes in the sopkit.space origin. The prebuild script
// scripts/validate-safe-external-links.ts pins the call sites; these
// tests pin the helpers themselves and the pre-fix sources, so a
// regression is caught even if the tree is later refactored.

const rootDir = path.resolve(import.meta.dir, "../..");

function readSource(relative: string): string {
	return fs.readFileSync(path.join(rootDir, relative), "utf8");
}

const LIB_REL = "src/lib/safe-external-url.ts";
const SITEMAP_REL =
	"src/components/tools/downloaders/SitemapUrlDownloader.tsx";
const AUDIT_REL = "src/components/tools/seo/SeoToolkit.tsx";
const TWITTER_REL =
	"src/components/tools/video/TwitterVideoDownloader.tsx";
const QR_REL = "src/components/tools/utilities/QrReaderPremium.tsx";

describe("isSafeExternalUrl", () => {
	it("accepts plain http and https URLs", () => {
		expect(isSafeExternalUrl("https://example.com/page?q=1#frag")).toBe(true);
		expect(isSafeExternalUrl("http://example.com")).toBe(true);
		expect(
			isSafeExternalUrl("https://user:pass@example.com:8443/a"),
		).toBe(true);
	});

	it("accepts uppercase schemes and surrounding whitespace (WHATWG parsing)", () => {
		expect(isSafeExternalUrl("HTTP://EXAMPLE.COM")).toBe(true);
		expect(isSafeExternalUrl("  https://example.com  ")).toBe(true);
	});

	it("rejects executable and non-web schemes", () => {
		expect(isSafeExternalUrl("javascript:alert(document.domain)")).toBe(
			false,
		);
		expect(isSafeExternalUrl("JaVaScRiPt:alert(1)")).toBe(false);
		expect(isSafeExternalUrl("data:text/html,<script>alert(1)</script>")).toBe(
			false,
		);
		expect(isSafeExternalUrl("vbscript:msgbox(1)")).toBe(false);
		expect(isSafeExternalUrl("ftp://example.com/file")).toBe(false);
		expect(isSafeExternalUrl("mailto:someone@example.com")).toBe(false);
	});

	it("rejects tab/newline/control-character scheme smuggling", () => {
		// WHATWG parsing strips tabs and newlines, so a naive
		// startsWith/regex gate sees "java…" while the browser sees
		// scheme "javascript:"; the allowlist rejects the real scheme.
		expect(isSafeExternalUrl("java\tscript:alert(1)")).toBe(false);
		expect(isSafeExternalUrl("java\nscript:alert(1)")).toBe(false);
		expect(isSafeExternalUrl("\u0001javascript:alert(1)")).toBe(false);
		expect(isSafeExternalUrl("java\tscript\n:alert(1)")).toBe(false);
	});

	it("rejects relative, protocol-relative, empty and non-string input", () => {
		expect(isSafeExternalUrl("//example.com/page")).toBe(false);
		expect(isSafeExternalUrl("/page")).toBe(false);
		expect(isSafeExternalUrl("example.com/page")).toBe(false);
		expect(isSafeExternalUrl("")).toBe(false);
		expect(isSafeExternalUrl("   ")).toBe(false);
		expect(isSafeExternalUrl(null)).toBe(false);
		expect(isSafeExternalUrl(undefined)).toBe(false);
		expect(isSafeExternalUrl(42)).toBe(false);
		expect(isSafeExternalUrl({})).toBe(false);
	});
});

describe("safeExternalHref", () => {
	it("returns the parsed, normalized href for safe URLs", () => {
		expect(safeExternalHref("HTTP://EXAMPLE.COM")).toBe(
			"http://example.com/",
		);
		expect(safeExternalHref("https://example.com/a?b=c#d")).toBe(
			"https://example.com/a?b=c#d",
		);
	});

	it("returns null, never the input, for unsafe URLs", () => {
		expect(safeExternalHref("javascript:alert(1)")).toBe(null);
		expect(safeExternalHref("data:text/html,hi")).toBe(null);
		expect(safeExternalHref("//example.com")).toBe(null);
		expect(safeExternalHref("")).toBe(null);
	});
});

describe("safe-external-links validator", () => {
	it("passes on the real tree", () => {
		const result = findSafeExternalLinkIssues(rootDir);
		expect(result.checkedFiles).toBe(5);
		expect(result.violations).toEqual([]);
	});

	it("pins the four call sites in the real sources", () => {
		expect(readSource(SITEMAP_REL)).toContain("safeExternalHref(u)");
		expect(readSource(SITEMAP_REL)).not.toContain("href={u}");
		expect(readSource(AUDIT_REL)).toContain(
			"safeExternalHref(auditData.url)",
		);
		expect(readSource(AUDIT_REL)).not.toContain("href={auditData.url}");
		expect(readSource(TWITTER_REL)).toContain(
			"safeExternalHref(option.url)",
		);
		expect(readSource(TWITTER_REL)).not.toContain("href={option.url}");
		expect(readSource(QR_REL)).toContain("isSafeExternalUrl(scannedResult)");
		expect(readSource(QR_REL)).not.toContain(
			'scannedResult.startsWith("http")',
		);
	});

	it("fails on pre-fix sources", () => {
		const libSource = readSource(LIB_REL);
		const preFixSitemap = `<a href={u} target="_blank">{u}</a>`;
		const preFixAudit = `<a href={auditData.url}>{auditData.url}</a>`;
		const preFixTwitter = `<a href={option.url}>Download</a>`;
		const preFixQr = `{scannedResult.startsWith("http") && (<a href={scannedResult}>Open</a>)}`;
		const violations = checkSafeExternalLinkSources(
			libSource,
			preFixSitemap,
			preFixAudit,
			preFixTwitter,
			preFixQr,
		);
		expect(
			violations.some((v) => v.includes("raw href={u}")),
		).toBe(true);
		expect(
			violations.some((v) => v.includes("raw href={auditData.url}")),
		).toBe(true);
		expect(
			violations.some((v) => v.includes("raw href={option.url}")),
		).toBe(true);
		expect(
			violations.some((v) => v.includes('startsWith("http")')),
		).toBe(true);
	});
});
