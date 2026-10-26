import { describe, it, expect } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import {
	checkWindowOpenerSource,
	findWindowOpenerIssues,
} from "../../scripts/validate-window-opener";

// Before this guard, 73 of the site's 82 `window.open(url, "_blank")`
// calls opened a new tab with the opener still attached, so the opened
// page — a third-party media URL from a downloader tool, or a
// user-pasted URL in UrlParserTool — could redirect the SopKit tab
// (reverse tabnabbing). The repo already guarded the anchor form of
// the same hole (every `target="_blank"` anchor carries `noopener` or
// `noreferrer`), and 9 `window.open` calls already passed
// `noopener,noreferrer`; the other 73 did not. The prebuild script
// scripts/validate-window-opener.ts enforces the same invariants on
// the committed source text; these tests pin it through that function
// plus the specific repairs, and through synthetic sources so a
// regression is caught even if the tree is later refactored.

const rootDir = path.resolve(import.meta.dir, "../..");

function readSource(relative: string): string {
	return fs.readFileSync(path.join(rootDir, relative), "utf8");
}

describe("window.open callers sever the opener", () => {
	it("the validator finds no violations, over a non-trivial set", () => {
		const result = findWindowOpenerIssues(rootDir);
		// Guards against a vacuous pass: the tree carries 82
		// window.open calls and 39 target="_blank" anchors.
		expect(result.checkedCalls).toBeGreaterThanOrEqual(80);
		expect(result.checkedAnchors).toBeGreaterThanOrEqual(30);
		expect(result.violations).toEqual([]);
	}, 30000);

	it("a bare two-argument call is a violation, the fixed form is not", () => {
		const bad = checkWindowOpenerSource(
			`const openIt = () => window.open(quality.url, "_blank");`,
			"synthetic.tsx",
		);
		expect(bad.calls).toBe(1);
		expect(bad.violations).toHaveLength(1);
		const good = checkWindowOpenerSource(
			`const openIt = () => window.open(quality.url, "_blank", "noopener,noreferrer");`,
			"synthetic.tsx",
		);
		expect(good.calls).toBe(1);
		expect(good.violations).toEqual([]);
	});

	it("a features string without noopener is a violation", () => {
		const result = checkWindowOpenerSource(
			`window.open(shareUrl, "_blank", "width=600,height=400");`,
			"synthetic.tsx",
		);
		expect(result.violations).toHaveLength(1);
	});

	it("a target=_blank anchor without rel is a violation; noreferrer passes", () => {
		const bad = checkWindowOpenerSource(
			`<a href={href} target="_blank">open</a>`,
			"synthetic.tsx",
		);
		expect(bad.anchors).toBe(1);
		expect(bad.violations).toHaveLength(1);
		const good = checkWindowOpenerSource(
			`<a href={href} target="_blank" rel="noreferrer">open</a>`,
			"synthetic.tsx",
		);
		expect(good.violations).toEqual([]);
	});

	it("mentions inside strings and comments are not calls", () => {
		const result = checkWindowOpenerSource(
			`// Subtract door and window openings\nconst sample = "<a href=\\"https://example.com\\" target=\\"_blank\\">";`,
			"synthetic.tsx",
		);
		expect(result.calls).toBe(0);
		expect(result.anchors).toBe(0);
		expect(result.violations).toEqual([]);
	});

	it("the UrlParserTool repair opens a user-supplied URL without an opener", () => {
		const source = readSource(
			"src/components/tools/built-ins/UrlParserTool.tsx",
		);
		expect(source).toContain(
			`window.open(parsed.href, '_blank', 'noopener,noreferrer')`,
		);
	});

	it("the SocialShareButtons repair keeps its popup size and adds noopener", () => {
		const source = readSource("src/components/shared/SocialShareButtons.tsx");
		expect(source).toContain(
			`window.open(shareUrls[platform], "_blank", "width=600,height=400,noopener,noreferrer")`,
		);
	});

	it("a repaired downloader opens its media URL without an opener", () => {
		const source = readSource(
			"src/components/tools/downloaders/YouTubeDownloader.tsx",
		);
		expect(source).toContain(
			`window.open(quality.url, "_blank", "noopener,noreferrer")`,
		);
	});
});
