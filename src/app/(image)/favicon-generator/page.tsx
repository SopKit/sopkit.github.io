import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import FaviconGeneratorTool from "@/components/tools/image/FaviconGeneratorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Favicon Generator",
	description: "Private Favicon: privately generate images entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/favicon-generator",
	category: "image",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/favicon-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FaviconGeneratorTool />
		</ToolLayout>
	);
}
