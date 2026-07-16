import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import JSONMinifierTool from "@/components/tools/developer/JSONMinifierTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "JSON Minify",
	description: "Private JSON Minify: privately compress code and data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/json-minify",
	category: "developer",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/json-minify");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<JSONMinifierTool />
		</ToolLayout>
	);
}
