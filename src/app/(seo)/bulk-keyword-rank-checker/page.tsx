import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Bulk Keyword Rank Checker",
	description: "Private Bulk Keyword Rank Checker: privately validate website data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/bulk-keyword-rank-checker",
	category: "seo",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/bulk-keyword-rank-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSafeHttp toolId="bulk-keyword-rank-checker" />
		</ToolLayout>
	);
}
