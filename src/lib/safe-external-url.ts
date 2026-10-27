// Gate for clickable links built from user input or third-party content.
//
// React attribute escaping stops a value from breaking out of an href
// attribute, but it does NOT stop a dangerous scheme: a clicked
// <a href="javascript:..."> executes in the sopkit.space origin. Three
// tool pages used to render such values verbatim:
//
//   - SitemapUrlDownloader renders <loc> values from a fetched or
//     pasted sitemap as links. Both of its extraction paths already
//     constrain the scheme loosely (a startsWith("http") filter in
//     the DOMParser path, an https?://-only regex in the fallback
//     path), so no script scheme reached the anchor today — but the
//     constraint lived in two implicit per-path filters, not in an
//     explicit check at the sink, and the render-time gate below
//     replaces them with one.
//   - SeoToolkit renders the user-typed audit URL as the result link.
//   - TwitterVideoDownloader renders download hrefs parsed out of a
//     third-party service's HTML as links.
//   - QrReaderPremium gated its scanned-QR link on the loose
//     startsWith("http") test, which is implicit and case-sensitive.
//
// This module is the single check all four sites route through. It is
// deliberately an allowlist, not a denylist of javascript:/data::
// a denylist rots (a new executable scheme, or a parser quirk, slips
// past it), while http(s)-only fails closed on everything else,
// including relative URLs, protocol-relative URLs, and non-string
// input.
//
// Design notes, and what this module deliberately does NOT promise:
//
//   - Parsing uses the WHATWG URL parser (new URL, no base), the same
//     parser browsers use to resolve the href. That matters for
//     smuggling: the parser strips leading/trailing C0 controls and
//     spaces and removes ASCII tabs and newlines anywhere, so
//     "java\tscript:alert(1)" parses with scheme "javascript:" and is
//     rejected, and "\nhttps://example.com" parses as https: and is
//     accepted. The check therefore cannot be fooled by the exact
//     tricks that fool a startsWith/regex gate.
//   - safeExternalHref returns the PARSED href, not the input string,
//     so the attribute rendered is exactly the value that was checked
//     (scheme/host lowercased, path normalized). The original text
//     stays available to call sites for display.
//   - Relative URLs are rejected: these call sites link to external
//     destinations, and a relative value has no meaning there. Site
//     links (registry routes, constants) never go through this gate.
//   - This gate is for <a href> only. window.open targets are NOT
//     routed through it: modern browsers do not execute javascript:
//     URLs opened via window.open, and several window.open call sites
//     legitimately open blob:/data: download URLs that an http(s)-only
//     gate would break.

/** True only for absolute http: or https: URLs. Fails closed on
 *  non-strings, empty/whitespace input, unparsable input, and every
 *  other scheme (javascript:, data:, vbscript:, ftp:, mailto:, ...). */
export function isSafeExternalUrl(value: unknown): value is string {
	if (typeof value !== "string") {
		return false;
	}
	const trimmed = value.trim();
	if (trimmed === "") {
		return false;
	}
	let parsed: URL;
	try {
		parsed = new URL(trimmed);
	} catch {
		return false;
	}
	return parsed.protocol === "http:" || parsed.protocol === "https:";
}

/** The parsed, normalized href for a safe external URL, or null when
 *  the value must not be rendered as a link. Call sites render the
 *  original text as plain text in the null case, so the URL stays
 *  visible and copyable without becoming clickable. */
export function safeExternalHref(value: unknown): string | null {
	if (!isSafeExternalUrl(value)) {
		return null;
	}
	return new URL((value as string).trim()).href;
}
