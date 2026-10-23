import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import JSONFormatterTool from "@/components/tools/developer/JSONFormatterTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "JSON Formatter",
	description: "Format, validate and beautify JSON online for free: pretty-print minified JSON, adjust indentation and spot syntax errors instantly. Runs in your browser with no uploads and no signup.",
	route: "/json-formatter",
	category: "developer",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/json-formatter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<JSONFormatterTool />
		</ToolLayout>
	);
}
