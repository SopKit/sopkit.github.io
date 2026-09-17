/**
 * SopKit GA4 (Google Analytics 4) Telemetry & Event Engine
 *
 * Full-featured, privacy-conscious GA4 integration supporting SPA navigation,
 * tool lifecycle, search discovery, embed engagement, Web Vitals, and errors.
 * Strictly zero PII: no file names, text content, or personal identifiers are recorded.
 */

export const GA_MEASUREMENT_ID =
	process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-HKX99R92SE";

declare global {
	interface Window {
		dataLayer: any[];
		gtag?: (...args: any[]) => void;
	}
}

/**
 * Check if analytics telemetry is permitted by user settings and environment.
 */
export function isAnalyticsAllowed(): boolean {
	if (typeof window === "undefined") return false;
	try {
		if ((window as any).__sopkit_analytics_disabled) return false;
		if (localStorage.getItem("sopkit_consent_analytics") === "denied") return false;
	} catch {
		// Ignore storage errors in restrictive/incognito contexts
	}
	return true;
}

/**
 * Redact sensitive patterns (emails, tokens, keys) and clamp search query length.
 */
export function sanitizeSearchQuery(rawQuery: string): string {
	if (!rawQuery) return "";
	let sanitized = rawQuery.trim().toLowerCase();
	// Redact emails
	sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[redacted_email]");
	// Redact long random tokens/hashes (24+ continuous alphanumeric chars)
	sanitized = sanitized.replace(/\b[a-zA-Z0-9_-]{24,}\b/g, "[redacted_token]");
	// Truncate to safe length (max 40 characters)
	return sanitized.slice(0, 40);
}

/**
 * Safe invocation of gtag that queues events if gtag.js has not finished initializing.
 */
export function sendGAEvent(
	eventName: string,
	eventParams: Record<string, any> = {}
) {
	if (typeof window === "undefined" || !isAnalyticsAllowed()) return;

	try {
		if (typeof window.gtag === "function") {
			window.gtag("event", eventName, eventParams);
		} else {
			window.dataLayer = window.dataLayer || [];
			window.dataLayer.push(["event", eventName, eventParams]);
		}
	} catch (err) {
		if (process.env.NODE_ENV === "development") {
			console.warn("[GA4] Failed to send event:", eventName, err);
		}
	}
}

/**
 * Track SPA Page View on Next.js client-side route transitions (query strings stripped)
 */
export function trackPageView(url: string, title?: string) {
	if (!isAnalyticsAllowed()) return;

	// Strip query parameters and hash fragments to prevent leaking tokens or query state
	const cleanPath = (url || "/").split("?")[0].split("#")[0] || "/";
	const origin = typeof window !== "undefined" ? window.location.origin : "https://sopkit.space";

	sendGAEvent("page_view", {
		page_location: `${origin}${cleanPath}`,
		page_path: cleanPath,
		page_title: title || (typeof document !== "undefined" ? document.title : ""),
		send_to: GA_MEASUREMENT_ID,
	});
}

/**
 * Track Search Discovery (Hero search or Tool Directory filter, sanitized)
 */
export function trackSearch(
	searchTerm: string,
	resultsCount?: number,
	category?: string
) {
	const sanitized = sanitizeSearchQuery(searchTerm);
	if (!sanitized) return;
	sendGAEvent("search", {
		search_term: sanitized,
		results_count: resultsCount,
		search_category: (category || "all").slice(0, 30),
	});
}

/**
 * Track Category Browsing / Tab Selection
 */
export function trackCategorySelect(categoryName: string) {
	sendGAEvent("select_content", {
		content_type: "tool_category",
		item_id: categoryName,
	});
}

/**
 * Track Tool Page View
 */
export function trackToolView(tool: {
	id: string;
	name: string;
	category?: string;
}) {
	sendGAEvent("view_item", {
		items: [
			{
				item_id: tool.id,
				item_name: tool.name,
				item_category: tool.category || "utility",
			},
		],
		execution_type: "client_sandbox",
	});
}

export type ToolAction =
	| "start"
	| "process"
	| "complete"
	| "error"
	| "download"
	| "copy"
	| "reset";

/**
 * Track Tool Execution Lifecycle
 */
export function trackToolAction(
	toolId: string,
	action: ToolAction,
	extraParams?: {
		durationMs?: number;
		format?: string;
		errorType?: string;
	}
) {
	sendGAEvent("tool_action", {
		tool_id: toolId,
		action_type: action,
		duration_ms: extraParams?.durationMs,
		output_format: extraParams?.format,
		error_type: extraParams?.errorType,
		execution_mode: "browser_wasm",
	});
}

/**
 * Helper to categorize file size into safe brackets without recording exact bytes or PII
 */
export function getFileSizeBracket(bytes: number): string {
	if (bytes < 1024 * 1024) return "<1MB";
	if (bytes < 5 * 1024 * 1024) return "1-5MB";
	if (bytes < 25 * 1024 * 1024) return "5-25MB";
	return "25MB+";
}

/**
 * Track File Processing (Anonymous format and size bracket only)
 */
export function trackFileProcessing(
	toolId: string,
	format: string,
	sizeBytes?: number
) {
	sendGAEvent("file_processing", {
		tool_id: toolId,
		file_format: format.toLowerCase().replace(/^\./, ""),
		size_bracket: sizeBytes !== undefined ? getFileSizeBracket(sizeBytes) : "unknown",
	});
}

/**
 * Track Clipboard Copying (Output results, colors, JSON, or code)
 */
export function trackCopyToClipboard(
	toolId: string,
	contentType: "result" | "code" | "url" | "embed"
) {
	sendGAEvent("copy_to_clipboard", {
		tool_id: toolId,
		content_type: contentType,
	});
}

/**
 * Track Webmaster Embed Widget Engagement
 */
export function trackEmbedInteraction(
	toolId: string,
	action: "copy_code" | "tab_switch" | "preview_click",
	format?: "html" | "react" | "url"
) {
	sendGAEvent("embed_interaction", {
		tool_id: toolId,
		embed_action: action,
		embed_format: format,
	});
}

/**
 * Track User Theme Mode Selection
 */
export function trackThemeChange(theme: "light" | "dark" | "system") {
	sendGAEvent("theme_change", {
		theme_mode: theme,
	});
}

/**
 * Track Outbound Link Clicks (origin + pathname only, strip query parameters)
 */
export function trackOutboundClick(destinationUrl: string, linkText?: string) {
	try {
		const parsed = new URL(destinationUrl, "https://sopkit.space");
		// Only send origin + pathname to prevent leaking query tokens or credentials
		const sanitizedUrl = `${parsed.origin}${parsed.pathname}`;
		sendGAEvent("outbound_click", {
			destination_url: sanitizedUrl,
			link_text: (linkText || "external_link").slice(0, 40),
		});
	} catch {
		sendGAEvent("outbound_click", {
			destination_url: "invalid_url",
			link_text: "external_link",
		});
	}
}

/**
 * Track Application & Tool Errors (sanitized error codes, no stack traces or personal data)
 */
export function trackError(
	errorType: string,
	message?: string,
	toolId?: string
) {
	// Sanitize error type to safe alphanumeric code
	const safeType = (errorType || "error").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
	// Sanitize message: strip stack traces, file paths, emails, and tokens
	const safeMsg = (message || "unspecified")
		.replace(/(file:\/\/[^\s]+|\/Users\/[^\s]+|\/home\/[^\s]+)/gi, "[path]")
		.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[email]")
		.replace(/\b[a-zA-Z0-9_-]{24,}\b/g, "[token]")
		.slice(0, 80);

	sendGAEvent("exception", {
		description: `${safeType}: ${safeMsg}`,
		fatal: false,
		tool_id: toolId ? toolId.slice(0, 40) : undefined,
	});
}

/**
 * Track Core Web Vitals to GA4 Custom Metrics
 */
export function trackWebVital(metric: {
	id: string;
	name: string;
	value: number;
	rating?: "good" | "needs-improvement" | "poor";
}) {
	sendGAEvent("web_vitals", {
		event_category: "Web Vitals",
		event_label: metric.id,
		value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
		metric_name: metric.name,
		metric_rating: metric.rating || "unrated",
		non_interaction: true,
	});
}
