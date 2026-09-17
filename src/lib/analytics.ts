/**
 * SopKit GA4 (Google Analytics 4) Telemetry & Event Engine
 *
 * Full-featured, privacy-conscious GA4 integration supporting SPA navigation,
 * custom user properties, tool lifecycle, search discovery, embed engagement,
 * Web Vitals, scroll depth milestones, active engagement duration, and diagnostics.
 * Strictly zero PII: no file names, text content, or personal identifiers are recorded.
 */

import { SITE_URL } from "@/constants/config";

export const GA_MEASUREMENT_ID =
	process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-HKX99R92SE";

declare global {
	interface Window {
		dataLayer: any[];
		gtag?: (...args: any[]) => void;
		__sopkit_analytics_disabled?: boolean;
	}
}

/**
 * Custom GA4 User Properties defining user hardware, display, and browser cohorts.
 */
export interface GAUserProperties {
	device_memory_tier?: string;
	hardware_concurrency_tier?: string;
	effective_connection_type?: string;
	is_pwa?: boolean;
	user_theme?: "light" | "dark" | "system";
	screen_resolution_tier?: "mobile_sm" | "tablet" | "desktop_hd" | "desktop_ultra";
	screen_pixel_ratio?: number;
	browser_engine?: "blink" | "webkit" | "gecko" | "other";
	os_platform?: "macos" | "windows" | "linux" | "ios" | "android" | "other";
	preferred_language?: string;
	prefers_reduced_motion?: boolean;
	has_web_assembly?: boolean;
	has_web_worker?: boolean;
	has_service_worker?: boolean;
	user_timezone?: string;
}

/**
 * Check if analytics telemetry is permitted by user settings and environment.
 */
export function isAnalyticsAllowed(): boolean {
	if (typeof window === "undefined") return false;
	try {
		if (window.__sopkit_analytics_disabled) return false;
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
 * Set persistent GA4 Custom User Properties (`user_properties`) for audience segmentation.
 */
export function setGAUserProperties(properties: Partial<GAUserProperties>) {
	if (typeof window === "undefined" || !isAnalyticsAllowed()) return;

	try {
		if (typeof window.gtag === "function") {
			window.gtag("set", "user_properties", properties);
		} else {
			window.dataLayer = window.dataLayer || [];
			window.dataLayer.push(["set", "user_properties", properties]);
		}
	} catch (err) {
		if (process.env.NODE_ENV === "development") {
			console.warn("[GA4] Failed to set user properties:", err);
		}
	}
}

/**
 * Detect client execution environment metadata for GA4 user properties (zero PII)
 */
export function detectUserProperties(): GAUserProperties {
	if (typeof window === "undefined") {
		return {
			device_memory_tier: "unknown",
			hardware_concurrency_tier: "unknown",
			effective_connection_type: "unknown",
			is_pwa: false,
			screen_resolution_tier: "desktop_hd",
			browser_engine: "other",
			os_platform: "other",
			has_web_assembly: false,
		};
	}

	try {
		const isPwa =
			window.matchMedia?.("(display-mode: standalone)")?.matches ||
			(window.navigator as any).standalone === true;

		// Connection tier
		const nav = window.navigator as any;
		const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
		const effectiveType = conn?.effectiveType || (nav.onLine === false ? "offline" : "unknown");

		// Memory tier
		let memTier = "unknown";
		if (nav.deviceMemory) {
			const gm = nav.deviceMemory;
			if (gm < 2) memTier = "<2GB";
			else if (gm <= 4) memTier = "2-4GB";
			else if (gm <= 8) memTier = "4-8GB";
			else memTier = "8GB+";
		}

		// Concurrency tier
		let concTier = "unknown";
		if (nav.hardwareConcurrency) {
			const hc = nav.hardwareConcurrency;
			if (hc <= 2) concTier = "1-2";
			else if (hc <= 4) concTier = "4";
			else if (hc <= 8) concTier = "6-8";
			else concTier = "12+";
		}

		// Screen tier
		const w = window.innerWidth || (typeof screen !== "undefined" ? screen.width : 1200);
		let screenTier: "mobile_sm" | "tablet" | "desktop_hd" | "desktop_ultra" = "desktop_hd";
		if (w < 640) screenTier = "mobile_sm";
		else if (w < 1024) screenTier = "tablet";
		else if (w >= 1920) screenTier = "desktop_ultra";

		// OS Platform
		const ua = nav.userAgent || "";
		let os: "macos" | "windows" | "linux" | "ios" | "android" | "other" = "other";
		if (/iPhone|iPad|iPod/i.test(ua)) os = "ios";
		else if (/Android/i.test(ua)) os = "android";
		else if (/Macintosh|Mac OS X/i.test(ua)) os = "macos";
		else if (/Windows NT/i.test(ua)) os = "windows";
		else if (/Linux/i.test(ua)) os = "linux";

		// Browser Engine
		let engine: "blink" | "webkit" | "gecko" | "other" = "other";
		if (/Chrome|Chromium|Edg/i.test(ua)) engine = "blink";
		else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) engine = "webkit";
		else if (/Firefox/i.test(ua)) engine = "gecko";

		// WebAssembly check
		const hasWasm = typeof WebAssembly === "object" && typeof WebAssembly.instantiate === "function";

		// Theme
		const storedTheme = typeof localStorage !== "undefined" ? localStorage.getItem("theme") : null;
		let theme: "light" | "dark" | "system" = "system";
		if (storedTheme === "dark" || storedTheme === "light") {
			theme = storedTheme;
		} else if (window.matchMedia?.("(prefers-color-scheme: dark)")?.matches) {
			theme = "dark";
		}

		// Timezone (safe IANA string, e.g. "America/New_York")
		let timezone = "UTC";
		try {
			timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
		} catch {}

		return {
			device_memory_tier: memTier,
			hardware_concurrency_tier: concTier,
			effective_connection_type: effectiveType,
			is_pwa: isPwa,
			user_theme: theme,
			screen_resolution_tier: screenTier,
			screen_pixel_ratio: Math.round(window.devicePixelRatio || 1),
			browser_engine: engine,
			os_platform: os,
			preferred_language: (nav.language || "en").slice(0, 10),
			prefers_reduced_motion: window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false,
			has_web_assembly: hasWasm,
			has_web_worker: typeof Worker !== "undefined",
			has_service_worker: "serviceWorker" in navigator,
			user_timezone: timezone.slice(0, 32),
		};
	} catch {
		return {
			device_memory_tier: "unknown",
			hardware_concurrency_tier: "unknown",
			effective_connection_type: "unknown",
			is_pwa: false,
			screen_resolution_tier: "desktop_hd",
			browser_engine: "other",
			os_platform: "other",
			has_web_assembly: false,
		};
	}
}

let userPropsInitialized = false;

/**
 * Initialize custom GA4 user properties once per session.
 */
export function initGAUserProperties() {
	if (userPropsInitialized || typeof window === "undefined" || !isAnalyticsAllowed()) return;
	const props = detectUserProperties();
	setGAUserProperties(props);
	userPropsInitialized = true;
}

/**
 * Classify route categories cleanly without external dependencies.
 */
export function getRouteCategory(path: string): string {
	const clean = (path || "/").split("?")[0].split("#")[0] || "/";
	if (clean === "/") return "home";
	if (clean.startsWith("/search")) return "search";
	if (clean.startsWith("/packages")) return "packages";
	if (clean.startsWith("/blog")) return "blog";
	if (
		clean.startsWith("/about") ||
		clean.startsWith("/privacy") ||
		clean.startsWith("/terms") ||
		clean.startsWith("/contact")
	) {
		return "company";
	}
	if (
		clean.endsWith("-tools") ||
		clean === "/generators" ||
		clean === "/calculators" ||
		clean === "/developer-tools" ||
		clean === "/other-tools"
	) {
		return "category_hub";
	}
	return "tool";
}

/**
 * Track SPA Page View on Next.js client-side route transitions (query strings stripped)
 */
export function trackPageView(url: string, title?: string, category?: string) {
	if (!isAnalyticsAllowed()) return;

	// Strip query parameters and hash fragments to prevent leaking tokens or query state
	const cleanPath = (url || "/").split("?")[0].split("#")[0] || "/";
	const origin = typeof window !== "undefined" ? window.location.origin : SITE_URL;
	const routeCategory = category || getRouteCategory(cleanPath);

	sendGAEvent("page_view", {
		page_location: `${origin}${cleanPath}`,
		page_path: cleanPath,
		page_title: title || (typeof document !== "undefined" ? document.title : ""),
		route_category: routeCategory,
		send_to: GA_MEASUREMENT_ID,
	});
}

/**
 * Track Scroll Depth Milestones (25%, 50%, 75%, 90%, 100%)
 */
export function trackScrollDepth(
	depthPercent: 25 | 50 | 75 | 90 | 100,
	pagePath: string
) {
	const cleanPath = (pagePath || "/").split("?")[0].split("#")[0] || "/";
	sendGAEvent("scroll", {
		percent_scrolled: depthPercent,
		page_path: cleanPath,
		route_category: getRouteCategory(cleanPath),
	});
}

/**
 * Track Active Tab Engagement Time (in seconds)
 */
export function trackEngagementTime(
	seconds: number,
	pagePath: string,
	toolId?: string
) {
	if (seconds <= 0) return;
	const cleanPath = (pagePath || "/").split("?")[0].split("#")[0] || "/";
	sendGAEvent("user_engagement", {
		engagement_time_msec: Math.round(seconds * 1000),
		page_path: cleanPath,
		tool_id: toolId ? toolId.slice(0, 40) : undefined,
		route_category: getRouteCategory(cleanPath),
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
 * Track File Downloads (zero PII, safe extension and bracket only)
 */
export function trackDownload(
	toolId: string,
	fileExtension: string,
	sizeBytes?: number,
	filename?: string
) {
	const cleanExt = (fileExtension || "").toLowerCase().replace(/^\./, "").slice(0, 10);
	const safeName = filename
		? filename.replace(/^.*[\\/]/, "").replace(/[^a-zA-Z0-9_.-]/g, "_").slice(0, 40)
		: `sopkit-export.${cleanExt || "dat"}`;

	sendGAEvent("file_download", {
		tool_id: toolId ? toolId.slice(0, 40) : "direct_download",
		file_extension: cleanExt || "unknown",
		file_name: safeName,
		size_bracket: sizeBytes !== undefined ? getFileSizeBracket(sizeBytes) : "unknown",
		link_domain: typeof window !== "undefined" ? window.location.hostname : "sopkit.space",
	});
}

/**
 * Track Clipboard Copying (Output results, colors, JSON, or code)
 */
export function trackCopyToClipboard(
	toolId: string,
	contentType: "result" | "code" | "url" | "embed" | string = "result"
) {
	sendGAEvent("copy_to_clipboard", {
		tool_id: toolId ? toolId.slice(0, 40) : "direct",
		content_type: contentType.slice(0, 40),
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
	// Also update user property for persistent cohort
	setGAUserProperties({ user_theme: theme });
}

/**
 * Track Outbound Link Clicks (origin + pathname only, strip query parameters)
 */
export function trackOutboundClick(destinationUrl: string, linkText?: string) {
	try {
		const parsed = new URL(destinationUrl, SITE_URL);
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

/**
 * Detect client execution environment metadata for GA4 user/session properties (zero PII)
 */
export function getClientEnvironmentProperties(): Record<string, any> {
	return detectUserProperties();
}

/**
 * Track PWA Installation prompt decisions
 */
export function trackPWAInstall(outcome: "accepted" | "dismissed") {
	sendGAEvent("pwa_install_prompt", {
		install_outcome: outcome,
		...detectUserProperties(),
	});
}

/**
 * Track Tool Social & Clipboard Sharing
 */
export function trackShare(toolId: string, method: "native_share" | "clipboard") {
	sendGAEvent("share", {
		method,
		content_type: "tool",
		item_id: toolId,
	});
}

/**
 * Track Granular Tool Execution Telemetry
 */
export function trackToolExecution(
	toolId: string,
	options: {
		durationMs?: number;
		success: boolean;
		inputLengthBracket?: string;
		action?: string;
		category?: string;
	}
) {
	sendGAEvent("tool_execution", {
		tool_id: toolId,
		tool_category: options.category || "utility",
		action_type: options.action || "execute",
		is_successful: options.success,
		duration_ms: options.durationMs ? Math.round(options.durationMs) : undefined,
		input_bracket: options.inputLengthBracket,
		execution_engine: "client_browser",
		...detectUserProperties(),
	});
}

/**
 * Track Offline Tool Usage (Local ServiceWorker PWA capability)
 */
export function trackOfflineUsage(toolId: string) {
	sendGAEvent("offline_tool_usage", {
		tool_id: toolId,
		is_offline: true,
		timestamp: Date.now(),
	});
}

/**
 * Track Network Connectivity Status Changes (online/offline transitions)
 */
export function trackNetworkStatusChange(status: "online" | "offline", activeTool?: string) {
	sendGAEvent("network_status_change", {
		network_status: status,
		tool_id: activeTool ? activeTool.slice(0, 40) : undefined,
		timestamp: Date.now(),
	});
}

/**
 * Track NPM Package Interactions (copying install command, tabs, links)
 */
export function trackPackageInteraction(
	packageName: string,
	interactionType: "copy" | "tab" | "github" | "npm",
	packageManager?: string
) {
	sendGAEvent("package_interaction", {
		package_name: (packageName || "").slice(0, 40),
		interaction_type: interactionType,
		package_manager: packageManager || "npm",
	});
}

/**
 * Track NPM Package Installation Command Copying
 */
export function trackPackageCopy(
	packageName: string,
	packageManager: "npm" | "pnpm" | "yarn" | "bun" | "npx" = "npm"
) {
	trackPackageInteraction(packageName, "copy", packageManager);
	sendGAEvent("package_copy", {
		package_name: packageName,
		package_manager: packageManager,
	});
}
