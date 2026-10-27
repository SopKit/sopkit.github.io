// Sanitizers for the embed pages, whose configuration comes from the
// page URL and therefore must be treated as attacker-controlled input:
//
//   - /embed/video reads a base64 JSON blob from ?data= and used to
//     inject its appearance.customCSS verbatim into a <style> element
//     via dangerouslySetInnerHTML. A <style> element's innerHTML is
//     parsed as markup once the string contains </style>, so a crafted
//     link could break out of the style element and inject arbitrary
//     markup (including an <img onerror> payload) into the sopkit.space
//     origin. sanitizeEmbedCss is the only thing that may stand
//     between that URL value and innerHTML.
//   - /embed/ interpolates ?id=/?videoId= into a YouTube iframe path
//     and ?start= into its query string. React attribute escaping
//     prevents a markup breakout there, but a value containing / ? &
//     escapes the intended slot, so both are normalized here too.
//
// Design notes, and what this module deliberately does NOT promise:
//
//   - sanitizeEmbedCss removes every "<" character. "<" never occurs
//     in legitimate CSS except inside quoted strings (the content
//     property); dropping it cannot create a tag, and in particular
//     "</style>" becomes "/style>", inert text. ">" is kept because
//     child combinators (div > p) are legitimate CSS.
//   - @import rules are removed whole (up to the next ";" or the end
//     of the string), so a crafted stylesheet cannot pull in a remote
//     stylesheet. url(...) references are removed whole, so no remote
//     resource can be referenced (no beacons, no @import-by-url).
//     expression( and javascript: are removed for legacy-engine
//     completeness.
//   - What remains possible by design: the sanitized CSS can still
//     restyle the player's own existing elements — that is the
//     theming feature. It cannot add elements, load remote
//     stylesheets, or break out of the style element. CSS-based
//     exfiltration of page content is not a concern for these pages:
//     they hold no secrets, and their content comes from the same URL.
//   - Video/poster/logo media URLs are intentionally NOT allowlisted
//     here: playing user-supplied media URLs is the embed tool's
//     purpose, and React attribute escaping keeps them attributes.
//     A javascript: media URL does not execute in a <video>/<img> src.
//   - All three functions accept unknown input and fail closed to ""
//     (or "0" for the start offset) on non-string input, so a
//     malformed ?data= blob can never produce an unsanitized value.

/** Strip a stylesheet of anything that can break out of a <style> element
 * or load a remote resource. Non-string input sanitizes to "". */
export function sanitizeEmbedCss(css: unknown): string {
	if (typeof css !== "string") {
		return "";
	}
	let out = css;
	// 1. No "<" survives: no tag can open, including the </style> breakout.
	out = out.replace(/</g, "");
	// 2. @import rules are removed whole, so no remote stylesheet loads.
	//    The [^;]*;? form also handles a trailing @import with no ";".
	out = out.replace(/@import[^;]*;?/gi, "");
	// 3. url(...) references are removed whole, so no remote resource
	//    is referenced (no beacons, no stylesheet-by-url). A second
	//    pass strips any unclosed url( token, leaving at most an
	//    invalid declaration fragment the CSS parser drops.
	out = out.replace(/url\s*\([^)]*\)/gi, "");
	out = out.replace(/url\s*\(/gi, "");
	// 4. Legacy vectors, removed for completeness (no modern engine runs
	//    them, but they must not survive a sanitizer pass either).
	out = out.replace(/expression\s*\(/gi, "");
	out = out.replace(/javascript\s*:/gi, "");
	return out;
}

/** Normalize a YouTube video ID to the characters a video ID can
 * contain. Everything else (/, ?, &, quotes, whitespace) is dropped,
 * so the value cannot escape the video-ID slot of the iframe path.
 * Non-string input, and input with no surviving characters, give "".
 * The 64-character cap is generous (real YouTube IDs are 11 chars)
 * and only bounds absurd input lengths. */
export function sanitizeYouTubeVideoId(id: unknown): string {
	if (typeof id !== "string") {
		return "";
	}
	return id.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 64);
}

/** Normalize an embed start offset to a plain non-negative integer
 * number of seconds, capped at 24 hours. Anything that is not exactly
 * digits (including "90&rel=0" query smuggling) gives "0". */
export function sanitizeEmbedStart(start: unknown): string {
	if (typeof start !== "string" || !/^\d+$/.test(start)) {
		return "0";
	}
	const seconds = Number.parseInt(start, 10);
	if (!Number.isFinite(seconds) || seconds < 0) {
		return "0";
	}
	return String(Math.min(seconds, 86400));
}
