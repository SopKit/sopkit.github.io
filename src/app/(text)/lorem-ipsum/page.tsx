import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import LoremIpsumGeneratorTool from "@/components/tools/generators/LoremIpsumGeneratorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Lorem Ipsum Generator",
	description: "Private Lorem Ipsum: privately generate text content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/lorem-ipsum",
	category: "text",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/lorem-ipsum");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<LoremIpsumGeneratorTool />
		</ToolLayout>
	);
}
