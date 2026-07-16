import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import WebTools from "@/components/tools/impl/WebTools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "SEO Title & Meta Description Generator",
	description: "Private SEO Title & Meta Description: privately generate website data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/seo-title-meta-description-generator",
	category: "seo",
});

export default function ToolPage() {
	const tool = getToolByRoute("/seo-title-meta-description-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<WebTools defaultTab="seo" />
		</ToolLayout>
	);
}
