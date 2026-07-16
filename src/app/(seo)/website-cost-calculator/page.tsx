import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import WebTools from "@/components/tools/impl/WebTools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Website Cost Calculator",
	description: "Private Website Cost Calculator: privately calculate website data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/website-cost-calculator",
	category: "seo",
});

export default function ToolPage() {
	const tool = getToolByRoute("/website-cost-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<WebTools defaultTab="cost" />
		</ToolLayout>
	);
}
