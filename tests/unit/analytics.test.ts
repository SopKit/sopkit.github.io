import { describe, it, expect } from "bun:test";
import { sanitizeSearchQuery } from "../../src/lib/analytics";

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
