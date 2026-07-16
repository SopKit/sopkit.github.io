import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import JsonFormatterTool from "@/components/tools/code/JsonFormatterTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "JSON Viewer",
	description: "Private JSON Viewer: privately extract code and data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/json-viewer",
	category: "developer",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/json-viewer");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<JsonFormatterTool />
		</ToolLayout>
	);
}
