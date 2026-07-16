import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import OpenGraphGenerator from "@/components/tools/built-ins/OpenGraphGenerator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Open Graph Generator",
	description: "Private Open Graph: privately generate website data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/open-graph-generator",
	category: "seo",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/open-graph-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<OpenGraphGenerator />
		</ToolLayout>
	);
}
