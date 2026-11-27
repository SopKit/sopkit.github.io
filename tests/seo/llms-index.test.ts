import { describe, expect, it } from "bun:test";
import { readFileSync } from "fs";
import { join } from "path";
import { getAllCategories } from "../../src/lib/tools";
import { buildCanonicalUrl } from "../../src/seo/canonical";

const ROOT = process.cwd();
const llmsTxt = readFileSync(join(ROOT, "public/llms.txt"), "utf8");
const structuredDataSrc = readFileSync(
	join(ROOT, "src/components/shared/StructuredData.tsx"),
	"utf8",
);

function parseCategoryHubRoutes(): Record<string, string> {
	const block = structuredDataSrc.match(
		/const CATEGORY_HUB_ROUTES:\s*Record<string,\s*string>\s*=\s*\{([\s\S]*?)\};/,
	);
	if (!block) throw new Error("Could not locate CATEGORY_HUB_ROUTES in StructuredData.tsx");
	const routes: Record<string, string> = {};
	for (const match of block[1].matchAll(/"([^"]+)"\s*:\s*"([^"]+)"/g)) {
		routes[match[1]] = match[2];
	}
	return routes;
}

describe("public/llms.txt category hubs", () => {
	it("includes every indexable category hub with a canonical trailing-slash URL", () => {
		const hubSectionMatch = llmsTxt.match(
			/## Category hubs\n\n([\s\S]*?)\n\n## Tools by category/,
		);
		expect(hubSectionMatch).not.toBeNull();
		const hubSection = hubSectionMatch?.[1] ?? "";

		const hubRoutes = parseCategoryHubRoutes();
		const categories = getAllCategories();

		for (const category of categories) {
			const route = hubRoutes[category.slug];
			if (!route || category.tools.length === 0) continue;
			const canonicalHubUrl = buildCanonicalUrl(route);
			expect(hubSection).toContain(`(${canonicalHubUrl})`);
		}

		// Empty blog and non-hub company categories should not be listed as hubs
		expect(hubSection).not.toContain("/blog/");
		expect(hubSection).not.toContain("/company/");
	});
});
