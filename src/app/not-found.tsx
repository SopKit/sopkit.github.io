import type { Metadata } from "next";
import NotFoundView, { type NotFoundSuggestedTool } from "@/components/shared/NotFoundView";
import { getSearchToolRecords } from "@/lib/tools";

// Next.js renders its own `<meta name="robots" content="noindex">` on the
// /404 route (NonIndex in app-render). The root layout also declares
// `robots: { index: true, follow: true }`, and because the not-found
// metadata is merged last, that layout tag was emitted alongside Next's
// noindex, giving crawlers two conflicting directives. Setting `robots` to
// null here resolves to no robots tag from the metadata pipeline, so the
// 404 page carries only the framework's noindex. Every other route still
// inherits the layout's index, follow.
export const metadata: Metadata = {
	title: "Page Not Found",
	robots: null,
};

export default function NotFoundPage() {
	// Resolved on the server so the client view ships no registry JSON.
	const suggestedTools: NotFoundSuggestedTool[] = getSearchToolRecords()
		.filter((tool) => tool.popular)
		.slice(0, 4)
		.map(({ id, name, route, description }) => ({ id, name, route, description }));

	return <NotFoundView suggestedTools={suggestedTools} />;
}
