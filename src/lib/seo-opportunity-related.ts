import { getAllTools, getToolByExtraSlug, type Tool } from "@/lib/tools";
import {
	getSeoOpportunityBySlug,
	type SeoOpportunity,
} from "@/data/seo-opportunities";

// Maps an opportunity's display category to the registry category key used
// for related-tool cards. Shared with the intent page's synthetic tool so
// both stay in sync; unknown categories fall back to "utilities".
export function categoryKeyForOpportunity(opportunity: SeoOpportunity) {
	if (opportunity.category === "Exam Image Tools") return "exam-tools";
	if (opportunity.category === "Student Calculators") return "calculators";
	if (opportunity.category === "API Key Testers") return "developer";
	if (opportunity.category === "SEO Tools") return "seo";
	return "utilities";
}

// Builds the "Related Tools & Workflows" list for a standalone SEO
// opportunity page. Used by src/app/(intent)/[slug]/page.tsx; kept in this
// module (not in the page file) so tests can exercise the real function
// without importing a Next.js page.
//
// Resolution order, and why each step exists:
//
// 1. Registry tools, exactly as before: a tool matches when its route is
//    the opportunity's parentToolRoute or one of its relatedSlugs turned
//    into a route, or when its id is one of the relatedSlugs. This step
//    is unchanged, in registry order, so no existing card moves or drops.
// 2. ExtraSlug tools: a relatedSlug that is a tool's extraSlug (e.g.
//    "passport-photo-resizer-india" for passport-photo-maker) previously
//    matched nothing and was silently dropped. The tool card now appears.
// 3. Sibling opportunity pages: a relatedSlug naming another opportunity
//    (e.g. "claude-api-key-tester" from a validator page) previously
//    matched nothing and was silently dropped. It now appears as a card
//    built from the sibling's own h1/intro/route — the same fields the
//    synthetic page tool uses — so the card links to a real page with
//    honest copy, not an invented tool.
//
// A relatedSlug that matches both a tool and an opportunity keeps the tool
// card (dedup by id, then by route); a slug naming the page itself is
// skipped. The list stays capped at 12; ToolLayout renders the first 6.
export function relatedToolsForOpportunity(
	opportunity: SeoOpportunity,
): Tool[] {
	const tools = getAllTools();
	const relatedRoutes = new Set([
		opportunity.parentToolRoute,
		...opportunity.relatedSlugs.map((slug) => `/${slug}`),
	]);

	const matched = tools.filter(
		(tool) =>
			relatedRoutes.has(tool.route) ||
			opportunity.relatedSlugs.includes(tool.id),
	);
	const seenIds = new Set(matched.map((tool) => tool.id));
	const seenRoutes = new Set(matched.map((tool) => tool.route));

	for (const slug of opportunity.relatedSlugs) {
		const extraTool = getToolByExtraSlug(slug);
		if (extraTool && !seenIds.has(extraTool.id)) {
			matched.push(extraTool);
			seenIds.add(extraTool.id);
			seenRoutes.add(extraTool.route);
		}
	}

	for (const slug of opportunity.relatedSlugs) {
		if (slug === opportunity.slug) continue;
		const sibling = getSeoOpportunityBySlug(slug);
		if (
			sibling &&
			!seenIds.has(sibling.slug) &&
			!seenRoutes.has(sibling.route)
		) {
			matched.push({
				id: sibling.slug,
				name: sibling.h1,
				description: sibling.intro,
				route: sibling.route,
				category: categoryKeyForOpportunity(sibling),
				categoryName: sibling.category,
				categorySlug: categoryKeyForOpportunity(sibling),
				seoTitle: sibling.title,
				seoDescription: sibling.metaDescription,
			});
			seenIds.add(sibling.slug);
			seenRoutes.add(sibling.route);
		}
	}

	return matched.slice(0, 12);
}
