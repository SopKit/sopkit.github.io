import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import TwitterCardGenerator from "@/components/tools/built-ins/TwitterCardGenerator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Twitter Card Generator",
	description: "Private Twitter Card: privately generate website data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/twitter-card-generator",
	category: "seo",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/twitter-card-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TwitterCardGenerator />
		</ToolLayout>
	);
}
