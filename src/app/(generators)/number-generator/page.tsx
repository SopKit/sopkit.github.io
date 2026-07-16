import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import NumberGeneratorTool from "@/components/tools/generators/NumberGeneratorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Number Generator",
	description: "Private Number: privately generate content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/number-generator",
	category: "generators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/number-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<NumberGeneratorTool />
		</ToolLayout>
	);
}
