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
 * Safe invocation of gtag that queues events if gtag.js has not finished initializing.
 */
export function sendGAEvent(
	eventName: string,
	eventParams: Record<string, any> = {}
) {
	if (typeof window === "undefined") return;

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
 * Track SPA Page View on Next.js client-side route transitions
 */
export function trackPageView(url: string, title?: string) {
	sendGAEvent("page_view", {
		page_location: window.location.href,
		page_path: url,
		page_title: title || (typeof document !== "undefined" ? document.title : ""),
		send_to: GA_MEASUREMENT_ID,
	});
}

/**
 * Track Search Discovery (Hero search or Tool Directory filter)
 */
export function trackSearch(
	searchTerm: string,
	resultsCount?: number,
	category?: string
) {
	if (!searchTerm.trim()) return;
	sendGAEvent("search", {
		search_term: searchTerm.trim().toLowerCase(),
		results_count: resultsCount,
		search_category: category || "all",
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
 * Track Outbound Link Clicks (GitHub, External Documentation, Social)
 */
export function trackOutboundClick(destinationUrl: string, linkText?: string) {
	sendGAEvent("outbound_click", {
		destination_url: destinationUrl,
		link_text: linkText || "external_link",
	});
}

/**
 * Track Application & Tool Errors
 */
export function trackError(
	errorType: string,
	message?: string,
	toolId?: string
) {
	sendGAEvent("exception", {
		description: `${errorType}: ${message || "unknown error"}`,
		fatal: false,
		tool_id: toolId,
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
