import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import SitemapGeneratorTool from "@/components/tools/seo/SitemapGeneratorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Robots.txt and Sitemap Generator",
	description: "Private Robots.txt and Sitemap: privately generate website data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/robots-txt-sitemap-generator",
	category: "seo",
});

export default function ToolPage() {
	const tool = getToolByRoute("/robots-txt-sitemap-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<SitemapGeneratorTool />
		</ToolLayout>
	);
}
