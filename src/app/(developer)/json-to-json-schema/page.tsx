import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import JSONToSchemaTool from "@/components/tools/developer/JSONToSchemaTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "JSON to JSON Schema",
	description: "Private JSON to JSON Schema: privately process code and data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/json-to-json-schema",
	category: "developer",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/json-to-json-schema");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<JSONToSchemaTool />
		</ToolLayout>
	);
}
