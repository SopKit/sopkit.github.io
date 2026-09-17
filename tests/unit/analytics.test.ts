import { describe, it, expect, beforeEach } from "bun:test";
import {
	sanitizeSearchQuery,
	getFileSizeBracket,
	getRouteCategory,
	detectUserProperties,
	setGAUserProperties,
	sendGAEvent,
	trackPageView,
	trackScrollDepth,
	trackEngagementTime,
	trackDownload,
	trackNetworkStatusChange,
	trackPackageInteraction,
	trackError,
	GA_MEASUREMENT_ID,
} from "../../src/lib/analytics";

describe("Telemetry & Privacy Sanitization", () => {
	it("redacts email addresses from search queries", () => {
		const result = sanitizeSearchQuery("find user john.doe@example.com immediately");
		expect(result).not.toContain("john.doe@example.com");
		expect(result).toContain("[redacted_email]");
	});

	it("redacts long alphanumeric API keys or tokens", () => {
		const result = sanitizeSearchQuery("secret key abcdef1234567890abcdef1234567890");
		expect(result).not.toContain("abcdef1234567890abcdef1234567890");
		expect(result).toContain("[redacted_token]");
	});

	it("truncates search query to maximum 40 characters", () => {
		const longQuery = "a".repeat(100);
		const result = sanitizeSearchQuery(longQuery);
		expect(result.length).toBeLessThanOrEqual(40);
	});

	it("preserves legitimate tool search keywords", () => {
		const result = sanitizeSearchQuery("pdf compressor online");
		expect(result).toBe("pdf compressor online");
	});
});

describe("File Size Brackets (Zero PII)", () => {
	it("brackets file sizes accurately", () => {
		expect(getFileSizeBracket(500 * 1024)).toBe("<1MB");
		expect(getFileSizeBracket(2 * 1024 * 1024)).toBe("1-5MB");
		expect(getFileSizeBracket(10 * 1024 * 1024)).toBe("5-25MB");
		expect(getFileSizeBracket(50 * 1024 * 1024)).toBe("25MB+");
	});
});

describe("Route Category Classification", () => {
	it("categorizes routes correctly", () => {
		expect(getRouteCategory("/")).toBe("home");
		expect(getRouteCategory("/search")).toBe("search");
		expect(getRouteCategory("/search?q=pdf")).toBe("search");
		expect(getRouteCategory("/packages")).toBe("packages");
		expect(getRouteCategory("/packages/cli")).toBe("packages");
		expect(getRouteCategory("/about")).toBe("company");
		expect(getRouteCategory("/privacy")).toBe("company");
		expect(getRouteCategory("/image-tools")).toBe("category_hub");
		expect(getRouteCategory("/generators")).toBe("category_hub");
		expect(getRouteCategory("/calculators")).toBe("category_hub");
		expect(getRouteCategory("/pdf-merger")).toBe("tool");
		expect(getRouteCategory("/svg-optimizer")).toBe("tool");
	});
});

describe("GA4 Custom User Properties & Event Dispatcher", () => {
	beforeEach(() => {
		// Mock window and dataLayer
		(globalThis as any).window = {
			dataLayer: [],
			location: {
				origin: "https://sopkit.space",
				pathname: "/pdf-compressor",
				hostname: "sopkit.space",
			},
		};
	});

	it("detects user properties with safe fallbacks in server/test environments", () => {
		const props = detectUserProperties();
		expect(props).toBeDefined();
		expect(typeof props.device_memory_tier).toBe("string");
		expect(typeof props.is_pwa).toBe("boolean");
	});

	it("pushes user properties to dataLayer correctly", () => {
		setGAUserProperties({
			device_memory_tier: "4-8GB",
			user_theme: "dark",
			is_pwa: false,
		});

		const events = (globalThis as any).window.dataLayer;
		expect(events.length).toBeGreaterThan(0);
		expect(events[0][0]).toBe("set");
		expect(events[0][1]).toBe("user_properties");
		expect(events[0][2].device_memory_tier).toBe("4-8GB");
		expect(events[0][2].user_theme).toBe("dark");
	});

	it("dispatches sanitized page_view events without query strings", () => {
		trackPageView("/pdf-compressor?ref=ad&token=sensitive_12345", "PDF Compressor");

		const events = (globalThis as any).window.dataLayer;
		const pageViewEvent = events.find((e: any[]) => e[0] === "event" && e[1] === "page_view");
		expect(pageViewEvent).toBeDefined();
		expect(pageViewEvent[2].page_path).toBe("/pdf-compressor");
		expect(pageViewEvent[2].page_location).toBe("https://sopkit.space/pdf-compressor");
		expect(pageViewEvent[2].route_category).toBe("tool");
		expect(pageViewEvent[2].send_to).toBe(GA_MEASUREMENT_ID);
	});

	it("dispatches scroll depth milestones", () => {
		trackScrollDepth(75, "/image-tools");

		const events = (globalThis as any).window.dataLayer;
		const scrollEvent = events.find((e: any[]) => e[0] === "event" && e[1] === "scroll");
		expect(scrollEvent).toBeDefined();
		expect(scrollEvent[2].percent_scrolled).toBe(75);
		expect(scrollEvent[2].page_path).toBe("/image-tools");
		expect(scrollEvent[2].route_category).toBe("category_hub");
	});

	it("dispatches active engagement time events", () => {
		trackEngagementTime(30, "/markdown-editor", "markdown-editor");

		const events = (globalThis as any).window.dataLayer;
		const engEvent = events.find((e: any[]) => e[0] === "event" && e[1] === "user_engagement");
		expect(engEvent).toBeDefined();
		expect(engEvent[2].engagement_time_msec).toBe(30000);
		expect(engEvent[2].tool_id).toBe("markdown-editor");
	});

	it("dispatches file_download events with sanitized names", () => {
		trackDownload("image-converter", "webp", 1500000, "user_photo.webp");

		const events = (globalThis as any).window.dataLayer;
		const dlEvent = events.find((e: any[]) => e[0] === "event" && e[1] === "file_download");
		expect(dlEvent).toBeDefined();
		expect(dlEvent[2].tool_id).toBe("image-converter");
		expect(dlEvent[2].file_extension).toBe("webp");
		expect(dlEvent[2].size_bracket).toBe("1-5MB");
	});

	it("dispatches package interaction events", () => {
		trackPackageInteraction("@sopkit/color", "copy", "bun");

		const events = (globalThis as any).window.dataLayer;
		const pkgEvent = events.find((e: any[]) => e[0] === "event" && e[1] === "package_interaction");
		expect(pkgEvent).toBeDefined();
		expect(pkgEvent[2].package_name).toBe("@sopkit/color");
		expect(pkgEvent[2].interaction_type).toBe("copy");
		expect(pkgEvent[2].package_manager).toBe("bun");
	});

	it("dispatches network status change events", () => {
		trackNetworkStatusChange("offline", "pdf-merger");

		const events = (globalThis as any).window.dataLayer;
		const netEvent = events.find((e: any[]) => e[0] === "event" && e[1] === "network_status_change");
		expect(netEvent).toBeDefined();
		expect(netEvent[2].network_status).toBe("offline");
		expect(netEvent[2].tool_id).toBe("pdf-merger");
	});

	it("sanitizes file paths, emails, and tokens in error diagnostics", () => {
		trackError(
			"file_read_error",
			"Error in /Users/secret/file.txt for test@example.com with 123456789012345678901234",
			"image-resizer"
		);

		const events = (globalThis as any).window.dataLayer;
		const errEvent = events.find((e: any[]) => e[0] === "event" && e[1] === "exception");
		expect(errEvent).toBeDefined();
		expect(errEvent[2].description).not.toContain("/Users/secret");
		expect(errEvent[2].description).not.toContain("test@example.com");
		expect(errEvent[2].description).not.toContain("123456789012345678901234");
		expect(errEvent[2].description).toContain("[path]");
		expect(errEvent[2].description).toContain("[email]");
		expect(errEvent[2].description).toContain("[token]");
	});
});
