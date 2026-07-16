import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeMoneyCalculatorTool from "@/components/tools/youtube/YouTubeMoneyCalculatorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "YouTube Money Calculator",
	description: "Private YouTube Money Calculator: privately generate YouTube content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/youtube-money-calculator",
	category: "youtube",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-money-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeMoneyCalculatorTool />
		</ToolLayout>
	);
}
