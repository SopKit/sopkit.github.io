// Validates that the embed pages never pass URL-supplied values to a
// dangerous sink unsanitized:
//
//   - src/app/embed/video/EmbedVideoPlayer.tsx builds its config from
//     a base64 JSON blob in ?data= and used to inject
//     appearance.customCSS verbatim into a <style> element via
//     dangerouslySetInnerHTML. A <style> element's innerHTML is parsed
//     as markup once the string contains </style>, so a crafted link
//     could break out of the style element and inject arbitrary
//     markup (including an <img onerror> payload) into the
//     sopkit.space origin — a reflected XSS. The fix routes the value
//     through sanitizeEmbedCss (src/lib/embed-safety.ts) and nothing
//     else may reach that innerHTML.
//   - src/components/embed/EmbedPlayer.tsx interpolates ?id= into a
//     YouTube iframe path and ?start= into its query string. React
//     attribute escaping already prevents a markup breakout there, but
//     a raw value containing / ? & escapes the intended slot, so both
//     must pass through sanitizeYouTubeVideoId / sanitizeEmbedStart
//     and the iframe must use the sanitized values only.
//
// Why source-pattern checks, not runtime rendering: these are
// client components driven by search params, and the property being
// guarded is "no unsanitized value reaches the sink", which is a
// property of the source text. The behavioural pins (what the
// sanitizers actually strip) live in tests/seo/embed-safety.test.ts
// against the real lib functions; this script pins the call sites.
// Regex is sufficient here because the checked forms are fixed:
// a single innerHTML assignment and a single iframe src template,
// both with literal identifiers (no dynamic property access).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface EmbedSafetyResult {
	checkedFiles: number;
	violations: string[];
}

const PLAYER_REL = "src/app/embed/video/EmbedVideoPlayer.tsx";
const EMBED_REL = "src/components/embed/EmbedPlayer.tsx";
const LIB_REL = "src/lib/embed-safety.ts";

/** Check the three embed-safety source texts; exported for the bun test's
 * synthetic cases. Each argument is the full file text. */
export function checkEmbedSources(
	playerSource: string,
	embedSource: string,
	libSource: string,
): string[] {
	const violations: string[] = [];

	// --- The sanitizer library itself must export all three functions.
	for (const fn of [
		"sanitizeEmbedCss",
		"sanitizeYouTubeVideoId",
		"sanitizeEmbedStart",
	]) {
		if (!new RegExp(`export function ${fn}\\b`).test(libSource)) {
			violations.push(
				`${LIB_REL} does not export ${fn} (embed pages must import it from here)`,
			);
		}
	}

	// --- EmbedVideoPlayer: custom CSS reaches innerHTML only sanitized.
	if (!/from\s+["']@\/lib\/embed-safety["']/.test(playerSource)) {
		violations.push(
			`${PLAYER_REL} does not import from @/lib/embed-safety (custom CSS must pass through sanitizeEmbedCss)`,
		);
	}
	if (!/sanitizeEmbedCss\([^)]*customCSS[^)]*\)/.test(playerSource)) {
		violations.push(
			`${PLAYER_REL} never passes customCSS through sanitizeEmbedCss`,
		);
	}
	// Remove the sanitized occurrences, then any __html: that still
	// mentions customCSS is a raw injection.
	const withoutSanitized = playerSource.replace(
		/sanitizeEmbedCss\([^)]*customCSS[^)]*\)/g,
		"",
	);
	if (/__html:[^}]{0,200}customCSS/.test(withoutSanitized)) {
		violations.push(
			`${PLAYER_REL} injects customCSS into innerHTML without sanitizeEmbedCss`,
		);
	}

	// --- EmbedPlayer: iframe URL built from sanitized values only.
	if (!/from\s+["']@\/lib\/embed-safety["']/.test(embedSource)) {
		violations.push(
			`${EMBED_REL} does not import from @/lib/embed-safety`,
		);
	}
	if (!/sanitizeYouTubeVideoId\(videoId\)/.test(embedSource)) {
		violations.push(
			`${EMBED_REL} never passes videoId through sanitizeYouTubeVideoId`,
		);
	}
	if (!/sanitizeEmbedStart\(/.test(embedSource)) {
		violations.push(
			`${EMBED_REL} never passes the start offset through sanitizeEmbedStart`,
		);
	}
	if (/embed\/\$\{videoId\}/.test(embedSource)) {
		violations.push(
			`${EMBED_REL} interpolates the raw videoId into the iframe path (must use the sanitized value)`,
		);
	}
	if (!/embed\/\$\{safeVideoId\}/.test(embedSource)) {
		violations.push(
			`${EMBED_REL} iframe path does not use the sanitized video ID`,
		);
	}
	if (!/if\s*\(!safeVideoId\)/.test(embedSource)) {
		violations.push(
			`${EMBED_REL} has no fallback for an empty sanitized video ID (it would render a bare /embed/ iframe)`,
		);
	}

	return violations;
}

export function findEmbedSafetyIssues(root: string): EmbedSafetyResult {
	const playerSource = fs.readFileSync(path.join(root, PLAYER_REL), "utf8");
	const embedSource = fs.readFileSync(path.join(root, EMBED_REL), "utf8");
	const libSource = fs.readFileSync(path.join(root, LIB_REL), "utf8");
	return {
		checkedFiles: 3,
		violations: checkEmbedSources(playerSource, embedSource, libSource),
	};
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const invokedAsScript =
	process.argv[1] !== undefined &&
	path.resolve(process.argv[1]) === path.resolve(__filename);

if (invokedAsScript) {
	const result = findEmbedSafetyIssues(rootDir);
	if (result.violations.length > 0) {
		console.error(
			`validate-embed-safety: FAILED with ${result.violations.length} violation(s):`,
		);
		for (const violation of result.violations) {
			console.error(`  - ${violation}`);
		}
		process.exit(1);
	}
	console.log(
		`validate-embed-safety: OK (${result.checkedFiles} embed-safety files, 0 violations)`,
	);
}
