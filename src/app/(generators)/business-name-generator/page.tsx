import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import TextGeneratorTool from "@/components/tools/generators/TextGeneratorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Business Name Generator",
	description: "Private Business Name: privately generate content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/business-name-generator",
	category: "generators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/business-name-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TextGeneratorTool />
		</ToolLayout>
	);
}
