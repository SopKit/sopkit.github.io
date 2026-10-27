import { describe, it, expect } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import {
	sanitizeEmbedCss,
	sanitizeEmbedStart,
	sanitizeYouTubeVideoId,
} from "../../src/lib/embed-safety";
import {
	checkEmbedSources,
	findEmbedSafetyIssues,
} from "../../scripts/validate-embed-safety";

// Before this guard, the embed video player built its config from a
// base64 JSON blob in the page URL (?data=) and injected its
// appearance.customCSS verbatim into a <style> element via
// dangerouslySetInnerHTML. A <style> element's innerHTML is parsed as
// markup once the string contains </style>, so a crafted link could
// break out of the style element and inject arbitrary markup into the
// sopkit.space origin — a reflected XSS. The sibling /embed/ player
// interpolated the raw ?id= value into a YouTube iframe path and the
// raw ?start= value into its query string (React attribute escaping
// already prevented a markup breakout there, but / ? & escaped the
// intended slots). The prebuild script scripts/validate-embed-safety.ts
// pins the call sites; these tests pin the sanitizers themselves and
// the pre-fix sources, so a regression is caught even if the tree is
// later refactored.

const rootDir = path.resolve(import.meta.dir, "../..");

function readSource(relative: string): string {
	return fs.readFileSync(path.join(rootDir, relative), "utf8");
}

const LIB_REL = "src/lib/embed-safety.ts";
const PLAYER_REL = "src/app/embed/video/EmbedVideoPlayer.tsx";
const EMBED_REL = "src/components/embed/EmbedPlayer.tsx";

describe("sanitizeEmbedCss", () => {
	it("neutralizes the </style> breakout payload class", () => {
		const payload =
			'</style><img src=x onerror=alert(document.domain)><style>';
		const out = sanitizeEmbedCss(payload);
		// The guarantee is structural: with no "<" left, no tag can
		// open, so the payload survives only as inert style text.
		// (The onerror= text may remain as text; it cannot execute
		// without a "<" to start an element.)
		expect(out).not.toContain("<");
		expect(out).not.toContain("</style>");
		expect(out).not.toContain("<img");
	});

	it("removes @import rules and url( references whole", () => {
		const out = sanitizeEmbedCss(
			'@import url("https://evil.example/x.css"); .a { background: url(https://evil.example/p.png); color: red; }',
		);
		expect(out).not.toContain("@import");
		expect(out).not.toContain("url(");
		expect(out).not.toContain("evil.example");
		expect(out).toContain("color: red");
	});

	it("removes legacy expression( and javascript: tokens", () => {
		const out = sanitizeEmbedCss(
			'.a { width: expression(alert(1)); background: javascript:alert(1); }',
		);
		expect(out).not.toContain("expression(");
		expect(out).not.toContain("javascript:");
	});

	it("preserves legitimate theming CSS, including child combinators", () => {
		const css =
			'@media (max-width: 600px) { .player > video { width: 100%; background: #000; } }';
		expect(sanitizeEmbedCss(css)).toBe(css);
	});

	it("fails closed on non-string input", () => {
		expect(sanitizeEmbedCss(undefined)).toBe("");
		expect(sanitizeEmbedCss(null)).toBe("");
		expect(sanitizeEmbedCss(42)).toBe("");
	});
});

describe("sanitizeYouTubeVideoId and sanitizeEmbedStart", () => {
	it("keeps only video-ID characters", () => {
		expect(sanitizeYouTubeVideoId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
		expect(sanitizeYouTubeVideoId("a-b_c123")).toBe("a-b_c123");
		expect(sanitizeYouTubeVideoId("abc/def?ghi&rel=0")).toBe("abcdefghirel0");
		expect(sanitizeYouTubeVideoId('x" onerror="alert(1)')).toBe("xonerroralert1");
		expect(sanitizeYouTubeVideoId("")).toBe("");
		expect(sanitizeYouTubeVideoId(undefined)).toBe("");
	});

	it("caps absurd ID lengths", () => {
		expect(sanitizeYouTubeVideoId("a".repeat(200)).length).toBe(64);
	});

	it("accepts plain second offsets and rejects query smuggling", () => {
		expect(sanitizeEmbedStart("90")).toBe("90");
		expect(sanitizeEmbedStart("0")).toBe("0");
		expect(sanitizeEmbedStart("90&rel=0")).toBe("0");
		expect(sanitizeEmbedStart("-5")).toBe("0");
		expect(sanitizeEmbedStart("abc")).toBe("0");
		expect(sanitizeEmbedStart("")).toBe("0");
		expect(sanitizeEmbedStart(undefined)).toBe("0");
		expect(sanitizeEmbedStart("999999")).toBe("86400");
	});
});

describe("embed-safety call sites", () => {
	it("the validator finds no violations in the real tree", () => {
		const result = findEmbedSafetyIssues(rootDir);
		expect(result.checkedFiles).toBe(3);
		expect(result.violations).toEqual([]);
	});

	it("the player passes custom CSS only through the sanitizer", () => {
		const source = readSource(PLAYER_REL);
		expect(source).toContain("sanitizeEmbedCss(videoConfig.appearance.customCSS)");
		expect(source).not.toContain("__html: videoConfig.appearance.customCSS");
	});

	it("the embed player renders only sanitized URL values", () => {
		const source = readSource(EMBED_REL);
		expect(source).toContain("sanitizeYouTubeVideoId(videoId)");
		expect(source).toContain("sanitizeEmbedStart(");
		expect(source).toContain("embed/${safeVideoId}");
		expect(source).not.toContain("embed/${videoId}");
		expect(source).toContain("if (!safeVideoId)");
	});

	it("the pre-fix sources fail (negative controls)", () => {
		const libSource = readSource(LIB_REL);
		const preFixPlayer = `
import { useSearchParams } from "next/navigation";
export default function EmbedVideoPlayer() {
  return videoConfig.appearance?.customCSS && (
    <style dangerouslySetInnerHTML={{ __html: videoConfig.appearance.customCSS }} />
  );
}`;
		const preFixPlayerViolations = checkEmbedSources(
			preFixPlayer,
			readSource(EMBED_REL),
			libSource,
		);
		expect(
			preFixPlayerViolations.some((v) => v.includes("without sanitizeEmbedCss")),
		).toBe(true);

		const preFixEmbed = `
export default function EmbedPlayer({ player, videoId }) {
  const start = "0";
  const src = \`https://www.youtube.com/embed/\${videoId}?start=\${start}&rel=0\`;
  return <iframe src={src} title={\`embedded-\${videoId}\`} />;
}`;
		const preFixEmbedViolations = checkEmbedSources(
			readSource(PLAYER_REL),
			preFixEmbed,
			libSource,
		);
		expect(
			preFixEmbedViolations.some((v) => v.includes("raw videoId")),
		).toBe(true);
		expect(
			preFixEmbedViolations.some((v) => v.includes("sanitizeEmbedStart")),
		).toBe(true);
	});
});
