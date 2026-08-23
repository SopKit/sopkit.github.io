import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import JsonDiffChecker from "@/components/tools/developer/JsonDiffChecker";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "JSON Diff Checker",
	description: "Compare two JSON objects side-by-side to highlight added, removed, and modified keys with precision. Format, validate, and debug JSON payloads entirely in browser memory.",
	route: "/json-diff-checker",
	category: "developer",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/json-diff-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<JsonDiffChecker />
		</ToolLayout>
	);
}
