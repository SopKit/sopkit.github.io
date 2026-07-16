import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UuidGenerator from "@/components/tools/built-ins/UuidGeneratorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Random UUID Generator",
	description: "Private Random UUID: privately generate web data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/random-uuid-generator",
	category: "utilities",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/random-uuid-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UuidGenerator />
		</ToolLayout>
	);
}
